import React, { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Dachzeile,
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, anfrageLinkEn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";
import Zaehler from "@/components/oeffentlich/Zaehler";

// English module page 02 Team under /en/team (17.11.2026), adapted from src/pages/modul/Team.jsx.
// Same layout and interactions, British English. All figures are marked as examples.
// Anonymity wording follows the project rule: no names, groups under 6 merged, never absolute.

const BETREFF = "andi fragt. Team-Interview";
const mailAn = anfrageLinkEn;

const BLASEN = [
  { text: "I'd take on more responsibility. Nobody has ever asked me.", wer: "Administration", pos: { left: 0, top: 6 }, grund: "#ffffff", farbe: F.dunkel, dreh: "-3deg", ecke: "22px 22px 22px 6px" },
  { text: "The team is the reason I'm still here.", wer: "Workshop", pos: { right: 0, top: 40 }, grund: F.dunkel, farbe: "#ffffff", dreh: "2.5deg", ecke: "22px 22px 6px 22px" },
  { text: "We're always the last to hear about decisions.", wer: "Field sales", pos: { left: 10, bottom: 40 }, grund: "#e02551", farbe: "#ffffff", dreh: "2deg", ecke: "22px 22px 22px 6px" },
  { text: "After three weeks I was on my own.", wer: "Warehouse", pos: { right: 6, bottom: 0 }, grund: "#ffffff", farbe: F.dunkel, dreh: "-2deg", ecke: "22px 22px 6px 22px" },
];

const AUSSAGEN = [
  { thema: "Openness", aussage: "I don't have to fear negative consequences when I criticise something.", team: 41, einsicht: "Where criticism feels risky, you only hear about problems once they are expensive." },
  { thema: "Information", aussage: "I get all the information I need to do my job.", team: 48, einsicht: "Missing information costs time every single day. It almost never gets reported." },
  { thema: "Commitment", aussage: "I would apply to work here again.", team: 63, einsicht: "People who wouldn't apply again have often already left in their heads." },
];
const SCHAETZWERTE = [20, 40, 60, 80];

const FELD = {
  verlieren: { name: "Where you lose people", grund: F.akzent, farbe: "#ffffff" },
  halten: { name: "Where you keep them", grund: "#45d085", farbe: F.dunkel },
  geld: { name: "Where you burn money", grund: "#f2c46d", farbe: F.dunkel },
  warten: { name: "Can wait", grund: "#5a5a5a", farbe: "#ffffff" },
};
const PUNKTE = [
  { name: "Training", x: 24, y: 20, feld: "verlieren", text: "Very important to your team, experienced as weak with you. This is where good people leave first. A clear plan for each person is the fastest lever." },
  { name: "Flexible hours", x: 30, y: 38, feld: "verlieren", text: "Often underestimated. Even a little leeway changes how your team experiences you as an employer." },
  { name: "Team spirit", x: 78, y: 14, feld: "halten", text: "Your strength. It belongs in every job ad, in your team's own words." },
  { name: "Job security", x: 70, y: 32, feld: "halten", text: "Taken for granted. Good that it's true. On its own it won't excite anyone." },
  { name: "Company party", x: 78, y: 62, feld: "geld", text: "Well meant, hardly wanted. The same budget does far more elsewhere." },
  { name: "Free parking", x: 64, y: 78, feld: "geld", text: "Nice, but not a reason to stay. Review it rather than expand it." },
  { name: "International work", x: 24, y: 72, feld: "warten", text: "Not important to your team right now. No action needed." },
];

const STILL = { grund: F.grau, text: F.dunkel };
const LAUT = { grund: "#e02551", text: "#ffffff" };
const GUT = { grund: F.dunkel, text: "#ffffff" };

const WEGE = [
  {
    titel: "When nobody asks",
    farbe: F.daempft,
    schritte: [
      { wann: "Month 1", was: "First frustration, swallowed.", ...STILL },
      { wann: "Month 3", was: "Fewer ideas, more working to rule.", ...STILL },
      { wann: "Month 6", was: "The online profile gets updated.", ...STILL },
      { wann: "Month 9", was: "The resignation comes as a surprise.", ...LAUT },
      { wann: "After that", was: "Refill the role. The knowledge is gone.", ...LAUT },
    ],
  },
  {
    titel: "When andi asks",
    farbe: F.etikett,
    schritte: [
      { wann: "Week 1", was: "Confidential interview across the whole team.", ...GUT },
      { wann: "Week 4", was: "The pattern becomes visible, not the person.", ...GUT },
      { wann: "Week 6", was: "Presentation and concrete actions.", ...GUT },
      { wann: "After 6 months", was: "Short pulse check: what has really moved?", ...GUT },
    ],
  },
];

const GEWINN = [
  { zeichen: "1", titel: "Keep your top performers", text: "You learn early what holds good people back, and can act before they leave." },
  { zeichen: "2", titel: "Budget that works", text: "You invest in what excites your team and save on what nobody would miss." },
  { zeichen: "3", titel: "Applications that fit", text: "Job ads in your team's own words attract people who genuinely fit." },
  { zeichen: "4", titel: "Progress you can see", text: "The first interview is your baseline. The pulse check after six months shows what has changed." },
];

const ERGEBNIS = [
  { nr: "Blind spots", titel: "Your view and your team's", text: "Where you see things the same way and where you are far apart, by department once the minimum is reached.", beispiel: "Information: you 80%, team 48%." },
  { nr: "Map", titel: "Where to act, where to save", text: "What matters to your team, set against what it experiences with you.", beispiel: "Training first, rethink the company party." },
  { nr: "Employer promise", titel: "Why people work for you", text: "An honest promise your team would sign up to themselves.", beispiel: "Here your word counts, even on day one." },
  { nr: "Recruiting", titel: "Lines for your job ads", text: "Real answers become copy that speaks to applicants.", beispiel: "We're not looking for someone who can do everything. We're looking for someone who thinks along with us." },
];

function Einstieg() {
  return (
    <section className={`${BREITE} pt-10 pb-[88px] flex flex-wrap items-center gap-x-14 gap-y-12`}>
      <div className="flex-[1_1_460px] min-w-0">
        <h1 style={{ ...H1_STIL, fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 0.96 }}>
          <Dachzeile>Module 02 Team: employee satisfaction</Dachzeile>
          <span className="block mt-[18px]">
            How well do you really know <span style={{ color: F.akzent }}>your team?</span>
          </span>
        </h1>
        <p className="mt-[26px]" style={{ ...LEAD_STIL, maxWidth: 560, color: F.daempft }}>
          You see what is visible day to day. Your team knows what keeps it, what holds it back and what would make
          people leave. In a confidential interview, they say so. We put your view and theirs side by side.
        </p>
        <p className="mt-5 text-[22px] leading-[1.3] font-bold">
          So the good ones stay. <span style={{ color: F.akzent }}>And better ones join.</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Hauptknopf href={mailAn(BETREFF)}>Book a first call</Hauptknopf>
          <a
            href="#test"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] rounded px-[22px] text-sm font-semibold uppercase tracking-[0.04em] box-border"
            style={{ border: `2px solid ${F.dunkel}`, color: F.dunkel, textDecoration: "none" }}
          >
            Test your gut feeling <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <FuerDich rollen={["Managing directors", "HR and people teams", "Team leaders"]} />
      </div>

      <div className="flex-[1_1_480px] min-w-0">
        <div
          role="list"
          aria-label="Examples of answers from a team, without names"
          className="relative flex flex-col items-center gap-3.5 md:block md:h-[540px]"
        >
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <RundesFoto
              src="/bilder/team.webp"
              alt="Team laughing together during a coffee break"
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
        <Beispielhinweis className="mt-3.5 text-center">Sample answers for illustration.</Beispielhinweis>
      </div>
    </section>
  );
}

