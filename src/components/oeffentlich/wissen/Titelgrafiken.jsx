import React from "react";

// Titelgrafiken der Beiträge im Wissensbereich, je Beitrag (Schlüssel = slug).
// Jede Grafik gibt es zweimal: breit 1600 x 700 ab 640 px Bildschirmbreite und schmal 800 x 900 am Handy,
// damit die Schrift im Bild am Handy lesbar bleibt. Gezeichnet nach den Prototypen "Wissen ... visuell".
// Keine Fotos der Software, keine erfundenen Zahlen; Beispiele sind im Bild als Beispiel gekennzeichnet.

const SCHRIFT = "'Gilroy', 'Outfit', Arial, sans-serif";
const PINK = "#ff3764";

function Rahmen({ breit, schmal, label }) {
  return (
    <>
      <svg viewBox="0 0 1600 700" width="100%" role="img" aria-label={label} className="hidden sm:block" style={{ fontFamily: SCHRIFT }}>
        <rect x="0" y="0" width="1600" height="700" fill="#2d2d2d" />
        {breit}
      </svg>
      <svg viewBox="0 0 800 900" width="100%" role="img" aria-label={label} className="block sm:hidden" style={{ fontFamily: SCHRIFT }}>
        <rect x="0" y="0" width="800" height="900" fill="#2d2d2d" />
        {schmal}
      </svg>
    </>
  );
}

// Textblock links (breit) bzw. oben (schmal)
function Kopftext({ schmal, oben, z1, z2, z3, z4, unter, z1b }) {
  if (schmal) {
    return (
      <>
        <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">{oben}</text>
        <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">{z1}</text>
        {z1b && <text x="48" y="240" fill={z1b.pink ? PINK : "#ffffff"} fontSize="62" fontWeight="900">{z1b.text}</text>}
        <text x="48" y="322" fill="#d4d4d4" fontSize="46" fontWeight="700">{z3}</text>
        <text x="48" y="380" fill={PINK} fontSize="46" fontWeight="900">{z4}</text>
      </>
    );
  }
  return (
    <>
      <text x="96" y="170" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">{oben}</text>
      <text x="96" y="246" fill="#ffffff" fontSize={z1.length > 20 ? 56 : 60} fontWeight="900">{z1}</text>
      {z2 && <text x="96" y="312" fill={z2.pink ? PINK : "#ffffff"} fontSize="60" fontWeight="900">{z2.text}</text>}
      <text x="96" y={z2 ? 392 : 330} fill="#d4d4d4" fontSize="46" fontWeight="700">{z3}</text>
      <text x="96" y={z2 ? 448 : 386} fill={PINK} fontSize="46" fontWeight="900">{z4}</text>
      <text x="96" y={z2 ? 512 : 452} fill="#b3b3b3" fontSize="21" fontWeight="500">{unter}</text>
    </>
  );
}

