import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Phone } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, IMPRESSUM, KONTAKT_TEL, LEAD_STIL, Modulseite, Portraet, TEAM,
  TEXT_STIL, anfrageLink,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";
import KundenSlider from "@/components/oeffentlich/KundenSlider";
import Zaehler from "@/components/oeffentlich/Zaehler";

// Öffentliche Seite „Über uns“ von andifragt.at, neu aufgebaut am 01.11.2026 (Prototyp UeberUnsNeu).
//
// Zweck: Wer noch zögert, soll schnell sehen, wer hinter andi fragt. steht, wie gearbeitet wird
// und was mit den Antworten passiert. Deshalb: kurze Antworten zuerst, das Team mit Gesicht,
// der Ablauf in Schritten, der Schutz der Antworten zum Ausprobieren, Zusagen als Karten.
// Das Tool selbst wird nicht gezeigt oder beschrieben.
//
// Typografie: Gilroy hat keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte.
// Sprachregel: Auf den öffentlichen Seiten heißt es immer Interview, nie Befragung.
// Anonymität nie absolut versprechen: beschrieben wird, was der Auftraggeber sieht und was nicht.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const SPRUNG = [
  { ziel: "#wer", text: "Wer dahinter steht" },
  { ziel: "#team", text: "Das Team" },
  { ziel: "#ablauf", text: "So arbeiten wir" },
  { ziel: "#schutz", text: "Was mit Antworten passiert" },
  { ziel: "#zusagen", text: "Unsere Zusagen" },
  { ziel: "#fragen", text: "Fragen" },
];

const STECKBRIEF = [
  { titel: "Anbieter", wert: "Rittler & Co GmbH, Werbeagentur" },
  { titel: "Sitz", wert: "Peter-Rosegger-Straße 27, 8053 Graz" },
  { titel: "Erfahrung", wert: "über 20 Jahre, über 500 Markenprojekte" },
  { titel: "Ansprechpartner", wert: "Alfons Rittler" },
];

const KURZ = [
  {
    frage: "Wer steckt dahinter?",
    antwort: "Eine Werbeagentur aus Graz mit über 20 Jahren Erfahrung. Kein anonymes Tool, sondern drei Menschen mit Namen, Gesicht und Telefonnummer.",
    mehr: "Das Team kennenlernen",
    ziel: "#team",
  },
  {
    frage: "Was passiert mit den Antworten?",
    antwort: "Du siehst nur gebündelte Ergebnisse, erst ab einer Mindestzahl an Interviews je Gruppe. Einzelne Antworten bekommst du nicht zu sehen.",
    mehr: "Die Regeln im Detail",
    ziel: "#schutz",
  },
  {
    frage: "Was, wenn es nicht passt?",
    antwort: "Dann sagen wir es dir im Erstgespräch offen. Das Gespräch ist kostenlos, und vor dem Start bekommst du einen Fixpreis.",
    mehr: "Unsere Zusagen",
    ziel: "#zusagen",
  },
];

const FAKTEN = [
  { zahl: "über 20 Jahre", text: "Rittler & Co, Werbeagentur in Graz" },
  { zahl: "über 500", text: "Markenprojekte als Grundlage der Methode" },
  { zahl: "3 Menschen", text: "hinter andi fragt., mit Namen und Gesicht" },
];

const SCHRITTE = [
  { nr: "0", wann: "Vor dem Start", titel: "Erstgespräch und Zielgespräch", text: "Wir klären, wo es hakt, welche Annahmen geprüft werden müssen und welche Gruppen wir fragen. Danach bekommst du ein Angebot mit Fixpreis." },
  { nr: "1", wann: "andi fragt.", titel: "Digitale Interviews", text: "Führung, Team, Vertrieb und auf Wunsch deine Kunden antworten online, am Handy oder am Computer, wann es passt. Jede Gruppe bekommt ihr eigenes Interview." },
  { nr: "2", wann: "andi weiß.", titel: "Analyse und Auswertung", text: "Wir verdichten alle Antworten mit der ANDI-Methode. Wir suchen nicht den Durchschnitt, sondern die Abweichung, weil sie zeigt, wo eine Entscheidung anders ausfallen muss." },
  { nr: "3", wann: "andi macht.", titel: "Klarheit und Essenz", text: "Aus der Analyse werden wenige klare Sätze und Empfehlungen. Keine Datenberge, sondern das, was du entscheiden musst." },
  { nr: "4", wann: "andi zeigt.", titel: "Persönliche Präsentation", text: "Wir präsentieren dir die Ergebnisse persönlich. Aus der Essenz werden Botschaften für Kunden, Team, Vertrieb und Bewerbende." },
];

const ZEITPLAN = [
  { wann: "Woche 1", was: "Die Interviews laufen" },
  { wann: "Woche 4", was: "Die Muster werden sichtbar" },
  { wann: "Woche 6", was: "Präsentation bei dir" },
];

