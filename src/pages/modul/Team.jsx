import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";

// Modulseite 02 Team (für Geschäftsführung, Personal und HR, Führungskräfte).
// Eigener Look: rosa Grund, Sprechblasen, Zeitleiste und Anonymitäts-Zähler.

const BETREFF = "andi fragt. Team-Interview";
const MINDESTZAHL = 6;

const BLASEN = [
  { text: "Ich würde mehr Verantwortung übernehmen. Mich hat nur noch nie jemand gefragt.", wer: "Verwaltung" },
  { text: "Das Team ist der Grund, warum ich noch da bin.", wer: "Werkstatt" },
  { text: "Wir erfahren Entscheidungen oft als Letzte.", wer: "Außendienst" },
  { text: "Neue Kollegen sind nach drei Wochen auf sich allein gestellt.", wer: "Lager" },
  { text: "Ich bin stolz, wenn ich unser Firmenauto auf der Straße sehe.", wer: "Montage" },
  { text: "Gute Arbeit fällt erst auf, wenn sie fehlt.", wer: "Service" },
].map((b, i) => ({
  ...b,
  grund: i % 3 === 1 ? F.dunkel : i % 3 === 2 ? "#e02551" : "#ffffff",
  farbe: i % 3 === 0 ? F.dunkel : "#ffffff",
  dreh: ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"][i],
  ecke: i % 2 ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
}));

const STILL = { grund: F.grau, text: F.dunkel };
const LAUT = { grund: "#e02551", text: "#ffffff" };
const GUT = { grund: F.dunkel, text: "#ffffff" };

const WEGE = [
  {
    titel: "Wenn niemand fragt",
    farbe: F.daempft,
    schritte: [
      { wann: "Monat 1", was: "Erster Frust, man schluckt ihn.", ...STILL },
      { wann: "Monat 3", was: "Weniger Ideen, mehr Dienst nach Vorschrift.", ...STILL },
      { wann: "Monat 6", was: "Das Profil im Netz wird aktualisiert.", ...STILL },
      { wann: "Monat 9", was: "Die Kündigung kommt überraschend.", ...LAUT },
      { wann: "Danach", was: "Stelle neu besetzen, Wissen ist weg.", ...LAUT },
    ],
  },
  {
    titel: "Wenn andi fragt",
    farbe: F.etikett,
    schritte: [
      { wann: "Woche 1", was: "Anonymes Interview im ganzen Team.", ...GUT },
      { wann: "Woche 4", was: "Das Muster wird sichtbar, nicht die Person.", ...GUT },
      { wann: "Woche 6", was: "Präsentation und konkrete Maßnahmen.", ...GUT },
      { wann: "Danach", was: "Gute Leute bleiben, weil sich etwas ändert.", ...GUT },
    ],
  },
];

const GEWINN = [
  { zeichen: "1", titel: "Leistungsträger halten", text: "Du erfährst früh, was gute Leute bremst, und kannst handeln, bevor sie gehen." },
  { zeichen: "2", titel: "Bewerbungen, die passen", text: "Stellenanzeigen in den Worten deines Teams ziehen Menschen an, die wirklich zu euch passen." },
  { zeichen: "3", titel: "Führung, die ankommt", text: "Du siehst, wo Entscheidungen verstanden werden und wo sie im Alltag verloren gehen." },
  { zeichen: "4", titel: "Ein Team, das gefragt wurde", text: "Allein das Interview zeigt Wertschätzung. Wenn danach etwas passiert, wirkt es doppelt." },
];

const ERGEBNIS = [
  { nr: "Stimmungsbild", titel: "Wie es deinem Team geht", text: "Je Bereich, ab der Mindestzahl, mit den Themen, die wirklich bewegen.", beispiel: "Die Werkstatt fühlt sich stark, aber schlecht informiert." },
  { nr: "Arbeitgeberversprechen", titel: "Warum man bei euch arbeitet", text: "Ein ehrliches Versprechen, das dein Team selbst unterschreiben würde.", beispiel: "Bei uns zählt dein Wort, auch am ersten Tag." },
  { nr: "Recruiting", titel: "Sätze für deine Stellenanzeigen", text: "Aus echten Antworten werden Texte, die Bewerbende ansprechen.", beispiel: "Wir suchen niemanden, der alles kann. Wir suchen jemanden, der mitdenkt." },
];

