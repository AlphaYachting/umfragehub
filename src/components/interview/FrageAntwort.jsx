import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import SprachAufnahme from "./SprachAufnahme";
import { matrixZeilenMitIds, platzhalterErsetzen } from "@/lib/interview";

// Ab dieser Optionszahl werden kurze Mehrfachauswahl-Optionen als Begriffe zum Antippen
// dargestellt statt als lange Kartenliste.
const CHIP_AB_OPTIONEN = 13;
const CHIP_MAX_ZEICHEN = 28;

// Gruppennamen ohne Aussage für Befragte („Feld 1“, „Sonstige“) werden nicht angezeigt.
function gruppenNameSichtbar(name) {
  return !/^(feld\s*\d+|sonstige)$/i.test(String(name || "").trim());
}

// Skalen-Beschriftung als gut sichtbare Leiste: [1] links … rechts [4]
function SkalaLegende({ min, max, links, rechts, mitlaufend }) {
  return (
    <div className={mitlaufend ? "interview-mitlaufend" : ""} style={{ marginBottom: mitlaufend ? 8 : 14 }}>
      <div className="interview-skala-legende">
        <span>
          <span className="interview-skala-zahl">{min}</span>
          {links ? <span>{links}</span> : null}
        </span>
        <span>
          {rechts ? <span>{rechts}</span> : null}
          <span className="interview-skala-zahl">{max}</span>
        </span>
      </div>
    </div>
  );
}

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

