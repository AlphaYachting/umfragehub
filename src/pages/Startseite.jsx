import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Search, Eye, Users, Heart, TrendingUp,
  Lock, Smartphone, MessageCircle, Pencil,
} from "lucide-react";
import { Wortmarke } from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Öffentliche Startseite von andifragt.at, für alle, die die Domain ohne
// Befragungslink aufrufen.
//
// Umgesetzt nach dem freigegebenen Prototyp (Design-Canvas „andi fragt. Startseite“, 21.10.2026):
//   Einstieg, vier Kacheln, vier Themen (Positionierung, Team, Kunden, Vertrieb) mit
//   Denkweg „Wir fragen / Wir erkennen / Du gewinnst“, Ablauf, Vertrauen, Eingeladene.
// Grundsatz: Wir zeigen nichts vom Befragungstool, sondern dass wir wissen,
// wie man fragt und was man aus den Antworten macht.
//
// Bewusst ohne Datenzugriff: Die Seite lädt nichts aus der Datenbank und
// verrät nicht, welche Befragungen es gibt.
//
// Sprachregel (24.10.2026): Auf der Seite steht nirgends Befragung, es heißt immer Interview.
// Die vier Themen haben je ein rundes Foto (public/bilder) und verlinken auf ihre Modulseite.
// Im Ablauf steht die Wortmarken-Familie andi fragt. / weiß. / macht. / zeigt. statt der Signets.
// Ergänzt 25.10.2026 nach Spiegelung aus Zielgruppensicht: wechselnde andi-Frage im Einstieg,
// Fakten unter dem Einstieg, Telefon beim Knopf, Logo-Laufband, Anonymität aus Sicht der Geschäftsführung.
//
// Typografie: Die Gilroy-Dateien enthalten keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Texte hier deshalb mit
// Doppelpunkt, Komma oder Punkt statt Strich schreiben.

const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";
const IMPRESSUM = "https://www.werbe-agentur-graz.at/impressum";
const DATENSCHUTZ = "https://www.werbe-agentur-graz.at/datenschutz";
const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

// Farben wie im Prototyp. Kleine pinke Beschriftungen etwas dunkler als der Akzent,
// damit sie auf Weiß und Hellgrau gut lesbar sind (Kontrast über 4,5 : 1).
const F = {
  akzent: "var(--farbe-akzent)",
  etikett: "#d4164a",
  etikettDunkel: "#ff7a98",
  link: "#c4103f",
  text: "var(--farbe-text)",
  daempft: "var(--farbe-text-daempft)",
  grau: "var(--farbe-grau)",
  hauch: "var(--farbe-akzent-hauch)",
  hauchRand: "#f3c6d1",
  linie: "var(--farbe-linie)",
  gut: "var(--farbe-gut)",
};

const mailAn = (betreff) => `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent(betreff)}`;