// Nr. 3: Eisberg
function Kuendigung() {
  const breit = (
    <>
      <rect x="0" y="300" width="1600" height="400" fill="#232323" />
      <line x1="0" y1="300" x2="1600" y2="300" stroke="#5a5a5a" strokeWidth="2" />
      <polygon points="860,300 1190,300 1330,410 1300,560 1140,660 920,650 760,540 740,400" fill={PINK} fillOpacity="0.14" stroke={PINK} strokeWidth="2" />
      <polygon points="900,300 960,190 1000,205 1040,130 1100,215 1150,300" fill="#ffffff" />
      <line x1="1112" y1="206" x2="1168" y2="194" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1182" y="202" fill="#ffffff" fontSize="36" fontWeight="800">Gehalt</text>
      <text x="1182" y="238" fill="#b3b3b3" fontSize="22" fontWeight="500">Das wird beim Abschied genannt</text>
      {["Keine Perspektive", "Dauerdruck", "Nicht gefragt werden", "Führung fragt nicht nach"].map((t, i) => (
        <text key={t} x="1040" y={392 + i * 55} fill="#ffffff" fontSize="28" fontWeight="700" textAnchor="middle">{t}</text>
      ))}
      <text x="96" y="150" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">WARUM GUTE LEUTE GEHEN</text>
      <text x="96" y="222" fill="#ffffff" fontSize="60" fontWeight="900">Gesagt wird das Gehalt.</text>
      <text x="96" y="420" fill="#d4d4d4" fontSize="46" fontWeight="700">Gemeint ist meist</text>
      <text x="96" y="476" fill={PINK} fontSize="46" fontWeight="900">etwas anderes.</text>
      <text x="96" y="540" fill="#b3b3b3" fontSize="21" fontWeight="500">Was sich über Monate ansammelt, bleibt unter der Oberfläche.</text>
    </>
  );
  const schmal = (
    <>
      <rect x="0" y="560" width="800" height="340" fill="#232323" />
      <line x1="0" y1="560" x2="800" y2="560" stroke="#5a5a5a" strokeWidth="2" />
      <polygon points="250,560 560,560 680,640 650,780 510,870 320,860 170,770 160,640" fill={PINK} fillOpacity="0.14" stroke={PINK} strokeWidth="2" />
      <polygon points="300,560 350,470 385,482 420,420 470,490 510,560" fill="#ffffff" />
      <text x="530" y="486" fill="#ffffff" fontSize="40" fontWeight="800">Gehalt</text>
      <text x="530" y="524" fill="#b3b3b3" fontSize="22" fontWeight="500">wird genannt</text>
      {["Keine Perspektive", "Dauerdruck", "Nicht gefragt werden", "Führung fragt nicht nach"].map((t, i) => (
        <text key={t} x="415" y={628 + i * 56} fill="#ffffff" fontSize="29" fontWeight="700" textAnchor="middle">{t}</text>
      ))}
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">WARUM GUTE LEUTE GEHEN</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">Gesagt wird</text>
      <text x="48" y="240" fill="#ffffff" fontSize="62" fontWeight="900">das Gehalt.</text>
      <text x="48" y="322" fill="#d4d4d4" fontSize="46" fontWeight="700">Gemeint ist meist</text>
      <text x="48" y="380" fill={PINK} fontSize="46" fontWeight="900">etwas anderes.</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik als Eisberg: Über der Wasserlinie steht das Gehalt, das beim Abschied genannt wird. Darunter liegen keine Perspektive, Dauerdruck, nicht gefragt werden und eine Führung, die nicht nachfragt." />;
}

// Nr. 7: austauschbare Versprechen
const USP_KARTEN = [
  ["Betrieb A", "Qualität", "seit 1987"], ["Betrieb B", "Top Service", ""], ["Betrieb C", "Erfahrung und", "Kompetenz"],
  ["Betrieb D", "Ihr Partner", "in der Region"], null, ["Betrieb E", "Qualität und", "Service"],
  ["Betrieb F", "Persönliche", "Beratung"], ["Betrieb G", "Höchste", "Qualität"], ["Betrieb H", "Alles aus", "einer Hand"],
];
function UspKarten({ x0, y0, w, h, sx, sy, gross }) {
  const fs = gross ? { etikett: 18, text: 26, pink: 25, pinkEtikett: 17, z: [36, 72, 102], pz: [30, 64, 92, 120] } : { etikett: 14, text: 20, pink: 21, pinkEtikett: 13, z: [32, 68, 96], pz: [28, 60, 85, 110] };
  return USP_KARTEN.map((k, i) => {
    const x = x0 + (i % 3) * sx;
    const y = y0 + Math.floor(i / 3) * sy;
    if (!k) {
      return (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="16" fill={PINK} />
          <text x={x + 20} y={y + fs.pz[0]} fill="#2d2d2d" fontSize={fs.pinkEtikett} fontWeight="700">So erzählen es Kunden</text>
          {["Räumt als", "Einziger auf,", "bevor er geht."].map((t, j) => (
            <text key={t} x={x + 20} y={y + fs.pz[j + 1]} fill="#2d2d2d" fontSize={fs.pink} fontWeight="900">{t}</text>
          ))}
        </g>
      );
    }
    return (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} rx="16" fill="#3a3a3a" />
        <text x={x + 20} y={y + fs.z[0]} fill="#8a8a8a" fontSize={fs.etikett} fontWeight="600">{k[0]}</text>
        <text x={x + 20} y={y + fs.z[1]} fill="#d4d4d4" fontSize={fs.text} fontWeight="700">{k[1]}</text>
        {k[2] && <text x={x + 20} y={y + fs.z[2]} fill="#d4d4d4" fontSize={fs.text} fontWeight="700">{k[2]}</text>}
      </g>
    );
  });
}
function Usp() {
  const breit = (
    <>
      <Kopftext oben="ALLEINSTELLUNGSMERKMAL" z1="Alle sagen Qualität." z3="Kunden merken sich" z4="einen Satz." unter="Der Unterschied steckt meist schon im Unternehmen." />
      <UspKarten x0={860} y0={110} w={210} h={120} sx={234} sy={144} />
      <text x="860" y="572" fill="#8a8a8a" fontSize="16" fontWeight="500">Beispiele zur Veranschaulichung</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="ALLEINSTELLUNGSMERKMAL" z1="Alle sagen" z1b={{ text: "Qualität." }} z3="Kunden merken sich" z4="einen Satz." />
      <UspKarten x0={35} y0={430} w={230} h={130} sx={250} sy={145} gross />
      <text x="35" y="880" fill="#8a8a8a" fontSize="20" fontWeight="500">Beispiele zur Veranschaulichung</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Acht graue Kärtchen von Betrieben mit austauschbaren Versprechen wie Qualität seit 1987, Top Service oder Alles aus einer Hand. In der Mitte ein pinkes Kärtchen mit dem Satz, den Kunden erzählen: Räumt als Einziger auf, bevor er geht." />;
}

// Nr. 11: Bestellungen werden still weniger
const BESTELLUNGEN = [300, 290, 295, 270, 250, 235, 200, 170, 130, 95, 60, 30];
function BestellBalken({ x0, schritt, breite, basis }) {
  return BESTELLUNGEN.map((h, i) => {
    const pink = i >= 9;
    return <rect key={i} x={x0 + i * schritt} y={basis - h} width={breite} height={h} rx="4" fill={pink ? PINK : "#6a6a6a"} fillOpacity={pink ? [0.55, 0.75, 1][i - 9] : 1} />;
  });
}
function Konkurrenz() {
  const breit = (
    <>
      <Kopftext oben="KUNDENABWANDERUNG" z1="Kunden kündigen selten." z3="Sie bestellen" z4="einfach weniger." unter="Und niemand fragt, warum." />
      <text x="860" y="200" fill="#b3b3b3" fontSize="18" fontWeight="600">Bestellungen eines Firmenkunden, Monat für Monat</text>
      <BestellBalken x0={860} schritt={54} breite={36} basis={560} />
      <line x1="850" y1="560" x2="1500" y2="560" stroke="#5a5a5a" strokeWidth="2" />
      <line x1="1094" y1="276" x2="1094" y2="302" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1094" y="266" fill="#d4d4d4" fontSize="17" fontWeight="600" textAnchor="middle">Neuer Ansprechpartner</text>
      <line x1="1310" y1="396" x2="1310" y2="422" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1310" y="386" fill="#d4d4d4" fontSize="17" fontWeight="600" textAnchor="middle">Lieferung zu spät</text>
      <text x="1500" y="470" fill="#ff8fa8" fontSize="20" fontWeight="800" textAnchor="end">Bestellt woanders</text>
      <text x="860" y="600" fill="#8a8a8a" fontSize="16" fontWeight="500">Beispiel zur Veranschaulichung</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="KUNDENABWANDERUNG" z1="Kunden kündigen" z1b={{ text: "selten." }} z3="Sie bestellen" z4="einfach weniger." />
      <text x="48" y="456" fill="#b3b3b3" fontSize="22" fontWeight="600">Bestellungen eines Firmenkunden</text>
      <BestellBalken x0={60} schritt={60} breite={44} basis={840} />
      <line x1="48" y1="840" x2="770" y2="840" stroke="#5a5a5a" strokeWidth="2" />
      <line x1="322" y1="530" x2="322" y2="584" stroke="#b3b3b3" strokeWidth="2" />
      <text x="322" y="518" fill="#d4d4d4" fontSize="22" fontWeight="600" textAnchor="middle">Neuer Ansprechpartner</text>
      <line x1="562" y1="642" x2="562" y2="704" stroke="#b3b3b3" strokeWidth="2" />
      <text x="562" y="632" fill="#d4d4d4" fontSize="22" fontWeight="600" textAnchor="middle">Lieferung zu spät</text>
      <text x="770" y="884" fill="#ff8fa8" fontSize="24" fontWeight="800" textAnchor="end">Bestellt woanders</text>
      <text x="48" y="884" fill="#8a8a8a" fontSize="20" fontWeight="500">Beispiel</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Die Bestellungen eines Firmenkunden über zwölf Monate werden Balken für Balken kleiner, nach einem neuen Ansprechpartner und einer verspäteten Lieferung. Am Ende bestellt er woanders. Niemand hat gefragt, warum." />;
}

// Nr. 13: 40 Angebote, 10 Aufträge
function Blatt({ x, y, f, s = 1 }) {
  return (
    <g fill={f}>
      <rect x={x} y={y} width={56 * s} height={72 * s} rx={6 * s} />
      {[[16, 32], [28, 24], [40, 28]].map(([dy, w]) => (
        <rect key={dy} x={x + 12 * s} y={y + dy * s} width={w * s} height={5 * s} rx={2 * s} fill="#000000" fillOpacity="0.22" />
      ))}
    </g>
  );
}
function Abschlussquote() {
  const breit = (
    <>
      <text x="96" y="170" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">ABSCHLUSSQUOTE</text>
      <text x="96" y="244" fill="#ffffff" fontSize="60" fontWeight="900">40 Angebote.</text>
      <text x="96" y="314" fill={PINK} fontSize="60" fontWeight="900">10 Aufträge.</text>
      <text x="96" y="392" fill="#d4d4d4" fontSize="38" fontWeight="700">Woran scheitern</text>
      <text x="96" y="440" fill="#d4d4d4" fontSize="38" fontWeight="700">die anderen 30?</text>
      <text x="96" y="504" fill="#b3b3b3" fontSize="21" fontWeight="500">Nur am Preis liegt es selten.</text>
      {Array.from({ length: 40 }, (_, i) => <Blatt key={i} x={900 + (i % 8) * 70} y={130 + Math.floor(i / 8) * 86} f={i < 10 ? PINK : "#5a5a5a"} />)}
      <text x="900" y="600" fill="#8a8a8a" fontSize="16" fontWeight="500">Rechenbeispiel aus dem Beitrag: 40 Angebote, 10 Aufträge, Quote 25 %</text>
    </>
  );
  const schmal = (
    <>
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">ABSCHLUSSQUOTE</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">40 Angebote.</text>
      <text x="48" y="240" fill={PINK} fontSize="62" fontWeight="900">10 Aufträge.</text>
      <text x="48" y="318" fill="#d4d4d4" fontSize="42" fontWeight="700">Woran scheitern</text>
      <text x="48" y="370" fill="#d4d4d4" fontSize="42" fontWeight="700">die anderen 30?</text>
      {Array.from({ length: 40 }, (_, i) => <Blatt key={i} x={57 + (i % 10) * 70} y={430 + Math.floor(i / 10) * 92} f={i < 10 ? PINK : "#5a5a5a"} s={1.05} />)}
      <text x="48" y="840" fill="#8a8a8a" fontSize="21" fontWeight="500">Rechenbeispiel: 40 Angebote, 10 Aufträge, Quote 25 %</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: 40 Angebote als kleine Blätter, 10 davon pink als Aufträge, 30 grau. Daneben die Frage: Woran scheitern die anderen 30?" />;
}

// Leitartikel: Bericht in der Schublade, drei Pfeile hinaus
function Schublade({ dx = 0, dy = 0, s = 1, pfeilId, karten }) {
  const t = (x, y) => [dx + x * s, dy + y * s];
  const R = ({ x, y, w, h, rx, f }) => { const [a, c] = t(x, y); return <rect x={a} y={c} width={w * s} height={h * s} rx={rx * s} fill={f} />; };
  return (
    <>
      <R x={800} y={360} w={400} h={240} rx={12} f="#3a3a3a" />
      <R x={880} y={200} w={240} h={210} rx={8} f="#e6e6e6" />
      <R x={905} y={225} w={150} h={10} rx={4} f="#9a9a9a" />
      <R x={905} y={245} w={100} h={10} rx={4} f="#9a9a9a" />
      {[[910, 60], [950, 90], [990, 45], [1030, 110], [1070, 70]].map(([x, h]) => <R key={x} x={x} y={380 - h} w={26} h={h} rx={3} f="#9a9a9a" />)}
      <R x={770} y={400} w={460} h={120} rx={10} f="#4f4f4f" />
      <R x={950} y={452} w={100} h={14} rx={7} f="#8a8a8a" />
      {karten.map((k) => {
        const [x1, y1] = t(1130, k.vonY);
        return <line key={k.text} x1={x1} y1={y1} x2={k.zielX} y2={k.y + k.h / 2} stroke={PINK} strokeWidth="3" strokeLinecap="round" markerEnd={`url(#${pfeilId})`} />;
      })}
      {karten.map((k) => (
        <g key={k.text + "k"}>
          <rect x={k.x} y={k.y} width={k.w} height={k.h} rx="16" fill={PINK} />
          <text x={k.x + 22} y={k.y + k.h / 2 + k.fs / 3} fill="#2d2d2d" fontSize={k.fs} fontWeight="900">{k.text}</text>
        </g>
      ))}
    </>
  );
}
function Leitartikel() {
  const marker = (id) => (
    <defs>
      <marker id={id} orient="auto" markerWidth="6" markerHeight="6" refX="3" refY="3" overflow="visible"><path d="M0 0 L6 3 L0 6 Z" fill={PINK} /></marker>
    </defs>
  );
  const texte = ["Positionierung", "Arbeitgebermarke", "Verkaufsargumente"];
  const breit = (
    <>
      {marker("pfeil-leit-breit")}
      <text x="96" y="170" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">MITARBEITERBEFRAGUNG</text>
      <text x="96" y="242" fill="#ffffff" fontSize="56" fontWeight="900">Raus aus der</text>
      <text x="96" y="304" fill="#ffffff" fontSize="56" fontWeight="900">Schublade.</text>
      <text x="96" y="386" fill="#d4d4d4" fontSize="46" fontWeight="700">Rein in deine</text>
      <text x="96" y="442" fill={PINK} fontSize="46" fontWeight="900">Werbung.</text>
      <text x="96" y="506" fill="#b3b3b3" fontSize="21" fontWeight="500">Dieselben Antworten, zwei Richtungen: Führung und Marketing.</text>
      <Schublade pfeilId="pfeil-leit-breit" karten={texte.map((text, i) => ({ text, x: 1270, y: 150 + i * 120, w: 290, h: 90, fs: 24, zielX: 1258, vonY: 280 + i * 10 }))} />
    </>
  );
  const schmal = (
    <>
      {marker("pfeil-leit-schmal")}
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">MITARBEITERBEFRAGUNG</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">Raus aus der</text>
      <text x="48" y="240" fill="#ffffff" fontSize="62" fontWeight="900">Schublade.</text>
      <text x="48" y="322" fill="#d4d4d4" fontSize="46" fontWeight="700">Rein in deine</text>
      <text x="48" y="380" fill={PINK} fontSize="46" fontWeight="900">Werbung.</text>
      <Schublade dx={-520} dy={290} s={0.75} pfeilId="pfeil-leit-schmal" karten={texte.map((text, i) => ({ text, x: 440, y: 450 + i * 125, w: 320, h: 96, fs: 29, zielX: 430, vonY: 280 + i * 10 }))} />
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Ein Bericht mit Balkendiagramm steckt in einer halb offenen Schublade. Drei pinke Pfeile führen aus der Schublade zu Positionierung, Arbeitgebermarke und Verkaufsargumenten." />;
}

export const TITELGRAFIKEN = {
  "warum-kuendigen-gute-mitarbeiter": Kuendigung,
  "alleinstellungsmerkmal-finden": Usp,
  "warum-kaufen-kunden-bei-der-konkurrenz": Konkurrenz,
  "abschlussquote-erhoehen": Abschlussquote,
  "mitarbeiterbefragung-ergebnisse": Leitartikel,
};

export default function Titelgrafik({ slug }) {
  const G = TITELGRAFIKEN[slug];
  return G ? <G /> : null;
}
