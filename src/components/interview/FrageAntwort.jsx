import React, { useState } from "react";
import { Check, Asterisk } from "lucide-react";
import SprachAufnahme from "./SprachAufnahme";

const LIMBIC_FARBEN = [
  "#fce4ec", "#e3f2fd", "#e8f5e9", "#fff3e0", "#f3e5f5", "#e0f7fa"
];

export default function FrageAntwort({ frage, wert, onChange, ansprache }) {
  const v = wert || {};
  const auswahl = v.auswahl || [];
  // Alle Hooks unbedingt am Anfang — Reihenfolge bleibt stabil über Typwechsel
  const [werteStep, setWerteStep] = useState(1);
  const [ranking, setRanking] = useState(v.ranking || []);
  const [korrigiert, setKorrigiert] = useState(v.transkriptKorrigiert || false);

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
              onClick={() => onChange({ ...v, auswahl: [opt] })}
              className={`w-full text-left px-4 py-4 text-base interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
            >
              {opt}
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
              onClick={() => toggle(opt)}
              className={`w-full text-left px-4 py-4 text-base interview-auswahl-karte flex items-center justify-between ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
            >
              <span>{opt}</span>
              {aktiv && <Check size={18} style={{ color: "var(--farbe-akzent)" }} />}
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
              onClick={() => onChange({ ...v, auswahl: [opt], zahl: opt === "Ja" ? 1 : 0 })}
              className={`px-4 py-6 text-lg font-semibold interview-auswahl-karte ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
            >
              {opt}
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
                onClick={() => onChange({ ...v, zahl: p })}
                className={`interview-skala-btn ${aktiv ? "interview-skala-btn-aktiv" : ""}`}
              >
                {p}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-xs text-slate-400">
          <span>{frage.skalaLabelLinks || ""}</span>
          <span>{frage.skalaLabelRechts || ""}</span>
        </div>
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
            <p className="text-sm text-slate-500">Wähle mehrere Werte aus, die {ansprache === "sie" ? "Sie" : "du"} als wichtig empfindest.</p>
            <div className="space-y-2">
              {(frage.optionen || []).map((opt) => {
                const aktiv = auswahl.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`w-full text-left px-4 py-3 text-base interview-auswahl-karte flex items-center justify-between ${aktiv ? "interview-auswahl-karte-aktiv" : ""}`}
                  >
                    <span>{opt}</span>
                    {aktiv && <Check size={18} style={{ color: "var(--farbe-akzent)" }} />}
                  </button>
                );
              })}
            </div>
            {auswahl.length >= 2 && (
              <button
                type="button"
                onClick={() => setWerteStep(2)}
                className="text-sm font-medium"
                style={{ color: "var(--farbe-akzent)" }}
              >
                Weiter zur Reihenfolge →
              </button>
            )}
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
                    onClick={() => rank(opt)}
                    className="w-full text-left px-4 py-3 text-base interview-auswahl-karte flex items-center justify-between"
                    style={place >= 0 ? { borderColor: "var(--farbe-akzent)", borderWidth: 2 } : {}}
                  >
                    <span>{opt}</span>
                    {place >= 0 && (
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "var(--farbe-akzent)" }}
                      >
                        {place + 1}
                      </span>
                    )}
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
                      onClick={() => {
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
            if (v.text) { setKorrigiert(true); onChange({ ...v, text: v.text, transkriptKorrigiert: true }); }
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
              <span>Die Sprache wird nicht aufgezeichnet, sondern nur live in einen Text umgewandelt.</span>
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