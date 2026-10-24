import React, { useState } from "react";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite,
} from "@/components/oeffentlich/Oeffentlich";

// Modulseite 03 Kunden (für Geschäftsführung, Verkauf, Kundenservice).
// Eigener Look: grauer Grund, Foto mit Fragezeichen, Kundenreise zum Antippen.

const BETREFF = "andi fragt. Kunden-Interview";

const STATIONEN = [
  { name: "Aufmerksam werden", frage: "Wie bist du damals auf uns gekommen?", erkenntnis: "Welche Kanäle wirklich Kunden bringen und welche nur Geld kosten. Oft ist es die Empfehlung, nicht die Anzeige.", wert: "Werbebudget dorthin, wo Kunden herkommen." },
  { name: "Entscheiden", frage: "Was hat am Ende den Ausschlag für uns gegeben?", erkenntnis: "Der echte Kaufgrund. Er steht selten im Prospekt und ist oft kleiner und menschlicher, als du denkst.", wert: "Mehr Abschlüsse mit dem richtigen Argument." },
  { name: "Zusammenarbeit", frage: "Wann hast du dich bei uns gut aufgehoben gefühlt, und wann nicht?", erkenntnis: "Die Momente, die Vertrauen schaffen, und die kleinen Ärgernisse, über die niemand spricht.", wert: "Weniger Reklamationen, mehr Vertrauen." },
  { name: "Wieder kaufen", frage: "Was könnten wir dir noch abnehmen?", erkenntnis: "Bedarf, den deine Kunden heute woanders decken, obwohl sie es lieber bei dir kaufen würden.", wert: "Mehr Umsatz mit bestehenden Kunden." },
  { name: "Weiterempfehlen", frage: "Was müsste passieren, damit du uns ohne Zögern weiterempfiehlst?", erkenntnis: "Was zwischen zufrieden und begeistert fehlt. Genau dort entstehen Empfehlungen.", wert: "Neue Kunden, die schon überzeugt kommen." },
];

const LEISE = [
  { titel: "Sie sagen nichts", text: "Die meisten Kunden sprechen Ärger nicht an. Sie bestellen einfach etwas seltener, bis sie ganz weg sind." },
  { titel: "Du merkst es spät", text: "In den Zahlen siehst du den Rückgang erst Monate später. Den Grund siehst du dort nie." },
  { titel: "Wir hören es früher", text: "Im anonymen Interview sprechen Kunden offen, weil sie nicht dir gegenübersitzen, sondern uns." },
];

const ERGEBNIS = [
  { nr: "01", titel: "Die echten Kaufgründe", text: "In den Worten deiner Kunden, fertig für Website, Angebot und Verkaufsgespräch." },
  { nr: "02", titel: "Abwanderung früh erkennen", text: "Wo Kunden unzufrieden sind, bevor sie es dir zeigen, und was hilft." },
  { nr: "03", titel: "Selbstbild gegen Kundenbild", text: "Wo dein Team und deine Kunden dich unterschiedlich sehen. Die größten Chancen liegen in den Abweichungen." },
  { nr: "04", titel: "Handout und Präsentation", text: "Alle Erkenntnisse zum Nachlesen und persönlich bei dir erklärt, mit klaren nächsten Schritten." },
];

const panelLabel = { color: "#a80f39" };

function Kundenreise() {
  const [auswahl, setAuswahl] = useState(0);
  const aktiv = STATIONEN[auswahl];

  // Pfeiltasten zwischen den Stationen, wie bei Reitern üblich.
  function taste(e, i) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const neu = (i + (e.key === "ArrowRight" ? 1 : -1) + STATIONEN.length) % STATIONEN.length;
    setAuswahl(neu);
    document.getElementById(`station-${neu}`)?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="Stationen der Kundenreise" className="relative mt-10 grid grid-cols-5 gap-2">
        <div aria-hidden="true" className="absolute h-1 rounded" style={{ left: "10%", right: "10%", top: "clamp(22px, 4vw, 36px)", background: F.hauchRand }} />
        {STATIONEN.map((s, i) => {
          const an = i === auswahl;
          return (
            <button
              key={s.name}
              id={`station-${i}`}
              type="button"
              role="tab"
              aria-selected={an}
              aria-controls="station-inhalt"
              tabIndex={an ? 0 : -1}
              onClick={() => setAuswahl(i)}
              onKeyDown={(e) => taste(e, i)}
              className="relative flex flex-col items-center gap-3 px-1 pb-2"
              style={{ border: 0, background: "transparent", fontFamily: "inherit", color: F.text, cursor: "pointer" }}
            >
              <span
                className="rounded-full box-border flex items-center justify-center font-black transition-colors motion-reduce:transition-none"
                style={{
                  width: "clamp(44px, 8vw, 76px)",
                  height: "clamp(44px, 8vw, 76px)",
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  border: `4px solid ${an ? F.akzent : F.hauchRand}`,
                  background: an ? F.akzent : "#ffffff",
                  color: an ? "#ffffff" : F.etikett,
                }}
              >
                {i + 1}
              </span>
              <span className="text-center leading-[1.25] text-[13px] sm:text-base" style={{ fontWeight: an ? 700 : 600 }}>{s.name}</span>
            </button>
          );
        })}
      </div>

      <div
        id="station-inhalt"
        role="tabpanel"
        aria-labelledby={`station-${auswahl}`}
        aria-live="polite"
        className="mt-7 rounded-3xl p-9 grid gap-7 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]"
        style={{ background: F.hauch }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>Was andi fragt</p>
          <p className="mt-2.5 text-2xl leading-[1.3] font-bold">{aktiv.frage}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>Was du erfährst</p>
          <p className="mt-2.5" style={TEXT_STIL}>{aktiv.erkenntnis}</p>
        </div>
        <div className="rounded-[18px] bg-white p-[22px]">
          <p className="text-xs font-bold uppercase tracking-[0.14em]" style={panelLabel}>Was es dir bringt</p>
          <p className="mt-2.5 text-xl leading-[1.35] font-bold" style={{ color: F.link }}>{aktiv.wert}</p>
        </div>
      </div>
    </>
  );
}