const REGELN = [
  "Ergebnisse gibt es nur gebündelt und erst ab einer Mindestzahl an Interviews je Gruppe.",
  "Kleine Bereiche fassen wir zusammen.",
  "Du bekommst keine Namen und keine einzelnen Antworten. Auch nicht auf Nachfrage.",
  "Die Teilnahme ist für alle Eingeladenen freiwillig und kostenlos.",
];

const ZUSAGEN = [
  { titel: "Rückmeldung in 24 Stunden", text: "Auf jede Anfrage melden wir uns innerhalb von 24 Stunden, mit Terminvorschlägen für das Erstgespräch." },
  { titel: "Ein offenes Erstgespräch", text: "Kostenlos, rund 30 Minuten. Wenn ein Interview dir nicht weiterhilft, sagen wir es dir." },
  { titel: "Ein Fixpreis vor dem Start", text: "Nach dem Zielgespräch bekommst du ein Angebot mit festem Preis, bevor das erste Interview läuft." },
  { titel: "Schutz für alle, die antworten", text: "Gebündelte Ergebnisse ab einer Mindestzahl. Diese Regel gilt auch für dich als Auftraggeber." },
  { titel: "Menschen lesen jede Antwort", text: "Keine automatische Auswertung, die du dir selbst zusammenreimen musst. Die Schlüsse ziehen unsere Strategen." },
  { titel: "Persönliche Präsentation", text: "Die Ergebnisse präsentieren wir dir selbst, mit klaren Empfehlungen für die nächsten Schritte." },
];

const ANLAESSE = ["Neuer Auftritt", "Gute Leute halten und gewinnen", "Vertrieb neu ausrichten", "Übergabe an die nächste Generation"];
const AM_TISCH = ["Geschäftsführung und Inhaberschaft", "Personalverantwortliche", "Marketingverantwortliche", "Vertriebsleitung"];

const MODULKURZ = [
  { name: "Positionierung", pfad: "/positionierung", text: "Warum Kunden wirklich kaufen." },
  { name: "Team", pfad: "/team", text: "Was das Team hält und was es bremst." },
  { name: "Kunden", pfad: "/kunden", text: "Die Außensicht, die im Alltag fehlt." },
  { name: "Vertrieb", pfad: "/vertrieb", text: "Was beim Kunden ankommt." },
];

const ABSATZ = { ...TEXT_STIL, lineHeight: 1.7, color: F.daempft };
const H3 = "mt-8 text-[21px] font-bold leading-[1.3]";
const CHIP = "inline-flex items-center min-h-[36px] px-3.5 rounded-full text-[15px] font-semibold";

