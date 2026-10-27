import React from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, TrendingUp, Users } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, LEAD_STIL, Modulseite, TEXT_STIL, mailAn,
} from "@/components/oeffentlich/Oeffentlich";

// Öffentliche Seite „Über uns“ von andifragt.at.
//
// Zweck: Suchmaschinen und Erstbesucher erfahren in wenigen Absätzen, was die
// Plattform macht, für wen sie gedacht ist und wer dahinter steht. Damit ist
// die Seite auch die inhaltliche Heimat für die Marke andi fragt.
//
// Typografie wie auf den Modulseiten: Gilroy hat keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Texte deshalb mit
// Doppelpunkt, Komma oder Punkt statt Strich schreiben.
// Sprachregel: Auf den öffentlichen Seiten heißt es immer Interview, nie Befragung.

const MODULKURZ = [
  { icon: Eye, name: "Positionierung", pfad: "/positionierung", text: "Warum Kunden wirklich kaufen: aus den Antworten wird eine sichtbare Marke." },
  { icon: Users, name: "Team", pfad: "/team", text: "Was das Team hält, was es bremst und was es sich wünscht." },
  { icon: Heart, name: "Kunden", pfad: "/kunden", text: "Die Außensicht auf das eigene Unternehmen, die im Alltag fehlt." },
  { icon: TrendingUp, name: "Vertrieb", pfad: "/vertrieb", text: "Was beim Kunden ankommt und bei welchem Argument er abschaltet." },
];

const SAEULEN = ["Aufmerksamkeit", "Nutzen", "Differenzierung", "Identität"];

const FAKTEN = [
  { zahl: "über 500", text: "Markenprojekte als Grundlage der Methode" },
  { zahl: "über 20 Jahre", text: "Rittler & Co, Werbeagentur in Graz" },
  { zahl: "100 % anonym", text: "für alle, die wir interviewen" },
  { zahl: "wenige Minuten", text: "Aufwand für jede teilnehmende Person" },
];

const ABSATZ = { ...TEXT_STIL, color: F.daempft };

