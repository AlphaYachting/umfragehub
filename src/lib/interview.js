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
      return 15;
    case "werte_auswahl":
      return 45;
    case "limbic":
      return 35;
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
  ja_nein: "Ja / Nein"
};