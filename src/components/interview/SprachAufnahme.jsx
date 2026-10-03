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
  const restartTimerRef = useRef(null);
  const onTranskriptRef = useRef(onTranskript);

  // Ref hält immer die aktuellste Callback, damit die einmal beim Start
  // gebundenen Speech-Recognition-Handler nicht mit veralteter Closure arbeiten.
  useEffect(() => {
    onTranskriptRef.current = onTranskript;
  }, [onTranskript]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setUnterstuetzt(false);
    return () => stoppe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stoppe() {
    aufnimmtRef.current = false;
    setAufnimmt(false);
    if (limitTimerRef.current) {
      clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  }

  async function start() {
    // Vorherige Erkennung bereinigen
    stoppe();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setUnterstuetzt(false);
      return;
    }
    setFehler(false);
    finalTextRef.current = "";

    // Mikrofon-Berechtigung aktiv anfragen — rec.start() allein löst in
    // manchen Browsern/Iframes keinen Permission-Prompt aus, getUserMedia schon.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {
        setFehler(true);
        return;
      }
    }

    const rec = new SR();
    rec.lang = navigator.language || "de-DE";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r || !r[0]) continue;
        if (r.isFinal) {
          finalTextRef.current += r[0].transcript;
        } else {
          interim += r[0].transcript;
        }
      }
      onTranskriptRef.current((finalTextRef.current + " " + interim).trim());
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      // Schwerwiegender Fehler (z. B. not-allowed, network, audio-capture) —
      // Aufnahme beenden und Hinweis zeigen, sonst hängt die UI in "Lausche…"
      setFehler(true);
      stoppe();
    };

    rec.onend = () => {
      // Alte Instanz nach Neustart ignorieren
      if (recognitionRef.current !== rec) return;
      if (aufnimmtRef.current && Date.now() - startZeitRef.current < 180000) {
        // Kurze Pause vor Neustart, sonst wirft start() InvalidStateError
        restartTimerRef.current = setTimeout(() => {
          if (aufnimmtRef.current && recognitionRef.current === rec) {
            try {
              rec.start();
            } catch {}
          }
        }, 200);
      } else {
        onTranskriptRef.current(finalTextRef.current.trim());
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
      recognitionRef.current = null;
    }
  }

  function verwerfen() {
    finalTextRef.current = "";
    stoppe();
    onTranskriptRef.current("");
  }

  const sie = ansprache === "sie";

  if (!unterstuetzt) {
    return (
      <p className="mt-2" style={{ fontSize: 13, lineHeight: 1.5, color: "var(--farbe-text-daempft)" }}>
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
          className="w-full flex items-center gap-3 text-left transition-colors"
          style={{
            minHeight: 60,
            padding: "10px 16px 10px 10px",
            border: "1.5px solid var(--farbe-rahmen)",
            borderRadius: 10,
            background: "var(--farbe-bg)",
            color: "var(--farbe-text)",
          }}
        >
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "color-mix(in srgb, var(--farbe-akzent) 14%, var(--farbe-bg))",
              color: "var(--farbe-text)",
            }}
          >
            <Mic size={18} />
          </span>
          <span className="flex flex-col">
            <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.3 }}>
              Lieber sprechen als tippen?
            </span>
            <span style={{ fontSize: 13.5, lineHeight: 1.4, color: "var(--farbe-text-daempft)" }}>
              Hier drücken und einfach sagen, was {sie ? "Ihnen" : "dir"} am Herzen liegt. Der Text erscheint oben im Feld.
            </span>
          </span>
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
        <p className="mt-2" role="status" style={{ fontSize: 13, lineHeight: 1.5, color: "var(--farbe-text)" }}>
          Die Spracherkennung ist leider nicht verfügbar. {sie ? "Sie können" : "Du kannst"} die Antwort einfach eintippen.
        </p>
      )}

      <p className="mt-3" style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--farbe-text-daempft)" }}>
        Es wird keine Audiodatei gespeichert. Die Umwandlung in Text übernimmt die Spracherkennung {sie ? "Ihres" : "deines"} Browsers — dabei wird die Aufnahme kurzzeitig an dessen Dienst übertragen. Gespeichert wird bei uns nur der Text, den {sie ? "Sie" : "du"} danach {sie ? "sehen und korrigieren können" : "siehst und korrigieren kannst"}.
      </p>
    </div>
  );
}