// Außenblick-Modul (Arbeitsname „andi schaut.“): Ziele, Widersprüche, Portalfragen,
// Einladungscodes, Verlauf. Geteilte Logik für Zielliste und Zielkarte.
//
// Grundsatz: Die Software stellt nie von sich aus Kontakt zum Unternehmen her.
// Ein Einladungscode öffnet das Portal erst, wenn Alfons den Versand von Hand markiert.

import { base44 } from "@/api/base44Client";
import { alle, alsDatum, OEFFENTLICHE_URL } from "@/lib/verwaltung";

// ---------------------------------------------------------------------------
// Fachliche Listen
// ---------------------------------------------------------------------------

// Pipeline eines Ziels. ton = Statusetikett, schritt = was als Nächstes von Hand zu tun ist.
export const ZIEL_STATUS = {
  vorgemerkt: { label: "Vorgemerkt", ton: "neutral", schritt: "Scan anfordern, sobald ein Auslöser da ist." },
  scan_angefordert: { label: "Scan angefordert", ton: "info", schritt: "Wartet auf den Scan (Claude, Skill andi schaut.)." },
  scan_laeuft: { label: "Scan läuft", ton: "info", schritt: "Scan läuft — Register und Befund kommen in die Zielkarte." },
  befund: { label: "Befund liegt vor", ton: "attention", schritt: "Befund lesen, go oder no-go entscheiden." },
  no_go: { label: "No-go", ton: "neutral", schritt: "Kein Portal. Bei Bedarf auf Beobachtung setzen." },
  go: { label: "Go", ton: "info", schritt: "Portal und Brief bauen lassen (Phase 4 und 5)." },
  freigabe: { label: "Zur Freigabe", ton: "attention", schritt: "Portal und Brief prüfen — wie liest das der Unternehmer?" },
  freigegeben: { label: "Freigegeben", ton: "info", schritt: "Brief drucken, per Post versenden, dann hier als versendet markieren." },
  versendet: { label: "Versendet", ton: "info", schritt: "Nach 10 Tagen ohne Öffnung ein kurzer Anruf, kein zweiter Brief." },
  geoeffnet: { label: "Portal geöffnet", ton: "info", schritt: "Nichts tun — der Link bleibt 30 Tage aktiv." },
  antworten: { label: "Antworten da", ton: "done", schritt: "Antworten lesen, Erstgespräch anbieten." },
  erstgespraech: { label: "Erstgespräch", ton: "done", schritt: "Erstgespräch führen, Modul bestätigen." },
  kunde: { label: "Kunde", ton: "done", schritt: "Interview aus dem Befund anlegen." },
  beobachtung: { label: "Beobachtung", ton: "neutral", schritt: "Monatlich Startseite und Anzeigen nachscannen." },
  abgelegt: { label: "Abgelegt", ton: "neutral", schritt: "" },
};

export const STATUS_REIHENFOLGE = Object.keys(ZIEL_STATUS);

// Gruppen für Filter und Kennzahlen
export const STATUS_GRUPPE = {
  entscheiden: ["befund", "freigabe"],
  unterwegs: ["freigegeben", "versendet", "geoeffnet", "antworten", "erstgespraech"],
  vorbereitung: ["vorgemerkt", "scan_angefordert", "scan_laeuft", "go"],
  ruhend: ["beobachtung"],
  zu: ["no_go", "kunde", "abgelegt"],
};

export const ZIEL_FILTER = [
  { key: "offen", label: "Offen", passt: (s) => !STATUS_GRUPPE.zu.includes(s) && s !== "beobachtung" },
  { key: "entscheiden", label: "Zu entscheiden", passt: (s) => STATUS_GRUPPE.entscheiden.includes(s) },
  { key: "unterwegs", label: "Unterwegs", passt: (s) => STATUS_GRUPPE.unterwegs.includes(s) },
  { key: "beobachtung", label: "Beobachtung", passt: (s) => s === "beobachtung" },
  { key: "zu", label: "Abgeschlossen", passt: (s) => STATUS_GRUPPE.zu.includes(s) },
  { key: "alle", label: "Alle", passt: () => true },
];

