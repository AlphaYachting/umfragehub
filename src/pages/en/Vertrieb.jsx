import React, { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Dachzeile,
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, anfrageLinkEn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// English module page 04 Sales under /en/sales (17.11.2026), adapted from src/pages/modul/Vertrieb.jsx.
// Same layout and interactions, British English. All figures are examples.

const BETREFF = "andi fragt. Vertriebs-Interview";
const mailAn = anfrageLinkEn;
const label = "text-xs font-bold uppercase tracking-[0.14em]";
const H2_GROSS = { ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 };

const euro = (n) => `€${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const begrenzen = (v, min, max) => Math.max(min, Math.min(max, v));

function Schritt({ onClick, label: text, voll, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      className="w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer"
      style={voll ? { background: F.dunkel, color: "#ffffff", border: 0 } : { background: "#ffffff", color: F.dunkel, border: `2px solid ${F.dunkel}` }}
    >
      {children}
    </button>
  );
}

function Hebelrechner() {
  const [angebote, setAngebote] = useState(40);
  const [quote, setQuote] = useState(25);
  const [auftrag, setAuftrag] = useState(8000);
  const [an, setAn] = useState([true, false, false]);

  const basis = angebote * 12 * (quote / 100) * auftrag;
  const hebel = [
    { name: "Close rate up 5 points", wie: "One more win out of every twenty proposals", wert: angebote * 12 * 0.05 * auftrag },
    { name: "3% less discount", wie: "Because the value is clearer than the price", wert: basis * 0.03 },
    { name: "10% more repeat orders", wie: "From customers who buy part of their needs elsewhere today", wert: basis * 0.1 },
  ];
  const plus = hebel.reduce((s, h, i) => s + (an[i] ? h.wert : 0), 0);
  const anzahl = an.filter(Boolean).length;

  const regler = [
    { name: "Proposals per month", wert: String(angebote), weniger: "Five proposals fewer", mehr: "Five proposals more",
      runter: () => setAngebote((v) => begrenzen(v - 5, 5, 300)), rauf: () => setAngebote((v) => begrenzen(v + 5, 5, 300)) },
    { name: "Close rate", wert: `${quote}%`, weniger: "Close rate five points lower", mehr: "Close rate five points higher",
      runter: () => setQuote((v) => begrenzen(v - 5, 5, 80)), rauf: () => setQuote((v) => begrenzen(v + 5, 5, 80)) },
    { name: "Average order value", wert: euro(auftrag), weniger: "Order 1,000 euros smaller", mehr: "Order 1,000 euros larger",
      runter: () => setAuftrag((v) => begrenzen(v - 1000, 1000, 100000)), rauf: () => setAuftrag((v) => begrenzen(v + 1000, 1000, 100000)) },
  ];

  return (
    <div className="mt-11 flex flex-wrap items-stretch gap-6">
      <div className="flex-[1_1_420px] min-w-0 rounded-3xl p-7" style={{ background: F.grau }}>
        <p className={label} style={{ color: F.etikett }}>Your starting point</p>
        <div className="mt-3.5 flex flex-col">
          {regler.map((r) => (
            <div key={r.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 py-4" style={{ borderBottom: `1px solid ${F.linie}` }}>
              <span className="text-base font-semibold">{r.name}</span>
              <span className="inline-flex items-center gap-2.5">
                <Schritt onClick={r.runter} label={r.weniger}><Minus size={18} strokeWidth={2.5} aria-hidden="true" /></Schritt>
                <span aria-live="polite" className="min-w-[96px] text-center text-[22px] font-black">{r.wert}</span>
                <Schritt onClick={r.rauf} label={r.mehr} voll><Plus size={18} strokeWidth={2.5} aria-hidden="true" /></Schritt>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[15px]" style={{ color: F.daempft }}>Revenue from proposals today</p>
        <p className="mt-1 text-[34px] font-black">
          {euro(basis)} <span className="text-base font-semibold" style={{ color: F.daempft }}>a year</span>
        </p>
      </div>

      <div className="flex-[1_1_420px] min-w-0 rounded-3xl p-7 flex flex-col text-white" style={{ background: F.dunkel }}>
        <p className={label} style={{ color: F.etikettDunkel }}>Switch on levers</p>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {hebel.map((h, i) => {
            const aktiv = an[i];
            return (
              <button
                key={h.name}
                type="button"
                aria-pressed={aktiv}
                onClick={() => setAn((alt) => alt.map((x, j) => (j === i ? !x : x)))}
                className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 items-center text-left min-h-[64px] px-4 py-3 rounded-[14px] text-white cursor-pointer"
                style={{ border: `2px solid ${aktiv ? F.akzent : "#4a4a4a"}`, background: aktiv ? F.dunkelKarte : "transparent" }}
              >
                <span aria-hidden="true" className="w-6 h-6 rounded-md inline-flex items-center justify-center" style={{ border: "2px solid #ffffff", background: aktiv ? "#ffffff" : "transparent" }}>
                  {aktiv && <Check size={14} strokeWidth={3.5} color={F.dunkel} />}
                </span>
                <span>
                  <span className="block text-base font-bold">{h.name}</span>
                  <span className="block mt-0.5 text-[13px]" style={{ color: F.hellAufDunkel }}>{h.wie}</span>
                </span>
                <span className="text-[15px] font-extrabold" style={{ color: aktiv ? F.etikettDunkel : "#a9a6a2" }}>+ {euro(h.wert)}</span>
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="mt-auto pt-6">
          <p className="text-[15px]" style={{ color: F.hellAufDunkel }}>
            {anzahl === 0 ? "Switch on a lever" : anzahl === 1 ? "With this lever" : `With these ${anzahl} levers`}
          </p>
          <p className="mt-1 text-[clamp(34px,4vw,52px)] leading-none font-black" style={{ color: F.akzent }}>+ {euro(plus)}</p>
          {anzahl > 0 && (
            <p className="mt-2 text-[15px] font-semibold">
              That is {Math.round((plus / basis) * 100)}% more revenue a year, with the same team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Pille({ children, grund, farbe }) {
  return (
    <span className="inline-flex items-center min-h-[34px] px-3.5 rounded-full text-sm font-bold" style={{ background: grund, color: farbe }}>
      {children}
    </span>
  );
}

const BLICKWINKEL = [
  {
    titel: "The real reasons behind yes and no",
    text: "The last order you won, the last proposal you lost: what really tipped the balance.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center gap-2.5">
        <Pille grund="#45d085" farbe={F.dunkel}>Won because</Pille>
        <Pille grund={F.akzent} farbe="#ffffff">Lost because</Pille>
      </div>
    ),
  },
  {
    titel: "The line customers use to say no",
    text: "Every sales team knows it. We show what it really means and what the best response is.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center">
        <p className="px-4 py-3 bg-white text-[15px] leading-[1.4] font-semibold" style={{ borderRadius: "18px 18px 18px 6px", color: F.dunkel }}>
          We'll think about it.
        </p>
      </div>
    ),
  },
  {
    titel: "Revenue that goes elsewhere",
    text: "What existing customers buy from others, even though they could get it from you. Your fastest growth.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center gap-3">
        <span className="relative w-[72px] h-[72px] rounded-full" style={{ background: "conic-gradient(#ff3764 0 46%, #4a4a4a 46% 100%)" }}>
          <span className="absolute inset-[14px] rounded-full" style={{ background: F.dunkelKarte }} />
        </span>
        <span className="text-[13px] font-semibold leading-[1.35]" style={{ color: F.hellAufDunkel }}>buy part of their<br />needs elsewhere</span>
      </div>
    ),
  },
  {
    titel: "Does your sales team know the customer?",
    text: "Customers rank what matters to them. Your sales team guesses the same ranking. The match shows how well you know them.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex flex-col justify-center gap-2 text-xs font-semibold">
        {[["Customers", [F.akzent, "#ffffff", "#a9a6a2", "#5a5a5a"]], ["Sales", ["#ffffff", "#5a5a5a", F.akzent, "#a9a6a2"]]].map(([wer, farben]) => (
          <div key={wer} className="grid grid-cols-[70px_repeat(4,28px)] gap-1.5 items-center">
            <span>{wer}</span>
            {farben.map((f, i) => <span key={i} className="h-[22px] rounded-md" style={{ background: f }} />)}
          </div>
        ))}
      </div>
    ),
  },
  {
    titel: "The best idea comes from the front line",
    text: "Ideas from the team, rated by everyone without names. Chosen for customer value, not hierarchy.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex items-end gap-2">
        {[30, 46, 80, 54, 38].map((h, i) => (
          <span key={i} className="w-[30px]" style={{ height: h, borderRadius: "6px 6px 0 0", background: i === 2 ? "#45d085" : "#5a5a5a" }} />
        ))}
      </div>
    ),
  },
  {
    titel: "Signals before the purchase",
    text: "How your field sales team can tell that a bigger purchase is coming. So you get there before your competitors.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex items-center gap-2.5">
        {["#5a5a5a", "#a9a6a2", "#ffffff"].map((f) => <span key={f} className="w-3 h-3 rounded-full" style={{ background: f }} />)}
        <span className="w-[18px] h-[18px] rounded-full" style={{ background: F.akzent, boxShadow: "0 0 0 6px rgba(255,55,100,0.25)" }} />
        <span className="ml-1.5 text-[13px] font-semibold" style={{ color: F.hellAufDunkel }}>before the purchase</span>
      </div>
    ),
  },
];

const GRUENDE = [
  { name: "Price too high", v: 58, k: 19 },
  { name: "Benefit unclear", v: 9, k: 31 },
  { name: "Too slow", v: 14, k: 22 },
  { name: "No follow-up", v: 4, k: 18 },
  { name: "Competitor better", v: 15, k: 10 },
];

function Schaetzspiel() {
  const [wahl, setWahl] = useState(null);
  let titel = "";
  let text = "";
  if (wahl !== null) {
    const g = GRUENDE[wahl];
    if (wahl === 0) {
      titel = "That's what your sales team says too.";
      text = "Customers in the example see it differently: only 19% name price, 31% an unclear benefit. Price is often the word, not the reason.";
    } else if (g.k > g.v) {
      titel = "Good instinct.";
      text = `In the example, ${g.k}% of customers name this reason, but only ${g.v}% of the sales team. Blind spots like this cost deals.`;
    } else {
      titel = "Sales and customers see it similarly.";
      text = "On this reason the two sides are close. In the example the biggest gap is on price: 58% in sales, 19% among customers.";
    }
  }

  return (
    <>
      <div role="group" aria-label="Most common reason for a lost proposal" className="mt-9 flex flex-wrap gap-2.5">
        {GRUENDE.map((g, i) => {
          const an = wahl === i;
          return (
            <button
              key={g.name}
              type="button"
              aria-pressed={an}
              onClick={() => setWahl(i)}
              className="min-h-[48px] px-5 rounded-full text-base font-bold cursor-pointer"
              style={{ border: `2px solid ${F.dunkel}`, background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.dunkel }}
            >
              {g.name}
            </button>
          );
        })}
      </div>
      {wahl !== null && (
        <div aria-live="polite" className="mt-9 rounded-3xl p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ border: `2px solid ${F.dunkel}` }}>
          <div className="flex-[1_1_500px] min-w-0">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold">
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 rounded" style={{ background: F.dunkel }} />Your sales team in the example</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 rounded" style={{ background: F.akzent }} />Customers in the example</span>
            </div>
            <ul className="mt-[18px] flex flex-col gap-4">
              {GRUENDE.map((g, i) => (
                <li key={g.name}>
                  <p className="text-[15px]" style={{ fontWeight: wahl === i ? 800 : 600 }}>
                    {g.name}{wahl === i ? " (your guess)" : ""}
                  </p>
                  <div className="mt-[7px] grid grid-cols-[minmax(0,1fr)_44px] gap-x-2.5 gap-y-1 items-center text-[13px] font-bold">
                    <span className="h-2.5 rounded-full" style={{ background: F.grau }}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round((g.v / 60) * 100)}%`, background: F.dunkel }} />
                    </span>
                    <span>{g.v}%</span>
                    <span className="h-2.5 rounded-full" style={{ background: F.grau }}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round((g.k / 60) * 100)}%`, background: F.akzent }} />
                    </span>
                    <span style={{ color: F.link }}>{g.k}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-[1_1_300px] min-w-0 flex flex-col justify-center">
            <p className="text-[30px] leading-[1.15] font-black uppercase">{titel}</p>
            <p className="mt-3.5 text-[17px] leading-[1.6]" style={{ color: F.daempft }}>{text}</p>
          </div>
        </div>
      )}
    </>
  );
}

const TOENE = { gut: "#45d085", schlecht: "#ff3764", neutral: "#cfcbc7" };

const ARGUMENTE = [
  { text: "We've been in business for over 30 years.", urteil: "Doesn't matter", erklaerung: "Customers take experience for granted. They buy for something else.", ton: "neutral" },
  { text: "We offer the best value for money.", urteil: "Puts them off", erklaerung: "Sounds like a discount. Leads straight into price negotiation.", ton: "schlecht" },
  { text: "Your dedicated contact is there for you after the sale, too.", urteil: "Works", erklaerung: "The most frequently named reason to buy, yet almost never mentioned in the sales conversation.", ton: "gut" },
  { text: "We deliver everything from a single source.", urteil: "Partly works", erklaerung: "Convinces new customers, too generic for regular ones.", ton: "neutral" },
];

function ArgumentCheck() {
  const [offen, setOffen] = useState({});
  return (
    <div className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {ARGUMENTE.map((a, i) => {
        const auf = !!offen[i];
        return (
          <button
            key={a.text}
            type="button"
            aria-pressed={auf}
            onClick={() => setOffen((o) => ({ ...o, [i]: !o[i] }))}
            className="min-h-[220px] flex flex-col justify-between text-left p-[26px] rounded-2xl transition-colors motion-reduce:transition-none"
            style={{
              border: `2px solid ${auf ? TOENE[a.ton] : "#4a4a4a"}`,
              background: auf ? "#ffffff" : F.dunkelKarte,
              color: auf ? F.dunkel : "#ffffff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <span className={`${label} opacity-80`}>{auf ? `Customers say: ${a.urteil}` : "Your sales team says"}</span>
            <span className="mt-3 text-[21px] leading-[1.3] font-bold">{auf ? a.erklaerung : a.text}</span>
            <span className="mt-4 text-sm font-bold">{auf ? "Flip back" : "Flip over"}</span>
          </button>
        );
      })}
    </div>
  );
}

const ABLAUF = [
  { titel: "Kick-off with you", text: "Your goals, your hypotheses and who in the company really knows the customers." },
  { titel: "Interviews in sales", text: "Field sales, inside sales and service, without names and in their own words." },
  { titel: "Interviews with customers", text: "Won, lost and existing customers. The same topics, from the other side." },
  { titel: "Rating the ideas", text: "The best ideas from the team, rated by everyone without names. On customer value, not hierarchy." },
  { titel: "Workshop and plan", text: "With you and your sales team: the three strongest levers and a 90-day plan.", dunkel: true },
];

const ERGEBNIS = [
  { titel: "Your three strongest levers", text: "Where the most revenue lies for you: opportunities, close rate or order value.", beispiel: "Existing customers first, then close rate.", farbe: "#ff3764" },
  { titel: "Arguments that work", text: "Which lines convince and which ones you should drop.", beispiel: "Dedicated contact to the front, 30 years in business to the back.", farbe: "#45d085" },
  { titel: "Answers to the no", text: "The most common objections and what customers really mean by them.", beispiel: "Too expensive often means: I can't see the difference.", farbe: "#2d2d2d" },
  { titel: "90-day plan", text: "Concrete steps with your sales team, and a pulse check after six months.", beispiel: "Follow up every proposal in person after three days.", farbe: "#e02551" },
];

export default function VertriebEn() {
  return (
    <Modulseite titel="Improve sales: where deals get stuck | andi fragt." modul="Sales" hintergrund={F.dunkel} dunkel>
      <section className={`${BREITE} pt-[88px] pb-24 flex flex-wrap items-center gap-x-16 gap-y-12`}>
        <div className="flex-[3_1_560px] min-w-0">
          <h1 style={H1_STIL}>
            <Dachzeile dunkel>Module 04: Improve sales</Dachzeile>
            <span className="block mt-[18px]">
              Where your deals <span style={{ color: F.akzent }}>get stuck.</span>
            </span>
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.hellAufDunkel }}>
            Field sales, inside sales and customers know exactly where orders are lost. We capture that knowledge before
            you invest in your next sales initiative.
          </p>
          <div className="mt-8">
            <Hauptknopf href={mailAn(BETREFF)}>Book a first call</Hauptknopf>
          </div>
          <FuerDich rollen={["Heads of sales", "Managing directors", "Sales teams"]} dunkel />
        </div>
        <div className="flex-[2_1_300px] min-w-0 flex justify-center">
          <RundesFoto
            src="/bilder/vertrieb.webp"
            alt="Field sales representative on a call with a headset in the car"
            groesse={320}
            ringe={[{ abstand: 18, farbe: F.akzent, gestrichelt: true }]}
          />
        </div>
      </section>

      <section id="rechner" className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>What a lever is worth</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            A few per cent. <span style={{ color: F.akzent }}>Work out what they're worth.</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
            Set your rough figures. Then switch on the levers we work on with you.
          </p>
          <Hebelrechner />
          <Beispielhinweis className="mt-4 max-w-[820px]">
            A worked example based on your assumptions, with the levers simply added up. Not a promise. It shows what a
            single lever is worth and why it pays to ask exactly there.
          </Beispielhinweis>
        </div>
      </section>

      <section>
        <div className={`${BREITE} py-[104px]`}>
          <Etikett dunkel>More than sales statistics</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            Six perspectives <span style={{ color: F.akzent }}>you won't find in any CRM.</span>
          </h2>
          <div className="mt-11 grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            {BLICKWINKEL.map((b, i) => (
              <article key={b.titel} className="rounded-2xl p-7" style={{ background: F.dunkelKarte, borderTop: `6px solid ${b.farbe}` }}>
                <div aria-hidden="true">{b.bild}</div>
                <p className="mt-4 text-[13px] font-bold" style={{ color: F.etikettDunkel }}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-[22px] leading-[1.2] font-bold">{b.titel}</h3>
                <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="test" className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>Sales view vs. customer view</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            Take a guess: <span style={{ color: F.akzent }}>why are proposals lost?</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
            Tap the reason you think is most common. Then see what sales and customers said in an example.
          </p>
          <Schaetzspiel />
          <Beispielhinweis className="mt-4">
            The figures are examples for illustration, not results from any particular company.
          </Beispielhinweis>
        </div>
      </section>

      <section>
        <div className={`${BREITE} py-[104px]`}>
          <Etikett dunkel>Argument check</Etikett>
          <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>
            Your sales team says it. <span style={{ color: F.akzent }}>Does it work?</span>
          </h2>
          <p className="mt-4 max-w-[640px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            We set your sales team's arguments against what really convinces customers. Flip a card.
          </p>
          <ArgumentCheck />
          <Beispielhinweis dunkel className="mt-[18px]" />
        </div>
      </section>

      <section className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>How it works</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            From the first question <span style={{ color: F.akzent }}>to a 90-day plan.</span>
          </h2>
          <ol className="mt-11 grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
            {ABLAUF.map((s, i) => (
              <li
                key={s.titel}
                className="rounded-2xl p-[22px] min-h-[190px]"
                style={{ background: s.dunkel ? F.dunkel : F.grau, color: s.dunkel ? "#ffffff" : F.dunkel }}
              >
                <span
                  className="inline-flex w-9 h-9 rounded-full items-center justify-center font-black text-white"
                  style={{ background: s.dunkel ? F.akzent : F.dunkel }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3.5 text-lg leading-[1.25] font-bold">{s.titel}</h3>
                <p className="mt-2 text-sm leading-[1.55] opacity-85">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl px-[22px] py-5 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ border: `2px dashed ${F.akzent}` }}>
            <span className="text-[13px] font-extrabold uppercase tracking-[0.12em]" style={{ color: F.etikett }}>After 6 months</span>
            <span className="text-[17px] font-bold">A short pulse check in sales: what has been implemented, and has the close rate moved?</span>
          </div>
        </div>
      </section>

      <section style={{ background: F.akzent }}>
        <div className={`${BREITE} py-20 flex flex-wrap items-center gap-x-16 gap-y-6`}>
          <p className="flex-[1_1_560px] text-[clamp(22px,2.8vw,32px)] leading-[1.25] font-bold">
            Salespeople are not numbers in a CRM. They know why a customer hesitates. In the interview they say so openly,
            because it is about the path to the deal, not about their quota.
          </p>
          <p className="flex-[1_1_280px] leading-[1.6] text-white">
            Analysed by people, not by software. So that your whole sales team ends up telling the same story.
          </p>
        </div>
      </section>

      <section className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>What you get</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            A plan <span style={{ color: F.akzent }}>your sales team stands behind.</span>
          </h2>
          <div className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {ERGEBNIS.map((r) => (
              <article key={r.titel} className="rounded-xl p-[26px]" style={{ background: F.grau, borderTop: `6px solid ${r.farbe}` }}>
                <h3 className="text-xl leading-[1.25] font-bold">{r.titel}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
                <p className="mt-3.5 px-3.5 py-3 rounded-[10px] bg-white text-sm leading-[1.45] font-semibold italic">{r.beispiel}</p>
              </article>
            ))}
          </div>
          <Beispielhinweis className="mt-[18px]">The lines in the cards are examples.</Beispielhinweis>
        </div>
      </section>

      <Faq seite="vertrieb" look="dunkel" />

      <section>
        <div className={`${BREITE} py-24 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <h2 className="flex-[1_1_560px]" style={H2_STIL}>
            Before you invest in the next idea: <span style={{ color: F.akzent }}>ask the people who sell.</span>
          </h2>
          <Hauptknopf href={mailAn(BETREFF)}>Get in touch, no obligation</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
