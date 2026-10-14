// Bringt die vier ANDI-Signets (fragt / weiß / macht / zeigt) von
// werbe-agentur-graz.at auf ein gemeinsames Raster:
//   - gleiches Zeichenformat (viewBox 0 0 163 128) für alle vier
//   - der pinke ANDI-Kasten ist in jeder Datei gleich breit (138 Einheiten)
//     und sitzt an derselben Stelle (x 11, y 8)
//   - Handschrift einheitlich in Rittler-Dunkelgrau #2d2d2d statt Schwarz
// Außerdem entsteht daraus das Tab-Icon (nur der pinke ANDI-Kasten).
//
// Aufruf: node scripts/marke-normalisieren.mjs <Ordner mit den Originalen>
// Die Originale heißen dort andi-<name>-schwarz.svg (wie auf der Website).
// Messwerte (Lage des pinken Kastens in den Originalen) per getBoundingClientRect
// im Browser ermittelt, 14.10.2026.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const quelle = process.argv[2];
if (!quelle) throw new Error("Ordner mit den Original-SVGs angeben");

const ZIEL_BREITE = 138; // Breite des ANDI-Kastens
const ZIEL_X = 11;
const ZIEL_Y = 8;
const VIEWBOX = "0 0 163 128";

const KASTEN = {
  fragt: { x: 11, y: 6.78, w: 137.79 },
  weiss: { x: 11, y: 6.78, w: 138.9 },
  macht: { x: 10.6, y: 6.78, w: 138.73 },
  zeigt: { x: 10.15, y: 0, w: 133.77 },
};

function innenteil(svg) {
  const start = svg.indexOf(">", svg.indexOf("<svg")) + 1;
  const ende = svg.lastIndexOf("</svg>");
  return svg.slice(start, ende);
}

for (const [name, k] of Object.entries(KASTEN)) {
  const original = readFileSync(join(quelle, `andi-${name}-schwarz.svg`), "utf8");
  if (/<script|on\w+=|javascript:|<foreignObject|<image/i.test(original)) {
    throw new Error(`${name}: unerwarteter Inhalt im SVG`);
  }
  const s = ZIEL_BREITE / k.w;
  const tx = (ZIEL_X - k.x * s).toFixed(3);
  const ty = (ZIEL_Y - k.y * s).toFixed(3);
  // Pfade ohne eigene Füllfarbe erben #2d2d2d von der Gruppe; Schwarz wird ersetzt.
  const inhalt = innenteil(original).replace(/fill="#000(000)?"/gi, 'fill="#2d2d2d"');
  const neu =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${VIEWBOX}" width="163" height="128">` +
    `<g fill="#2d2d2d" transform="translate(${tx} ${ty}) scale(${s.toFixed(5)})">${inhalt}</g></svg>\n`;
  writeFileSync(join("public/marke", `andi-${name}.svg`), neu);
  console.log(`andi-${name}.svg  Maßstab ${s.toFixed(4)}  Verschiebung ${tx}/${ty}`);
}

// Tab-Icon: pinker ANDI-Kasten aus „fragt“, auf weißem Quadrat mit runden Ecken.
const fragt = readFileSync(join(quelle, "andi-fragt-schwarz.svg"), "utf8");
const pink = fragt.match(/<path[^>]*fill="#FF3764"[^>]*\/>/i)[0];
const k = KASTEN.fragt;
const seite = 160;
const mx = k.x + k.w / 2;
const my = k.y + 55.11 / 2;
const icon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(mx - seite / 2).toFixed(2)} ${(my - seite / 2).toFixed(2)} ${seite} ${seite}">` +
  `<rect x="${(mx - seite / 2).toFixed(2)}" y="${(my - seite / 2).toFixed(2)}" width="${seite}" height="${seite}" rx="28" fill="#ffffff"/>` +
  `<g transform="translate(-234 -226)">${pink}</g></svg>\n`;
writeFileSync("public/marke/favicon.svg", icon);
console.log("favicon.svg geschrieben");
