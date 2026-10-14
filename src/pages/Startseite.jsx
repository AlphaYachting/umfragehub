import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mic, Smartphone, ListChecks, Compass, TrendingUp, HeartHandshake } from "lucide-react";

// Öffentliche Startseite von andifragt.at — für alle, die die Domain ohne
// Befragungslink aufrufen. Inhalt abgestimmt auf die Markenprüfstand-Seite
// (werbe-agentur-graz.at/positionierung-agentur): ANDI-Methode, vier Säulen,
// vier Schritte „fragt / weiß / macht / zeigt“. Schrift: Gilroy (siehe index.css).
//
// Bewusst ohne Datenzugriff: Die Seite lädt nichts aus der Datenbank und
// verrät nicht, welche Befragungen es gibt.
//
// Hinweis Typografie: Die Gilroy-Dateien enthalten keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Texte hier deshalb mit
// Doppelpunkt, Komma oder Punkt statt Strich schreiben.

const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";
const IMPRESSUM = "https://www.werbe-agentur-graz.at/impressum";
const DATENSCHUTZ = "https://www.werbe-agentur-graz.at/datenschutz";
const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

const SAEULEN = [
  { buchstabe: "A", titel: "Aufmerksamkeit", frage: "Was zieht an?", text: "Wo deine Marke sofort Relevanz erzeugt und welche Wünsche sie aufgreift." },
  { buchstabe: "N", titel: "Nutzen", frage: "Was bringt es deinem Kunden?", text: "Welcher konkrete Mehrwert überzeugt: Zeit, Kosten, Service, Betreuung." },
  { buchstabe: "D", titel: "Differenzierung", frage: "Warum gerade du?", text: "Was dich vom Wettbewerb abhebt: Herkunft, Know-how, Arbeitsweise." },
  { buchstabe: "I", titel: "Identität", frage: "Was macht dich unverwechselbar?", text: "Die Werte, für die dein Unternehmen steht, nach innen und nach außen." },
];

const ZWECKE = [
  {
    icon: Compass,
    titel: "Positionierung",
    text: "Der Markenprüfstand: Passt deine Kommunikation noch zu deinen Zielen? Fakten statt endloser Workshops.",
  },
  {
    icon: HeartHandshake,
    titel: "Team und Arbeitgebermarke",
    text: "Stimmung, Zufriedenheit und Zielverständnis im Team messbar machen und ein gemeinsames Markenverständnis schaffen.",
  },
  {
    icon: TrendingUp,
    titel: "Vertrieb",
    text: "Bevor eine neue Vertriebsidee ausgerollt wird: Was erleben Außendienst, Innendienst und Kunden heute tatsächlich?",
  },
];

const SCHRITTE = [
  {
    bild: "/marke/andi-fragt.svg",
    alt: "ANDI fragt",
    titel: "Digitale Befragung",
    text: "Du, deine Mitarbeitenden und auf Wunsch deine Kunden antworten online, anonym und dann, wann es passt. Dein eigener Aufwand: rund 60 Minuten.",
  },
  {
    bild: "/marke/andi-weiss.svg",
    alt: "ANDI weiß",
    titel: "Analyse und Auswertung",
    text: "Wir verdichten alle Antworten mit der ANDI-Methode, entwickelt aus über 500 Markenprojekten. Wir suchen nicht den Durchschnitt, sondern die Abweichungen.",
  },
  {
    bild: "/marke/andi-macht.svg",
    alt: "ANDI macht",
    titel: "Klarheit und Essenz",
    text: "Die wahren Stärken deines Unternehmens werden sichtbar: ehrlich, messbar, auf den Punkt. Mit klaren Empfehlungen statt Worthülsen.",
  },
  {
    bild: "/marke/andi-zeigt.svg",
    alt: "ANDI zeigt",
    titel: "Kommunikation",
    text: "Aus der Essenz werden klare Botschaften, sichtbare Differenzierung und eine glaubwürdige Identität. Den Weg dorthin besprechen wir gemeinsam.",
  },
];

const VERSPRECHEN = [
  { icon: Lock, titel: "Volle Anonymität", text: "Niemand sieht, wer was geantwortet hat. Ergebnisse gibt es erst ab einer Mindestzahl an Teilnehmenden." },
  { icon: Smartphone, titel: "Orts- und zeitunabhängig", text: "Am Handy oder am Computer, ohne App und ohne Anmeldung. Unterbrechen und später weitermachen geht jederzeit." },
  { icon: Mic, titel: "Sprechen statt tippen", text: "Offene Antworten lassen sich einsprechen. So sagen Menschen mehr als in ein Textfeld." },
  { icon: ListChecks, titel: "Mehr als Ankreuzen", text: "Werte sortieren, abwägen, erzählen: Die Fragen holen heraus, was in Standardumfragen untergeht." },
];

// Akzeptiert den ganzen Link (https://andifragt.at/i/CODE) oder nur den Code.
function codeAuslesen(eingabe) {
  const roh = String(eingabe || "").trim();
  const treffer = roh.match(/\/i\/([A-Za-z0-9_-]+)/);
  const code = treffer ? treffer[1] : roh;
  return /^[A-Za-z0-9_-]{8,64}$/.test(code) ? code : null;
}

