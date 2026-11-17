import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Search, Eye, Users, Heart, TrendingUp,
  Lock, Smartphone, MessageCircle, Pencil,
} from "lucide-react";
import { Wortmarke, anfrageLinkEn, Kopf, Fuss } from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";
import KundenSlider from "@/components/oeffentlich/KundenSlider";

// English home page under /en (17.11.2026), adapted from src/pages/Startseite.jsx.
// Same structure and design as the German page; copy written for an international
// business audience in British English.
//
// Rules: always "interview", never "survey" for our own offer. Anonymity is never promised
// in absolute terms (project rule): "you see no names", groups under 6 are merged.
// Typography: Gilroy has no dashes, curly quotes, middle dots or ellipses.
// The wordmark family andi fragt. / weiss. / macht. / zeigt. stays German; a short English
// gloss sits underneath so international readers understand it.

const KONTAKT_TEL = "+43 316 570 117";
const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

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

const mailAn = anfrageLinkEn;

const THEMEN = [
  {
    id: "positionierung",
    nr: "01",
    icon: Eye,
    kurz: "Positioning",
    pfad: "/en/positioning",
    bild: "/bilder/positionierung.webp",
    alt: "Consultant talking with a client in the client's workshop",
    versprechen: "Visible to your customers.",
    h2: "We ask the questions so your customers",
    akzent: "see you clearly.",
    absaetze: [
      "Many companies are better than the way they present themselves. The reasons customers really buy from you are often known to your team. They are not in any brochure or on any website.",
      "We bring these strengths to the surface, test them with the ANDI method and turn them into a positioning your customers recognise from the outside. That is how a good company becomes a visible brand.",
    ],
    knopf: "Request a brand check",
    betreff: "andi fragt. Positionierung",
    wen: ["Leadership", "Team", "Customers"],
    frage: "Why do customers really buy from us and not from a competitor?",
    andi: true,
    gewinn: "A positioning with core messages your customers recognise instantly.",
    rechts: false,
  },
  {
    id: "team",
    nr: "02",
    icon: Users,
    kurz: "Team",
    pfad: "/en/team",
    bild: "/bilder/team.webp",
    alt: "Team laughing together during a coffee break",
    versprechen: "The good ones stay, better ones join.",
    h2: "So the good ones stay and",
    akzent: "better ones join.",
    absaetze: [
      "Good people stay when they know what they are working for and when someone listens. The confidential team interview shows what keeps your team, what holds it back and what it wishes for.",
      "The result is an employer brand that rings true: your team recognises itself in it, and strong applicants can see why it is worth joining you.",
    ],
    knopf: "Request a team interview",
    betreff: "andi fragt. Team-Interview",
    wen: ["Employees", "Managers", "Every department"],
    frage: "What keeps you here, even on the difficult days?",
    erkennen: [
      "Mood and satisfaction, including by department",
      "What keeps your team and what holds it back",
      "How well goals and values come through in everyday work",
    ],
    gewinn: "A credible employer brand that keeps good people and attracts the right ones.",
    rechts: true,
  },
  {
    id: "kunden",
    nr: "03",
    icon: Heart,
    kurz: "Customers",
    pfad: "/en/customers",
    bild: "/bilder/kunden.webp",
    alt: "Customer talking with staff at the reception desk",
    versprechen: "More success than you think.",
    h2: "Your customers can contribute more to your success",
    akzent: "than you think.",
    absaetze: [
      "Customers rarely volunteer why they buy from you, what almost drove them to a competitor or what else they would like. Ask them, and they are happy to tell you.",
      "The customer interview delivers the outside view that everyday business lacks. Set against the views of leadership and team, it shows where your self-image and your customers' picture part ways, and where your biggest opportunities lie.",
    ],
    knopf: "Request a customer interview",
    betreff: "andi fragt. Kunden-Interview",
    wen: ["Regular customers", "New customers", "Partners"],
    frage: "What would have to happen for you to recommend us without hesitation?",
    erkennen: [
      "Why customers stay and when they would switch",
      "Which services they value and which they miss",
      "Where your self-image and their view part ways",
    ],
    gewinn: "Services and messages that land exactly where your customers make their decisions.",
    rechts: false,
  },
  {
    id: "vertrieb",
    nr: "04",
    icon: TrendingUp,
    kurz: "Sales",
    pfad: "/en/sales",
    bild: "/bilder/vertrieb.webp",
    alt: "Field sales representative with a headset in the car",
    versprechen: "Sell what actually lands.",
    h2: "Before you restructure sales, ask the people",
    akzent: "who sell.",
    absaetze: [
      "A new sales idea often sounds better in the meeting room than out in the field. Field sales, inside sales and customers know best where deals succeed and where they stall.",
      "The sales interview captures this knowledge before you invest. So you build on what works, and your team gets behind it because they were asked.",
    ],
    knopf: "Request a sales interview",
    betreff: "andi fragt. Vertriebs-Interview",
    wen: ["Field sales", "Inside sales", "Customers"],
    frage: "Which argument makes customers nod, and which one makes them switch off?",
    erkennen: [
      "Where deals succeed and where they stall",
      "Which arguments really land with customers",
      "How field sales, inside sales and customers work together",
    ],
    gewinn: "A sales approach built on what lands with customers, and a team that pulls together.",
    rechts: true,
  },
];

