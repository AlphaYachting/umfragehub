import React, { useMemo, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { F, BREITE, H2_STIL, KONTAKT_TEL, Hauptknopf, mailAn } from "@/components/oeffentlich/Oeffentlich";
import { FAQ } from "@/inhalte/faq";

// FAQ-Sektion der öffentlichen Seiten (Image- und Informationsseiten).
// Steht jeweils vor dem Abschlussblock. Die Antworten bleiben auch zugeklappt im
// Seitenquelltext (hidden statt Entfernen), damit Suchmaschinen sie lesen.
// Platzhalter in [eckigen Klammern] werden gestrichelt markiert und nicht in die
// strukturierten Daten übernommen.

const LOOKS = {
  weiss: {
    text: F.text, daempft: F.daempft, etikett: F.etikett, kontur: F.akzent, link: F.link,
    karte: { borderTop: `1px solid ${F.linie}`, padding: "26px 0" },
    liste: { gap: 0, borderBottom: `1px solid ${F.linie}` },
    icon: { background: F.dunkel, color: "#ffffff" },
    kontakt: { background: F.dunkel, color: "#ffffff" }, kontaktText: F.hellAufDunkel, kontaktTel: "#ffffff",
    ph: { background: F.hauch, borderColor: F.akzent, color: F.link },
    beispiel: { background: F.hauch, color: F.text },
    chip: { background: "#ffffff", color: F.text, border: "1px solid #d4d4d4" },
    chipAktiv: { background: F.dunkel, color: "#ffffff", border: `1px solid ${F.dunkel}` },
  },
  rosa: {
    text: F.text, daempft: F.daempft, etikett: F.etikett, kontur: F.akzent, link: F.link,
    karte: { background: "#ffffff", borderRadius: 24, padding: "22px 28px", boxShadow: "0 14px 28px -24px rgba(45,45,45,0.45)" },
    liste: { gap: 12 },
    icon: { background: F.akzent, color: "#ffffff" },
    kontakt: { background: "#ffffff", color: F.text }, kontaktText: F.daempft, kontaktTel: F.link,
    ph: { background: F.hauch, borderColor: F.akzent, color: F.link },
    beispiel: { background: F.hauch, color: F.text },
    chip: { background: "#ffffff", color: F.text, border: `1px solid ${F.hauchRand}` },
    chipAktiv: { background: F.dunkel, color: "#ffffff", border: `1px solid ${F.dunkel}` },
  },
  grau: {
    text: F.text, daempft: F.daempft, etikett: F.etikett, kontur: F.akzent, link: F.link,
    karte: { background: "#ffffff", borderRadius: 24, padding: "22px 28px" },
    liste: { gap: 12 },
    icon: { background: F.dunkel, color: "#ffffff" },
    kontakt: { background: F.dunkel, color: "#ffffff" }, kontaktText: F.hellAufDunkel, kontaktTel: "#ffffff",
    ph: { background: F.hauch, borderColor: F.akzent, color: F.link },
    beispiel: { background: F.grau, color: F.text },
    chip: { background: "#ffffff", color: F.text, border: "1px solid #d4d4d4" },
    chipAktiv: { background: F.dunkel, color: "#ffffff", border: `1px solid ${F.dunkel}` },
  },
  dunkel: {
    text: "#ffffff", daempft: F.hellAufDunkel, etikett: F.etikettDunkel, kontur: F.etikettDunkel, link: F.etikettDunkel,
    karte: { background: F.dunkelKarte, borderRadius: 24, padding: "22px 28px" },
    liste: { gap: 12 },
    icon: { background: F.akzent, color: "#ffffff" },
    kontakt: { background: F.dunkelKarte, color: "#ffffff" }, kontaktText: F.hellAufDunkel, kontaktTel: "#ffffff",
    ph: { background: "#4a2a33", borderColor: F.etikettDunkel, color: "#ffc2d0" },
    beispiel: { background: F.dunkel, color: "#ffffff" },
    chip: { background: "transparent", color: "#ffffff", border: "1px solid #767676" },
    chipAktiv: { background: "#ffffff", color: F.dunkel, border: "1px solid #ffffff" },
  },
};

const FILTER = [
  { id: "alle", name: "Alle Fragen" },
  { id: "auftrag", name: "Für Auftraggeber" },
  { id: "eingeladen", name: "Für Eingeladene" },
];

const PLATZHALTER = /\[([^\]]+)\]/g;
const hatPlatzhalter = (s) => /\[[^\]]+\]/.test(s || "");

