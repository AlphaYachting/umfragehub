import React, { useState } from "react";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";

// Modulseite 04 Vertrieb (für Vertriebsleitung, Geschäftsführung, Verkaufsteam).
// Eigener Look: dunkle Seite, Verkaufstrichter, Argument-Check zum Umdrehen.

const BETREFF = "andi fragt. Vertriebs-Interview";

const STUFEN = [
  { name: "Anfrage", leck: "Anfragen kommen, aber die falschen. Oder die richtigen warten zu lange auf Antwort.", fragen: [{ wen: "Innendienst", frage: "Welche Anfragen sind von Anfang an aussichtslos?" }, { wen: "Kunden", frage: "Wie schnell hast du damals eine Antwort bekommen?" }], wert: "Mehr Zeit für Anfragen, die zu Aufträgen werden." },
  { name: "Erstgespräch", leck: "Das Gespräch läuft gut, aber der Kunde versteht nicht, warum gerade ihr.", fragen: [{ wen: "Außendienst", frage: "Bei welchem Satz merkst du, dass der Kunde abschaltet?" }, { wen: "Kunden", frage: "Was ist dir vom ersten Gespräch hängen geblieben?" }], wert: "Ein Einstieg, der in Erinnerung bleibt." },
  { name: "Angebot", leck: "Das Angebot ist korrekt, aber es verkauft nicht. Es landet neben drei anderen und wird nach Preis verglichen.", fragen: [{ wen: "Außendienst", frage: "Warum gehen Angebote verloren, die eigentlich gut waren?" }, { wen: "Kunden", frage: "Was hat in unserem Angebot gefehlt?" }], wert: "Angebote, die nicht nur über den Preis gewinnen." },
  { name: "Verhandlung", leck: "Am Ende wird über Rabatt gesprochen, weil der Wert nicht klar genug war.", fragen: [{ wen: "Vertriebsleitung", frage: "Wann gibst du Rabatt, obwohl du ihn nicht geben müsstest?" }, { wen: "Kunden", frage: "Wofür hättest du mehr bezahlt?" }], wert: "Weniger Rabatt, bessere Marge." },
  { name: "Auftrag", leck: "Der Auftrag ist da, aber es bleibt beim einen. Folgegeschäft und Empfehlung bleiben aus.", fragen: [{ wen: "Innendienst", frage: "Was fragen Kunden nach dem Auftrag am häufigsten nach?" }, { wen: "Kunden", frage: "Was würdest du als Nächstes bei uns kaufen?" }], wert: "Folgeaufträge aus derselben Beziehung." },
];

const TOENE = { gut: "#45d085", schlecht: "#ff3764", neutral: "#cfcbc7" };

const ARGUMENTE = [
  { text: "Wir sind seit über 30 Jahren am Markt.", urteil: "Egal", erklaerung: "Kunden setzen Erfahrung voraus. Gekauft wird wegen etwas anderem.", ton: "neutral" },
  { text: "Wir haben das beste Preis-Leistungs-Verhältnis.", urteil: "Schreckt ab", erklaerung: "Klingt nach Rabatt. Führt direkt in die Preisverhandlung.", ton: "schlecht" },
  { text: "Ihr fixer Ansprechpartner ist auch nach dem Kauf für Sie da.", urteil: "Zieht", erklaerung: "Der meistgenannte Kaufgrund, aber im Gespräch fast nie erwähnt.", ton: "gut" },
  { text: "Wir liefern alles aus einer Hand.", urteil: "Zieht teilweise", erklaerung: "Überzeugt Neukunden, Stammkunden ist es zu allgemein.", ton: "neutral" },
];

const ERGEBNIS = [
  { titel: "Die Lecks im Verkaufsweg", text: "Wo Aufträge verloren gehen, gesehen von Vertrieb und Kunden.", farbe: "#ff3764" },
  { titel: "Argumente, die ziehen", text: "Welche Sätze überzeugen und welche ihr streichen solltet.", farbe: "#45d085" },
  { titel: "Check deiner Vertriebsidee", text: "Was dein Team von der neuen Idee hält, bevor du investierst.", farbe: "#2d2d2d" },
  { titel: "Handout und Präsentation", text: "Persönlich bei dir, auf Wunsch mit dem ganzen Vertriebsteam.", farbe: "#e02551" },
];

