// Verzeichnis aller Beiträge im Wissensbereich /wissen.
//
// Neuer Beitrag: Inhaltsdatei in diesem Ordner anlegen (Aufbau wie die bestehenden),
// hier importieren und in BEITRAEGE eintragen, dazu eine dünne Seite in
// src/pages/wissen/beitrag/ und eine Route in src/App.jsx (eigene Seite je Beitrag,
// damit Base44 Titel und Beschreibung je Beitrag setzen kann).
//
// Sichtbarkeit: status "entwurf" erscheint nur in der Base44-Vorschau (mit Hinweisbalken),
// live auf andifragt.at führt die Adresse zur Übersicht. status "freigegeben" ist überall sichtbar.

import mitarbeiterbefragungErgebnisse from "./mitarbeiterbefragungErgebnisse";
import warumKuendigenGuteMitarbeiter from "./warumKuendigenGuteMitarbeiter";
import alleinstellungsmerkmalFinden from "./alleinstellungsmerkmalFinden";
import warumKaufenKundenBeiDerKonkurrenz from "./warumKaufenKundenBeiDerKonkurrenz";
import abschlussquoteErhoehen from "./abschlussquoteErhoehen";
// Zielgruppe 2: Unternehmensnachfolge (etikett "Nachfolge")
import unternehmensnachfolgeMarketing from "./unternehmensnachfolgeMarketing";
import generationenwechselFamilienunternehmenMarke from "./generationenwechselFamilienunternehmenMarke";
import betriebsuebergabeKundenInformieren from "./betriebsuebergabeKundenInformieren";
import mitarbeiterNachBetriebsuebernahme from "./mitarbeiterNachBetriebsuebernahme";
import betriebsuebernahmeErste100Tage from "./betriebsuebernahmeErste100Tage";

export const BEITRAEGE = [
  mitarbeiterbefragungErgebnisse,
  warumKuendigenGuteMitarbeiter,
  alleinstellungsmerkmalFinden,
  warumKaufenKundenBeiDerKonkurrenz,
  abschlussquoteErhoehen,
  unternehmensnachfolgeMarketing,
  generationenwechselFamilienunternehmenMarke,
  betriebsuebergabeKundenInformieren,
  mitarbeiterNachBetriebsuebernahme,
  betriebsuebernahmeErste100Tage,
];

export const MODUL_NAMEN = { team: "Team", positionierung: "Positionierung", kunden: "Kunden", vertrieb: "Vertrieb" };
export const MODUL_PFAD = { team: "/team", positionierung: "/positionierung", kunden: "/kunden", vertrieb: "/vertrieb" };

export const SITE = "https://andifragt.at";

// Etikett auf Karten: Nachfolge-Beiträge zeigen "Nachfolge", alle anderen ihr Modul
export const NACHFOLGE = "Nachfolge";
export function istNachfolge(b) {
  return b.etikett === NACHFOLGE;
}
export function bereichName(b) {
  return istNachfolge(b) ? NACHFOLGE : MODUL_NAMEN[b.modul];
}

// Vorschau = Base44-Vorschau oder lokale Entwicklung, nie die veröffentlichte Seite
export function istVorschau() {
  try {
    return /preview|sandbox|localhost|127\.0\.0\.1/i.test(window.location.hostname);
  } catch {
    return false;
  }
}

export function istSichtbar(b) {
  return b.status === "freigegeben" || istVorschau();
}

export function sichtbareBeitraege() {
  return BEITRAEGE.filter(istSichtbar);
}

export function beitragNachSlug(slug) {
  return BEITRAEGE.find((b) => b.slug === slug) || null;
}

// Auszeichnung entfernen: **fett**, [Text](ziel), [[Platzhalter]]
export function nurText(s) {
  return String(s || "")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "");
}

function texteDesBlocks(b) {
  const t = [];
  const add = (x) => x && t.push(nurText(x));
  ["text", "unterschrift", "vorher", "nachher", "annahme", "gezeigt", "ergebnis"].forEach((k) => add(b[k]));
  (b.punkte || []).forEach((p) => (typeof p === "string" ? add(p) : (add(p.fett), add(p.text))));
  (b.schritte || []).forEach((s) => add(s.text));
  (b.zeilen || []).forEach((z) => (Array.isArray(z) ? z.forEach(add) : add(z.label)));
  (b.karten || []).forEach((k) => (add(k.titel), add(k.text)));
  return t;
}

export function woerter(b) {
  const t = [b.titel, b.titelAkzent, b.kurzAntwort];
  (b.wichtigstes || []).forEach((w) => t.push(w.fett, w.text));
  (b.abschnitte || []).forEach((a) => {
    t.push(a.frage);
    a.bloecke.forEach((bl) => t.push(...texteDesBlocks(bl)));
  });
  (b.faq || []).forEach((f) => t.push(f.q, f.a));
  return nurText(t.join(" ")).split(/\s+/).filter(Boolean).length;
}

export function lesezeit(b) {
  return Math.max(1, Math.round(woerter(b) / 220));
}

const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
export function datumLang(iso) {
  if (!iso) return "";
  const [j, m, t] = iso.split("-").map(Number);
  return `${t}. ${MONATE[m - 1]} ${j}`;
}
