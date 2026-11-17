import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, IMPRESSUM, KONTAKT_TEL, LEAD_STIL, Modulseite, Portraet, TEAM,
  TEXT_STIL, anfrageLinkEn,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";
import KundenSlider from "@/components/oeffentlich/KundenSlider";
import Zaehler from "@/components/oeffentlich/Zaehler";

// English About page under /en/about (17.11.2026), adapted from src/pages/UeberUns.jsx.
// Same structure, British English. Anonymity is described by what the client sees and doesn't see.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const SPRUNG = [
  { ziel: "#team", text: "The team" },
  { ziel: "#schutz", text: "What happens to answers" },
  { ziel: "#ablauf", text: "How we work" },
  { ziel: "#wer", text: "Who is behind it" },
  { ziel: "#zusagen", text: "Our commitments" },
  { ziel: "#fragen", text: "Questions" },
];

const STECKBRIEF = [
  { titel: "Provider", wert: "Rittler & Co GmbH, brand and advertising agency" },
  { titel: "Based in", wert: "Peter-Rosegger-Straße 27, 8053 Graz, Austria" },
  { titel: "Experience", wert: "20+ years, 500+ brand projects" },
  { titel: "For", wert: "Companies in the German-speaking world" },
  { titel: "Interviews in", wert: "German, English, Italian, Croatian" },
  { titel: "Contact", wert: "Alfons Rittler" },
];

const KURZ = [
  {
    frage: "Who is behind this?",
    antwort: "An advertising agency from Graz, Austria, with more than 20 years of experience. Not an anonymous tool, but three people with names, faces and a phone number.",
    mehr: "Meet the team",
    ziel: "#team",
  },
  {
    frage: "What happens to the answers?",
    antwort: "You only see aggregated results, and only once a group reaches a minimum number of interviews. You never get to see individual answers.",
    mehr: "The rules in detail",
    ziel: "#schutz",
  },
  {
    frage: "What if it's not the right fit?",
    antwort: "Then we tell you honestly in the intro call. The call is free, and you get a fixed price before anything starts.",
    mehr: "Our commitments",
    ziel: "#zusagen",
  },
];

const SCHRITTE = [
  { nr: "0", wann: "Before the start", titel: "Intro call and kick-off meeting", text: "We work out where things are stuck, which assumptions need testing and which groups to ask. Then you get a proposal with a fixed price." },
  { nr: "1", wann: "andi fragt.", titel: "Online interviews", text: "Leadership, team, sales and, if you wish, your customers answer online, on a phone or computer, whenever it suits them. Each group gets its own interview." },
  { nr: "2", wann: "andi weiß.", titel: "Analysis and evaluation", text: "We condense all answers using the ANDI method. We don't look for the average but for the deviation, because that shows where a decision needs to go differently." },
  { nr: "3", wann: "andi macht.", titel: "Clarity and focus", text: "The analysis becomes a few clear statements and recommendations. No mountains of data, just what you need to decide." },
  { nr: "4", wann: "andi zeigt.", titel: "Presentation in person", text: "We present the results to you in person. The key findings become messages for customers, team, sales and applicants." },
];

const ZEITPLAN = [
  { wann: "Week 1", was: "The interviews run" },
  { wann: "Week 4", was: "The patterns become visible" },
  { wann: "Week 6", was: "Presentation at your premises" },
];

const REGELN = [
  "Results are only shown in aggregate, and only once a group reaches a minimum number of interviews.",
  "Small departments are merged.",
  "You receive no names and no individual answers. Not even if you ask.",
  "Taking part is voluntary and free for everyone invited.",
];

const ZUSAGEN = [
  { titel: "A reply within 24 hours", text: "We respond to every enquiry within 24 hours, with suggested times for the intro call." },
  { titel: "An honest intro call", text: "Free, about 30 minutes. If an interview won't help you, we will tell you so." },
  { titel: "A fixed price before the start", text: "After the kick-off meeting you get a proposal with a fixed price, before the first interview runs." },
  { titel: "Protection for everyone who answers", text: "Aggregated results above a minimum number. This rule applies to you as the client, too." },
  { titel: "People read every answer", text: "No automated report you have to piece together yourself. Our strategists draw the conclusions." },
  { titel: "Presentation in person", text: "We present the results to you ourselves, with clear recommendations for the next steps." },
];