function Zaehler() {
  const [n, setN] = useState(3);
  const offen = n >= MINDESTZAHL;
  let sichtbar;
  if (n === 0) sichtbar = "Noch nichts. Hier wartet niemand auf einzelne Antworten.";
  else if (!offen) sichtbar = `Nur, dass ${n} von ${MINDESTZAHL} nötigen Interviews da sind. Keine Antworten, keine Tendenz.`;
  else sichtbar = "Ab jetzt das gemeinsame Bild der Werkstatt. Nie eine einzelne Antwort, nie ein Name.";

  return (
    <div className="flex-[1_1_440px] min-w-0 rounded-[28px] p-8" style={{ background: F.dunkelKarte }}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-bold">Bereich Werkstatt</p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setN((x) => Math.max(0, x - 1))}
            aria-label="Ein Interview weniger"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ border: "1px solid #767676", background: "transparent" }}
          >
            <Minus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span aria-live="polite" className="min-w-[48px] text-center text-[30px] font-black">{n}</span>
          <button
            type="button"
            onClick={() => setN((x) => Math.min(10, x + 1))}
            aria-label="Ein Interview mehr"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ background: F.akzent }}
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="mt-[22px] flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => {
          const voll = i < n;
          const farbe = offen ? "#45d085" : F.akzent;
          return (
            <span
              key={i}
              className="w-[30px] h-[30px] rounded-full box-border"
              style={{ background: voll ? farbe : "transparent", border: `2px solid ${voll ? farbe : "#767676"}` }}
            />
          );
        })}
      </div>
      <div className="mt-6 rounded-[18px] p-5" style={{ background: offen ? "#45d085" : "#4a4a4a", color: offen ? F.dunkel : "#ffffff" }}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-85">Das siehst du</p>
        <p aria-live="polite" className="mt-1.5 text-lg leading-[1.4] font-bold">{sichtbar}</p>
      </div>
      <p className="mt-3.5 text-xs" style={{ color: "#b3b3b3" }}>Die Mindestzahl legen wir mit dir fest, standardmäßig {MINDESTZAHL}.</p>
    </div>
  );
}

