import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, Users, HeartHandshake, Lock, Mic, Smartphone, ListChecks } from "lucide-react";

// Öffentliche Startseite von andifragt.at, für alle, die die Domain ohne
// Befragungslink aufrufen.
//
// Aufbau (Konzept 10/2026): drei Befragungen, drei Ziele.
//   01 Positionierung: Wir befragen, damit dich deine Kunden besser sehen.
//   02 Team: Damit die Guten bleiben und Bessere kommen.
//   03 Kunden: Deine Kunden können mehr zu deinem Erfolg beitragen, als du glaubst.
// Danach Ablauf (ANDI fragt / weiß / macht / zeigt), Vertrauen, Einstieg für Eingeladene.
// Begriffe abgestimmt auf werbe-agentur-graz.at/positionierung-agentur.
//
// Bewusst ohne Datenzugriff: Die Seite lädt nichts aus der Datenbank und
// verrät nicht, welche Befragungen es gibt.
//
// Typografie: Die Gilroy-Dateien enthalten keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Texte hier deshalb mit
// Doppelpunkt, Komma oder Punkt statt Strich schreiben.

const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";
const IMPRESSUM = "https://www.werbe-agentur-graz.at/impressum";
const DATENSCHUTZ = "https://www.werbe-agentur-graz.at/datenschutz";
const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

const mailAn = (betreff) => `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent(betreff)}`;

const THEMEN = [
  {
    id: "positionierung",
    nr: "01",
    icon: Eye,
    kurz: "Positionierung",
    versprechen: "Sichtbar für deine Kunden.",
    h2: "Wir befragen, damit dich deine Kunden",
    akzent: "besser sehen.",
    absaetze: [
      "Viele Unternehmen sind besser als ihr Auftritt. Die Gründe, warum Kunden wirklich bei dir kaufen, kennt oft dein Team. In keinem Prospekt und auf keiner Website stehen sie.",
      "Wir holen diese Stärken ab, prüfen sie mit der ANDI-Methode und machen daraus eine Positionierung, die deine Kunden von außen erkennen. So wird aus einem guten Unternehmen eine sichtbare Marke.",
    ],
    knopf: "Markenprüfstand anfragen",
    betreff: "andi fragt. Positionierung",
  },
  {
    id: "team",
    nr: "02",
    icon: Users,
    kurz: "Team",
    versprechen: "Die Guten bleiben, Bessere kommen.",
    h2: "Damit die Guten bleiben und",
    akzent: "Bessere kommen.",
    absaetze: [
      "Gute Leute bleiben, wenn sie wissen, wofür sie arbeiten, und wenn jemand zuhört. Die anonyme Teambefragung zeigt, was dein Team hält, was es bremst und was es sich wünscht.",
      "Daraus entsteht eine Arbeitgebermarke, die stimmt: Dein Team erkennt sich darin wieder, und gute Bewerberinnen und Bewerber sehen, warum es sich lohnt, zu dir zu kommen.",
    ],
    punkte: [
      "Stimmung und Zufriedenheit, auch je Abteilung",
      "Was dein Team hält und was es bremst",
      "Wie gut Ziele und Werte im Alltag ankommen",
      "Die Grundlage für eine glaubwürdige Arbeitgebermarke",
    ],
    knopf: "Teambefragung anfragen",
    betreff: "andi fragt. Teambefragung",
  },
  {
    id: "kunden",
    nr: "03",
    icon: HeartHandshake,
    kurz: "Kunden",
    versprechen: "Mehr Erfolg, als du glaubst.",
    h2: "Deine Kunden können mehr zu deinem Erfolg beitragen,",
    akzent: "als du glaubst.",
    absaetze: [
      "Kunden sagen selten von sich aus, warum sie bei dir kaufen, was sie fast zur Konkurrenz getrieben hätte oder was sie sich noch wünschen. Gefragt erzählen sie es gern.",
      "Die Kundenbefragung liefert die Außensicht, die im Alltag fehlt. Im Vergleich mit Führung und Team zeigt sie, wo dein Selbstbild und das Bild deiner Kunden auseinandergehen und wo deine größten Chancen liegen.",
    ],
    punkte: [
      "Warum Kunden bleiben und wann sie wechseln würden",
      "Wie deine Marke von außen wirkt",
      "Welche Leistungen sie schätzen und welche sie vermissen",
      "Der Abgleich mit dem Bild von Führung und Team",
    ],
    knopf: "Kundenbefragung anfragen",
    betreff: "andi fragt. Kundenbefragung",
  },
];

const SAEULEN = [
  { buchstabe: "A", titel: "Aufmerksamkeit", frage: "Was zieht an?" },
  { buchstabe: "N", titel: "Nutzen", frage: "Was bringt es deinem Kunden?" },
  { buchstabe: "D", titel: "Differenzierung", frage: "Warum gerade du?" },
  { buchstabe: "I", titel: "Identität", frage: "Was macht dich unverwechselbar?" },
];

