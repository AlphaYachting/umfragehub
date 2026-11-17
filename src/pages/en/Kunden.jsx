import React, { useState } from "react";
import { Dachzeile,
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, anfrageLinkEn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// English module page 03 Customers under /en/customers (17.11.2026),
// adapted from src/pages/modul/Kunden.jsx. Same layout, British English.

const BETREFF = "andi fragt. Kunden-Interview";
const mailAn = anfrageLinkEn;

const STATIONEN = [
  { name: "Discovering", frage: "How did you first come across us?", erkenntnis: "Which channels really bring customers and which only cost money. Often it's the recommendation, not the ad.", wert: "Ad budget where your customers actually come from." },
  { name: "Deciding", frage: "What tipped the balance in our favour in the end?", erkenntnis: "The real reason to buy. It is rarely in the brochure and is often smaller and more human than you think.", wert: "More deals closed with the right argument." },
  { name: "Working together", frage: "When did you feel in good hands with us, and when not?", erkenntnis: "The moments that build trust, and the small annoyances nobody talks about.", wert: "Fewer complaints, more trust." },
  { name: "Buying again", frage: "What else could we take off your hands?", erkenntnis: "Needs your customers cover elsewhere today, even though they would rather buy from you.", wert: "More revenue from existing customers." },
  { name: "Recommending", frage: "What would have to happen for you to recommend us without hesitation?", erkenntnis: "What is missing between satisfied and delighted. That is exactly where recommendations come from.", wert: "New customers who arrive already convinced." },
];

const LEISE = [
  { titel: "They say nothing", text: "Most customers don't mention their annoyance. They just order a little less often, until they're gone." },
  { titel: "You notice too late", text: "The numbers show the decline months later. They never show the reason." },
  { titel: "We hear it sooner", text: "In a confidential interview customers speak openly, because they are not talking to you, they are talking to us." },
];

const ERGEBNIS = [
  { nr: "01", titel: "The real reasons to buy", text: "In your customers' own words, ready for your website, proposals and sales conversations." },
  { nr: "02", titel: "Spot churn early", text: "Where customers are unhappy before they show it, and what helps." },
  { nr: "03", titel: "Self-image vs. customer view", text: "Where your team and your customers see you differently. The biggest opportunities lie in the gaps." },
  { nr: "04", titel: "Handout and presentation", text: "Every insight in writing and explained in person at your premises, with clear next steps." },
];

const panelLabel = { color: "#a80f39" };

function Kundenreise() {
  const [auswahl, setAuswahl] = useState(0);
  const aktiv = STATIONEN[auswahl];

  function taste(e, i) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const neu = (i + (e.key === "ArrowRight" ? 1 : -1) + STATIONEN.length) % STATIONEN.length;
    setAuswahl(neu);
    document.getElementById(`station-${neu}`)?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="Stages of the customer journey" className="relative mt-10 grid grid-cols-5 gap-2">
        <div aria-hidden="true" className="absolute h-1 rounded" style={{ left: "10%", right: "10%", top: "clamp(22px, 4vw, 36px)", background: F.hauchRand }} />
        {STATIONEN.map((s, i) => {
          const an = i === auswahl;
          return (
            <button
              key={s.name}
              id={`station-${i}`}
              type="button"
              role="tab"
              aria-selected={an}
              aria-controls="station-inhalt"
              tabIndex={an ? 0 : -1}
              onClick={() => setAuswahl(i)}
              onKeyDown={(e) => taste(e, i)}
              className="relative flex flex-col items-center gap-3 px-1 pb-2"
              style={{ border: 0, background: "transparent", fontFamily: "inherit", color: F.text, cursor: "pointer" }}
            >
              <span
                className="rounded-full box-border flex items-center justify-center font-black transition-colors motion-reduce:transition-none"
                style={{
                  width: "clamp(44px, 8vw, 76px)",
                  height: "clamp(44px, 8vw, 76px)",
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  border: `4px solid ${an ? F.akzent : F.hauchRand}`,
                  background: an ? F.akzent : "#ffffff",
                  color: an ? "#ffffff" : F.etikett,
                }}
              >
                {i + 1}
              </span>
              <span className="text-center leading-[1.25] text-[13px] sm:text-base" style={{ fontWeight: an ? 700 : 600 }}>{s.name}</span>
            </button>
          );
        })}
      </div>

      <div
        id="station-inhalt"
        role="tabpanel"
        aria-labelledby={`station-${auswahl}`}
        aria-live="polite"
        className="mt-7 rounded-3xl p-9 grid gap-7 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]"
        style={{ background: F.hauch }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>What andi asks</p>
          <p className="mt-2.5 text-2xl leading-[1.3] font-bold">{aktiv.frage}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>What you learn</p>
          <p className="mt-2.5" style={TEXT_STIL}>{aktiv.erkenntnis}</p>
        </div>
        <div className="rounded-[18px] bg-white p-[22px]">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>What it gets you</p>
          <p className="mt-2.5 text-xl leading-[1.35] font-bold" style={{ color: F.link }}>{aktiv.wert}</p>
        </div>
      </div>
    </>
  );
}

export default function KundenEn() {
  return (
    <Modulseite titel="Customer satisfaction: why customers stay | andi fragt." modul="Customers" hintergrund={F.grau} kopfRand={false}>
      <section className={`${BREITE} pt-20 pb-[88px] flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
        <div className="flex-[3_1_560px] min-w-0">
          <h1 style={H1_STIL}>
            <Dachzeile>Module 03 Customers: customer satisfaction</Dachzeile>
            <span className="block mt-[18px]">
              Your customers <span style={{ color: F.akzent }}>know</span> why they stay.
            </span>
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
            And why others left. They just won't tell you unprompted. In a neutral interview they are happy to talk, and you
            find out where more revenue is waiting.
          </p>
          <div className="mt-8">
            <Hauptknopf href={mailAn(BETREFF)}>Book a first call</Hauptknopf>
          </div>
          <FuerDich rollen={["Managing directors", "Sales", "Customer service"]} />
        </div>
        <div className="flex-[2_1_320px] min-w-0 flex justify-center">
          <div className="relative">
            <RundesFoto
              src="/bilder/kunden.webp"
              alt="Customer talking with staff at the reception desk"
              groesse={340}
              rand="10px solid #ffffff"
            />
            <span
              aria-hidden="true"
              className="absolute w-[92px] h-[92px] rounded-full flex items-center justify-center text-[44px] font-black text-white"
              style={{ left: "-10%", top: "10%", background: F.dunkel }}
            >
              ?
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <Etikett>The customer journey</Etikett>
          <h2 className="mt-3 max-w-[760px]" style={H2_STIL}>
            Five moments <span style={{ color: F.akzent }}>where revenue is won</span> or lost.
          </h2>
          <p className="mt-4" style={{ ...TEXT_STIL, color: F.daempft }}>Tap a stage.</p>
          <Kundenreise />
        </div>
      </section>

      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[104px]`}>
          <h2 className="max-w-[900px]" style={H2_STIL}>
            Unhappy customers <span style={{ color: F.akzent }}>rarely complain.</span> They just leave.
          </h2>
          <div className="mt-14 grid gap-10 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {LEISE.map((l) => (
              <div key={l.titel}>
                <p className="text-xl font-bold">{l.titel}</p>
                <p className="mt-2.5 leading-[1.65]" style={{ color: F.hellAufDunkel }}>{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${BREITE} py-28 text-center`}>
        <Etikett>The most valuable question</Etikett>
        <p className="mt-5 mx-auto max-w-[900px] text-[clamp(28px,4vw,46px)] leading-[1.15] font-bold italic">
          What would have to happen for you to{" "}
          <span style={{ background: "linear-gradient(transparent 62%, #ffd3dd 62%)" }}>recommend us without hesitation?</span>
        </p>
        <p className="mt-6 mx-auto max-w-[640px]" style={{ ...TEXT_STIL, color: F.daempft }}>
          A score tells you how satisfied customers are. The answer to this question tells you what to do. Our
          strategists read every single one.
        </p>
      </section>

      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <Etikett>What you get</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Answers <span style={{ color: F.akzent }}>you can sell with.</span>
          </h2>
          <ol className="mt-11 flex flex-col">
            {ERGEBNIS.map((r) => (
              <li
                key={r.nr}
                className="grid gap-x-6 gap-y-2 items-baseline py-[26px] grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)]"
                style={{ borderTop: `1px solid ${F.linie}` }}
              >
                <span aria-hidden="true" className="text-[40px] font-black" style={{ color: "transparent", WebkitTextStroke: `1.5px ${F.akzent}` }}>{r.nr}</span>
                <h3 className="text-[22px] leading-[1.25] font-bold">{r.titel}</h3>
                <p className="col-start-2 md:col-start-auto leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Faq seite="kunden" look="grau" />

      <section className={`${BREITE} py-24`}>
        <div className="rounded-[28px] p-14 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 text-white" style={{ background: F.akzent }}>
          <h2 className="flex-[1_1_520px]" style={H2_STIL}>Ask your customers before your competitors do.</h2>
          <Hauptknopf href={mailAn(BETREFF)} farbe={F.dunkel}>Get in touch, no obligation</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
