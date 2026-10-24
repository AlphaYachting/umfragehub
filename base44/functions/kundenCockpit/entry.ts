import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Kunden-Cockpit: öffentliche Schnittstelle für den Auftraggeber eines Projekts.
// Läuft als Service-Rolle, Zugang nur über Link-Code plus Passwort (Entität
// Kundenzugang). Liefert ausschließlich Zählwerte und gesammelte Zeiten —
// nie eine Antwort, nie einen Session-Token, nie eine E-Mail-Adresse.
//
// Anonymitätsregeln (bewusst hier und nicht in der Oberfläche):
// - Bereiche: nur im Modus „persönlicher Link“, Bereiche unter der Mindestzahl
//   werden zusammengefasst, so dass sich kein kleiner Bereich herausrechnen lässt.
// - Zeiten und Textmengen: nur über alle Gruppen gesammelt und erst ab 6 fertigen Interviews.
// - Signale: erst wenn alle Wellen geschlossen sind, nur Wellen ab Mindestzahl,
//   Themen werden nicht genannt (außer Kapitelnamen bei der Textmenge).

const TZ = 'Europe/Vienna';
const MAX_FEHLVERSUCHE = 5;
const SPERRE_MINUTEN = 15;
const MINDEST_GESAMT = 6;
const SEITE = 200;
const MODULE = {
  team: 'Teambefragung',
  vertrieb: 'Vertriebsbefragung',
  kunden: 'Kundenbefragung',
  positionierung: 'Positionierung',
  wiederholung: 'Wiederholung in 12 Monaten',
};
const ZG_REIHE = { geschaeftsfuehrung: 0, mitarbeiter: 1, kunden: 2, partner: 3 };

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities;
    const body = await req.json();
    if (body.aktion === 'laden') return Response.json(await laden(db, body));
    if (body.aktion === 'interesse') return Response.json(await interesse(db, body));
    return Response.json({ error: 'unbekannt' });
  } catch (error) {
    console.error('kundenCockpit:', error?.message || error);
    return Response.json({ error: 'serverfehler' });
  }
}

// ---------------------------------------------------------------------------
// Zugang prüfen
// ---------------------------------------------------------------------------
async function pruefen(db, { code, passwort }) {
  const c = String(code || '').trim();
  if (!/^[A-Za-z0-9]{10,64}$/.test(c)) return { fehler: 'zugang' };
  const liste = await db.Kundenzugang.filter({ code: c });
  const z = liste && liste[0];
  if (!z || z.aktiv === false) return { fehler: 'zugang' };

  const jetzt = Date.now();
  const gesperrt = alsDatum(z.gesperrtBis);
  if (gesperrt && gesperrt.getTime() > jetzt) {
    return { fehler: 'gesperrt', minuten: Math.ceil((gesperrt.getTime() - jetzt) / 60000) };
  }
  if (!z.passwort || !gleich(String(passwort || '').trim(), String(z.passwort).trim())) {
    const n = (z.fehlversuche || 0) + 1;
    if (n >= MAX_FEHLVERSUCHE) {
      await db.Kundenzugang.update(z.id, {
        fehlversuche: 0,
        gesperrtBis: new Date(jetzt + SPERRE_MINUTEN * 60000).toISOString(),
      });
      return { fehler: 'gesperrt', minuten: SPERRE_MINUTEN };
    }
    await db.Kundenzugang.update(z.id, { fehlversuche: n });
    return { fehler: 'passwort' };
  }
  return { zugang: z };
}

