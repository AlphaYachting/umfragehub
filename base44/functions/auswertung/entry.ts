import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Auswertung für die Verwaltung (nur Admins): verdichtet die Antworten eines
// Projekts zu Kennzahlen je Bereich (= Welle) und je Zielgruppe.
//
// Rein lesend. Diese Funktion schreibt nichts und ändert weder Interview,
// Welle, Session noch Antwort. Sie gilt für jeden Interviewtyp (Team,
// Vertrieb, Positionierung, Kunden), weil sie nur mit Fragetypen rechnet.
//
// Anonymitätsregeln (hier, nicht in der Oberfläche):
// - nur abgeschlossene Interviews;
// - eine Welle zählt erst ab ihrer Mindestzahl;
// - eine Zahl je Frage erscheint nur, wenn mindestens so viele Personen sie
//   beantwortet haben, wie die Mindestzahl verlangt;
// - offene Antworten verlassen die Funktion nie, nur ihre Anzahl.

const SEITE = 200;
const NUMERISCH = new Set(['skala', 'schieberegler', 'gegensatzpaar', 'matrix']);
const EINIG_BIS = 0.6;        // Standardabweichung auf einer 0-4-Skala
const AUSEINANDER_AB = 1.2;
const ABWEICHUNG_AB = 1.0;    // ein Punkt auf einer 5er-Skala
const ZG_REIHE = { geschaeftsfuehrung: 0, mitarbeiter: 1, kunden: 2, partner: 3 };
// Kopfzahl „Stimmung“: zuerst die eigene Stimmungsfrage (Messkern ST7),
// sonst die Weiterempfehlung als Arbeitgeber.
const STIMMUNG = /(^|[_\s])(st7|stimmung|wie_gern)/i;
const WEITEREMPFEHLUNG = /weiterempfehl/i;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'nicht_berechtigt' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const projektId = String(body.projektId || '');
    if (!projektId) return Response.json({ error: 'projektId fehlt' }, { status: 400 });
    const db = base44.asServiceRole.entities;
    return Response.json(await berechnen(db, projektId));
  } catch (error) {
    console.error('auswertung:', error?.message || error);
    return Response.json({ error: 'serverfehler' }, { status: 500 });
  }
}

