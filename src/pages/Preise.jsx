import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, Minus, Plus } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, H2_STIL, Hauptknopf, KONTAKT_TEL, Kleinlabel, LEAD_STIL, MODULE, Modulseite, TEXT_STIL, Wortmarke,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Öffentliche Preisseite von andifragt.at (Stand 27.10.2026, nach Prototyp "Preisseite: Entwurf").
//
// Preislogik: Das erste Modul ist das Basismodul. Jedes weitere Modul kostet deutlich
// weniger, weil es auf Zielgespräch und Einschätzung aufbaut. Ab zwei Modulen ist der
// Abgleich der Sichtweisen inklusive. Alle vier Module haben einen eigenen Paketpreis.
// Gestaffelt wird nach Gruppengröße, nie pro Kopf.
//
// Typografie wie auf den Modulseiten: Gilroy hat keine Gedankenstriche, typografischen
// Anführungszeichen oder Mittelpunkte. Sprachregel: immer Interview, nie Befragung.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;
const KONTAKT = "/kontakt";

const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
const runden = (n) => Math.round(n / 100) * 100;

// Preisstufen je Modul. basis = erstes Modul, weiteres = jedes weitere, paket = alle vier.
const STUFEN = [
  { id: "klein", name: "Kleinbetrieb", hinweis: "bis 6 im Team, bis 20 Kunden", basis: 2900, weiteres: 1100, paket: 5900, welle: 500 },
  { id: "b20", name: "6 bis 20 Personen", basis: 3800, weiteres: 1500, paket: 7900, welle: 900 },
  { id: "b50", name: "21 bis 50 Personen", basis: 5400, weiteres: 2100, paket: 10900, welle: 900 },
  { id: "b100", name: "51 bis 100 Personen", basis: 7400, weiteres: 2900, paket: 14900, welle: 900 },
  { id: "gross", name: "über 100 Personen", basis: null },
];
const KLEIN = STUFEN[0];
const EINSTIEG = 950;
const MAX_WELLEN = 4;

const LAGEN = [
  { id: "team", thema: "Team", text: "Gute Leute gehen, oder es bewerben sich die Falschen.", empfehlung: "Wir schauen gemeinsam, was dein Team hält und was es bremst. Oft ist das Team-Interview der richtige Start, manchmal reicht schon der Einstieg mit Fragen an dich." },
  { id: "kunden", thema: "Kunden", text: "Kunden kaufen seltener oder springen ab, und keiner weiß genau warum.", empfehlung: "Wir klären, was deine Kunden wirklich erleben und was sie halten würde. Meist passt das Kunden-Interview, oft gemeinsam mit deinem Team." },
  { id: "vertrieb", thema: "Vertrieb", text: "Angebote gehen raus, aber zu wenige werden unterschrieben.", empfehlung: "Wir finden heraus, wo im Verkauf die Argumente nicht ankommen. Dein Vertrieb weiß dazu meist mehr, als in jeder Statistik steht." },
  { id: "positionierung", thema: "Positionierung", text: "Wir sind gut, aber von außen sehen wir aus wie alle anderen.", empfehlung: "Wir holen die Stärken ab, die dein Team kennt, und prüfen, ob deine Kunden sie sehen. Daraus entsteht eine Positionierung, die man erkennt." },
  { id: "unklar", thema: "Standortbestimmung", text: "Irgendetwas passt nicht, ich kann es noch nicht benennen.", empfehlung: "Genau dafür ist das Erstgespräch da. Oft ist der Einstieg mit Fragen an dich der beste erste Schritt." },
];

// ---------- kleine Bausteine ----------

function Pille({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 min-h-[36px] px-4 rounded-full text-sm font-medium"
      style={{ background: F.hauch, border: `1px solid ${F.hauchRand}` }}
    >
      <Check size={16} strokeWidth={2.5} aria-hidden="true" style={{ color: F.etikett }} />
      {children}
    </span>
  );
}

function Punkt({ children, farbe = F.etikett }) {
  return (
    <li className="flex gap-2.5">
      <Check size={18} strokeWidth={2.5} aria-hidden="true" className="shrink-0 mt-[3px]" style={{ color: farbe }} />
      <span>{children}</span>
    </li>
  );
}

function Preis({ ab, betrag, nach, hell = false, groesse = 38 }) {
  const leise = hell ? F.hellAufDunkel : F.daempft;
  return (
    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {ab && <span className="text-sm" style={{ color: leise }}>ab</span>}
      <span className="font-black leading-none whitespace-nowrap" style={{ fontSize: groesse }}>{betrag}</span>
      <span className="text-sm whitespace-nowrap" style={{ color: leise }}>{nach}</span>
    </p>
  );
}

