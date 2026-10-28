import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock, Phone, Video } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BREITE, Etikett, F, H2_STIL, KONTAKT_TEL } from "@/components/oeffentlich/Oeffentlich";

// Anfrageformular für ein Erstgespräch (Kontaktseite, Anker #anfrage).
// Aufbau wie im Prototyp „Erstgespräch anfragen“: links was passiert und wer sich
// meldet, rechts das Formular, nach dem Absenden ein Danke-Zustand.
// Gespeichert und gemeldet wird über die Funktion „anfrage“.
// Typografie: keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte (Gilroy).

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const THEMEN = [
  { id: "positionierung", name: "Positionierung" },
  { id: "team", name: "Team" },
  { id: "kunden", name: "Kunden" },
  { id: "vertrieb", name: "Vertrieb" },
  { id: "einstieg", name: "Erst einmal der Einstieg" },
  { id: "offen", name: "Weiß ich noch nicht" },
];

const KANAELE = [
  { id: "telefon", name: "Telefon", icon: Phone },
  { id: "online", name: "Online", icon: Video },
];

const SCHRITTE = [
  { titel: "Du schickst uns die Anfrage.", text: "Das dauert eine Minute." },
  { titel: "Wir melden uns innerhalb von 24 Stunden.", text: "Mit zwei, drei Terminvorschlägen." },
  { titel: "Im Gespräch klären wir Ziel, Gruppen und Aufwand.", text: "Danach bekommst du einen Fixpreis, schwarz auf weiß." },
];

function themaAusAdresse() {
  try {
    const t = new URLSearchParams(window.location.search).get("thema");
    return THEMEN.some((x) => x.id === t) ? { [t]: true } : {};
  } catch {
    return {};
  }
}

function Chip({ an, onClick, children, rolle }) {
  return (
    <button
      type="button"
      role={rolle}
      aria-pressed={rolle ? undefined : an}
      aria-checked={rolle ? an : undefined}
      onClick={onClick}
      className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[15px] font-semibold cursor-pointer"
      style={{ background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.text, border: `1.5px solid ${an ? F.dunkel : "#d6d3d0"}` }}
    >
      {children}
    </button>
  );
}

function Feld({ id, label, optional, fehler, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-bold">
        {label} {optional && <span className="font-medium" style={{ color: F.daempft }}>optional</span>}
      </label>
      {children}
      {fehler && <p id={`${id}-fehler`} className="mt-1.5 text-sm font-semibold" style={{ color: F.link }}>{fehler}</p>}
    </div>
  );
}

const FELD_KLASSE = "mt-2 block w-full box-border min-h-[52px] px-4 py-3 rounded-md bg-white text-base";