async function berechnen(db, projektId) {
  const projekt = await db.Projekt.get(projektId);
  const wellen = (await alle(db.Welle, { projektId }))
    .filter((w) => w.status === 'live' || w.status === 'geschlossen')
    .sort((a, b) =>
      (ZG_REIHE[a.zielgruppe] ?? 9) - (ZG_REIHE[b.zielgruppe] ?? 9) ||
      String(a.name || '').localeCompare(String(b.name || ''), 'de'));

  const jeWelle = await inGruppen(wellen, async (w) => {
    const [sessions, bloecke] = await Promise.all([
      alle(db.Session, { wellenId: w.id }),
      alle(db.Block, { wellenId: w.id }),
    ]);
    bloecke.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
    const fragenListen = await inGruppen(bloecke, (b) => alle(db.Frage, { blockId: b.id }), 6);
    const fragen = {};
    const reihe = {};
    let pos = 0;
    bloecke.forEach((b, i) => {
      const fs = [...fragenListen[i]].sort((x, y) => (x.reihenfolge ?? 0) - (y.reihenfolge ?? 0));
      for (const f of fs) {
        fragen[f.id] = { ...f, kapitel: kapitelTitel(b.titel), kapitelNr: i };
        reihe[f.id] = pos++;
      }
    });
    const fertig = sessions.filter((s) => s.status === 'abgeschlossen');
    const mindest = Number(w.mindestTeilnehmer ?? 6);
    const auswertbar = fertig.length >= mindest;
    const antworten = auswertbar ? await holeAntworten(db, fertig.map((s) => s.id)) : [];
    return { w, fertig: fertig.length, gestartet: sessions.length, mindest, auswertbar, fragen, reihe, antworten };
  }, 3);

  // -------------------------------------------------------------------------
  // Zahlenfragen: Werte je Item (Frage oder Matrixzeile) und Welle
  // -------------------------------------------------------------------------
  const items = new Map();
  for (const x of jeWelle) {
    if (!x.auswertbar) continue;
    for (const a of x.antworten) {
      const f = x.fragen[a.frageId];
      if (!f || !NUMERISCH.has(f.typ)) continue;
      const min = Number(f.skalaMin ?? 1);
      const max = Number(f.skalaMax ?? 5);
      if (!(max > min)) continue;
      const basis = f.schluessel || `id:${f.id}`;
      const eintragen = (key, wert, zeile) => {
        if (typeof wert !== 'number' || isNaN(wert)) return;
        let it = items.get(key);
        if (!it) {
          it = {
            key,
            schluessel: f.schluessel || '',
            auswertungstag: f.auswertungstag || '',
            frage: frageKurz(f.text, projekt),
            zeile: zeile ? zeile.text : '',
            kapitel: f.kapitel || '',
            sortierung: (ZG_REIHE[x.w.zielgruppe] ?? 9) * 100000 + (x.reihe[f.id] ?? 0) * 100 + (zeile ? zeile.nr : 0),
            typ: f.typ,
            min, max,
            links: f.skalaLabelLinks || '',
            rechts: f.skalaLabelRechts || '',
            nps: min === 0 && max === 10,
            roh: {},
          };
          items.set(key, it);
        }
        (it.roh[x.w.id] ||= []).push(wert);
      };
      if (f.typ === 'matrix') {
        const ids = Array.isArray(f.matrixZeilenIds) ? f.matrixZeilenIds : [];
        const texte = Array.isArray(f.matrixZeilen) ? f.matrixZeilen : [];
        for (const [zid, v] of Object.entries(a.matrixWerte || {})) {
          let i = ids.indexOf(zid);
          if (i < 0 && /^\d+$/.test(zid)) i = Number(zid);
          eintragen(`${basis}:${zid}`, v, { nr: i + 1, text: texte[i] || '' });
        }
      } else {
        eintragen(basis, a.zahl, null);
      }
    }
  }

  const wellenInfo = Object.fromEntries(jeWelle.map((x) => [x.w.id, x]));
  const gruppen = {};
  for (const x of jeWelle) {
    if (!x.auswertbar) continue;
    const zg = x.w.zielgruppe || 'mitarbeiter';
    (gruppen[zg] ||= { zielgruppe: zg, wellen: [], fertig: 0, mindest: 0 });
    gruppen[zg].wellen.push(x.w.id);
    gruppen[zg].fertig += x.fertig;
    gruppen[zg].mindest = Math.max(gruppen[zg].mindest, x.mindest);
  }

  const itemListe = [...items.values()].sort((a, b) => a.sortierung - b.sortierung).map((it) => {
    const jeWelleWerte = {};
    for (const [wid, v] of Object.entries(it.roh) as [string, number[]][]) {
      if (v.length >= wellenInfo[wid].mindest) jeWelleWerte[wid] = kennzahlen(v, it);
    }
    const jeGruppe = {};
    for (const g of Object.values(gruppen) as any[]) {
      const v = g.wellen.flatMap((wid) => it.roh[wid] || []);
      if (v.length && v.length >= g.mindest) jeGruppe[g.zielgruppe] = kennzahlen(v, it);
    }
    const { roh: _r, sortierung: _s, ...rest } = it;
    return { ...rest, jeWelle: jeWelleWerte, jeGruppe };
  }).filter((it) => Object.keys(it.jeWelle).length || Object.keys(it.jeGruppe).length);

  // Kopfzahl Stimmung: nur Team (Zielgruppe mitarbeiter)
  const teamItems = itemListe.filter((it) => it.jeGruppe.mitarbeiter);
  let stimmung = null;
  const eigene = teamItems.find((it) => STIMMUNG.test(it.schluessel) || STIMMUNG.test(it.auswertungstag));
  if (eigene) stimmung = { key: eigene.key, quelle: 'stimmung' };
  else {
    const we = teamItems.find((it) =>
      WEITEREMPFEHLUNG.test(it.schluessel) && /arbeitgeber/i.test(it.frage));
    if (we) stimmung = { key: we.key, quelle: 'weiterempfehlung' };
  }

  // Führung gegen Team: gleiche Fragen in beiden Gruppen
  const vergleich = [];
  if (gruppen.geschaeftsfuehrung && gruppen.mitarbeiter) {
    for (const it of itemListe) {
      const a = it.jeGruppe.geschaeftsfuehrung;
      const b = it.jeGruppe.mitarbeiter;
      if (!a || !b) continue;
      vergleich.push({ key: it.key, fuehrung: a.norm, team: b.norm, abstand: Math.abs(a.norm - b.norm), deutlich: Math.abs(a.norm - b.norm) >= ABWEICHUNG_AB });
    }
    vergleich.sort((x, y) => y.abstand - x.abstand);
  }

  // -------------------------------------------------------------------------
  // Offene Antworten: nur Mengen, nie Inhalte
  // -------------------------------------------------------------------------
  const freitext = { kapitel: [], fragen: [], beantwortet: {} };
  const kap = new Map();
  const fr = new Map();
  for (const x of jeWelle) {
    if (!x.auswertbar) continue;
    const personen = new Set();
    for (const a of x.antworten) {
      const f = x.fragen[a.frageId];
      if (!f || f.typ !== 'freitext') continue;
      const t = String(a.text || '').trim();
      if (!t || /^[\/\-.\s]+$/.test(t)) continue;
      personen.add(a.sessionId);
      const kName = f.kapitel || 'Ohne Kapitel';
      const k = kap.get(kName) || { name: kName, nr: (ZG_REIHE[x.w.zielgruppe] ?? 9) * 1000 + f.kapitelNr, jeWelle: {}, gesamt: 0 };
      k.jeWelle[x.w.id] = (k.jeWelle[x.w.id] || 0) + 1;
      k.gesamt++;
      kap.set(kName, k);
      const fKey = f.schluessel || `id:${f.id}`;
      const q = fr.get(fKey) || { key: fKey, frage: frageKurz(f.text, projekt), kapitel: kName, jeWelle: {}, gesamt: 0 };
      q.jeWelle[x.w.id] = (q.jeWelle[x.w.id] || 0) + 1;
      q.gesamt++;
      fr.set(fKey, q);
    }
    freitext.beantwortet[x.w.id] = personen.size;
  }
  freitext.kapitel = [...kap.values()].sort((a, b) => a.nr - b.nr).map(({ nr: _n, ...k }) => k);
  freitext.fragen = [...fr.values()];

  return {
    projekt: { id: projekt.id, name: projekt.name, kundenname: projekt.kundenname || '' },
    stand: new Date().toISOString(),
    wellen: jeWelle.map((x) => ({
      id: x.w.id, name: x.w.name || '', zielgruppe: x.w.zielgruppe || 'mitarbeiter', status: x.w.status,
      fertig: x.fertig, gestartet: x.gestartet, mindest: x.mindest, auswertbar: x.auswertbar,
    })),
    gruppen: Object.values(gruppen).sort((a: any, b: any) => (ZG_REIHE[a.zielgruppe] ?? 9) - (ZG_REIHE[b.zielgruppe] ?? 9)),
    items: itemListe,
    stimmung,
    vergleich,
    freitext,
    regeln: { einigBis: EINIG_BIS, auseinanderAb: AUSEINANDER_AB, abweichungAb: ABWEICHUNG_AB },
  };
}

