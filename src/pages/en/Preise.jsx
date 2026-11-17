import React, { useRef, useState } from "react";
import { ArrowDown, ArrowRight, Lock, LockOpen, Plus, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, KONTAKT_TEL, LEAD_STIL, Modulseite, TEXT_STIL,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// English pricing page under /en/pricing (17.11.2026), adapted from src/pages/Preise.jsx.
// Same tiers and logic (keep STUFEN in step with the German page). British English, prices in euros.
// The request goes through the same "anfrage" function; the message to Rittler & Co stays German
// and is marked [EN] so the team knows to reply in English.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;
const GRUEN = F.gut;
const GRUEN_TEXT = "#167a45";
const GRUEN_HAUCH = "#eefaf3";
const GRUEN_RAND = "#bfe8d0";
const MAIL_REGEX = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;

const fmt = (n) => "€" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const fmtDe = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";

const STUFEN = [
  { id: "klein", name: "Small business", nameDe: "Kleinbetrieb", hinweis: "up to 6 people", basis: 2900, weiteres: 1100, paket: 5900 },
  { id: "b20", name: "7 to 20", nameDe: "7 bis 20", hinweis: "people per module", basis: 3800, weiteres: 1500, paket: 7900 },
  { id: "b50", name: "21 to 50", nameDe: "21 bis 50", hinweis: "people per module", basis: 5400, weiteres: 2100, paket: 10900 },
  { id: "b100", name: "51 to 100", nameDe: "51 bis 100", hinweis: "people per module", basis: 7400, weiteres: 2900, paket: 14900 },
  { id: "gross", name: "Over 100", nameDe: "über 100", hinweis: "on request", basis: null },
];

const MODULE = [
  { id: "kunden", name: "Customers", nameDe: "Kunden", frage: "Why do they buy?" },
  { id: "team", name: "Team", nameDe: "Team", frage: "Why do they stay?" },
  { id: "vertrieb", name: "Sales", nameDe: "Vertrieb", frage: "Why do deals close?" },
  { id: "positionierung", name: "Positioning", nameDe: "Positionierung", frage: "What do you stand for?" },
];

const ZUSAGEN = [
  { icon: Lock, titel: "Fixed price", text: "What the proposal says is what you pay. No hourly billing, no extras later." },
  { icon: ShieldCheck, titel: "Response guarantee", text: "If too few people respond, we follow up at no extra cost until the results are solid." },
  { icon: LockOpen, titel: "No lock-in", text: "No subscription, no fixed-term contract. You decide again after every step." },
];

const preisFuer = (s, k) => (k >= 4 ? s.paket : s.basis + (k - 1) * s.weiteres);

function Wahl({ an, onClick, rund, children }) {
  return (
    <button
      type="button"
      aria-pressed={an}
      onClick={onClick}
      className={`flex flex-col items-start justify-center gap-0.5 min-h-[64px] text-left cursor-pointer ${rund ? "px-[18px] py-2.5 rounded-[14px]" : "px-4 py-3 rounded-lg"}`}
      style={{ background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.text, border: `1px solid ${an ? F.dunkel : "#d6d3d0"}`, fontFamily: "inherit" }}
    >
      {children}
    </button>
  );
}

function Feld({ id, label, optional, fehler, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {optional && <span className="font-medium" style={{ color: F.hellAufDunkel }}>optional</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!fehler}
        aria-describedby={fehler ? `${id}-fehler` : undefined}
        className="mt-1.5 block w-full box-border min-h-[48px] px-3.5 py-2.5 rounded-md bg-white text-base"
        style={{ border: `1px solid ${fehler ? F.akzent : "#767676"}`, color: F.text, fontFamily: "inherit" }}
        {...rest}
      />
      {fehler && <p id={`${id}-fehler`} className="mt-1 text-sm font-semibold" style={{ color: "#ff9db3" }}>{fehler}</p>}
    </div>
  );
}

function Rechner() {
  const start = useRef(Date.now());
  const [mods, setMods] = useState(["kunden"]);
  const [stufeId, setStufeId] = useState("klein");
  const [werte, setWerte] = useState({ name: "", firma: "", email: "", telefon: "", webseite: "" });
  const [fehler, setFehler] = useState({});
  const [zustand, setZustand] = useState("offen");

  const stufe = STUFEN.find((s) => s.id === stufeId);
  const n = mods.length;
  const keinModul = n === 0;
  const aufAnfrage = !keinModul && !stufe.basis;
  const zeigPreis = !keinModul && !!stufe.basis;
  const summe = zeigPreis ? preisFuer(stufe, n) : 0;
  const naechstes = MODULE.find((m) => !mods.includes(m.id));
  const zusatz = zeigPreis && naechstes ? preisFuer(stufe, n + 1) - summe : 0;
  const gewaehlt = MODULE.filter((m) => mods.includes(m.id));
  const stufeText = stufe.id === "klein" ? "small business" : `${stufe.name} people per module`;
  const auswahl = [gewaehlt.map((m) => m.name).join(", ") || "no module yet", stufeText, zeigPreis ? `guide price ${fmt(summe)}` : "price on request"].join(", ");
  // Nachricht an Rittler & Co bleibt deutsch
  const stufeDe = stufe.id === "klein" ? "Kleinbetrieb" : `${stufe.nameDe} Personen pro Modul`;
  const auswahlDe = [gewaehlt.map((m) => m.nameDe).join(", ") || "noch kein Modul", stufeDe, zeigPreis ? `Richtpreis ${fmtDe(summe)}` : "Preis auf Anfrage"].join(", ");

  const umschalten = (id) => setMods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  const setze = (k) => (e) => setWerte((w) => ({ ...w, [k]: e.target.value }));

  async function senden(e) {
    e.preventDefault();
    const f = {};
    if (!werte.name.trim()) f.name = "Please enter your name.";
    if (!werte.firma.trim()) f.firma = "Please enter your company.";
    if (!MAIL_REGEX.test(werte.email.trim())) f.email = "Please enter a valid email address.";
    setFehler(f);
    if (Object.keys(f).length) {
      document.getElementById(`preis-${Object.keys(f)[0]}`)?.focus();
      return;
    }
    setZustand("sendet");
    try {
      const res = await base44.functions.invoke("anfrage", {
        ...werte,
        themen: mods,
        kanal: "online",
        nachricht: `[EN, bitte auf Englisch antworten] Aus dem Preisrechner: ${auswahlDe}`,
        herkunft: "[EN] /en/pricing",
        dauerSekunden: Math.round((Date.now() - start.current) / 1000),
      });
      const d = res?.data || {};
      if (d.ok) setZustand("gesendet");
      else if (d.zuViele) setZustand("zuViele");
      else if (d.fehler) {
        setFehler(Object.fromEntries(Object.keys(d.fehler).map((k) => [k, "Please check this field."])));
        setZustand("offen");
      } else setZustand("fehler");
    } catch {
      setZustand("fehler");
    }
  }

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-12 items-start">
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="text-lg font-bold">1. How big is your business?</legend>
          <div className="mt-3.5 grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
            {STUFEN.map((s) => (
              <Wahl key={s.id} an={s.id === stufeId} onClick={() => setStufeId(s.id)}>
                <span className="text-base font-bold">{s.name}</span>
                <span className="text-[13px] opacity-80">{s.hinweis}</span>
              </Wahl>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">2. What do you want to find out?</legend>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {MODULE.map((m) => (
              <Wahl key={m.id} rund an={mods.includes(m.id)} onClick={() => umschalten(m.id)}>
                <span className="text-[15px] font-bold">{m.name}</span>
                <span className="text-[13px] font-medium opacity-80">{m.frage}</span>
              </Wahl>
            ))}
          </div>
        </fieldset>

        {stufe.basis && (
          <div className="p-6 rounded-2xl bg-white" style={{ border: `1px solid ${F.linie}` }}>
            <p className="text-lg font-black leading-[1.25]">
              The more perspectives, <span style={{ color: GRUEN_TEXT }}>the less each one costs.</span>
            </p>
            <p className="mt-1.5 text-sm" style={{ color: F.daempft }}>
              Prices for {stufe.id === "klein" ? "small businesses" : `${stufe.name} people per module`}. From two modules
              on, we show you where the perspectives differ, at no extra cost.
            </p>
            <ol className="mt-4 grid gap-2.5 grid-cols-2 sm:grid-cols-4">
              {[1, 2, 3, 4].map((k) => {
                const p = preisFuer(stufe, k);
                const aktiv = k === n;
                return (
                  <li
                    key={k}
                    className="p-3.5 rounded-xl"
                    style={{ background: aktiv ? GRUEN_HAUCH : F.grau, border: `2px solid ${aktiv ? GRUEN_TEXT : "transparent"}` }}
                  >
                    <p className="text-[13px]" style={{ color: F.daempft }}>{k === 4 ? "All 4 modules" : k === 1 ? "1 module" : `${k} modules`}</p>
                    <p className="mt-1.5 text-[22px] font-black leading-none whitespace-nowrap">{fmt(p)}</p>
                    <p className="mt-1.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: k > 1 ? GRUEN_TEXT : F.daempft }}>
                      {fmt(p / k)} per module
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <aside aria-label="Your guide price and request" className="p-8 rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.hellAufDunkel }}>Your guide price</p>
        {keinModul && <p className="mt-4 text-xl font-bold leading-[1.4]">Choose at least one module.</p>}
        {aufAnfrage && (
          <>
            <p className="mt-4 text-[28px] font-black">Tailored</p>
            <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "#e4e4e4" }}>
              For more than 100 people we plan by department. You get the fixed price after the intro call.
            </p>
          </>
        )}
        {zeigPreis && (
          <>
            <p aria-live="polite" className="mt-3.5 text-[56px] font-black leading-none" style={{ color: GRUEN }}>{fmt(summe)}</p>
            <p className="mt-2.5 text-[15px] leading-[1.5]" style={{ color: "#e4e4e4" }}>
              {n === 1
                ? "1 module. Everything included, from the kick-off meeting to the presentation."
                : `${n} modules, so ${fmt(summe / n)} per module. Comparison of perspectives included.`}
            </p>
            {naechstes && (
              <button
                type="button"
                onClick={() => umschalten(naechstes.id)}
                className="mt-3.5 inline-flex items-center gap-2 min-h-[44px] px-4 rounded text-sm font-semibold cursor-pointer"
                style={{ border: `1px dashed ${GRUEN}`, background: "transparent", color: "#ffffff", fontFamily: "inherit" }}
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                Add {naechstes.name}: only {fmt(zusatz)}
              </button>
            )}
          </>
        )}
        <p className="mt-[18px] flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-semibold" style={{ color: GRUEN }}>
          {ZUSAGEN.map((z) => <span key={z.titel}>{z.titel}</span>)}
        </p>

        <div id="anfrage" className="mt-6 pt-6 scroll-mt-6" style={{ borderTop: "1px solid #4a4a4a" }}>
          {zustand === "gesendet" ? (
            <div role="status">
              <p className="text-[22px] font-black leading-[1.25]" style={{ color: GRUEN }}>Thank you. We'll be in touch.</p>
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "#e4e4e4" }}>
                Within 24 hours, with suggested times. Your selection: {auswahl}.
              </p>
            </div>
          ) : (
            <form onSubmit={senden} noValidate aria-labelledby="preis-anfrage-titel" className="flex flex-col gap-3.5">
              <p id="preis-anfrage-titel" className="text-xl font-black leading-[1.25]">Request an intro call at this price</p>
              <p className="-mt-1.5 text-sm" style={{ color: F.hellAufDunkel }}>30 minutes, free. We'll include your selection.</p>
              <Feld id="preis-name" label="Name" type="text" autoComplete="name" value={werte.name} onChange={setze("name")} fehler={fehler.name} />
              <Feld id="preis-firma" label="Company" type="text" autoComplete="organization" value={werte.firma} onChange={setze("firma")} fehler={fehler.firma} />
              <Feld id="preis-email" label="Email" type="email" autoComplete="email" value={werte.email} onChange={setze("email")} fehler={fehler.email} />
              <Feld id="preis-telefon" label="Phone" optional type="tel" autoComplete="tel" value={werte.telefon} onChange={setze("telefon")} />
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="preis-webseite">Website</label>
                <input id="preis-webseite" type="text" tabIndex={-1} autoComplete="off" value={werte.webseite} onChange={setze("webseite")} />
              </div>
              {(zustand === "fehler" || zustand === "zuViele") && (
                <p role="alert" className="p-3.5 rounded-lg text-sm leading-[1.5]" style={{ background: F.dunkelKarte }}>
                  {zustand === "zuViele" ? "We've already received a request from you. We'll be in touch, promise." : "Sorry, that didn't work."}{" "}
                  Just give us a call: <a href={TEL_LINK} className="font-bold whitespace-nowrap" style={{ color: "#ffffff" }}>{KONTAKT_TEL}</a>
                </p>
              )}
              <button
                type="submit"
                disabled={zustand === "sendet"}
                className="mt-1 flex items-center justify-center gap-2 min-h-[54px] px-6 rounded text-sm font-semibold uppercase tracking-[0.04em] text-white cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                style={{ background: F.akzent, border: 0, fontFamily: "inherit" }}
              >
                {zustand === "sendet" ? "Sending" : "Request a free call"} <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="text-xs leading-[1.5]" style={{ color: F.hellAufDunkel }}>
                We'll get back to you within 24 hours and only use your details for that.{" "}
                <a href="/datenschutz#anfrage" hrefLang="de" target="_blank" rel="noopener" className="underline" style={{ color: F.hellAufDunkel }}>
                  Privacy policy (German)
                </a>
                . Net prices, plus VAT where applicable.
              </p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function PreiseEn() {
  return (
    <Modulseite titel="Pricing: a fixed price, not a cost per head | andi fragt." modul="Pricing">
      <section className={`${BREITE} pt-14 pb-16`}>
        <Etikett>Pricing</Etikett>
        <h1 className="mt-4 max-w-[980px]" style={H1_STIL}>
          You pay for the right questions. <span style={{ color: F.akzent }}>Not per head.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, maxWidth: 640, color: F.daempft }}>
          From {fmt(STUFEN[0].basis)} for small businesses. Work out your price in 20 seconds.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#rechner"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded text-sm font-semibold uppercase tracking-[0.04em]"
            style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
          >
            Calculate your price <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href={TEL_LINK}
            className="inline-flex items-center justify-center min-h-[52px] px-6 rounded text-sm font-semibold"
            style={{ border: "1px solid #d6d3d0", color: F.text, textDecoration: "none" }}
          >
            Prefer to call? {KONTAKT_TEL}
          </a>
        </div>
        <ul className="mt-12 grid gap-3.5 grid-cols-1 md:grid-cols-3">
          {ZUSAGEN.map(({ icon: Icon, titel, text }) => (
            <li key={titel} className="flex gap-4 p-6 rounded-2xl" style={{ background: GRUEN_HAUCH, border: `1px solid ${GRUEN_RAND}` }}>
              <span aria-hidden="true" className="shrink-0 w-12 h-12 rounded-full inline-flex items-center justify-center text-white" style={{ background: GRUEN_TEXT }}>
                <Icon size={24} strokeWidth={2} />
              </span>
              <div>
                <p className="text-xl font-black leading-[1.2]">{titel}</p>
                <p className="mt-1.5 text-[15px] leading-[1.5]" style={{ color: "#3d4a42" }}>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="rechner" className="py-20 scroll-mt-4" style={{ background: F.grau }}>
        <div className={BREITE}>
          <Etikett>Calculator</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            What does <span style={{ color: F.akzent }}>your interview cost?</span>
          </h2>
          <Rechner />
        </div>
      </section>

      <section className="py-20">
        <div className={BREITE}>
          <Etikett>How it works</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            A questionnaire costs next to nothing. <span style={{ color: F.akzent }}>The right questions don't.</span>
          </h2>
          <p className="mt-4 max-w-[680px]" style={{ ...TEXT_STIL, color: F.daempft }}>
            From more than 500 brand projects we know which questions really drive a decision. So you pay for that knowledge, not
            for the number of answers.
          </p>
          <div className="mt-9 grid gap-4 grid-cols-1 md:grid-cols-3">
            <article className="p-[26px] rounded-[20px] bg-white" style={{ border: `2px solid ${F.dunkel}` }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.daempft }}>1. Intro call</p>
              <p className="mt-2.5 text-[34px] font-black leading-none" style={{ color: GRUEN_TEXT }}>€0</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                30 minutes by video or phone. We tell you honestly whether we can help.
              </p>
            </article>
            <article className="p-[26px] rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.hellAufDunkel }}>2. Interview</p>
              <p className="mt-2.5 text-[34px] font-black leading-none">from {fmt(STUFEN[0].basis)}</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "#e4e4e4" }}>
                Developing the questions, invitations, reminders, analysis and a presentation in person. All included.
              </p>
            </article>
            <article className="p-[26px] rounded-[20px]" style={{ background: F.hauch }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.daempft }}>3. Follow-up, if you like</p>
              <p className="mt-2.5 text-[34px] font-black leading-none">from €1,200</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                Ask the same questions again after six months and see what is working.
              </p>
            </article>
          </div>
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${F.linie}` }}>
        <Faq seite="preise" look="weiss" />
      </div>

      <section className={`${BREITE} py-24`}>
        <div className="rounded-[28px] p-14 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 text-white" style={{ background: F.akzent }}>
          <h2 className="flex-[1_1_520px]" style={H2_STIL}>Talk first. Then decide.</h2>
          <Hauptknopf href="#anfrage" farbe={F.dunkel}>Get in touch, no obligation</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