export default function UeberUns() {
  return (
    <Modulseite titel="Über uns: Rittler & Co, Graz | andi fragt." modul="Über uns">
      {/* Einstieg: wer hier fragt, auf einen Blick */}
      <section className={`${BREITE} pt-12 pb-[72px] flex flex-wrap items-start gap-x-[72px] gap-y-12`}>
        <div className="flex-[1_1_520px] min-w-0">
          <Etikett>Über uns</Etikett>
          <h1 className="mt-4" style={H1_STIL}>
            Wer hier fragt, <span style={{ color: F.akzent }}>sollst du kennen.</span>
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
            Bevor du uns dein Team, deine Kunden oder deinen Vertrieb anvertraust, willst du wissen, mit wem du es zu
            tun hast. Auf dieser Seite steht es: wer wir sind, wie wir arbeiten und was mit den Antworten passiert.
          </p>
          <nav aria-label="Auf dieser Seite" className="mt-7 flex flex-wrap gap-2">
            {SPRUNG.map(({ ziel, text }) => (
              <a key={ziel} href={ziel} className="inline-flex items-center min-h-[40px] px-4 rounded-full text-[15px] font-semibold transition-colors hover:bg-[#ffe4ea]" style={{ background: F.grau, color: F.text }}>
                {text}
              </a>
            ))}
          </nav>
        </div>

        <aside aria-label="Auf einen Blick" className="flex-[1_1_340px] min-w-0 p-7 rounded-3xl bg-white" style={{ border: `1px solid ${F.linie}`, boxShadow: "0 30px 60px -40px rgba(45,45,45,0.4)" }}>
          <Etikett>Auf einen Blick</Etikett>
          <dl className="mt-[18px] flex flex-col gap-3.5">
            {STECKBRIEF.map(({ titel, wert }) => (
              <div key={titel} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
                <dt className="text-sm" style={{ color: F.daempft }}>{titel}</dt>
                <dd className="font-bold">{wert}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
              <dt className="text-sm" style={{ color: F.daempft }}>Telefon</dt>
              <dd><a href={TEL_LINK} className="font-bold hover:underline whitespace-nowrap" style={{ color: F.text }}>{KONTAKT_TEL}</a></dd>
            </div>
          </dl>
          <a href={IMPRESSUM} rel="nofollow noopener" className="inline-flex items-center min-h-[40px] mt-2.5 text-sm font-semibold underline" style={{ color: F.daempft }}>
            Zum Impressum
          </a>
        </aside>
      </section>

      {/* Drei Fragen, die man sich jetzt stellt */}
      <section style={{ background: F.grau }}>
        <div className={`${BREITE} py-[72px]`}>
          <Etikett>Kurz beantwortet</Etikett>
          <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>
            Drei Fragen, <span style={{ color: F.akzent }}>die du dir vielleicht gerade stellst.</span>
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

      {/* Wer dahinter steht */}
      <section id="wer" className={`${BREITE} pt-24 pb-14 scroll-mt-4 flex flex-wrap items-start gap-x-20 gap-y-12`}>
        <div className="flex-[1_1_560px] min-w-0 max-w-[680px]">
          <Etikett>Wer dahinter steht</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Eine Werbeagentur, <span style={{ color: F.akzent }}>die zuerst zuhört.</span>
          </h2>

          <h3 className={H3}>Rittler &amp; Co aus Graz</h3>
          <p className="mt-3" style={ABSATZ}>
            Hinter andi fragt. steht die Rittler &amp; Co GmbH, eine Werbeagentur in der Peter-Rosegger-Straße 27 in
            Graz. Seit über 20 Jahren begleiten wir Unternehmen bei Marke, Positionierung und Auftritt.
          </p>

          <h3 className={H3}>Warum eine Werbeagentur Interviews führt</h3>
          <p className="mt-3" style={ABSATZ}>
            In über 500 Markenprojekten haben wir immer wieder dasselbe erlebt: Die besten Antworten stecken schon im
            Unternehmen. Im Kopf der Geschäftsführung, im Alltag des Teams, im Gespräch des Vertriebs und in der Sicht
            der Kunden. Ausgesprochen werden sie selten, weil niemand die richtigen Fragen stellt.
          </p>
          <p className="mt-3" style={ABSATZ}>
            Ein Marktforschungsinstitut beantwortet die Fragen, die man ihm stellt. Wir setzen einen Schritt früher an
            und klären mit dir, welche Fragen dein Unternehmen weiterbringen. Und weil wir seit Jahren Marken bauen,
            setzen wir auf Wunsch gleich um, was aus den Antworten folgt: die Botschaft, die Stellenanzeige, das
            Verkaufsargument.
          </p>

          <h3 className={H3}>Menschen lesen, keine Software</h3>
          <p className="mt-3" style={ABSATZ}>
            Technik hilft beim Sammeln und Ordnen. Gelesen und eingeordnet wird jede Antwort von Menschen. Eine Software
            zählt, wie oft etwas gesagt wird. Wir suchen den einen Satz, der eine Entscheidung trägt, auch wenn er nur
            dreimal vorkommt.
          </p>
        </div>

        <dl className="flex-[1_1_320px] min-w-0 p-7 rounded-3xl flex flex-col gap-[22px]" style={{ background: F.grau }}>
          {FAKTEN.map(({ zahl, text }) => (
            <div key={zahl}>
              <dt className="text-[clamp(26px,2.6vw,34px)] font-black leading-tight" style={{ color: F.akzent }}>{zahl}</dt>
              <dd className="mt-1 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Das Team hinter andi fragt. */}
      <section id="team" className={`${BREITE} pt-10 pb-[72px] scroll-mt-4`}>
        <Etikett>Das Team hinter andi fragt.</Etikett>
        <h2 className="mt-3 max-w-[900px]" style={H2_STIL}>
          Drei Menschen. <span style={{ color: F.akzent }}>Mit Namen und Gesicht.</span>
        </h2>
        <p className="mt-3 max-w-[720px]" style={ABSATZ}>
          Keine Hotline und kein anonymes System. Hier siehst du, wer bei andi fragt. für dich arbeitet und wen du
          anrufen kannst.
        </p>
        <ul className="mt-10 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {TEAM.map((p) => (
            <li key={p.id} className="flex flex-col items-start px-7 py-8 rounded-3xl" style={{ background: F.grau }}>
              <Portraet person={p} gross className="w-[168px] h-[168px]" style={{ boxShadow: `0 0 0 6px #ffffff, 0 0 0 8px ${F.hauchRand}` }} />
              <h3 className="mt-7 text-[22px] font-bold leading-[1.25]">{p.name}</h3>
              <p className="mt-1" style={{ color: F.daempft }}>{p.rolle}</p>
              <p className="mt-[18px] text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: F.etikett }}>Bei andi fragt.</p>
              <p className="mt-1.5 text-[17px] leading-[1.6]">{p.aufgabe}</p>
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

      {/* Kunden der Agentur */}
      <KundenSlider titel="Unternehmen, für die Rittler & Co gearbeitet hat" hintergrund="#ffffff" />

      {/* So arbeiten wir */}
      <section id="ablauf" className="scroll-mt-4" style={{ background: F.grau }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-start gap-x-20 gap-y-12`}>
          <div className="flex-[1_1_560px] min-w-0">
            <Etikett>So arbeiten wir</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Vom ersten Gespräch <span style={{ color: F.akzent }}>bis zur Entscheidung.</span>
            </h2>
            <p className="mt-3 max-w-[640px]" style={ABSATZ}>
              Jedes Projekt läuft in denselben fünf Schritten. Du weißt vorher, was passiert, wer beteiligt ist und was
              es kostet.
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
              <p className="text-[19px] font-bold">Wie lange dauert das?</p>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>Beim Modul Team zum Beispiel:</p>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {ZEITPLAN.map(({ wann, was }) => (
                  <li key={wann} className="flex gap-3.5">
                    <strong className="shrink-0 w-24 font-bold">{wann}</strong>
                    <span style={{ color: F.daempft }}>{was}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] leading-normal" style={{ color: F.daempft }}>Beispielhafter Ablauf. Dein Zeitplan steht im Angebot.</p>
            </div>
            <div className="p-7 rounded-[20px] bg-white">
              <p className="text-[19px] font-bold">Dein eigener Aufwand</p>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>Rund 60 Minuten. Die Interviews selbst entwickeln und auswerten wir.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Schutz der Antworten, Zähler wie auf der Teamseite */}
      <section id="schutz" className="scroll-mt-4" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_420px] min-w-0">
            <Etikett dunkel>Ehrlichkeit braucht Schutz</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Du siehst Gruppen. <span style={{ color: F.akzent }}>Nie einzelne Antworten.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, lineHeight: 1.7, color: F.hellAufDunkel }}>
              Ehrlich antwortet nur, wer sich nicht beobachtet fühlt. Darum gelten bei jedem Interview dieselben Regeln.
              Genau so sagen wir es auch den Menschen, die wir fragen.
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
          <Zaehler titel="Das siehst du als Auftraggeber" />
        </div>
      </section>

      {/* Zusagen */}
      <section id="zusagen" className={`${BREITE} py-24 scroll-mt-4`}>
        <Etikett>Woran du uns messen kannst</Etikett>
        <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
          Was wir dir zusagen. <span style={{ color: F.akzent }}>Schwarz auf weiß.</span>
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

      {/* Für wen */}
      <section style={{ background: F.hauch }}>
        <div className={`${BREITE} py-[88px]`}>
          <Etikett>Für wen wir fragen</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            Für Unternehmen <span style={{ color: F.akzent }}>vor einer Entscheidung.</span>
          </h2>
          <p className="mt-3 max-w-[720px]" style={ABSATZ}>
            Für alle, die eine wichtige Entscheidung nicht auf Bauchgefühl bauen wollen. Drei Sichtweisen kommen
            zusammen: Führung, Belegschaft und Markt. Jede bekommt ihr eigenes Interview, ausgewertet wird gemeinsam.
            Denn die wertvollsten Erkenntnisse liegen dort, wo die Sichtweisen auseinandergehen.
          </p>
          <div className="mt-9 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {[["Typische Anlässe", ANLAESSE], ["Mit uns am Tisch", AM_TISCH]].map(([titel, liste]) => (
              <div key={titel} className="p-7 rounded-[20px] bg-white">
                <h3 className="text-[19px] font-bold">{titel}</h3>
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {liste.map((x) => (
                    <li key={x} className={CHIP} style={{ background: F.grau }}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[15px] font-semibold" style={{ color: F.daempft }}>Die vier Interviews</p>
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

      {/* Häufige Fragen */}
      <Faq seite="ueberUns" look="weiss" />

      {/* Abschluss */}
      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center justify-between gap-x-14 gap-y-8`}>
          <div className="flex-[1_1_520px] min-w-0">
            <h2 style={H2_STIL}>
              Lern uns kennen, <span style={{ color: F.akzent }}>bevor du entscheidest.</span>
            </h2>
            <p className="mt-[18px] max-w-[620px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              Ein Gespräch, rund 30 Minuten, kostenlos. Danach weißt du, ob ein Interview dir weiterhilft. Und wenn
              nicht, sagen wir es dir offen.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Hauptknopf href={anfrageLink("andi fragt. Erstgespräch")}>Erstgespräch anfragen</Hauptknopf>
            <a href={TEL_LINK} className="inline-flex items-center min-h-[44px] font-bold text-white hover:underline">
              oder anrufen: {KONTAKT_TEL}
            </a>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
