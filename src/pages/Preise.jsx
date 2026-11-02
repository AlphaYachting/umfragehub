import React, { useRef, useState } from "react";
import { ArrowDown, ArrowRight, Lock, LockOpen, Plus, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, KONTAKT_TEL, LEAD_STIL, Modulseite, TEXT_STIL,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Öffentliche Preisseite von andifragt.at (Stand 01.11.2026, nach Prototyp
// "Preisseite: schlank, auf Anfrage optimiert").
//
// Aufbau auf Conversion: zuerst die drei Zusagen (Risiko nehmen), dann Rechner mit
// Preistreppe und Anfrageformular in einem Block, danach "So läuft es", FAQ, Abschluss.
// Das Formular nutzt dieselbe Funktion "anfrage" wie die Kontaktseite und schickt
// die Auswahl mit Richtpreis als Nachricht mit.
//
// Preislogik: erstes Modul = Basis, jedes weitere deutlich günstiger, alle vier = Paket.
// Typografie: keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte (Gilroy).
// Sprachregel: immer Interview, nie Befragung. Vorteile in Grün, Marke in Pink.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;
const GRUEN = F.gut;
const GRUEN_TEXT = "#167a45";
const GRUEN_HAUCH = "#eefaf3";
const GRUEN_RAND = "#bfe8d0";
const MAIL_REGEX = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";

const STUFEN = [
  { id: "klein", name: "Kleinbetrieb", hinweis: "bis 6 Mitarbeitende", basis: 2900, weiteres: 1100, paket: 5900 },
  { id: "b20", name: "7 bis 20", hinweis: "Personen pro Modul", basis: 3800, weiteres: 1500, paket: 7900 },
  { id: "b50", name: "21 bis 50", hinweis: "Personen pro Modul", basis: 5400, weiteres: 2100, paket: 10900 },
  { id: "b100", name: "51 bis 100", hinweis: "Personen pro Modul", basis: 7400, weiteres: 2900, paket: 14900 },
  { id: "gross", name: "über 100", hinweis: "auf Anfrage", basis: null },
];

const MODULE = [
  { id: "kunden", name: "Kunden", frage: "Warum kaufen sie?" },
  { id: "team", name: "Team", frage: "Warum bleiben sie?" },
  { id: "vertrieb", name: "Vertrieb", frage: "Warum schließen sie?" },
  { id: "positionierung", name: "Positionierung", frage: "Wofür stehst du?" },
];

const ZUSAGEN = [
  { icon: Lock, titel: "Fixpreis", text: "Was im Angebot steht, zahlst du. Keine Stunden, keine Nachverrechnung." },
  { icon: ShieldCheck, titel: "Rücklaufgarantie", text: "Antworten zu wenige, fassen wir ohne Aufpreis nach, bis die Stimmen tragen." },
  { icon: LockOpen, titel: "Keine Bindung", text: "Kein Abo, kein Vertrag auf Zeit. Du entscheidest nach jedem Schritt neu." },
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

// ---------- Rechner mit Treppe und Anfrage ----------

function Rechner() {
  const start = useRef(Date.now());
  const [mods, setMods] = useState(["kunden"]);
  const [stufeId, setStufeId] = useState("klein");
  const [werte, setWerte] = useState({ name: "", firma: "", email: "", telefon: "", webseite: "" });
  const [fehler, setFehler] = useState({});
  const [zustand, setZustand] = useState("offen"); // offen | sendet | gesendet | fehler | zuViele

  const stufe = STUFEN.find((s) => s.id === stufeId);
  const n = mods.length;
  const keinModul = n === 0;
  const aufAnfrage = !keinModul && !stufe.basis;
  const zeigPreis = !keinModul && !!stufe.basis;
  const summe = zeigPreis ? preisFuer(stufe, n) : 0;
  const naechstes = MODULE.find((m) => !mods.includes(m.id));
  const zusatz = zeigPreis && naechstes ? preisFuer(stufe, n + 1) - summe : 0;
  const namen = MODULE.filter((m) => mods.includes(m.id)).map((m) => m.name);
  const stufeText = stufe.id === "klein" ? "Kleinbetrieb" : `${stufe.name} Personen pro Modul`;
  const auswahl = [namen.join(", ") || "noch kein Modul", stufeText, zeigPreis ? `Richtpreis ${fmt(summe)}` : "Preis auf Anfrage"].join(", ");

  const umschalten = (id) => setMods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  const setze = (k) => (e) => setWerte((w) => ({ ...w, [k]: e.target.value }));

  async function senden(e) {
    e.preventDefault();
    const f = {};
    if (!werte.name.trim()) f.name = "Bitte gib deinen Namen an.";
    if (!werte.firma.trim()) f.firma = "Bitte gib dein Unternehmen an.";
    if (!MAIL_REGEX.test(werte.email.trim())) f.email = "Bitte gib eine gültige E-Mail-Adresse an.";
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
        nachricht: `Aus dem Preisrechner: ${auswahl}`,
        herkunft: "/preise",
        dauerSekunden: Math.round((Date.now() - start.current) / 1000),
      });
      const d = res?.data || {};
      if (d.ok) setZustand("gesendet");
      else if (d.zuViele) setZustand("zuViele");
      else if (d.fehler) {
        setFehler(d.fehler);
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
          <legend className="text-lg font-bold">1. Wie groß ist dein Betrieb?</legend>
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
          <legend className="text-lg font-bold">2. Was willst du wissen?</legend>
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
              Je mehr Blickwinkel, <span style={{ color: GRUEN_TEXT }}>desto günstiger jeder einzelne.</span>
            </p>
            <p className="mt-1.5 text-sm" style={{ color: F.daempft }}>
              Preise für {stufe.id === "klein" ? "Kleinbetriebe" : `${stufe.name} Personen pro Modul`}. Ab zwei Modulen zeigen wir dir
              inklusive, wo sich die Sichtweisen unterscheiden.
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
                    <p className="text-[13px]" style={{ color: F.daempft }}>{k === 4 ? "Alle 4 Module" : k === 1 ? "1 Modul" : `${k} Module`}</p>
                    <p className="mt-1.5 text-[22px] font-black leading-none whitespace-nowrap">{fmt(p)}</p>
                    <p className="mt-1.5 text-[13px] font-semibold whitespace-nowrap" style={{ color: k > 1 ? GRUEN_TEXT : F.daempft }}>
                      {fmt(p / k)} je Modul
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <aside aria-label="Dein Richtpreis und Anfrage" className="p-8 rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.hellAufDunkel }}>Dein Richtpreis</p>
        {keinModul && <p className="mt-4 text-xl font-bold leading-[1.4]">Wähle mindestens ein Modul.</p>}
        {aufAnfrage && (
          <>
            <p className="mt-4 text-[28px] font-black">Individuell</p>
            <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "#e4e4e4" }}>
              Ab 100 Menschen planen wir nach Bereichen. Den Fixpreis bekommst du nach dem Erstgespräch.
            </p>
          </>
        )}
        {zeigPreis && (
          <>
            <p aria-live="polite" className="mt-3.5 text-[56px] font-black leading-none" style={{ color: GRUEN }}>{fmt(summe)}</p>
            <p className="mt-2.5 text-[15px] leading-[1.5]" style={{ color: "#e4e4e4" }}>
              {n === 1
                ? "1 Modul. Alles inklusive vom Zielgespräch bis zur Präsentation."
                : `${n} Module, also ${fmt(summe / n)} je Modul. Abgleich der Sichtweisen inklusive.`}
            </p>
            {naechstes && (
              <button
                type="button"
                onClick={() => umschalten(naechstes.id)}
                className="mt-3.5 inline-flex items-center gap-2 min-h-[44px] px-4 rounded text-sm font-semibold cursor-pointer"
                style={{ border: `1px dashed ${GRUEN}`, background: "transparent", color: "#ffffff", fontFamily: "inherit" }}
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                {naechstes.name} dazunehmen: nur {fmt(zusatz)}
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
              <p className="text-[22px] font-black leading-[1.25]" style={{ color: GRUEN }}>Danke. Wir melden uns.</p>
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "#e4e4e4" }}>
                Innerhalb von 24 Stunden, mit Terminvorschlägen. Deine Auswahl: {auswahl}.
              </p>
            </div>
          ) : (
            <form onSubmit={senden} noValidate aria-labelledby="preis-anfrage-titel" className="flex flex-col gap-3.5">
              <p id="preis-anfrage-titel" className="text-xl font-black leading-[1.25]">Erstgespräch mit diesem Preis anfragen</p>
              <p className="-mt-1.5 text-sm" style={{ color: F.hellAufDunkel }}>30 Minuten, kostenlos. Deine Auswahl schicken wir mit.</p>
              <Feld id="preis-name" label="Name" type="text" autoComplete="name" value={werte.name} onChange={setze("name")} fehler={fehler.name} />
              <Feld id="preis-firma" label="Unternehmen" type="text" autoComplete="organization" value={werte.firma} onChange={setze("firma")} fehler={fehler.firma} />
              <Feld id="preis-email" label="E-Mail" type="email" autoComplete="email" value={werte.email} onChange={setze("email")} fehler={fehler.email} />
              <Feld id="preis-telefon" label="Telefon" optional type="tel" autoComplete="tel" value={werte.telefon} onChange={setze("telefon")} />
              {/* Für Menschen unsichtbar, fängt automatisch ausgefüllte Formulare ab */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="preis-webseite">Webseite</label>
                <input id="preis-webseite" type="text" tabIndex={-1} autoComplete="off" value={werte.webseite} onChange={setze("webseite")} />
              </div>
              {(zustand === "fehler" || zustand === "zuViele") && (
                <p role="alert" className="p-3.5 rounded-lg text-sm leading-[1.5]" style={{ background: F.dunkelKarte }}>
                  {zustand === "zuViele" ? "Wir haben gerade schon Anfragen von dir. Wir melden uns, versprochen." : "Das hat leider nicht geklappt."}{" "}
                  Ruf uns einfach an: <a href={TEL_LINK} className="font-bold whitespace-nowrap" style={{ color: "#ffffff" }}>{KONTAKT_TEL}</a>
                </p>
              )}
              <button
                type="submit"
                disabled={zustand === "sendet"}
                className="mt-1 flex items-center justify-center gap-2 min-h-[54px] px-6 rounded text-sm font-semibold uppercase tracking-[0.04em] text-white cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                style={{ background: F.akzent, border: 0, fontFamily: "inherit" }}
              >
                {zustand === "sendet" ? "Wird gesendet" : "Kostenlos anfragen"} <ArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="text-xs leading-[1.5]" style={{ color: F.hellAufDunkel }}>
                Wir melden uns innerhalb von 24 Stunden und verwenden deine Angaben nur dafür.{" "}
                <a href="/datenschutz#anfrage" target="_blank" rel="noopener" className="underline" style={{ color: F.hellAufDunkel }}>
                  Datenschutz
                </a>
                . Netto, zuzüglich 20&nbsp;% USt.
              </p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}

// ---------- Seite ----------

export default function Preise() {
  return (
    <Modulseite titel="Preise: Fixpreis statt Kosten pro Kopf | andi fragt." modul="Preise">
      {/* Kopf mit den drei Zusagen: das Risiko nehmen, bevor der erste Preis kommt */}
      <section className={`${BREITE} pt-14 pb-16`}>
        <Etikett>Preise</Etikett>
        <h1 className="mt-4 max-w-[980px]" style={H1_STIL}>
          Du zahlst für die richtigen Fragen. <span style={{ color: F.akzent }}>Nicht pro Kopf.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, maxWidth: 640, color: F.daempft }}>
          Ab {fmt(STUFEN[0].basis)} für Kleinbetriebe. Rechne deinen Preis in 20 Sekunden aus.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#rechner"
            className="inline-flex items-center justify-center gap-2 min-h-[52px] px-[26px] rounded text-sm font-semibold uppercase tracking-[0.04em]"
            style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
          >
            Preis berechnen <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href={TEL_LINK}
            className="inline-flex items-center justify-center min-h-[52px] px-6 rounded text-sm font-semibold"
            style={{ border: "1px solid #d6d3d0", color: F.text, textDecoration: "none" }}
          >
            Lieber anrufen: {KONTAKT_TEL}
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

      {/* Rechner, Preistreppe und Anfrage in einem Block */}
      <section id="rechner" className="py-20 scroll-mt-4" style={{ background: F.grau }}>
        <div className={BREITE}>
          <Etikett>Rechner</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Was kostet <span style={{ color: F.akzent }}>dein Interview?</span>
          </h2>
          <Rechner />
        </div>
      </section>

      {/* So läuft es */}
      <section className="py-20">
        <div className={BREITE}>
          <Etikett>So läuft es</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            Ein Fragebogen kostet fast nichts. <span style={{ color: F.akzent }}>Die richtigen Fragen schon.</span>
          </h2>
          <p className="mt-4 max-w-[680px]" style={{ ...TEXT_STIL, color: F.daempft }}>
            Aus über 500 Markenprojekten wissen wir, welche Fragen eine Entscheidung tragen. Darum zahlst du für dieses Wissen, nicht für
            die Zahl der Antworten.
          </p>
          <div className="mt-9 grid gap-4 grid-cols-1 md:grid-cols-3">
            <article className="p-[26px] rounded-[20px] bg-white" style={{ border: `2px solid ${F.dunkel}` }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.daempft }}>1. Erstgespräch</p>
              <p className="mt-2.5 text-[34px] font-black leading-none" style={{ color: GRUEN_TEXT }}>0&nbsp;€</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                30 Minuten per Video oder Telefon. Wir sagen ehrlich, ob wir helfen können.
              </p>
            </article>
            <article className="p-[26px] rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.hellAufDunkel }}>2. Interview</p>
              <p className="mt-2.5 text-[34px] font-black leading-none">ab {fmt(STUFEN[0].basis)}</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "#e4e4e4" }}>
                Fragen entwickeln, einladen, erinnern, auswerten und persönlich präsentieren. Alles inklusive.
              </p>
            </article>
            <article className="p-[26px] rounded-[20px]" style={{ background: F.hauch }}>
              <p className="text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.daempft }}>3. Dranbleiben, wenn du willst</p>
              <p className="mt-2.5 text-[34px] font-black leading-none">ab 1.200&nbsp;€</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                Nach einem halben Jahr mit denselben Fragen nachfragen und sehen, was wirkt.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Häufige Fragen */}
      <div style={{ borderTop: `1px solid ${F.linie}` }}>
        <Faq seite="preise" look="weiss" />
      </div>

      {/* Abschluss */}
      <section className={`${BREITE} py-24`}>
        <div className="rounded-[28px] p-14 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 text-white" style={{ background: F.akzent }}>
          <h2 className="flex-[1_1_520px]" style={H2_STIL}>Erst reden. Dann entscheiden.</h2>
          <Hauptknopf href="#anfrage" farbe={F.dunkel}>Unverbindlich anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
