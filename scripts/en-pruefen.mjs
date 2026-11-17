// Prüft englische Wissensbeiträge gegen ihr deutsches Original (17.11.2026).
// Aufruf: node scripts/en-pruefen.mjs [englischerDateiname ...]   (ohne Angabe: alle in src/inhalte/wissen/en)
// Prüft: Struktur gleich (Schlüssel, Blocktypen, Listenlängen), Zahlen in Datenfeldern gleich,
// verbotene Zeichen (Gilroy), Titel- und Beschreibungslänge, interne Links, passend-Slugs.
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const WURZEL = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DE = path.join(WURZEL, "src/inhalte/wissen");
const EN = path.join(DE, "en");

const sprache = fs.readFileSync(path.join(WURZEL, "src/lib/sprache.js"), "utf8");
const SLUGS = Object.fromEntries([...sprache.matchAll(/"([a-z0-9-]+)": "([a-z0-9-]+)",/g)].map((m) => [m[1], m[2]]));
const EN_SLUGS = new Set(Object.values(SLUGS));
const SEITEN = new Set(["/en", "/en/positioning", "/en/team", "/en/customers", "/en/sales", "/en/about", "/en/contact", "/en/pricing", "/en/insights", "/datenschutz", "/impressum"]);
const VERBOTEN = /[–—“”„‘’‚·…½→×]/;
const DEUTSCH_VERDACHT = /\b(und|der|die|das|nicht|mit|für|Unternehmen|Mitarbeiter|Befragung|Kunden|werden|ist|wir|du|dein|deine)\b/;

async function laden(datei) {
  const m = await import(pathToFileURL(datei).href + "?t=" + Date.now());
  return m.default;
}

function vergleich(de, en, pfad, fehler) {
  if (Array.isArray(de)) {
    if (!Array.isArray(en)) return fehler.push(`${pfad}: Liste erwartet`);
    if (de.length !== en.length) fehler.push(`${pfad}: ${de.length} Einträge im Deutschen, ${en.length} im Englischen`);
    de.forEach((x, i) => en[i] !== undefined && vergleich(x, en[i], `${pfad}[${i}]`, fehler));
    return;
  }
  if (de && typeof de === "object") {
    if (!en || typeof en !== "object") return fehler.push(`${pfad}: Objekt erwartet`);
    for (const k of Object.keys(de)) {
      if (!(k in en)) fehler.push(`${pfad}.${k}: fehlt`);
      else vergleich(de[k], en[k], `${pfad}.${k}`, fehler);
    }
    for (const k of Object.keys(en)) if (!(k in de) && !(pfad === "" && k === "de")) fehler.push(`${pfad}.${k}: neu im Englischen`);
    return;
  }
  if (typeof de === "number" && de !== en) fehler.push(`${pfad}: Zahl ${de} wurde zu ${en}`);
  if (typeof de === "boolean" && de !== en) fehler.push(`${pfad}: ${de} wurde zu ${en}`);
  if ((pfad.endsWith(".typ") || pfad.endsWith(".symbol") || pfad.endsWith(".farbe") || pfad.endsWith(".form") || pfad.endsWith(".phase") || pfad.endsWith(".stil") || pfad.endsWith(".verb") || pfad.endsWith(".status") || pfad.endsWith(".modul")) && de !== en)
    fehler.push(`${pfad}: Steuerwert "${de}" wurde zu "${en}"`);
}

function texte(o, pfad = "", aus = []) {
  if (typeof o === "string") aus.push([pfad, o]);
  else if (Array.isArray(o)) o.forEach((x, i) => texte(x, `${pfad}[${i}]`, aus));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) texte(v, `${pfad}.${k}`, aus);
  return aus;
}

const dateien = process.argv.slice(2).length
  ? process.argv.slice(2).map((d) => path.join(EN, d.endsWith(".js") ? d : d + ".js"))
  : fs.readdirSync(EN).filter((d) => d.endsWith(".js") && d !== "index.js").map((d) => path.join(EN, d));

let gesamt = 0;
for (const datei of dateien) {
  const fehler = [];
  const hinweise = [];
  let en;
  try { en = await laden(datei); } catch (e) { console.log(`\n${path.basename(datei)}: LÄDT NICHT: ${e.message}`); gesamt++; continue; }
  const deSlug = en.de;
  const deDatei = fs.readdirSync(DE).find((d) => d.endsWith(".js") && d !== "index.js" && fs.readFileSync(path.join(DE, d), "utf8").includes(`"slug": "${deSlug}"`));
  if (!deDatei) { console.log(`\n${path.basename(datei)}: deutsches Original zu "${deSlug}" nicht gefunden`); gesamt++; continue; }
  const de = await laden(path.join(DE, deDatei));
  if (SLUGS[deSlug] !== en.slug) fehler.push(`slug "${en.slug}" passt nicht zu BEITRAG_SLUGS ("${SLUGS[deSlug]}")`);
  vergleich({ ...de, slug: null }, { ...en, slug: null }, "", fehler);
  if (en.seitentitel.length > 60) fehler.push(`seitentitel ${en.seitentitel.length} Zeichen (max. 60)`);
  if (!en.seitentitel.endsWith(" | andi fragt.")) fehler.push("seitentitel endet nicht auf ' | andi fragt.'");
  if (en.beschreibung.length < 140 || en.beschreibung.length > 158) fehler.push(`beschreibung ${en.beschreibung.length} Zeichen (140 bis 158)`);
  for (const p of en.passend || []) if (!EN_SLUGS.has(p)) fehler.push(`passend "${p}" ist kein englischer Slug`);
  for (const [p, s] of texte(en)) {
    if (VERBOTEN.test(s)) fehler.push(`${p}: verbotenes Zeichen "${s.match(VERBOTEN)[0]}"`);
    for (const m of s.matchAll(/\]\((\/[^)\s]*)\)/g)) {
      const z = m[1].replace(/#.*$/, "");
      if (z.startsWith("/en/insights/")) { if (!EN_SLUGS.has(z.slice(13))) fehler.push(`${p}: Link auf unbekannten Beitrag ${z}`); }
      else if (!SEITEN.has(z)) fehler.push(`${p}: interner Link ${z} ist keine englische Seite`);
    }
    if (/Befragung|befragung/.test(s) && !/survey/i.test(s)) hinweise.push(`${p}: deutsches Wort Befragung`);
    if (DEUTSCH_VERDACHT.test(s) && !/\b(url|quellen\[\d+\]\.titel)/.test(p) && !p.includes("quellen")) hinweise.push(`${p}: deutsches Wort? "${s.match(DEUTSCH_VERDACHT)[0]}"`);
    if (/\bsurvey\b/i.test(s) && /andi fragt\.? (survey|surveys)/i.test(s)) fehler.push(`${p}: eigenes Angebot als survey bezeichnet`);
  }
  console.log(`\n${path.basename(datei)} (${deSlug} -> ${en.slug}): ${fehler.length ? fehler.length + " Fehler" : "ok"}`);
  fehler.forEach((f) => console.log("  FEHLER " + f));
  hinweise.slice(0, 15).forEach((h) => console.log("  Hinweis " + h));
  gesamt += fehler.length;
}
console.log(`\nGesamt: ${gesamt} Fehler`);
process.exit(gesamt ? 1 : 0);