// The four letters of the ANDI method (German: Aufmerksamkeit, Nutzen, Differenzierung, Identitaet)
const SAEULEN = ["Attention", "Need", "Differentiation", "Identity"];

const EINSTIEGSFRAGEN = [
  "Why do your customers really buy from you and not from a competitor?",
  "What actually keeps your best people with you?",
  "What would have to happen for your customers to recommend you without hesitation?",
  "Which argument makes your customers nod, and which one makes them switch off?",
];

const FAKTEN = [
  { zahl: "500+", text: "brand projects behind the method" },
  { zahl: "20+ years", text: "Rittler & Co, agency in Graz, Austria" },
  { zahl: "about 2 hrs", text: "of your own time" },
  { zahl: "No names", text: "in any result you see" },
];

const SCHRITTE = [
  {
    verb: "fragt",
    gloss: "andi asks.",
    titel: "Interviews",
    text: "Leadership, team, sales and, if you wish, your customers answer the interviews online: without names, on a phone or computer, whenever it suits them. Your own effort: about two hours.",
  },
  {
    verb: "weiß",
    gloss: "andi knows.",
    titel: "Analysis",
    text: "We condense all answers using the ANDI method, developed from more than 500 brand projects. We don't look for the average, we look for the deviations.",
  },
  {
    verb: "macht",
    gloss: "andi makes it clear.",
    titel: "Clarity and essence",
    text: "The real strengths of your company become visible: honest, measurable, to the point. With clear recommendations instead of empty phrases.",
  },
  {
    verb: "zeigt",
    gloss: "andi shows.",
    titel: "Communication",
    text: "We present the results to you in person. The essence becomes clear messages for customers, team, sales and applicants.",
  },
];

const VERSPRECHEN = [
  { icon: Lock, titel: "Confidential", text: "You see no names. Results only appear once a minimum number of people have taken part." },
  { icon: Smartphone, titel: "Any place, any time", text: "On a phone or computer, whenever it suits. Pausing and picking up later works at any point." },
  { icon: MessageCircle, titel: "Questions everyone understands", text: "Clearly worded, free of jargon and leading questions. So everyone answers honestly, from apprentice to managing director." },
  { icon: Pencil, titel: "Room for their own words", text: "Besides quick ratings there are open questions. That is often where the most valuable answer lies." },
];

const ICON = { size: 28, strokeWidth: 1.5, style: { color: F.akzent }, "aria-hidden": "true" };

