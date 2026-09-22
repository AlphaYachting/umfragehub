import React, { useState, useRef, useEffect } from "react";
import { Check, Asterisk } from "lucide-react";
import SprachAufnahme from "./SprachAufnahme";

const LIMBIC_FARBEN = [
  "color-mix(in srgb, var(--farbe-akzent) 6%, var(--farbe-bg))",
  "color-mix(in srgb, var(--farbe-akzent) 10%, var(--farbe-bg))",
  "color-mix(in srgb, var(--farbe-akzent) 14%, var(--farbe-bg))",
  "color-mix(in srgb, var(--farbe-akzent) 18%, var(--farbe-bg))",
  "color-mix(in srgb, var(--farbe-akzent) 22%, var(--farbe-bg))",
  "color-mix(in srgb, var(--farbe-akzent) 26%, var(--farbe-bg))",
];

const REDUZIERTE_BEWEGUNG = typeof window !== "undefined" &&
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Spürbares Einrasten — Vibration auf Android, visuelle Mikrobewegung auf iOS
function einrastenSpuerbar(element) {
  if (REDUZIERTE_BEWEGUNG) return;
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch (e) { /* nicht überall vorhanden */ }
  if (element && !navigator.vibrate) {
    element.classList.remove("interview-einrasten");
    void element.offsetWidth;
    element.classList.add("interview-einrasten");
  }
}

// Verbale Stufe für einen Reglerwert aus stufenWorte
function stufenWort(frage, wert) {
  const stufen = (frage.stufenWorte || []).slice().sort((a, b) => (a.bis ?? 0) - (b.bis ?? 0));
  for (const s of stufen) {
    if (wert <= (s.bis ?? Infinity)) return s.wort;
  }
  return stufen.length ? stufen[stufen.length - 1].wort : "";
}

// Verbale Verortung für das Gegensatzpaar (0–100)
function gegensatzVerortung(pos) {
  if (pos <= 50) {
    const d = 50 - pos;
    if (d === 0) return "genau in der Mitte";
    if (d < 15) return "leicht links der Mitte";
    if (d < 35) return "mitte-links";
    return "deutlich links";
  }
  const d = pos - 50;
  if (d < 15) return "leicht rechts der Mitte";
  if (d < 35) return "mitte-rechts";
  return "deutlich rechts";
}