const label = "text-xs font-bold uppercase tracking-[0.14em]";

function Trichter() {
  const [auswahl, setAuswahl] = useState(2);
  const aktiv = STUFEN[auswahl];

  function taste(e, i) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const neu = (i + (e.key === "ArrowDown" ? 1 : -1) + STUFEN.length) % STUFEN.length;
    setAuswahl(neu);
    document.getElementById(`stufe-${neu}`)?.focus();
  }

  return (
    <div className="mt-9 flex flex-wrap items-start gap-x-14 gap-y-8">
      <div role="tablist" aria-label="Stufen im Verkauf" aria-orientation="vertical" className="flex-[1_1_420px] min-w-0 flex flex-col items-center gap-2">
        {STUFEN.map((s, i) => {
          const an = i === auswahl;
          return (
            <button
              key={s.name}
              id={`stufe-${i}`}
              type="button"
              role="tab"
              aria-selected={an}
              aria-controls="stufe-inhalt"
              tabIndex={an ? 0 : -1}
              onClick={() => setAuswahl(i)}
              onKeyDown={(e) => taste(e, i)}
              className="min-h-[64px] flex items-center justify-between gap-3 px-[22px] rounded-lg text-[17px] font-bold text-white transition-colors motion-reduce:transition-none"
              style={{
                width: `${100 - i * 11}%`,
                border: 0,
                background: an ? F.akzent : i % 2 ? "#3d3d3d" : F.dunkel,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <span>{s.name}</span>
              <span aria-hidden="true" className="text-[13px] font-bold opacity-85">{an ? "gewählt" : `Stufe ${i + 1}`}</span>
            </button>
          );
        })}
      </div>
      <div
        id="stufe-inhalt"
        role="tabpanel"
        aria-labelledby={`stufe-${auswahl}`}
        aria-live="polite"
        className="flex-[1_1_400px] min-w-0 rounded-2xl p-8"
        style={{ border: `2px solid ${F.dunkel}` }}
      >
        <p className={label} style={{ color: F.etikett }}>Typisches Leck</p>
        <p className="mt-2 text-2xl leading-[1.25] font-bold">{aktiv.leck}</p>
        <p className={`mt-[22px] ${label}`} style={{ color: F.etikett }}>andi fragt</p>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {aktiv.fragen.map((f) => (
            <div key={f.frage} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 items-baseline">
              <span className="text-[13px] font-bold" style={{ color: F.daempft }}>{f.wen}</span>
              <span className="text-[17px] leading-[1.4] font-semibold italic">{f.frage}</span>
            </div>
          ))}
        </div>
        <p className="mt-[22px] px-[18px] py-4 rounded-[10px] text-lg leading-[1.65] font-bold" style={{ background: F.hauch, color: F.link }}>
          {aktiv.wert}
        </p>
      </div>
    </div>
  );
}

function ArgumentCheck() {
  const [offen, setOffen] = useState({});
  return (
    <div className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
      {ARGUMENTE.map((a, i) => {
        const auf = !!offen[i];
        return (
          <button
            key={a.text}
            type="button"
            aria-pressed={auf}
            onClick={() => setOffen((o) => ({ ...o, [i]: !o[i] }))}
            className="min-h-[220px] flex flex-col justify-between text-left p-[26px] rounded-2xl transition-colors motion-reduce:transition-none"
            style={{
              border: `2px solid ${auf ? TOENE[a.ton] : "#4a4a4a"}`,
              background: auf ? "#ffffff" : F.dunkelKarte,
              color: auf ? F.dunkel : "#ffffff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <span className={`${label} opacity-80`}>{auf ? `Kunden sagen: ${a.urteil}` : "Dein Vertrieb sagt"}</span>
            <span className="mt-3 text-[21px] leading-[1.3] font-bold">{auf ? a.erklaerung : a.text}</span>
            <span className="mt-4 text-sm font-bold">{auf ? "Zurückdrehen" : "Umdrehen"}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Vertrieb() {
  return (
    <Modulseite titel="Vertrieb | andi fragt." modul="Vertrieb" hintergrund={F.dunkel} dunkel>
      {/* Einstieg mit Foto im gestrichelten Ring */}
      <section className={`${BREITE} pt-[88px] pb-24 flex flex-wrap items-center gap-x-16 gap-y-12`}>
        <div className="flex-[3_1_560px] min-w-0">
          <Etikett dunkel>Modul 04 Vertrieb</Etikett>
          <h1 className="mt-[18px]" style={H1_STIL}>
            Wo deine Abschlüsse <span style={{ color: F.akzent }}>hängen bleiben.</span>
          </h1>
          <p className="mt-6" style={{ ...LEAD_STIL, color: F.hellAufDunkel }}>
            Außendienst, Innendienst und Kunden wissen genau, an welcher Stelle Aufträge verloren gehen. Wir holen dieses
            Wissen ab, bevor du in die nächste Vertriebsidee investierst.
          </p>
          <div className="mt-8">
            <Hauptknopf href={mailAn(BETREFF)}>Erstgespräch vereinbaren</Hauptknopf>
          </div>
          <FuerDich rollen={["Vertriebsleitung", "Geschäftsführung", "Verkaufsteam"]} dunkel />
        </div>
        <div className="flex-[2_1_300px] min-w-0 flex justify-center">
          <RundesFoto
            src="/bilder/vertrieb.webp"
            alt="Außendienstmitarbeiter telefoniert mit Headset im Auto"
            groesse={320}
            ringe={[{ abstand: 18, farbe: F.akzent, gestrichelt: true }]}
          />
        </div>
      </section>

      {/* Verkaufstrichter */}
      <section className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>Dein Verkaufsweg</Etikett>
          <h2 className="mt-3 max-w-[780px]" style={H2_STIL}>
            Jede Stufe hat <span style={{ color: F.akzent }}>ein Leck.</span> Welches ist deins?
          </h2>
          <p className="mt-4" style={{ ...TEXT_STIL, color: F.daempft }}>Wähle eine Stufe.</p>
          <Trichter />
        </div>
      </section>

      {/* Argument-Check */}
      <section>
        <div className={`${BREITE} py-[104px]`}>
          <Etikett dunkel>Argument-Check</Etikett>
          <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>
            Dein Vertrieb sagt es. <span style={{ color: F.akzent }}>Zieht es auch?</span>
          </h2>
          <p className="mt-4 max-w-[640px]" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
            Wir legen die Argumente deines Vertriebs neben das, was Kunden wirklich überzeugt. Dreh eine Karte um.
          </p>
          <ArgumentCheck />
          <Beispielhinweis dunkel className="mt-[18px]" />
        </div>
      </section>

      {/* Mensch statt Kennzahl */}
      <section style={{ background: F.akzent }}>
        <div className={`${BREITE} py-20 flex flex-wrap items-center gap-x-16 gap-y-6`}>
          <p className="flex-[1_1_560px] text-[clamp(22px,2.8vw,32px)] leading-[1.25] font-bold">
            Verkäufer sind keine Zahlen im CRM. Sie wissen, warum ein Kunde zögert. Im Interview sagen sie es offen,
            weil es um den Weg geht und nicht um ihre Quote.
          </p>
          <p className="flex-[1_1_280px] leading-[1.6] text-white">
            Ausgewertet von Menschen, nicht von einer Software. Damit aus Antworten ein Vertrieb wird, der dieselbe
            Geschichte erzählt.
          </p>
        </div>
      </section>

      {/* Ergebnis */}
      <section className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>Das bekommst du</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Ein Plan, <span style={{ color: F.akzent }}>den dein Vertrieb mitträgt.</span>
          </h2>
          <div className="mt-10 grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {ERGEBNIS.map((r) => (
              <article key={r.titel} className="rounded-xl p-[26px]" style={{ background: F.grau, borderTop: `6px solid ${r.farbe}` }}>
                <h3 className="text-xl leading-[1.25] font-bold">{r.titel}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss */}
      <section>
        <div className={`${BREITE} py-24 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <h2 className="flex-[1_1_560px]" style={H2_STIL}>
            Frag die, <span style={{ color: F.akzent }}>die verkaufen.</span>
          </h2>
          <Hauptknopf href={mailAn(BETREFF)}>Unverbindlich anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
