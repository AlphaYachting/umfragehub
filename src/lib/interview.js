// Geteilte Hilfsfunktionen für die Interview-App

// Zufälliger Token (URL-sicher), ohne jegliche Personenbeziehung
export function generiereToken(length = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    out += chars[arr[i] % chars.length];
  }
  return out;
}

// Geschätzte Dauer einer einzelnen Frage in Sekunden, nach Typ
export function geschaetzteFrageDauerSekunden(typ) {
  switch (typ) {
    case "single_choice":
    case "ja_nein":
      return 12;
    case "multi_choice":
      return 20;
    case "skala":
    case "schieberegler":
    case "gegensatzpaar":
      return 15;
    case "werte_auswahl":
      return 45;
    case "limbic":
      return 35;
    case "matrix":
      return 30;
    case "freitext":
      return 60;
    default:
      return 20;
  }
}

// Gesamt geschätzte Dauer in Minuten für eine Liste von Fragen
export function geschaetzteDauerMinuten(fragen) {
  const sekunden = fragen.reduce(
    (sum, f) => sum + geschaetzteFrageDauerSekunden(f.typ),
    0
  );
  return Math.max(1, Math.round(sekunden / 60));
}

// Verbleibende geschätzte Dauer in Minuten ab einer Position
export function verbleibendeDauerMinuten(fragen, abIndex) {
  const rest = fragen.slice(abIndex);
  return geschaetzteDauerMinuten(rest);
}

// Theme-Variablen für ein Projekt auf ein Wurzelelement anwenden
export function themeVariablenSetzen(projekt) {
  const root = document.documentElement;
  if (!projekt) {
    root.style.removeProperty("--farbe-akzent");
    root.style.removeProperty("--farbe-gut");
    root.style.removeProperty("--farbe-text");
    root.style.removeProperty("--farbe-bg");
    root.style.removeProperty("--schrift");
    return;
  }
  if (projekt.theme === "kunde") {
    root.style.setProperty("--farbe-akzent", projekt.farbePrimaer || "#ff3764");
    root.style.setProperty("--farbe-gut", projekt.farbeSekundaer || "#45d085");
  } else if (projekt.theme === "neutral") {
    root.style.setProperty("--farbe-akzent", "#1f3a5f");
    root.style.setProperty("--farbe-gut", "#3a7d5c");
  } else {
    // rittler — Standardwerte
    root.style.setProperty("--farbe-akzent", "#ff3764");
    root.style.setProperty("--farbe-gut", "#45d085");
  }
  // Optionale Branding-Felder — fehlen sie, gelten die bisherigen Werte
  if (projekt.farbeText) root.style.setProperty("--farbe-text", projekt.farbeText);
  else root.style.removeProperty("--farbe-text");
  if (projekt.farbeHintergrund) root.style.setProperty("--farbe-bg", projekt.farbeHintergrund);
  else root.style.removeProperty("--farbe-bg");
  if (projekt.schriftFamilie) root.style.setProperty("--schrift", projekt.schriftFamilie);
  else root.style.removeProperty("--schrift");
  // Google-Fonts-URL als <link> injizieren, falls vorhanden
  if (projekt.schriftUrl) {
    let link = document.getElementById("interview-schrift");
    if (!link) {
      link = document.createElement("link");
      link.id = "interview-schrift";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    if (link.href !== projekt.schriftUrl) link.href = projekt.schriftUrl;
  } else {
    const link = document.getElementById("interview-schrift");
    if (link) link.remove();
  }
}

// Ansprache-Hilfen: liefert "du"/"Sie"-Formen je nach Projekteinstellung
export function anspracheFormen(ansprache) {
  if (ansprache === "sie") {
    return {
      duSie: "Sie",
      dichSie: "Sie",
      dirIhnen: "Ihnen",
      deinIhr: "Ihr",
      bistSind: "sind",
      hastHaben: "haben",
      kannstKönnen: "können",
      klein: "sie"
    };
  }
  return {
    duSie: "du",
    dichSie: "dich",
    dirIhnen: "dir",
    deinIhr: "dein",
    bistSind: "bist",
    hastHaben: "hast",
    kannstKönnen: "kannst",
    klein: "du"
  };
}

// Sternchen-Markierung aus dem Fragetext entfernen (für aria-label, Export, Editor-Vorschau)
export function sternchenEntfernen(text) {
  if (!text) return "";
  return String(text).replace(/\*([^*]+)\*/g, "$1");
}

// ---------------------------------------------------------------------------
// Platzhalter im Fragetext (Schema v2)
//
//   {{firma}}            → Kundenname des Projekts
//   {{du}} {{dein}} …    → benannte Du/Sie-Formen (Tabelle unten)
//   {{siehst|sehen}}     → freie Du|Sie-Form: links Du, rechts Sie
//
// Damit bleibt der Fragetext einer Kernfrage kundenübergreifend identisch —
// Voraussetzung für Benchmark und Datenbank.
// ---------------------------------------------------------------------------
const DU_SIE_FORMEN = {
  du: ["du", "Sie"],
  Du: ["Du", "Sie"],
  dich: ["dich", "Sie"],
  dir: ["dir", "Ihnen"],
  dein: ["dein", "Ihr"],
  Dein: ["Dein", "Ihr"],
  deine: ["deine", "Ihre"],
  Deine: ["Deine", "Ihre"],
  deinen: ["deinen", "Ihren"],
  deinem: ["deinem", "Ihrem"],
  deiner: ["deiner", "Ihrer"],
  deines: ["deines", "Ihres"],
  bist: ["bist", "sind"],
  hast: ["hast", "haben"],
  kannst: ["kannst", "können"],
  willst: ["willst", "wollen"],
  findest: ["findest", "finden"],
  siehst: ["siehst", "sehen"],
  denkst: ["denkst", "denken"],
  glaubst: ["glaubst", "glauben"],
  meinst: ["meinst", "meinen"],
  erwartest: ["erwartest", "erwarten"],
  würdest: ["würdest", "würden"],
  wählst: ["wählst", "wählen"],
};

export function platzhalterErsetzen(text, { firma, ansprache } = {}) {
  if (!text) return "";
  const sie = ansprache === "sie";
  return String(text).replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (ganz, inhalt) => {
    const roh = String(inhalt);
    if (roh.toLowerCase() === "firma" || roh.toLowerCase() === "marke" || roh.toLowerCase() === "unternehmen") {
      return firma || "das Unternehmen";
    }
    if (roh.includes("|")) {
      const [duForm, sieForm] = roh.split("|");
      return (sie ? sieForm : duForm).trim();
    }
    const paar = DU_SIE_FORMEN[roh] || DU_SIE_FORMEN[roh.trim()];
    if (paar) return sie ? paar[1] : paar[0];
    // Unbekannter Platzhalter — unverändert lassen, damit der Fehler sichtbar bleibt
    return ganz;
  });
}