function Schaetzspiel() {
  const [tipp, setTipp] = useState([null, null, null]);
  const fertig = tipp.filter((t) => t !== null).length;
  const alle = fertig === AUSSAGEN.length;

  let fazitTitel;
  let fazitText;
  if (!alle) {
    const rest = AUSSAGEN.length - fertig;
    fazitTitel = rest === AUSSAGEN.length
      ? "Three guesses to the answer"
      : `${rest} more ${rest === 1 ? "guess" : "guesses"} to the answer`;
    fazitText = "At the end you see how far off your gut feeling is on average.";
  } else {
    const schnitt = Math.round(AUSSAGEN.reduce((s, a, i) => s + Math.abs(tipp[i] - a.team), 0) / AUSSAGEN.length);
    fazitTitel = `On average ${schnitt} points off`;
    fazitText = schnitt <= 10
      ? "Strong gut feeling. Whether it holds for your own team, only the real answers will show."
      : "That's no criticism. Things look different from the top. That exact gap is the lever we open up with you.";
  }

  return (
    <section id="test" className="bg-white rounded-t-[40px] scroll-mt-4">
      <div className={`${BREITE} py-24`}>
        <Etikett>Leader's view vs. team's view</Etikett>
        <h2 className="mt-3 max-w-[820px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Take a guess. <span style={{ color: F.akzent }}>Then see what a team says.</span>
        </h2>
        <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
          Three statements from our interview. How many people in your team agree? Tap your estimate.
        </p>

        <div className="mt-11 grid gap-5 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {AUSSAGEN.map((a, i) => {
            const t = tipp[i];
            const diff = t === null ? 0 : Math.abs(t - a.team);
            const abstand = t === null
              ? ""
              : diff <= 10
                ? `Close. Only ${diff} points apart.`
                : `${diff} points apart. ${t > a.team ? "You rated your team more positively." : "Your team sees it more positively than you do."}`;
            return (
              <article key={a.thema} className="rounded-[28px] p-7 flex flex-col" style={{ background: F.hauch }}>
                <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.etikett }}>{a.thema}</p>
                <p className="mt-3 text-[21px] leading-[1.3] font-bold min-h-[82px]">{a.aussage}</p>
                <p className="mt-[18px] mb-2.5 text-sm font-semibold" style={{ color: F.daempft }}>How many agree?</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Your estimate for: ${a.aussage}`}>
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
                        {w}%
                      </button>
                    );
                  })}
                </div>
                {t !== null && (
                  <div aria-live="polite" className="mt-[22px] pt-5" style={{ borderTop: `1px solid ${F.hauchRand}` }}>
                    <div className="grid grid-cols-[112px_minmax(0,1fr)_48px] gap-2.5 items-center text-sm">
                      <span className="font-semibold">Your estimate</span>
                      <span className="h-3 rounded-full bg-white">
                        <span className="block h-full rounded-full" style={{ width: `${t}%`, background: F.dunkel }} />
                      </span>
                      <strong className="text-right">{t}%</strong>
                      <span className="font-semibold">Example team</span>
                      <span className="h-3 rounded-full bg-white">
                        <span className="block h-full rounded-full" style={{ width: `${a.team}%`, background: F.akzent }} />
                      </span>
                      <strong className="text-right" style={{ color: F.link }}>{a.team}%</strong>
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
          {alle && <Hauptknopf href={mailAn(BETREFF)} pfeil={false}>Get the real answer</Hauptknopf>}
        </div>
        <Beispielhinweis className="mt-3.5">
          The team figures are examples for illustration, not results from any particular company.
        </Beispielhinweis>
      </div>
    </section>
  );
}

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
    titel: "Your blind spots",
    text: "Where you and your team see things very differently. On leadership, information, fairness and collaboration.",
    bild: (
      <div className="h-[92px] flex flex-col justify-center gap-2.5">
        <Balken wer="You" breite="85%" farbe={F.dunkel} />
        <Balken wer="Team" breite="41%" farbe={F.akzent} />
      </div>
    ),
  },
  {
    titel: "Where you lose people",
    text: "What your team values in an employer, set against what it experiences with you.",
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
    titel: "What really attracts",
    text: "Which benefits excite people, which are simply expected and which nobody would miss.",
    bild: (
      <div className="h-[92px] flex flex-wrap content-center gap-2">
        <Pille grund="#45d085" farbe={F.dunkel}>excites</Pille>
        <Pille grund={F.dunkel} farbe="#ffffff">expected</Pille>
        <Pille grund={F.grau} farbe={F.daempft}>doesn't matter</Pille>
      </div>
    ),
  },
  {
    titel: "Why people join you",
    text: "The real reasons, in your team's own words. The best template for every job ad.",
    bild: (
      <div className="h-[92px] flex items-center">
        <p className="px-4 py-3 text-[15px] leading-[1.4] font-semibold" style={{ borderRadius: "18px 18px 18px 6px", background: F.hauch }}>
          People listen to me here, even though I'm new.
        </p>
      </div>
    ),
  },
  {
    titel: "When it tips",
    text: "Newcomers vs. long-serving staff: at which stage enthusiasm fades and what is missing then.",
    bild: (
      <div className="h-[92px] flex items-end gap-2.5">
        {[[84, F.dunkel], [54, F.akzent], [62, F.dunkel], [72, F.dunkel]].map(([h, farbe], i) => (
          <span key={i} className="w-[34px]" style={{ height: h, borderRadius: "8px 8px 0 0", background: farbe }} />
        ))}
        <span className="ml-1.5 self-center text-xs font-semibold" style={{ color: F.daempft }}>Years 1 to 4</span>
      </div>
    ),
  },
  {
    titel: "Inside vs. outside",
    text: (
      <>
        Does your team experience the same company as your customers do? If not, people can hear it on the phone.{" "}
        <Link to="/en/positioning" className="font-semibold" style={{ color: F.link }}>More in the Positioning module</Link>
      </>
    ),
    bild: (
      <div className="h-[92px] flex items-center">
        <span className="w-[84px] h-[84px] rounded-full inline-flex items-center justify-center text-[13px] font-bold text-white" style={{ background: "rgba(255,55,100,0.85)" }}>Team</span>
        <span className="w-[84px] h-[84px] -ml-[26px] rounded-full inline-flex items-center justify-center text-[13px] font-bold text-white" style={{ background: "rgba(45,45,45,0.85)" }}>Customers</span>
      </div>
    ),
  },
];

function Blickwinkel() {
  return (
    <section style={{ background: F.hauch }}>
      <div className={`${BREITE} py-24`}>
        <Etikett>More than a mood snapshot</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Six perspectives <span style={{ color: F.akzent }}>you have never had before.</span>
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

function Landkarte() {
  const [wahl, setWahl] = useState(0);
  const p = PUNKTE[wahl];
  const feld = FELD[p.feld];

  return (
    <section style={{ background: F.dunkel, color: "#ffffff" }}>
      <div className={`${BREITE} py-24`}>
        <Etikett dunkel>Important vs. experienced</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 }}>
          Where you lose people. <span style={{ color: F.akzent }}>And where you burn money.</span>
        </h2>
        <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.hellAufDunkel }}>
          Your team tells us what matters to them in an employer and how they experience it with you. That becomes a
          map. Tap a point.
        </p>

        <div className="mt-11 flex flex-wrap items-stretch gap-x-12 gap-y-8">
          <div className="flex-[1_1_520px] min-w-0">
            <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5">
              <div className="flex items-center justify-center">
                <span className="-rotate-90 whitespace-nowrap text-xs font-semibold" style={{ color: "#a9a6a2" }}>how important it is to the team</span>
              </div>
              <div className="relative rounded-3xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-[3px]" style={{ aspectRatio: "4 / 3", background: F.dunkel }}>
                <div className="p-4 text-sm font-bold" style={{ background: "#5c2a37", color: "#ff9db2" }}>Where you lose people</div>
                <div className="p-4 text-sm font-bold text-right" style={{ background: "#24493a", color: "#7fe0ab" }}>Where you keep them</div>
                <div className="p-4 flex items-end text-sm font-bold" style={{ background: F.dunkelKarte, color: "#a9a6a2" }}>Can wait</div>
                <div className="p-4 flex items-end justify-end text-sm font-bold" style={{ background: "#4a3f2a", color: "#f2c46d" }}>Where you burn money</div>
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
              <p className="text-center text-xs font-semibold" style={{ color: "#a9a6a2" }}>how the team experiences it with you</p>
            </div>
          </div>

          <div aria-live="polite" className="flex-[1_1_320px] min-w-0 rounded-[28px] p-8 flex flex-col" style={{ background: F.dunkelKarte }}>
            <span className="self-start inline-flex items-center min-h-[30px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.08em]" style={{ background: feld.grund, color: feld.farbe }}>
              {feld.name}
            </span>
            <h3 className="mt-[18px] text-[30px] leading-[1.1] font-black uppercase">{p.name}</h3>
            <p className="mt-3.5 text-[17px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>{p.text}</p>
            <p className="mt-auto pt-6 text-xs" style={{ color: "#a9a6a2" }}>
              Point positions are examples. Your map is built from your own team's answers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TeamEn() {
  return (
    <Modulseite
      titel="Find out what your team really thinks | andi fragt."
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

      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <h2 className="max-w-[780px]" style={H2_STIL}>
            Resignations don't happen <span style={{ color: F.akzent }}>overnight.</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, color: F.daempft }}>
            Between the first frustration and the resignation there are usually months. During that time, hardly anyone
            says a word. Unless you ask the right way.
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
          <Beispielhinweis>A typical course of events, for illustration.</Beispielhinweis>
        </div>
      </section>

      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_400px] min-w-0">
            <Etikett dunkel>Honesty needs protection</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              No names. <span style={{ color: F.akzent }}>Not even for you.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              A group is only shown once enough interviews are in. Small departments are merged. Try it out: how many
              people from the workshop have answered so far?
            </p>
            <p className="mt-[18px] text-[15px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>
              We tell your team exactly this. Only then do people answer honestly.
            </p>
          </div>
          <Zaehler />
        </div>
      </section>

      <section className="bg-white">
        <div className={`${BREITE} py-[104px] flex flex-wrap items-center gap-x-20 gap-y-14`}>
          <div className="flex-[1_1_400px] min-w-0 flex justify-center">
            <div className="relative" style={{ width: 420, maxWidth: "100%", aspectRatio: "1 / 1" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center text-center p-14 box-border" style={{ background: F.hauch }}>
                <span style={H2_STIL}>
                  The good ones <span style={{ color: F.akzent }}>stay.</span>
                </span>
              </div>
              <span
                aria-hidden="true"
                className="absolute w-[132px] h-[132px] rounded-full flex items-center justify-center text-center p-3.5 box-border font-bold leading-[1.15] text-white"
                style={{ right: "-4%", bottom: "6%", background: F.dunkel }}
              >
                Better ones join.
              </span>
            </div>
          </div>
          <div className="flex-[1_1_440px] min-w-0">
            <Etikett>What's in it for you</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Listening <span style={{ color: F.akzent }}>that pays off.</span>
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

      <section className={`${BREITE} py-24`}>
        <Etikett>What you get</Etikett>
        <h2 className="mt-3" style={H2_STIL}>
          From the map <span style={{ color: F.akzent }}>to the job ad.</span>
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
          The lines in the cards are examples. As with every module, you also get the analysis handout and a
          presentation at your premises.
        </Beispielhinweis>
      </section>

      <Faq seite="team" look="rosa" />

      <section className="rounded-t-[40px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] text-center`}>
          <h2 className="mx-auto max-w-[820px]" style={H2_STIL}>
            Your gut feeling is good. <span style={{ color: F.akzent }}>Your team's answer is better.</span>
          </h2>
          <p className="mt-[18px] mx-auto max-w-[560px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            In a free first call, with no obligation, we work out which departments to interview and how to invite your team.
          </p>
          <div className="mt-7 flex justify-center">
            <Hauptknopf href={mailAn(BETREFF)}>Get in touch, no obligation</Hauptknopf>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
