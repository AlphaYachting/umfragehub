// Geteilte Logik für die Verwaltung (Projektübersicht, Projektseite, Wellen-Dashboard):
// Daten in einem Rutsch laden, Kennzahlen je Welle, Verlauf je Tag, Links, Duplizieren, Löschen.
//
// Anonymität: Hier werden ausschließlich Session-Metadaten gezählt (gestartet,
// abgeschlossen, Tag). Antworten kommen weiterhin nur über die Funktion
// "rohdaten" und erst ab der Mindestteilnehmerzahl.

import { base44 } from "@/api/base44Client";
import { generiereToken, frageFelderAuslesen } from "@/lib/interview";

export const WELLE_STATUS = {
  entwurf: { label: "Entwurf", klasse: "bg-slate-100 text-slate-700", punkt: "bg-slate-400" },
  live: { label: "Live", klasse: "bg-green-100 text-green-800", punkt: "bg-green-500" },
  geschlossen: { label: "Geschlossen", klasse: "bg-amber-100 text-amber-800", punkt: "bg-amber-500" },
};

export const PROJEKT_STATUS = {
  entwurf: { label: "Entwurf", klasse: "bg-slate-100 text-slate-700", punkt: "bg-slate-400" },
  aktiv: { label: "Aktiv", klasse: "bg-green-100 text-green-800", punkt: "bg-green-500" },
  archiviert: { label: "Archiviert", klasse: "bg-slate-100 text-slate-500", punkt: "bg-slate-300" },
};

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
export function teilnahmeUrl(linkToken) {
  return `${window.location.origin}/i/${linkToken}`;
}

export function vorschauUrl(linkToken) {
  return `${teilnahmeUrl(linkToken)}?test=1`;
}