// Fragetext als HTML rendern — Platzhalter ersetzen, HTML escapen,
// dann *wort* zu <span class="frage-akzent">wort</span>
export function renderFragetext(text, kontext, optionen = {}) {
  if (!text) return "";
  const mitPlatzhaltern = kontext ? platzhalterErsetzen(text, kontext) : String(text);
  const escaped = mitPlatzhaltern
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  return escaped.replace(/\*([^*]+)\*/g, (ganz, wort) => {
    if (wort.length > 40) {
      return `<span class="frage-akzent-aussage">${wort}</span>`;
    }
    const contra = optionen.polaritaet === "contra";
    return `<span class="frage-akzent${contra ? " frage-akzent-contra" : ""}">${wort}</span>`;
  });
}

// ---------------------------------------------------------------------------
// Matrix-Zeilen mit stabilen IDs (Schema v2)
//
// matrixZeilen bleibt ein String-Array (abwärtskompatibel). matrixZeilenIds
// ist ein paralleles Array; fehlt die ID, gilt der Zeilenindex als ID — so
// bleiben bestehende Antworten ("0", "1", …) weiterhin lesbar.
// ---------------------------------------------------------------------------
export function matrixZeilenMitIds(frage) {
  const zeilen = frage?.matrixZeilen || [];
  const ids = frage?.matrixZeilenIds || [];
  return zeilen.map((text, i) => ({
    id: (ids[i] && String(ids[i]).trim()) || String(i),
    text: text || "",
  }));
}

