import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mic, Smartphone, Users, Compass, TrendingUp, HeartHandshake } from "lucide-react";

// Öffentliche Startseite von andifragt.at — für alle, die die Domain ohne
// Befragungslink aufrufen. Beschreibt das Produkt kurz und führt Eingeladene,
// die nur einen Code haben, zur richtigen Befragung.
//
// Bewusst ohne Datenzugriff: Die Seite lädt nichts aus der Datenbank und
// verrät nicht, welche Befragungen es gibt.

const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";
const IMPRESSUM = "https://www.werbe-agentur-graz.at/impressum";
const DATENSCHUTZ = "https://www.werbe-agentur-graz.at/datenschutz";
const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

const ZWECKE = [
  {
    icon: Compass,
    titel: "Positionierung",
    text: "Der Markenprüfstand: Wofür steht ihr wirklich — und was macht euch stark, ohne dass es jemand ausspricht?",
  },
  {
    icon: TrendingUp,
    titel: "Vertrieb",
    text: "Bevor eine neue Vertriebsidee ausgerollt wird: Was erleben Außendienst, Innendienst und Kunden heute tatsächlich?",
  },
  {
    icon: HeartHandshake,
    titel: "Mitarbeitende",
    text: "Zufriedenheit und Arbeitgebermarke — gemessen an dem, was das Team sagt, nicht an dem, was im Leitbild steht.",
  },
];

const ABLAUF = [
  {
    nr: "01",
    titel: "Kickoff mit der Geschäftsführung",
    text: "Rund zehn Fragen klären Ziel, Erwartungen und Vermutungen. Daraus entsteht der Fragebogen — fester Kern plus Fragen, die nur zu euch passen.",
  },
  {
    nr: "02",
    titel: "Befragung in Wellen",
    text: "Geschäftsführung, Teams, Abteilungen und auf Wunsch eure Kunden — von 5 bis 100 Personen. Der Link kommt per Mail, QR-Code oder Aushang.",
  },
  {
    nr: "03",
    titel: "Auswertung und Konzept",
    text: "Wir suchen nicht den Durchschnitt, sondern die Abweichungen: Wo sich das Team einig ist, wo nicht — und was die Chefetage nicht erwartet hat.",
  },
];

const VERSPRECHEN = [
  { icon: Lock, titel: "Anonym heißt anonym", text: "Niemand kann sehen, wer was geantwortet hat. Ergebnisse gibt es erst ab einer Mindestzahl an Teilnehmenden." },
  { icon: Smartphone, titel: "Am Handy wie am Computer", text: "Ohne App, ohne Anmeldung. Unterbrechen und später weitermachen geht jederzeit." },
  { icon: Mic, titel: "Sprechen statt tippen", text: "Offene Antworten lassen sich einsprechen — so sagen Menschen mehr als in ein Textfeld." },
  { icon: Users, titel: "Mehr als Ankreuzen", text: "Werte sortieren, abwägen, erzählen: Die Fragen holen das heraus, was in Standardumfragen untergeht." },
];

// Akzeptiert den ganzen Link (https://andifragt.at/i/CODE) oder nur den Code.
function codeAuslesen(eingabe) {
  const roh = String(eingabe || "").trim();
  const treffer = roh.match(/\/i\/([A-Za-z0-9_-]+)/);
  const code = treffer ? treffer[1] : roh;
  return /^[A-Za-z0-9_-]{8,64}$/.test(code) ? code : null;
}

