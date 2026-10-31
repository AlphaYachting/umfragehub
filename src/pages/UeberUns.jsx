import React from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, TrendingUp, Users } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, LEAD_STIL, Modulseite, TEXT_STIL, mailAn,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Öffentliche Seite „Über uns“ von andifragt.at.
//
// Zweck: Suchmaschinen und Erstbesucher erfahren in wenigen Absätzen, wie andi fragt.
// arbeitet (zuerst die richtigen Fragen finden, dann das Interview entwickeln), für wen
// es gedacht ist und wer dahinter steht. Damit ist die Seite auch die inhaltliche Heimat
// für die Marke andi fragt. Das Tool selbst wird nicht gezeigt oder beschrieben.
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
  { zahl: "4 Schritte", text: "von der Einschätzung bis zur Präsentation" },
  { zahl: "nur gebündelt", text: "Ergebnisse ab einer Mindestzahl, niemand erkennbar" },
];

const ABSATZ = { ...TEXT_STIL, color: F.daempft };

export default function UeberUns() {
  return (
    <Modulseite titel="Über uns: Rittler & Co, Graz | andi fragt." modul="Über uns">
      {/* Einstieg */}
      <section className={`${BREITE} pt-14 pb-6`}>
        <Etikett>Über uns</Etikett>
        <h1 className="mt-4 max-w-[900px]" style={H1_STIL}>
          Wir fragen lieber, <span style={{ color: F.akzent }}>als zu raten.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
          andi fragt. ist das strategische Interview-Verfahren von Rittler &amp; Co, Werbeagentur in Graz. Wir
          finden zuerst heraus, welche Fragen dein Unternehmen weiterbringen, und holen dann das Wissen ab, das
          längst da ist: bei Führung, Team, Vertrieb und Kunden.
        </p>
      </section>

      {/* Unser Ansatz */}
      <section className={`${BREITE} py-14 grid gap-12 min-[960px]:grid-cols-[minmax(0,1fr)_360px]`}>
        <div className="max-w-[680px]">
          <Etikett>Unser Ansatz</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Erst die richtigen Fragen. <span style={{ color: F.akzent }}>Dann die Antworten.</span>
          </h2>
          <p className="mt-5" style={ABSATZ}>
            Gute Antworten stecken fast immer schon im Unternehmen: im Kopf der Geschäftsführung, im Alltag
            des Teams, im Gespräch des Vertriebs und in der Sicht der Kunden. Nur ausgesprochen werden sie
            selten, weil niemand die richtigen Fragen stellt.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Genau dort fangen wir an. In über 500 Markenprojekten haben wir gelernt, wo sich Unternehmen
            typischerweise verschätzen: beim Kaufgrund der Kunden, beim Grund, warum gute Leute gehen, beim
            Argument, an dem Abschlüsse hängen. Im Zielgespräch prüfen wir, wo diese Stellen bei dir liegen,
            und entwickeln erst dann das Interview, für jede Gruppe eigens. Daraus entstehen eine klare
            Positionierung, eine glaubwürdige Arbeitgebermarke, eine ehrliche Kundensicht und ein Vertrieb, der
            auf dem aufbaut, was beim Kunden wirklich ankommt.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Anonymität ist dabei kein Zusatz, sondern die Voraussetzung. Ehrlich wird nur geantwortet, wo
            niemand erkennbar ist. Ergebnisse gibt es deshalb nur gebündelt und erst ab einer Mindestzahl an
            Interviews je Gruppe. Wer mitmacht, kann sagen, was er denkt, auch wenn es unbequem ist.
          </p>
          <p className="mt-4" style={ABSATZ}>
            Am Ende stehen keine Datenberge, sondern Entscheidungen: wenige klare Sätze und Empfehlungen, die
            sich im Alltag umsetzen lassen. Gelesen und eingeordnet wird jede Antwort von Menschen, nicht von
            einer Software.
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
          <Etikett dunkel>Für wen wir fragen</Etikett>
          <h2 className="mt-3 max-w-[760px]" style={H2_STIL}>
            Für Unternehmen <span style={{ color: F.akzent }}>vor einer Entscheidung.</span>
          </h2>
          <p className="mt-5 max-w-[820px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            andi fragt. ist für Unternehmen, die vor einer Entscheidung stehen und sie nicht auf Bauchgefühl
            bauen wollen: neuer Auftritt, gute Leute halten und gewinnen, Vertrieb neu ausrichten, Übergabe an
            die nächste Generation. Mit uns am Tisch sitzen Geschäftsführung und Inhaberschaft, Personal- und
            Marketingverantwortliche sowie Vertriebsleitungen.
          </p>
          <p className="mt-4 max-w-[820px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            Drei Perspektiven kommen zusammen: Führung, Belegschaft und Markt. Jede bekommt ihr eigenes
            Interview, ausgewertet wird gemeinsam, weil die wertvollsten Erkenntnisse dort liegen, wo die
            Sichtweisen auseinandergehen. Für alle, die zu einem Interview eingeladen werden, ist die Teilnahme
            freiwillig, anonym und kostenlos.
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
              Unternehmen bei Marke, Positionierung und Auftritt, in mehr als 500 Markenprojekten. Dabei haben
              wir immer wieder erlebt, dass die besten Antworten schon im Unternehmen stecken und nur niemand
              die richtigen Fragen stellt.
            </p>
            <p className="mt-4" style={ABSATZ}>
              Aus dieser Praxis ist die ANDI-Methode entstanden. Sie beginnt mit der Einschätzung der Lage,
              prüft jede Antwort in vier Schritten und sucht nicht den Durchschnitt, sondern die Abweichung, weil
              sie zeigt, wo eine Entscheidung anders ausfallen muss. Die Ergebnisse präsentieren wir persönlich,
              mit klaren Empfehlungen für die nächsten Schritte.
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

      {/* Häufige Fragen */}
      <Faq seite="ueberUns" look="weiss" />
    </Modulseite>
  );
}