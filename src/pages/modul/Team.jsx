import React, { useState } from "react";
import { ArrowDown, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Modulseite 02 Team (für Geschäftsführung, Personal und HR, Führungskräfte).
// Eigener Look: rosa Grund, Sprechblasen um das Teamfoto, Schätzspiel
// Chefsicht gegen Teamsicht, sechs Blickwinkel, Landkarte wichtig gegen erlebt,
// Zeitleiste und Anonymitäts-Zähler. Alle Zahlen sind als Beispiel gekennzeichnet.

const BETREFF = "andi fragt. Team-Interview";
const MINDESTZAHL = 6;

// Sprechblasen rund um das Teamfoto (ab md frei positioniert, darunter gestapelt)
const BLASEN = [
  { text: "Ich würde mehr Verantwortung übernehmen. Mich hat nur noch nie jemand gefragt.", wer: "Verwaltung", pos: { left: 0, top: 6 }, grund: "#ffffff", farbe: F.dunkel, dreh: "-3deg", ecke: "22px 22px 22px 6px" },
  { text: "Das Team ist der Grund, warum ich noch da bin.", wer: "Werkstatt", pos: { right: 0, top: 40 }, grund: F.dunkel, farbe: "#ffffff", dreh: "2.5deg", ecke: "22px 22px 6px 22px" },
  { text: "Entscheidungen erfahren wir als Letzte.", wer: "Außendienst", pos: { left: 10, bottom: 40 }, grund: "#e02551", farbe: "#ffffff", dreh: "2deg", ecke: "22px 22px 22px 6px" },
  { text: "Nach drei Wochen war ich auf mich allein gestellt.", wer: "Lager", pos: { right: 6, bottom: 0 }, grund: "#ffffff", farbe: F.dunkel, dreh: "-2deg", ecke: "22px 22px 6px 22px" },
];

// Schätzspiel: Aussagen aus dem Kern Mitarbeitende, Teamwerte als Beispiel
const AUSSAGEN = [
  { thema: "Offenheit", aussage: "Ich muss keine negativen Folgen fürchten, wenn ich Kritik übe.", team: 41, einsicht: "Wo Kritik riskant wirkt, hörst du von Problemen erst, wenn sie teuer sind." },
  { thema: "Information", aussage: "Ich bekomme alle Informationen, die ich für meine Arbeit brauche.", team: 48, einsicht: "Fehlende Informationen kosten jeden Tag Zeit. Gemeldet wird das fast nie." },
  { thema: "Bindung", aussage: "Ich würde mich wieder bei uns bewerben.", team: 63, einsicht: "Wer sich nicht wieder bewerben würde, ist innerlich oft schon unterwegs." },
];
const SCHAETZWERTE = [20, 40, 60, 80];

// Landkarte wichtig gegen erlebt: x = so erlebt (0 schwach bis 100 stark), y = von oben gemessen
const FELD = {
  verlieren: { name: "Hier verlierst du Leute", grund: F.akzent, farbe: "#ffffff" },
  halten: { name: "Hier hältst du sie", grund: "#45d085", farbe: F.dunkel },
  geld: { name: "Hier verbrennst du Geld", grund: "#f2c46d", farbe: F.dunkel },
  warten: { name: "Kann warten", grund: "#5a5a5a", farbe: "#ffffff" },
};
const PUNKTE = [
  { name: "Weiterbildung", x: 24, y: 20, feld: "verlieren", text: "Deinem Team sehr wichtig, bei dir schwach erlebt. Hier gehen gute Leute zuerst. Ein klarer Plan je Person ist der schnellste Hebel." },
  { name: "Flexible Arbeitszeit", x: 30, y: 38, feld: "verlieren", text: "Wird oft unterschätzt. Schon kleine Spielräume verändern, wie dein Team dich als Arbeitgeber erlebt." },
  { name: "Klima im Team", x: 78, y: 14, feld: "halten", text: "Eure Stärke. Sie gehört in jede Stellenanzeige, und zwar in den Worten deines Teams." },
  { name: "Sicherer Arbeitsplatz", x: 70, y: 32, feld: "halten", text: "Wird vorausgesetzt. Gut, dass es stimmt. Begeistern wird es allein niemanden." },
  { name: "Firmenfeier", x: 78, y: 62, feld: "geld", text: "Gut gemeint, kaum gewünscht. Dasselbe Budget wirkt an anderer Stelle deutlich mehr." },
  { name: "Gratis Parkplatz", x: 64, y: 78, feld: "geld", text: "Nett, aber kein Grund zu bleiben. Prüfen statt ausbauen." },
  { name: "Internationalität", x: 24, y: 72, feld: "warten", text: "Deinem Team derzeit nicht wichtig. Kein Handlungsbedarf." },
];

const STILL = { grund: F.grau, text: F.dunkel };
const LAUT = { grund: "#e02551", text: "#ffffff" };
const GUT = { grund: F.dunkel, text: "#ffffff" };

const WEGE = [
  {
    titel: "Wenn niemand fragt",
    farbe: F.daempft,
    schritte: [
      { wann: "Monat 1", was: "Erster Frust, man schluckt ihn.", ...STILL },
      { wann: "Monat 3", was: "Weniger Ideen, mehr Dienst nach Vorschrift.", ...STILL },
      { wann: "Monat 6", was: "Das Profil im Netz wird aktualisiert.", ...STILL },
      { wann: "Monat 9", was: "Die Kündigung kommt überraschend.", ...LAUT },
      { wann: "Danach", was: "Stelle neu besetzen, Wissen ist weg.", ...LAUT },
    ],
  },
  {
    titel: "Wenn andi fragt",
    farbe: F.etikett,
    schritte: [
      { wann: "Woche 1", was: "Anonymes Interview im ganzen Team.", ...GUT },
      { wann: "Woche 4", was: "Das Muster wird sichtbar, nicht die Person.", ...GUT },
      { wann: "Woche 6", was: "Präsentation und konkrete Maßnahmen.", ...GUT },
      { wann: "Nach 6 Monaten", was: "Kurzer Puls: Was hat sich wirklich bewegt?", ...GUT },
    ],
  },
];

const GEWINN = [
  { zeichen: "1", titel: "Leistungsträger halten", text: "Du erfährst früh, was gute Leute bremst, und kannst handeln, bevor sie gehen." },
  { zeichen: "2", titel: "Budget, das wirkt", text: "Du investierst in das, was dein Team begeistert, und sparst dir, was niemand vermisst." },
  { zeichen: "3", titel: "Bewerbungen, die passen", text: "Stellenanzeigen in den Worten deines Teams ziehen Menschen an, die wirklich zu euch passen." },
  { zeichen: "4", titel: "Fortschritt, den du siehst", text: "Das erste Interview ist dein Startwert. Der Puls nach sechs Monaten zeigt, was sich verändert hat." },
];

const ERGEBNIS = [
  { nr: "Blinde Flecken", titel: "Deine Sicht und die deines Teams", text: "Wo ihr gleich seht und wo ihr weit auseinanderliegt, je Bereich ab der Mindestzahl.", beispiel: "Information: du 80 %, Team 48 %." },
  { nr: "Landkarte", titel: "Wo handeln, wo sparen", text: "Was deinem Team wichtig ist, gegen das, was es bei dir erlebt.", beispiel: "Weiterbildung zuerst, Firmenfeier überdenken." },
  { nr: "Arbeitgeberversprechen", titel: "Warum man bei euch arbeitet", text: "Ein ehrliches Versprechen, das dein Team selbst unterschreiben würde.", beispiel: "Bei uns zählt dein Wort, auch am ersten Tag." },
  { nr: "Recruiting", titel: "Sätze für deine Stellenanzeigen", text: "Aus echten Antworten werden Texte, die Bewerbende ansprechen.", beispiel: "Wir suchen niemanden, der alles kann. Wir suchen jemanden, der mitdenkt." },
];

// ---------------------------------------------------------------------------
// Kopf: Frage links, das Team spricht rechts
// ---------------------------------------------------------------------------
function Einstieg() {
  return (
    <section className={`${BREITE} pt-10 pb-[88px] flex flex-wrap items-center gap-x-14 gap-y-12`}>
      <div className="flex-[1_1_460px] min-w-0">
        <Etikett>Modul 02 Team</Etikett>
        <h1 className="mt-[18px]" style={{ ...H1_STIL, fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 0.96 }}>
          Wie gut kennst du <span style={{ color: F.akzent }}>dein Team</span> wirklich?
        </h1>
        <p className="mt-[26px]" style={{ ...LEAD_STIL, maxWidth: 560, color: F.daempft }}>
          Du siehst, was im Alltag sichtbar ist. Dein Team weiß, was es hält, was es bremst und was es gehen ließe. Im
          anonymen Interview sagt es das. Wir legen deine Sicht und seine Sicht nebeneinander.
        </p>
        <p className="mt-5 text-[22px] leading-[1.3] font-bold">
          Damit die Guten bleiben. <span style={{ color: F.akzent }}>Und Bessere kommen.</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Hauptknopf href={mailAn(BETREFF)}>Erstgespräch vereinbaren</Hauptknopf>
          <a
            href="#test"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] rounded px-[22px] text-sm font-semibold uppercase tracking-[0.04em] box-border"
            style={{ border: `2px solid ${F.dunkel}`, color: F.dunkel, textDecoration: "none" }}
          >
            Teste dein Bauchgefühl <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <FuerDich rollen={["Geschäftsführung", "Personal und HR", "Führungskraft"]} />
      </div>

      <div className="flex-[1_1_480px] min-w-0">
        <div
          role="list"
          aria-label="Beispiele für anonyme Antworten aus einem Team"
          className="relative flex flex-col items-center gap-3.5 md:block md:h-[540px]"
        >
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <RundesFoto
              src="/bilder/team.webp"
              alt="Team lacht gemeinsam in der Kaffeepause"
              groesse={300}
              ringe={[{ abstand: 15, farbe: F.akzent }]}
              rand="8px solid #ffffff"
            />
          </div>
          {BLASEN.map((b) => (
            <div
              key={b.text}
              role="listitem"
              className="md:absolute max-w-full md:max-w-[230px] px-5 py-4 text-base leading-[1.4] font-semibold text-left motion-reduce:!transform-none"
              style={{
                ...b.pos,
                borderRadius: b.ecke,
                background: b.grund,
                color: b.farbe,
                transform: `rotate(${b.dreh})`,
                boxShadow: "0 14px 28px -18px rgba(45,45,45,0.45)",
              }}
            >
              {b.text}
              <span className="block mt-2 text-xs font-medium opacity-75">{b.wer}</span>
            </div>
          ))}
        </div>
        <Beispielhinweis className="mt-3.5 text-center">Beispielhafte Antworten zur Veranschaulichung.</Beispielhinweis>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Schätzspiel: Chefsicht gegen Teamsicht
// ---------------------------------------------------------------------------
function Schaetzspiel() {
  const [tipp, setTipp] = useState([null, null, null]);
  const fertig = tipp.filter((t) => t !== null).length;
  const alle = fertig === AUSSAGEN.length;

  let fazitTitel;
  let fazitText;
  if (!alle) {
    const rest = AUSSAGEN.length - fertig;
    fazitTitel = rest === AUSSAGEN.length
      ? "Drei Schätzungen bis zur Auflösung"
      : `Noch ${rest} ${rest === 1 ? "Schätzung" : "Schätzungen"} bis zur Auflösung`;
    fazitText = "Am Ende siehst du, wie weit dein Bauchgefühl im Schnitt danebenliegt.";
  } else {
    const schnitt = Math.round(AUSSAGEN.reduce((s, a, i) => s + Math.abs(tipp[i] - a.team), 0) / AUSSAGEN.length);
    fazitTitel = `Im Schnitt ${schnitt} Punkte daneben`;
    fazitText = schnitt <= 10
      ? "Starkes Bauchgefühl. Ob es bei deinem Team genauso stimmt, zeigt erst die echte Antwort."
      : "Das ist kein Vorwurf. Von oben sieht man anders. Genau dieser Abstand ist der Hebel, den wir mit dir öffnen.";
  }

  return (
    <section id="test" className="bg-white rounded-t-[40px] scroll-mt-4">
      <div className={`${BREITE} py-24`}>
        <Etikett>Chefsicht gegen Teamsicht</Etikett>
        <h2 className="mt-3 max-w-[820px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Schätz mal. <span style={{ color: F.akzent }}>Dann sieh, was ein Team sagt.</span>
        </h2>
        <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
          Drei Aussagen aus unserem Interview. Wie viele in deinem Team stimmen zu? Tipp auf deine Schätzung.
        </p>

        <div className="mt-11 grid gap-5 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {AUSSAGEN.map((a, i) => {
            const t = tipp[i];
            const diff = t === null ? 0 : Math.abs(t - a.team);
            const abstand = t === null
              ? ""
              : diff <= 10
                ? `Nah dran. Nur ${diff} Punkte Abstand.`
                : `${diff} Punkte Abstand. ${t > a.team ? "Du hast dein Team positiver eingeschätzt." : "Dein Team sieht es positiver als du."}`;
            return (
              <article key={a.thema} className="rounded-[28px] p-7 flex flex-col" style={{ background: F.hauch }}>
                <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.etikett }}>{a.thema}</p>
                <p className="mt-3 text-[21px] leading-[1.3] font-bold min-h-[82px]">{a.aussage}</p>
                <p className="mt-[18px] mb-2.5 text-sm font-semibold" style={{ color: F.daempft }}>Wie viele stimmen zu?</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Deine Schätzung zu: ${a.aussage}`}>
                  {SCHAETZWERTE.map((w) => {
                    const an = t === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        aria-pressed={an}
                        onClick={() => setTipp((alt) => alt.map((x, j) => (j === i ? w : x)))}
                        className="min-h-[44px] px-3 rounded-full text-[15px] font-bold cursor-pointer"
                        style={{ border: `2px solid ${F.dunkel}`, background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.dunkel }}
                      >
                        {w} %
                      </button>
                    );
                  })}
                </div>
                {t !== null && (
                  <div aria-live="polite" className="mt-[22px] pt-5" style={{ borderTop: `1px solid ${F.hauchRand}` }}>
                    <div className="grid grid-cols-[112px_minmax(0,1fr)_48px] gap-2.5 items-center text-sm">
                      <span className="font-semibold">Deine Schätzung</span>
                      <span className="h-3 rounded-full bg-white">
                        <span className="block h-full rounded-full" style={{ width: `${t}%`, background: F.dunkel }} />
                      </span>
                      <strong className="text-right">{t} %</strong>
                      <span className="font-semibold">Team im Beispiel</span>
                      <span className="h-3 rounded-full bg-white">
                        <span className="block h-full rounded-full" style={{ width: `${a.team}%`, background: F.akzent }} />
                      </span>
                      <strong className="text-right" style={{ color: F.link }}>{a.team} %</strong>
                    </div>
                    <p className="mt-4 text-[15px] font-bold">{abstand}</p>
                    <p className="mt-1.5 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>{a.einsicht}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="mt-5 rounded-[28px] px-8 py-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4"
          style={{ background: alle ? F.dunkel : F.hauch, color: alle ? "#ffffff" : F.dunkel }}
        >
          <div className="flex-[1_1_420px] min-w-0">
            <p className="text-[26px] leading-[1.2] font-black uppercase">{fazitTitel}</p>
            <p className="mt-2 text-base leading-[1.6] opacity-85">{fazitText}</p>
          </div>
          {alle && <Hauptknopf href={mailAn(BETREFF)} pfeil={false}>Die echte Antwort holen</Hauptknopf>}
        </div>
        <Beispielhinweis className="mt-3.5">
          Die Teamwerte sind Beispiele zur Veranschaulichung, keine Ergebnisse eines bestimmten Unternehmens.
        </Beispielhinweis>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sechs Blickwinkel
// ---------------------------------------------------------------------------
function Balken({ wer, breite, farbe }) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-semibold">
      <span className="w-[52px]">{wer}</span>
      <span className="flex-1 h-3 rounded-full" style={{ background: F.grau }}>
        <span className="block h-full rounded-full" style={{ width: breite, background: farbe }} />
      </span>
    </div>
  );
}

function Pille({ children, grund, farbe }) {
  return (
    <span className="inline-flex items-center min-h-[30px] px-3 rounded-full text-[13px] font-bold" style={{ background: grund, color: farbe }}>
      {children}
    </span>
  );
}

const BLICKWINKEL = [
  {
    titel: "Deine blinden Flecken",
    text: "Wo du und dein Team die Lage ganz unterschiedlich sehen. Bei Führung, Information, Fairness und Zusammenarbeit.",
    bild: (
      <div className="h-[92px] flex flex-col justify-center gap-2.5">
        <Balken wer="Du" breite="85%" farbe={F.dunkel} />
        <Balken wer="Team" breite="41%" farbe={F.akzent} />
      </div>
    ),
  },
  {
    titel: "Wo du Leute verlierst",
    text: "Was deinem Team bei einem Arbeitgeber wichtig ist, gegen das, was es bei dir erlebt.",
    bild: (
      <div className="h-[92px] w-[150px] grid grid-cols-2 grid-rows-2 gap-1">
        <span className="relative" style={{ borderRadius: "10px 4px 4px 4px", background: "#ffd6df" }}>
          <span className="absolute w-3 h-3 rounded-full" style={{ left: "30%", top: "40%", background: F.akzent }} />
        </span>
        <span className="relative" style={{ borderRadius: "4px 10px 4px 4px", background: "#d8f5e5" }}>
          <span className="absolute w-3 h-3 rounded-full" style={{ left: "55%", top: "30%", background: "#1d9a5b" }} />
        </span>
        <span style={{ borderRadius: "4px 4px 4px 10px", background: F.grau }} />
        <span className="relative" style={{ borderRadius: "4px 4px 10px 4px", background: F.grau }}>
          <span className="absolute w-3 h-3 rounded-full" style={{ left: "45%", top: "45%", background: F.dunkel }} />
        </span>
      </div>
    ),
  },
  {
    titel: "Was wirklich zieht",
    text: "Welche Leistungen begeistern, welche einfach erwartet werden und welche niemand vermissen würde.",
    bild: (
      <div className="h-[92px] flex flex-wrap content-center gap-2">
        <Pille grund="#45d085" farbe={F.dunkel}>begeistert</Pille>
        <Pille grund={F.dunkel} farbe="#ffffff">wird erwartet</Pille>
        <Pille grund={F.grau} farbe={F.daempft}>ist egal</Pille>
      </div>
    ),
  },
  {
    titel: "Warum Leute zu euch kommen",
    text: "Die echten Gründe in den Worten deines Teams. Die beste Vorlage für jede Stellenanzeige.",
    bild: (
      <div className="h-[92px] flex items-center">
        <p className="px-4 py-3 text-[15px] leading-[1.4] font-semibold" style={{ borderRadius: "18px 18px 18px 6px", background: F.hauch }}>
          Hier hört man mir zu, auch wenn ich neu bin.
        </p>
      </div>
    ),
  },
  {
    titel: "Wann es kippt",
    text: "Neue gegen Langjährige: in welcher Phase die Begeisterung nachlässt und was dann fehlt.",
    bild: (
      <div className="h-[92px] flex items-end gap-2.5">
        {[[84, F.dunkel], [54, F.akzent], [62, F.dunkel], [72, F.dunkel]].map(([h, farbe], i) => (
          <span key={i} className="w-[34px]" style={{ height: h, borderRadius: "8px 8px 0 0", background: farbe }} />
        ))}
        <span className="ml-1.5 self-center text-xs font-semibold" style={{ color: F.daempft }}>Jahr 1 bis 4</span>
      </div>
    ),
  },
  {
    titel: "Innen gegen außen",
    text: (
      <>
        Erlebt dein Team dieselbe Firma wie deine Kunden? Wenn nicht, spürt man das am Telefon.{" "}
        <Link to="/positionierung" className="font-semibold" style={{ color: F.link }}>Mehr im Modul Positionierung</Link>
      </>
    ),
    bild: (
      <div className="h-[92px] flex items-center">
        <span className="w-[84px] h-[84px] rounded-full inline-flex items-center justify-center text-[13px] font-bold text-white" style={{ background: "rgba(255,55,100,0.85)" }}>Team</span>
        <span className="w-[84px] h-[84px] -ml-[26px] rounded-full inline-flex items-center justify-center text-[13px] font-bold text-white" style={{ background: "rgba(45,45,45,0.85)" }}>Kunden</span>
      </div>
    ),
  },
];

function Blickwinkel() {
  return (
    <section style={{ background: F.hauch }}>
      <div className={`${BREITE} py-24`}>
        <Etikett>Mehr als ein Stimmungsbild</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Sechs Blickwinkel, <span style={{ color: F.akzent }}>die du so noch nie hattest.</span>
        </h2>
        <div className="mt-11 grid gap-5 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {BLICKWINKEL.map((b, i) => (
            <article key={b.titel} className="rounded-[28px] p-7 bg-white">
              <div aria-hidden="true">{b.bild}</div>
              <p className="mt-[18px] text-[13px] font-bold" style={{ color: F.etikett }}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-[22px] leading-[1.2] font-bold">{b.titel}</h3>
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Landkarte: wichtig gegen erlebt
// ---------------------------------------------------------------------------
function Landkarte() {
  const [wahl, setWahl] = useState(0);
  const p = PUNKTE[wahl];
  const feld = FELD[p.feld];

  return (
    <section style={{ background: F.dunkel, color: "#ffffff" }}>
      <div className={`${BREITE} py-24`}>
        <Etikett dunkel>Wichtig gegen erlebt</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Wo du Leute verlierst. <span style={{ color: F.akzent }}>Und wo du Geld verbrennst.</span>
        </h2>
        <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.hellAufDunkel }}>
          Dein Team sagt uns, was ihm bei einem Arbeitgeber wichtig ist und wie es das bei dir erlebt. Daraus wird eine
          Landkarte. Tipp auf einen Punkt.
        </p>

        <div className="mt-11 flex flex-wrap items-stretch gap-x-12 gap-y-8">
          <div className="flex-[1_1_520px] min-w-0">
            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5">
              <div className="flex items-center justify-center">
                <span className="-rotate-90 whitespace-nowrap text-xs font-semibold" style={{ color: "#a9a6a2" }}>so wichtig ist es dem Team</span>
              </div>
              <div className="relative rounded-3xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-[3px]" style={{ aspectRatio: "4 / 3", background: F.dunkel }}>
                <div className="p-4 text-sm font-bold" style={{ background: "#5c2a37", color: "#ff9db2" }}>Hier verlierst du Leute</div>
                <div className="p-4 text-sm font-bold text-right" style={{ background: "#24493a", color: "#7fe0ab" }}>Hier hältst du sie</div>
                <div className="p-4 flex items-end text-sm font-bold" style={{ background: F.dunkelKarte, color: "#a9a6a2" }}>Kann warten</div>
                <div className="p-4 flex items-end justify-end text-sm font-bold" style={{ background: "#4a3f2a", color: "#f2c46d" }}>Hier verbrennst du Geld</div>
                {PUNKTE.map((q, i) => {
                  const an = i === wahl;
                  return (
                    <button
                      key={q.name}
                      type="button"
                      aria-pressed={an}
                      onClick={() => setWahl(i)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 min-h-[44px] pl-1.5 pr-3 rounded-full text-[13px] font-bold whitespace-nowrap cursor-pointer"
                      style={{
                        left: `${q.x}%`,
                        top: `${q.y}%`,
                        background: an ? "#ffffff" : "rgba(45,45,45,0.9)",
                        color: an ? F.dunkel : "#ffffff",
                        boxShadow: an ? "0 10px 24px rgba(0,0,0,0.35)" : "none",
                      }}
                    >
                      <span aria-hidden="true" className="w-3.5 h-3.5 rounded-full" style={{ background: FELD[q.feld].grund, border: "2px solid #ffffff" }} />
                      {q.name}
                    </button>
                  );
                })}
              </div>
              <span />
              <p className="text-center text-xs font-semibold" style={{ color: "#a9a6a2" }}>so erlebt es das Team bei dir</p>
            </div>
          </div>

          <div aria-live="polite" className="flex-[1_1_320px] min-w-0 rounded-[28px] p-8 flex flex-col" style={{ background: F.dunkelKarte }}>
            <span className="self-start inline-flex items-center min-h-[30px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.08em]" style={{ background: feld.grund, color: feld.farbe }}>
              {feld.name}
            </span>
            <h3 className="mt-[18px] text-[30px] leading-[1.1] font-black uppercase">{p.name}</h3>
            <p className="mt-3.5 text-[17px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>{p.text}</p>
            <p className="mt-auto pt-6 text-xs" style={{ color: "#a9a6a2" }}>
              Lage der Punkte beispielhaft. Bei dir entsteht die Karte aus den Antworten deines Teams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Anonymität zum Ausprobieren
// ---------------------------------------------------------------------------
function Zaehler() {
  const [n, setN] = useState(3);
  const offen = n >= MINDESTZAHL;
  let sichtbar;
  if (n === 0) sichtbar = "Noch nichts. Hier wartet niemand auf einzelne Antworten.";
  else if (!offen) sichtbar = `Nur, dass ${n} von ${MINDESTZAHL} nötigen Interviews da sind. Keine Antworten, keine Tendenz.`;
  else sichtbar = "Ab jetzt das gemeinsame Bild der Werkstatt. Nie eine einzelne Antwort, nie ein Name.";

  return (
    <div className="flex-[1_1_440px] min-w-0 rounded-[28px] p-8" style={{ background: F.dunkelKarte }}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-bold">Bereich Werkstatt</p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setN((x) => Math.max(0, x - 1))}
            aria-label="Ein Interview weniger"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ border: "1px solid #767676", background: "transparent" }}
          >
            <Minus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span aria-live="polite" className="min-w-[48px] text-center text-[30px] font-black">{n}</span>
          <button
            type="button"
            onClick={() => setN((x) => Math.min(10, x + 1))}
            aria-label="Ein Interview mehr"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ background: F.akzent }}
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="mt-[22px] flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => {
          const voll = i < n;
          const farbe = offen ? "#45d085" : F.akzent;
          return (
            <span
              key={i}
              className="w-[30px] h-[30px] rounded-full box-border"
              style={{ background: voll ? farbe : "transparent", border: `2px solid ${voll ? farbe : "#767676"}` }}
            />
          );
        })}
      </div>
      <div className="mt-6 rounded-[18px] p-5" style={{ background: offen ? "#45d085" : "#4a4a4a", color: offen ? F.dunkel : "#ffffff" }}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-85">Das siehst du</p>
        <p aria-live="polite" className="mt-1.5 text-lg leading-[1.4] font-bold">{sichtbar}</p>
      </div>
      <p className="mt-3.5 text-xs" style={{ color: "#b3b3b3" }}>Die Mindestzahl legen wir mit dir fest, standardmäßig {MINDESTZAHL}.</p>
    </div>
  );
}

export default function Team() {
  return (
    <Modulseite
      titel="Team | andi fragt."
      modul="Team"
      hintergrund={F.hauch}
      kopfRand={false}
      fussDunkel
      fussHintergrund={F.dunkel}
    >
      <Einstieg />
      <Schaetzspiel />
      <Blickwinkel />
      <Landkarte />

      {/* Zwei Wege */}
      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <h2 className="max-w-[780px]" style={H2_STIL}>
            Kündigungen passieren <span style={{ color: F.akzent }}>nicht über Nacht.</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, color: F.daempft }}>
            Zwischen dem ersten Frust und der Kündigung liegen meist Monate. In dieser Zeit sagt kaum jemand etwas.
            Außer man fragt richtig.
          </p>
          <div className="mt-12 flex flex-col gap-10">
            {WEGE.map((w) => (
              <div key={w.titel}>
                <p className="text-[15px] font-bold uppercase tracking-[0.1em]" style={{ color: w.farbe }}>{w.titel}</p>
                <ol className="mt-4 grid gap-3 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
                  {w.schritte.map((s) => (
                    <li key={s.wann + s.was} className="rounded-[18px] px-[18px] pt-[18px] pb-5 min-h-[110px]" style={{ background: s.grund, color: s.text }}>
                      <span className="block text-xs font-semibold opacity-80">{s.wann}</span>
                      <span className="block mt-2 leading-[1.35] font-bold">{s.was}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <Beispielhinweis>Typischer Verlauf zur Veranschaulichung.</Beispielhinweis>
        </div>
      </section>

      {/* Anonymität zum Ausprobieren */}
      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_400px] min-w-0">
            <Etikett dunkel>Ehrlichkeit braucht Schutz</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Niemand ist erkennbar. <span style={{ color: F.akzent }}>Auch nicht für dich.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              Eine Gruppe wird erst gezeigt, wenn genug Interviews da sind. Kleine Bereiche fassen wir zusammen. Probier
              es aus: Wie viele aus der Werkstatt haben schon geantwortet?
            </p>
            <p className="mt-[18px] text-[15px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>
              Das sagen wir deinem Team auch genau so. Erst dann wird ehrlich geantwortet.
            </p>
          </div>
          <Zaehler />
        </div>
      </section>

      {/* Was du davon hast */}
      <section className="bg-white">
        <div className={`${BREITE} py-[104px] flex flex-wrap items-center gap-x-20 gap-y-14`}>
          <div className="flex-[1_1_400px] min-w-0 flex justify-center">
            <div className="relative" style={{ width: 420, maxWidth: "100%", aspectRatio: "1 / 1" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center text-center p-14 box-border" style={{ background: F.hauch }}>
                <span style={H2_STIL}>
                  Die Guten <span style={{ color: F.akzent }}>bleiben.</span>
                </span>
              </div>
              <span
                aria-hidden="true"
                className="absolute w-[132px] h-[132px] rounded-full flex items-center justify-center text-center p-3.5 box-border font-bold leading-[1.15] text-white"
                style={{ right: "-4%", bottom: "6%", background: F.dunkel }}
              >
                Bessere kommen.
              </span>
            </div>
          </div>
          <div className="flex-[1_1_440px] min-w-0">
            <Etikett>Was du davon hast</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Zuhören, <span style={{ color: F.akzent }}>das sich rechnet.</span>
            </h2>
            <div className="mt-7 flex flex-col gap-3.5">
              {GEWINN.map((g) => (
                <div key={g.titel} className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 items-start p-[18px] rounded-[20px]" style={{ background: F.hauch }}>
                  <span aria-hidden="true" className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[22px] font-black" style={{ color: F.etikett }}>
                    {g.zeichen}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{g.titel}</h3>
                    <p className="mt-1 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ergebnis */}
      <section className={`${BREITE} py-24`}>
        <Etikett>Das bekommst du</Etikett>
        <h2 className="mt-3" style={H2_STIL}>
          Von der Landkarte <span style={{ color: F.akzent }}>zur Stellenanzeige.</span>
        </h2>
        <div className="mt-10 grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {ERGEBNIS.map((r) => (
            <article key={r.nr} className="rounded-[28px] p-7 bg-white">
              <span className="inline-flex h-[30px] px-3 items-center rounded-full text-xs font-bold text-white" style={{ background: F.dunkel }}>{r.nr}</span>
              <h3 className="mt-[18px] text-[21px] leading-[1.2] font-bold">{r.titel}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
              <p className="mt-4 px-4 py-3.5 rounded-[14px] text-[15px] leading-[1.45] font-semibold italic" style={{ background: F.hauch }}>{r.beispiel}</p>
            </article>
          ))}
        </div>
        <Beispielhinweis className="mt-[18px]">
          Die Sätze in den Karten sind Beispiele. Dazu kommen wie in jedem Modul Analyse-Handout und Präsentation bei dir.
        </Beispielhinweis>
      </section>

      {/* Häufige Fragen */}
      <Faq seite="team" look="rosa" />

      {/* Abschluss */}
      <section className="rounded-t-[40px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] text-center`}>
          <h2 className="mx-auto max-w-[820px]" style={H2_STIL}>
            Dein Bauchgefühl ist gut. <span style={{ color: F.akzent }}>Die Antwort deines Teams ist besser.</span>
          </h2>
          <p className="mt-[18px] mx-auto max-w-[560px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            Im unverbindlichen Erstgespräch klären wir, welche Bereiche wir interviewen und wie wir dein Team einladen.
          </p>
          <div className="mt-7 flex justify-center">
            <Hauptknopf href={mailAn(BETREFF)}>Unverbindlich anfragen</Hauptknopf>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