export const WIDERSPRUCH_TYP = {
  kanal: { nr: 1, label: "Kanal gegen Kanal", kurz: "Kanal" },
  zeit: { nr: 2, label: "Zeit", kurz: "Zeit" },
  zielgruppe: { nr: 3, label: "Zielgruppenstreuung", kurz: "Zielgruppe" },
  kundenwahrheit: { nr: 4, label: "Kundenwahrheit ≠ Werbewahrheit", kurz: "Kunden" },
  innen_aussen: { nr: 5, label: "Innen ≠ außen", kurz: "Innen/außen" },
  marke: { nr: 6, label: "Marke", kurz: "Marke" },
  austauschbarkeit: { nr: 7, label: "Austauschbarkeit", kurz: "Austauschbar" },
  inhalt_ziel: { nr: 8, label: "Inhalt gegen Ziel", kurz: "Inhalt" },
};

export const STAERKE = {
  stark: { label: "stark", ton: "attention" },
  mittel: { label: "mittel", ton: "info" },
  schwach: { label: "schwach", ton: "neutral" },
};

// Was das Unternehmen im Portal sieht: offen sofort, gesperrt erst nach zwei Antworten, intern nie.
export const PORTAL_STUFE = {
  offen: { label: "Im Portal", ton: "done" },
  gesperrt: { label: "Nach 2 Antworten", ton: "info" },
  intern: { label: "Nur intern", ton: "neutral" },
};

export const MODUL = {
  kunden: { label: "Kunden-Interview", pille: "kunden" },
  positionierung: { label: "Positionierung", pille: "geschaeftsfuehrung" },
  vertrieb: { label: "Vertrieb", pille: "partner" },
  team: { label: "Team-Interview", pille: "mitarbeiter" },
};

export const HEBEL = {
  lern: "Lernhebel",
  zielgruppen: "Zielgruppenhebel",
  bruch: "Bruchhebel",
  substanz: "Substanzhebel",
};

// Budgetklasse: nur Indikatoren (Anzeigenzahl, Laufzeit, Kanäle), keine Euro-Schätzung.
// Die Kalibrierung kommt später aus den Rechnerläufen der Unternehmen.
export const BUDGETKLASSE = {
  1: { label: "klein", text: "wenige Anzeigen, ein Kanal" },
  2: { label: "mittel", text: "laufende Kampagnen auf einem Kanal" },
  3: { label: "gehoben", text: "viele Varianten, zwei Kanäle, lange Laufzeiten" },
  4: { label: "groß", text: "mehrere Kanäle, Video, Agentur erkennbar" },
};

export const EINLADUNG_STATUS = {
  entwurf: { label: "Entwurf", ton: "neutral" },
  freigegeben: { label: "Freigegeben", ton: "info" },
  versendet: { label: "Versendet", ton: "done" },
  abgelaufen: { label: "Abgelaufen", ton: "neutral" },
  gesperrt: { label: "Gesperrt", ton: "critical" },
};

export const EREIGNIS_ART = {
  angelegt: "Ziel angelegt",
  scan_angefordert: "Scan angefordert",
  scan_gestartet: "Scan gestartet",
  scan_fertig: "Scan fertig, Befund liegt vor",
  status: "Status geändert",
  freigabe: "Portal und Brief freigegeben",
  versendet: "Brief versendet (von Hand markiert)",
  geoeffnet: "Portal geöffnet",
  block: "Block gesehen",
  frage_beantwortet: "Frage beantwortet",
  rechner: "Rechner benutzt",
  welle_geteilt: "Welle weitergeleitet",
  erstgespraech_klick: "Erstgespräch angeklickt",
  anruf: "Anruf",
  notiz: "Notiz",
  beobachtung: "Beobachtung: Änderung erkannt",
};

export const ROLLE = { unternehmen: "Unternehmen", mitarbeiter: "Mitarbeitende", kunde: "Kunde", unbekannt: "Unbekannt" };

// Höchstens fünf Ziele je Woche anschreiben — jedes von einem Menschen geprüft.
export const DOSIS_JE_WOCHE = 5;

