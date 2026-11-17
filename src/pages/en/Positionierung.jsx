import React, { useState } from "react";
import { Dachzeile,
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, MARKENPRUEFSTAND, anfrageLinkEn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// English module page 01 Positioning under /en/positioning (17.11.2026),
// adapted from src/pages/modul/Positionierung.jsx. Same layout, British English.

const BETREFF = "andi fragt. Positionierung";
const mailAn = anfrageLinkEn;

const DATEN = [
  { name: "Quality", i: 92, a: 74 },
  { name: "Experience and tradition", i: 88, a: 41 },
  { name: "Personal service", i: 55, a: 94 },
  { name: "Fast response", i: 38, a: 89 },
  { name: "Price", i: 30, a: 22 },
];

const KOSTEN = [
  { heute: "You negotiate on price", danach: "Customers pay for what makes you different.", text: "If you know your real difference and name it clearly, you don't have to replace it with discounts." },
  { heute: "Advertising that fizzles out", danach: "Every euro tells the same story.", text: "Website, ads and proposals speak the same language. That saves budget and sticks in people's minds." },
  { heute: "The wrong enquiries", danach: "Enquiries from customers who suit you.", text: "A clear positioning attracts the right people and keeps the bargain hunters away." },
];

// The ANDI method: four touchstones. Only the what, not the how.
const ANDI = [
  { b: "A", wort: "Attention", frage: "What draws people in?", text: "Which problems and wishes of your customers you address, and where your brand creates instant relevance." },
  { b: "N", wort: "Net benefit", frage: "What's in it for the customer?", text: "Which concrete benefits really count: time, cost, service or personal support." },
  { b: "D", wort: "Differentiation", frage: "Why choose you?", text: "What makes you unique, such as your origins, special expertise or the way you work." },
  { b: "I", wort: "Identity", frage: "What do you stand for?", text: "Which values make you unmistakable, beyond your products." },
];

const KREISE = [
  { nr: "1", wer: "Leadership", text: "We start with your view: goals, strengths, ideal customers.", frage: "What should customers know us for three years from now?" },
  { nr: "2", wer: "Team", text: "The people who work with customers every day often know more than any strategy.", frage: "What do customers thank you for most often?" },
  { nr: "3", wer: "Customers", text: "The outside view shows what really lands, and what is missing.", frage: "Why did you choose us back then?" },
];

function Umschalter({ innen, setInnen }) {
  const knopf = (aktiv) => ({
    minHeight: 44,
    padding: "0 22px",
    border: 0,
    borderRadius: 999,
    background: aktiv ? F.akzent : "transparent",
    color: aktiv ? "#ffffff" : F.hellAufDunkel,
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  });
  return (
    <div role="group" aria-label="Choose a view" className="mt-7 inline-flex flex-wrap p-1 rounded-[28px]" style={{ background: "#3d3d3d" }}>
      <button type="button" aria-pressed={innen} onClick={() => setInnen(true)} style={knopf(innen)}>How you see yourself</button>
      <button type="button" aria-pressed={!innen} onClick={() => setInnen(false)} style={knopf(!innen)}>How customers see you</button>
    </div>
  );
}

export default function PositionierungEn() {
  const [innen, setInnen] = useState(true);

  return (
    <Modulseite titel="Brand positioning from within your company | andi fragt." modul="Positioning">
      <section className={`${BREITE} pt-20 pb-[72px] flex flex-wrap items-center gap-x-14 gap-y-12`}>
        <div className="flex-[3_1_620px] min-w-0">
          <h1 style={{ ...H1_STIL, letterSpacing: "-0.015em" }}>
            <Dachzeile>Module 01: Brand positioning</Dachzeile>
            <span className="block mt-4">
              You are better
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${F.dunkel}` }}>than your image.</span>
            </span>
          </h1>
          <div className="mt-9 flex flex-wrap items-end gap-x-16 gap-y-8">
            <p className="flex-[1_1_480px]" style={{ ...LEAD_STIL, color: F.daempft }}>
              Your customers buy for reasons that aren't on your website. Your team knows them, and so do your regular
              customers. We bring these reasons to the surface in interviews and turn them into a positioning that
              people <strong className="font-semibold" style={{ color: F.text }}>pay more for.</strong>
            </p>
            <Hauptknopf href={mailAn(BETREFF)}>Book a first call</Hauptknopf>
          </div>
          <FuerDich rollen={["Owners", "Managing directors", "Marketing"]} />
        </div>
        <div className="flex-[2_1_300px] min-w-0 flex justify-center">
          <RundesFoto
            src="/bilder/positionierung.webp"
            alt="Business owner talking with a consultant in his workshop"
            groesse={320}
            ringe={[{ abstand: 14, farbe: F.dunkel }, { abstand: 30, farbe: F.hauchRand }]}
          />
        </div>
      </section>

      <section id="andi" aria-labelledby="andi-titel" style={{ background: F.hauch }}>
        <div className={`${BREITE} py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-5">
            <div className="flex-[1_1_520px] min-w-0">
              <Etikett>The ANDI method</Etikett>
              <h2 id="andi-titel" className="mt-3" style={H2_STIL}>
                Four touchstones <span style={{ color: F.akzent }}>for your brand.</span>
              </h2>
            </div>
            <p className="flex-[1_1_380px] min-w-0" style={{ ...TEXT_STIL, color: F.daempft }}>
              Everything leadership, team and customers say in the interviews, we test against four questions. Developed
              from more than 500 brand projects. How we weight them remains our craft.
            </p>
          </div>
          <div className="mt-12 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
            {ANDI.map((s) => (
              <div key={s.b} className="p-7 rounded-[20px] bg-white">
                <span aria-hidden="true" className="block text-[80px] font-black leading-[0.8]" style={{ color: F.akzent }}>{s.b}</span>
                <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: F.etikett }}>{s.wort}</h3>
                <p className="mt-2 text-[22px] font-bold leading-[1.25]">{s.frage}</p>
                <p className="mt-3 leading-[1.6]" style={{ color: F.daempft }}>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[760px] text-lg leading-[1.6] font-semibold">
            In the presentation you see, for each touchstone, where your brand is strong and where the way you present
            yourself falls short of what team and customers experience.
          </p>
        </div>
      </section>

      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_360px] min-w-0">
            <Etikett dunkel>The gap</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              What you say. <span style={{ color: F.akzent }}>What lands.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              This is what a typical gap looks like. Switch views and see how differently the same company comes across
              from the inside and from the outside.
            </p>
            <Umschalter innen={innen} setInnen={setInnen} />
            <Beispielhinweis dunkel />
          </div>
          <div className="flex-[1_1_480px] min-w-0 rounded-[20px] p-8" style={{ background: F.dunkelKarte }}>
            <p aria-live="polite" className="text-lg font-bold">
              {innen ? "What we say about ourselves" : "Why customers really buy from us"}
            </p>
            <ul className="mt-5 flex flex-col gap-[18px]">
              {DATEN.map((d) => {
                const wert = innen ? d.i : d.a;
                const diff = d.a - d.i;
                let notiz = `${wert} out of 100`;
                let notizFarbe = F.hellAufDunkel;
                if (!innen && diff >= 30) { notiz = "underrated"; notizFarbe = "#45d085"; }
                if (!innen && diff <= -30) { notiz = "overrated"; notizFarbe = F.etikettDunkel; }
                return (
                  <li key={d.name}>
                    <div className="flex justify-between gap-3 text-[15px] font-semibold">
                      <span>{d.name}</span>
                      <span style={{ color: notizFarbe }}>{notiz}</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full overflow-hidden" style={{ background: "#4a4a4a" }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${wert}%`, background: innen ? F.hellAufDunkel : F.akzent }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 pt-[18px] text-[15px] leading-[1.55]" style={{ borderTop: "1px solid #4a4a4a", color: "#ffd3dd" }}>
              {innen
                ? "The website talks about tradition and quality. Sounds good, but everyone says it."
                : "People buy for the service and the speed. And that barely features in how the company presents itself."}
            </p>
          </div>
        </div>
      </section>

      <section className={`${BREITE} pt-[104px]`}>
        <h2 className="max-w-[760px]" style={H2_STIL}>
          This gap <span style={{ color: F.akzent }}>costs money.</span> Every day.
        </h2>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]" style={{ borderTop: `2px solid ${F.dunkel}` }}>
          {KOSTEN.map((k) => (
            <article key={k.danach} className="pt-[30px] pr-7 pb-[34px]" style={{ borderBottom: `1px solid ${F.linie}` }}>
              <p
                className="text-[15px] font-semibold"
                style={{ color: F.daempft, textDecoration: "line-through", textDecorationColor: F.akzent, textDecorationThickness: 2 }}
              >
                {k.heute}
              </p>
              <h3 className="mt-3.5 text-2xl font-bold leading-[1.2]">{k.danach}</h3>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>{k.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${BREITE} pt-28 flex flex-wrap items-center gap-x-20 gap-y-14`}>
        <div className="flex-[1_1_440px] min-w-0 flex justify-center">
          <div
            role="img"
            aria-label="Three circles from the inside out: leadership, team, customers"
            className="relative"
            style={{ width: 460, maxWidth: "100%", aspectRatio: "1 / 1" }}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: F.hauch, border: `2px solid ${F.hauchRand}` }} />
            <div className="absolute rounded-full" style={{ inset: "17%", background: "#ffd3dd" }} />
            <div className="absolute rounded-full flex items-center justify-center" style={{ inset: "34%", background: F.dunkel }}>
              <span className="-mt-[18px] text-[44px] font-black uppercase text-white">You</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.1em]" style={{ top: "5%", color: "#a80f39" }}>Customers</span>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.1em]" style={{ top: "21%", color: "#a80f39" }}>Team</span>
            <span
              className="absolute left-1/2 px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap text-white"
              style={{ bottom: "36%", transform: "translate(-50%, 50%)", background: F.dunkel }}
            >
              Leadership
            </span>
          </div>
        </div>
        <div className="flex-[1_1_420px] min-w-0">
          <Etikett>From the inside out</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Three circles, <span style={{ color: F.akzent }}>one picture.</span>
          </h2>
          <ol className="mt-7 flex flex-col gap-[22px]">
            {KREISE.map((r) => (
              <li key={r.nr} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black"
                  style={{ border: `2px solid ${F.akzent}`, color: F.etikett }}
                >
                  {r.nr}
                </span>
                <div>
                  <h3 className="text-[19px] font-bold">{r.wer}</h3>
                  <p className="mt-1 leading-[1.55]" style={{ color: F.daempft }}>{r.text}</p>
                  <p className="mt-2 font-bold italic">{r.frage}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${BREITE} mt-28`}>
        <div className="max-w-[860px] py-2 pl-8" style={{ borderLeft: `6px solid ${F.akzent}` }}>
          <p className="text-[clamp(22px,2.6vw,30px)] leading-[1.3] font-bold">
            Software counts answers. We read them. The best positioning rarely sits in the most frequent answer. It sits
            in the one sentence that three customers say almost word for word, independently of each other.
          </p>
          <p className="mt-4 text-[15px] font-semibold" style={{ color: F.daempft }}>How we work at Rittler &amp; Co</p>
        </div>
      </section>

      <section className="mt-28" style={{ background: F.grau }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_380px] min-w-0">
            <Etikett>The result</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              One page <span style={{ color: F.akzent }}>that steers everything.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.daempft }}>
              Alongside the handout and the presentation, you get your positioning on a single page. For your website,
              proposals, trade fair stand and job ads. So everyone tells the same story.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5 font-semibold">
              <li>Analysis handout with every gap we found</li>
              <li>Presentation at your premises, with time for discussion</li>
              <li>Your positioning on one page</li>
              <li>Recommendations for the next 90 days</li>
            </ul>
          </div>
          <div className="flex-[1_1_440px] min-w-0 flex justify-center">
            <div
              role="img"
              aria-label="Example of a one-page positioning"
              className="bg-white rounded-md px-[34px] py-9"
              style={{ width: 420, maxWidth: "100%", boxShadow: "0 30px 60px -30px rgba(45,45,45,0.45)", transform: "rotate(-2deg)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: F.etikett }}>Example</p>
              <p className="mt-3.5 text-xs font-semibold" style={{ color: F.daempft }}>Our promise</p>
              <p className="mt-1 text-[22px] leading-[1.2] font-bold">We're the ones who call back.</p>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>Three proof points</p>
              <div className="mt-2 flex flex-col gap-2">
                {["92%", "78%", "85%"].map((b) => (
                  <div key={b} className="h-2.5 rounded" style={{ width: b, background: F.hauchRand }} />
                ))}
              </div>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>How we sound</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["direct", "down to earth", "local"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: F.dunkel }}>{t}</span>
                ))}
              </div>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>What we no longer say</p>
              <p className="mt-1 text-[15px] font-semibold" style={{ color: F.daempft, textDecoration: "line-through", textDecorationColor: F.akzent }}>
                Quality and service since 1987
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${BREITE} pt-24`}>
        <div className="rounded-3xl px-11 py-10 flex flex-wrap items-center justify-between gap-x-12 gap-y-6" style={{ border: `2px solid ${F.dunkel}` }}>
          <div className="flex-[1_1_520px] min-w-0">
            <Etikett>The next step</Etikett>
            <h3 className="mt-2.5 text-[28px] leading-[1.15] font-bold">Insight becomes a brand presence.</h3>
            <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>
              The interview is the core of the ANDI brand check by Rittler &amp; Co. If you like, we can put the
              positioning into practice straight away, from the message to the website.
            </p>
          </div>
          <a
            href={MARKENPRUEFSTAND}
            hrefLang="de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[48px] px-6 rounded text-sm font-semibold"
            style={{ border: `1px solid ${F.dunkel}`, color: F.text, textDecoration: "none" }}
          >
            About the brand check (German)
          </a>
        </div>
      </section>

      <Faq seite="positionierung" look="weiss" />

      <section className="mt-[104px]" style={{ background: F.akzent, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <h2 className="flex-[1_1_560px]" style={H2_STIL}>Find out what people really pay you for.</h2>
          <Hauptknopf href={mailAn(BETREFF)} farbe={F.dunkel}>Get in touch, no obligation</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
