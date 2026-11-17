import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Zweisprachige öffentliche Seite (17.11.2026): Deutsch unter /, Englisch unter /en.
// Nur Image-Seiten und freigegebene Wissensbeiträge haben eine englische Fassung.
// Verwaltung, Interview, Cockpit und Außenblick bleiben einsprachig.
//
// Paare deutsch <-> englisch. Wissensbeiträge tragen ihr Gegenstück selbst
// (Feld "de" in den englischen Inhaltsdateien) und werden in src/inhalte/wissen/en/index.js
// in BEITRAG_PAARE gesammelt.

export const SITE = "https://andifragt.at";

export const SEITEN_PAARE = [
  ["/", "/en"],
  ["/positionierung", "/en/positioning"],
  ["/team", "/en/team"],
  ["/kunden", "/en/customers"],
  ["/vertrieb", "/en/sales"],
  ["/ueber-uns", "/en/about"],
  ["/kontakt", "/en/contact"],
  ["/preise", "/en/pricing"],
  ["/wissen", "/en/insights"],
];

let beitragPaare = [];
// Wird vom englischen Wissensverzeichnis beim Laden gesetzt.
export function setzeBeitragPaare(paare) {
  beitragPaare = paare;
}

export function spracheAusPfad(pfad) {
  return pfad === "/en" || String(pfad).startsWith("/en/") ? "en" : "de";
}

export function useSprache() {
  const { pathname } = useLocation();
  return spracheAusPfad(pathname);
}

function ohneSchraegstrich(p) {
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

// Gegenstück einer Seite in der anderen Sprache oder null.
export function gegenstueck(pfad) {
  const p = ohneSchraegstrich(pfad);
  const alle = [...SEITEN_PAARE, ...beitragPaare];
  const de = alle.find(([d]) => d === p);
  if (de) return de[1];
  const en = alle.find(([, e]) => e === p);
  if (en) return en[0];
  return null;
}

// Ziel des Sprachumschalters: Gegenstück, sonst die Startseite der anderen Sprache.
export function umschaltZiel(pfad) {
  return gegenstueck(pfad) || (spracheAusPfad(pfad) === "en" ? "/" : "/en");
}

// html lang, hreflang-Verweise und og:locale je Seite setzen.
// Wird im Kopf aller öffentlichen Seiten aufgerufen.
export function useSprachVerweise() {
  const { pathname } = useLocation();
  useEffect(() => {
    const p = ohneSchraegstrich(pathname);
    const sprache = spracheAusPfad(p);
    const html = document.documentElement;
    const langVorher = html.getAttribute("lang");
    html.setAttribute("lang", sprache === "en" ? "en" : "de");

    const neu = [];
    const andere = gegenstueck(p);
    if (andere) {
      const dePfad = sprache === "de" ? p : andere;
      const enPfad = sprache === "en" ? p : andere;
      [["de", dePfad], ["en", enPfad], ["x-default", dePfad]].forEach(([lang, ziel]) => {
        const l = document.createElement("link");
        l.setAttribute("rel", "alternate");
        l.setAttribute("hreflang", lang);
        l.setAttribute("href", SITE + (ziel === "/" ? "/" : ziel));
        l.setAttribute("data-sprache", "1");
        document.head.appendChild(l);
        neu.push(l);
      });
    }

    let og = document.head.querySelector('meta[property="og:locale"]');
    const ogVorher = og ? og.getAttribute("content") : null;
    if (og) og.setAttribute("content", sprache === "en" ? "en_GB" : "de_AT");

    return () => {
      neu.forEach((l) => l.remove());
      if (langVorher === null) html.removeAttribute("lang");
      else html.setAttribute("lang", langVorher);
      if (og && ogVorher !== null) og.setAttribute("content", ogVorher);
    };
  }, [pathname]);
}

// Kleine Helfer für Texte, die in gemeinsamen Bausteinen stehen.
export function waehle(sprache, de, en) {
  return sprache === "en" ? en : de;
}
