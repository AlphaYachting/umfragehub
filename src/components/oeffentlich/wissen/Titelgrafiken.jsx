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
        {/* Ohne z1b rücken z3 und z4 nach oben, sonst entsteht am Handy eine Lücke (05.11.2026). */}
        <text x="48" y={z1b ? 322 : 262} fill="#d4d4d4" fontSize="46" fontWeight="700">{z3}</text>
        <text x="48" y={z1b ? 380 : 320} fill={PINK} fontSize="46" fontWeight="900">{z4}</text>
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

// Nachfolge N1: Eisberg, sichtbares Marketing über der Wasserlinie, der Ruf darunter
function NachfolgeMarketing() {
  const kopf = { oben: "UNTERNEHMENSNACHFOLGE", z1: "Du übernimmst mehr", z3: "als ein Logo.", z4: "Du übernimmst einen Ruf." };
  const breit = (
    <>
      <Kopftext {...kopf} unter="Prüf, was trägt, bevor du etwas änderst." />
      <text x="880" y="250" fill="#b3b3b3" fontSize="17" fontWeight="600">Was jeder sieht</text>
      <text x="880" y="278" fill="#ffffff" fontSize="20" fontWeight="700">Logo, Website, Prospekt</text>
      <polygon points="1110,330 1150,262 1186,226 1226,256 1272,330" fill="#d4d4d4" />
      <line x1="850" y1="330" x2="1510" y2="330" stroke="#8a8a8a" strokeWidth="2" strokeDasharray="10 8" />
      <polygon points="1272,330 1110,330 1000,400 940,500 1010,600 1180,632 1360,592 1440,482 1382,382" fill={PINK} />
      {["Ruf", "Beziehungen", "Sprache im Verkauf"].map((t, i) => (
        <text key={t} x="1190" y={438 + i * 40} fill="#ffffff" fontSize="26" fontWeight="900" textAnchor="middle">{t}</text>
      ))}
      <text x="1190" y="562" fill="#ffe3ea" fontSize="17" fontWeight="600" textAnchor="middle">Was du wirklich übernimmst</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="Du übernimmst" z1b={{ text: "mehr als ein Logo." }} z3="Du übernimmst" z4="einen Ruf." />
      <text x="48" y="462" fill="#b3b3b3" fontSize="24" fontWeight="600">Was jeder sieht</text>
      <text x="48" y="498" fill="#ffffff" fontSize="28" fontWeight="700">Logo, Website, Prospekt</text>
      <polygon points="460,600 500,530 536,494 576,524 622,600" fill="#d4d4d4" />
      <line x1="40" y1="600" x2="760" y2="600" stroke="#8a8a8a" strokeWidth="2" strokeDasharray="10 8" />
      <polygon points="622,600 460,600 340,660 270,750 350,840 540,870 720,835 760,740 700,650" fill={PINK} />
      {["Ruf", "Beziehungen", "Sprache im Verkauf"].map((t, i) => (
        <text key={t} x="515" y={700 + i * 42} fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle">{t}</text>
      ))}
      <text x="515" y="826" fill="#ffe3ea" fontSize="22" fontWeight="600" textAnchor="middle">Was du wirklich übernimmst</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Ein Eisberg. Über der Wasserlinie sind Logo, Website und Prospekt zu sehen. Darunter, viel größer, liegen Ruf, Beziehungen und die Sprache im Verkauf." />;
}

// Nachfolge N2: drei Kreise, in der Mitte der Kern der Marke
function NachfolgeMarke() {
  const kopf = { oben: "GENERATIONENWECHSEL", z1: "Die Marke gehört", z3: "nicht der alten und nicht", z4: "der neuen Generation." };
  const kreise = (k, r, fs, kern) => (
    <>
      <circle cx={k[0][0]} cy={k[0][1]} r={r} fill="#8a8a8a" fillOpacity="0.5" />
      <circle cx={k[1][0]} cy={k[1][1]} r={r} fill="#ffb3c4" fillOpacity="0.45" />
      <circle cx={k[2][0]} cy={k[2][1]} r={r} fill={PINK} fillOpacity="0.55" />
      <text x={k[3][0]} y={k[3][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Übergeber</text>
      <text x={k[4][0]} y={k[4][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Nachfolge</text>
      <text x={k[5][0]} y={k[5][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Kunden</text>
      <text x={k[6][0]} y={k[6][1]} fill="#ffffff" fontSize={kern} fontWeight="900" textAnchor="middle">Kern der</text>
      <text x={k[6][0]} y={k[6][1] + kern * 1.25} fill="#ffffff" fontSize={kern} fontWeight="900" textAnchor="middle">Marke</text>
    </>
  );
  const breit = (
    <>
      <Kopftext {...kopf} unter="Sie gehört den Kunden, die sie im Kopf haben." />
      {kreise([[1060, 320], [1300, 320], [1180, 480], [990, 290], [1370, 290], [1180, 580], [1180, 396]], 150, 22, 19)}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="Die Marke gehört" z1b={{ text: "nicht der alten" }} z3="und nicht der" z4="neuen Generation." />
      {kreise([[290, 570], [510, 570], [400, 740], [222, 545], [578, 545], [400, 838], [400, 628]], 140, 28, 24)}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Drei überlappende Kreise für Übergeber, Nachfolge und Kunden. Wo sich alle drei überschneiden, liegt der Kern der Marke." />;
}

// Nachfolge N3: Zeitleiste in vier Schritten
function NachfolgeKunden() {
  const kopf = { oben: "BETRIEBSÜBERGABE", z1: "Kunden erfahren es", z3: "am besten von euch.", z4: "Nicht von Dritten." };
  const schritte = [["1 Rahmen", "steht fest"], ["2 Team", "weiß es"], ["3 Wichtige", "Kunden, persönlich"], ["4 Alle", "anderen"]];
  const breit = (
    <>
      <Kopftext {...kopf} unter="Persönlich, gemeinsam, sobald der Rahmen steht." />
      <line x1="900" y1="400" x2="1470" y2="400" stroke="#6a6a6a" strokeWidth="4" />
      {schritte.map(([a, b], i) => {
        const x = [900, 1090, 1280, 1460][i];
        const pink = i === 2;
        const oben = i % 2 === 0;
        return (
          <g key={a}>
            <circle cx={x} cy="400" r={pink ? 18 : 12} fill={pink ? PINK : "#d4d4d4"} />
            <text x={x} y={oben ? 330 : 450} fill={pink ? "#ff8fa8" : "#ffffff"} fontSize="20" fontWeight="800" textAnchor="middle">{a}</text>
            <text x={x} y={oben ? 356 : 476} fill="#b3b3b3" fontSize="17" fontWeight="600" textAnchor="middle">{b}</text>
          </g>
        );
      })}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="Kunden erfahren" z1b={{ text: "es am besten" }} z3="von euch." z4="Nicht von Dritten." />
      <line x1="110" y1="470" x2="110" y2="830" stroke="#6a6a6a" strokeWidth="4" />
      {schritte.map(([a, b], i) => {
        const y = 470 + i * 120;
        const pink = i === 2;
        return (
          <g key={a}>
            <circle cx="110" cy={y} r={pink ? 22 : 14} fill={pink ? PINK : "#d4d4d4"} />
            <text x="160" y={y - 4} fill={pink ? "#ff8fa8" : "#ffffff"} fontSize="30" fontWeight="800">{a}</text>
            <text x="160" y={y + 30} fill="#b3b3b3" fontSize="24" fontWeight="600">{b}</text>
          </g>
        );
      })}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Eine Zeitleiste in vier Schritten. Zuerst steht der Rahmen, dann erfährt es das Team, dann die wichtigsten Kunden persönlich, kurz danach alle anderen." />;
}

// Nachfolge N4: fünf Mitarbeitende, vier sagen nichts, eine sagt: Passt schon.
function Figur({ x, y, s = 1, blase }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="110" r="24" fill="#8a8a8a" />
      <path d="M-36 226 v-32 a36 36 0 0 1 72 0 v32 z" fill="#6a6a6a" />
      {blase === "punkte" ? (
        <>
          <rect x="-46" y="6" width="92" height="48" rx="16" fill="#4a4a4a" />
          {[-18, 0, 18].map((d) => <circle key={d} cx={d} cy="30" r="5" fill="#b3b3b3" />)}
        </>
      ) : (
        <>
          <rect x="-82" y="0" width="164" height="56" rx="18" fill={PINK} />
          <text x="0" y="35" fill="#ffffff" fontSize="20" fontWeight="800" textAnchor="middle">{blase}</text>
        </>
      )}
    </g>
  );
}
function NachfolgeTeam() {
  const kopf = { oben: "BETRIEBSÜBERNAHME", z1: "Das Team schaut", z3: "genau hin.", z4: "Und sagt wenig." };
  const blasen = ["punkte", "punkte", "Passt schon.", "punkte", "punkte"];
  const breit = (
    <>
      <Kopftext {...kopf} unter="Was du hörst, hängt davon ab, wie du fragst." />
      {blasen.map((bl, i) => <Figur key={i} x={920 + i * 140} y={330} blase={bl} />)}
      <text x="1200" y="610" fill="#b3b3b3" fontSize="17" fontWeight="600" textAnchor="middle">Was die neue Führung in den ersten Wochen hört</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="Das Team schaut" z1b={{ text: "genau hin." }} z3="Und sagt" z4="wenig." />
      {blasen.map((bl, i) => <Figur key={i} x={100 + i * 150} y={450} s={1.2} blase={bl} />)}
      <text x="400" y="770" fill="#b3b3b3" fontSize="24" fontWeight="600" textAnchor="middle">Was die neue Führung</text>
      <text x="400" y="804" fill="#b3b3b3" fontSize="24" fontWeight="600" textAnchor="middle">in den ersten Wochen hört</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Fünf Mitarbeitende mit Sprechblasen. Vier Sprechblasen zeigen nur drei Punkte, eine sagt: Passt schon." />;
}

// Nachfolge N5: Zeitbalken über 100 Tage in drei Phasen
function NachfolgeHundertTage() {
  const kopf = { oben: "BETRIEBSÜBERNAHME", z1: "100 Tage.", z3: "Erst zuhören,", z4: "dann umbauen." };
  const balken = (x, w, y, h, fsTag, fsText, tagY) =>
    [["Tag 1 bis 30", "Zuhören", "#4a4a4a"], ["Tag 31 bis 60", "Bild holen", "#6a6a6a"], ["Tag 61 bis 100", "Prioritäten", PINK]].map(([tag, text, f], i) => (
      <g key={tag}>
        <text x={x[i]} y={tagY} fill="#b3b3b3" fontSize={fsTag} fontWeight="600">{tag}</text>
        <rect x={x[i]} y={y} width={w[i]} height={h} rx="8" fill={f} />
        <text x={x[i] + w[i] / 2} y={y + h / 2 + fsText * 0.35} fill="#ffffff" fontSize={fsText} fontWeight="800" textAnchor="middle">{text}</text>
      </g>
    ));
  const breit = (
    <>
      <Kopftext {...kopf} unter="Ein Plan in drei Phasen für Kunden, Team und Marke." />
      {balken([880, 1060, 1240], [176, 176, 240], 372, 60, 16, 20, 356)}
      <line x1="1360" y1="300" x2="1360" y2="364" stroke="#ff8fa8" strokeWidth="2" />
      <text x="1360" y="270" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">Erst hier: Marke,</text>
      <text x="1360" y="292" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">Website, Vertrieb</text>
      <text x="880" y="470" fill="#8a8a8a" fontSize="16" fontWeight="600">Tag 0</text>
      <text x="1480" y="470" fill="#8a8a8a" fontSize="16" fontWeight="600" textAnchor="end">Tag 100</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal {...kopf} />
      {balken([40, 254, 468], [210, 210, 292], 610, 84, 25, 29, 592)}
      <line x1="614" y1="520" x2="614" y2="562" stroke="#ff8fa8" strokeWidth="2" />
      <text x="614" y="472" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">Erst hier: Marke,</text>
      <text x="614" y="504" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">Website, Vertrieb</text>
      <text x="40" y="740" fill="#8a8a8a" fontSize="25" fontWeight="600">Tag 0</text>
      <text x="760" y="740" fill="#8a8a8a" fontSize="25" fontWeight="600" textAnchor="end">Tag 100</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Ein Zeitbalken über 100 Tage in drei Phasen: zuhören, ein ehrliches Bild holen, Prioritäten setzen. Erst in der dritten Phase fallen Entscheidungen über Marke, Website und Vertrieb." />;
}

// Nachfolge N6: Was nur du weißt, festgehalten für die Nachfolge
function NachfolgeUebergeber() {
  const inhalt = ["Warum Kunden kaufen", "Wer wen kennt", "Was ihr versprecht"];
  const breit = (
    <>
      <Kopftext oben="BETRIEBSÜBERGABE" z1="Was nur du weißt," z3="geht sonst" z4="mit dir." unter="Halte fest, was deinen Betrieb ausmacht." />
      <circle cx="1030" cy="400" r="165" fill={PINK} />
      <text x="1030" y="318" fill="#ffe3ea" fontSize="17" fontWeight="700" textAnchor="middle">Was nur du weißt</text>
      {inhalt.map((t, i) => <text key={t} x="1030" y={370 + i * 40} fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle">{t}</text>)}
      <line x1="1205" y1="400" x2="1262" y2="400" stroke="#ff8fa8" strokeWidth="4" />
      <polygon points="1262,388 1282,400 1262,412" fill="#ff8fa8" />
      <rect x="1296" y="290" width="190" height="230" rx="12" fill="#f6f5f4" />
      <rect x="1320" y="320" width="110" height="12" rx="6" fill="#b3b3b3" />
      {[142, 128, 142, 100].map((w, i) => <rect key={i} x="1320" y={356 + i * 24} width={w} height="9" rx="4" fill="#d6d3d0" />)}
      <text x="1391" y="490" fill="#2d2d2d" fontSize="18" fontWeight="800" textAnchor="middle">Festgehalten</text>
      <text x="1391" y="560" fill="#b3b3b3" fontSize="16" fontWeight="600" textAnchor="middle">für die Nachfolge</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="BETRIEBSÜBERGABE" z1="Was nur du" z1b={{ text: "weißt," }} z3="geht sonst" z4="mit dir." />
      <circle cx="250" cy="660" r="200" fill={PINK} />
      <text x="250" y="566" fill="#ffe3ea" fontSize="24" fontWeight="700" textAnchor="middle">Was nur du weißt</text>
      {inhalt.map((t, i) => <text key={t} x="250" y={628 + i * 50} fill="#ffffff" fontSize="31" fontWeight="900" textAnchor="middle">{t}</text>)}
      <line x1="458" y1="660" x2="500" y2="660" stroke="#ff8fa8" strokeWidth="5" />
      <polygon points="500,646 522,660 500,674" fill="#ff8fa8" />
      <rect x="536" y="520" width="224" height="280" rx="14" fill="#f6f5f4" />
      <rect x="562" y="556" width="130" height="14" rx="7" fill="#b3b3b3" />
      {[170, 150, 170, 120].map((w, i) => <rect key={i} x="562" y={598 + i * 30} width={w} height="11" rx="5" fill="#d6d3d0" />)}
      <text x="648" y="768" fill="#2d2d2d" fontSize="25" fontWeight="800" textAnchor="middle">Festgehalten</text>
      <text x="648" y="846" fill="#b3b3b3" fontSize="23" fontWeight="600" textAnchor="middle">für die Nachfolge</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Ein pinker Kreis mit der Aufschrift Was nur du weißt: warum Kunden kaufen, wer wen kennt, was ihr versprecht. Ein Pfeil führt zu einem Blatt Papier: festgehalten für die Nachfolge." />;
}

// Nachfolge N7: drei Richtungen laufen in der Sicht von Kunden und Team zusammen
function NachfolgeGesellschafter() {
  const breit = (
    <>
      <Kopftext oben="GESELLSCHAFTER" z1="Drei Gesellschafter." z3="Drei Meinungen." z4="Eine Linie." unter="Mit einer Grundlage, die keinem allein gehört." />
      {[["Tradition", 246], ["Aufbruch", 396], ["Preis", 546]].map(([t, y]) => <text key={t} x="880" y={y} fill="#ffffff" fontSize="22" fontWeight="800">{t}</text>)}
      <path d="M880 262 C 1020 262, 1120 360, 1240 400" fill="none" stroke="#8a8a8a" strokeWidth="5" />
      <path d="M880 412 L 1240 400" fill="none" stroke="#b3b3b3" strokeWidth="5" />
      <path d="M880 562 C 1020 562, 1120 440, 1240 400" fill="none" stroke="#6a6a6a" strokeWidth="5" />
      <circle cx="1250" cy="400" r="22" fill={PINK} />
      <line x1="1272" y1="400" x2="1490" y2="400" stroke={PINK} strokeWidth="8" />
      <polygon points="1490,384 1516,400 1490,416" fill={PINK} />
      <text x="1250" y="350" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">Sicht von Kunden</text>
      <text x="1250" y="372" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">und Team</text>
      <text x="1390" y="446" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle">Eine Linie</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="GESELLSCHAFTER" z1="Drei Gesellschafter." z1b={{ text: "Drei Meinungen." }} z3="Und am Ende" z4="eine Linie." />
      {[["Tradition", 482], ["Aufbruch", 622], ["Preis", 762]].map(([t, y]) => <text key={t} x="48" y={y} fill="#ffffff" fontSize="30" fontWeight="800">{t}</text>)}
      <path d="M48 500 C 250 500, 350 600, 470 640" fill="none" stroke="#8a8a8a" strokeWidth="6" />
      <path d="M48 640 L 470 640" fill="none" stroke="#b3b3b3" strokeWidth="6" />
      <path d="M48 780 C 250 780, 350 680, 470 640" fill="none" stroke="#6a6a6a" strokeWidth="6" />
      <circle cx="484" cy="640" r="28" fill={PINK} />
      <line x1="512" y1="640" x2="728" y2="640" stroke={PINK} strokeWidth="10" />
      <polygon points="728,620 760,640 728,660" fill={PINK} />
      <text x="560" y="560" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">Sicht von Kunden</text>
      <text x="560" y="592" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">und Team</text>
      <text x="630" y="706" fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle">Eine Linie</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Drei Linien mit den Beschriftungen Tradition, Aufbruch und Preis laufen in einem pinken Punkt zusammen, der Sicht von Kunden und Team. Von dort führt eine gemeinsame Linie weiter." />;
}

// Nr. 17: ISO 9001, vier Punkte im Audit, Qualitätskultur neu seit 2026
function Iso9001() {
  const punkte = ["Kompetenz", "Bewusstsein", "Kommunikation"];
  const haken = (cx, cy, s, farbe) => <path d={`M${cx - 10 * s} ${cy} l${7 * s} ${7 * s} l${13 * s} ${-14 * s}`} fill="none" stroke={farbe} strokeWidth={4 * s} strokeLinecap="round" strokeLinejoin="round" />;
  const breit = (
    <>
      <Kopftext oben="ISO 9001" z1="Die Norm fragt:" z3="Kommt Qualität" z4="im Alltag an?" unter="Was der Auditor bei deinem Team sehen will." />
      <rect x="900" y="170" width="580" height="440" rx="22" fill="#ffffff" />
      <text x="944" y="230" fill="#5a5a5a" fontSize="18" fontWeight="700" letterSpacing="3">IM AUDIT</text>
      {punkte.map((t, i) => (
        <g key={t}>
          <circle cx="962" cy={290 + i * 80} r="20" fill="#e8e6e4" />
          {haken(962, 290 + i * 80, 1, "#2d2d2d")}
          <text x="1000" y={300 + i * 80} fill="#2d2d2d" fontSize="28" fontWeight="800">{t}</text>
        </g>
      ))}
      <rect x="930" y="500" width="520" height="80" rx="16" fill="#fff0f3" />
      <circle cx="962" cy="540" r="20" fill={PINK} />
      {haken(962, 540, 1, "#ffffff")}
      <text x="1000" y="550" fill="#2d2d2d" fontSize="28" fontWeight="900">Qualitätskultur</text>
      <rect x="1290" y="522" width="140" height="36" rx="18" fill={PINK} />
      <text x="1360" y="547" fill="#ffffff" fontSize="17" fontWeight="800" textAnchor="middle">NEU 2026</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="ISO 9001" z1="Die Norm fragt:" z3="Kommt Qualität" z4="im Alltag an?" />
      <rect x="48" y="440" width="704" height="420" rx="24" fill="#ffffff" />
      <text x="92" y="500" fill="#5a5a5a" fontSize="22" fontWeight="700" letterSpacing="3">IM AUDIT</text>
      {punkte.map((t, i) => (
        <g key={t}>
          <circle cx="116" cy={560 + i * 78} r="24" fill="#e8e6e4" />
          {haken(116, 560 + i * 78, 1.2, "#2d2d2d")}
          <text x="162" y={572 + i * 78} fill="#2d2d2d" fontSize="34" fontWeight="800">{t}</text>
        </g>
      ))}
      <rect x="76" y="756" width="648" height="84" rx="18" fill="#fff0f3" />
      <circle cx="116" cy="798" r="24" fill={PINK} />
      {haken(116, 798, 1.2, "#ffffff")}
      <text x="162" y="810" fill="#2d2d2d" fontSize="34" fontWeight="900">Qualitätskultur</text>
      <rect x="548" y="776" width="160" height="42" rx="21" fill={PINK} />
      <text x="628" y="805" fill="#ffffff" fontSize="20" fontWeight="800" textAnchor="middle">NEU 2026</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Eine Karte mit der Überschrift Im Audit und vier abgehakten Punkten: Kompetenz, Bewusstsein, Kommunikation und, pink hervorgehoben und als neu 2026 markiert, Qualitätskultur." />;
}

// Nr. 18: ISO 45001, Konsultation, Beteiligung und die Evaluierung nach dem Gesetz
function Iso45001() {
  const felder = [
    { oben: "KONSULTATION", text: "Meinungen einholen", art: "grau" },
    { oben: "BETEILIGUNG", text: "Mitentscheiden", art: "pink" },
    { oben: "GESETZ", text: "Evaluierung psychischer Belastungen", art: "rand" },
  ];
  const feld = (f, x, y, w, h, gross) => (
    <g key={f.oben}>
      {f.art === "rand"
        ? <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx="18" fill="none" stroke="#ffffff" strokeWidth="3" />
        : <rect x={x} y={y} width={w} height={h} rx="18" fill={f.art === "pink" ? PINK : "#4a4a4a"} />}
      <text x={x + 40} y={y + 42 * gross} fill={f.art === "pink" ? "#ffe3ea" : "#b3b3b3"} fontSize={17 * gross} fontWeight="700" letterSpacing="3">{f.oben}</text>
      <text x={x + 40} y={y + 86 * gross} fill="#ffffff" fontSize={(f.art === "rand" ? 26 : 30) * gross} fontWeight={f.art === "pink" ? 900 : 800}>{f.text}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="ISO 45001" z1="Fragen ist gut." z3="Mitentscheiden" z4="ist Pflicht." unter="Und die Evaluierung hat eigene Regeln." />
      {felder.map((f, i) => feld(f, 900, 190 + i * 140, 580, 110, 1))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="ISO 45001" z1="Fragen ist gut." z3="Mitentscheiden" z4="ist Pflicht." />
      {felder.map((f, i) => feld({ ...f, text: f.art === "rand" ? "Evaluierung psychischer Belastung" : f.text }, 48, 440 + i * 144, 704, 124, 1.25))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Drei Felder untereinander. Konsultation: Meinungen einholen. Beteiligung, pink hervorgehoben: mitentscheiden. Gesetz: Evaluierung psychischer Belastungen." />;
}

// Nr. 19: KI im Betrieb einführen, 85 % erwarten negative Folgen für den Arbeitsmarkt, vier Fragen vor der Einführung
function KiTeam() {
  const fragen = [
    { text: "Wer nutzt was?", pink: false },
    { text: "Wovor Angst?", pink: true },
    { text: "Welche Schulung?", pink: false },
    { text: "Welche Ideen?", pink: false },
  ];
  const kachel = (f, i, x0, y0, w, h, abstandX, abstandY, gross) => {
    const x = x0 + (i % 2) * (w + abstandX);
    const y = y0 + Math.floor(i / 2) * (h + abstandY);
    return (
      <g key={f.text}>
        <rect x={x} y={y} width={w} height={h} rx="16" fill={f.pink ? PINK : "#4a4a4a"} />
        <text x={x + 28} y={y + h / 2 + 9 * gross} fill="#ffffff" fontSize={26 * gross} fontWeight={f.pink ? 900 : 800}>{f.text}</text>
      </g>
    );
  };
  const breit = (
    <>
      <Kopftext oben="KI IM BETRIEB" z1="KI kommt." z3="Was denkt" z4="dein Team?" unter="Wer nutzt schon was, und wovor hat es Angst?" />
      <rect x="900" y="170" width="580" height="200" rx="22" fill="#ffffff" />
      <text x="940" y="214" fill="#5a5a5a" fontSize="16" fontWeight="700" letterSpacing="3">ÖSTERREICH, ALLIANZ PULSE 2026</text>
      <text x="940" y="316" fill={PINK} fontSize="84" fontWeight="900">85 %</text>
      {["erwarten negative", "Folgen von KI für", "den Arbeitsmarkt."].map((z, i) => (
        <text key={z} x="1160" y={272 + i * 32} fill="#2d2d2d" fontSize="24" fontWeight="800">{z}</text>
      ))}
      <text x="900" y="420" fill="#b3b3b3" fontSize="17" fontWeight="700" letterSpacing="3">VOR DER EINFÜHRUNG FRAGEN</text>
      {fragen.map((f, i) => kachel(f, i, 900, 444, 285, 80, 10, 16, 1))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="KI IM BETRIEB" z1="KI kommt." z3="Was denkt" z4="dein Team?" />
      <rect x="48" y="440" width="704" height="200" rx="24" fill="#ffffff" />
      <text x="88" y="484" fill="#5a5a5a" fontSize="24" fontWeight="700" letterSpacing="2">ÖSTERREICH, ALLIANZ PULSE 2026</text>
      <text x="88" y="600" fill={PINK} fontSize="96" fontWeight="900">85 %</text>
      {["erwarten negative", "Folgen von KI für", "den Arbeitsmarkt."].map((z, i) => (
        <text key={z} x="340" y={548 + i * 34} fill="#2d2d2d" fontSize="28" fontWeight="800">{z}</text>
      ))}
      {fragen.map((f, i) => kachel(f, i, 48, 664, 344, 90, 16, 16, 1.15))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Eine Karte zeigt 85 Prozent, die in Österreich negative Folgen von KI für den Arbeitsmarkt erwarten. Darunter vier Fragen vor der Einführung: Wer nutzt was, wovor Angst, pink hervorgehoben, welche Schulung und welche Ideen." />;
}

// Nr. 20: Mitarbeiter halten, wenn die Lohnerhöhung klein ausfällt. Lohn gegen Preise, darunter was außerdem hält
function MitarbeiterHalten() {
  const felder = [
    { text: "Tätigkeit", pink: true },
    { text: "Entwicklung" },
    { text: "Mitsprache" },
    { text: "Führung" },
  ];
  const balken = [
    { text: "Ist-Löhne Metaller", wert: "1,9 %", anteil: 1.9, farbe: "#ffffff" },
    { text: "Rollierende Inflation", wert: "3,3 %", anteil: 3.3, farbe: PINK },
  ];
  const breit = (
    <>
      <Kopftext oben="LOHNRUNDE 2026" z1="Wenig Plus." z3="Was hält dein" z4="Team trotzdem?" unter="Was außer Geld bindet und wie du es erfährst." />
      <rect x="900" y="170" width="580" height="206" rx="22" fill="#4a4a4a" />
      <text x="940" y="214" fill="#b3b3b3" fontSize="17" fontWeight="700" letterSpacing="3">LOHN GEGEN PREISE</text>
      {balken.map((b, i) => (
        <g key={b.text}>
          <text x="940" y={254 + i * 70} fill="#ffffff" fontSize="22" fontWeight="700">{b.text}</text>
          <rect x="940" y={266 + i * 70} width={Math.round(b.anteil * 111.2)} height="22" rx="11" fill={b.farbe} />
          <text x={956 + Math.round(b.anteil * 111.2)} y={285 + i * 70} fill="#ffffff" fontSize="24" fontWeight="900">{b.wert}</text>
        </g>
      ))}
      <rect x="900" y="400" width="580" height="216" rx="22" fill="#ffffff" />
      <text x="940" y="444" fill="#5a5a5a" fontSize="17" fontWeight="700" letterSpacing="3">WAS AUSSERDEM HÄLT</text>
      {felder.map((f, i) => {
        const x = 940 + (i % 2) * 260;
        const y = 466 + Math.floor(i / 2) * 72;
        return (
          <g key={f.text}>
            <rect x={x} y={y} width="240" height="56" rx="18" fill={f.pink ? PINK : "#e8e6e4"} />
            <text x={x + 120} y={y + 36} fill={f.pink ? "#ffffff" : "#2d2d2d"} fontSize="24" fontWeight={f.pink ? 900 : 800} textAnchor="middle">{f.text}</text>
          </g>
        );
      })}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="LOHNRUNDE 2026" z1="Wenig Plus." z3="Was hält dein" z4="Team trotzdem?" />
      <rect x="48" y="440" width="704" height="200" rx="24" fill="#4a4a4a" />
      <text x="88" y="484" fill="#b3b3b3" fontSize="24" fontWeight="700" letterSpacing="3">LOHN GEGEN PREISE</text>
      {balken.map((b, i) => (
        <g key={b.text}>
          <text x="88" y={524 + i * 66} fill="#ffffff" fontSize="26" fontWeight="700">{b.text}</text>
          <rect x="88" y={536 + i * 66} width={Math.round(b.anteil * 140)} height="22" rx="11" fill={b.farbe} />
          <text x={104 + Math.round(b.anteil * 140)} y={556 + i * 66} fill="#ffffff" fontSize="28" fontWeight="900">{b.wert}</text>
        </g>
      ))}
      <rect x="48" y="660" width="704" height="200" rx="24" fill="#ffffff" />
      <text x="88" y="702" fill="#5a5a5a" fontSize="24" fontWeight="700" letterSpacing="3">WAS AUSSERDEM HÄLT</text>
      {felder.map((f, i) => {
        const x = 88 + (i % 2) * 320;
        const y = 722 + Math.floor(i / 2) * 66;
        return (
          <g key={f.text}>
            <rect x={x} y={y} width="304" height="54" rx="18" fill={f.pink ? PINK : "#e8e6e4"} />
            <text x={x + 152} y={y + 36} fill={f.pink ? "#ffffff" : "#2d2d2d"} fontSize="28" fontWeight={f.pink ? 900 : 800} textAnchor="middle">{f.text}</text>
          </g>
        );
      })}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Oben ein Vergleich in Balken, Ist-Löhne der Metallindustrie plus 1,9 Prozent gegen rollierende Inflation 3,3 Prozent. Darunter eine Karte mit der Überschrift Was außerdem hält und vier Feldern: Tätigkeit, pink hervorgehoben, Entwicklung, Mitsprache und Führung." />;
}

// Nr. 21: Personalabbau, zwölf Personen, vier gegangen, zwei wackeln
function Personalabbau() {
  const weg = ["0-1", "1-3", "2-0", "2-2"];
  const pink = ["0-3", "1-1"];
  const person = (key, cx, cy, s) => {
    const r = 22 * s, bw = 68 * s, bh = 44 * s, abstand = 30 * s;
    if (weg.includes(key)) {
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#7a7a7a" strokeWidth={3 * s} strokeDasharray={`${6 * s} ${6 * s}`} />
          <rect x={cx - bw / 2} y={cy + abstand} width={bw} height={bh} rx={bh / 2} fill="none" stroke="#7a7a7a" strokeWidth={3 * s} strokeDasharray={`${6 * s} ${6 * s}`} />
        </g>
      );
    }
    const farbe = pink.includes(key) ? PINK : "#ffffff";
    return (
      <g key={key}>
        <circle cx={cx} cy={cy} r={r} fill={farbe} />
        <rect x={cx - bw / 2} y={cy + abstand} width={bw} height={bh} rx={bh / 2} fill={farbe} />
      </g>
    );
  };
  const raster = (x0, y0, dx, dy, s) => {
    const out = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) out.push(person(`${r}-${c}`, x0 + c * dx, y0 + r * dy, s));
    }
    return out;
  };
  const breit = (
    <>
      <Kopftext oben="PERSONALABBAU" z1="Nach dem Abbau" z3="zählen die," z4="die bleiben." unter="Wie du sie hältst, wenn das Klima kippt." />
      <text x="910" y="200" fill="#b3b3b3" fontSize="18" fontWeight="700" letterSpacing="3">NACH DEM ABBAU</text>
      {raster(980, 260, 140, 110, 1)}
      <circle cx="922" cy="596" r="10" fill={PINK} />
      <text x="944" y="605" fill="#ffffff" fontSize="28" fontWeight="800">Wo wackelt es, und warum?</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="PERSONALABBAU" z1="Nach dem Abbau" z3="zählen die," z4="die bleiben." />
      <text x="72" y="462" fill="#b3b3b3" fontSize="24" fontWeight="700" letterSpacing="3">NACH DEM ABBAU</text>
      {raster(160, 512, 160, 116, 1.1)}
      <circle cx="84" cy="848" r="12" fill={PINK} />
      <text x="110" y="858" fill="#ffffff" fontSize="32" fontWeight="800">Wo wackelt es, und warum?</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Zwölf Personensymbole in drei Reihen unter der Überschrift Nach dem Abbau. Vier sind nur gestrichelt umrandet, sie sind gegangen. Acht sind weiß, zwei davon pink hervorgehoben. Darunter die Frage: Wo wackelt es, und warum?" />;
}

// Nr. 22: Preiserhöhung Kunden mitteilen, Kosten, Wert und Argument
function Preiserhoehung() {
  const felder = [
    { oben: "KOSTEN", text: "Energie plus 16,5 %", art: "grau" },
    { oben: "WERT", text: "Wofür Kunden zahlen", art: "pink" },
    { oben: "ARGUMENT", text: "Was sie bei dir hält", art: "rand" },
  ];
  const feld = (f, x, y, w, h, oben, gross, yo, yt) => (
    <g key={f.oben}>
      {f.art === "rand"
        ? <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx="18" fill="none" stroke="#ffffff" strokeWidth="3" />
        : <rect x={x} y={y} width={w} height={h} rx="18" fill={f.art === "pink" ? PINK : "#4a4a4a"} />}
      <text x={x + 40} y={y + yo} fill={f.art === "pink" ? "#ffe3ea" : "#b3b3b3"} fontSize={oben} fontWeight="700" letterSpacing="3">{f.oben}</text>
      <text x={x + 40} y={y + yt} fill="#ffffff" fontSize={gross} fontWeight={f.art === "pink" ? 900 : 800}>{f.text}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="PREISERHÖHUNG" z1="Preise erhöhen?" z3="Frag zuerst," z4="wofür sie zahlen" unter="Was Kunden hält, wenn der Preis steigt." />
      {felder.map((f, i) => feld(f, 900, 190 + i * 140, 580, 110, 17, 30, 42, 86))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="PREISERHÖHUNG" z1="Preise erhöhen?" z3="Frag zuerst," z4="wofür sie zahlen" />
      {felder.map((f, i) => feld(f, 48, 440 + i * 144, 704, 124, 24, 38, 46, 100))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Drei Felder untereinander. Kosten: Energie plus 16,5 Prozent. Wert, pink hervorgehoben: Wofür Kunden zahlen. Argument: Was sie bei dir hält." />;
}

// Nr. 23: Vertrieb ankurbeln im Aufschwung, drei Kundengruppen und wer zuerst wieder kauft
function VertriebAnkurbeln() {
  const zeilen = [
    { name: "Export und Investitionen", status: "kauft schon wieder", art: "pink" },
    { name: "Lageraufbau", status: "kauft auf Vorrat", art: "grau" },
    { name: "Bau und Konsum", status: "wartet noch", art: "rand" },
  ];
  const zeile = (z, x, y, w, h, s) => (
    <g key={z.name}>
      {z.art === "rand"
        ? <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} rx="16" fill="none" stroke="#d6d3d0" strokeWidth="2" />
        : <rect x={x} y={y} width={w} height={h} rx="16" fill={z.art === "pink" ? "#fff0f3" : "#f6f5f4"} />}
      {z.art === "rand"
        ? <circle cx={x + 42 * s} cy={y + h / 2} r={16 * s} fill="none" stroke="#8a8a8a" strokeWidth="3" />
        : <circle cx={x + 42 * s} cy={y + h / 2} r={18 * s} fill={z.art === "pink" ? PINK : "#8a8a8a"} />}
      <text x={x + 80 * s} y={y + h / 2 - 6 * s} fill="#2d2d2d" fontSize={26 * s} fontWeight={z.art === "pink" ? 900 : 800}>{z.name}</text>
      <text x={x + 80 * s} y={y + h / 2 + 28 * s} fill={z.art === "pink" ? "#c4103f" : "#5a5a5a"} fontSize={20 * s} fontWeight="700">{z.status}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="VERTRIEB IM AUFSCHWUNG" z1="Es zieht an." z3="Aber wer kauft" z4="zuerst wieder?" unter="Und warum? Frag Verkäufer und Kunden." />
      <rect x="900" y="170" width="580" height="440" rx="22" fill="#ffffff" />
      <text x="944" y="226" fill="#5a5a5a" fontSize="18" fontWeight="700" letterSpacing="3">DEINE KUNDEN IM AUFSCHWUNG</text>
      {zeilen.map((z, i) => zeile(z, 930, 262 + i * 112, 520, 96, 1))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="VERTRIEB IM AUFSCHWUNG" z1="Es zieht an." z3="Aber wer kauft" z4="zuerst wieder?" />
      <rect x="48" y="440" width="704" height="420" rx="24" fill="#ffffff" />
      <text x="92" y="494" fill="#5a5a5a" fontSize="24" fontWeight="700" letterSpacing="3">DEINE KUNDEN</text>
      {zeilen.map((z, i) => zeile(z, 76, 520 + i * 110, 648, 98, 1.2))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Titelgrafik: Eine Karte mit der Überschrift Deine Kunden im Aufschwung und drei Zeilen. Pink hervorgehoben: Export und Investitionen, kauft schon wieder. Grau: Lageraufbau, kauft auf Vorrat. Umrandet: Bau und Konsum, wartet noch." />;
}

export const TITELGRAFIKEN = {
  "vertrieb-ankurbeln": VertriebAnkurbeln,
  "preiserhoehung-kunden-mitteilen": Preiserhoehung,
  "personalabbau-mitarbeiter-halten": Personalabbau,
  "mitarbeiter-halten-ohne-gehaltserhoehung": MitarbeiterHalten,
  "ki-einfuehren-mitarbeiter": KiTeam,
  "mitarbeiterbefragung-iso-9001": Iso9001,
  "mitarbeiterbefragung-iso-45001": Iso45001,
  "betriebsuebergabe-vorbereiten": NachfolgeUebergeber,
  "gesellschafter-uneinig-marketing": NachfolgeGesellschafter,
  "unternehmensnachfolge-marketing": NachfolgeMarketing,
  "generationenwechsel-familienunternehmen-marke": NachfolgeMarke,
  "betriebsuebergabe-kunden-informieren": NachfolgeKunden,
  "mitarbeiter-nach-betriebsuebernahme": NachfolgeTeam,
  "betriebsuebernahme-erste-100-tage": NachfolgeHundertTage,
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
