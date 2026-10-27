import React, { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Modulseite 04 Vertrieb (für Vertriebsleitung, Geschäftsführung, Verkaufsteam).
// Eigener Look: dunkle Seite. Der Einstieg ist live und bleibt unverändert.
// Darunter nach dem Prototyp Vertriebserfolg: Hebelrechner, sechs Blickwinkel,
// Schätzspiel, Argument-Check, Ablauf, Ergebnis. Alle Zahlen sind Beispiele.

const BETREFF = "andi fragt. Vertriebs-Interview";
const label = "text-xs font-bold uppercase tracking-[0.14em]";
const H2_GROSS = { ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.1 };

const euro = (n) => `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;
const begrenzen = (v, min, max) => Math.max(min, Math.min(max, v));

// ---------------------------------------------------------------------------
// Hebelrechner
// ---------------------------------------------------------------------------
function Schritt({ onClick, label: text, voll, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      className="w-11 h-11 rounded-full inline-flex items-center justify-center cursor-pointer"
      style={voll ? { background: F.dunkel, color: "#ffffff", border: 0 } : { background: "#ffffff", color: F.dunkel, border: `2px solid ${F.dunkel}` }}
    >
      {children}
    </button>
  );
}

function Hebelrechner() {
  const [angebote, setAngebote] = useState(40);
  const [quote, setQuote] = useState(25);
  const [auftrag, setAuftrag] = useState(8000);
  const [an, setAn] = useState([true, false, false]);

  const basis = angebote * 12 * (quote / 100) * auftrag;
  const hebel = [
    { name: "Abschlussquote plus 5 Punkte", wie: "Von jedem zwanzigsten Angebot eines mehr gewonnen", wert: angebote * 12 * 0.05 * auftrag },
    { name: "3 % weniger Rabatt", wie: "Weil der Wert klarer ist als der Preis", wert: basis * 0.03 },
    { name: "10 % mehr Folgeaufträge", wie: "Aus Kunden, die heute einen Teil woanders kaufen", wert: basis * 0.1 },
  ];
  const plus = hebel.reduce((s, h, i) => s + (an[i] ? h.wert : 0), 0);
  const anzahl = an.filter(Boolean).length;

  const regler = [
    { name: "Angebote pro Monat", wert: String(angebote), weniger: "Fünf Angebote weniger", mehr: "Fünf Angebote mehr",
      runter: () => setAngebote((v) => begrenzen(v - 5, 5, 300)), rauf: () => setAngebote((v) => begrenzen(v + 5, 5, 300)) },
    { name: "Abschlussquote", wert: `${quote} %`, weniger: "Quote fünf Punkte niedriger", mehr: "Quote fünf Punkte höher",
      runter: () => setQuote((v) => begrenzen(v - 5, 5, 80)), rauf: () => setQuote((v) => begrenzen(v + 5, 5, 80)) },
    { name: "Durchschnittlicher Auftrag", wert: euro(auftrag), weniger: "Auftrag 1.000 Euro kleiner", mehr: "Auftrag 1.000 Euro größer",
      runter: () => setAuftrag((v) => begrenzen(v - 1000, 1000, 100000)), rauf: () => setAuftrag((v) => begrenzen(v + 1000, 1000, 100000)) },
  ];

  return (
    <div className="mt-11 flex flex-wrap items-stretch gap-6">
      <div className="flex-[1_1_420px] min-w-0 rounded-3xl p-7" style={{ background: F.grau }}>
        <p className={label} style={{ color: F.etikett }}>Deine Ausgangslage</p>
        <div className="mt-3.5 flex flex-col">
          {regler.map((r) => (
            <div key={r.name} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 py-4" style={{ borderBottom: `1px solid ${F.linie}` }}>
              <span className="text-base font-semibold">{r.name}</span>
              <span className="inline-flex items-center gap-2.5">
                <Schritt onClick={r.runter} label={r.weniger}><Minus size={18} strokeWidth={2.5} aria-hidden="true" /></Schritt>
                <span aria-live="polite" className="min-w-[96px] text-center text-[22px] font-black">{r.wert}</span>
                <Schritt onClick={r.rauf} label={r.mehr} voll><Plus size={18} strokeWidth={2.5} aria-hidden="true" /></Schritt>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[15px]" style={{ color: F.daempft }}>Umsatz aus Angeboten heute</p>
        <p className="mt-1 text-[34px] font-black">
          {euro(basis)} <span className="text-base font-semibold" style={{ color: F.daempft }}>im Jahr</span>
        </p>
      </div>

      <div className="flex-[1_1_420px] min-w-0 rounded-3xl p-7 flex flex-col text-white" style={{ background: F.dunkel }}>
        <p className={label} style={{ color: F.etikettDunkel }}>Hebel dazuschalten</p>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {hebel.map((h, i) => {
            const aktiv = an[i];
            return (
              <button
                key={h.name}
                type="button"
                aria-pressed={aktiv}
                onClick={() => setAn((alt) => alt.map((x, j) => (j === i ? !x : x)))}
                className="grid grid-cols-[28px_minmax(0,1fr)_auto] gap-3 items-center text-left min-h-[64px] px-4 py-3 rounded-[14px] text-white cursor-pointer"
                style={{ border: `2px solid ${aktiv ? F.akzent : "#4a4a4a"}`, background: aktiv ? F.dunkelKarte : "transparent" }}
              >
                <span aria-hidden="true" className="w-6 h-6 rounded-md inline-flex items-center justify-center" style={{ border: "2px solid #ffffff", background: aktiv ? "#ffffff" : "transparent" }}>
                  {aktiv && <Check size={14} strokeWidth={3.5} color={F.dunkel} />}
                </span>
                <span>
                  <span className="block text-base font-bold">{h.name}</span>
                  <span className="block mt-0.5 text-[13px]" style={{ color: F.hellAufDunkel }}>{h.wie}</span>
                </span>
                <span className="text-[15px] font-extrabold" style={{ color: aktiv ? F.etikettDunkel : "#a9a6a2" }}>+ {euro(h.wert)}</span>
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="mt-auto pt-6">
          <p className="text-[15px]" style={{ color: F.hellAufDunkel }}>
            {anzahl === 0 ? "Schalte einen Hebel dazu" : anzahl === 1 ? "Mit diesem Hebel" : `Mit diesen ${anzahl} Hebeln`}
          </p>
          <p className="mt-1 text-[clamp(34px,4vw,52px)] leading-none font-black" style={{ color: F.akzent }}>+ {euro(plus)}</p>
          {anzahl > 0 && (
            <p className="mt-2 text-[15px] font-semibold">
              Das sind {Math.round((plus / basis) * 100)} % mehr Umsatz im Jahr, mit demselben Team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sechs Blickwinkel
// ---------------------------------------------------------------------------
function Pille({ children, grund, farbe }) {
  return (
    <span className="inline-flex items-center min-h-[34px] px-3.5 rounded-full text-sm font-bold" style={{ background: grund, color: farbe }}>
      {children}
    </span>
  );
}

const BLICKWINKEL = [
  {
    titel: "Die echten Gründe hinter Ja und Nein",
    text: "Der letzte gewonnene Auftrag, das letzte verlorene Angebot: was wirklich den Ausschlag gab.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center gap-2.5">
        <Pille grund="#45d085" farbe={F.dunkel}>Gewonnen, weil</Pille>
        <Pille grund={F.akzent} farbe="#ffffff">Verloren, weil</Pille>
      </div>
    ),
  },
  {
    titel: "Der Satz, mit dem Kunden Nein sagen",
    text: "Jeder Vertrieb kennt ihn. Wir zeigen, was er wirklich bedeutet und was darauf die beste Antwort ist.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center">
        <p className="px-4 py-3 bg-white text-[15px] leading-[1.4] font-semibold" style={{ borderRadius: "18px 18px 18px 6px", color: F.dunkel }}>
          Wir überlegen es uns noch.
        </p>
      </div>
    ),
  },
  {
    titel: "Umsatz, der woanders landet",
    text: "Was Bestandskunden bei anderen kaufen, obwohl sie es bei dir bekommen könnten. Das schnellste Wachstum.",
    farbe: F.akzent,
    bild: (
      <div className="h-[84px] flex items-center gap-3">
        <span className="relative w-[72px] h-[72px] rounded-full" style={{ background: "conic-gradient(#ff3764 0 46%, #4a4a4a 46% 100%)" }}>
          <span className="absolute inset-[14px] rounded-full" style={{ background: F.dunkelKarte }} />
        </span>
        <span className="text-[13px] font-semibold leading-[1.35]" style={{ color: F.hellAufDunkel }}>kaufen einen Teil<br />woanders</span>
      </div>
    ),
  },
  {
    titel: "Kennt dein Vertrieb den Kunden?",
    text: "Kunden reihen, was ihnen wichtig ist. Dein Vertrieb tippt dieselbe Reihenfolge. Die Übereinstimmung zeigt, wie gut ihr sie kennt.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex flex-col justify-center gap-2 text-xs font-semibold">
        {[["Kunden", [F.akzent, "#ffffff", "#a9a6a2", "#5a5a5a"]], ["Vertrieb", ["#ffffff", "#5a5a5a", F.akzent, "#a9a6a2"]]].map(([wer, farben]) => (
          <div key={wer} className="grid grid-cols-[70px_repeat(4,28px)] gap-1.5 items-center">
            <span>{wer}</span>
            {farben.map((f, i) => <span key={i} className="h-[22px] rounded-md" style={{ background: f }} />)}
          </div>
        ))}
      </div>
    ),
  },
  {
    titel: "Die beste Idee kommt von unten",
    text: "Ideen aus dem Team, anonym bewertet von allen. Gewählt wird nach Kundennutzen, nicht nach Hierarchie.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex items-end gap-2">
        {[30, 46, 80, 54, 38].map((h, i) => (
          <span key={i} className="w-[30px]" style={{ height: h, borderRadius: "6px 6px 0 0", background: i === 2 ? "#45d085" : "#5a5a5a" }} />
        ))}
      </div>
    ),
  },
  {
    titel: "Signale, bevor gekauft wird",
    text: "Woran dein Außendienst merkt, dass eine größere Anschaffung ansteht. Damit du früher da bist als der Mitbewerb.",
    farbe: "#45d085",
    bild: (
      <div className="h-[84px] flex items-center gap-2.5">
        {["#5a5a5a", "#a9a6a2", "#ffffff"].map((f) => <span key={f} className="w-3 h-3 rounded-full" style={{ background: f }} />)}
        <span className="w-[18px] h-[18px] rounded-full" style={{ background: F.akzent, boxShadow: "0 0 0 6px rgba(255,55,100,0.25)" }} />
        <span className="ml-1.5 text-[13px] font-semibold" style={{ color: F.hellAufDunkel }}>vor dem Kauf</span>
      </div>
    ),
  },
];

// ---------------------------------------------------------------------------
// Schätzspiel: Vertrieb gegen Kunden (Beispielwerte, je Spalte 100 %)
// ---------------------------------------------------------------------------
const GRUENDE = [
  { name: "Preis zu hoch", v: 58, k: 19 },
  { name: "Nutzen nicht klar", v: 9, k: 31 },
  { name: "Zu langsam", v: 14, k: 22 },
  { name: "Kein Nachfassen", v: 4, k: 18 },
  { name: "Mitbewerb besser", v: 15, k: 10 },
];

function Schaetzspiel() {
  const [wahl, setWahl] = useState(null);
  let titel = "";
  let text = "";
  if (wahl !== null) {
    const g = GRUENDE[wahl];
    if (g.name === "Preis zu hoch") {
      titel = "Das sagt auch dein Vertrieb.";
      text = "Die Kunden sehen es im Beispiel anders: Nur 19 % nennen den Preis, 31 % einen unklaren Nutzen. Der Preis ist oft das Wort, nicht der Grund.";
    } else if (g.k > g.v) {
      titel = "Gute Spur.";
      text = `Im Beispiel nennen ${g.k} % der Kunden diesen Grund, aber nur ${g.v} % des Vertriebs. Genau solche blinden Flecken kosten Abschlüsse.`;
    } else {
      titel = "Vertrieb und Kunden sehen es ähnlich.";
      text = "Bei diesem Grund liegen beide nah beieinander. Den größten Abstand gibt es im Beispiel beim Preis: 58 % im Vertrieb, 19 % bei Kunden.";
    }
  }

  return (
    <>
      <div role="group" aria-label="Häufigster Grund für ein verlorenes Angebot" className="mt-9 flex flex-wrap gap-2.5">
        {GRUENDE.map((g, i) => {
          const an = wahl === i;
          return (
            <button
              key={g.name}
              type="button"
              aria-pressed={an}
              onClick={() => setWahl(i)}
              className="min-h-[48px] px-5 rounded-full text-base font-bold cursor-pointer"
              style={{ border: `2px solid ${F.dunkel}`, background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.dunkel }}
            >
              {g.name}
            </button>
          );
        })}
      </div>
      {wahl !== null && (
        <div aria-live="polite" className="mt-9 rounded-3xl p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ border: `2px solid ${F.dunkel}` }}>
          <div className="flex-[1_1_500px] min-w-0">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold">
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 rounded" style={{ background: F.dunkel }} />Dein Vertrieb im Beispiel</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 rounded" style={{ background: F.akzent }} />Kunden im Beispiel</span>
            </div>
            <ul className="mt-[18px] flex flex-col gap-4">
              {GRUENDE.map((g, i) => (
                <li key={g.name}>
                  <p className="text-[15px]" style={{ fontWeight: wahl === i ? 800 : 600 }}>
                    {g.name}{wahl === i ? " (dein Tipp)" : ""}
                  </p>
                  <div className="mt-[7px] grid grid-cols-[minmax(0,1fr)_44px] gap-x-2.5 gap-y-1 items-center text-[13px] font-bold">
                    <span className="h-2.5 rounded-full" style={{ background: F.grau }}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round((g.v / 60) * 100)}%`, background: F.dunkel }} />
                    </span>
                    <span>{g.v} %</span>
                    <span className="h-2.5 rounded-full" style={{ background: F.grau }}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round((g.k / 60) * 100)}%`, background: F.akzent }} />
                    </span>
                    <span style={{ color: F.link }}>{g.k} %</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-[1_1_300px] min-w-0 flex flex-col justify-center">
            <p className="text-[30px] leading-[1.15] font-black uppercase">{titel}</p>
            <p className="mt-3.5 text-[17px] leading-[1.6]" style={{ color: F.daempft }}>{text}</p>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Argument-Check
// ---------------------------------------------------------------------------
const TOENE = { gut: "#45d085", schlecht: "#ff3764", neutral: "#cfcbc7" };

const ARGUMENTE = [
  { text: "Wir sind seit über 30 Jahren am Markt.", urteil: "Egal", erklaerung: "Kunden setzen Erfahrung voraus. Gekauft wird wegen etwas anderem.", ton: "neutral" },
  { text: "Wir haben das beste Preis-Leistungs-Verhältnis.", urteil: "Schreckt ab", erklaerung: "Klingt nach Rabatt. Führt direkt in die Preisverhandlung.", ton: "schlecht" },
  { text: "Ihr fixer Ansprechpartner ist auch nach dem Kauf für Sie da.", urteil: "Zieht", erklaerung: "Der meistgenannte Kaufgrund, aber im Gespräch fast nie erwähnt.", ton: "gut" },
  { text: "Wir liefern alles aus einer Hand.", urteil: "Zieht teilweise", erklaerung: "Überzeugt Neukunden, Stammkunden ist es zu allgemein.", ton: "neutral" },
];

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

// ---------------------------------------------------------------------------
// Ablauf und Ergebnis
// ---------------------------------------------------------------------------
const ABLAUF = [
  { titel: "Kickoff mit dir", text: "Deine Ziele, deine Thesen und wer im Haus die Kunden wirklich kennt." },
  { titel: "Interviews im Vertrieb", text: "Außendienst, Innendienst und Service, anonym und in ihren eigenen Worten." },
  { titel: "Interviews mit Kunden", text: "Gewonnene, verlorene und Bestandskunden. Dieselben Themen, von der anderen Seite." },
  { titel: "Ideen bewerten", text: "Die besten Ideen aus dem Team, anonym bewertet von allen. Nach Kundennutzen, nicht nach Hierarchie." },
  { titel: "Workshop und Plan", text: "Mit dir und deinem Vertriebsteam: die drei stärksten Hebel und ein Plan für 90 Tage.", dunkel: true },
];

const ERGEBNIS = [
  { titel: "Deine drei stärksten Hebel", text: "Wo bei dir am meisten Umsatz liegt: Chancen, Abschlüsse oder Auftragswert.", beispiel: "Zuerst Bestand, dann Abschlussquote.", farbe: "#ff3764" },
  { titel: "Argumente, die ziehen", text: "Welche Sätze überzeugen und welche ihr streichen solltet.", beispiel: "Fixer Ansprechpartner nach vorne, 30 Jahre am Markt nach hinten.", farbe: "#45d085" },
  { titel: "Antworten auf das Nein", text: "Die häufigsten Einwände und was Kunden damit wirklich meinen.", beispiel: "Zu teuer heißt oft: Ich sehe den Unterschied nicht.", farbe: "#2d2d2d" },
  { titel: "Plan für 90 Tage", text: "Konkrete Schritte mit deinem Vertriebsteam, und nach sechs Monaten ein Puls.", beispiel: "Jedes Angebot nach drei Tagen persönlich nachfassen.", farbe: "#e02551" },
];

export default function Vertrieb() {
  return (
    <Modulseite titel="Vertrieb | andi fragt." modul="Vertrieb" hintergrund={F.dunkel} dunkel>
      {/* Einstieg mit Foto im gestrichelten Ring (live, unverändert) */}
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

      {/* Hebelrechner */}
      <section id="rechner" className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>Was ein Hebel wert ist</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            Ein paar Prozent. <span style={{ color: F.akzent }}>Rechne selbst, was sie bringen.</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
            Stell deine Zahlen ungefähr ein. Dann schalte die Hebel dazu, an denen wir mit dir arbeiten.
          </p>
          <Hebelrechner />
          <Beispielhinweis className="mt-4 max-w-[820px]">
            Rechenbeispiel mit deinen Annahmen, die Hebel einfach addiert. Keine Zusage. Es zeigt, was ein einzelner Hebel
            wert ist und warum es sich lohnt, genau dort nachzufragen.
          </Beispielhinweis>
        </div>
      </section>

      {/* Sechs Blickwinkel */}
      <section>
        <div className={`${BREITE} py-[104px]`}>
          <Etikett dunkel>Mehr als eine Verkaufsstatistik</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            Sechs Blickwinkel, <span style={{ color: F.akzent }}>die in keinem CRM stehen.</span>
          </h2>
          <div className="mt-11 grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
            {BLICKWINKEL.map((b, i) => (
              <article key={b.titel} className="rounded-2xl p-7" style={{ background: F.dunkelKarte, borderTop: `6px solid ${b.farbe}` }}>
                <div aria-hidden="true">{b.bild}</div>
                <p className="mt-4 text-[13px] font-bold" style={{ color: F.etikettDunkel }}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-[22px] leading-[1.2] font-bold">{b.titel}</h3>
                <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: F.hellAufDunkel }}>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Schätzspiel */}
      <section id="test" className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>Vertriebssicht gegen Kundensicht</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_GROSS}>
            Schätz mal: <span style={{ color: F.akzent }}>Warum gehen Angebote verloren?</span>
          </h2>
          <p className="mt-[18px] max-w-[680px]" style={{ ...TEXT_STIL, lineHeight: 1.6, color: F.daempft }}>
            Tipp auf den Grund, den du für den häufigsten hältst. Dann siehst du, was Vertrieb und Kunden in einem
            Beispiel gesagt haben.
          </p>
          <Schaetzspiel />
          <Beispielhinweis className="mt-4">
            Die Werte sind Beispiele zur Veranschaulichung, keine Ergebnisse eines bestimmten Unternehmens.
          </Beispielhinweis>
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

      {/* So läuft es */}
      <section className="bg-white" style={{ color: F.text }}>
        <div className={`${BREITE} py-24`}>
          <Etikett>So läuft es</Etikett>
          <h2 className="mt-3 max-w-[860px]" style={H2_STIL}>
            Von der ersten Frage <span style={{ color: F.akzent }}>zum Plan für 90 Tage.</span>
          </h2>
          <ol className="mt-11 grid gap-3 grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
            {ABLAUF.map((s, i) => (
              <li
                key={s.titel}
                className="rounded-2xl p-[22px] min-h-[190px]"
                style={{ background: s.dunkel ? F.dunkel : F.grau, color: s.dunkel ? "#ffffff" : F.dunkel }}
              >
                <span
                  className="inline-flex w-9 h-9 rounded-full items-center justify-center font-black text-white"
                  style={{ background: s.dunkel ? F.akzent : F.dunkel }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3.5 text-lg leading-[1.25] font-bold">{s.titel}</h3>
                <p className="mt-2 text-sm leading-[1.55] opacity-85">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl px-[22px] py-5 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ border: `2px dashed ${F.akzent}` }}>
            <span className="text-[13px] font-extrabold uppercase tracking-[0.12em]" style={{ color: F.etikett }}>Nach 6 Monaten</span>
            <span className="text-[17px] font-bold">Kurzer Puls im Vertrieb: Was ist umgesetzt, und hat sich die Abschlussquote bewegt?</span>
          </div>
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
                <p className="mt-3.5 px-3.5 py-3 rounded-[10px] bg-white text-sm leading-[1.45] font-semibold italic">{r.beispiel}</p>
              </article>
            ))}
          </div>
          <Beispielhinweis className="mt-[18px]">Die Sätze in den Karten sind Beispiele.</Beispielhinweis>
        </div>
      </section>

      {/* Häufige Fragen */}
      <Faq seite="vertrieb" look="dunkel" />

      {/* Abschluss */}
      <section>
        <div className={`${BREITE} py-24 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <h2 className="flex-[1_1_560px]" style={H2_STIL}>
            Bevor du in die nächste Idee investierst: <span style={{ color: F.akzent }}>frag die, die verkaufen.</span>
          </h2>
          <Hauptknopf href={mailAn(BETREFF)}>Unverbindlich anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