const THEMEN = [
  {
    id: "positionierung",
    nr: "01",
    icon: Eye,
    kurz: "Positionierung",
    pfad: "/positionierung",
    bild: "/bilder/positionierung.webp",
    alt: "Berater im Gespräch mit einem Kunden in dessen Werkstatt",
    versprechen: "Sichtbar für deine Kunden.",
    h2: "Wir fragen nach, damit dich deine Kunden",
    akzent: "besser sehen.",
    absaetze: [
      "Viele Unternehmen sind besser als ihr Auftritt. Die Gründe, warum Kunden wirklich bei dir kaufen, kennt oft dein Team. In keinem Prospekt und auf keiner Website stehen sie.",
      "Wir holen diese Stärken ab, prüfen sie mit der ANDI-Methode und machen daraus eine Positionierung, die deine Kunden von außen erkennen. So wird aus einem guten Unternehmen eine sichtbare Marke.",
    ],
    knopf: "Markenprüfstand anfragen",
    betreff: "andi fragt. Positionierung",
    wen: ["Geschäftsführung", "Team", "Kunden"],
    frage: "Warum kaufen Kunden wirklich bei uns und nicht beim Mitbewerb?",
    andi: true,
    gewinn: "Eine Positionierung mit Kernbotschaften, die deine Kunden auf Anhieb wiedererkennen.",
    rechts: false,
  },
  {
    id: "team",
    nr: "02",
    icon: Users,
    kurz: "Team",
    pfad: "/team",
    bild: "/bilder/team.webp",
    alt: "Team lacht gemeinsam in der Kaffeepause",
    versprechen: "Die Guten bleiben, Bessere kommen.",
    h2: "Damit die Guten bleiben und",
    akzent: "Bessere kommen.",
    absaetze: [
      "Gute Leute bleiben, wenn sie wissen, wofür sie arbeiten, und wenn jemand zuhört. Das anonyme Team-Interview zeigt, was dein Team hält, was es bremst und was es sich wünscht.",
      "Daraus entsteht eine Arbeitgebermarke, die stimmt: Dein Team erkennt sich darin wieder, und gute Bewerberinnen und Bewerber sehen, warum es sich lohnt, zu dir zu kommen.",
    ],
    knopf: "Team-Interview anfragen",
    betreff: "andi fragt. Team-Interview",
    wen: ["Mitarbeitende", "Führungskräfte", "Jede Abteilung"],
    frage: "Was hält dich hier, auch an Tagen, an denen es schwierig ist?",
    erkennen: [
      "Stimmung und Zufriedenheit, auch je Abteilung",
      "Was dein Team hält und was es bremst",
      "Wie gut Ziele und Werte im Alltag ankommen",
    ],
    gewinn: "Eine glaubwürdige Arbeitgebermarke, die gute Leute hält und die richtigen anzieht.",
    rechts: true,
  },
  {
    id: "kunden",
    nr: "03",
    icon: Heart,
    kurz: "Kunden",
    pfad: "/kunden",
    bild: "/bilder/kunden.webp",
    alt: "Kunde im Gespräch mit Mitarbeitenden am Empfang",
    versprechen: "Mehr Erfolg, als du glaubst.",
    h2: "Deine Kunden können mehr zu deinem Erfolg beitragen,",
    akzent: "als du glaubst.",
    absaetze: [
      "Kunden sagen selten von sich aus, warum sie bei dir kaufen, was sie fast zur Konkurrenz getrieben hätte oder was sie sich noch wünschen. Gefragt erzählen sie es gern.",
      "Das Kunden-Interview liefert die Außensicht, die im Alltag fehlt. Im Vergleich mit Führung und Team zeigt es, wo dein Selbstbild und das Bild deiner Kunden auseinandergehen und wo deine größten Chancen liegen.",
    ],
    knopf: "Kunden-Interview anfragen",
    betreff: "andi fragt. Kunden-Interview",
    wen: ["Stammkunden", "Neukunden", "Partner"],
    frage: "Was müsste passieren, damit du uns ohne Zögern weiterempfiehlst?",
    erkennen: [
      "Warum Kunden bleiben und wann sie wechseln würden",
      "Welche Leistungen sie schätzen und welche sie vermissen",
      "Wo dein Selbstbild und ihr Bild auseinandergehen",
    ],
    gewinn: "Leistungen und Botschaften, die genau dort ansetzen, wo deine Kunden entscheiden.",
    rechts: false,
  },
  {
    id: "vertrieb",
    nr: "04",
    icon: TrendingUp,
    kurz: "Vertrieb",
    pfad: "/vertrieb",
    bild: "/bilder/vertrieb.webp",
    alt: "Außendienstmitarbeiter mit Headset im Auto",
    versprechen: "Verkaufen, was wirklich ankommt.",
    h2: "Bevor du den Vertrieb neu aufstellst, frag die,",
    akzent: "die verkaufen.",
    absaetze: [
      "Eine neue Vertriebsidee klingt am Besprechungstisch oft besser als im Alltag. Außendienst, Innendienst und Kunden wissen am genauesten, wo Abschlüsse gelingen und wo sie hängen bleiben.",
      "Das Vertriebs-Interview holt dieses Wissen ab, bevor du investierst. So baust du auf dem auf, was funktioniert, und dein Team zieht mit, weil es gefragt wurde.",
    ],
    knopf: "Vertriebs-Interview anfragen",
    betreff: "andi fragt. Vertriebs-Interview",
    wen: ["Außendienst", "Innendienst", "Kunden"],
    frage: "Bei welchem Argument nicken Kunden, und bei welchem schalten sie ab?",
    erkennen: [
      "Wo Abschlüsse gelingen und wo sie hängen bleiben",
      "Welche Argumente beim Kunden wirklich ankommen",
      "Wie Außendienst, Innendienst und Kunden zusammenspielen",
    ],
    gewinn: "Einen Vertrieb, der auf dem aufbaut, was beim Kunden ankommt, und ein Team, das mitzieht.",
    rechts: true,
  },
];

