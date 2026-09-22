import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, X } from "lucide-react";

export default function SprachAufnahme({ onTranskript, ansprache }) {
  const [aufnimmt, setAufnimmt] = useState(false);
  const [fehler, setFehler] = useState(false);
  const [unterstuetzt, setUnterstuetzt] = useState(true);

  const recognitionRef = useRef(null);
  const finalTextRef = useRef("");
  const aufnimmtRef = useRef(false);
  const startZeitRef = useRef(0);
  const limitTimerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setUnterstuetzt(false);
    return () => stoppe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setUnterstuetzt(false);
      return;
    }
    setFehler(false);
    finalTextRef.current = "";

    const rec = new SR();
    rec.lang = "de-AT";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          finalTextRef.current += r[0].transcript;
        } else {
          interim += r[0].transcript;
        }
      }
      onTranskript((finalTextRef.current + " " + interim).trim());
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setFehler(true);
    };

    rec.onend = () => {
      if (aufnimmtRef.current && Date.now() - startZeitRef.current < 180000) {
        try {
          rec.start();
        } catch {}
      } else {
        onTranskript(finalTextRef.current.trim());
      }
    };

    startZeitRef.current = Date.now();
    limitTimerRef.current = setTimeout(() => stoppe(), 180000);
    recognitionRef.current = rec;
    aufnimmtRef.current = true;
    try {
      rec.start();
      setAufnimmt(true);
    } catch {
      setFehler(true);
      aufnimmtRef.current = false;
    }
  }

  function stoppe() {
    aufnimmtRef.current = false;
    setAufnimmt(false);
    if (limitTimerRef.current) {
      clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  }

  function verwerfen() {
    finalTextRef.current = "";
    aufnimmtRef.current = false;
    setAufnimmt(false);
    if (limitTimerRef.current) {
      clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    onTranskript("");
  }

  if (!unterstuetzt) {
    return (
      <p className="text-xs text-slate-400 mt-2">
        Die Spracherkennung wird von diesem Browser nicht unterstützt — in Chrome funktioniert sie. Sonst einfach eintippen.
      </p>
    );
  }

  return (
    <div className="mt-3">
      {!aufnimmt ? (
        <button
          type="button"
          onClick={start}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          style={{ minHeight: 48 }}
        >
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "var(--farbe-grau)" }}
          >
            <Mic size={18} />
          </span>
          Per Sprache antworten
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={stoppe}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white animate-pulse"
            style={{ background: "var(--farbe-akzent)" }}
          >
            <Square size={16} />
          </button>
          <div className="flex-1">
            <div className="text-xs text-slate-500">
              Lausche… {ansprache === "sie" ? "Sprechen Sie" : "Sprich"} jetzt
            </div>
          </div>
          <button
            type="button"
            onClick={stoppe}
            className="text-sm text-slate-500"
            style={{ minHeight: 48 }}
          >
            Stoppen
          </button>
          <button
            type="button"
            onClick={verwerfen}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700"
            style={{ background: "var(--farbe-grau)" }}
            aria-label="Verwerfen"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {fehler && !aufnimmt && (
        <p className="text-xs text-slate-400 mt-2">
          Die Spracherkennung ist leider nicht verfügbar. {ansprache === "sie" ? "Sie können" : "Du kannst"} die Antwort einfach eintippen.
        </p>
      )}
    </div>
  );
}