export default function FrageAntwort({ frage, wert, onChange, ansprache }) {
  const v = wert || {};
  const auswahl = v.auswahl || [];
  // Alle Hooks unbedingt am Anfang — Reihenfolge bleibt stabil über Typwechsel
  const [werteStep, setWerteStep] = useState(1);
  const [ranking, setRanking] = useState(v.ranking || []);
  const [korrigiert, setKorrigiert] = useState(v.transkriptKorrigiert || false);
  const [reglerBeruehrt, setReglerBeruehrt] = useState(v.zahl !== undefined && v.zahl !== null);
  const reglerRef = useRef(null);

  useEffect(() => {
    setReglerBeruehrt(v.zahl !== undefined && v.zahl !== null);
  }, [frage.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function setAuswahl(neu) {
    onChange({ ...v, auswahl: neu, ranking: [] });
    setRanking([]);
    setWerteStep(1);
  }

  // single_choice
  if (frage.typ === "single_choice") {
    return (
      <div className="space-y-2">
        {(frage.optionen || []).map((opt) => {
          const aktiv = auswahl[0] === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={aktiv}
              onClick={(e) => { einrastenSpuerbar(e.currentTarget); onChange({ ...v, auswahl: [opt] }); }}
              className={`interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
            >
              <span className={`interview-marker ${aktiv ? "interview-marker-aktiv" : ""}`}>
                <Check className="interview-marker-haken" size={12} strokeWidth={3} />
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // multi_choice
  if (frage.typ === "multi_choice") {
    function toggle(opt) {
      if (auswahl.includes(opt)) {
        setAuswahl(auswahl.filter((x) => x !== opt));
      } else {
        setAuswahl([...auswahl, opt]);
      }
    }
    return (
      <div className="space-y-2">
        {(frage.optionen || []).map((opt) => {
          const aktiv = auswahl.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={aktiv}
              onClick={(e) => { einrastenSpuerbar(e.currentTarget); toggle(opt); }}
              className={`interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
            >
              <span className={`interview-marker interview-marker-eckig ${aktiv ? "interview-marker-aktiv" : ""}`}>
                <Check className="interview-marker-haken" size={12} strokeWidth={3} />
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // ja_nein
  if (frage.typ === "ja_nein") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {["Ja", "Nein"].map((opt) => {
          const aktiv = auswahl[0] === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={aktiv}
              onClick={(e) => { einrastenSpuerbar(e.currentTarget); onChange({ ...v, auswahl: [opt], zahl: opt === "Ja" ? 1 : 0 }); }}
              className={`interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
              style={{ justifyContent: "center", fontSize: "16px", fontWeight: 600 }}
            >
              <span className={`interview-marker ${aktiv ? "interview-marker-aktiv" : ""}`}>
                <Check className="interview-marker-haken" size={12} strokeWidth={3} />
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // skala
  if (frage.typ === "skala") {
    const min = frage.skalaMin ?? 1;
    const max = frage.skalaMax ?? 5;
    const punkte = [];
    for (let i = min; i <= max; i++) punkte.push(i);
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {punkte.map((p) => {
            const aktiv = v.zahl === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={aktiv}
                aria-label={`${p}`}
                onClick={(e) => { einrastenSpuerbar(e.currentTarget); onChange({ ...v, zahl: p }); }}
                className={`interview-skala-btn ${aktiv ? "interview-skala-btn-aktiv" : ""}`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-xs" style={{ color: "var(--farbe-grau-mid)" }}>
          <span>{frage.skalaLabelLinks || ""}</span>
          <span>{frage.skalaLabelRechts || ""}</span>
        </div>
      </div>
    );
  }

  // schieberegler
  if (frage.typ === "schieberegler") {
    const min = frage.skalaMin ?? 0;
    const max = frage.skalaMax ?? 100;
    const wertZahl = v.zahl;
    const unberuehrt = !reglerBeruehrt;
    const prozent = unberuehrt ? 0 : ((wertZahl - min) / (max - min)) * 100;
    return (
      <div style={{ padding: "0 15px" }}>
        <div className="text-center mb-4" style={{ minHeight: 64, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {unberuehrt ? (
            <span style={{ color: "var(--farbe-grau-mid)", fontSize: "15.5px" }}>
              Noch keine Antwort — zieh den Regler.
            </span>
          ) : (
            <>
              <div style={{ color: "var(--farbe-akzent)", fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
                {Math.round(wertZahl)}
              </div>
              {stufenWort(frage, wertZahl) && (
                <div style={{ color: "var(--farbe-text-daempft)", fontSize: "14.5px", fontWeight: 600, marginTop: 2 }}>
                  {stufenWort(frage, wertZahl)}
                </div>
              )}
            </>
          )}
        </div>
        <input
          ref={reglerRef}
          type="range"
          min={min}
          max={max}
          value={unberuehrt ? min : wertZahl}
          onChange={(e) => {
            const neu = Number(e.target.value);
            if (!reglerBeruehrt) setReglerBeruehrt(true);
            if (stufenWort(frage, v.zahl) !== stufenWort(frage, neu)) einrastenSpuerbar(reglerRef.current);
            onChange({ ...v, zahl: neu });
          }}
          onPointerDown={() => {
            if (!reglerBeruehrt) {
              setReglerBeruehrt(true);
              onChange({ ...v, zahl: Number(reglerRef.current.value) });
            }
          }}
          onKeyDown={(e) => {
            if (!reglerBeruehrt && ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))
              setReglerBeruehrt(true);
          }}
          className={`interview-regel ${unberuehrt ? "interview-regel-unberuehrt" : ""}`}
          style={{ "--regler-fuellung": `${prozent}%` }}
          aria-label="Schieberegler"
        />
        <div className="flex justify-between mt-3 text-xs" style={{ color: "var(--farbe-grau-mid)" }}>
          <span>{frage.skalaLabelLinks || min}</span>
          <span>{frage.skalaLabelRechts || max}</span>
        </div>
      </div>
    );
  }

  // gegensatzpaar
  if (frage.typ === "gegensatzpaar") {
    const min = 0;
    const max = 100;
    const wertZahl = v.zahl;
    const unberuehrt = !reglerBeruehrt;
    const prozent = unberuehrt ? 0 : wertZahl;
    return (
      <div style={{ padding: "0 15px" }}>
        <div className="text-center mb-4" style={{ minHeight: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {unberuehrt ? (
            <span style={{ color: "var(--farbe-grau-mid)", fontSize: "15.5px" }}>
              Noch keine Antwort — zieh den Regler.
            </span>
          ) : (
            <div style={{ color: "var(--farbe-text-daempft)", fontSize: "15.5px", fontWeight: 500 }}>
              {gegensatzVerortung(wertZahl)}
            </div>
          )}
        </div>
        <input
          ref={reglerRef}
          type="range"
          min={min}
          max={max}
          value={unberuehrt ? 50 : wertZahl}
          onChange={(e) => {
            const neu = Number(e.target.value);
            if (!reglerBeruehrt) setReglerBeruehrt(true);
            if (gegensatzVerortung(v.zahl) !== gegensatzVerortung(neu)) einrastenSpuerbar(reglerRef.current);
            onChange({ ...v, zahl: neu });
          }}
          onPointerDown={() => {
            if (!reglerBeruehrt) {
              setReglerBeruehrt(true);
              onChange({ ...v, zahl: Number(reglerRef.current.value) });
            }
          }}
          onKeyDown={(e) => {
            if (!reglerBeruehrt && ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))
              setReglerBeruehrt(true);
          }}
          className={`interview-regel ${unberuehrt ? "interview-regel-unberuehrt" : ""}`}
          style={{ "--regler-fuellung": `${prozent}%` }}
          aria-label="Gegensatzpaar-Regler"
        />
        <div className="flex justify-between mt-3 text-xs font-medium" style={{ color: "var(--farbe-grau-mid)" }}>
          <span>{frage.skalaLabelLinks || "links"}</span>
          <span>{frage.skalaLabelRechts || "rechts"}</span>
        </div>
      </div>
    );
  }

  // matrix
  if (frage.typ === "matrix") {
    const min = frage.skalaMin ?? 1;
    const max = frage.skalaMax ?? 5;
    const punkte = [];
    for (let i = min; i <= max; i++) punkte.push(i);
    const matrixWerte = v.matrixWerte || {};
    const zeilen = frage.matrixZeilen || [];
    const alleBeantwortet = zeilen.length > 0 && zeilen.every((_, idx) => matrixWerte[String(idx)] !== undefined);
    function setZeile(idx, stufe, element) {
      einrastenSpuerbar(element);
      onChange({ ...v, matrixWerte: { ...matrixWerte, [String(idx)]: stufe } });
    }
    return (
      <div>
        <div className="flex justify-between pb-3 mb-3 text-xs" style={{ color: "var(--farbe-grau-mid)", borderBottom: "1px solid var(--farbe-linie)" }}>
          <span>{frage.skalaLabelLinks || min}</span>
          <span>{frage.skalaLabelRechts || max}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {zeilen.map((zeile, idx) => (
            <div key={idx}>
              <div style={{ color: "var(--farbe-text)", fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>{zeile}</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${punkte.length}, 1fr)`, gap: "7px" }}>
                {punkte.map((p) => {
                  const aktiv = matrixWerte[String(idx)] === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={aktiv}
                      aria-label={`${zeile} — Stufe ${p}`}
                      onClick={(e) => setZeile(idx, p, e.currentTarget)}
                      className={`interview-skala-btn ${aktiv ? "interview-skala-btn-aktiv" : ""}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!alleBeantwortet && zeilen.length > 0 && (
          <p className="text-xs mt-3" style={{ color: "var(--farbe-grau-mid)" }}>
            Bitte alle Aussagen bewerten.
          </p>
        )}
      </div>
    );
  }

  // werte_auswahl
  if (frage.typ === "werte_auswahl") {
    function toggle(opt) {
      if (auswahl.includes(opt)) {
        setAuswahl(auswahl.filter((x) => x !== opt));
      } else {
        setAuswahl([...auswahl, opt]);
      }
    }
    function rank(opt) {
      if (ranking.includes(opt)) {
        const neu = ranking.filter((x) => x !== opt);
        setRanking(neu);
        onChange({ ...v, auswahl, ranking: neu });
      } else if (ranking.length < 3) {
        const neu = [...ranking, opt];
        setRanking(neu);
        onChange({ ...v, auswahl, ranking: neu });
      }
    }
    return (
      <div className="space-y-3">
        {werteStep === 1 && (
          <>
            <p className="text-sm text-slate-500">Wähle die drei Werte aus, die {ansprache === "sie" ? "Sie" : "du"} als am wichtigsten empfindest.</p>
            <div className="space-y-2">
              {(frage.optionen || []).map((opt) => {
                const aktiv = auswahl.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={(e) => { einrastenSpuerbar(e.currentTarget); toggle(opt); }}
                    className={`interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
                  >
                    <span className={`interview-marker interview-marker-eckig ${aktiv ? "interview-marker-aktiv" : ""}`}>
                      <Check className="interview-marker-haken" size={12} strokeWidth={3} />
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={auswahl.length < 3}
              onClick={() => setWerteStep(2)}
              className="text-sm font-medium"
              style={{ color: auswahl.length < 3 ? "var(--farbe-grau-mid)" : "var(--farbe-akzent)" }}
            >
              {auswahl.length < 3 ? `Noch ${3 - auswahl.length} wählen` : "Weiter zur Reihenfolge →"}
            </button>
          </>
        )}
        {werteStep === 2 && (
          <>
            <p className="text-sm text-slate-500">
              Tippe die drei wichtigsten in Reihenfolge an (1. Platz zuerst).
            </p>
            <div className="space-y-2">
              {auswahl.map((opt) => {
                const place = ranking.indexOf(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={(e) => { einrastenSpuerbar(e.currentTarget); rank(opt); }}
                    className={`interview-auswahl-karte ${place >= 0 ? "interview-auswahl-karte-aktiv" : ""}`}
                  >
                    <span className={`interview-marker interview-marker-eckig ${place >= 0 ? "interview-marker-aktiv" : ""}`}>
                      {place >= 0 && <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, lineHeight: 1 }}>{place + 1}</span>}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => { setWerteStep(1); setRanking([]); onChange({ ...v, auswahl, ranking: [] }); }}
              className="text-sm text-slate-400"
            >
              ← Zurück zur Auswahl
            </button>
          </>
        )}
      </div>
    );
  }

  // limbic
  if (frage.typ === "limbic") {
    const gruppen = {};
    (frage.optionen || []).forEach((opt) => {
      const [g, b] = opt.includes("|") ? opt.split("|") : ["Sonstige", opt];
      const key = g.trim();
      if (!gruppen[key]) gruppen[key] = [];
      gruppen[key].push(b.trim());
    });
    const gruppenListe = Object.entries(gruppen);
    return (
      <div className="space-y-4">
        {gruppenListe.map(([gName, begriffe], gi) => {
          const farbe = LIMBIC_FARBEN[gi % LIMBIC_FARBEN.length];
          return (
            <div key={gName}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{gName}</div>
              <div className="flex flex-wrap gap-2">
                {begriffe.map((b) => {
                  const aktiv = auswahl.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={aktiv}
                      onClick={(e) => {
                        einrastenSpuerbar(e.currentTarget);
                        if (auswahl.includes(b)) setAuswahl(auswahl.filter((x) => x !== b));
                        else setAuswahl([...auswahl, b]);
                      }}
                      className="px-4 py-3 text-sm rounded-md border-2 transition-all"
                      style={{
                        background: aktiv ? "#fff" : farbe,
                        borderColor: aktiv ? "var(--farbe-akzent)" : "transparent",
                        minHeight: 48
                      }}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // freitext
  if (frage.typ === "freitext") {
    return (
      <div>
        <textarea
          value={v.text || ""}
          onChange={(e) => {
            onChange({ ...v, text: e.target.value, transkriptKorrigiert: korrigiert });
            if (korrigiert) setKorrigiert(false);
          }}
          onBlur={() => {
            if (v.text && v.eingabeart === "sprache") { setKorrigiert(true); onChange({ ...v, text: v.text, transkriptKorrigiert: true }); }
          }}
          rows={5}
          placeholder={ansprache === "sie" ? "Ihre Antwort…" : "Deine Antwort…"}
          className="w-full px-4 py-3 rounded text-base border-2 focus:outline-none"
          style={{ borderColor: "var(--farbe-grau-mid)", background: "#fff", minHeight: 120 }}
        />
        {frage.sprachantwortErlaubt && (
          <>
            <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
              <Asterisk size={12} className="mt-0.5 shrink-0" style={{ color: "var(--farbe-akzent)" }} />
              <span>Es wird keine Audiodatei gespeichert. Die Umwandlung in Text übernimmt die Spracherkennung {ansprache === "sie" ? "Ihres" : "deines"} Browsers — dabei wird die Aufnahme kurzzeitig an dessen Dienst übertragen. Gespeichert wird bei uns nur der Text, den {ansprache === "sie" ? "Sie" : "du"} danach {ansprache === "sie" ? "sehen und korrigieren können" : "siehst und korrigieren kannst"}.</span>
            </p>
            <SprachAufnahme
              ansprache={ansprache}
              onTranskript={(t) => {
                onChange({ ...v, text: t, transkriptKorrigiert: false, eingabeart: "sprache" });
                setKorrigiert(false);
              }}
            />
          </>
        )}
        {v.eingabeart === "sprache" && v.text && (
          <p className="text-xs text-slate-400 mt-2">
            So haben wir {ansprache === "sie" ? "Sie" : "dich"} verstanden — bitte korrigiere, wenn etwas nicht stimmt.
          </p>
        )}
      </div>
    );
  }

  return null;
}