export default function Team() {
  return (
    <Modulseite
      titel="Team | andi fragt."
      modul="Team"
      hintergrund={F.hauch}
      kopfRand={false}
      fussDunkel
      fussHintergrund={F.dunkel}
    >
      {/* Einstieg: Teamfoto, Frage, Sprechblasen */}
      <section className={`${BREITE} pt-14 pb-24 text-center`}>
        <div className="mx-auto mb-8 flex justify-center">
          <RundesFoto
            src="/bilder/team.webp"
            alt="Team lacht gemeinsam in der Kaffeepause"
            groesse={216}
            ringe={[{ abstand: 12, farbe: F.akzent }]}
            rand="8px solid #ffffff"
          />
        </div>
        <Etikett>Modul 02 Team</Etikett>
        <h1 className="mt-4 mx-auto max-w-[940px]" style={H1_STIL}>
          Was dein Team dir <span style={{ color: F.akzent }}>nie direkt sagen</span> würde.
        </h1>
        <p className="mt-6 mx-auto" style={{ ...LEAD_STIL, color: F.daempft }}>
          Beim Mitarbeitergespräch nickt jeder. Im anonymen Interview erzählen die Leute, was sie hält, was sie bremst
          und was sie gehen ließe. Bevor es zu spät ist.
        </p>
        <div className="mt-8 flex justify-center">
          <Hauptknopf href={mailAn(BETREFF)}>Erstgespräch vereinbaren</Hauptknopf>
        </div>
        <FuerDich rollen={["Geschäftsführung", "Personal und HR", "Führungskraft"]} mitte />
        <div role="list" aria-label="Beispiele für anonyme Antworten" className="mt-14 mx-auto max-w-[1000px] flex flex-wrap justify-center gap-4">
          {BLASEN.map((b) => (
            <div
              key={b.text}
              role="listitem"
              className="max-w-[300px] px-[22px] py-[18px] text-[17px] leading-[1.4] font-semibold text-left motion-reduce:!transform-none"
              style={{
                borderRadius: b.ecke,
                background: b.grund,
                color: b.farbe,
                transform: `rotate(${b.dreh})`,
                boxShadow: "0 14px 28px -18px rgba(45,45,45,0.45)",
              }}
            >
              {b.text}
              <span className="block mt-2 text-xs font-medium opacity-75">{b.wer}</span>
            </div>
          ))}
        </div>
        <Beispielhinweis className="mt-[22px]">Beispielhafte Antworten zur Veranschaulichung.</Beispielhinweis>
      </section>

      {/* Zwei Wege */}
      <section className="bg-white rounded-t-[40px]">
        <div className={`${BREITE} py-24`}>
          <h2 className="max-w-[780px]" style={H2_STIL}>
            Kündigungen passieren <span style={{ color: F.akzent }}>nicht über Nacht.</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, color: F.daempft }}>
            Zwischen dem ersten Frust und der Kündigung liegen meist Monate. In dieser Zeit sagt kaum jemand etwas.
            Außer man fragt richtig.
          </p>
          <div className="mt-12 flex flex-col gap-10">
            {WEGE.map((w) => (
              <div key={w.titel}>
                <p className="text-[15px] font-bold uppercase tracking-[0.1em]" style={{ color: w.farbe }}>{w.titel}</p>
                <ol className="mt-4 grid gap-3 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
                  {w.schritte.map((s) => (
                    <li key={s.wann + s.was} className="rounded-[18px] px-[18px] pt-[18px] pb-5 min-h-[110px]" style={{ background: s.grund, color: s.text }}>
                      <span className="block text-xs font-semibold opacity-80">{s.wann}</span>
                      <span className="block mt-2 leading-[1.35] font-bold">{s.was}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <Beispielhinweis>Typischer Verlauf zur Veranschaulichung.</Beispielhinweis>
        </div>
      </section>

      {/* Anonymität zum Ausprobieren */}
      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_400px] min-w-0">
            <Etikett dunkel>Ehrlichkeit braucht Schutz</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Niemand ist erkennbar. <span style={{ color: F.akzent }}>Auch nicht für dich.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              Eine Gruppe wird erst gezeigt, wenn genug Interviews da sind. Kleine Bereiche fassen wir zusammen. Probier
              es aus: Wie viele aus der Werkstatt haben schon geantwortet?
            </p>
            <p className="mt-[18px] text-[15px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>
              Das sagen wir deinem Team auch genau so. Erst dann wird ehrlich geantwortet.
            </p>
          </div>
          <Zaehler />
        </div>
      </section>

      {/* Was du davon hast */}
      <section className="bg-white">
        <div className={`${BREITE} py-[104px] flex flex-wrap items-center gap-x-20 gap-y-14`}>
          <div className="flex-[1_1_400px] min-w-0 flex justify-center">
            <div className="relative" style={{ width: 420, maxWidth: "100%", aspectRatio: "1 / 1" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center text-center p-14 box-border" style={{ background: F.hauch }}>
                <span style={H2_STIL}>
                  Die Guten <span style={{ color: F.akzent }}>bleiben.</span>
                </span>
              </div>
              <span
                aria-hidden="true"
                className="absolute w-[132px] h-[132px] rounded-full flex items-center justify-center text-center p-3.5 box-border font-bold leading-[1.15] text-white"
                style={{ right: "-4%", bottom: "6%", background: F.dunkel }}
              >
                Bessere kommen.
              </span>
            </div>
          </div>
          <div className="flex-[1_1_440px] min-w-0">
            <Etikett>Was du davon hast</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Zuhören, <span style={{ color: F.akzent }}>das sich rechnet.</span>
            </h2>
            <div className="mt-7 flex flex-col gap-3.5">
              {GEWINN.map((g) => (
                <div key={g.titel} className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 items-start p-[18px] rounded-[20px]" style={{ background: F.hauch }}>
                  <span aria-hidden="true" className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[22px] font-black" style={{ color: F.etikett }}>
                    {g.zeichen}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{g.titel}</h3>
                    <p className="mt-1 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>{g.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ergebnis */}
      <section className={`${BREITE} py-24`}>
        <Etikett>Das bekommst du</Etikett>
        <h2 className="mt-3" style={H2_STIL}>
          Vom Stimmungsbild <span style={{ color: F.akzent }}>zur Stellenanzeige.</span>
        </h2>
        <div className="mt-10 grid gap-5 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {ERGEBNIS.map((r) => (
            <article key={r.nr} className="rounded-[28px] p-[30px] bg-white">
              <span className="inline-flex h-[30px] px-3 items-center rounded-full text-xs font-bold text-white" style={{ background: F.dunkel }}>{r.nr}</span>
              <h3 className="mt-[18px] text-[22px] leading-[1.2] font-bold">{r.titel}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
              <p className="mt-4 px-4 py-3.5 rounded-[14px] text-[15px] leading-[1.45] font-semibold italic" style={{ background: F.hauch }}>{r.beispiel}</p>
            </article>
          ))}
        </div>
        <Beispielhinweis className="mt-[18px]">
          Die Sätze in den Karten sind Beispiele. Dazu kommen wie in jedem Modul Analyse-Handout und Präsentation bei dir.
        </Beispielhinweis>
      </section>

      {/* Abschluss */}
      <section className="rounded-t-[40px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] text-center`}>
          <h2 className="mx-auto max-w-[820px]" style={H2_STIL}>
            Hör hin, <span style={{ color: F.akzent }}>bevor jemand geht.</span>
          </h2>
          <p className="mt-[18px] mx-auto max-w-[560px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            Im unverbindlichen Erstgespräch klären wir, welche Bereiche wir interviewen und wie wir dein Team einladen.
          </p>
          <div className="mt-7 flex justify-center">
            <Hauptknopf href={mailAn(BETREFF)}>Unverbindlich anfragen</Hauptknopf>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