const SAEULEN = ["Aufmerksamkeit", "Nutzen", "Differenzierung", "Identität"];

// Einstieg: andi stellt reihum die Frage, auf die die Überschrift antwortet (25.10.2026).
// Je Modul eine Frage, an die Geschäftsführung gerichtet.
const EINSTIEGSFRAGEN = [
  "Warum kaufen deine Kunden wirklich bei dir und nicht beim Mitbewerb?",
  "Was hält deine besten Leute eigentlich bei dir?",
  "Was müsste passieren, damit dich deine Kunden ohne Zögern weiterempfehlen?",
  "Bei welchem Argument nicken deine Kunden, und bei welchem schalten sie ab?",
];

// Vertrauen gleich unter dem Einstieg statt versteckt im Ablauf.
const FAKTEN = [
  { zahl: "über 500", text: "Markenprojekte als Grundlage der Methode" },
  { zahl: "über 20 Jahre", text: "Rittler & Co, Werbeagentur in Graz" },
  { zahl: "rund 60 Min.", text: "dein eigener Aufwand" },
  { zahl: "100 % anonym", text: "für alle, die wir interviewen" },
];

// Kundenlogos von werbe-agentur-graz.at/kunden. Auswahl Alfons 25.10.2026 zuerst,
// danach die bisherigen. Jedes Logo nur einmal.
const LOGO_BASIS = "https://www.werbe-agentur-graz.at/assets/images/";
const KUNDENLOGOS = [
  { name: "ATL Immoinvest", datei: "0/atl-10q4b2q7w8t7zzz.webp" },
  { name: "Haas Fertigbau", datei: "w/haas-fertigbau-8kp08ynrz293pp2.webp" },
  { name: "Steirerfleisch", datei: "b/steirerfleisch-76b8yv3vhvdpreq.webp" },
  { name: "Zeta", datei: "4/zeta-logo-1-bsm76qw5w9w7xpr.webp" },
  { name: "smaXtec", datei: "6/smaxtec-logo-172f1k1wvz6zk9n.svg" },
  { name: "WIGA", datei: "w/wiga-logo-qxxjhwww5vteyzf.webp" },
  { name: "Amiblu", datei: "7/amiblu-ma278bdy0xtmt5j.webp" },
  { name: "BFI Steiermark", datei: "4/client_bfi-bvp23r5xxf0t9ta.svg" },
  { name: "Drone Rescue Systems", datei: "t/drone-rescue-4f7dkas8pcmg7nj.webp" },
  { name: "NAVAX", datei: "2/logo-navax-cncjxfk668p80h6.webp" },
  { name: "Sappi", datei: "p/sappi-vq6hmxk9k3ykhh7.webp" },
  { name: "Leeb Balkone", datei: "y/leeb-wzbsa3753b3q8rb.webp" },
  { name: "Zeiss", datei: "a/client_zeiss-bk1gdn6mq34g5m7.svg" },
  { name: "Wienerberger", datei: "a/wienerberger_logo-57ntkym2r6gjj09.svg" },
  { name: "Weingut Pfeifer", datei: "8/pfeifer_logo-mtajnnff161zty3.svg" },
  { name: "Glavassevich & Fauster", datei: "6/glavassevich_logo-h6pktrctxqcsfpp.svg" },
  { name: "Weingut Tement", datei: "v/tement-t8dxfnf0e58we3v.webp" },
  { name: "Makava", datei: "a/MAKAvA-hm6gza1tc6bdxps.webp" },
  { name: "MFL Maschinenfabrik Liezen", datei: "n/mfl-logo-1dht9cbesf9q86n.svg" },
];

const SCHRITTE = [
  {
    verb: "fragt",
    titel: "Digitale Interviews",
    text: "Führung, Team, Vertrieb und auf Wunsch deine Kunden beantworten die Interviews online: anonym, am Handy oder am Computer, wann es passt. Dein eigener Aufwand: rund 60 Minuten.",
  },
  {
    verb: "weiß",
    titel: "Analyse und Auswertung",
    text: "Wir verdichten alle Antworten mit der ANDI-Methode, entwickelt aus über 500 Markenprojekten. Wir suchen nicht den Durchschnitt, sondern die Abweichungen.",
  },
  {
    verb: "macht",
    titel: "Klarheit und Essenz",
    text: "Die wahren Stärken deines Unternehmens werden sichtbar: ehrlich, messbar, auf den Punkt. Mit klaren Empfehlungen statt Worthülsen.",
  },
  {
    verb: "zeigt",
    titel: "Kommunikation",
    text: "Wir präsentieren dir die Ergebnisse persönlich. Aus der Essenz werden klare Botschaften für Kunden, Team, Vertrieb und Bewerbende.",
  },
];