const SCHRITTE = [
  {
    bild: "/marke/andi-fragt.svg",
    alt: "ANDI fragt",
    titel: "Digitale Interviews",
    text: "Führung, Team und auf Wunsch deine Kunden beantworten die Interviews online: anonym, am Handy oder am Computer, wann es passt. Dein eigener Aufwand: rund 60 Minuten.",
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
    text: "Aus der Essenz werden klare Botschaften für Kunden, Team und Bewerbende. Den Weg dorthin besprechen wir gemeinsam.",
  },
];

const VERSPRECHEN = [
  { icon: Lock, titel: "Volle Anonymität", text: "Niemand sieht, wer was geantwortet hat. Ergebnisse gibt es erst ab einer Mindestzahl an Teilnehmenden." },
  { icon: Smartphone, titel: "Orts- und zeitunabhängig", text: "Digitale Interviews am Handy oder am Computer, ohne App und ohne Anmeldung. Unterbrechen und später weitermachen geht jederzeit." },
  { icon: Mic, titel: "Sprechen statt tippen", text: "Offene Antworten lassen sich einsprechen. So sagen Menschen mehr als in ein Textfeld." },
  { icon: ListChecks, titel: "Mehr als Ankreuzen", text: "Werte sortieren, abwägen, erzählen: Die Fragen holen heraus, was in Standardumfragen untergeht." },
];

// Einheitliche Icons: Inhalts-Icons 28 px, Häkchen in Listen 20 px, Pfeile in Knöpfen 16 px.
// Alle mit gleicher Strichstärke und in der Akzentfarbe.
const ICON = { size: 28, strokeWidth: 1.5, style: { color: "var(--farbe-akzent)" }, "aria-hidden": "true" };
const HAEKCHEN = { size: 20, strokeWidth: 2, style: { color: "var(--farbe-akzent)" }, "aria-hidden": "true" };

// Akzeptiert den ganzen Link (https://andifragt.at/i/CODE) oder nur den Code.
function codeAuslesen(eingabe) {
  const roh = String(eingabe || "").trim();
  const treffer = roh.match(/\/i\/([A-Za-z0-9_-]+)/);
  const code = treffer ? treffer[1] : roh;
  return /^[A-Za-z0-9_-]{8,64}$/.test(code) ? code : null;
}

// Kleine Bereichsbeschriftung wie auf werbe-agentur-graz.at: Medium, Versalien, weit gesperrt.
function Etikett({ children }) {
  return (
    <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>
      {children}
    </p>
  );
}