export default function Startseite() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fehler, setFehler] = useState("");

  useEffect(() => {
    const vorher = document.title;
    document.title = "andi fragt. — Befragungen, die mehr zeigen | Rittler & Co";
    return () => {
      document.title = vorher;
    };
  }, []);

  function zurBefragung(e) {
    e.preventDefault();
    const gefunden = codeAuslesen(code);
    if (!gefunden) {
      setFehler("Das sieht nicht nach einem Befragungscode aus. Am einfachsten öffnest du den Link aus deiner Einladung.");
      return;
    }
    navigate(`/i/${gefunden}`);
  }

  const mailLink = `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent("andi fragt. — Gespräch vereinbaren")}`;

  return (
    <div className="min-h-screen bg-white" style={{ color: "var(--farbe-text)", fontFamily: "var(--schrift)" }}>
      {/* Kopf */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="text-lg font-bold tracking-tight" aria-label="andi fragt. — Startseite">
          andi fragt<span style={{ color: "var(--farbe-akzent)" }}>.</span>
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#eingeladen" className="hidden sm:inline hover:underline">Ich wurde eingeladen</a>
          <a
            href={mailLink}
            className="inline-flex items-center rounded px-3 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--farbe-text)" }}
          >
            Kontakt
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>
            Eine Methode von Rittler &amp; Co
          </p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold uppercase leading-[1.02] tracking-tight max-w-4xl">
            Die Antwort steckt <span style={{ color: "var(--farbe-akzent)" }}>im Unternehmen.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: "var(--farbe-text-daempft)" }}>
            Mitarbeitende wissen oft genau, warum Kunden bleiben, was wirklich funktioniert und wo es hakt. Die
            Geschäftsführung hört davon selten. <strong style={{ color: "var(--farbe-text)" }}>andi fragt.</strong> holt
            dieses Wissen anonym ab und macht daraus die Grundlage für Positionierung, Vertrieb und Arbeitgebermarke.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={mailLink}
              className="inline-flex items-center justify-center gap-2 rounded px-5 py-3 font-bold uppercase text-sm tracking-wide text-white"
              style={{ background: "var(--farbe-akzent)" }}
            >
              Gespräch vereinbaren <ArrowRight size={16} />
            </a>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center rounded px-5 py-3 font-semibold text-sm border"
              style={{ borderColor: "var(--farbe-linie-kraeftig)" }}
            >
              So läuft es ab
            </a>
          </div>
        </section>

        {/* Wofür */}
        <section className="py-16 sm:py-20" style={{ background: "var(--farbe-grau)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>Wofür</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold uppercase tracking-tight">Drei Fragen, eine Methode</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {ZWECKE.map(({ icon: Icon, titel, text }) => (
                <div key={titel} className="bg-white rounded-lg p-6">
                  <Icon size={26} strokeWidth={1.5} style={{ color: "var(--farbe-akzent)" }} aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm" style={{ color: "var(--farbe-text-daempft)" }}>
              Mehr zum Markenprüfstand:{" "}
              <a href={MARKENPRUEFSTAND} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: "var(--farbe-akzent-tief)" }}>
                werbe-agentur-graz.at
              </a>
            </p>
          </div>
        </section>

        {/* Ablauf */}
        <section id="ablauf" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>Ablauf</p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold uppercase tracking-tight">In drei Schritten zum Ergebnis</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {ABLAUF.map(({ nr, titel, text }) => (
              <li key={nr}>
                <span className="text-4xl font-extrabold" style={{ color: "var(--farbe-akzent)" }}>{nr}</span>
                <h3 className="mt-3 text-lg font-bold">{titel}</h3>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Versprechen an die Befragten */}
        <section className="py-16 sm:py-20 text-white" style={{ background: "var(--farbe-text)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>Für die Befragten</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold uppercase tracking-tight">Ehrliche Antworten brauchen Vertrauen</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {VERSPRECHEN.map(({ icon: Icon, titel, text }) => (
                <div key={titel} className="flex gap-4">
                  <Icon size={24} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--farbe-gut)" }} aria-hidden="true" />
                  <div>
                    <h3 className="font-bold">{titel}</h3>
                    <p className="mt-1 leading-relaxed text-white/75">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eingeladene */}
        <section id="eingeladen" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-4">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">Du wurdest zu einer Befragung eingeladen?</h2>
            <p className="mt-3 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>
              Öffne am besten den Link aus deiner Einladung oder scanne den QR-Code. Hast du nur den Code, gib ihn hier ein.
            </p>
            <form onSubmit={zurBefragung} className="mt-6 flex flex-col sm:flex-row gap-3" noValidate>
              <label htmlFor="befragungscode" className="sr-only">Befragungscode oder Link</label>
              <input
                id="befragungscode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFehler("");
                }}
                placeholder="Code oder Link einfügen"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 h-12 rounded border px-4 text-base outline-none focus:ring-2"
                style={{ borderColor: "var(--farbe-rahmen)" }}
                aria-invalid={!!fehler}
                aria-describedby={fehler ? "code-fehler" : undefined}
              />
              <button
                type="submit"
                className="h-12 inline-flex items-center justify-center gap-2 rounded px-5 font-semibold"
                style={{ background: "var(--farbe-gut)", color: "var(--farbe-text)" }}
              >
                Zur Befragung <ArrowRight size={16} />
              </button>
            </form>
            {fehler && (
              <p id="code-fehler" className="mt-3 text-sm" role="alert" style={{ color: "var(--farbe-text)" }}>
                {fehler}
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Fuß */}
      <footer className="border-t" style={{ borderColor: "var(--farbe-linie)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm" style={{ color: "var(--farbe-text-daempft)" }}>
          <div>
            <strong style={{ color: "var(--farbe-text)" }}>Rittler &amp; Co GmbH</strong> · Peter-Rosegger-Straße 27, 8053 Graz ·{" "}
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="hover:underline">{KONTAKT_TEL}</a> ·{" "}
            <a href={`mailto:${KONTAKT_MAIL}`} className="hover:underline">{KONTAKT_MAIL}</a>
          </div>
          <div className="flex gap-5">
            <a href={IMPRESSUM} target="_blank" rel="noopener noreferrer" className="hover:underline">Impressum</a>
            <a href={DATENSCHUTZ} target="_blank" rel="noopener noreferrer" className="hover:underline">Datenschutz</a>
            <Link to="/verwaltung" className="hover:underline">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