function Etikett({ children, hell = false }) {
  return (
    <p
      className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em]"
      style={{ color: hell ? "var(--farbe-akzent)" : "var(--farbe-akzent)" }}
    >
      {children}
    </p>
  );
}

export default function Startseite() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fehler, setFehler] = useState("");

  useEffect(() => {
    const vorher = document.title;
    document.title = "andi fragt. | Die ANDI-Methode von Rittler & Co";
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

  const mailLink = `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent("andi fragt. Termin vereinbaren")}`;

  return (
    <div className="min-h-screen bg-white" style={{ color: "var(--farbe-text)", fontFamily: "var(--schrift-marke)" }}>
      {/* Kopf */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <a href="#top" aria-label="andi fragt. Zur Startseite" className="block">
          <img src="/marke/andi-fragt.svg" alt="ANDI fragt" className="h-12 sm:h-14 w-auto" width="160" height="130" />
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#eingeladen" className="hidden sm:inline font-medium hover:underline">Ich wurde eingeladen</a>
          <a
            href={mailLink}
            className="inline-flex items-center rounded px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--farbe-text)" }}
          >
            Kontakt
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Einstieg */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <Etikett>Die ANDI-Methode von Rittler &amp; Co</Etikett>
          <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.98] max-w-5xl">
            Die Antwort steckt <span style={{ color: "var(--farbe-akzent)" }}>im Unternehmen.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: "var(--farbe-text-daempft)" }}>
            Deine Mitarbeitenden wissen oft genau, warum Kunden bleiben, was wirklich funktioniert und wo es hakt.
            In der Geschäftsführung kommt davon wenig an. <strong className="font-semibold" style={{ color: "var(--farbe-text)" }}>andi fragt.</strong>{" "}
            holt dieses Wissen anonym ab und macht es messbar. Klarheit statt Bauchgefühl.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={mailLink}
              className="inline-flex items-center justify-center gap-2 rounded px-6 py-3.5 font-semibold uppercase text-sm tracking-wide text-white"
              style={{ background: "var(--farbe-akzent)" }}
            >
              Termin vereinbaren <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 font-semibold text-sm border"
              style={{ borderColor: "var(--farbe-linie-kraeftig)" }}
            >
              So läuft es ab
            </a>
          </div>
        </section>

        {/* ANDI: vier Säulen */}
        <section className="py-16 sm:py-20" style={{ background: "var(--farbe-grau)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Etikett>Was ANDI prüft</Etikett>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">
              Vier Säulen einer <span style={{ color: "var(--farbe-akzent)" }}>starken Marke.</span>
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SAEULEN.map(({ buchstabe, titel, frage, text }) => (
                <div key={titel} className="bg-white rounded-lg p-6">
                  <span className="block text-5xl font-black leading-none" style={{ color: "var(--farbe-akzent)" }} aria-hidden="true">
                    {buchstabe}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-1 font-semibold">{frage}</p>
                  <p className="mt-2 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wofür */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <Etikett>Wofür</Etikett>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">Eine Methode, drei Fragen</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {ZWECKE.map(({ icon: Icon, titel, text }) => (
              <div key={titel}>
                <Icon size={28} strokeWidth={1.5} style={{ color: "var(--farbe-akzent)" }} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm" style={{ color: "var(--farbe-text-daempft)" }}>
            Mehr zum Markenprüfstand auf{" "}
            <a href={MARKENPRUEFSTAND} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: "var(--farbe-akzent-tief)" }}>
              werbe-agentur-graz.at
            </a>
          </p>
        </section>

        {/* Ablauf */}
        <section id="ablauf" className="py-16 sm:py-20 scroll-mt-4" style={{ background: "var(--farbe-grau)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Etikett>Ablauf</Etikett>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">
              In 4 Schritten zu deiner <span style={{ color: "var(--farbe-akzent)" }}>Marken-Essenz.</span>
            </h2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {SCHRITTE.map(({ bild, alt, titel, text }) => (
                <li key={titel}>
                  <img src={bild} alt={alt} className="h-20 w-auto" width="160" height="130" loading="lazy" />
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Versprechen an die Befragten */}
        <section className="py-16 sm:py-20 text-white" style={{ background: "var(--farbe-text)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Etikett>Für die Befragten</Etikett>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">Ehrliche Antworten brauchen Vertrauen</h2>
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
                style={{ borderColor: "var(--farbe-rahmen)", fontFamily: "inherit" }}
                aria-invalid={!!fehler}
                aria-describedby={fehler ? "code-fehler" : undefined}
              />
              <button
                type="submit"
                className="h-12 inline-flex items-center justify-center gap-2 rounded px-5 font-semibold"
                style={{ background: "var(--farbe-gut)", color: "var(--farbe-text)", fontFamily: "inherit" }}
              >
                Zur Befragung <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
            {fehler && (
              <p id="code-fehler" className="mt-3 text-sm" role="alert">
                {fehler}
              </p>
            )}
          </div>
        </section>
      </main>

      {/* Fuß */}
      <footer className="border-t" style={{ borderColor: "var(--farbe-linie)" }}>
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm"
          style={{ color: "var(--farbe-text-daempft)" }}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <strong className="font-semibold" style={{ color: "var(--farbe-text)" }}>Rittler &amp; Co GmbH</strong>
            <span>Peter-Rosegger-Straße 27, 8053 Graz</span>
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="hover:underline">{KONTAKT_TEL}</a>
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