export async function inZwischenablage(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback für Umgebungen ohne Clipboard-API (z. B. eingebettete Vorschau)
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

// Einladungstext zum Weiterschicken (Mail, Teams, WhatsApp)
export function einladungstext({ welle, projekt, dauerMinuten }) {
  const firma = projekt?.kundenname || "unserem Unternehmen";
  const url = teilnahmeUrl(welle.linkToken);
  const frist = welle.endetAm ? datumKurz(datumNurTag(welle.endetAm), true) : "";
  const dauer = dauerMinuten ? `rund ${dauerMinuten} Minuten` : "wenige Minuten";
  if (projekt?.ansprache === "sie") {
    return [
      `Ihre Sicht ist gefragt: Bei ${firma} läuft eine anonyme Befragung.`,
      `Sie dauert ${dauer} und funktioniert am Handy genauso wie am Computer. Niemand kann sehen, wer was geantwortet hat. Sie können jederzeit unterbrechen und später weitermachen.`,
      `Hier geht es zur Befragung:\n${url}`,
      frist ? `Bitte nehmen Sie bis ${frist} teil.` : "",
    ].filter(Boolean).join("\n\n");
  }
  return [
    `Deine Sicht ist gefragt: Bei ${firma} läuft eine anonyme Befragung.`,
    `Sie dauert ${dauer} und funktioniert am Handy genauso wie am Computer. Niemand kann sehen, wer was geantwortet hat. Du kannst jederzeit unterbrechen und später weitermachen.`,
    `Hier geht es zur Befragung:\n${url}`,
    frist ? `Bitte mach bis ${frist} mit.` : "",
  ].filter(Boolean).join("\n\n");
}

// ---------------------------------------------------------------------------
// Datum
// ---------------------------------------------------------------------------

// Base44 liefert created_date/updated_date als UTC ohne Zeitzonen-Suffix
export function alsDatum(iso) {
  if (!iso) return null;
  let s = String(iso);
  if (/T\d/.test(s) && !/(Z|[+-]\d{2}:?\d{2})$/.test(s)) s += "Z";
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// "2026-10-15" als lokaler Tag (nicht als UTC-Mitternacht)
export function datumNurTag(wert) {
  if (!wert) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(wert));
  if (!m) return alsDatum(wert);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function tagesBeginn(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function tagSchluessel(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const tt = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${tt}`;
}

export function datumKurz(d, mitJahr = false) {
  if (!d) return "";
  const tt = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return mitJahr ? `${tt}.${mm}.${d.getFullYear()}` : `${tt}.${mm}.`;
}

function tageZwischen(von, bis) {
  return Math.round((tagesBeginn(bis).getTime() - tagesBeginn(von).getTime()) / 86400000);
}

// Bewusst nur tagesgenau — bei kleinen Gruppen soll aus der Uhrzeit nicht
// auf einzelne Personen geschlossen werden können.
export function relativerTag(d) {
  if (!d) return "—";
  const n = tageZwischen(d, new Date());
  if (n <= 0) return "heute";
  if (n === 1) return "gestern";
  if (n < 14) return `vor ${n} Tagen`;
  return datumKurz(d, true);
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------
export function gruppiere(liste, feld) {
  const out = {};
  for (const x of liste) {
    const k = x[feld];
    if (!out[k]) out[k] = [];
    out[k].push(x);
  }
  return out;
}

// Alle Datensätze einer Entität seitenweise holen — unabhängig davon, wie viele
// der Server je Abfrage höchstens liefert. Ohne das würden Zählungen ab einer
// gewissen Menge stillschweigend zu niedrig ausfallen.
const SEITE = 200;
const MAX_SEITEN = 50;
export async function alle(entitaet, query = null, sort = "-created_date") {
  const out = [];
  for (let seite = 0; seite < MAX_SEITEN; seite++) {
    const teil = query
      ? await entitaet.filter(query, sort, SEITE, out.length)
      : await entitaet.list(sort, SEITE, out.length);
    if (!teil || teil.length === 0) break;
    out.push(...teil);
    if (teil.length < SEITE) break;
  }
  return out;
}

// Zwischenspeicher: Was in dieser Sitzung schon geladen wurde, zeigt die Seite beim
// nächsten Öffnen sofort an und frischt es im Hintergrund auf. Nur im Arbeitsspeicher
// des Browserfensters, verschwindet beim Neuladen.
const zwischenspeicher = new Map();

export function gemerkt(schluessel) {
  return zwischenspeicher.get(schluessel) || null;
}

function merken(schluessel, wert) {
  zwischenspeicher.set(schluessel, wert);
  return wert;
}

// Alles für die Projektübersicht in drei parallelen Abfragen
export async function ladeGesamt() {
  const [projekte, wellen, sessions] = await Promise.all([
    alle(base44.entities.Projekt),
    alle(base44.entities.Welle),
    alle(base44.entities.Session),
  ]);
  return merken("gesamt", { projekte, wellen, sessions });
}

// Projekt mit Wellen und Sessions je Welle
export async function ladeProjekt(projektId) {
  const [projekt, wellen] = await Promise.all([
    base44.entities.Projekt.get(projektId),
    alle(base44.entities.Welle, { projektId }, "created_date"),
  ]);
  const listen = await Promise.all(
    wellen.map((w) => alle(base44.entities.Session, { wellenId: w.id }))
  );
  const sessionsJeWelle = {};
  wellen.forEach((w, i) => { sessionsJeWelle[w.id] = listen[i]; });
  return merken(`projekt:${projektId}`, { projekt, wellen, sessionsJeWelle });
}

// Projektdaten aus dem Zwischenspeicher — entweder vom letzten Besuch des Projekts
// oder aus der Übersicht, die bereits alle Projekte, Wellen und Sessions kennt.
export function projektAusZwischenspeicher(projektId) {
  const direkt = gemerkt(`projekt:${projektId}`);
  if (direkt) {
    return { projekt: direkt.projekt, wellen: [...direkt.wellen], sessionsJeWelle: direkt.sessionsJeWelle };
  }
  const g = gemerkt("gesamt");
  const projekt = g?.projekte.find((p) => p.id === projektId);
  if (!projekt) return null;
  const wellen = g.wellen.filter((w) => w.projektId === projektId);
  const jeWelle = gruppiere(g.sessions, "wellenId");
  const sessionsJeWelle = {};
  for (const w of wellen) sessionsJeWelle[w.id] = jeWelle[w.id] || [];
  return { projekt, wellen, sessionsJeWelle };
}

// ---------------------------------------------------------------------------
// Kennzahlen
// ---------------------------------------------------------------------------
function median(werte) {
  if (!werte.length) return null;
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function wellenKennzahlen(welle, sessions = []) {
  const gestartet = sessions.length;
  const fertig = sessions.filter((s) => s.status === "abgeschlossen");
  const abgeschlossen = fertig.length;
  const offen = gestartet - abgeschlossen;
  const mindest = Number(welle.mindestTeilnehmer ?? 6);
  const eingeladen = Number(welle.eingeladen) > 0 ? Number(welle.eingeladen) : null;
  const ziel = eingeladen || mindest;

  let letzteAktivitaet = null;
  let ersteAktivitaet = null;
  const jetzt = Date.now();
  let abgeschlossen7Tage = 0;
  for (const s of sessions) {
    const start = alsDatum(s.startedAt || s.created_date);
    const ende = s.status === "abgeschlossen" ? alsDatum(s.completedAt) : null;
    for (const d of [start, ende]) {
      if (!d) continue;
      if (!letzteAktivitaet || d > letzteAktivitaet) letzteAktivitaet = d;
      if (!ersteAktivitaet || d < ersteAktivitaet) ersteAktivitaet = d;
    }
    if (ende && jetzt - ende.getTime() < 7 * 86400000) abgeschlossen7Tage++;
  }

  const dauern = fertig
    .map((s) => {
      const a = alsDatum(s.startedAt);
      const e = alsDatum(s.completedAt);
      return a && e && e > a ? (e.getTime() - a.getTime()) / 60000 : null;
    })
    .filter((x) => x !== null);
  const med = median(dauern);

  const frist = datumNurTag(welle.endetAm);
  const tageBisEnde = frist ? tageZwischen(new Date(), frist) : null;

  return {
    gestartet,
    abgeschlossen,
    offen,
    mindest,
    eingeladen,
    ziel,
    schwelleErreicht: abgeschlossen >= mindest,
    fehltBisSchwelle: Math.max(0, mindest - abgeschlossen),
    abschlussquote: gestartet ? Math.round((abgeschlossen / gestartet) * 100) : null,
    ruecklauf: eingeladen ? Math.round((abgeschlossen / eingeladen) * 100) : null,
    letzteAktivitaet,
    ersteAktivitaet,
    abgeschlossen7Tage,
    medianDauer: med === null ? null : Math.round(med * 10) / 10,
    frist,
    tageBisEnde,
  };
}

// Ein Satz dazu, wo die Welle steht und was als Nächstes zu tun ist
export function wellenHinweis(welle, k) {
  if (welle.status === "entwurf") {
    return { ton: "neutral", text: "Noch nicht freigeschaltet — der Teilnahmelink funktioniert erst im Status „Live“." };
  }
  if (welle.status === "live") {
    if (k.tageBisEnde !== null && k.tageBisEnde < 0) {
      return {
        ton: "warnung",
        text: k.schwelleErreicht
          ? "Frist abgelaufen, Mindestzahl erreicht — die Welle kann geschlossen werden."
          : `Frist abgelaufen, es fehlen noch ${k.fehltBisSchwelle} bis zur Mindestzahl — nachfassen oder verlängern.`,
      };
    }
    if (!k.schwelleErreicht) {
      const rest = k.tageBisEnde !== null ? ` Noch ${k.tageBisEnde} ${k.tageBisEnde === 1 ? "Tag" : "Tage"}.` : "";
      return {
        ton: k.tageBisEnde !== null && k.tageBisEnde <= 2 ? "warnung" : "neutral",
        text: `Es fehlen noch ${k.fehltBisSchwelle} abgeschlossene Interviews bis zur Auswertung.${rest}`,
      };
    }
    return { ton: "gut", text: "Mindestzahl erreicht — die Antworten sind auswertbar." };
  }
  // geschlossen
  if (!k.schwelleErreicht) {
    return {
      ton: "warnung",
      text: `Geschlossen mit ${k.abgeschlossen} von ${k.mindest} nötigen Interviews — Einzelantworten bleiben gesperrt.`,
    };
  }
  return { ton: "gut", text: "Geschlossen und auswertbar." };
}

// Verlauf je Tag (kumuliert) — für das Verlaufsdiagramm
export function verlaufProTag(sessions = [], maxTage = 45) {
  const starts = {};
  const enden = {};
  let frueh = null;
  for (const s of sessions) {
    const a = alsDatum(s.startedAt || s.created_date);
    if (a) {
      const k = tagSchluessel(a);
      starts[k] = (starts[k] || 0) + 1;
      if (!frueh || a < frueh) frueh = a;
    }
    if (s.status === "abgeschlossen") {
      const e = alsDatum(s.completedAt);
      if (e) {
        const k = tagSchluessel(e);
        enden[k] = (enden[k] || 0) + 1;
      }
    }
  }
  if (!frueh) return [];

  const heute = tagesBeginn(new Date());
  let start = tagesBeginn(frueh);
  const mindestStart = new Date(heute);
  mindestStart.setDate(mindestStart.getDate() - 6);
  if (start > mindestStart) start = mindestStart;
  const grenze = new Date(heute);
  grenze.setDate(grenze.getDate() - (maxTage - 1));

  // Was vor dem dargestellten Zeitraum liegt, steckt im Startwert
  let kumG = 0;
  let kumA = 0;
  if (start < grenze) {
    const gk = tagSchluessel(grenze);
    for (const k of Object.keys(starts)) if (k < gk) kumG += starts[k];
    for (const k of Object.keys(enden)) if (k < gk) kumA += enden[k];
    start = grenze;
  }

  const out = [];
  for (let d = new Date(start); d <= heute; d.setDate(d.getDate() + 1)) {
    const k = tagSchluessel(d);
    kumG += starts[k] || 0;
    kumA += enden[k] || 0;
    out.push({
      tag: datumKurz(d),
      neuGestartet: starts[k] || 0,
      neuAbgeschlossen: enden[k] || 0,
      gestartet: kumG,
      abgeschlossen: kumA,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Wellen-Aktionen
// ---------------------------------------------------------------------------

// Welle samt Blöcken und Fragen kopieren — neuer Link, Status Entwurf, keine Antworten
export async function welleDuplizieren(welle, neuerName) {
  const kopie = await base44.entities.Welle.create({
    projektId: welle.projektId,
    name: neuerName,
    zielgruppe: welle.zielgruppe,
    linkToken: generiereToken(),
    status: "entwurf",
    mindestTeilnehmer: welle.mindestTeilnehmer ?? 6,
    begruessungstext: welle.begruessungstext || "",
    abschlusstext: welle.abschlusstext || "",
    geschaetzteDauerMinuten: welle.geschaetzteDauerMinuten ?? 10,
  });
  const bloecke = await alle(base44.entities.Block, { wellenId: welle.id }, "reihenfolge");
  let anzahlFragen = 0;
  for (const b of bloecke) {
    const neuerBlock = await base44.entities.Block.create({
      wellenId: kopie.id,
      titel: b.titel,
      reihenfolge: b.reihenfolge ?? 0,
      motivationstext: b.motivationstext || "",
    });
    const fragen = await alle(base44.entities.Frage, { blockId: b.id }, "reihenfolge");
    if (fragen.length) {
      const kopien = fragen.map((f) => ({
        ...frageFelderAuslesen(f),
        blockId: neuerBlock.id,
        reihenfolge: f.reihenfolge ?? 0,
      }));
      try {
        await base44.entities.Frage.bulkCreate(kopien);
      } catch (e) {
        // Sammelanlage nicht möglich — einzeln anlegen. Vorher aufräumen, damit nichts doppelt entsteht.
        await base44.entities.Frage.deleteMany({ blockId: neuerBlock.id });
        for (const kopie of kopien) await base44.entities.Frage.create(kopie);
      }
      anzahlFragen += fragen.length;
    }
  }
  return { welle: kopie, bloecke: bloecke.length, fragen: anzahlFragen };
}

// Welle mit allem, was daran hängt, löschen
export async function welleLoeschen(welle) {
  const bloecke = await alle(base44.entities.Block, { wellenId: welle.id }, "reihenfolge");
  for (const b of bloecke) {
    await base44.entities.Frage.deleteMany({ blockId: b.id });
  }
  await base44.entities.Block.deleteMany({ wellenId: welle.id });
  const sessions = await alle(base44.entities.Session, { wellenId: welle.id });
  for (const s of sessions) {
    await base44.entities.Antwort.deleteMany({ sessionId: s.id });
  }
  await base44.entities.Session.deleteMany({ wellenId: welle.id });
  await base44.entities.Welle.delete(welle.id);
}
