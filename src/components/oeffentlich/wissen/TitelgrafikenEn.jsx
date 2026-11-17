import React from "react";

// English title graphics for the insights section (/en/insights), 17 November 2026.
// Adapted from Titelgrafiken.jsx; keys are the English slugs. Only the 17 graphics with an English post are kept.
// Each graphic exists twice: wide 1600 x 700 from 640 px screen width, and narrow 800 x 900 on phones,
// so the text in the picture stays readable on a phone. Geometry, colours and coordinates match the German file;
// only texts and labels are English. No screenshots of the software, no invented figures; examples are marked as such.

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

// Text block on the left (wide) or at the top (narrow)
function Kopftext({ schmal, oben, z1, z2, z3, z4, unter, z1b }) {
  if (schmal) {
    return (
      <>
        <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">{oben}</text>
        <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">{z1}</text>
        {z1b && <text x="48" y="240" fill={z1b.pink ? PINK : "#ffffff"} fontSize="62" fontWeight="900">{z1b.text}</text>}
        {/* Without z1b, z3 and z4 move up so there is no gap on phones. */}
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

const UNTER_WASSER = ["No prospects", "Constant pressure", "Not being asked", "Leaders don't follow up"];

// Why good employees quit: iceberg
function Kuendigung() {
  const breit = (
    <>
      <rect x="0" y="300" width="1600" height="400" fill="#232323" />
      <line x1="0" y1="300" x2="1600" y2="300" stroke="#5a5a5a" strokeWidth="2" />
      <polygon points="860,300 1190,300 1330,410 1300,560 1140,660 920,650 760,540 740,400" fill={PINK} fillOpacity="0.14" stroke={PINK} strokeWidth="2" />
      <polygon points="900,300 960,190 1000,205 1040,130 1100,215 1150,300" fill="#ffffff" />
      <line x1="1112" y1="206" x2="1168" y2="194" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1182" y="202" fill="#ffffff" fontSize="36" fontWeight="800">Salary</text>
      <text x="1182" y="238" fill="#b3b3b3" fontSize="22" fontWeight="500">What people say when they leave</text>
      {UNTER_WASSER.map((t, i) => (
        <text key={t} x="1040" y={392 + i * 55} fill="#ffffff" fontSize="28" fontWeight="700" textAnchor="middle">{t}</text>
      ))}
      <text x="96" y="150" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">WHY GOOD PEOPLE LEAVE</text>
      <text x="96" y="222" fill="#ffffff" fontSize="60" fontWeight="900">{"They say it's the pay."}</text>
      <text x="96" y="420" fill="#d4d4d4" fontSize="46" fontWeight="700">What they usually mean</text>
      <text x="96" y="476" fill={PINK} fontSize="46" fontWeight="900">is something else.</text>
      <text x="96" y="540" fill="#b3b3b3" fontSize="21" fontWeight="500">What builds up over months stays below the surface.</text>
    </>
  );
  const schmal = (
    <>
      <rect x="0" y="560" width="800" height="340" fill="#232323" />
      <line x1="0" y1="560" x2="800" y2="560" stroke="#5a5a5a" strokeWidth="2" />
      <polygon points="250,560 560,560 680,640 650,780 510,870 320,860 170,770 160,640" fill={PINK} fillOpacity="0.14" stroke={PINK} strokeWidth="2" />
      <polygon points="300,560 350,470 385,482 420,420 470,490 510,560" fill="#ffffff" />
      <text x="530" y="486" fill="#ffffff" fontSize="40" fontWeight="800">Salary</text>
      <text x="530" y="524" fill="#b3b3b3" fontSize="22" fontWeight="500">is what they say</text>
      {UNTER_WASSER.map((t, i) => (
        <text key={t} x="415" y={628 + i * 56} fill="#ffffff" fontSize="29" fontWeight="700" textAnchor="middle">{t}</text>
      ))}
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">WHY GOOD PEOPLE LEAVE</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">They say</text>
      <text x="48" y="240" fill="#ffffff" fontSize="62" fontWeight="900">{"it's the pay."}</text>
      <text x="48" y="322" fill="#d4d4d4" fontSize="46" fontWeight="700">What they usually mean</text>
      <text x="48" y="380" fill={PINK} fontSize="46" fontWeight="900">is something else.</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic shaped like an iceberg: above the waterline is the salary, the reason people give when they leave. Below it lie no prospects, constant pressure, not being asked and leaders who don't follow up." />;
}

// Find your USP: interchangeable promises
const USP_KARTEN = [
  ["Company A", "Quality", "since 1987"], ["Company B", "Top service", ""], ["Company C", "Experience and", "expertise"],
  ["Company D", "Your local", "partner"], null, ["Company E", "Quality and", "service"],
  ["Company F", "Personal", "advice"], ["Company G", "Highest", "quality"], ["Company H", "Your one-stop", "shop"],
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
          <text x={x + 20} y={y + fs.pz[0]} fill="#2d2d2d" fontSize={fs.pinkEtikett} fontWeight="700">What customers say</text>
          {["The only one", "who tidies up", "before leaving."].map((t, j) => (
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
      <Kopftext oben="UNIQUE SELLING POINT" z1="Everyone says quality." z3="Customers remember" z4="one sentence." unter="What sets you apart is usually already there." />
      <UspKarten x0={860} y0={110} w={210} h={120} sx={234} sy={144} />
      <text x="860" y="572" fill="#8a8a8a" fontSize="16" fontWeight="500">Examples for illustration</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="UNIQUE SELLING POINT" z1="Everyone says" z1b={{ text: "quality." }} z3="Customers remember" z4="one sentence." />
      <UspKarten x0={35} y0={430} w={230} h={130} sx={250} sy={145} gross />
      <text x="35" y="880" fill="#8a8a8a" fontSize="20" fontWeight="500">Examples for illustration</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: eight grey cards from companies with interchangeable promises such as quality since 1987, top service or your one-stop shop. In the middle a pink card with the sentence customers actually say: the only one who tidies up before leaving." />;
}

// Why customers buy from competitors: orders quietly decline
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
      <Kopftext oben="CUSTOMER CHURN" z1="Customers rarely leave." z3="They simply" z4="order less." unter="And nobody asks why." />
      <text x="860" y="200" fill="#b3b3b3" fontSize="18" fontWeight="600">Orders from one business customer, month by month</text>
      <BestellBalken x0={860} schritt={54} breite={36} basis={560} />
      <line x1="850" y1="560" x2="1500" y2="560" stroke="#5a5a5a" strokeWidth="2" />
      <line x1="1094" y1="276" x2="1094" y2="302" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1094" y="266" fill="#d4d4d4" fontSize="17" fontWeight="600" textAnchor="middle">New contact person</text>
      <line x1="1310" y1="396" x2="1310" y2="422" stroke="#b3b3b3" strokeWidth="2" />
      <text x="1310" y="386" fill="#d4d4d4" fontSize="17" fontWeight="600" textAnchor="middle">Late delivery</text>
      <text x="1500" y="470" fill="#ff8fa8" fontSize="20" fontWeight="800" textAnchor="end">Orders elsewhere</text>
      <text x="860" y="600" fill="#8a8a8a" fontSize="16" fontWeight="500">Example for illustration</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="CUSTOMER CHURN" z1="Customers rarely" z1b={{ text: "leave." }} z3="They simply" z4="order less." />
      <text x="48" y="456" fill="#b3b3b3" fontSize="22" fontWeight="600">Orders from one business customer</text>
      <BestellBalken x0={60} schritt={60} breite={44} basis={840} />
      <line x1="48" y1="840" x2="770" y2="840" stroke="#5a5a5a" strokeWidth="2" />
      <line x1="322" y1="530" x2="322" y2="584" stroke="#b3b3b3" strokeWidth="2" />
      <text x="322" y="518" fill="#d4d4d4" fontSize="22" fontWeight="600" textAnchor="middle">New contact person</text>
      <line x1="562" y1="642" x2="562" y2="704" stroke="#b3b3b3" strokeWidth="2" />
      <text x="562" y="632" fill="#d4d4d4" fontSize="22" fontWeight="600" textAnchor="middle">Late delivery</text>
      <text x="770" y="884" fill="#ff8fa8" fontSize="24" fontWeight="800" textAnchor="end">Orders elsewhere</text>
      <text x="48" y="884" fill="#8a8a8a" fontSize="20" fontWeight="500">Example</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a business customer's orders over twelve months shrink bar by bar, after a new contact person and a late delivery. In the end the customer orders elsewhere. Nobody asked why." />;
}

// Increase close rate: 40 quotes, 10 orders
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
      <text x="96" y="170" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">CLOSE RATE</text>
      <text x="96" y="244" fill="#ffffff" fontSize="60" fontWeight="900">40 quotes.</text>
      <text x="96" y="314" fill={PINK} fontSize="60" fontWeight="900">10 orders.</text>
      <text x="96" y="392" fill="#d4d4d4" fontSize="38" fontWeight="700">Why did the</text>
      <text x="96" y="440" fill="#d4d4d4" fontSize="38" fontWeight="700">other 30 fail?</text>
      <text x="96" y="504" fill="#b3b3b3" fontSize="21" fontWeight="500">It is rarely just the price.</text>
      {Array.from({ length: 40 }, (_, i) => <Blatt key={i} x={900 + (i % 8) * 70} y={130 + Math.floor(i / 8) * 86} f={i < 10 ? PINK : "#5a5a5a"} />)}
      <text x="900" y="600" fill="#8a8a8a" fontSize="16" fontWeight="500">Worked example from the article: 40 quotes, 10 orders, close rate 25%</text>
    </>
  );
  const schmal = (
    <>
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">CLOSE RATE</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">40 quotes.</text>
      <text x="48" y="240" fill={PINK} fontSize="62" fontWeight="900">10 orders.</text>
      <text x="48" y="318" fill="#d4d4d4" fontSize="42" fontWeight="700">Why did the</text>
      <text x="48" y="370" fill="#d4d4d4" fontSize="42" fontWeight="700">other 30 fail?</text>
      {Array.from({ length: 40 }, (_, i) => <Blatt key={i} x={57 + (i % 10) * 70} y={430 + Math.floor(i / 10) * 92} f={i < 10 ? PINK : "#5a5a5a"} s={1.05} />)}
      <text x="48" y="840" fill="#8a8a8a" fontSize="21" fontWeight="500">Worked example: 40 quotes, 10 orders, close rate 25%</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: 40 quotes shown as small sheets, 10 of them pink as orders, 30 grey. Next to them the question: why did the other 30 fail?" />;
}

// Featured article: report in the drawer, three arrows out
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
  const texte = ["Positioning", "Employer brand", "Selling points"];
  const breit = (
    <>
      {marker("pfeil-leit-breit-en")}
      <text x="96" y="170" fill="#ff8fa8" fontSize="20" fontWeight="600" letterSpacing="4">EMPLOYEE SURVEY</text>
      <text x="96" y="242" fill="#ffffff" fontSize="56" fontWeight="900">Out of the</text>
      <text x="96" y="304" fill="#ffffff" fontSize="56" fontWeight="900">drawer.</text>
      <text x="96" y="386" fill="#d4d4d4" fontSize="46" fontWeight="700">Into your</text>
      <text x="96" y="442" fill={PINK} fontSize="46" fontWeight="900">advertising.</text>
      <text x="96" y="506" fill="#b3b3b3" fontSize="21" fontWeight="500">The same answers, two directions: leadership and marketing.</text>
      <Schublade pfeilId="pfeil-leit-breit-en" karten={texte.map((text, i) => ({ text, x: 1270, y: 150 + i * 120, w: 290, h: 90, fs: 24, zielX: 1258, vonY: 280 + i * 10 }))} />
    </>
  );
  const schmal = (
    <>
      {marker("pfeil-leit-schmal-en")}
      <text x="48" y="92" fill="#ff8fa8" fontSize="26" fontWeight="600" letterSpacing="4">EMPLOYEE SURVEY</text>
      <text x="48" y="172" fill="#ffffff" fontSize="62" fontWeight="900">Out of the</text>
      <text x="48" y="240" fill="#ffffff" fontSize="62" fontWeight="900">drawer.</text>
      <text x="48" y="322" fill="#d4d4d4" fontSize="46" fontWeight="700">Into your</text>
      <text x="48" y="380" fill={PINK} fontSize="46" fontWeight="900">advertising.</text>
      <Schublade dx={-520} dy={290} s={0.75} pfeilId="pfeil-leit-schmal-en" karten={texte.map((text, i) => ({ text, x: 440, y: 450 + i * 125, w: 320, h: 96, fs: 29, zielX: 430, vonY: 280 + i * 10 }))} />
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a report with a bar chart sits in a half-open drawer. Three pink arrows lead out of the drawer to positioning, employer brand and selling points." />;
}

// Succession 1: iceberg, visible marketing above the waterline, reputation below
function NachfolgeMarketing() {
  const kopf = { oben: "BUSINESS SUCCESSION", z1: "You take over more", z3: "than a logo.", z4: "You take over a reputation." };
  const breit = (
    <>
      <Kopftext {...kopf} unter="Check what holds before you change anything." />
      <text x="880" y="250" fill="#b3b3b3" fontSize="17" fontWeight="600">What everyone sees</text>
      <text x="880" y="278" fill="#ffffff" fontSize="20" fontWeight="700">Logo, website, brochure</text>
      <polygon points="1110,330 1150,262 1186,226 1226,256 1272,330" fill="#d4d4d4" />
      <line x1="850" y1="330" x2="1510" y2="330" stroke="#8a8a8a" strokeWidth="2" strokeDasharray="10 8" />
      <polygon points="1272,330 1110,330 1000,400 940,500 1010,600 1180,632 1360,592 1440,482 1382,382" fill={PINK} />
      {["Reputation", "Relationships", "Sales language"].map((t, i) => (
        <text key={t} x="1190" y={438 + i * 40} fill="#ffffff" fontSize="26" fontWeight="900" textAnchor="middle">{t}</text>
      ))}
      <text x="1190" y="562" fill="#ffe3ea" fontSize="17" fontWeight="600" textAnchor="middle">What you really take over</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="You take over" z1b={{ text: "more than a logo." }} z3="You take over" z4="a reputation." />
      <text x="48" y="462" fill="#b3b3b3" fontSize="24" fontWeight="600">What everyone sees</text>
      <text x="48" y="498" fill="#ffffff" fontSize="28" fontWeight="700">Logo, website, brochure</text>
      <polygon points="460,600 500,530 536,494 576,524 622,600" fill="#d4d4d4" />
      <line x1="40" y1="600" x2="760" y2="600" stroke="#8a8a8a" strokeWidth="2" strokeDasharray="10 8" />
      <polygon points="622,600 460,600 340,660 270,750 350,840 540,870 720,835 760,740 700,650" fill={PINK} />
      {["Reputation", "Relationships", "Sales language"].map((t, i) => (
        <text key={t} x="515" y={700 + i * 42} fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle">{t}</text>
      ))}
      <text x="515" y="826" fill="#ffe3ea" fontSize="22" fontWeight="600" textAnchor="middle">What you really take over</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: an iceberg. Above the waterline are the logo, website and brochure. Below it, much larger, lie reputation, relationships and the language used in sales." />;
}

// Succession 2: three circles, the core of the brand in the middle
function NachfolgeMarke() {
  const kopf = { oben: "GENERATIONAL CHANGE", z1: "The brand belongs", z3: "neither to the old", z4: "nor to the new generation." };
  const kreise = (k, r, fs, kern) => (
    <>
      <circle cx={k[0][0]} cy={k[0][1]} r={r} fill="#8a8a8a" fillOpacity="0.5" />
      <circle cx={k[1][0]} cy={k[1][1]} r={r} fill="#ffb3c4" fillOpacity="0.45" />
      <circle cx={k[2][0]} cy={k[2][1]} r={r} fill={PINK} fillOpacity="0.55" />
      <text x={k[3][0]} y={k[3][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Predecessor</text>
      <text x={k[4][0]} y={k[4][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Successor</text>
      <text x={k[5][0]} y={k[5][1]} fill="#ffffff" fontSize={fs} fontWeight="800" textAnchor="middle">Customers</text>
      <text x={k[6][0]} y={k[6][1]} fill="#ffffff" fontSize={kern} fontWeight="900" textAnchor="middle">Core of</text>
      <text x={k[6][0]} y={k[6][1] + kern * 1.25} fill="#ffffff" fontSize={kern} fontWeight="900" textAnchor="middle">the brand</text>
    </>
  );
  const breit = (
    <>
      <Kopftext {...kopf} unter="It belongs to the customers who carry it in their heads." />
      {kreise([[1060, 320], [1300, 320], [1180, 480], [990, 290], [1370, 290], [1180, 580], [1180, 396]], 150, 22, 19)}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="The brand belongs" z1b={{ text: "neither to the old" }} z3="nor to the new" z4="generation." />
      {kreise([[290, 570], [510, 570], [400, 740], [222, 545], [578, 545], [400, 838], [400, 628]], 140, 28, 24)}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: three overlapping circles for the predecessor, the successor and the customers. Where all three overlap lies the core of the brand." />;
}

// Succession 3: timeline in four steps
function NachfolgeKunden() {
  const kopf = { oben: "BUSINESS HANDOVER", z1: "Customers should hear", z3: "it from you.", z4: "Not from third parties." };
  const schritte = [["1 Framework", "is set"], ["2 Team", "knows"], ["3 Key", "customers, in person"], ["4 Everyone", "else"]];
  const breit = (
    <>
      <Kopftext {...kopf} unter="In person, together, once the framework is set." />
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
      <Kopftext schmal oben={kopf.oben} z1="Customers should" z1b={{ text: "hear it" }} z3="from you." z4="Not from third parties." />
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
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a timeline in four steps. First the framework is set, then the team is told, then the key customers in person, shortly after that everyone else." />;
}

// Succession 4: five employees, four say nothing, one says: it's fine.
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
  const kopf = { oben: "BUSINESS TAKEOVER", z1: "The team is watching", z3: "closely.", z4: "And says little." };
  const blasen = ["punkte", "punkte", "It's fine.", "punkte", "punkte"];
  const breit = (
    <>
      <Kopftext {...kopf} unter="What you hear depends on how you ask." />
      {blasen.map((bl, i) => <Figur key={i} x={920 + i * 140} y={330} blase={bl} />)}
      <text x="1200" y="610" fill="#b3b3b3" fontSize="17" fontWeight="600" textAnchor="middle">What new leadership hears in the first weeks</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben={kopf.oben} z1="The team is watching" z1b={{ text: "closely." }} z3="And says" z4="little." />
      {blasen.map((bl, i) => <Figur key={i} x={100 + i * 150} y={450} s={1.2} blase={bl} />)}
      <text x="400" y="770" fill="#b3b3b3" fontSize="24" fontWeight="600" textAnchor="middle">What new leadership hears</text>
      <text x="400" y="804" fill="#b3b3b3" fontSize="24" fontWeight="600" textAnchor="middle">in the first weeks</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: five employees with speech bubbles. Four bubbles show only three dots, one says: it's fine." />;
}

// Succession 5: 100-day bar in three phases
function NachfolgeHundertTage() {
  const kopf = { oben: "BUSINESS TAKEOVER", z1: "100 days.", z3: "Listen first,", z4: "then restructure." };
  const balken = (x, w, y, h, fsTag, fsText, tagY) =>
    [["Day 1 to 30", "Listen", "#4a4a4a"], ["Day 31 to 60", "Take stock", "#6a6a6a"], ["Day 61 to 100", "Priorities", PINK]].map(([tag, text, f], i) => (
      <g key={tag}>
        <text x={x[i]} y={tagY} fill="#b3b3b3" fontSize={fsTag} fontWeight="600">{tag}</text>
        <rect x={x[i]} y={y} width={w[i]} height={h} rx="8" fill={f} />
        <text x={x[i] + w[i] / 2} y={y + h / 2 + fsText * 0.35} fill="#ffffff" fontSize={fsText} fontWeight="800" textAnchor="middle">{text}</text>
      </g>
    ));
  const breit = (
    <>
      <Kopftext {...kopf} unter="A three-phase plan for customers, team and brand." />
      {balken([880, 1060, 1240], [176, 176, 240], 372, 60, 16, 20, 356)}
      <line x1="1360" y1="300" x2="1360" y2="364" stroke="#ff8fa8" strokeWidth="2" />
      <text x="1360" y="270" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">Only now: brand,</text>
      <text x="1360" y="292" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">website, sales</text>
      <text x="880" y="470" fill="#8a8a8a" fontSize="16" fontWeight="600">Day 0</text>
      <text x="1480" y="470" fill="#8a8a8a" fontSize="16" fontWeight="600" textAnchor="end">Day 100</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal {...kopf} />
      {balken([40, 254, 468], [210, 210, 292], 610, 84, 25, 29, 592)}
      <line x1="614" y1="520" x2="614" y2="562" stroke="#ff8fa8" strokeWidth="2" />
      <text x="614" y="472" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">Only now: brand,</text>
      <text x="614" y="504" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">website, sales</text>
      <text x="40" y="740" fill="#8a8a8a" fontSize="25" fontWeight="600">Day 0</text>
      <text x="760" y="740" fill="#8a8a8a" fontSize="25" fontWeight="600" textAnchor="end">Day 100</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a 100-day timeline in three phases: listen, take honest stock, set priorities. Only in the third phase are decisions made about brand, website and sales." />;
}

// Succession 6: what only you know, written down for your successor
function NachfolgeUebergeber() {
  const inhalt = ["Why customers buy", "Who knows whom", "What you promise"];
  const breit = (
    <>
      <Kopftext oben="BUSINESS HANDOVER" z1="What only you know" z3="walks out the door" z4="with you." unter="Write down what makes your business what it is." />
      <circle cx="1030" cy="400" r="165" fill={PINK} />
      <text x="1030" y="318" fill="#ffe3ea" fontSize="17" fontWeight="700" textAnchor="middle">What only you know</text>
      {inhalt.map((t, i) => <text key={t} x="1030" y={370 + i * 40} fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle">{t}</text>)}
      <line x1="1205" y1="400" x2="1262" y2="400" stroke="#ff8fa8" strokeWidth="4" />
      <polygon points="1262,388 1282,400 1262,412" fill="#ff8fa8" />
      <rect x="1296" y="290" width="190" height="230" rx="12" fill="#f6f5f4" />
      <rect x="1320" y="320" width="110" height="12" rx="6" fill="#b3b3b3" />
      {[142, 128, 142, 100].map((w, i) => <rect key={i} x="1320" y={356 + i * 24} width={w} height="9" rx="4" fill="#d6d3d0" />)}
      <text x="1391" y="490" fill="#2d2d2d" fontSize="18" fontWeight="800" textAnchor="middle">Written down</text>
      <text x="1391" y="560" fill="#b3b3b3" fontSize="16" fontWeight="600" textAnchor="middle">for your successor</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="BUSINESS HANDOVER" z1="What only" z1b={{ text: "you know" }} z3="walks out the door" z4="with you." />
      <circle cx="250" cy="660" r="200" fill={PINK} />
      <text x="250" y="566" fill="#ffe3ea" fontSize="24" fontWeight="700" textAnchor="middle">What only you know</text>
      {inhalt.map((t, i) => <text key={t} x="250" y={628 + i * 50} fill="#ffffff" fontSize="31" fontWeight="900" textAnchor="middle">{t}</text>)}
      <line x1="458" y1="660" x2="500" y2="660" stroke="#ff8fa8" strokeWidth="5" />
      <polygon points="500,646 522,660 500,674" fill="#ff8fa8" />
      <rect x="536" y="520" width="224" height="280" rx="14" fill="#f6f5f4" />
      <rect x="562" y="556" width="130" height="14" rx="7" fill="#b3b3b3" />
      {[170, 150, 170, 120].map((w, i) => <rect key={i} x="562" y={598 + i * 30} width={w} height="11" rx="5" fill="#d6d3d0" />)}
      <text x="648" y="768" fill="#2d2d2d" fontSize="25" fontWeight="800" textAnchor="middle">Written down</text>
      <text x="648" y="846" fill="#b3b3b3" fontSize="23" fontWeight="600" textAnchor="middle">for your successor</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a pink circle headed what only you know: why customers buy, who knows whom, what you promise. An arrow leads to a sheet of paper: written down for your successor." />;
}

// Succession 7: three directions converge in the view of customers and team
function NachfolgeGesellschafter() {
  const breit = (
    <>
      <Kopftext oben="PARTNERS" z1="Three partners." z3="Three opinions." z4="One direction." unter="With a basis that belongs to none of you alone." />
      {[["Tradition", 246], ["Change", 396], ["Price", 546]].map(([t, y]) => <text key={t} x="880" y={y} fill="#ffffff" fontSize="22" fontWeight="800">{t}</text>)}
      <path d="M880 262 C 1020 262, 1120 360, 1240 400" fill="none" stroke="#8a8a8a" strokeWidth="5" />
      <path d="M880 412 L 1240 400" fill="none" stroke="#b3b3b3" strokeWidth="5" />
      <path d="M880 562 C 1020 562, 1120 440, 1240 400" fill="none" stroke="#6a6a6a" strokeWidth="5" />
      <circle cx="1250" cy="400" r="22" fill={PINK} />
      <line x1="1272" y1="400" x2="1490" y2="400" stroke={PINK} strokeWidth="8" />
      <polygon points="1490,384 1516,400 1490,416" fill={PINK} />
      <text x="1250" y="350" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">View of customers</text>
      <text x="1250" y="372" fill="#ff8fa8" fontSize="18" fontWeight="800" textAnchor="middle">and team</text>
      <text x="1390" y="446" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle">One direction</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="PARTNERS" z1="Three partners." z1b={{ text: "Three opinions." }} z3="And in the end" z4="one direction." />
      {[["Tradition", 482], ["Change", 622], ["Price", 762]].map(([t, y]) => <text key={t} x="48" y={y} fill="#ffffff" fontSize="30" fontWeight="800">{t}</text>)}
      <path d="M48 500 C 250 500, 350 600, 470 640" fill="none" stroke="#8a8a8a" strokeWidth="6" />
      <path d="M48 640 L 470 640" fill="none" stroke="#b3b3b3" strokeWidth="6" />
      <path d="M48 780 C 250 780, 350 680, 470 640" fill="none" stroke="#6a6a6a" strokeWidth="6" />
      <circle cx="484" cy="640" r="28" fill={PINK} />
      <line x1="512" y1="640" x2="728" y2="640" stroke={PINK} strokeWidth="10" />
      <polygon points="728,620 760,640 728,660" fill={PINK} />
      <text x="560" y="560" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">View of customers</text>
      <text x="560" y="592" fill="#ff8fa8" fontSize="25" fontWeight="800" textAnchor="middle">and team</text>
      <text x="630" y="706" fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle">One direction</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: three lines labelled tradition, change and price converge in a pink dot, the view of customers and team. From there one shared line continues." />;
}

// ISO 9001: four points in the audit, quality culture new from 2026
function Iso9001() {
  const punkte = ["Competence", "Awareness", "Communication"];
  const haken = (cx, cy, s, farbe) => <path d={`M${cx - 10 * s} ${cy} l${7 * s} ${7 * s} l${13 * s} ${-14 * s}`} fill="none" stroke={farbe} strokeWidth={4 * s} strokeLinecap="round" strokeLinejoin="round" />;
  const breit = (
    <>
      <Kopftext oben="ISO 9001" z1="The standard asks:" z3="Does quality" z4="reach daily work?" unter="What the auditor wants to see in your team." />
      <rect x="900" y="170" width="580" height="440" rx="22" fill="#ffffff" />
      <text x="944" y="230" fill="#5a5a5a" fontSize="18" fontWeight="700" letterSpacing="3">IN THE AUDIT</text>
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
      <text x="1000" y="550" fill="#2d2d2d" fontSize="28" fontWeight="900">Quality culture</text>
      <rect x="1290" y="522" width="140" height="36" rx="18" fill={PINK} />
      <text x="1360" y="547" fill="#ffffff" fontSize="17" fontWeight="800" textAnchor="middle">NEW 2026</text>
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="ISO 9001" z1="The standard asks:" z3="Does quality" z4="reach daily work?" />
      <rect x="48" y="440" width="704" height="420" rx="24" fill="#ffffff" />
      <text x="92" y="500" fill="#5a5a5a" fontSize="22" fontWeight="700" letterSpacing="3">IN THE AUDIT</text>
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
      <text x="162" y="810" fill="#2d2d2d" fontSize="34" fontWeight="900">Quality culture</text>
      <rect x="548" y="776" width="160" height="42" rx="21" fill={PINK} />
      <text x="628" y="805" fill="#ffffff" fontSize="20" fontWeight="800" textAnchor="middle">NEW 2026</text>
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: a card headed in the audit with four ticked points: competence, awareness, communication and, highlighted in pink and marked new 2026, quality culture." />;
}

// ISO 45001: consultation, participation and the evaluation required by Austrian law
function Iso45001() {
  const felder = [
    { oben: "CONSULTATION", text: "Gathering views", art: "grau" },
    { oben: "PARTICIPATION", text: "Having a say", art: "pink" },
    { oben: "AUSTRIAN LAW", text: "Evaluation of psychological stress", art: "rand" },
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
      <Kopftext oben="ISO 45001" z1="Asking is good." z3="Having a say" z4="is mandatory." unter="In Austria, the stress evaluation has its own rules." />
      {felder.map((f, i) => feld(f, 900, 190 + i * 140, 580, 110, 1))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="ISO 45001" z1="Asking is good." z3="Having a say" z4="is mandatory." />
      {felder.map((f, i) => feld(f, 48, 440 + i * 144, 704, 124, 1.25))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: three boxes one below the other. Consultation: gathering views. Participation, highlighted in pink: having a say. Austrian law: evaluation of psychological stress." />;
}

// DIY marketing with AI: three levels of checking: facts, law, effect on customers
function MarketingKi() {
  const felder = [
    { oben: "1 IS IT TRUE?", tag: "CHECKLIST", text: "Facts and figures", pink: false },
    { oben: "2 IS IT ALLOWED?", tag: "CHECKLIST", text: "Law and labelling", pink: false },
    { oben: "3 DOES IT WORK?", tag: "ONLY YOUR CUSTOMERS", text: "Message and reason to buy", pink: true },
  ];
  const feld = (f, x, y, w, h, oben, tag, gross, yo, yt) => (
    <g key={f.oben}>
      <rect x={x} y={y} width={w} height={h} rx="18" fill={f.pink ? PINK : "#4a4a4a"} />
      <text x={x + 40} y={y + yo} fill={f.pink ? "#ffe3ea" : "#b3b3b3"} fontSize={oben} fontWeight="700" letterSpacing="3">{f.oben}</text>
      <text x={x + w - 30} y={y + yo} fill={f.pink ? "#ffe3ea" : "#b3b3b3"} fontSize={tag} fontWeight="700" letterSpacing="2" textAnchor="end">{f.tag}</text>
      <text x={x + 40} y={y + yt} fill="#ffffff" fontSize={gross} fontWeight={f.pink ? 900 : 800}>{f.text}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="MARKETING WITH AI" z1="AI writes." z3="Who checks" z4="that it is right?" unter="Three levels: facts, law and your customers." />
      {felder.map((f, i) => feld(f, 900, 190 + i * 140, 580, 110, 17, 15, 30, 42, 86))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="MARKETING WITH AI" z1="AI writes." z3="Who checks" z4="that it is right?" />
      {felder.map((f, i) => feld(f, 48, 440 + i * 144, 704, 124, 24, 24, 38, 46, 100))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: three boxes one below the other. Is it true: facts and figures, with a checklist. Is it allowed: law and labelling, with a checklist. Does it work, highlighted in pink: message and reason to buy, which only your customers can tell you." />;
}

// Checking AI-generated copy: four checking steps, the last one belongs to the customers
function KiTexte() {
  const felder = [
    { oben: "1 FACTS", text: "Open the sources", art: "grau" },
    { oben: "2 LAW", text: "Advertising and labelling", art: "grau" },
    { oben: "3 BRAND", text: "Tone and form of address", art: "grau" },
    { oben: "4 CUSTOMER", text: "Does it hold up?", art: "pink" },
  ];
  const feld = (f, x, y, w, h, oben, gross, yo, yt) => (
    <g key={f.oben}>
      <rect x={x} y={y} width={w} height={h} rx="18" fill={f.art === "pink" ? PINK : "#4a4a4a"} />
      <text x={x + 40} y={y + yo} fill={f.art === "pink" ? "#ffe3ea" : "#b3b3b3"} fontSize={oben} fontWeight="700" letterSpacing="3">{f.oben}</text>
      <text x={x + 40} y={y + yt} fill="#ffffff" fontSize={gross} fontWeight={f.art === "pink" ? 900 : 800}>{f.text}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="CHECKING AI COPY" z1="AI copy done?" z3="Last of all, ask" z4="your customers." unter="The checklist before you publish." />
      {felder.map((f, i) => feld(f, 900, 180 + i * 112, 580, 90, 16, 28, 34, 72))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="CHECKING AI COPY" z1="AI copy done?" z3="Last of all, ask" z4="your customers." />
      {felder.map((f, i) => feld(f, 48, 440 + i * 104, 704, 92, 24, 34, 34, 76))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: four boxes one below the other with the checking steps. Facts: open the sources. Law: advertising and labelling. Brand: tone and form of address. Customer, highlighted in pink: does the message hold up?" />;
}

// Why AI copy sounds the same: three competitors with the same sentence, below in pink: what your customers say
function KiAustauschbar() {
  const felder = [
    { oben: "COMPETITOR A", text: "Quality, advice, experience", pink: false },
    { oben: "COMPETITOR B", text: "Quality, advice, experience", pink: false },
    { oben: "COMPETITOR C", text: "Quality, advice, experience", pink: false },
    { oben: "YOU", text: "What your customers say", pink: true },
  ];
  const feld = (f, x, y, w, h, oben, gross, yo, yt) => (
    <g key={f.oben}>
      <rect x={x} y={y} width={w} height={h} rx="16" fill={f.pink ? PINK : "#4a4a4a"} />
      <text x={x + 36} y={y + yo} fill={f.pink ? "#ffe3ea" : "#b3b3b3"} fontSize={oben} fontWeight="700" letterSpacing="3">{f.oben}</text>
      <text x={x + 36} y={y + yt} fill="#ffffff" fontSize={f.pink ? gross + 4 : gross} fontWeight={f.pink ? 900 : 800}>{f.text}</text>
    </g>
  );
  const breit = (
    <>
      <Kopftext oben="AI AND COMPETITORS" z1="Everyone using AI?" z3="Then what counts is" z4="what only you know." unter="Why AI copy sounds the same and what helps." />
      {felder.map((f, i) => feld(f, 900, 180 + i * 110, 580, f.pink ? 100 : 90, 16, 26, 34, f.pink ? 80 : 72))}
    </>
  );
  const schmal = (
    <>
      <Kopftext schmal oben="AI AND COMPETITORS" z1="Everyone using AI?" z3="Then what counts is" z4="what only you know." />
      {felder.map((f, i) => feld(f, 48, 440 + i * 106, 704, 92, 24, 32, 36, 76))}
    </>
  );
  return <Rahmen breit={breit} schmal={schmal} label="Title graphic: three grey boxes one below the other, competitors A, B and C, all with the same sentence: quality, advice, experience. Below them a pink box, you: what your customers say." />;
}

export const TITELGRAFIKEN_EN = {
  "employee-survey-results": Leitartikel,
  "why-good-employees-quit": Kuendigung,
  "find-your-usp": Usp,
  "why-customers-buy-from-competitors": Konkurrenz,
  "increase-close-rate": Abschlussquote,
  "business-succession-marketing": NachfolgeMarketing,
  "family-business-succession-brand": NachfolgeMarke,
  "business-handover-informing-customers": NachfolgeKunden,
  "retaining-employees-after-takeover": NachfolgeTeam,
  "first-100-days-after-takeover": NachfolgeHundertTage,
  "preparing-business-handover": NachfolgeUebergeber,
  "partners-disagree-on-marketing": NachfolgeGesellschafter,
  "employee-survey-iso-9001": Iso9001,
  "employee-survey-iso-45001": Iso45001,
  "checking-ai-generated-copy": KiTexte,
  "why-ai-copy-sounds-the-same": KiAustauschbar,
  "diy-marketing-with-ai": MarketingKi,
};

export default function TitelgrafikEn({ slug }) {
  const G = TITELGRAFIKEN_EN[slug];
  return G ? <G /> : null;
}