const VERSPRECHEN = [
  { icon: Lock, titel: "Volle Anonymität", text: "Niemand sieht, wer was geantwortet hat. Ergebnisse gibt es erst ab einer Mindestzahl an Teilnehmenden." },
  { icon: Smartphone, titel: "Orts- und zeitunabhängig", text: "Am Handy oder am Computer, wann es passt. Unterbrechen und später weitermachen geht jederzeit." },
  { icon: MessageCircle, titel: "Fragen, die jeder versteht", text: "Klar formuliert, ohne Fachsprache und ohne Suggestion. So antworten alle ehrlich, vom Lehrling bis zur Geschäftsführung." },
  { icon: Pencil, titel: "Raum für eigene Worte", text: "Neben kurzen Einschätzungen gibt es offene Fragen. Dort steckt oft die wertvollste Antwort." },
];

// Icons: Inhalts-Icons 28 px, Pfeile in Knöpfen 16 px, Schritt-Symbole 16 px.
const ICON = { size: 28, strokeWidth: 1.5, style: { color: F.akzent }, "aria-hidden": "true" };

// Akzeptiert den ganzen Link (https://andifragt.at/i/CODE) oder nur den Code.
function codeAuslesen(eingabe) {
  const roh = String(eingabe || "").trim();
  const treffer = roh.match(/\/i\/([A-Za-z0-9_-]+)/);
  const code = treffer ? treffer[1] : roh;
  return /^[A-Za-z0-9_-]{8,64}$/.test(code) ? code : null;
}

// Kleine Bereichsbeschriftung: Medium, Versalien, weit gesperrt.
function Etikett({ children, dunkel = false, className = "" }) {
  return (
    <p
      className={`text-[13px] font-medium uppercase tracking-[0.2em] ${className}`}
      style={{ color: dunkel ? F.etikettDunkel : F.etikett }}
    >
      {children}
    </p>
  );
}

function Hauptknopf({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 min-h-[48px] rounded px-6 text-sm font-semibold uppercase tracking-[0.04em] text-white"
      style={{ background: F.akzent }}
    >
      {children} <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}

const H2 = "text-[30px] lg:text-[40px] font-black uppercase leading-[1.12]";

// Ein Schritt im Denkweg: Symbol links mit Verbindungslinie, Inhalt rechts.
function Schritt({ symbol, label, letzter = false, children }) {
  return (
    <li className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4">
      <span className="flex flex-col items-center" aria-hidden="true">
        {symbol}
        {!letzter && <span className="flex-1 w-0.5 my-1.5" style={{ background: F.hauchRand }} />}
      </span>
      <div className={letzter ? "" : "pb-7"}>
        <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em]" style={{ color: F.daempft }}>{label}</p>
        {children}
      </div>
    </li>
  );
}

const kreis = "flex items-center justify-center w-8 h-8 rounded-full shrink-0";

