// Werte-Sortierer (Fragetyp "werte_sortierer") — Standardmodul der Andi-Methode.
//
// Ablauf für Befragte:
//   1. Sortieren: jeder Begriff einzeln — passt / weiß nicht / passt nicht
//   2. Aus dem „Passt“-Stapel die N treffendsten wählen (Rangfolge 1–N)
//   3. Aus dem „Passt nicht“-Stapel die N unpassendsten wählen
//
// Speicherung in der bestehenden Antwort-Struktur (keine Schemaänderung):
//   auswahl     = ["ist:Qualität", …, "ist_nicht:Rebellion", …]  — Reihenfolge = Rang
//   matrixWerte = { "Qualität": 1, "Humor": 0, "Rebellion": -1, … } — komplette Sortierung
//   zahl        = Zufallswert (Seed) für die Reihenfolge, in der die Begriffe gezeigt wurden

export const WERTE_SORTIERER_TYP = "werte_sortierer";
export const PRAEFIX_IST = "ist:";
export const PRAEFIX_NICHT = "ist_nicht:";
export const SORT_PASST = 1;
export const SORT_WEISS_NICHT = 0;
export const SORT_PASST_NICHT = -1;

// 66 Begriffe der Limbic Map mit Originalkoordinaten (x/y in Prozent) aus dem Altsystem.
// Die Koordinaten werden Befragten nicht gezeigt — sie dienen der Auswertung auf der Karte.
export const STANDARD_BEGRIFFE = [
  { de: "Extravaganz", x: 26, y: 7, gruppe: "oben" },
  { de: "Rebellion", x: 62, y: 7, gruppe: "oben" },
  { de: "Impulsivität", x: 43, y: 12, gruppe: "oben" },
  { de: "Risikofreude", x: 43, y: 17, gruppe: "oben" },
  { de: "Spontanität", x: 43, y: 22, gruppe: "oben" },
  { de: "Kreativität", x: 15, y: 17, gruppe: "oben" },
  { de: "Individualismus", x: 18, y: 22, gruppe: "oben" },
  { de: "Abwechslung", x: 20, y: 27, gruppe: "oben" },
  { de: "Sieg", x: 78, y: 17, gruppe: "oben" },
  { de: "Kampf", x: 76, y: 22, gruppe: "oben" },
  { de: "Autonomie", x: 55, y: 30, gruppe: "oben" },
  { de: "Mut", x: 60, y: 12, gruppe: "oben" },
  { de: "Spaß", x: 5, y: 30, gruppe: "links" },
  { de: "Kunst", x: 12, y: 36, gruppe: "links" },
  { de: "Neugier", x: 16, y: 42, gruppe: "links" },
  { de: "Humor", x: 8, y: 46, gruppe: "links" },
  { de: "Fantasie", x: 10, y: 52, gruppe: "links" },
  { de: "Leichtigkeit", x: 23, y: 50, gruppe: "links" },
  { de: "Genuss", x: 2, y: 57, gruppe: "links" },
  { de: "Offenheit", x: 15, y: 58, gruppe: "links" },
  { de: "Toleranz", x: 29, y: 57, gruppe: "links" },
  { de: "Poesie", x: 16, y: 64, gruppe: "links" },
  { de: "Flexibilität", x: 27, y: 66, gruppe: "links" },
  { de: "Herzlichkeit", x: 24, y: 72, gruppe: "links" },
  { de: "Vertrauen", x: 25, y: 76, gruppe: "links" },
  { de: "Träumen", x: 6, y: 68, gruppe: "links" },
  { de: "Sinnlichkeit", x: 9, y: 74, gruppe: "links" },
  { de: "Geselligkeit", x: 15, y: 80, gruppe: "links" },
  { de: "Natur", x: 20, y: 85, gruppe: "links" },
  { de: "Nostalgie", x: 27, y: 90, gruppe: "links" },
  { de: "Heimat", x: 33, y: 85, gruppe: "links" },
  { de: "Freundschaft", x: 37, y: 74, gruppe: "links" },
  { de: "Familie", x: 40, y: 79, gruppe: "links" },
  { de: "Geborgenheit", x: 43.5, y: 84, gruppe: "links" },
  { de: "Sicherheit", x: 45, y: 90, gruppe: "links" },
  { de: "Treue", x: 52, y: 77, gruppe: "rechts" },
  { de: "Macht", x: 86, y: 30, gruppe: "rechts" },
  { de: "Elite", x: 88, y: 35, gruppe: "rechts" },
  { de: "Ruhm", x: 77, y: 35, gruppe: "rechts" },
  { de: "Durchsetzung", x: 84, y: 39, gruppe: "rechts" },
  { de: "Freiheit", x: 69, y: 40, gruppe: "rechts" },
  { de: "Status", x: 78, y: 43, gruppe: "rechts" },
  { de: "Leistung", x: 88, y: 43, gruppe: "rechts" },
  { de: "Stolz", x: 77, y: 47, gruppe: "rechts" },
  { de: "Ehre", x: 76, y: 51, gruppe: "rechts" },
  { de: "Effizienz", x: 90, y: 48, gruppe: "rechts" },
  { de: "Ehrgeiz", x: 91, y: 52, gruppe: "rechts" },
  { de: "Hartnäckigkeit", x: 82, y: 59, gruppe: "rechts" },
  { de: "Fleiß", x: 83, y: 50, gruppe: "rechts" },
  { de: "Präzision", x: 87, y: 64, gruppe: "rechts" },
  { de: "Logik", x: 78.5, y: 65, gruppe: "rechts" },
  { de: "Disziplin", x: 75, y: 70, gruppe: "rechts" },
  { de: "Pflicht", x: 56, y: 73, gruppe: "rechts" },
  { de: "Moral", x: 66, y: 73, gruppe: "rechts" },
  { de: "Hygiene", x: 63, y: 77, gruppe: "rechts" },
  { de: "Askese", x: 87, y: 69, gruppe: "rechts" },
  { de: "Sparsamkeit", x: 78, y: 74, gruppe: "rechts" },
  { de: "Qualität", x: 78, y: 80, gruppe: "rechts" },
  { de: "Tradition", x: 56, y: 93, gruppe: "rechts" },
  { de: "Funktionalität", x: 70, y: 55, gruppe: "rechts" },
  { de: "Ordnung", x: 68, y: 59, gruppe: "rechts" },
  { de: "Gerechtigkeit", x: 62, y: 63.5, gruppe: "rechts" },
  { de: "Gehorsamkeit", x: 58, y: 68, gruppe: "rechts" },
  { de: "Sauberkeit", x: 59, y: 81, gruppe: "rechts" },
  { de: "Verlässlichkeit", x: 66, y: 85, gruppe: "rechts" },
  { de: "Gesundheit", x: 61, y: 89, gruppe: "rechts" },
];