// Text mit Platzhaltern in Teile zerlegen und Platzhalter gestrichelt markieren.
function MitPlatzhaltern({ text, look }) {
  if (!text) return null;
  const teile = [];
  let rest = 0;
  let m;
  PLATZHALTER.lastIndex = 0;
  while ((m = PLATZHALTER.exec(text))) {
    if (m.index > rest) teile.push(text.slice(rest, m.index));
    teile.push(
      <span
        key={m.index}
        title="Platzhalter, vor dem Veröffentlichen klären"
        className="font-semibold"
        style={{
          padding: "1px 6px",
          borderRadius: 6,
          border: `1.5px dashed ${look.ph.borderColor}`,
          background: look.ph.background,
          color: look.ph.color,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {m[1]}
      </span>
    );
    rest = PLATZHALTER.lastIndex;
  }
  if (rest < text.length) teile.push(text.slice(rest));
  return <>{teile}</>;
}

// Strukturierte Daten nur für Antworten ohne offene Platzhalter.
function strukturierteDaten(fragen) {
  const fertige = fragen.filter(
    (f) => !hatPlatzhalter(f.kopf) && !hatPlatzhalter(f.text) && !(f.schritte || []).some((s) => hatPlatzhalter(s.text))
  );
  if (!fertige.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fertige.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: [f.kopf, f.text, ...(f.schritte || []).map((s) => `andi ${s.verb}. ${s.text}`)].filter(Boolean).join(" "),
      },
    })),
  };
}