// Kennzahlen einer Wertereihe. norm = Schnitt auf 0 bis 4 umgerechnet.
function kennzahlen(v, it) {
  const n = v.length;
  const m = mittel(v);
  const norm = ((m - it.min) / (it.max - it.min)) * 4;
  const sd = standardabweichung(v.map((x) => ((x - it.min) / (it.max - it.min)) * 4));
  // Drei Bänder: bei 0 bis 10 wie üblich 0-6 / 7-8 / 9-10, sonst Drittel der Skala
  let unten = 0, mitte = 0, oben = 0;
  for (const x of v) {
    if (it.nps) {
      if (x <= 6) unten++; else if (x <= 8) mitte++; else oben++;
    } else {
      const z = ((x - it.min) / (it.max - it.min)) * 4;
      if (z <= 4 / 3 + 1e-9) unten++; else if (z >= 8 / 3 - 1e-9) oben++; else mitte++;
    }
  }
  const out: Record<string, unknown> = {
    n,
    mittel: runden(m, 1),
    norm: runden(norm, 2),
    sd: runden(sd, 2),
    baender: [unten, mitte, oben],
    einigkeit: n >= 2 ? (sd <= EINIG_BIS ? 'einig' : sd >= AUSEINANDER_AB ? 'auseinander' : null) : null,
  };
  // Verteilung je Stufe nur bei ganzzahligen Skalen mit höchstens 11 Stufen
  if (Number.isInteger(it.min) && Number.isInteger(it.max) && it.max - it.min <= 10 && v.every(Number.isInteger)) {
    const vert = new Array(it.max - it.min + 1).fill(0);
    for (const x of v) vert[x - it.min]++;
    out.verteilung = vert;
  }
  return out;
}

function runden(x, stellen) {
  const f = 10 ** stellen;
  return Math.round(x * f) / f;
}

function mittel(v) {
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function standardabweichung(v) {
  const m = mittel(v);
  return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length);
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

const SIE_FORM = { du: 'Sie', dir: 'Ihnen', dich: 'sich', dein: 'Ihr', deine: 'Ihre', deinen: 'Ihren', deinem: 'Ihrem', deiner: 'Ihrer', deines: 'Ihres' };
function frageKurz(text, projekt) {
  const sie = projekt?.ansprache === 'sie';
  return String(text || '')
    .replace(/\{\{\s*firma\s*\}\}/gi, projekt?.kundenname || 'das Unternehmen')
    .replace(/\{\{([^}|]+)\|([^}]+)\}\}/g, (_, du, s2) => (sie ? s2 : du))
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (_, w) => (sie ? (SIE_FORM[w.toLowerCase()] || w) : w))
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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