// ---------------------------------------------------------------------------
// Links und Codes
// ---------------------------------------------------------------------------
export const portalUrl = (code) => `${OEFFENTLICHE_URL}/a/${code}`;
// Die Vorschau bleibt in der App (gleicher Tab, gleiche Anmeldung): Im Base44-Editor
// hängt die Anmeldung am Token in der Vorschau-Adresse, ein neuer Tab hätte ihn nicht —
// und ohne Admin-Anmeldung weist das Portal einen Entwurfs-Code ab. `ziel` führt zurück.
export const portalVorschauPfad = (code, zielId) => `/a/${code}?vorschau=1${zielId ? `&ziel=${zielId}` : ""}`;

// Code wie im Brief: Kürzel in Versalien, Bindestrich, vier Zeichen ohne 0/O/1/I/L.
export function neuerCode(kuerzel, welle = false) {
  const z = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const arr = new Uint32Array(4);
  crypto.getRandomValues(arr);
  const rest = Array.from(arr, (x) => z[x % z.length]).join("");
  return `${String(kuerzel || "ZIEL").toUpperCase()}-${rest}${welle ? "-W" : ""}`;
}

export function kuerzelVorschlag(unternehmen) {
  const w = String(unternehmen || "")
    .toLowerCase()
    .replace(/gmbh|ag|kg|og|e\.u\.|&|co\.?/g, " ")
    .replace(/[^a-zäöüß ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!w.length) return "";
  if (w.length === 1) return w[0].slice(0, 3);
  return w.slice(0, 3).map((x) => x[0]).join("");
}

export function heuteIso() {
  return new Date().toISOString();
}

export function datumPlusTage(tage) {
  const d = new Date();
  d.setDate(d.getDate() + tage);
  return d.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------
const speicher = new Map();
export const gemerktAussenblick = (k) => speicher.get(k) || null;

export async function ladeZiele() {
  const [ziele, widersprueche, einladungen, ereignisse] = await Promise.all([
    alle(base44.entities.Ziel),
    alle(base44.entities.Widerspruch),
    alle(base44.entities.Einladung),
    alle(base44.entities.Ereignis),
  ]);
  const d = { ziele, widersprueche, einladungen, ereignisse };
  speicher.set("ziele", d);
  return d;
}

export async function ladeZiel(id) {
  const [ziel, widersprueche, fragen, antworten, einladungen, ereignisse, rechner] = await Promise.all([
    base44.entities.Ziel.get(id),
    alle(base44.entities.Widerspruch, { zielId: id }, "nummer"),
    alle(base44.entities.Portalfrage, { zielId: id }, "nummer"),
    alle(base44.entities.Portalantwort, { zielId: id }, "-created_date"),
    alle(base44.entities.Einladung, { zielId: id }, "created_date"),
    alle(base44.entities.Ereignis, { zielId: id }, "-created_date"),
    alle(base44.entities.Rechnerlauf, { zielId: id }, "-created_date"),
  ]);
  const d = { ziel, widersprueche, fragen, antworten, einladungen, ereignisse, rechner };
  speicher.set(`ziel:${id}`, d);
  return d;
}

export function zielAusZwischenspeicher(id) {
  const direkt = speicher.get(`ziel:${id}`);
  if (direkt) return direkt;
  const g = speicher.get("ziele");
  const ziel = g?.ziele.find((z) => z.id === id);
  if (!ziel) return null;
  return {
    ziel,
    widersprueche: g.widersprueche.filter((w) => w.zielId === id),
    fragen: [],
    antworten: [],
    einladungen: g.einladungen.filter((e) => e.zielId === id),
    ereignisse: g.ereignisse.filter((e) => e.zielId === id),
    rechner: [],
  };
}

// ---------------------------------------------------------------------------
// Kennzahlen
// ---------------------------------------------------------------------------
export function ereignisZeit(e) {
  return alsDatum(e.am || e.created_date);
}

export function zielKennzahlen(ziel, widersprueche = [], einladungen = [], ereignisse = []) {
  const stark = widersprueche.filter((w) => w.staerke === "stark").length;
  const imPortal = widersprueche.filter((w) => w.portal === "offen" || w.portal === "gesperrt").length;
  const w = ziel.werbung || {};
  const anzeigen = (w.meta || 0) + (w.google || 0) + (w.linkedin || 0) + (w.tiktok || 0);
  const haupt = einladungen.find((e) => e.art !== "welle") || null;
  const welle = einladungen.find((e) => e.art === "welle") || null;
  let letztes = null;
  for (const e of ereignisse) {
    const d = ereignisZeit(e);
    if (d && (!letztes || d > letztes)) letztes = d;
  }
  const antworten = ereignisse.filter((e) => e.art === "frage_beantwortet").length;
  const rechner = ereignisse.some((e) => e.art === "rechner");
  return { stark, imPortal, anzeigen, haupt, welle, letztes, antworten, rechner, gesamt: widersprueche.length };
}

// Trichter über alle Ziele: wie viele sind mindestens bis zu welcher Stufe gekommen.
// no_go, beobachtung und abgelegt zählen nur dort, wo sie fachlich dazugehören
// (ein no_go hatte einen Befund).
const STUFE = { befund: 3, go: 5, freigabe: 6, freigegeben: 7, versendet: 8, geoeffnet: 9, antworten: 10, erstgespraech: 11, kunde: 12 };
const RANG = { vorgemerkt: 0, scan_angefordert: 1, scan_laeuft: 2, befund: 3, no_go: 3.5, go: 5, freigabe: 6, freigegeben: 7, versendet: 8, geoeffnet: 9, antworten: 10, erstgespraech: 11, kunde: 12, beobachtung: -1, abgelegt: -1 };
export function trichter(ziele = []) {
  const ab = (stufe) => ziele.filter((z) => (RANG[z.status] ?? -1) >= STUFE[stufe]).length;
  const t = {
    scans: ziele.filter((z) => ["scan_angefordert", "scan_laeuft"].includes(z.status)).length,
    befunde: ab("befund"),
    go: ab("go"),
    noGo: ziele.filter((z) => z.status === "no_go").length,
    versendet: ab("versendet"),
    geoeffnet: ab("geoeffnet"),
    antworten: ab("antworten"),
    erstgespraeche: ab("erstgespraech"),
    kunden: ziele.filter((z) => z.status === "kunde").length,
    beobachtung: ziele.filter((z) => z.status === "beobachtung").length,
  };
  const q = (a, b) => (b ? `${Math.round((a / b) * 100)} %` : null);
  return {
    ...t,
    goQuote: q(t.go, t.befunde),
    oeffnungsQuote: q(t.geoeffnet, t.versendet),
    antwortQuote: q(t.antworten, t.geoeffnet),
    gespraechsQuote: q(t.erstgespraeche, t.antworten),
    kundenQuote: q(t.kunden, t.erstgespraeche),
  };
}

// Sichtbarkeit aus dem Blick-Text: „bei 0 von 5 Suchanfragen“ → { treffer: 0, von: 5 }
export function sichtbarkeitZahl(text) {
  const m = /(\d+)\s*von\s*(\d+)/.exec(String(text || ""));
  return m ? { treffer: Number(m[1]), von: Number(m[2]) } : null;
}

// Wie viele Briefe in den letzten sieben Tagen als versendet markiert wurden
export function versendetDieseWoche(einladungen = []) {
  const grenze = Date.now() - 7 * 86400000;
  return einladungen.filter((e) => e.status === "versendet" && e.versendetAm && alsDatum(e.versendetAm)?.getTime() > grenze).length;
}

// ---------------------------------------------------------------------------
// Aktionen — jede schreibt einen Eintrag in den Verlauf
// ---------------------------------------------------------------------------
async function ereignis(zielId, art, extra = {}) {
  try {
    return await base44.entities.Ereignis.create({ zielId, art, von: "alfons", am: heuteIso(), ...extra });
  } catch (e) {
    return null;
  }
}

export async function zielAnlegen({ unternehmen, website, kuerzel, ausloeser, region, branche, quelle, scanGleich }) {
  const ziel = await base44.entities.Ziel.create({
    unternehmen: unternehmen.trim(),
    website: (website || "").trim(),
    kuerzel: (kuerzel || kuerzelVorschlag(unternehmen)).trim().toLowerCase(),
    ausloeser: (ausloeser || "").trim(),
    region: (region || "").trim(),
    branche: (branche || "").trim(),
    quelle: quelle || "alfons",
    ansprache: "sie",
    status: scanGleich ? "scan_angefordert" : "vorgemerkt",
    empfehlung: "offen",
    hypotheseErgebnis: "offen",
  });
  await ereignis(ziel.id, "angelegt", { details: ausloeser ? `Auslöser: ${ausloeser.trim()}` : "" });
  if (scanGleich) await ereignis(ziel.id, "scan_angefordert");
  return ziel;
}

export async function statusSetzen(ziel, status, details = "") {
  await base44.entities.Ziel.update(ziel.id, { status, naechsterSchritt: ZIEL_STATUS[status]?.schritt || "" });
  const art = status === "scan_angefordert" ? "scan_angefordert" : status === "freigegeben" ? "freigabe" : "status";
  await ereignis(ziel.id, art, { details: details || `${ZIEL_STATUS[ziel.status]?.label || ziel.status} → ${ZIEL_STATUS[status]?.label || status}` });
}

export async function notizSchreiben(ziel, text) {
  await ereignis(ziel.id, "notiz", { details: text });
}

// Einladungscode anlegen (Entwurf) — öffnet noch nichts
export async function einladungAnlegen(ziel, art = "unternehmen", empfaenger = {}) {
  return base44.entities.Einladung.create({
    zielId: ziel.id,
    code: neuerCode(ziel.kuerzel, art === "welle"),
    art,
    status: "entwurf",
    versandweg: "post",
    aufrufe: 0,
    fehlversuche: 0,
    ...empfaenger,
  });
}

// Entwurfs-Codes verwerfen (Hauptcode und Welle), solange nichts versendet ist —
// danach legt „Codes anlegen“ neue an. Versendete Codes bleiben unangetastet.
export async function einladungenVerwerfen(ziel) {
  const alleEinl = await alle(base44.entities.Einladung, { zielId: ziel.id });
  const weg = alleEinl.filter((e) => e.status !== "versendet");
  for (const e of weg) await base44.entities.Einladung.delete(e.id);
  if (weg.length) await ereignis(ziel.id, "notiz", { details: `Code${weg.length > 1 ? "s" : ""} verworfen: ${weg.map((e) => e.code).join(", ")}` });
  return weg.length;
}

// Der einzige Weg, einen Code scharf zu schalten: Alfons markiert den Versand von Hand.
export async function versendetMarkieren(ziel, einladung, { versandweg = "post", am = null, tage = 30 } = {}) {
  const zeitpunkt = am || heuteIso();
  const bis = new Date(zeitpunkt);
  bis.setDate(bis.getDate() + tage);
  await base44.entities.Einladung.update(einladung.id, {
    status: "versendet",
    versandweg,
    versendetAm: zeitpunkt,
    gueltigBis: bis.toISOString().slice(0, 10),
  });
  // Welle-Code läuft mit dem Hauptcode mit
  const alleEinl = await alle(base44.entities.Einladung, { zielId: ziel.id });
  for (const e of alleEinl) {
    if (e.art === "welle" && e.status !== "versendet") {
      await base44.entities.Einladung.update(e.id, { status: "versendet", versendetAm: zeitpunkt, gueltigBis: bis.toISOString().slice(0, 10) });
    }
  }
  await base44.entities.Ziel.update(ziel.id, { status: "versendet", naechsterSchritt: ZIEL_STATUS.versendet.schritt });
  await ereignis(ziel.id, "versendet", { einladungId: einladung.id, details: `${versandweg}, Code ${einladung.code}, gültig bis ${bis.toLocaleDateString("de-AT")}` });
}

export async function zielLoeschen(ziel) {
  for (const name of ["Widerspruch", "Portalfrage", "Portalantwort", "Einladung", "Ereignis", "Rechnerlauf"]) {
    await base44.entities[name].deleteMany({ zielId: ziel.id });
  }
  await base44.entities.Ziel.delete(ziel.id);
  speicher.delete(`ziel:${ziel.id}`);
  speicher.delete("ziele");
}