// Vergleich ohne frühen Abbruch
function gleich(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------
async function laden(db, body) {
  const p = await pruefen(db, body);
  if (p.fehler) return { error: p.fehler, minuten: p.minuten };
  const z = p.zugang;

  const aenderung: Record<string, unknown> = {};
  if (z.fehlversuche) aenderung.fehlversuche = 0;
  if (body.zaehlen) {
    aenderung.aufrufe = (z.aufrufe || 0) + 1;
    aenderung.zuletztGeoeffnet = new Date().toISOString();
  }
  if (Object.keys(aenderung).length) await db.Kundenzugang.update(z.id, aenderung);

  const projekt = await db.Projekt.get(z.projektId);
  const wellen = (await alle(db.Welle, { projektId: z.projektId }))
    .filter((w) => w.status === 'live' || w.status === 'geschlossen')
    .sort((a, b) =>
      (ZG_REIHE[a.zielgruppe] ?? 9) - (ZG_REIHE[b.zielgruppe] ?? 9) ||
      String(a.created_date).localeCompare(String(b.created_date)));

  const jeWelle = await inGruppen(wellen, async (w) => {
    const [sessions, versand, empfaenger] = await Promise.all([
      alle(db.Session, { wellenId: w.id }),
      alle(db.Versand, { wellenId: w.id }),
      w.einladungsModus === 'persoenlich' ? alle(db.Empfaenger, { wellenId: w.id }) : Promise.resolve([]),
    ]);
    return { w, sessions, versand, empfaenger };
  }, 4);

  const anzeigen = Object.assign(
    { bereiche: true, verlauf: true, zeiten: true, ablauf: true, module: true, signale: true },
    z.anzeigen || {},
  );
  const phase = wellen.length && wellen.every((w) => w.status === 'geschlossen') ? 'abgeschlossen' : 'laeuft';

  // Gruppen
  const gruppen = jeWelle.map(({ w, sessions, empfaenger }) => {
    const fertig = sessions.filter((s) => s.status === 'abgeschlossen').length;
    const mindest = Number(w.mindestTeilnehmer ?? 6);
    const eingeladen = Number(w.eingeladen) > 0 ? Number(w.eingeladen) : (empfaenger.length || null);
    let letzte = null;
    for (const s of sessions) {
      const d = alsDatum(s.completedAt);
      if (d && (!letzte || d > letzte)) letzte = d;
    }
    return {
      name: w.name || '',
      zielgruppe: w.zielgruppe || 'mitarbeiter',
      status: w.status,
      endetAm: w.endetAm ? String(w.endetAm).slice(0, 10) : null,
      geschlossenSeit: w.status === 'geschlossen' && letzte ? tagSchluessel(letzte) : null,
      mindest,
      eingeladen,
      fertig,
      begonnen: sessions.length - fertig,
      schwelle: fertig >= mindest,
    };
  });

  const alleSessions = jeWelle.flatMap((x) => x.sessions);
  const fertige = alleSessions.filter((s) => s.status === 'abgeschlossen');

  // Kennzahlen oben
  const dauern = fertige.map(dauerMinuten).filter((x) => x !== null);
  const minutenGesamt = Math.round(dauern.reduce((a, d) => a + Math.min(d, 60), 0));
  const laufende = gruppen.filter((g) => g.status === 'live' && g.endetAm);
  let naechstesEnde = null;
  for (const g of laufende) if (!naechstesEnde || g.endetAm < naechstesEnde.endetAm) naechstesEnde = g;

  const kennzahlen = {
    fertig: fertige.length,
    begonnen: alleSessions.length - fertige.length,
    minutenGesamt: fertige.length >= MINDEST_GESAMT ? minutenGesamt : null,
    ende: naechstesEnde ? { datum: naechstesEnde.endetAm, zielgruppe: naechstesEnde.zielgruppe, tage: tageBis(naechstesEnde.endetAm) } : null,
  };

  // Bereiche
  const bereiche = anzeigen.bereiche ? bereicheBerechnen(jeWelle) : null;

  // Verlauf
  const verlauf = anzeigen.verlauf ? verlaufBerechnen(jeWelle) : null;

  // Zeiten (nur gesammelt, erst ab MINDEST_GESAMT)
  const zeiten = anzeigen.zeiten && fertige.length >= MINDEST_GESAMT ? zeitenBerechnen(fertige, jeWelle) : null;

  // Antworten nur für Zählwerte (Textmenge, Signale) — verlassen den Server nie
  let tiefe = null;
  let signale = null;
  if (fertige.length >= MINDEST_GESAMT) {
    const antworten = await holeAntworten(db, fertige.map((s) => s.id));
    tiefe = tiefeBerechnen(antworten);
    if (phase === 'abgeschlossen' && anzeigen.signale) {
      signale = await signaleBerechnen(db, jeWelle, antworten);
    }
  }

  return {
    stand: new Date().toISOString(),
    phase,
    anzeigen,
    projekt: {
      name: projekt?.name || '',
      firma: projekt?.kundenname || '',
      ansprache: projekt?.ansprache || 'du',
    },
    termine: {
      analyseAb: z.analyseAb || '',
      workshop: z.workshopTermin || '',
      kommunikationAb: z.kommunikationAb || '',
    },
    interesse: (z.interesse || []).map((i) => i.modul),
    kennzahlen,
    gruppen,
    bereiche,
    verlauf,
    zeiten,
    tiefe,
    signale,
  };
}

// ---------------------------------------------------------------------------
// Bereiche (persönlicher Link): Anteil „hat begonnen“ je Abteilung
// ---------------------------------------------------------------------------
function bereicheBerechnen(jeWelle) {
  const kandidaten = jeWelle.filter((x) => x.empfaenger.length > 0);
  if (!kandidaten.length) return null;
  // Größte Welle mit persönlichen Links, bevorzugt das Team
  kandidaten.sort((a, b) =>
    (a.w.zielgruppe === 'mitarbeiter' ? -1 : 0) - (b.w.zielgruppe === 'mitarbeiter' ? -1 : 0) ||
    b.empfaenger.length - a.empfaenger.length);
  const { w, empfaenger } = kandidaten[0];
  const schwelle = Math.max(5, Number(w.mindestTeilnehmer ?? 6));

  const map = new Map();
  for (const e of empfaenger) {
    const name = String(e.abteilung || '').trim() || 'Ohne Angabe';
    const g = map.get(name) || { name, gesamt: 0, begonnen: 0 };
    g.gesamt++;
    if (e.gestartet) g.begonnen++;
    map.set(name, g);
  }
  let gross = [...map.values()].filter((g) => g.gesamt >= schwelle).sort((a, b) => b.gesamt - a.gesamt);
  const rest = { name: 'Weitere Bereiche, zusammengefasst', gesamt: 0, begonnen: 0, zusammen: true };
  for (const g of map.values()) if (g.gesamt < schwelle) { rest.gesamt += g.gesamt; rest.begonnen += g.begonnen; }
  // Ist der Rest zu klein, wandert der kleinste sichtbare Bereich dazu —
  // sonst ließe er sich aus der Gesamtzahl herausrechnen.
  while (rest.gesamt > 0 && rest.gesamt < schwelle && gross.length) {
    const k = gross.pop();
    rest.gesamt += k.gesamt;
    rest.begonnen += k.begonnen;
  }
  const zeilen = [...gross];
  if (rest.gesamt > 0) zeilen.push(rest);
  if (zeilen.length < 2) return null;
  return {
    zielgruppe: w.zielgruppe,
    schwelle,
    zeilen: zeilen.map((g) => ({ name: g.name, gesamt: g.gesamt, begonnen: g.begonnen, zusammen: !!g.zusammen })),
  };
}

// ---------------------------------------------------------------------------
// Verlauf: fertige Interviews je Tag, Einladungen und Erinnerungen
// ---------------------------------------------------------------------------
function verlaufBerechnen(jeWelle) {
  const neu = {};
  const ereignisse = {};
  let frueh = null;
  for (const { sessions, versand } of jeWelle) {
    for (const s of sessions) {
      const a = alsDatum(s.startedAt || s.created_date);
      if (a && (!frueh || a < frueh)) frueh = a;
      if (s.status !== 'abgeschlossen') continue;
      const e = alsDatum(s.completedAt);
      if (e) neu[tagSchluessel(e)] = (neu[tagSchluessel(e)] || 0) + 1;
    }
    for (const v of versand) {
      if (v.art !== 'einladung' && v.art !== 'reminder') continue;
      if (v.kanal === 'probelauf' || !(Number(v.erfolgreich) > 0)) continue;
      const d = alsDatum(v.created_date);
      if (!d) continue;
      const k = tagSchluessel(d);
      if (!frueh || d < frueh) frueh = d;
      // Einladung hat Vorrang vor Erinnerung am selben Tag
      if (ereignisse[k] !== 'einladung') ereignisse[k] = v.art;
    }
  }
  if (!frueh) return null;

  const heute = tagSchluessel(new Date());
  let tage = [];
  for (let k = tagSchluessel(frueh); k <= heute; k = naechsterTag(k)) tage.push(k);
  let vorher = 0;
  if (tage.length > 42) {
    const weg = tage.slice(0, tage.length - 42);
    for (const k of weg) vorher += neu[k] || 0;
    tage = tage.slice(-42);
  }
  let summe = vorher;
  const out = tage.map((k) => {
    summe += neu[k] || 0;
    return {
      datum: k,
      neu: neu[k] || 0,
      gesamt: summe,
      wt: wochentagKurz(k),
      ereignis: ereignisse[k] === 'einladung' ? 'Einladung' : ereignisse[k] === 'reminder' ? 'Erinnerung' : null,
    };
  });

  // Schub nach Erinnerungen: fertige Interviews am Tag der Erinnerung und am Tag danach
  const schuebe = [];
  out.forEach((t, i) => {
    if (t.ereignis !== 'Erinnerung') return;
    schuebe.push({ datum: t.datum, anzahl: t.neu + (out[i + 1]?.neu || 0) });
  });
  return { tage: out, vorher, schuebe };
}

// ---------------------------------------------------------------------------
// Zeiten
// ---------------------------------------------------------------------------
const TAGESZEITEN = [
  { name: 'Früh', zeit: '6 bis 9 Uhr', von: 6, bis: 9 },
  { name: 'Vormittag', zeit: '9 bis 12 Uhr', von: 9, bis: 12 },
  { name: 'Mittag', zeit: '12 bis 14 Uhr', von: 12, bis: 14 },
  { name: 'Nachmittag', zeit: '14 bis 17 Uhr', von: 14, bis: 17 },
  { name: 'Abend', zeit: '17 bis 22 Uhr', von: 17, bis: 22 },
  { name: 'Nacht', zeit: '22 bis 6 Uhr', von: 22, bis: 30 },
];
const WT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function zeitenBerechnen(fertige, jeWelle) {
  const tz = TAGESZEITEN.map((t) => ({ name: t.name, zeit: t.zeit, n: 0 }));
  const wt = WT.map((name) => ({ name, n: 0 }));
  for (const s of fertige) {
    const d = alsDatum(s.completedAt);
    if (!d) continue;
    const t = teile(d);
    const h = t.stunde < 6 ? t.stunde + 24 : t.stunde;
    const i = TAGESZEITEN.findIndex((b) => h >= b.von && h < b.bis);
    if (i >= 0) tz[i].n++;
    wt[t.wochentag].n++;
  }
  const dauern = fertige.map(dauerMinuten).filter((x) => x !== null && x > 0);
  const geplant = jeWelle
    .map(({ w }) => Number(w.geschaetzteDauerMinuten))
    .filter((x) => x > 0);
  return {
    tageszeiten: tz,
    wochentage: wt,
    dauerMedian: dauern.length ? Math.round(median(dauern)) : null,
    dauerGeplant: geplant.length ? Math.round(median(geplant)) : null,
  };
}

// ---------------------------------------------------------------------------
// Textmenge
// ---------------------------------------------------------------------------
function tiefeBerechnen(antworten) {
  let offene = 0;
  let woerter = 0;
  let gesprochen = 0;
  for (const a of antworten) {
    const t = String(a.text || '').trim();
    if (!t) continue;
    offene++;
    woerter += woerterZaehlen(t);
    if (a.eingabeart === 'sprache') gesprochen++;
  }
  return {
    offeneAntworten: offene,
    woerter,
    anteilGesprochen: offene ? Math.round((gesprochen / offene) * 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Signale (nur nach Abschluss aller Wellen)
// ---------------------------------------------------------------------------
const NUMERISCH = new Set(['skala', 'schieberegler', 'gegensatzpaar', 'matrix']);
const EINIG_BIS = 0.6;          // Standardabweichung auf einer 0-4-Skala
const AUSEINANDER_AB = 1.2;
const ABWEICHUNG_AB = 1.0;      // Mittelwertabstand: ein Punkt auf einer 5er-Skala

async function signaleBerechnen(db, jeWelle, antworten) {
  const antwortenJeSession = {};
  for (const a of antworten) (antwortenJeSession[a.sessionId] ||= []).push(a);

  // Fragen und Kapitel je Welle
  const proWelle = await inGruppen(jeWelle, async ({ w, sessions }) => {
    const bloecke = await alle(db.Block, { wellenId: w.id });
    const fragenListen = await inGruppen(bloecke, (b) => alle(db.Frage, { blockId: b.id }), 6);
    const fragen = {};
    bloecke.forEach((b, i) => {
      for (const f of fragenListen[i]) fragen[f.id] = { ...f, kapitel: kapitelTitel(b.titel) };
    });
    const fertig = sessions.filter((s) => s.status === 'abgeschlossen');
    const mindest = Number(w.mindestTeilnehmer ?? 6);
    // Werte je Item (Frage oder Matrixzeile), auf 0 bis 4 umgerechnet
    const werte = {};
    for (const s of fertig) {
      for (const a of antwortenJeSession[s.id] || []) {
        const f = fragen[a.frageId];
        if (!f || !NUMERISCH.has(f.typ)) continue;
        const min = Number(f.skalaMin ?? 1);
        const max = Number(f.skalaMax ?? 5);
        if (!(max > min)) continue;
        const norm = (v) => ((Number(v) - min) / (max - min)) * 4;
        const basis = f.schluessel || f.id;
        if (f.typ === 'matrix') {
          const ids = f.matrixZeilenIds || [];
          for (const [k, v] of Object.entries(a.matrixWerte || {})) {
            if (typeof v !== 'number') continue;
            const idx = ids.indexOf(k);
            const zid = idx >= 0 ? k : k;
            (werte[`${basis}:${zid}`] ||= []).push(norm(v));
          }
        } else if (typeof a.zahl === 'number') {
          (werte[basis] ||= []).push(norm(a.zahl));
        }
      }
    }
    return { w, mindest, fertig: fertig.length, fragen, werte };
  }, 3);

  const auswertbar = proWelle.filter((x) => x.fertig >= x.mindest);
  if (!auswertbar.length) return null;

  // 1) Einigkeit: bevorzugt das Team, sonst die größte Welle
  const basis = [...auswertbar].sort((a, b) =>
    (a.w.zielgruppe === 'mitarbeiter' ? -1 : 0) - (b.w.zielgruppe === 'mitarbeiter' ? -1 : 0) || b.fertig - a.fertig)[0];
  const items = Object.values(basis.werte)
    .filter((v) => v.length >= basis.mindest)
    .map((v) => ({ sd: standardabweichung(v), v }));
  const einig = items.filter((i) => i.sd <= EINIG_BIS).sort((a, b) => a.sd - b.sd);
  const auseinander = items.filter((i) => i.sd >= AUSEINANDER_AB).sort((a, b) => b.sd - a.sd);
  const punkte = (v) => dezile(v).map((x) => Math.round((x / 4) * 100));
  const einigkeit = {
    zielgruppe: basis.w.zielgruppe,
    einig: einig.length,
    auseinander: auseinander.length,
    reihen: [
      ...einig.slice(0, 4).map((i) => ({ weit: false, punkte: punkte(i.v) })),
      ...auseinander.slice(0, 2).map((i) => ({ weit: true, punkte: punkte(i.v) })),
    ],
  };

  // 2) Selbstbild und Fremdbild: gleiche Fragenschlüssel in verschiedenen Gruppen
  const nachGruppe = {};
  for (const x of auswertbar) {
    if (!nachGruppe[x.w.zielgruppe] || x.fertig > nachGruppe[x.w.zielgruppe].fertig) nachGruppe[x.w.zielgruppe] = x;
  }
  const PAARE = [['geschaeftsfuehrung', 'mitarbeiter'], ['mitarbeiter', 'kunden'], ['geschaeftsfuehrung', 'kunden'], ['mitarbeiter', 'partner']];
  const paare = [];
  const beispiele = [];
  for (const [a, b] of PAARE) {
    const A = nachGruppe[a];
    const B = nachGruppe[b];
    if (!A || !B) continue;
    let anzahl = 0;
    let verglichen = 0;
    for (const [k, va] of Object.entries(A.werte)) {
      const vb = B.werte[k];
      if (!vb || va.length < A.mindest || vb.length < B.mindest) continue;
      verglichen++;
      const ma = mittel(va);
      const mb = mittel(vb);
      if (Math.abs(ma - mb) >= ABWEICHUNG_AB) {
        anzahl++;
        beispiele.push({ a, b, xa: Math.round((ma / 4) * 100), xb: Math.round((mb / 4) * 100), abstand: Math.abs(ma - mb) });
      }
    }
    if (verglichen > 0) paare.push({ a, b, anzahl, verglichen });
  }
  beispiele.sort((x, y) => y.abstand - x.abstand);

  // 3) Textmenge je Kapitel: Wörter je offener Antwort im Verhältnis zum Schnitt
  const kap = new Map();
  let wSumme = 0;
  let nSumme = 0;
  for (const x of auswertbar) {
    for (const s of jeWelle.find((j) => j.w.id === x.w.id).sessions) {
      if (s.status !== 'abgeschlossen') continue;
      for (const a of antwortenJeSession[s.id] || []) {
        const t = String(a.text || '').trim();
        const f = x.fragen[a.frageId];
        if (!t || !f || !f.kapitel) continue;
        const n = woerterZaehlen(t);
        const k = kap.get(f.kapitel) || { name: f.kapitel, woerter: 0, antworten: 0 };
        k.woerter += n;
        k.antworten++;
        kap.set(f.kapitel, k);
        wSumme += n;
        nSumme++;
      }
    }
  }
  const schnitt = nSumme ? wSumme / nSumme : 0;
  const kapitel = [...kap.values()]
    .filter((k) => k.antworten >= MINDEST_GESAMT && schnitt > 0)
    .map((k) => ({ name: k.name, faktor: Math.round(((k.woerter / k.antworten) / schnitt) * 10) / 10, antworten: k.antworten }))
    .sort((a, b) => b.antworten - a.antworten)
    .slice(0, 6);
  const spitze = kapitel.reduce((m, k) => (!m || k.faktor > m.faktor ? k : m), null);

  const anzahl =
    einigkeit.einig + einigkeit.auseinander +
    paare.reduce((s, p) => s + p.anzahl, 0) +
    (spitze && spitze.faktor >= 1.5 ? 1 : 0);

  return {
    anzahl,
    einigkeit: items.length ? einigkeit : null,
    abweichungen: paare.length ? { paare, beispiele: beispiele.slice(0, 5).map(({ a, b, xa, xb }) => ({ a, b, xa, xb })) } : null,
    intensitaet: kapitel.length >= 2 ? { kapitel, spitze } : null,
  };
}

// ---------------------------------------------------------------------------
// Interesse vormerken
// ---------------------------------------------------------------------------
async function interesse(db, body) {
  const p = await pruefen(db, body);
  if (p.fehler) return { error: p.fehler, minuten: p.minuten };
  const z = p.zugang;
  const modul = String(body.modul || '');
  if (!MODULE[modul]) return { error: 'modul' };
  const liste = z.interesse || [];
  if (!liste.some((i) => i.modul === modul)) {
    liste.push({ modul, am: new Date().toISOString() });
    await db.Kundenzugang.update(z.id, { interesse: liste });
    const projekt = await db.Projekt.get(z.projektId);
    await meldungSenden(projekt, MODULE[modul]).catch((e) => console.error('kundenCockpit Mail:', e?.message || e));
  }
  return { ok: true, interesse: liste.map((i) => i.modul) };
}

async function meldungSenden(projekt, modulName) {
  const key = env('BREVO_API_KEY');
  const absender = env('MAIL_ABSENDER');
  if (!key || !absender) return;
  const an = env('KUNDENCOCKPIT_MAIL') || 'office@rittler.co';
  const firma = projekt?.kundenname || projekt?.name || 'Ein Kunde';
  const betreff = `andi fragt.: ${firma} interessiert sich für ${modulName}`;
  const text = `${firma} hat im Kunden-Cockpit (Projekt „${projekt?.name || ''}“) Interesse an „${modulName}“ vorgemerkt.\n\nBitte zeitnah melden.`;
  const m = /^\s*"?(.*?)"?\s*<([^>]+)>\s*$/.exec(absender);
  const sender = m && m[1] ? { name: m[1].trim(), email: m[2].trim() } : { email: (m ? m[2] : absender).trim() };
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender,
      to: [{ email: an }],
      subject: betreff,
      textContent: text,
      htmlContent: `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`,
      tags: ['umfragehub', 'kundencockpit'],
    }),
  });
}

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
function env(name) {
  try {
    return (Deno.env.get(name) || '').trim().replace(/^["']+|["']+$/g, '').trim();
  } catch (_e) {
    return '';
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function alle(entitaet, query, sort = 'created_date') {
  const out = [];
  for (let seite = 0; seite < 50; seite++) {
    const teil = await entitaet.filter(query, sort, SEITE, out.length);
    if (!teil || teil.length === 0) break;
    out.push(...teil);
    if (teil.length < SEITE) break;
  }
  return out;
}

async function inGruppen(liste, fn, gleichzeitig = 6) {
  const out = new Array(liste.length);
  for (let i = 0; i < liste.length; i += gleichzeitig) {
    const teil = liste.slice(i, i + gleichzeitig);
    const erg = await Promise.all(teil.map((x, j) => fn(x, i + j)));
    erg.forEach((r, j) => { out[i + j] = r; });
  }
  return out;
}

// Antworten vieler Sessions: zuerst gebündelt mit $in, sonst je Session
async function holeAntworten(db, sessionIds) {
  const out = [];
  try {
    for (let i = 0; i < sessionIds.length; i += 40) {
      out.push(...await alle(db.Antwort, { sessionId: { $in: sessionIds.slice(i, i + 40) } }));
    }
    return out;
  } catch (_e) {
    const listen = await inGruppen(sessionIds, (id) => alle(db.Antwort, { sessionId: id }), 8);
    return listen.flat();
  }
}

// Base44 liefert created_date als UTC ohne Zeitzonen-Suffix
function alsDatum(iso) {
  if (!iso) return null;
  let s = String(iso);
  if (/T\d/.test(s) && !/(Z|[+-]\d{2}:?\d{2})$/.test(s)) s += 'Z';
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

const FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23', weekday: 'short',
});
const WT_EN = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function teile(d) {
  const t = {};
  for (const p of FMT.formatToParts(d)) t[p.type] = p.value;
  return {
    schluessel: `${t.year}-${t.month}-${t.day}`,
    stunde: Number(t.hour) % 24,
    wochentag: WT_EN[t.weekday] ?? 0,
  };
}

function tagSchluessel(d) {
  return teile(d).schluessel;
}

function naechsterTag(k) {
  const d = new Date(`${k}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function wochentagKurz(k) {
  const d = new Date(`${k}T12:00:00Z`);
  return WT[(d.getUTCDay() + 6) % 7];
}

function tageBis(k) {
  const heute = new Date(`${tagSchluessel(new Date())}T12:00:00Z`);
  const ziel = new Date(`${k}T12:00:00Z`);
  return Math.round((ziel.getTime() - heute.getTime()) / 86400000);
}

function dauerMinuten(s) {
  const a = alsDatum(s.startedAt);
  const e = alsDatum(s.completedAt);
  return a && e && e > a ? (e.getTime() - a.getTime()) / 60000 : null;
}

function median(werte) {
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mittel(v) {
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function standardabweichung(v) {
  const m = mittel(v);
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);
}

// Zehn Lagewerte statt Einzelwerten — zeigt die Form der Verteilung, keine Person
function dezile(v) {
  const s = [...v].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < 10; i++) {
    const pos = ((i + 0.5) / 10) * (s.length - 1);
    const u = Math.floor(pos);
    const o = Math.min(s.length - 1, u + 1);
    out.push(s[u] + (s[o] - s[u]) * (pos - u));
  }
  return out;
}

function woerterZaehlen(t) {
  return String(t).split(/\s+/).filter(Boolean).length;
}

function kapitelTitel(titel) {
  if (!titel) return '';
  const roh = String(titel).trim();
  const bereinigt = roh
    .replace(/^Adaption\s+[A-Z]{1,2}\d+\s+/, '')
    .replace(/^(?:MA\s+)?Kapitel\s+\d+\s*[·:–—-]\s*/, '')
    .replace(/^Kern\s+nachgestellt\s*[·:–—-]\s*/, '')
    .trim();
  return bereinigt || roh;
}