export const STANDARD_BEGRIFF_NAMEN = STANDARD_BEGRIFFE.map((b) => b.de);

// Vorkonfigurierte Frage für „Standardmodul einfügen“
export function werteSortiererVorlage() {
  return {
    typ: WERTE_SORTIERER_TYP,
    text: "Wofür *steht* {{firma}}?",
    hilfetext: "{{Du}} {{siehst}} gleich nacheinander einzelne Begriffe. {{Entscheide|Entscheiden Sie}} jeweils aus dem Bauch heraus, ob sie zu {{firma}} passen.",
    erklaerung: "Aus allen Antworten entsteht das Wertebild von {{firma}}: wofür das Unternehmen aus Sicht der Befragten steht und wofür nicht.\n\nEs gibt kein richtig oder falsch. Der erste Eindruck ist der wertvollste.",
    pflicht: true,
    optionen: [...STANDARD_BEGRIFF_NAMEN],
    maxAuswahl: 5,
    schluessel: "andi_wertesortierer",
    kernfrage: true,
    kernversion: "1.0",
    auswertungstag: "wertewelt",
    polaritaet: "neutral",
    sprachantwortErlaubt: false,
  };
}

// Anzahl der zu wählenden Begriffe je Seite
export function anzahlJeSeite(frage) {
  const n = Number(frage?.maxAuswahl);
  return n > 0 ? Math.min(n, 10) : 5;
}

// Begriffsliste der Frage (Fallback: Standardliste)
export function begriffeDerFrage(frage) {
  const liste = (frage?.optionen || []).map((o) => String(o).trim()).filter(Boolean);
  return liste.length ? Array.from(new Set(liste)) : [...STANDARD_BEGRIFF_NAMEN];
}

// Reproduzierbare Zufallsreihenfolge aus einem Seed
function zufall(seed) {
  let s = (Number(seed) >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function gemischt(liste, seed) {
  const r = zufall(seed);
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function neuerSeed() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 2000000000) + 1;
}

// auswahl ⇄ zwei Listen
export function listenAusAuswahl(auswahl) {
  const ist = [];
  const nicht = [];
  for (const a of auswahl || []) {
    const s = String(a);
    if (s.startsWith(PRAEFIX_NICHT)) nicht.push(s.slice(PRAEFIX_NICHT.length));
    else if (s.startsWith(PRAEFIX_IST)) ist.push(s.slice(PRAEFIX_IST.length));
  }
  return { ist, nicht };
}
export function auswahlAusListen(ist, nicht) {
  return [...ist.map((b) => PRAEFIX_IST + b), ...nicht.map((b) => PRAEFIX_NICHT + b)];
}

// Vollständig beantwortet = N „steht für“ + N „steht nicht für“
export function werteSortiererFertig(frage, wert) {
  const n = anzahlJeSeite(frage);
  const { ist, nicht } = listenAusAuswahl(wert?.auswahl);
  return ist.length === n && nicht.length === n;
}

// Lesbare Zusammenfassung für Rohdaten-Tabelle und CSV
export function werteSortiererText(frage, antwort) {
  const { ist, nicht } = listenAusAuswahl(antwort?.auswahl);
  const teile = [];
  if (ist.length) teile.push(`Steht für: ${ist.join(", ")}`);
  if (nicht.length) teile.push(`Steht nicht für: ${nicht.join(", ")}`);
  return teile.join(" | ");
}

// Sortierung als drei Listen (für Export)
export function sortierungListen(frage, antwort) {
  const mw = antwort?.matrixWerte || {};
  const out = { passt: [], weiss_nicht: [], passt_nicht: [] };
  for (const b of begriffeDerFrage(frage)) {
    if (mw[b] === SORT_PASST) out.passt.push(b);
    else if (mw[b] === SORT_WEISS_NICHT) out.weiss_nicht.push(b);
    else if (mw[b] === SORT_PASST_NICHT) out.passt_nicht.push(b);
  }
  return out;
}