function codeAuslesen(eingabe) {
  const roh = String(eingabe || "").trim();
  const treffer = roh.match(/\/i\/([A-Za-z0-9_-]+)/);
  const code = treffer ? treffer[1] : roh;
  return /^[A-Za-z0-9_-]{8,64}$/.test(code) ? code : null;
}

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
      <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.daempft }}>Who we ask</p>
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
          label="We ask"
          symbol={<span className={`${kreis} text-white text-lg font-black`} style={{ background: F.akzent }}>?</span>}
        >
          <p className="mt-2 text-2xl font-bold leading-[1.3]">{thema.frage}</p>
        </Schritt>

        <Schritt
          label={thema.andi ? "We test with ANDI" : "We find out"}
          symbol={
            <span className={`${kreis} bg-white box-border`} style={{ border: `2px solid ${F.akzent}`, color: F.akzent }}>
              <Search size={16} strokeWidth={2.5} />
            </span>
          }
        >
          {thema.andi ? (
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
          label="You gain"
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

function Thema({ thema }) {
  return (
    <section id={thema.id} className="py-[104px] scroll-mt-4" style={{ borderTop: `1px solid ${F.linie}` }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 min-[960px]:grid-cols-2 gap-12 min-[960px]:gap-20 items-center">
        <div className={thema.rechts ? "min-[960px]:order-2" : ""}>
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
              All about the {thema.kurz} module
              <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
          {thema.andi && (
            <p className="mt-6 text-sm" style={{ color: F.daempft }}>
              More about the brand check (in German) at{" "}
              <a href={MARKENPRUEFSTAND} hrefLang="de" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline whitespace-nowrap" style={{ color: F.link }}>
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

export default function StartseiteEn() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fehler, setFehler] = useState("");

  useEffect(() => {
    const vorher = document.title;
    document.title = "The right questions for your company | andi fragt.";
    return () => {
      document.title = vorher;
    };
  }, []);

  function zurBefragung(e) {
    e.preventDefault();
    const gefunden = codeAuslesen(code);
    if (!gefunden) {
      setFehler("That doesn't look like an interview code. The easiest way is to open the link in your invitation.");
      return;
    }
    navigate(`/i/${gefunden}`);
  }

  return (
    <div className="min-h-screen bg-white" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      <Kopf
        randUnten={false}
        extra={
          <a
            href="#eingeladen"
            className="inline-flex items-center min-h-[44px] text-[13px] font-medium hover:underline"
            style={{ color: F.daempft, textDecoration: "none" }}
          >
            Invited?
          </a>
        }
      />

      <main id="top">
        {/* Opening */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-16">
          <Etikett>The ANDI method by Rittler &amp; Co</Etikett>
          <EinstiegsFrage />
          <h1 className="mt-4 max-w-[960px] text-[clamp(40px,6vw,76px)] font-black uppercase leading-[0.98]">
            The answer is already <span style={{ color: F.akzent }}>inside your company.</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-xl leading-[1.6]" style={{ color: F.daempft }}>
            Your team and your customers have known it for a long time. It just rarely gets said out loud inside the company.
            Together with you, <strong className="font-semibold" style={{ color: F.text }}>andi fragt.</strong> develops the
            right questions and turns the answers into decisions and messages. Knowledge instead of gut feeling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Hauptknopf href={mailAn("andi fragt. Termin vereinbaren")}>Book a call</Hauptknopf>
            <a
              href="#ablauf"
              className="inline-flex items-center justify-center min-h-[48px] px-6 rounded text-sm font-semibold"
              style={{ border: "1px solid var(--farbe-linie-kraeftig)" }}
            >
              How it works
            </a>
          </div>
          <p className="mt-4 text-[15px]" style={{ color: F.daempft }}>
            Rather talk right away? Call us:{" "}
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="font-semibold hover:underline whitespace-nowrap" style={{ color: F.text }}>
              {KONTAKT_TEL}
            </a>
          </p>

          <dl className="mt-12 grid gap-x-8 gap-y-6 grid-cols-2 lg:grid-cols-4 pt-8" style={{ borderTop: `1px solid ${F.linie}` }}>
            {FAKTEN.map(({ zahl, text }) => (
              <div key={zahl}>
                <dt className="text-[clamp(22px,2.4vw,30px)] font-black leading-tight" style={{ color: F.akzent }}>{zahl}</dt>
                <dd className="mt-1 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</dd>
              </div>
            ))}
          </dl>

          <nav aria-label="The four modules" className="mt-[72px] grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
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
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Learn more <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </nav>
        </section>

        <KundenSlider />

        {THEMEN.map((t) => (
          <Thema key={t.id} thema={t} />
        ))}

        {/* Process */}
        <section id="ablauf" className="py-24 scroll-mt-4" style={{ background: F.grau }}>
          <div className="max-w-6xl mx-auto px-6">
            <Etikett>How it works</Etikett>
            <h2 className={`mt-3 ${H2}`}>
              From interview to impact <span style={{ color: F.akzent }}>in 4 steps.</span>
            </h2>
            <ol className="mt-10 grid gap-10 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
              {SCHRITTE.map(({ verb, gloss, titel, text }) => (
                <li key={titel}>
                  <p><Wortmarke verb={verb} groesse={34} /></p>
                  <p className="mt-1.5 text-[13px] font-medium" style={{ color: F.daempft }}>{gloss}</p>
                  <h3 className="mt-3 text-lg font-bold">{titel}</h3>
                  <p className="mt-2 leading-[1.65]" style={{ color: F.daempft }}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Promise to everyone we interview */}
        <section className="py-20 text-white" style={{ background: F.text }}>
          <div className="max-w-6xl mx-auto px-6">
            <Etikett dunkel>For everyone we interview</Etikett>
            <h2 className={`mt-3 ${H2}`}>Honest answers need trust</h2>
            <p className="mt-5 max-w-[720px] text-lg leading-[1.65]" style={{ color: "#d4d4d4" }}>
              The key question first: will your people tell the truth? Yes, if they can be sure their answers are
              never tied to their name. That is why, for everyone we interview:
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

        <Faq seite="startseite" look="weiss" />

        {/* Invited participants */}
        <section id="eingeladen" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-4">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">Have you been invited to an interview?</h2>
            <p className="mt-3 leading-[1.65]" style={{ color: F.daempft }}>
              The easiest way is to open the link in your invitation or scan the QR code. If you only have the code, enter it here.
            </p>
            <form onSubmit={zurBefragung} className="mt-6 flex flex-wrap gap-3" noValidate>
              <label htmlFor="interviewcode" className="sr-only">Interview code or link</label>
              <input
                id="interviewcode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFehler("");
                }}
                placeholder="Paste your code or link"
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
                Go to interview <ArrowRight size={16} aria-hidden="true" />
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

      <Fuss />
    </div>
  );
}