export default function Erstgespraech() {
  const start = useRef(Date.now());
  const [themen, setThemen] = useState(themaAusAdresse);
  const [kanal, setKanal] = useState("online");
  const [werte, setWerte] = useState({ name: "", firma: "", email: "", telefon: "", nachricht: "", webseite: "" });
  const [fehler, setFehler] = useState({});
  const [zustand, setZustand] = useState("offen"); // offen | sendet | gesendet | fehler | zuViele

  const setze = (k) => (e) => setWerte((w) => ({ ...w, [k]: e.target.value }));
  const feldStil = (k) => ({ border: `1px solid ${fehler[k] ? F.link : "#8a8a8a"}`, color: F.text, fontFamily: "inherit" });
  const ausgewaehlt = useMemo(() => THEMEN.filter((t) => themen[t.id]).map((t) => t.id), [themen]);

  async function senden(e) {
    e.preventDefault();
    const f = {};
    if (!werte.name.trim()) f.name = "Bitte gib deinen Namen an.";
    if (!werte.firma.trim()) f.firma = "Bitte gib dein Unternehmen an.";
    if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/.test(werte.email.trim())) f.email = "Bitte gib eine gültige E-Mail-Adresse an.";
    setFehler(f);
    if (Object.keys(f).length) {
      document.getElementById(Object.keys(f)[0])?.focus();
      return;
    }
    setZustand("sendet");
    try {
      const res = await base44.functions.invoke("anfrage", {
        ...werte,
        themen: ausgewaehlt,
        kanal,
        herkunft: document.referrer ? new URL(document.referrer).pathname : "",
        dauerSekunden: Math.round((Date.now() - start.current) / 1000),
      });
      const d = res?.data || {};
      if (d.ok) setZustand("gesendet");
      else if (d.zuViele) setZustand("zuViele");
      else if (d.fehler) {
        setFehler(d.fehler);
        setZustand("offen");
      } else setZustand("fehler");
    } catch {
      setZustand("fehler");
    }
  }

  return (
    <section id="anfrage" aria-labelledby="anfrage-titel" className="scroll-mt-6" style={{ background: F.hauch }}>
      <div className={`${BREITE} py-24 flex flex-wrap items-start gap-x-[72px] gap-y-14`}>
        {/* Links: was passiert, wer sich meldet */}
        <div className="flex-[1_1_380px] min-w-0">
          <Etikett>Erstgespräch</Etikett>
          <h2 id="anfrage-titel" className="mt-3" style={H2_STIL}>
            Erst reden. <span style={{ color: F.akzent }}>Dann fragen.</span>
          </h2>
          <p className="mt-5 text-[19px] leading-[1.6]" style={{ color: F.daempft }}>
            Im Erstgespräch klären wir, wo es in deinem Unternehmen hakt und ob ein Interview dir weiterhilft. Wenn
            nicht, sagen wir es dir offen.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: Check, text: "kostenlos", farbe: F.gut },
              { icon: Clock, text: "rund 30 Minuten" },
              { icon: Phone, text: "online oder telefonisch" },
            ].map(({ icon: Icon, text, farbe }) => (
              <span key={text} className="inline-flex items-center gap-2 min-h-[36px] px-3.5 rounded-full bg-white text-[15px] font-semibold">
                <Icon size={16} strokeWidth={2.2} aria-hidden="true" style={{ color: farbe || F.text }} />
                {text}
              </span>
            ))}
          </div>

          <h3 className="mt-12 text-xl font-bold">So geht es weiter</h3>
          <ol className="mt-5">
            {SCHRITTE.map((s, i) => {
              const letzter = i === SCHRITTE.length - 1;
              return (
                <li key={s.titel} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4">
                  <span className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center w-8 h-8 rounded-full text-[15px] font-black box-border"
                      style={
                        i === 0
                          ? { background: F.akzent, color: "#ffffff" }
                          : letzter
                            ? { background: F.dunkel, color: "#ffffff" }
                            : { background: "#ffffff", border: `2px solid ${F.akzent}`, color: F.akzent }
                      }
                    >
                      {i + 1}
                    </span>
                    {!letzter && <span className="flex-1 w-0.5 my-1.5" style={{ background: F.hauchRand }} />}
                  </span>
                  <p className={`mt-1 ${letzter ? "" : "mb-6"} text-[17px] leading-[1.55]`}>
                    <strong className="font-bold">{s.titel}</strong> <span style={{ color: F.daempft }}>{s.text}</span>
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 p-6 rounded-[20px] bg-white flex items-center gap-[18px]">
            <span
              aria-hidden="true"
              className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-white"
              style={{ background: F.dunkel, boxShadow: `0 0 0 4px #ffffff, 0 0 0 6px ${F.hauchRand}` }}
            >
              AR
            </span>
            <div className="min-w-0">
              <p className="text-[13px]" style={{ color: F.daempft }}>Dein Ansprechpartner</p>
              <p className="mt-0.5 text-[17px] font-bold">Alfons Rittler</p>
              <p className="text-[15px]" style={{ color: F.daempft }}>Creative Director und Consultant</p>
              <a href={TEL_LINK} className="inline-flex items-center min-h-[36px] text-[15px] font-semibold hover:underline" style={{ color: F.text }}>
                {KONTAKT_TEL}
              </a>
            </div>
          </div>
        </div>

        {/* Rechts: Formular */}
        <div
          className="flex-[1_1_480px] min-w-0 p-6 sm:p-9 rounded-3xl bg-white"
          style={{ border: `1px solid ${F.linie}`, boxShadow: "0 30px 60px -40px rgba(45,45,45,0.4)" }}
        >
          {zustand === "gesendet" ? (
            <div role="status" className="py-6 flex flex-col items-start gap-4">
              <span aria-hidden="true" className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ background: "#e3f6ec", color: "#2f9e64" }}>
                <Check size={32} strokeWidth={2.4} />
              </span>
              <h3 className="text-[30px] font-black leading-[1.15]">Danke. Wir melden uns.</h3>
              <p className="text-lg leading-[1.6]" style={{ color: F.daempft }}>
                Du hörst innerhalb von 24 Stunden von uns, mit Terminvorschlägen für dein Erstgespräch.
              </p>
              <p className="text-lg leading-[1.6]" style={{ color: F.daempft }}>
                Lieber gleich reden?{" "}
                <a href={TEL_LINK} className="font-bold whitespace-nowrap hover:underline" style={{ color: F.text }}>{KONTAKT_TEL}</a>
              </p>
              <Link
                to="/"
                className="mt-2 inline-flex items-center gap-2 min-h-[48px] px-5 rounded text-sm font-semibold"
                style={{ border: "1px solid #d6d3d0", color: F.text, textDecoration: "none" }}
              >
                Die Interviews ansehen
              </Link>
            </div>
          ) : (
            <form onSubmit={senden} noValidate aria-labelledby="formular-titel" className="flex flex-col gap-[26px]">
              <h3 id="formular-titel" className="text-[26px] font-black leading-[1.15]">Erstgespräch anfragen</h3>

              <fieldset>
                <legend className="text-base font-bold">
                  Worum geht es? <span className="font-medium" style={{ color: F.daempft }}>Mehrere möglich</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {THEMEN.map((t) => (
                    <Chip key={t.id} an={!!themen[t.id]} onClick={() => setThemen((x) => ({ ...x, [t.id]: !x[t.id] }))}>
                      {t.name}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]">
                <Feld id="name" label="Name" fehler={fehler.name}>
                  <input id="name" type="text" autoComplete="name" value={werte.name} onChange={setze("name")}
                    aria-invalid={!!fehler.name} aria-describedby={fehler.name ? "name-fehler" : undefined}
                    className={FELD_KLASSE} style={feldStil("name")} />
                </Feld>
                <Feld id="firma" label="Unternehmen" fehler={fehler.firma}>
                  <input id="firma" type="text" autoComplete="organization" value={werte.firma} onChange={setze("firma")}
                    aria-invalid={!!fehler.firma} aria-describedby={fehler.firma ? "firma-fehler" : undefined}
                    className={FELD_KLASSE} style={feldStil("firma")} />
                </Feld>
                <Feld id="email" label="E-Mail" fehler={fehler.email}>
                  <input id="email" type="email" autoComplete="email" value={werte.email} onChange={setze("email")}
                    aria-invalid={!!fehler.email} aria-describedby={fehler.email ? "email-fehler" : undefined}
                    className={FELD_KLASSE} style={feldStil("email")} />
                </Feld>
                <Feld id="telefon" label="Telefon" optional>
                  <input id="telefon" type="tel" autoComplete="tel" value={werte.telefon} onChange={setze("telefon")}
                    className={FELD_KLASSE} style={feldStil("telefon")} />
                </Feld>
              </div>

              <fieldset>
                <legend className="text-base font-bold">Wie wollen wir reden?</legend>
                <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
                  {KANAELE.map(({ id, name, icon: Icon }) => (
                    <Chip key={id} rolle="radio" an={kanal === id} onClick={() => setKanal(id)}>
                      <Icon size={16} aria-hidden="true" /> {name}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <Feld id="nachricht" label="Was beschäftigt dich gerade?" optional>
                <textarea id="nachricht" rows={4} value={werte.nachricht} onChange={setze("nachricht")}
                  placeholder="Zum Beispiel: Gute Leute gehen, und wir wissen nicht genau, warum."
                  className={`${FELD_KLASSE} resize-y`} style={feldStil("nachricht")} />
              </Feld>

              {/* Für Menschen unsichtbar, fängt automatisch ausgefüllte Formulare ab */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="webseite">Webseite</label>
                <input id="webseite" type="text" tabIndex={-1} autoComplete="off" value={werte.webseite} onChange={setze("webseite")} />
              </div>

              {(zustand === "fehler" || zustand === "zuViele") && (
                <p role="alert" className="p-4 rounded-xl text-[15px] leading-[1.5]" style={{ background: "#fff0f3", color: F.text }}>
                  {zustand === "zuViele"
                    ? "Wir haben gerade schon Anfragen von dir. Wir melden uns, versprochen."
                    : "Das hat leider nicht geklappt."}{" "}
                  Ruf uns einfach an:{" "}
                  <a href={TEL_LINK} className="font-bold whitespace-nowrap hover:underline" style={{ color: F.text }}>{KONTAKT_TEL}</a>
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={zustand === "sendet"}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-7 rounded text-[15px] font-semibold uppercase tracking-[0.04em] text-white cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                  style={{ background: F.akzent, border: 0, fontFamily: "inherit" }}
                >
                  {zustand === "sendet" ? "Wird gesendet" : "Erstgespräch anfragen"} <ArrowRight size={16} aria-hidden="true" />
                </button>
                <p className="text-[13px] leading-[1.55]" style={{ color: F.daempft }}>
                  Wir verwenden deine Angaben nur, um uns bei dir zu melden. Mehr dazu im{" "}
                  <a href="https://www.werbe-agentur-graz.at/datenschutz" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: F.link }}>
                    Datenschutz
                  </a>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