export default function Faq({ seite, look: lookName = "weiss" }) {
  const daten = FAQ[seite];
  const look = LOOKS[lookName] || LOOKS.weiss;
  const [offen, setOffen] = useState({ 0: true });
  const [filter, setFilter] = useState("alle");
  const ld = useMemo(() => (daten ? strukturierteDaten(daten.fragen) : null), [daten]);
  if (!daten) return null;

  const sichtbar = daten.fragen
    .map((f, i) => ({ ...f, i }))
    .filter((f) => !daten.filter || filter === "alle" || f.g === filter);
  const anzahl = (id) => daten.fragen.filter((f) => id === "alle" || f.g === id).length;
  const umschalten = (i) => setOffen((o) => ({ ...o, [i]: !o[i] }));
  const titelId = `fragen-${seite}`;

  return (
    <section id="fragen" aria-labelledby={titelId} className="scroll-mt-4" style={{ color: look.text }}>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <div className={`${BREITE} py-[112px] flex flex-wrap items-start gap-x-16 gap-y-12`}>
        {/* Links: Überschrift und Kontakt */}
        <div className="flex-[1_1_320px] min-w-0 max-w-[400px]">
          <h2 id={titelId}>
            <span className="block text-[13px] font-medium uppercase tracking-[0.2em]" style={{ color: look.etikett }}>
              {daten.etikett}
            </span>
            <span className="block mt-3.5" style={H2_STIL}>
              {daten.titelA} <span style={{ color: F.akzent }}>{daten.titelB}</span>
            </span>
          </h2>
          <p className="mt-5 text-lg leading-[1.65]" style={{ color: look.daempft }}>{daten.lead}</p>

          {!daten.ohneKontaktkarte && (
            <div className="mt-9 p-7 rounded-3xl" style={look.kontakt}>
              <p className="text-xl leading-[1.3] font-bold">Deine Frage ist nicht dabei?</p>
              <p className="mt-2 text-base leading-[1.55]" style={{ color: look.kontaktText }}>
                Ruf an. Wir sagen dir offen, ob ein Interview in deiner Situation Sinn ergibt.
              </p>
              <a
                href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`}
                className="mt-3.5 inline-flex items-center min-h-[44px] text-[22px] font-black"
                style={{ color: look.kontaktTel, textDecoration: "none", letterSpacing: "-0.01em" }}
              >
                {KONTAKT_TEL}
              </a>
              <div className="mt-3">
                <Hauptknopf href={mailAn("andi fragt. Erstgespräch")}>Erstgespräch vereinbaren</Hauptknopf>
              </div>
            </div>
          )}
        </div>

        {/* Rechts: die Fragen */}
        <div className="flex-[999_1_560px] min-w-0">
          {daten.filter && (
            <div role="group" aria-label="Fragen filtern" className="mb-7 flex flex-wrap gap-2.5">
              {FILTER.map((c) => {
                const aktiv = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => setFilter(c.id)}
                    className="min-h-[44px] px-[18px] rounded-full inline-flex items-center gap-2 text-[15px] font-bold cursor-pointer"
                    style={{ ...(aktiv ? look.chipAktiv : look.chip), fontFamily: "inherit" }}
                  >
                    {c.name} <span className="font-semibold opacity-70">{anzahl(c.id)}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col" style={look.liste}>
            {sichtbar.map((f, n) => {
              const auf = !!offen[f.i];
              const antwortId = `${titelId}-antwort-${f.i}`;
              return (
                <article key={f.i} style={look.karte}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={auf}
                      aria-controls={antwortId}
                      onClick={() => umschalten(f.i)}
                      className="w-full text-left cursor-pointer grid items-center gap-3 sm:gap-4 grid-cols-[44px_minmax(0,1fr)_36px] sm:grid-cols-[64px_minmax(0,1fr)_40px] min-h-[44px] bg-transparent border-0 p-0"
                      style={{ fontFamily: "inherit", color: look.text }}
                    >
                      <span
                        aria-hidden="true"
                        className="text-[26px] sm:text-[34px] font-black leading-none"
                        style={{ color: "transparent", WebkitTextStroke: `1.5px ${look.kontur}` }}
                      >
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[19px] sm:text-[21px] leading-[1.3] font-bold">{f.q}</span>
                      <span
                        aria-hidden="true"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full inline-flex items-center justify-center transition-transform duration-200"
                        style={{ ...look.icon, transform: auf ? "rotate(45deg)" : "rotate(0deg)" }}
                      >
                        <Plus size={18} strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>

                  <div id={antwortId} hidden={!auf} className="pt-3.5 pb-1.5 sm:pl-20 sm:pr-14 max-w-[760px]">
                    <p className="text-[17px] leading-[1.65]" style={{ color: look.daempft }}>
                      <strong className="font-bold" style={{ color: look.text }}>
                        <MitPlatzhaltern text={f.kopf} look={look} />
                      </strong>{" "}
                      <MitPlatzhaltern text={f.text} look={look} />
                    </p>

                    {f.schritte && (
                      <ol className="mt-[18px] grid gap-3.5">
                        {f.schritte.map((s) => (
                          <li key={s.verb} className="grid gap-x-4 gap-y-1 items-baseline grid-cols-1 sm:grid-cols-[132px_minmax(0,1fr)]">
                            <span className="text-xl font-black leading-[1.1]" style={{ letterSpacing: "-0.01em", color: look.text }}>
                              andi {s.verb}<span style={{ color: F.akzent }}>.</span>
                            </span>
                            <span className="text-[17px] leading-[1.6]" style={{ color: look.daempft }}>{s.text}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {f.beispiel && (
                      <figure className="mt-5 px-5 py-[18px] rounded-[18px] flex flex-col gap-2" style={{ background: look.beispiel.background }}>
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: look.etikett }}>Aus der Praxis</span>
                          {hatPlatzhalter(f.beispiel) && (
                            <span
                              className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold"
                              style={{ border: `1.5px dashed ${look.ph.borderColor}`, color: look.ph.color }}
                            >
                              Platzhalter, echtes Beispiel einsetzen
                            </span>
                          )}
                        </span>
                        <blockquote className="m-0 text-lg leading-[1.45] font-semibold italic" style={{ color: look.beispiel.color }}>
                          {f.beispiel.replace(PLATZHALTER, "$1")}
                        </blockquote>
                      </figure>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {daten.verweis && (
            <a
              href="/#fragen"
              className="mt-7 inline-flex items-center gap-2 min-h-[44px] text-base font-bold"
              style={{ color: look.link, textDecoration: "none", borderBottom: `2px solid ${F.akzent}` }}
            >
              Ablauf, Kosten und Datenschutz: alle Fragen zu andi fragt. <ArrowRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