function Kartenknopf({ to, href, children, voll = false, dunkel = false }) {
  const stil = voll
    ? { background: dunkel ? F.dunkel : F.akzent, color: "#ffffff", textDecoration: "none" }
    : { border: `1px solid ${F.dunkel}`, color: F.text, textDecoration: "none" };
  const klasse = "inline-flex items-center gap-2 min-h-[48px] px-5 rounded text-sm font-semibold";
  return to ? (
    <Link to={to} className={klasse} style={stil}>{children}</Link>
  ) : (
    <a href={href} className={klasse} style={stil}>{children}</a>
  );
}

// Preistreppe unter den Karten: zeigt, wie der Preis je Modul sinkt.
// Umschaltbar zwischen Kleinbetrieb und 6 bis 20 Personen.
function Treppe() {
  const [stufeId, setStufeId] = useState("klein");
  const s = STUFEN.find((x) => x.id === stufeId);
  const reihe = [
    { name: "1 Modul", preis: s.basis, je: s.basis, spart: false },
    { name: "2 Module", preis: s.basis + s.weiteres, je: (s.basis + s.weiteres) / 2, spart: true },
    { name: "Alle 4 Module", preis: s.paket, je: s.paket / 4, spart: true },
  ];
  return (
    <div
      className="mt-5 p-7 md:p-8 rounded-[20px] grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-center"
      style={{ background: F.dunkel, color: "#ffffff" }}
    >
      <div>
        <p className="text-xl font-black leading-[1.25]">
          Je mehr Blickwinkel, <span style={{ color: F.akzent }}>desto günstiger jeder einzelne.</span>
        </p>
        <p className="mt-2 text-sm leading-[1.55]" style={{ color: F.hellAufDunkel }}>
          Ab zwei Modulen ist der Abgleich der Sichtweisen inklusive.
        </p>
        <div role="group" aria-label="Betriebsgröße" className="mt-4 flex flex-wrap gap-2">
          {["klein", "b20"].map((id) => {
            const an = id === stufeId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={an}
                onClick={() => setStufeId(id)}
                className="min-h-[44px] px-4 rounded-full text-sm font-semibold cursor-pointer"
                style={{ background: an ? "#ffffff" : "transparent", color: an ? F.dunkel : "#ffffff", border: "1px solid #ffffff", fontFamily: "inherit" }}
              >
                {id === "klein" ? "Kleinbetrieb" : "6 bis 20 Personen"}
              </button>
            );
          })}
        </div>
      </div>
      <ol className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {reihe.map((x) => (
          <li key={x.name} className="p-4 rounded-xl" style={{ background: F.dunkelKarte }}>
            <p className="text-[13px]" style={{ color: F.hellAufDunkel }}>{x.name}</p>
            <p className="mt-1.5 text-[26px] font-black leading-none whitespace-nowrap">{fmt(x.preis)}</p>
            <p className="mt-2 text-[13px] font-semibold whitespace-nowrap" style={{ color: x.spart ? F.akzent : F.hellAufDunkel }}>
              {fmt(x.je)} je Modul
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- Rechner ----------

function Rechner() {
  const [mods, setMods] = useState(["kunden"]);
  const [stufeId, setStufeId] = useState("klein");
  const [wellen, setWellen] = useState(0);
  const [puls, setPuls] = useState(false);

  const stufe = STUFEN.find((s) => s.id === stufeId);
  const gewaehlt = mods.map((id) => MODULE.find((m) => m.id === id)).filter(Boolean);
  const n = gewaehlt.length;
  const keinModul = n === 0;
  const aufAnfrage = !keinModul && !stufe.basis;
  const zeigPreis = !keinModul && !!stufe.basis;

  const zeilen = [];
  let modulSumme = 0;
  let summe = 0;
  if (zeigPreis) {
    zeilen.push({ label: `Basismodul ${gewaehlt[0].name}${stufe.id === "klein" ? ", Kleinbetrieb" : ""}`, betrag: fmt(stufe.basis) });
    gewaehlt.slice(1).forEach((m) => zeilen.push({ label: `Weiteres Modul ${m.name}`, betrag: fmt(stufe.weiteres) }));
    modulSumme = stufe.basis + (n - 1) * stufe.weiteres;
    if (n === 4 && stufe.paket < modulSumme) {
      zeilen.push({ label: "Vorteil für alle vier Module", betrag: "-" + fmt(modulSumme - stufe.paket) });
      modulSumme = stufe.paket;
    }
    if (n >= 2) zeilen.push({ label: "Abgleich der Sichtweisen", betrag: "inklusive" });
    summe = modulSumme;
    if (wellen > 0) {
      zeilen.push({ label: `${wellen} ${wellen === 1 ? "zusätzliche Welle" : "zusätzliche Wellen"}`, betrag: fmt(stufe.welle * wellen) });
      summe += stufe.welle * wellen;
    }
    zeilen.push({ label: "Rücklaufgarantie", betrag: "inklusive" });
  }
  const pulsSumme = zeigPreis ? 2 * runden(modulSumme * 0.4) : 0;

  const naechstes = MODULE.find((m) => !mods.includes(m.id));
  let anstoss = "";
  if (zeigPreis && naechstes) {
    if (n === 1) anstoss = `Ein zweiter Blickwinkel kostet nur ${fmt(stufe.weiteres)}, und den Abgleich zwischen beiden Sichtweisen bekommst du dazu.`;
    else if (n === 2) anstoss = `Mit einem dritten Modul zahlst du ${fmt(stufe.weiteres)} mehr. Der Preis je Modul sinkt auf ${fmt((stufe.basis + 2 * stufe.weiteres) / 3)}.`;
    else if (n === 3) anstoss = `Das vierte Modul kostet dich nur noch ${fmt(stufe.paket - modulSumme)}. Dann hast du alle Blickwinkel.`;
  }

  const umschalten = (id) => setMods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const chip = (an) => ({
    background: an ? F.dunkel : "#ffffff",
    color: an ? "#ffffff" : F.text,
    border: `1px solid ${an ? F.dunkel : "#d6d3d0"}`,
    fontFamily: "inherit",
  });

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-12 items-start">
      <div className="flex flex-col gap-9">
        <fieldset>
          <legend className="text-lg font-bold">1. Welche Module?</legend>
          <p className="mt-1.5 text-[15px]" style={{ color: F.daempft }}>
            Das erste ist dein Basismodul. Jedes weitere kostet deutlich weniger, und ab zwei Modulen zeigen wir dir, wo sich die Sichtweisen unterscheiden.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {MODULE.map((m) => {
              const an = mods.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={an}
                  onClick={() => umschalten(m.id)}
                  className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded-full text-[15px] font-semibold cursor-pointer"
                  style={chip(an)}
                >
                  {an && <Check size={16} strokeWidth={2.5} aria-hidden="true" />}
                  {m.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">2. Wie viele Menschen pro Modul?</legend>
          <p className="mt-1.5 text-[15px]" style={{ color: F.daempft }}>
            Kleinbetriebe rechnen wir pauschal. Ab 6 Personen pro Gruppe ist niemand erkennbar, in kleinen Teams fassen wir alle Antworten zusammen.
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
            {STUFEN.map((s) => {
              const an = s.id === stufeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setStufeId(s.id)}
                  className="flex flex-col items-start gap-0.5 min-h-[64px] px-4 py-3 rounded-lg text-left cursor-pointer"
                  style={chip(an)}
                >
                  <span className="text-base font-bold">{s.name}</span>
                  {s.hinweis && <span className="text-[13px] opacity-80">{s.hinweis}</span>}
                  {s.basis ? (
                    <>
                      <span className="text-[13px] opacity-80 whitespace-nowrap">Basis {fmt(s.basis)}</span>
                      <span className="text-[13px] opacity-80 whitespace-nowrap">jedes weitere {fmt(s.weiteres)}</span>
                    </>
                  ) : (
                    <span className="text-[13px] opacity-80">auf Anfrage</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">3. Zusätzliche Wellen oder Gruppen</legend>
          <p className="mt-1.5 text-[15px]" style={{ color: F.daempft }}>
            Zum Beispiel Führungskräfte und Team getrennt einladen. Je 900 €, beim Kleinbetrieb 500 €.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 p-1 rounded-lg bg-white" style={{ border: "1px solid #d6d3d0" }}>
            <button
              type="button"
              aria-label="Eine Welle weniger"
              disabled={wellen <= 0}
              onClick={() => setWellen((w) => Math.max(0, w - 1))}
              className="w-11 h-11 inline-flex items-center justify-center rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-default"
              style={{ background: F.grau, color: F.text }}
            >
              <Minus size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <output aria-live="polite" className="min-w-[56px] text-center text-[22px] font-black">{wellen}</output>
            <button
              type="button"
              aria-label="Eine Welle mehr"
              disabled={wellen >= MAX_WELLEN}
              onClick={() => setWellen((w) => Math.min(MAX_WELLEN, w + 1))}
              className="w-11 h-11 inline-flex items-center justify-center rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-default"
              style={{ background: F.grau, color: F.text }}
            >
              <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-bold">4. Dranbleiben?</legend>
          <button
            type="button"
            role="switch"
            aria-checked={puls}
            onClick={() => setPuls((p) => !p)}
            className="mt-4 w-full flex items-center gap-4 px-5 py-[18px] rounded-lg bg-white text-left cursor-pointer"
            style={{ border: "1px solid #d6d3d0", color: F.text, fontFamily: "inherit" }}
          >
            <span
              aria-hidden="true"
              className="relative shrink-0 w-12 h-7 rounded-full transition-colors"
              style={{ background: puls ? F.gut : "#c9c6c3" }}
            >
              <span
                className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white transition-[left]"
                style={{ left: puls ? 23 : 3, boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
              />
            </span>
            <span className="flex flex-col">
              <span className="text-base font-bold">andi bleibt dran. Zwei Pulse im Jahr</span>
              <span className="text-sm" style={{ color: F.daempft }}>
                Mit demselben Kern nachfragen und Veränderungen messen. 40 % des Interviewpreises je Puls.
              </span>
            </span>
          </button>
        </fieldset>
      </div>

      <aside aria-label="Dein Richtpreis" className="p-8 rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
        <Kleinlabel dunkel>Dein Richtpreis</Kleinlabel>

        {keinModul && (
          <p className="mt-5 text-xl font-bold leading-[1.4]">Wähle mindestens ein Modul, dann rechnen wir mit.</p>
        )}

        {aufAnfrage && (
          <>
            <p className="mt-5 text-[28px] font-black leading-[1.2]">Individuell</p>
            <p className="mt-3 text-base leading-[1.6]" style={{ color: "#e4e4e4" }}>
              Ab 100 Menschen pro Modul planen wir meist mehrere Wellen nach Bereichen. Den Preis klären wir im Erstgespräch.
            </p>
          </>
        )}

        {zeigPreis && (
          <>
            <ul className="mt-5 flex flex-col">
              {zeilen.map((z) => (
                <li key={z.label} className="flex justify-between gap-4 py-3 text-[15px]" style={{ borderBottom: "1px solid #4a4a4a" }}>
                  <span style={{ color: "#e4e4e4" }}>{z.label}</span>
                  <span className="shrink-0 font-semibold">{z.betrag}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <span className="text-[15px]" style={{ color: F.hellAufDunkel }}>einmalig</span>
              <span className="text-[48px] font-black leading-none" style={{ color: F.akzent }} aria-live="polite">{fmt(summe)}</span>
            </div>
            {n >= 2 && (
              <p className="mt-2.5 text-sm leading-[1.5] text-right" style={{ color: F.hellAufDunkel }}>
                Das sind <strong className="text-white">{fmt(modulSumme / n)}</strong> je Modul.
                <br />
                Einzeln nacheinander gebucht: <s>{fmt(n * stufe.basis)}</s>
              </p>
            )}
            {puls && (
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-[15px]" style={{ color: F.hellAufDunkel }}>plus Dranbleiben pro Jahr</span>
                <span className="text-2xl font-bold leading-none">{fmt(pulsSumme)}</span>
              </div>
            )}
            {anstoss && naechstes && (
              <div className="mt-6 p-4 rounded-lg" style={{ border: `1px dashed ${F.akzent}` }}>
                <p className="text-[15px] leading-[1.5]">{anstoss}</p>
                <button
                  type="button"
                  onClick={() => umschalten(naechstes.id)}
                  className="mt-3 inline-flex items-center gap-2 min-h-[44px] px-4 rounded text-sm font-semibold cursor-pointer"
                  style={{ border: "1px solid #ffffff", background: "transparent", color: "#ffffff", fontFamily: "inherit" }}
                >
                  <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                  {naechstes.name} dazunehmen
                </button>
              </div>
            )}
            <p className="mt-6 px-4 py-3.5 rounded-lg text-sm leading-[1.55]" style={{ background: F.dunkelKarte, color: "#e4e4e4" }}>
              Hast du schon den Einstieg um {fmt(EINSTIEG)} gebucht, ziehen wir ihn hier voll ab.
            </p>
          </>
        )}

        <Link
          to={KONTAKT}
          className="mt-7 flex items-center justify-center gap-2 min-h-[52px] px-6 rounded text-sm font-semibold uppercase tracking-[0.04em]"
          style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
        >
          Erstgespräch vereinbaren <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <p className="mt-4 text-[13px] text-center" style={{ color: F.hellAufDunkel }}>
          Erstgespräch kostenlos. Alle Preise netto, zuzüglich 20 % USt.
        </p>
      </aside>
    </div>
  );
}

// ---------- Erstgespräch mit Lagewahl ----------

function Lagewahl() {
  const [lageId, setLageId] = useState(null);
  const lage = LAGEN.find((l) => l.id === lageId);
  return (
    <div className="p-8 rounded-[20px]" style={{ background: F.hauch, border: `1px solid ${F.hauchRand}` }}>
      <fieldset>
        <legend className="text-[22px] font-black leading-[1.2]">Wo drückt der Schuh?</legend>
        <p className="mt-2 text-[15px]" style={{ color: F.daempft }}>Wähle, was am ehesten passt. Wir bereiten uns darauf vor.</p>
        <div className="mt-5 flex flex-col gap-2.5">
          {LAGEN.map((l) => {
            const an = l.id === lageId;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={an}
                onClick={() => setLageId(l.id)}
                className="flex items-center gap-3.5 w-full min-h-[56px] px-4 py-3 rounded-lg bg-white text-left text-[15px] font-medium leading-[1.4] cursor-pointer"
                style={{ border: an ? `2px solid ${F.akzent}` : "1px solid #e8c9d1", color: F.text, fontFamily: "inherit" }}
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 w-[18px] h-[18px] rounded-full box-border"
                  style={{ border: an ? `6px solid ${F.akzent}` : "2px solid #b5b2af" }}
                />
                <span>{l.text}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {lage && (
        <div aria-live="polite" className="mt-6 p-5 rounded-xl bg-white">
          <Kleinlabel style={{ color: F.etikett }}>Darüber reden wir: {lage.thema}</Kleinlabel>
          <p className="mt-2 text-base leading-[1.6]">{lage.empfehlung}</p>
        </div>
      )}
      <Link
        to={KONTAKT}
        className="mt-6 flex items-center justify-center gap-2 min-h-[52px] px-6 rounded text-sm font-semibold uppercase tracking-[0.04em]"
        style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
      >
        Kostenloses Erstgespräch <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <p className="mt-3 text-sm text-center" style={{ color: F.daempft }}>
        Oder ruf einfach an:{" "}
        <a href={TEL_LINK} className="font-semibold whitespace-nowrap" style={{ color: F.text }}>{KONTAKT_TEL}</a>
      </p>
    </div>
  );
}

// ---------- Tabellen ----------

const ZELLE = "px-5 py-4 text-right font-bold whitespace-nowrap";
const KOPFZELLE = "px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.12em]";

function Preistabellen() {
  return (
    <>
      <div className="mt-10 overflow-x-auto rounded-xl" style={{ border: `1px solid ${F.linie}` }}>
        <table className="w-full min-w-[640px] border-collapse text-base">
          <caption className="px-5 pt-4 text-left text-lg font-bold" style={{ captionSide: "top" }}>Interview-Module</caption>
          <thead>
            <tr style={{ color: F.daempft }}>
              <th scope="col" className={`${KOPFZELLE} text-left`}>Personen pro Modul</th>
              <th scope="col" className={`${KOPFZELLE} text-right`}>Basismodul</th>
              <th scope="col" className={`${KOPFZELLE} text-right`}>Jedes weitere</th>
              <th scope="col" className={`${KOPFZELLE} text-right`}>Alle vier Module</th>
            </tr>
          </thead>
          <tbody>
            {STUFEN.map((s) => (
              <tr key={s.id} style={{ borderTop: `1px solid ${F.linie}` }}>
                <th scope="row" className="px-5 py-4 text-left font-semibold">
                  {s.id === "klein" ? `Kleinbetrieb, ${s.hinweis}` : s.name}
                </th>
                <td className={ZELLE}>{s.basis ? fmt(s.basis) : "auf Anfrage"}</td>
                <td className={ZELLE} style={s.basis ? { color: F.etikett } : undefined}>{s.basis ? fmt(s.weiteres) : "auf Anfrage"}</td>
                <td className={ZELLE}>{s.basis ? fmt(s.paket) : "auf Anfrage"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl" style={{ border: `1px solid ${F.linie}` }}>
        <table className="w-full min-w-[560px] border-collapse text-base">
          <caption className="px-5 pt-4 text-left text-lg font-bold" style={{ captionSide: "top" }}>Dazu</caption>
          <thead>
            <tr style={{ color: F.daempft }}>
              <th scope="col" className={`${KOPFZELLE} text-left`}>Leistung</th>
              <th scope="col" className={`${KOPFZELLE} text-right`}>Preis netto</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Erstgespräch, 30 Minuten", "0 €"],
              ["Einstieg: Zielgespräch und Fragen an die Geschäftsführung, voll angerechnet", fmt(EINSTIEG)],
              ["Zusätzliche Welle oder Gruppe", "900 €, Kleinbetrieb 500 €"],
              ["Abgleich der Sichtweisen ab zwei Modulen", "inklusive"],
              ["Puls einzeln", "45 % des Interviewpreises"],
              ["Jahresbegleitung mit zwei Pulsen", "je 40 % des Interviewpreises"],
            ].map(([l, p]) => (
              <tr key={l} style={{ borderTop: `1px solid ${F.linie}` }}>
                <th scope="row" className="px-5 py-4 text-left font-semibold">{l}</th>
                <td className={ZELLE}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm" style={{ color: F.daempft }}>
        Alle Preise netto, zuzüglich 20 % USt. Fixpreise, keine Abrechnung nach Stunden. Der Preis für weitere Module gilt,
        wenn du sie innerhalb von sechs Monaten nach deinem Basismodul startest.
      </p>
    </>
  );
}

// ---------- Seite ----------

export default function Preise() {
  return (
    <Modulseite titel="Preise | andi fragt. Rittler & Co, Graz" modul="Preise">
      {/* Einstieg */}
      <section className={`${BREITE} pt-14 pb-[72px]`}>
        <Etikett>Preise</Etikett>
        <h1 className="mt-4 max-w-[980px]" style={H1_STIL}>
          Du zahlst für die richtigen Fragen. <span style={{ color: F.akzent }}>Nicht pro Kopf.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, maxWidth: 700, color: F.daempft }}>
          Bei <strong className="font-semibold" style={{ color: F.text }}>andi fragt.</strong> bezahlst du für das, was vor und nach den
          Antworten passiert: die Einschätzung, welche Fragen dein Unternehmen wirklich weiterbringen, und die Auswertung, die daraus
          eine Entscheidung macht. Deshalb gibt es Fixpreise statt Stundenzettel.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Pille>Erstgespräch kostenlos</Pille>
          <Pille>Jedes weitere Modul deutlich günstiger</Pille>
          <Pille>Einstieg wird voll angerechnet</Pille>
          <Pille>Rücklaufgarantie inklusive</Pille>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Hauptknopf href="#erstgespraech">Kostenloses Erstgespräch</Hauptknopf>
          <a
            href="#rechner"
            className="inline-flex items-center justify-center min-h-[48px] px-6 rounded text-sm font-semibold"
            style={{ border: "1px solid #d6d3d0", color: F.text, textDecoration: "none" }}
          >
            Preis berechnen
          </a>
        </div>
      </section>

      {/* Vier Schritte: kurze Karten, Details stehen im Rechner und in den Tabellen */}
      <section className="py-24" style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className={BREITE}>
          <Etikett>In vier Schritten</Etikett>
          <h2 className="mt-3 max-w-[820px]" style={H2_STIL}>
            Erst reden. Dann klein anfangen. <span style={{ color: F.akzent }}>Dann richtig.</span>
          </h2>
          <p className="mt-4 max-w-[640px] text-lg leading-[1.6]" style={{ color: F.daempft }}>
            Du entscheidest nach jedem Schritt neu. Nichts davon verpflichtet dich zum nächsten.
          </p>

          <div className="mt-12 grid gap-4 items-stretch grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <article className="flex flex-col p-6 rounded-[20px] bg-white" style={{ border: `2px solid ${F.dunkel}` }}>
              <Kleinlabel>Schritt 1</Kleinlabel>
              <h3 className="mt-2 text-[22px] font-black leading-[1.15] tracking-[-0.01em]">Erstgespräch</h3>
              <Preis betrag="0 €" nach="30 Minuten" groesse={34} />
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                Du erzählst, wo es hakt. Wir sagen dir ehrlich, ob wir helfen können. Per Video oder Telefon, kein Verkaufsgespräch.
              </p>
              <div className="mt-auto pt-6">
                <Kartenknopf href="#erstgespraech" voll dunkel>Termin wählen</Kartenknopf>
              </div>
            </article>

            <article className="flex flex-col p-6 rounded-[20px]" style={{ background: F.grau }}>
              <Kleinlabel>Schritt 2</Kleinlabel>
              <h3 className="mt-2 text-[22px] font-black leading-[1.15] tracking-[-0.01em]"><Wortmarke groesse={22} /> zuerst dich</h3>
              <Preis betrag={fmt(EINSTIEG)} nach="einmalig" groesse={34} />
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                Zielgespräch und zehn Fragen an dich: ein Spiegel deiner Annahmen. Voll angerechnet, wenn du in 8 Wochen ein Interview startest.
              </p>
              <div className="mt-auto pt-6">
                <Kartenknopf to={KONTAKT}>Einstieg anfragen</Kartenknopf>
              </div>
            </article>

            <article className="relative flex flex-col p-6 rounded-[20px]" style={{ background: F.dunkel, color: "#ffffff" }}>
              <span
                className="absolute -top-3.5 left-6 inline-flex items-center min-h-[28px] px-3 rounded-full text-xs font-semibold uppercase tracking-[0.12em]"
                style={{ background: F.akzent, color: "#ffffff" }}
              >
                Das Herzstück
              </span>
              <Kleinlabel dunkel>Schritt 3</Kleinlabel>
              <h3 className="mt-2 text-[22px] font-black leading-[1.15] tracking-[-0.01em]">Das Interview</h3>
              <Preis ab betrag={fmt(KLEIN.basis)} nach="erstes Modul" groesse={34} hell />
              <p className="mt-1.5 text-[15px] font-bold" style={{ color: F.akzent }}>jedes weitere ab {fmt(KLEIN.weiteres)}</p>
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "#e4e4e4" }}>
                Fragen entwickeln, einladen, auswerten, präsentieren. Alles inklusive.
              </p>
              <div className="mt-auto pt-6">
                <a
                  href="#rechner"
                  className="inline-flex items-center gap-2 min-h-[48px] px-5 rounded text-sm font-semibold uppercase tracking-[0.04em]"
                  style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
                >
                  Preis berechnen <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </article>

            <article className="flex flex-col p-6 rounded-[20px]" style={{ background: F.hauch }}>
              <Kleinlabel>Schritt 4</Kleinlabel>
              <h3 className="mt-2 text-[22px] font-black leading-[1.15] tracking-[-0.01em]"><Wortmarke verb="bleibt dran" groesse={22} /></h3>
              <Preis ab betrag={fmt(runden(KLEIN.basis * 0.4))} nach="je Puls" groesse={34} />
              <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: F.daempft }}>
                Mit demselben Kern nachfragen und sehen, ob deine Maßnahmen wirken.
              </p>
              <div className="mt-auto pt-6">
                <Kartenknopf to={KONTAKT}>Begleitung anfragen</Kartenknopf>
              </div>
            </article>
          </div>

          <Treppe />
        </div>
      </section>

      {/* Rechner */}
      <section id="rechner" className="py-24 scroll-mt-4" style={{ background: F.grau }}>
        <div className={BREITE}>
          <Etikett>Rechner</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Was kostet <span style={{ color: F.akzent }}>dein Interview?</span>
          </h2>
          <p className="mt-4 max-w-[620px] text-lg leading-[1.6]" style={{ color: F.daempft }}>
            Wähle aus, was du dir vorstellst. Den genauen Preis bekommst du nach dem Erstgespräch im Angebot, schwarz auf weiß.
          </p>
          <Rechner />
        </div>
      </section>

      {/* Erstgespräch */}
      <section id="erstgespraech" className="py-24 scroll-mt-4" style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className={`${BREITE} grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-8 lg:gap-12 items-start`}>
          <div>
            <Etikett>Kostenloses Erstgespräch</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              30 Minuten über deine Lage. <span style={{ color: F.akzent }}>Nicht über unser Produkt.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.daempft }}>
              Nutze die Gelegenheit und stell alle Fragen, die dich beschäftigen. Wir hören zu, fragen nach und sagen dir ehrlich, wie wir
              helfen können. Und wenn wir nicht helfen können, sagen wir dir das auch.
            </p>
            <ol className="mt-10 flex flex-col gap-6">
              {[
                ["10", "Minute 1 bis 10", "Du erzählst, was dich gerade beschäftigt."],
                ["20", "Minute 11 bis 20", "Wir fragen nach, wie wir es auch im Interview tun."],
                ["30", "Minute 21 bis 30", "Du bekommst unsere ehrliche Einschätzung."],
              ].map(([zahl, zeit, text]) => (
                <li key={zahl} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center text-base font-black"
                    style={{ background: F.akzent, color: "#ffffff" }}
                  >
                    {zahl}
                  </span>
                  <div>
                    <Kleinlabel>{zeit}</Kleinlabel>
                    <p className="mt-1 text-lg font-bold">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 p-7 rounded-[20px]" style={{ background: F.grau }}>
              <Kleinlabel>Was du danach in der Hand hast</Kleinlabel>
              <ul className="mt-4 flex flex-col gap-3 text-base">
                <Punkt>Eine Einschätzung, ob ein Interview dir überhaupt weiterhilft</Punkt>
                <Punkt>Welches Modul passt, oder dass du keines brauchst</Punkt>
                <Punkt>Einen Preisrahmen, bevor du irgendetwas unterschreibst</Punkt>
              </ul>
            </div>
          </div>
          <Lagewahl />
        </div>
      </section>

      {/* Drei Zusagen */}
      <section className="py-24">
        <div className={BREITE}>
          <Etikett>Unsere Zusagen</Etikett>
          <h2 className="mt-3 max-w-[760px]" style={H2_STIL}>
            Wenig Risiko für dich. <span style={{ color: F.akzent }}>Volle Arbeit von uns.</span>
          </h2>
          <div className="mt-12 grid gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {[
              ["01", "Dein Einstieg ist nie verloren.", `Startest du innerhalb von 8 Wochen ein Interview, rechnen wir die ${fmt(EINSTIEG)} für den Einstieg voll an. Und wenn nicht, hast du trotzdem ein Ergebnis in der Hand.`],
              ["02", "Rücklaufgarantie.", "Nehmen weniger als 60 % der Eingeladenen teil, fassen wir mit einer zusätzlichen Runde nach. Ohne Aufpreis, bis die Stimmen eine Entscheidung tragen."],
              ["03", "Der nächste Schritt wird günstiger.", "Setzt du die Ergebnisse mit Rittler & Co um, etwa Positionierung, Arbeitgebermarke oder Vertriebskampagne, rechnen wir 30 % des Interviewpreises darauf an."],
            ].map(([nr, titel, text]) => (
              <div key={nr}>
                <span
                  aria-hidden="true"
                  className="block text-[72px] font-black leading-[0.9] tracking-[-0.02em]"
                  style={{ color: "transparent", WebkitTextStroke: `2px ${F.akzent}` }}
                >
                  {nr}
                </span>
                <h3 className="mt-5 text-[22px] font-bold leading-[1.3]">{titel}</h3>
                <p className="mt-3 text-base leading-[1.65]" style={{ color: F.daempft }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warum kein Preis pro Kopf */}
      <section className="py-24" style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} grid gap-12 items-center grid-cols-[repeat(auto-fit,minmax(300px,1fr))]`}>
          <div>
            <Etikett dunkel>Warum kein Preis pro Kopf?</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Ein Fragebogen kostet fast nichts. <span style={{ color: F.akzent }}>Die richtigen Fragen schon.</span>
            </h2>
          </div>
          <div style={{ ...TEXT_STIL, color: "#e4e4e4" }}>
            <p>
              Aus über 500 Markenprojekten wissen wir, welche Fragen eine Entscheidung tragen. Dieses Wissen steckt in jedem Interview,
              egal ob 12 oder 80 Menschen antworten.
            </p>
            <p className="mt-5">
              Deshalb staffeln wir nach Gruppengröße und nicht nach Köpfen. Mehr Stimmen machen die Auswertung umfangreicher, die
              Erfahrung dahinter aber nicht billiger.
            </p>
          </div>
        </div>
      </section>

      {/* Alle Preise */}
      <section className="py-24">
        <div className={BREITE}>
          <Etikett>Auf einen Blick</Etikett>
          <h2 className="mt-3" style={H2_STIL}>Alle Preise</h2>
          <Preistabellen />
        </div>
      </section>

      {/* Fragen zum Preis */}
      <div style={{ borderTop: `1px solid ${F.linie}` }}>
        <Faq seite="preise" />
      </div>

      {/* Abschluss */}
      <section className="pb-24">
        <div className={BREITE}>
          <div className="px-10 py-14 rounded-[20px] flex flex-wrap gap-8 items-center justify-between" style={{ background: F.hauch }}>
            <div className="flex-[1_1_420px] min-w-0">
              <h2 style={{ ...H2_STIL, fontSize: "clamp(30px, 3.4vw, 44px)", lineHeight: 1.05 }}>
                Erst reden. <span style={{ color: F.akzent }}>Dann rechnen.</span>
              </h2>
              <p className="mt-4 max-w-[560px] text-lg leading-[1.6]" style={{ color: F.daempft }}>
                30 Minuten, kostenlos, per Video oder Telefon. Wir schätzen deine Lage ein und sagen dir ehrlich, welches Modul passt. Oder
                ob du überhaupt eines brauchst.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={KONTAKT}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded text-sm font-semibold uppercase tracking-[0.04em]"
                style={{ background: F.akzent, color: "#ffffff", textDecoration: "none" }}
              >
                Kostenloses Erstgespräch <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={TEL_LINK}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded text-sm font-semibold"
                style={{ border: `1px solid ${F.dunkel}`, color: F.text, textDecoration: "none" }}
              >
                {KONTAKT_TEL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}