export default function FrageAntwort({ frage, wert, onChange, ansprache, textKontext }) {
  const v = wert || {};
  const auswahl = v.auswahl || [];
  // Platzhalter ({{firma}}, Du/Sie) auch in Optionen, Zeilen und Labels auflösen
  const t = (s) => (textKontext ? platzhalterErsetzen(s, textKontext) : s);
  // Auswahlgrenzen (Schema v2) für multi_choice und limbic
  const maxAuswahl = Number(frage.maxAuswahl) > 0 ? Number(frage.maxAuswahl) : null;
  const minAuswahl = Number(frage.minAuswahl) > 0 ? Number(frage.minAuswahl) : null;
  const auswahlAnzeige = (() => {
    const n = auswahl.length;
    if (minAuswahl && maxAuswahl && minAuswahl === maxAuswahl) {
      return { text: `${n} von ${maxAuswahl} gewählt`, erfuellt: n === maxAuswahl, anzeigen: true };
    }
    if (!minAuswahl && !maxAuswahl) return { text: "", erfuellt: false, anzeigen: false };
    const hinweis = minAuswahl && maxAuswahl
      ? `Bitte ${minAuswahl} bis ${maxAuswahl} auswählen.`
      : maxAuswahl
        ? `Höchstens ${maxAuswahl} auswählen.`
        : `Mindestens ${minAuswahl} auswählen.`;
    const erfuellt = minAuswahl ? n >= minAuswahl : n >= 1;
    return { text: `${hinweis} · ${n} gewählt`, erfuellt, anzeigen: true };
  })();
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
              <span>{t(opt)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // multi_choice
  if (frage.typ === "multi_choice") {
    const vollBelegt = maxAuswahl !== null && auswahl.length >= maxAuswahl;
    function toggle(opt) {
      if (auswahl.includes(opt)) {
        setAuswahl(auswahl.filter((x) => x !== opt));
      } else if (!vollBelegt) {
        setAuswahl([...auswahl, opt]);
      }
    }
    const optionen = frage.optionen || [];
    const alsBegriffe = optionen.length >= CHIP_AB_OPTIONEN &&
      optionen.every((o) => String(t(o)).length <= CHIP_MAX_ZEICHEN);
    const zaehler = auswahlAnzeige.anzeigen && (
      <p aria-live="polite" className="interview-mitlaufend" style={{ color: auswahlAnzeige.erfuellt ? "var(--farbe-text)" : "var(--farbe-text-daempft)", fontSize: "14px", fontWeight: 600 }}>
        {auswahlAnzeige.text}
      </p>
    );
    if (alsBegriffe) {
      return (
        <div>
          {zaehler}
          <div className="flex flex-wrap gap-2" style={{ marginTop: zaehler ? 4 : 0 }}>
            {optionen.map((opt) => {
              const aktiv = auswahl.includes(opt);
              const gesperrt = vollBelegt && !aktiv;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={aktiv}
                  aria-disabled={gesperrt}
                  onClick={(e) => { if (gesperrt) return; einrastenSpuerbar(e.currentTarget); toggle(opt); }}
                  className={`interview-chip ${aktiv ? "interview-chip-aktiv" : ""}`}
                  style={gesperrt ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                >
                  {t(opt)}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {zaehler}
        {optionen.map((opt) => {
          const aktiv = auswahl.includes(opt);
          const gesperrt = vollBelegt && !aktiv;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={aktiv}
              aria-disabled={gesperrt}
              onClick={(e) => { if (gesperrt) return; einrastenSpuerbar(e.currentTarget); toggle(opt); }}
              className={`interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
              style={gesperrt ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
            >
              <span className={`interview-marker interview-marker-eckig ${aktiv ? "interview-marker-aktiv" : ""}`}>
                <Check className="interview-marker-haken" size={12} strokeWidth={3} />
              </span>
              <span>{t(opt)}</span>
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
    const mitLabels = !!(frage.skalaLabelLinks || frage.skalaLabelRechts);
    return (
      <div>
        {mitLabels && (
          <SkalaLegende min={min} max={max} links={t(frage.skalaLabelLinks || "")} rechts={t(frage.skalaLabelRechts || "")} />
        )}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${punkte.length}, 1fr)`, gap: "7px" }}>
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
                style={{ minWidth: 0 }}
              >
                {p}
              </button>
            );
          })}
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
        <div className="flex justify-between mt-3" style={{ color: "var(--farbe-text-daempft)", fontSize: "14px", fontWeight: 500 }}>
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
        <div className="flex justify-between mt-3" style={{ color: "var(--farbe-text-daempft)", fontSize: "14px", fontWeight: 500 }}>
          <span>{frage.skalaLabelLinks || "links"}</span>
          <span>{frage.skalaLabelRechts || "rechts"}</span>
        </div>
      </div>
    );
  }

  // matrix — Antworten werden unter der stabilen Zeilen-ID gespeichert (Schema v2)
  if (frage.typ === "matrix") {
    const min = frage.skalaMin ?? 1;
    const max = frage.skalaMax ?? 5;
    const punkte = [];
    for (let i = min; i <= max; i++) punkte.push(i);
    const matrixWerte = v.matrixWerte || {};
    const zeilen = matrixZeilenMitIds(frage);
    const alleBeantwortet = zeilen.length > 0 && zeilen.every((z) => matrixWerte[z.id] !== undefined);
    function setZeile(zeilenId, stufe, element) {
      einrastenSpuerbar(element);
      onChange({ ...v, matrixWerte: { ...matrixWerte, [zeilenId]: stufe } });
    }
    return (
      <div>
        <SkalaLegende min={min} max={max} links={t(frage.skalaLabelLinks || "")} rechts={t(frage.skalaLabelRechts || "")} mitlaufend />
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {zeilen.map((zeile) => (
            <div key={zeile.id}>
              <div style={{ color: "var(--farbe-text)", fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>{t(zeile.text)}</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${punkte.length}, 1fr)`, gap: "7px" }}>
                {punkte.map((p) => {
                  const aktiv = matrixWerte[zeile.id] === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={aktiv}
                      aria-label={`${t(zeile.text)} — Stufe ${p}`}
                      onClick={(e) => setZeile(zeile.id, p, e.currentTarget)}
                      className={`interview-skala-btn ${aktiv ? "interview-skala-btn-aktiv" : ""}`}
                      style={{ minWidth: 0 }}
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
          <p className="mt-3" style={{ color: "var(--farbe-text-daempft)", fontSize: "13px", fontWeight: 500 }}>
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
    const vollBelegt = maxAuswahl !== null && auswahl.length >= maxAuswahl;
    const gruppen = {};
    (frage.optionen || []).forEach((opt) => {
      const [g, b] = opt.includes("|") ? opt.split("|") : ["Sonstige", opt];
      const key = g.trim();
      if (!gruppen[key]) gruppen[key] = [];
      gruppen[key].push(b.trim());
    });
    const gruppenListe = Object.entries(gruppen);
    return (
      <div>
        {auswahlAnzeige.anzeigen && (
          <p aria-live="polite" className="interview-mitlaufend" style={{ color: auswahlAnzeige.erfuellt ? "var(--farbe-text)" : "var(--farbe-text-daempft)", fontSize: "14px", fontWeight: 600 }}>
            {auswahlAnzeige.text}
          </p>
        )}
        {gruppenListe.map(([gName, begriffe], gi) => {
          const nameZeigen = gruppenNameSichtbar(gName);
          return (
            <div
              key={gName}
              style={gi > 0
                ? { marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--farbe-linie)" }
                : { marginTop: 4 }}
            >
              {nameZeigen && (
                <div className="mb-2" style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--farbe-text-daempft)" }}>{t(gName)}</div>
              )}
              <div className="flex flex-wrap gap-2">
                {begriffe.map((b) => {
                  const aktiv = auswahl.includes(b);
                  const gesperrt = vollBelegt && !aktiv;
                  return (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={aktiv}
                      aria-disabled={gesperrt}
                      onClick={(e) => {
                        if (gesperrt) return;
                        einrastenSpuerbar(e.currentTarget);
                        if (auswahl.includes(b)) setAuswahl(auswahl.filter((x) => x !== b));
                        else setAuswahl([...auswahl, b]);
                      }}
                      className={`interview-chip ${aktiv ? "interview-chip-aktiv" : ""}`}
                      style={gesperrt ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
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
          className="interview-textfeld"
        />
        {frage.sprachantwortErlaubt && (
          <SprachAufnahme
            ansprache={ansprache}
            basisText={v.text || ""}
            onTranskript={(t) => {
              onChange({ ...v, text: t, transkriptKorrigiert: false, eingabeart: "sprache" });
              setKorrigiert(false);
            }}
          />
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