export default function Kunden() {
  return (
    <Modulseite titel="Kunden | andi fragt." modul="Kunden" hintergrund={F.grau} kopfRand={false}>
      {/* Einstieg mit Foto und Fragezeichen */}
      <section className={`${BREITE} pt-20 pb-[88px] flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
        <div className="flex-[3_1_560px] min-w-0">
          <Etikett>Modul 03 Kunden</Etikett>
          <h1 className="mt-[18px]" style={H1_STIL}>
            Deine Kunden <span style={{ color: F.akzent }}>wissen,</span> warum sie bleiben.
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
            Und warum andere gegangen sind. Sie sagen es dir nur nicht von selbst. Einem neutralen Interview erzählen sie
            es gern, und du erfährst, wo mehr Umsatz liegt.
          </p>
          <div className="mt-8">
            <Hauptknopf href={mailAn(BETREFF)}>Erstgespräch vereinbaren</Hauptknopf>
          </div>
          <FuerDich rollen={["Geschäftsführung", "Verkauf", "Kundenservice"]} />
        </div>
        <div className="flex-[2_1_320px] min-w-0 flex justify-center">
          <div className="relative">
            <RundesFoto
              src="/bilder/kunden.webp"
              alt="Kunde im Gespräch mit Mitarbeitenden am Empfang"
              groesse={340}
              rand="10px solid #ffffff"
            />
            <span
              aria-hidden="true"
              className="absolute w-[92px] h-[92px] rounded-full flex items-center justify-center text-[44px] font-black text-white"
              style={{ left: "-10%", top: "10%", background: F.dunkel }}
            >
              ?
            </span>
          </div>
        </div>
      </section>

      {/* Kundenreise */}
      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <Etikett>Die Kundenreise</Etikett>
          <h2 className="mt-3 max-w-[760px]" style={H2_STIL}>
            Fünf Momente, <span style={{ color: F.akzent }}>in denen Umsatz entsteht</span> oder verloren geht.
          </h2>
          <p className="mt-4" style={{ ...TEXT_STIL, color: F.daempft }}>Tipp eine Station an.</p>
          <Kundenreise />
        </div>
      </section>

      {/* Leise Abwanderung */}
      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[104px]`}>
          <h2 className="max-w-[900px]" style={H2_STIL}>
            Unzufriedene Kunden <span style={{ color: F.akzent }}>beschweren sich selten.</span> Sie gehen einfach.
          </h2>
          <div className="mt-14 grid gap-10 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {LEISE.map((l) => (
              <div key={l.titel}>
                <p className="text-xl font-bold">{l.titel}</p>
                <p className="mt-2.5 leading-[1.65]" style={{ color: F.hellAufDunkel }}>{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Die wertvollste Frage */}
      <section className={`${BREITE} py-28 text-center`}>
        <Etikett>Die wertvollste Frage</Etikett>
        <p className="mt-5 mx-auto max-w-[900px] text-[clamp(28px,4vw,46px)] leading-[1.15] font-bold italic">
          Was müsste passieren, damit du uns{" "}
          <span style={{ background: "linear-gradient(transparent 62%, #ffd3dd 62%)" }}>ohne Zögern weiterempfiehlst?</span>
        </p>
        <p className="mt-6 mx-auto max-w-[640px]" style={{ ...TEXT_STIL, color: F.daempft }}>
          Eine Zahl sagt dir, wie zufrieden Kunden sind. Die Antwort auf diese Frage sagt dir, was du tun musst. Unsere
          Strategen lesen jede einzelne.
        </p>
      </section>

      {/* Ergebnis */}
      <section className="bg-white">
        <div className={`${BREITE} py-24`}>
          <Etikett>Das bekommst du</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Antworten, <span style={{ color: F.akzent }}>mit denen du verkaufen kannst.</span>
          </h2>
          <ol className="mt-11 flex flex-col">
            {ERGEBNIS.map((r) => (
              <li
                key={r.nr}
                className="grid gap-x-6 gap-y-2 items-baseline py-[26px] grid-cols-[64px_minmax(0,1fr)] md:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)]"
                style={{ borderTop: `1px solid ${F.linie}` }}
              >
                <span aria-hidden="true" className="text-[40px] font-black" style={{ color: "transparent", WebkitTextStroke: `1.5px ${F.akzent}` }}>{r.nr}</span>
                <h3 className="text-[22px] leading-[1.25] font-bold">{r.titel}</h3>
                <p className="col-start-2 md:col-start-auto leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Abschluss */}
      <section className={`${BREITE} py-24`}>
        <div className="rounded-[28px] p-14 flex flex-wrap items-center justify-between gap-x-12 gap-y-6 text-white" style={{ background: F.akzent }}>
          <h2 className="flex-[1_1_520px]" style={H2_STIL}>Frag deine Kunden, bevor es die Konkurrenz tut.</h2>
          <Hauptknopf href={mailAn(BETREFF)} farbe={F.dunkel}>Unverbindlich anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