// Kurze, lesbare ID aus einem Zeilentext (für neu angelegte Matrix-Zeilen)
export function zeilenIdAusText(text, vorhandene = []) {
  const basis = String(text || "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32) || "zeile";
  let id = basis;
  let n = 2;
  while (vorhandene.includes(id)) id = `${basis}_${n++}`;
  return id;
}

// ---------------------------------------------------------------------------
// Welche Felder eine Frage trägt — EINE Liste für Welleneditor, Bibliothek,
// Übernahme und Import, damit kein Feld mehr beim Kopieren verloren geht.
// ---------------------------------------------------------------------------
export const FRAGE_FELDER = [
  "typ", "text", "hilfetext", "erklaerung", "pflicht",
  "optionen", "skalaMin", "skalaMax", "skalaLabelLinks", "skalaLabelRechts",
  "stufenWorte", "matrixZeilen", "matrixZeilenIds",
  "auswertungstag", "sprachantwortErlaubt",
  "schluessel", "kernfrage", "kernversion",
  "minAuswahl", "maxAuswahl", "polaritaet", "bezugSchluessel",
];

// Nur die Fragefelder aus einem Objekt herausziehen (ohne id, blockId, Metadaten)
export function frageFelderAuslesen(obj) {
  const out = {};
  for (const f of FRAGE_FELDER) {
    if (obj[f] !== undefined) out[f] = obj[f];
  }
  return out;
}

// Import-Objekt normalisieren: matrixZeilen darf als String oder {id, text} kommen
export function frageAusImport(f, fallbackContainer) {
  const zeilenRoh = f.matrixZeilen || [];
  const matrixZeilen = [];
  const matrixZeilenIds = [];
  zeilenRoh.forEach((z, i) => {
    if (z && typeof z === "object") {
      matrixZeilen.push(z.text || "");
      matrixZeilenIds.push(z.id || zeilenIdAusText(z.text, matrixZeilenIds));
    } else {
      matrixZeilen.push(String(z ?? ""));
      const idAusListe = Array.isArray(f.matrixZeilenIds) ? f.matrixZeilenIds[i] : undefined;
      matrixZeilenIds.push(idAusListe || zeilenIdAusText(z, matrixZeilenIds));
    }
  });
  return {
    typ: f.typ || "freitext",
    text: f.text || "",
    hilfetext: f.hilfetext || "",
    erklaerung: f.erklaerung || "",
    pflicht: f.pflicht !== false,
    optionen: f.optionen || [],
    skalaMin: f.skalaMin ?? 1,
    skalaMax: f.skalaMax ?? 5,
    skalaLabelLinks: f.skalaLabelLinks || "",
    skalaLabelRechts: f.skalaLabelRechts || "",
    stufenWorte: f.stufenWorte || [],
    matrixZeilen,
    matrixZeilenIds,
    auswertungstag: f.auswertungstag || "",
    sprachantwortErlaubt: !!f.sprachantwortErlaubt,
    schluessel: f.schluessel || "",
    kernfrage: !!f.kernfrage,
    kernversion: f.kernversion || "",
    minAuswahl: f.minAuswahl ?? undefined,
    maxAuswahl: f.maxAuswahl ?? undefined,
    polaritaet: f.polaritaet || "neutral",
    bezugSchluessel: f.bezugSchluessel || "",
    zielgruppe: f.zielgruppe || "allgemein",
    kategorie: f.kategorie || "",
    container: f.container || fallbackContainer,
    reihenfolge: f.reihenfolge ?? 0,
  };
}

// Export-Objekt: matrixZeilen als {id, text}, damit IDs mitwandern
export function frageFuerExport(f) {
  const { id, created_date, updated_date, created_by_id, created_by, blockId, ...rest } = f;
  const zeilen = matrixZeilenMitIds(f);
  const out = { ...rest };
  delete out.matrixZeilenIds;
  out.matrixZeilen = zeilen.map((z) => ({ id: z.id, text: z.text }));
  return out;
}

// Datum formatieren TT.MM.JJJJ
export function formatiereDatum(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const tt = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const jjjj = d.getFullYear();
  return `${tt}.${mm}.${jjjj}`;
}

// Datum und Uhrzeit formatieren TT.MM.JJJJ HH:MM
export function formatiereDatumZeit(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const basis = formatiereDatum(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${basis} ${hh}:${min}`;
}

// Minuten aus Millisekunden Dauer
export function dauerInMinuten(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (isNaN(ms) || ms < 0) return 0;
  return Math.round((ms / 60000) * 10) / 10;
}

// Zielgruppen-Labels
export const ZIELGRUPPE_LABELS = {
  geschaeftsfuehrung: "Geschäftsführung",
  mitarbeiter: "Mitarbeiter",
  kunden: "Kunden",
  partner: "Partner",
  allgemein: "Allgemein"
};

// Fragetyp-Labels
export const FRAGETYP_LABELS = {
  single_choice: "Einzelauswahl",
  multi_choice: "Mehrfachauswahl",
  skala: "Skala",
  werte_auswahl: "Werte-Auswahl",
  limbic: "Limbic",
  freitext: "Freitext",
  ja_nein: "Ja / Nein",
  schieberegler: "Schieberegler",
  gegensatzpaar: "Gegensatzpaar",
  matrix: "Matrix"
};