function Hauptknopf({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded px-6 py-3.5 font-semibold uppercase text-sm tracking-wide text-white"
      style={{ background: "var(--farbe-akzent)" }}
    >
      {children} <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}

// Text eines Themas: Etikett, Überschrift mit Akzentwort, Absätze, Knopf.
function ThemaText({ thema }) {
  return (
    <div>
      <Etikett>
        {thema.nr} {thema.kurz}
      </Etikett>
      <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">
        {thema.h2} <span style={{ color: "var(--farbe-akzent)" }}>{thema.akzent}</span>
      </h2>
      {thema.absaetze.map((a) => (
        <p key={a} className="mt-5 text-lg leading-relaxed" style={{ color: "var(--farbe-text-daempft)" }}>
          {a}
        </p>
      ))}
      <div className="mt-8">
        <Hauptknopf href={mailAn(thema.betreff)}>{thema.knopf}</Hauptknopf>
      </div>
    </div>
  );
}

// Liste „Was du erfährst“ für Team und Kunden.
function Erkenntnisse({ punkte, hintergrund }) {
  return (
    <div className="rounded-lg p-6 sm:p-8" style={{ background: hintergrund }}>
      <h3 className="text-lg font-bold">Was du erfährst</h3>
      <ul className="mt-5 space-y-4">
        {punkte.map((p) => (
          <li key={p} className="flex gap-3 leading-relaxed">
            <Check {...HAEKCHEN} className="shrink-0 mt-1" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
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

  const [positionierung, team, kunden] = THEMEN;

  return (
    <div className="min-h-screen bg-white" style={{ color: "var(--farbe-text)", fontFamily: "var(--schrift-marke)" }}>
      {/* Kopf */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Schriftzug wie in der ersten Fassung, um 30 % vergrößert (18 px auf rund 23 px) */}
        <a href="#top" className="text-[1.4625rem] font-bold leading-none" aria-label="andi fragt. Zur Startseite">
          andi fragt<span style={{ color: "var(--farbe-akzent)" }}>.</span>
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#eingeladen" className="hidden sm:inline font-medium hover:underline">Ich wurde eingeladen</a>
          <a
            href={mailAn("andi fragt. Termin vereinbaren")}
            className="inline-flex items-center rounded px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--farbe-text)" }}
          >
            Kontakt
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Einstieg */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <Etikett>Die ANDI-Methode von Rittler &amp; Co</Etikett>
          <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.98] max-w-5xl">
            Die Antwort steckt <span style={{ color: "var(--farbe-akzent)" }}>im Unternehmen.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: "var(--farbe-text-daempft)" }}>
            Wer täglich mit deinen Kunden arbeitet, weiß oft am besten, warum sie bei dir bleiben. Mit digitalen
            Interviews holt <strong className="font-semibold" style={{ color: "var(--farbe-text)" }}>andi fragt.</strong>{" "}
            dieses Wissen anonym ab: bei Führung, Team und Kunden. Klarheit statt Bauchgefühl.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Hauptknopf href={mailAn("andi fragt. Termin vereinbaren")}>Termin vereinbaren</Hauptknopf>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center rounded px-6 py-3.5 font-semibold text-sm border"
              style={{ borderColor: "var(--farbe-linie-kraeftig)" }}
            >
              So läuft es ab
            </a>
          </div>

          {/* Drei Befragungen auf einen Blick */}
          <nav aria-label="Die drei Befragungen" className="mt-14 sm:mt-20 grid gap-4 md:grid-cols-3">
            {THEMEN.map(({ id, nr, icon: Icon, kurz, versprechen }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex flex-col rounded-lg p-6 border transition-colors hover:border-[color:var(--farbe-akzent)]"
                style={{ background: "var(--farbe-grau)", borderColor: "var(--farbe-grau)" }}
              >
                <div className="flex items-center justify-between">
                  <Icon {...ICON} />
                  <span className="text-sm font-semibold" style={{ color: "var(--farbe-grau-mid)" }}>{nr}</span>
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--farbe-akzent)" }}>{kurz}</p>
                <p className="mt-2 text-xl font-bold leading-snug">{versprechen}</p>
                {/* mt-auto: „Mehr dazu“ steht in allen drei Kacheln auf einer Linie, auch wenn ein Satz umbricht */}
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Mehr dazu <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </nav>
        </section>

        {/* 01 Positionierung */}
        <section id={positionierung.id} className="py-16 sm:py-24 scroll-mt-4" style={{ background: "var(--farbe-grau)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <ThemaText thema={positionierung} />
              <p className="mt-6 text-sm" style={{ color: "var(--farbe-text-daempft)" }}>
                Mehr zum Markenprüfstand auf{" "}
                <a href={MARKENPRUEFSTAND} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline whitespace-nowrap" style={{ color: "var(--farbe-akzent-tief)" }}>
                  werbe-agentur-graz.at
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Was ANDI prüft: vier Säulen einer starken Marke</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {SAEULEN.map(({ buchstabe, titel, frage }) => (
                  <div key={titel} className="bg-white rounded-lg p-6">
                    <span className="block text-5xl font-black leading-none" style={{ color: "var(--farbe-akzent)" }} aria-hidden="true">
                      {buchstabe}
                    </span>
                    <h4 className="mt-4 text-lg font-bold">{titel}</h4>
                    <p className="mt-1" style={{ color: "var(--farbe-text-daempft)" }}>{frage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 02 Team */}
        <section id={team.id} className="py-16 sm:py-24 scroll-mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <ThemaText thema={team} />
            <div className="lg:pt-12">
              <Erkenntnisse punkte={team.punkte} hintergrund="var(--farbe-grau)" />
            </div>
          </div>
        </section>

        {/* 03 Kunden */}
        <section id={kunden.id} className="py-16 sm:py-24 scroll-mt-4" style={{ background: "var(--farbe-grau)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <ThemaText thema={kunden} />
            <div className="lg:pt-12">
              <Erkenntnisse punkte={kunden.punkte} hintergrund="#ffffff" />
            </div>
          </div>
        </section>

        {/* Ablauf */}
        <section id="ablauf" className="py-16 sm:py-24 scroll-mt-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Etikett>Ablauf</Etikett>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black uppercase leading-tight">
              In 4 Schritten vom Interview <span style={{ color: "var(--farbe-akzent)" }}>zur Wirkung.</span>
            </h2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {SCHRITTE.map(({ bild, alt, titel, text }) => (
                <li key={titel}>
                  {/* Alle vier Signets haben dasselbe Raster (163 × 128), der ANDI-Kasten ist überall gleich groß.
                      Der Kasten beginnt bei x = 11 von 163; bei 80 px Höhe sind das knapp 7 px, die das
                      negative Außenmaß ausgleicht, damit der Kasten bündig mit der Textkante steht. */}
                  <img src={bild} alt={alt} className="h-20 w-auto -ml-[7px]" width="163" height="128" loading="lazy" />
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
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {VERSPRECHEN.map(({ icon: Icon, titel, text }) => (
                <div key={titel}>
                  <Icon {...ICON} />
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{text}</p>
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