function Denkweg({ thema }) {
  return (
    <div className="rounded-[20px] p-7 sm:p-9" style={{ background: F.hauch }}>
      <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.daempft }}>Wen wir fragen</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {thema.wen.map((w) => (
          <span
            key={w}
            className="inline-flex items-center min-h-[32px] px-3.5 rounded-full bg-white text-sm font-medium"
            style={{ border: `1px solid ${F.hauchRand}` }}
          >
            {w}
          </span>
        ))}
      </div>

      <ol className="mt-8">
        <Schritt
          label="Wir fragen"
          symbol={<span className={`${kreis} text-white text-lg font-black`} style={{ background: F.akzent }}>?</span>}
        >
          <p className="mt-2 text-2xl font-bold leading-[1.3]">{thema.frage}</p>
        </Schritt>

        <Schritt
          label={thema.andi ? "Wir prüfen mit ANDI" : "Wir erkennen"}
          symbol={
            <span className={`${kreis} bg-white box-border`} style={{ border: `2px solid ${F.akzent}`, color: F.akzent }}>
              <Search size={16} strokeWidth={2.5} />
            </span>
          }
        >
          {thema.andi ? (
            /* Auf schmalen Handys untereinander: „Aufmerksamkeit“ in Gilroy passt nicht in eine halbe Spalte */
            <div className="mt-2.5 grid grid-cols-1 min-[480px]:grid-cols-2 gap-x-4 gap-y-2">
              {SAEULEN.map((s) => (
                <div key={s} className="flex items-baseline gap-2.5">
                  <span className="text-[22px] font-black" style={{ color: F.akzent }} aria-hidden="true">{s[0]}</span>
                  <span className="text-[15px] font-semibold">{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-2.5 flex flex-col gap-2">
              {thema.erkennen.map((p) => (
                <li key={p} className="flex gap-2.5 text-[15px] leading-normal">
                  <span className="shrink-0 w-1.5 h-1.5 mt-[9px] rounded-full" style={{ background: F.akzent }} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </Schritt>

        <Schritt
          label="Du gewinnst"
          letzter
          symbol={
            <span className={`${kreis} text-white`} style={{ background: F.text }}>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </span>
          }
        >
          <p className="mt-2 text-lg font-semibold leading-[1.45]">{thema.gewinn}</p>
        </Schritt>
      </ol>
    </div>
  );
}

// Die Frage im Einstieg wechselt alle fünf Sekunden (weiches Ein- und Ausblenden).
// Ohne eigene Wortmarke davor: "andi fragt." steht schon im Kopf (Wunsch 25.10.2026).
function EinstiegsFrage() {
  const [nr, setNr] = useState(0);
  const [sichtbar, setSichtbar] = useState(true);

  useEffect(() => {
    let wechsel;
    const takt = setInterval(() => {
      setSichtbar(false);
      wechsel = setTimeout(() => {
        setNr((n) => (n + 1) % EINSTIEGSFRAGEN.length);
        setSichtbar(true);
      }, 350);
    }, 5000);
    return () => {
      clearInterval(takt);
      clearTimeout(wechsel);
    };
  }, []);

  return (
    <div className="mt-6">
      <p
        className="max-w-[780px] min-h-[3.9em] sm:min-h-[2.6em] text-[clamp(21px,2.5vw,30px)] font-bold leading-[1.3] transition-opacity duration-300"
        style={{ opacity: sichtbar ? 1 : 0 }}
      >
        {EINSTIEGSFRAGEN[nr]}
      </p>
    </div>
  );
}

// Ein Logo im Slider. Alle Logos bekommen dieselbe optische Fläche, damit breite
// Schriftzüge (smaXtec) nicht riesig und quadratische Zeichen (Makava) nicht winzig wirken.
const LOGO_FLAECHE = 4000; // px² je Logo
const LOGO_MAX_B = 150;
const LOGO_MAX_H = 56;

function SliderLogo({ name, datei, kopie }) {
  const [mass, setMass] = useState(null);

  function vermessen(e) {
    const { naturalWidth: b, naturalHeight: h } = e.currentTarget;
    if (!b || !h) return;
    const verhaeltnis = b / h;
    let hoehe = Math.sqrt(LOGO_FLAECHE / verhaeltnis);
    let breite = hoehe * verhaeltnis;
    if (breite > LOGO_MAX_B) { breite = LOGO_MAX_B; hoehe = breite / verhaeltnis; }
    if (hoehe > LOGO_MAX_H) { hoehe = LOGO_MAX_H; breite = hoehe * verhaeltnis; }
    setMass({ breite: Math.round(breite), hoehe: Math.round(hoehe) });
  }

  return (
    <li className="kundenslider-logo">
      <img
        src={LOGO_BASIS + datei}
        alt={kopie ? "" : name}
        title={kopie ? undefined : name}
        decoding="async"
        onLoad={vermessen}
        style={mass ? { width: mass.breite, height: mass.hoehe } : { height: 40, width: "auto" }}
      />
    </li>
  );
}

// Kunden-Slider in ruhigen Einzelschritten (Wunsch 25.10.2026: nicht durchlaufen):
// Die Reihe steht SLIDER_PAUSE ms still und gleitet dann um genau ein Logo nach rechts.
// Drei gleiche Reihen hintereinander; nach einer vollen Runde springt die Spur
// unsichtbar zurück, dadurch läuft es endlos ohne Lücke. Beim Darüberfahren hält er an.
const SLIDER_PAUSE = 2600;
const SLIDER_GLEITEN = 900;

function KundenSlider() {
  const anzahl = KUNDENLOGOS.length;
  const [schritt, setSchritt] = useState(0);
  const [gleitet, setGleitet] = useState(true);
  const [angehalten, setAngehalten] = useState(false);

  // Nächster Schritt nach der Pause
  useEffect(() => {
    if (angehalten) return undefined;
    const t = setTimeout(() => {
      setGleitet(true);
      setSchritt((s) => s + 1);
    }, SLIDER_PAUSE);
    return () => clearTimeout(t);
  }, [schritt, angehalten]);

  // Nach einer vollen Runde ohne Animation an den Anfang zurück (sieht identisch aus)
  useEffect(() => {
    if (schritt < anzahl) return undefined;
    const t = setTimeout(() => {
      setGleitet(false);
      setSchritt(0);
    }, SLIDER_GLEITEN + 60);
    return () => clearTimeout(t);
  }, [schritt, anzahl]);

  const reihe = (kopie, schluessel) => (
    <ul key={schluessel} className="kundenslider-reihe" aria-hidden={kopie ? "true" : undefined}>
      {KUNDENLOGOS.map((l) => (
        <SliderLogo key={l.name} {...l} kopie={kopie} />
      ))}
    </ul>
  );

  return (
    <section aria-label="Kunden von Rittler & Co" className="py-16" style={{ background: F.grau }}>
      <style>{`
        .kundenslider { --platz: 210px; overflow: hidden; background: var(--farbe-grau); -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
        .kundenslider-spur { display: flex; width: max-content; background: var(--farbe-grau); will-change: transform; }
        .kundenslider-reihe { display: flex; align-items: center; margin: 0; padding: 0; list-style: none; }
        .kundenslider-logo { flex: 0 0 var(--platz); width: var(--platz); height: 96px; display: flex; align-items: center; justify-content: center; }
        .kundenslider-logo img { display: block; object-fit: contain; filter: grayscale(1) contrast(1.3); mix-blend-mode: multiply; opacity: .8; transition: filter .4s ease, opacity .4s ease; }
        .kundenslider-logo img:hover { filter: none; opacity: 1; }
        @media (max-width: 640px) { .kundenslider { --platz: 160px; } .kundenslider-logo { height: 80px; } .kundenslider-logo img { transform: scale(.82); } }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Etikett>Kunden, die Rittler &amp; Co vertrauen</Etikett>
      </div>
      <div
        className="kundenslider mt-8"
        onMouseEnter={() => setAngehalten(true)}
        onMouseLeave={() => setAngehalten(false)}
      >
        <div
          className="kundenslider-spur"
          style={{
            transform: `translate3d(calc(var(--platz) * ${schritt - anzahl}), 0, 0)`,
            transition: gleitet ? `transform ${SLIDER_GLEITEN}ms cubic-bezier(.65, 0, .35, 1)` : "none",
          }}
        >
          {reihe(false, "a")}
          {reihe(true, "b")}
          {reihe(true, "c")}
        </div>
      </div>
    </section>
  );
}

function Thema({ thema }) {
  return (
    <section id={thema.id} className="py-[104px] scroll-mt-4" style={{ borderTop: `1px solid ${F.linie}` }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 min-[960px]:grid-cols-2 gap-12 min-[960px]:gap-20 items-center">
        <div className={thema.rechts ? "min-[960px]:order-2" : ""}>
          {/* Große Kontur-Ziffer, angelehnt an die Kontur-Schrift in den Rittler-Angeboten, daneben das runde Foto */}
          <div className="flex items-center gap-7">
            <span
              aria-hidden="true"
              className="block text-[clamp(80px,9vw,112px)] font-black leading-[0.9] tracking-[-0.02em]"
              style={{ color: "transparent", WebkitTextStroke: `2px ${F.akzent}` }}
            >
              {thema.nr}
            </span>
            <span className="relative shrink-0 w-[clamp(150px,18vw,208px)] aspect-square">
              <span aria-hidden="true" className="absolute -inset-2.5 rounded-full" style={{ border: `2px solid ${F.hauchRand}` }} />
              <img
                src={thema.bild}
                alt={thema.alt}
                width="208"
                height="208"
                loading="lazy"
                className="relative block w-full h-full rounded-full object-cover"
              />
            </span>
          </div>
          <Etikett className="mt-6">{thema.kurz}</Etikett>
          <h2 className={`mt-3 ${H2}`}>
            {thema.h2} <span style={{ color: F.akzent }}>{thema.akzent}</span>
          </h2>
          {thema.absaetze.map((a) => (
            <p key={a} className="mt-5 text-lg leading-[1.65]" style={{ color: F.daempft }}>{a}</p>
          ))}
          <div className="mt-8">
            <Hauptknopf href={mailAn(thema.betreff)}>{thema.knopf}</Hauptknopf>
          </div>
          <p className="mt-5 text-[15px]">
            <Link to={thema.pfad} className="group inline-flex items-center gap-1.5 min-h-[44px] font-semibold hover:underline" style={{ color: F.text }}>
              Alles zum Modul {thema.kurz}
              <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
          {thema.andi && (
            <p className="mt-6 text-sm" style={{ color: F.daempft }}>
              Mehr zum Markenprüfstand auf{" "}
              <a href={MARKENPRUEFSTAND} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline whitespace-nowrap" style={{ color: F.link }}>
                werbe-agentur-graz.at
              </a>
            </p>
          )}
        </div>
        <Denkweg thema={thema} />
      </div>
    </section>
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
      setFehler("Das sieht nicht nach einem Interview-Code aus. Am einfachsten öffnest du den Link aus deiner Einladung.");
      return;
    }
    navigate(`/i/${gefunden}`);
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      {/* Kopf */}
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#top" className="leading-none" aria-label="andi fragt. Zur Startseite">
          <Wortmarke />
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#eingeladen" className="hidden sm:inline font-medium hover:underline">Ich wurde eingeladen</a>
          <Link to="/ueber-uns" className="hidden sm:inline font-medium hover:underline">Über uns</Link>
          <Link
            to="/kontakt"
            className="inline-flex items-center min-h-[44px] px-4 rounded font-semibold text-white"
            style={{ background: F.text }}
          >
            Kontakt
          </Link>
        </nav>
      </header>

      <main id="top">
        {/* Einstieg */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">
          <Etikett>Die ANDI-Methode von Rittler &amp; Co</Etikett>
          <EinstiegsFrage />
          <h1 className="mt-4 max-w-[960px] text-[clamp(40px,6vw,76px)] font-black uppercase leading-[0.98]">
            Die Antwort steckt <span style={{ color: F.akzent }}>im Unternehmen.</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-xl leading-[1.6]" style={{ color: F.daempft }}>
            Wer täglich mit deinen Kunden arbeitet, weiß oft am besten, warum sie bei dir bleiben. Mit digitalen
            Interviews holt <strong className="font-semibold" style={{ color: F.text }}>andi fragt.</strong> dieses
            Wissen anonym ab: bei Führung, Team, Vertrieb und Kunden. Klarheit statt Bauchgefühl.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Hauptknopf href={mailAn("andi fragt. Termin vereinbaren")}>Termin vereinbaren</Hauptknopf>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded text-sm font-semibold"
              style={{ border: "1px solid var(--farbe-linie-kraeftig)" }}
            >
              So läuft es ab
            </a>
          </div>
          <p className="mt-4 text-[15px]" style={{ color: F.daempft }}>
            Lieber gleich reden? Ruf an:{" "}
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="font-semibold hover:underline whitespace-nowrap" style={{ color: F.text }}>
              {KONTAKT_TEL}
            </a>
          </p>

          {/* Vertrauen auf einen Blick */}
          <dl className="mt-12 grid gap-x-8 gap-y-6 grid-cols-2 lg:grid-cols-4 pt-8" style={{ borderTop: `1px solid ${F.linie}` }}>
            {FAKTEN.map(({ zahl, text }) => (
              <div key={zahl}>
                <dt className="text-[clamp(22px,2.4vw,30px)] font-black leading-tight" style={{ color: F.akzent }}>{zahl}</dt>
                <dd className="mt-1 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</dd>
              </div>
            ))}
          </dl>

          {/* Die vier Module auf einen Blick */}
          <nav aria-label="Die vier Module" className="mt-[72px] grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
            {THEMEN.map(({ id, nr, icon: Icon, kurz, versprechen }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex flex-col p-6 rounded-lg border border-transparent transition-colors hover:border-[color:var(--farbe-akzent)]"
                style={{ background: F.grau }}
              >
                <span className="flex items-center justify-between">
                  <Icon {...ICON} />
                  <span className="text-sm font-semibold" style={{ color: F.daempft }}>{nr}</span>
                </span>
                <span className="mt-5 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.etikett }}>{kurz}</span>
                <span className="mt-2 text-xl font-bold leading-[1.3]">{versprechen}</span>
                {/* mt-auto: „Mehr dazu“ steht in allen Kacheln auf einer Linie */}
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Mehr dazu <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </nav>
        </section>

        <KundenSlider />

        {THEMEN.map((t) => (
          <Thema key={t.id} thema={t} />
        ))}

        {/* Ablauf */}
        <section id="ablauf" className="py-24 scroll-mt-4" style={{ background: F.grau }}>
          <div className="max-w-6xl mx-auto px-6">
            <Etikett>Ablauf</Etikett>
            <h2 className={`mt-3 ${H2}`}>
              In 4 Schritten vom Interview <span style={{ color: F.akzent }}>zur Wirkung.</span>
            </h2>
            <ol className="mt-10 grid gap-10 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
              {SCHRITTE.map(({ verb, titel, text }) => (
                <li key={titel}>
                  {/* Wortmarken-Familie statt der handgeschriebenen Signets */}
                  <p><Wortmarke verb={verb} groesse={34} /></p>
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-[1.65]" style={{ color: F.daempft }}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Versprechen an alle, die wir interviewen */}
        <section className="py-20 text-white" style={{ background: F.text }}>
          <div className="max-w-6xl mx-auto px-6">
            <Etikett dunkel>Für alle, die wir interviewen</Etikett>
            <h2 className={`mt-3 ${H2}`}>Ehrliche Antworten brauchen Vertrauen</h2>
            <p className="mt-5 max-w-[720px] text-lg leading-[1.65]" style={{ color: "#d4d4d4" }}>
              Die wichtigste Frage vorab: Sagen deine Leute auch die Wahrheit? Ja, wenn sie sicher sein können,
              dass niemand erfährt, wer was gesagt hat. Darum gilt für alle, die wir interviewen:
            </p>
            <div className="mt-10 grid gap-8 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
              {VERSPRECHEN.map(({ icon: Icon, titel, text }) => (
                <div key={titel}>
                  <Icon {...ICON} />
                  <h3 className="mt-4 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-[1.65]" style={{ color: "#d4d4d4" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Häufige Fragen */}
        <Faq seite="startseite" look="weiss" />

        {/* Eingeladene */}
        <section id="eingeladen" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-4">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">Du wurdest zu einem Interview eingeladen?</h2>
            <p className="mt-3 leading-[1.65]" style={{ color: F.daempft }}>
              Öffne am besten den Link aus deiner Einladung oder scanne den QR-Code. Hast du nur den Code, gib ihn hier ein.
            </p>
            <form onSubmit={zurBefragung} className="mt-6 flex flex-wrap gap-3" noValidate>
              <label htmlFor="interviewcode" className="sr-only">Interview-Code oder Link</label>
              <input
                id="interviewcode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFehler("");
                }}
                placeholder="Code oder Link einfügen"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-[1_1_260px] min-w-0 h-12 rounded px-4 text-base outline-none focus:ring-2"
                style={{ border: "1px solid #8a8a8a", fontFamily: "inherit" }}
                aria-invalid={!!fehler}
                aria-describedby={fehler ? "code-fehler" : undefined}
              />
              <button
                type="submit"
                className="h-12 inline-flex items-center justify-center gap-2 rounded px-5 font-semibold"
                style={{ background: F.gut, color: F.text, fontFamily: "inherit" }}
              >
                Zum Interview <ArrowRight size={16} aria-hidden="true" />
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
      <footer style={{ borderTop: `1px solid ${F.linie}` }}>
        <div
          className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between text-sm"
          style={{ color: F.daempft }}
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <strong className="font-semibold" style={{ color: F.text }}>Rittler &amp; Co GmbH</strong>
            <span>Peter-Rosegger-Straße 27, 8053 Graz</span>
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="hover:underline">{KONTAKT_TEL}</a>
            <a href={`mailto:${KONTAKT_MAIL}`} className="hover:underline">{KONTAKT_MAIL}</a>
          </div>
          <div className="flex gap-5">
            <Link to="/ueber-uns" className="hover:underline">Über uns</Link>
            <Link to="/kontakt" className="hover:underline">Kontakt</Link>
            <a href={IMPRESSUM} target="_blank" rel="noopener noreferrer" className="hover:underline">Impressum</a>
            <a href={DATENSCHUTZ} target="_blank" rel="noopener noreferrer" className="hover:underline">Datenschutz</a>
            {/* Bewusst kein Link zur Verwaltung: Zugang nur über andifragt.at/verwaltung (Wunsch 22.10.2026) */}
          </div>
        </div>
      </footer>
    </div>
  );
}