export default function UeberUns() {
  return (
    <Modulseite titel="Über uns | andi fragt. Die ANDI-Methode von Rittler & Co" modul="Über uns">
      {/* Einstieg */}
      <section className={`${BREITE} pt-14 pb-6`}>
        <Etikett>Über uns</Etikett>
        <h1 className="mt-4 max-w-[900px]" style={H1_STIL}>
          Wir fragen lieber, <span style={{ color: F.akzent }}>als zu raten.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
          andi fragt. ist die Interview-Plattform der ANDI-Methode von Rittler &amp; Co, Werbeagentur in Graz.
          Wir holen das Wissen ab, das in Unternehmen längst vorhanden ist: bei Führung, Team, Vertrieb und Kunden.
        </p>
      </section>

      {/* Was die Plattform macht */}
      <section className={`${BREITE} py-14 grid gap-12 min-[960px]:grid-cols-[minmax(0,1fr)_360px]`}>
        <div className="max-w-[680px]">
          <Etikett>Die Plattform</Etikett>
          <h2 className="mt-3" style={H2_STIL}>Was andi fragt. macht</h2>
          <p className="mt-5" style={ABSATZ}>
            Gute Antworten stecken fast immer schon im Unternehmen: im Kopf der Geschäftsführung, im Alltag
            des Teams, im Gespräch des Vertriebs und in der Sicht der Kunden. Nur ausgesprochen werden sie
            selten. Genau dort setzt andi fragt. an.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Die Plattform führt digitale Interviews durch. Die befragten Personen antworten anonym, am Handy
            oder am Computer und wann es ihnen passt, eine Frage pro Bildschirm. Unterbrechen und später
            weitermachen ist jederzeit möglich. Aus den Antworten gewinnen wir mit der ANDI-Methode eine klare
            Positionierung, eine glaubwürdige Arbeitgebermarke, eine ehrliche Kundensicht und einen Vertrieb,
            der auf dem aufbaut, was beim Kunden wirklich ankommt.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Anonymität ist dabei kein Zusatz, sondern die Voraussetzung. Die Plattform speichert keine
            IP-Adressen, führt keine Teilnehmerlisten und gibt Ergebnisse erst frei, wenn eine Mindestzahl an
            Rückmeldungen erreicht ist. Wer mitmacht, kann ehrlich antworten, auch wenn die Antwort unbequem ist.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Wer mit andi fragt. arbeitet, bekommt keine Datenberge, sondern Klarheit: wenige Sätze und
            Empfehlungen, die sich im Alltag umsetzen lassen. Dafür wurden Plattform und Fragen im eigenen Haus
            gebaut, aus der Arbeit an Marken, nicht am Reißbrett.
          </p>
        </div>

        <aside className="rounded-[20px] p-7" style={{ background: F.grau }}>
          <Etikett>Die vier Module</Etikett>
          <ul className="mt-5 flex flex-col gap-5">
            {MODULKURZ.map(({ icon: Icon, name, text, pfad }) => (
              <li key={name} className="flex gap-4">
                <Icon size={24} strokeWidth={1.5} style={{ color: F.akzent }} aria-hidden="true" className="shrink-0 mt-0.5" />
                <div>
                  <Link to={pfad} className="font-bold hover:underline" style={{ color: F.text }}>{name}</Link>
                  <p className="mt-1 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Für wen */}
      <section className="py-16 text-white" style={{ background: F.dunkel }}>
        <div className={BREITE}>
          <Etikett dunkel>Zielgruppe</Etikett>
          <h2 className="mt-3 max-w-[760px]" style={H2_STIL}>Für wen wir fragen</h2>
          <p className="mt-5 max-w-[820px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            andi fragt. ist für Unternehmen gedacht, die sich selbst besser verstehen wollen, bevor sie
            investieren: Geschäftsführung und Inhaberschaft, Personal- und Marketingverantwortliche sowie
            Vertriebsleitungen. Der Aufwand auf Kundenseite bleibt gering, die Fragen beantworten die
            Mitarbeitenden, Kundinnen und Kunden selbst.
          </p>
          <p className="mt-4 max-w-[820px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            Drei Perspektiven kommen zusammen: Führung, Belegschaft und Markt. Sie werden getrennt befragt und
            gemeinsam ausgewertet, weil die interessanten Antworten dort entstehen, wo die Sichtweisen
            auseinandergehen. Und für alle, die zu einem Interview eingeladen wurden, ist die Teilnahme
            freiwillig, anonym, kostenlos und in wenigen Minuten erledigt.
          </p>
        </div>
      </section>

      {/* Wer dahinter steht */}
      <section className={`${BREITE} py-20`}>
        <Etikett>Wer dahinter steht</Etikett>
        <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>Rittler &amp; Co, Werbeagentur in Graz</h2>
        <div className="mt-6 grid gap-12 min-[960px]:grid-cols-[minmax(0,1fr)_360px]">
          <div className="max-w-[680px]">
            <p style={ABSATZ}>
              Hinter andi fragt. steht die Rittler &amp; Co GmbH in Graz. Seit über 20 Jahren begleiten wir
              Unternehmen bei Marke, Positionierung und Auftritt, mit mehr als 500 Markenprojekten als Grundlage.
              Die Plattform wurde im eigenen Haus gebaut, damit Interviews so ablaufen, wie wir sie uns für die
              befragten Personen wünschen: schlicht, anonym und ohne Zeitdruck.
            </p>
            <p className="mt-4" style={ABSATZ}>
              Aus dieser Praxis ist die ANDI-Methode entstanden. Sie prüft jede Antwort in vier Schritten und
              sucht nicht den Durchschnitt, sondern die Abweichung, weil dort die eigentliche Erkenntnis liegt.
              Wer ein Interview startet, bekommt die Auswertung persönlich präsentiert, mit klaren Empfehlungen
              für die nächsten Entscheidungen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.daempft }}>
                Die vier Säulen
              </span>
              {SAEULEN.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center min-h-[32px] px-3.5 rounded-full text-sm font-medium"
                  style={{ background: "#ffffff", border: `1px solid ${F.hauchRand}`, color: F.text }}
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Hauptknopf href={mailAn("andi fragt. Termin vereinbaren")}>Termin vereinbaren</Hauptknopf>
            </div>
            <p className="mt-5 text-[15px]" style={{ color: F.daempft }}>
              Alle Wege zu uns findest du auf der{" "}
              <Link to="/kontakt" className="font-semibold hover:underline" style={{ color: F.link }}>Kontaktseite</Link>.
            </p>
          </div>

          <dl className="grid gap-6 grid-cols-2 min-[960px]:grid-cols-1 content-start">
            {FAKTEN.map(({ zahl, text }) => (
              <div key={zahl}>
                <dt className="text-[clamp(22px,2.4vw,30px)] font-black leading-tight" style={{ color: F.akzent }}>{zahl}</dt>
                <dd className="mt-1 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Modulseite>
  );
}