const ANLAESSE = ["A new brand presence", "Keeping and winning good people", "Realigning sales", "Handing over to the next generation"];

const MODULKURZ = [
  { name: "Positioning", pfad: "/en/positioning", text: "Why customers really buy." },
  { name: "Team", pfad: "/en/team", text: "What keeps your team and what holds it back." },
  { name: "Customers", pfad: "/en/customers", text: "The outside view that everyday business lacks." },
  { name: "Sales", pfad: "/en/sales", text: "What lands with customers." },
];

const ABSATZ = { ...TEXT_STIL, lineHeight: 1.7, color: F.daempft };
const H3 = "mt-8 text-[21px] font-bold leading-[1.3]";
const CHIP = "inline-flex items-center min-h-[36px] px-3.5 rounded-full text-[15px] font-semibold";

export default function UeberUnsEn() {
  return (
    <Modulseite titel="About us: Rittler & Co, Graz | andi fragt." modul="About">
      <section className={`${BREITE} pt-12 pb-[72px] flex flex-wrap items-start gap-x-[72px] gap-y-12`}>
        <div className="flex-[1_1_520px] min-w-0">
          <Etikett>About us</Etikett>
          <h1 className="mt-4" style={H1_STIL}>
            You should know <span style={{ color: F.akzent }}>who's asking.</span>
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
            Before you trust us with your team, your customers or your sales force, you want to know who you are dealing
            with. This page tells you: who we are, how we work and what happens to the answers.
          </p>
          <nav aria-label="On this page" className="mt-7 flex flex-wrap gap-2">
            {SPRUNG.map(({ ziel, text }) => (
              <a key={ziel} href={ziel} className="inline-flex items-center min-h-[40px] px-4 rounded-full text-[15px] font-semibold transition-colors hover:bg-[#ffe4ea]" style={{ background: F.grau, color: F.text }}>
                {text}
              </a>
            ))}
          </nav>
        </div>

        <aside aria-label="At a glance" className="flex-[1_1_340px] min-w-0 p-7 rounded-3xl bg-white" style={{ border: `1px solid ${F.linie}`, boxShadow: "0 30px 60px -40px rgba(45,45,45,0.4)" }}>
          <Etikett>At a glance</Etikett>
          <dl className="mt-[18px] flex flex-col gap-3.5">
            {STECKBRIEF.map(({ titel, wert }) => (
              <div key={titel} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                <dt className="text-sm" style={{ color: F.daempft }}>{titel}</dt>
                <dd className="font-bold">{wert}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
              <dt className="text-sm" style={{ color: F.daempft }}>Phone</dt>
              <dd><a href={TEL_LINK} className="font-bold hover:underline whitespace-nowrap" style={{ color: F.text }}>{KONTAKT_TEL}</a></dd>
            </div>
          </dl>
          <a href={IMPRESSUM} hrefLang="de" rel="nofollow noopener" className="inline-flex items-center min-h-[40px] mt-2.5 text-sm font-semibold underline" style={{ color: F.daempft }}>
            Legal notice (German)
          </a>
        </aside>
      </section>

      <section style={{ background: F.grau }}>
        <div className={`${BREITE} py-[72px]`}>
          <Etikett>In short</Etikett>
          <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>
            Three questions <span style={{ color: F.akzent }}>you may be asking right now.</span>
          </h2>
          <div className="mt-9 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {KURZ.map(({ frage, antwort, mehr, ziel }) => (
              <a key={frage} href={ziel} className="group flex flex-col p-7 rounded-[20px] bg-white" style={{ color: F.text }}>
                <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-black" style={{ background: "#ffe4ea", color: F.akzent }}>?</span>
                <span className="mt-[18px] text-[21px] font-bold leading-[1.3]">{frage}</span>
                <span className="mt-2.5 text-[17px] leading-[1.6]" style={{ color: F.daempft }}>{antwort}</span>
                <span className="mt-auto pt-[18px] inline-flex items-center gap-1.5 text-[15px] font-semibold">
                  {mehr} <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className={`${BREITE} pt-24 pb-24 scroll-mt-4`}>
        <Etikett>The team behind andi fragt.</Etikett>
        <h2 className="mt-3 max-w-[900px]" style={H2_STIL}>
          Three people. <span style={{ color: F.akzent }}>With names and faces.</span>
        </h2>
        <p className="mt-3 max-w-[720px]" style={ABSATZ}>
          No hotline and no anonymous system. Here you can see who works for you at andi fragt. and who you can call.
        </p>
        <ul className="mt-10 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {TEAM.map((p) => (
            <li key={p.id} className="flex flex-col items-start px-7 py-8 rounded-3xl" style={{ background: F.grau }}>
              <Portraet person={p} gross className="w-[168px] h-[168px]" style={{ boxShadow: `0 0 0 6px #ffffff, 0 0 0 8px ${F.hauchRand}` }} />
              <h3 className="mt-7 text-[22px] font-bold leading-[1.25]">{p.name}</h3>
              <p className="mt-1" style={{ color: F.daempft }}>{p.rolleEn}</p>
              <p className="mt-[18px] text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: F.etikett }}>At andi fragt.</p>
              <p className="mt-1.5 text-[17px] leading-[1.6]">{p.aufgabeEn}</p>
              {p.telefon && (
                <a href={TEL_LINK} className="inline-flex items-center gap-2 min-h-[44px] mt-2.5 font-bold hover:underline" style={{ color: F.text }}>
                  <Phone size={18} strokeWidth={1.8} aria-hidden="true" />
                  {KONTAKT_TEL}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="schutz" className="scroll-mt-4" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_420px] min-w-0">
            <Etikett dunkel>Honesty needs protection</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              You see groups. <span style={{ color: F.akzent }}>Never individual answers.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, lineHeight: 1.7, color: F.hellAufDunkel }}>
              People only answer honestly when they don't feel watched. That is why the same rules apply to every
              interview. And that is exactly how we explain it to the people we ask.
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {REGELN.map((r) => (
                <li key={r} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-[17px] leading-[1.55]">
                  <Check size={22} strokeWidth={2.6} aria-hidden="true" className="mt-0.5" style={{ color: "#45d085" }} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <Zaehler titel="What you see as the client" />
        </div>
      </section>

      <section id="ablauf" className="scroll-mt-4" style={{ background: F.grau }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-start gap-x-20 gap-y-12`}>
          <div className="flex-[1_1_560px] min-w-0">
            <Etikett>How we work</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              From the first call <span style={{ color: F.akzent }}>to the decision.</span>
            </h2>
            <p className="mt-3 max-w-[640px]" style={ABSATZ}>
              Every project follows the same five steps. You know in advance what will happen, who is involved and what
              it costs.
            </p>
            <ol className="mt-10">
              {SCHRITTE.map((s, i) => {
                const erster = i === 0;
                const letzter = i === SCHRITTE.length - 1;
                return (
                  <li key={s.nr} className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-5">
                    <span className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center w-11 h-11 rounded-full box-border text-[17px] font-black"
                        style={{
                          background: erster ? "#ffffff" : letzter ? F.dunkel : F.akzent,
                          border: `2px solid ${erster ? F.akzent : letzter ? F.dunkel : F.akzent}`,
                          color: erster ? F.akzent : "#ffffff",
                        }}
                      >
                        {s.nr}
                      </span>
                      {!letzter && <span aria-hidden="true" className="flex-1 w-0.5 my-1.5" style={{ background: F.hauchRand }} />}
                    </span>
                    <div className="pt-1.5 pb-8">
                      <p className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: F.daempft }}>{s.wann}</p>
                      <h3 className="mt-1.5 text-[22px] font-bold leading-[1.3]">{s.titel}</h3>
                      <p className="mt-2 text-[17px] leading-[1.65]" style={{ color: F.daempft }}>{s.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside className="flex-[1_1_320px] min-w-0 flex flex-col gap-4">
            <div className="p-7 rounded-[20px] bg-white">
              <p className="text-[19px] font-bold">How long does it take?</p>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>For the Team module, for example:</p>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {ZEITPLAN.map(({ wann, was }) => (
                  <li key={wann} className="flex gap-3.5">
                    <strong className="shrink-0 w-24 font-bold">{wann}</strong>
                    <span style={{ color: F.daempft }}>{was}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-normal" style={{ color: F.daempft }}>Sample timeline. Your schedule is set out in the proposal.</p>
            </div>
            <div className="p-7 rounded-[20px] bg-white">
              <p className="text-[19px] font-bold">Your own time</p>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>About two hours for the kick-off meeting, the sign-off and the presentation. We develop and analyse the interviews ourselves.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="wer" className={`${BREITE} py-24 scroll-mt-4`}>
        <div className="max-w-[720px]">
          <Etikett>Who is behind it</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            An advertising agency <span style={{ color: F.akzent }}>that listens first.</span>
          </h2>

          <h3 className={H3}>Rittler &amp; Co from Graz, Austria</h3>
          <p className="mt-3" style={ABSATZ}>
            andi fragt. is run by Rittler &amp; Co GmbH, an advertising agency at Peter-Rosegger-Straße 27 in Graz. For
            more than 20 years we have supported companies with their brand, positioning and public image.
          </p>

          <h3 className={H3}>Why an advertising agency conducts interviews</h3>
          <p className="mt-3" style={ABSATZ}>
            In more than 500 brand projects we kept seeing the same thing: the best answers are already inside the
            company. In the minds of leadership, in the team's day-to-day work, in sales conversations and in the way
            customers see things. They rarely get said out loud, because nobody asks the right questions.
          </p>
          <p className="mt-3" style={ABSATZ}>
            A market research agency answers the questions it is given. We start one step earlier and work out with
            you which questions will move your company forward. And because we have been building brands for years, we
            can implement what follows from the answers straight away if you wish: the message, the job ad, the sales
            argument.
          </p>

          <h3 className={H3}>Read by people, not software</h3>
          <p className="mt-3" style={ABSATZ}>
            Technology helps to collect and sort. Every answer is read and interpreted by people. Software counts how
            often something is said. We look for the one sentence that carries a decision, even if it only comes up
            three times.
          </p>
        </div>
      </section>

      <KundenSlider titel="Companies Rittler & Co has worked for" />

      <section id="zusagen" className={`${BREITE} py-24 scroll-mt-4`}>
        <Etikett>What you can hold us to</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
          What we commit to. <span style={{ color: F.akzent }}>In black and white.</span>
        </h2>
        <ol className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
          {ZUSAGEN.map(({ titel, text }, i) => (
            <li key={titel} className="p-7 rounded-[20px]" style={{ border: `1px solid ${F.linie}` }}>
              <span aria-hidden="true" className="text-[15px] font-black" style={{ color: F.akzent }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2.5 text-xl font-bold leading-[1.3]">{titel}</h3>
              <p className="mt-2 leading-[1.6]" style={{ color: F.daempft }}>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section style={{ background: F.hauch }}>
        <div className={`${BREITE} py-20`}>
          <Etikett>Who we work for</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            For companies <span style={{ color: F.akzent }}>facing a decision.</span>
          </h2>
          <p className="mt-3 max-w-[720px]" style={ABSATZ}>
            For everyone who doesn't want to base an important decision on gut feeling. Leadership, workforce and market
            each get their own interview; the analysis brings them together.
          </p>
          <ul aria-label="Typical occasions" className="mt-7 flex flex-wrap gap-2">
            {ANLAESSE.map((x) => (
              <li key={x} className={CHIP} style={{ background: "#ffffff" }}>{x}</li>
            ))}
          </ul>
          <p className="mt-10 text-[15px] font-semibold" style={{ color: F.daempft }}>The four interviews</p>
          <div className="mt-3 grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))]">
            {MODULKURZ.map(({ name, pfad, text }) => (
              <Link key={name} to={pfad} className="flex flex-col px-[22px] py-5 rounded-2xl bg-white hover:underline" style={{ color: F.text }}>
                <span className="text-lg font-bold">{name}</span>
                <span className="mt-1.5 text-[15px] leading-normal" style={{ color: F.daempft }}>{text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq seite="ueberUns" look="weiss" />

      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center justify-between gap-x-14 gap-y-8`}>
          <div className="flex-[1_1_520px] min-w-0">
            <h2 style={H2_STIL}>
              Get to know us <span style={{ color: F.akzent }}>before you decide.</span>
            </h2>
            <p className="mt-[18px] max-w-[620px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              One conversation, about 30 minutes, free of charge. Afterwards you'll know whether an interview will help
              you. And if it won't, we'll tell you honestly.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Hauptknopf href={anfrageLinkEn("andi fragt. Erstgespräch")}>Request an intro call</Hauptknopf>
            <a href={TEL_LINK} className="inline-flex items-center min-h-[44px] font-bold text-white hover:underline">
              or call: {KONTAKT_TEL}
            </a>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
