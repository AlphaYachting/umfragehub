import React, { useState, useRef, useEffect } from "react";
import { Mic, X } from "lucide-react";

// Verständliche Ursache zu einem Fehlercode ("mikrofon:NotAllowedError", "erkennung:network", …).
// Der Code selbst wird klein dahinter angezeigt, damit sich der Fehler eingrenzen lässt.
function fehlerUrsache(code, sie) {
  const c = String(code || "");
  if (/NotAllowedError|SecurityError|not-allowed/.test(c)) {
    return `Das Mikrofon ist für diese Seite gesperrt. ${sie ? "Erlauben Sie" : "Erlaube"} es über das Schloss-Symbol in der Adresszeile und ${sie ? "versuchen Sie" : "versuch"} es noch einmal.`;
  }
  if (/NotFoundError|OverconstrainedError/.test(c)) {
    return "An diesem Gerät wurde kein Mikrofon gefunden.";
  }
  if (/NotReadableError|AbortError|audio-capture/.test(c)) {
    return "Das Mikrofon liefert gerade keinen Ton – möglicherweise verwendet es ein anderes Programm.";
  }
  if (/network/.test(c)) {
    return "Der Spracherkennungsdienst des Browsers ist gerade nicht erreichbar.";
  }
  if (/service-not-allowed/.test(c)) {
    return "In diesem Browser ist die Spracherkennung abgeschaltet.";
  }
  if (/language-not-supported/.test(c)) {
    return "Die Spracherkennung unterstützt die eingestellte Sprache nicht.";
  }
  return "Die Spracherkennung lässt sich gerade nicht starten.";
}

// Diktiertes an den schon vorhandenen Text anhängen (Leerzeichen dazwischen, Zeilenumbrüche
// im vorhandenen Text bleiben erhalten).
function textAnhaengen(basis, diktat) {
  const d = String(diktat || "").replace(/\s+/g, " ").trim();
  const b = String(basis || "");
  if (!d) return b;
  if (!b.trim()) return d;
  return /\s$/.test(b) ? b + d : `${b} ${d}`;
}

export default function SprachAufnahme({ onTranskript, ansprache, basisText }) {
  const [aufnimmt, setAufnimmt] = useState(false);
  const [fehler, setFehler] = useState(false);
  const [unterstuetzt, setUnterstuetzt] = useState(true);

  const recognitionRef = useRef(null);
  // Text, der vor der Aufnahme schon im Feld stand — er wird nie überschrieben
  const basisRef = useRef("");
  const basisTextRef = useRef(basisText || "");
  // Fertig erkannter Text früherer Erkennungsläufe dieser Aufnahme / des laufenden Laufs
  const gesamtRef = useRef("");
  const sitzungRef = useRef("");
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
    basisTextRef.current = basisText || "";
  }, [basisText]);

  // Aktuellen Stand melden: vorhandener Text + alles bisher Diktierte (+ vorläufig Erkanntes)
  function melden(vorlaeufig = "") {
    const diktat = `${gesamtRef.current} ${sitzungRef.current} ${vorlaeufig}`;
    onTranskriptRef.current(textAnhaengen(basisRef.current, diktat));
  }

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
    basisRef.current = basisTextRef.current || "";
    gesamtRef.current = "";
    sitzungRef.current = "";

    // Mikrofon-Berechtigung aktiv anfragen — rec.start() allein löst in
    // manchen Browsern/Iframes keinen Permission-Prompt aus, getUserMedia schon.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {
        const code = `mikrofon:${e?.name || "unbekannt"}`;
        console.warn("[Sprache]", code, e?.message || "");
        setFehler(code);
        return;
      }
    }

    const rec = new SR();
    // Die Befragung ist deutsch — auch wenn der Browser auf eine andere Sprache gestellt ist.
    // Deutsche Regionalvarianten (de-AT, de-CH) bleiben erhalten.
    const browserSprache = navigator.language || "";
    rec.lang = /^de(-|$)/i.test(browserSprache) ? browserSprache : "de-DE";
    // Android-Chrome liefert im Dauerbetrieb jedes Ergebnis mehrfach (Text verdoppelt sich).
    // Dort deshalb Einzelläufe, die nach jeder Sprechpause automatisch neu starten.
    const istAndroid = /Android/i.test(navigator.userAgent || "");
    rec.continuous = !istAndroid;
    rec.interimResults = true;

    rec.onresult = (e) => {
      // Immer aus der ganzen Ergebnisliste des laufenden Laufs neu aufbauen — so kann
      // ein doppelt gemeldetes Ergebnis den Text nicht verdoppeln.
      let fertig = "";
      let vorlaeufig = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r || !r[0]) continue;
        if (r.isFinal) {
          fertig = istAndroid ? r[0].transcript : `${fertig} ${r[0].transcript}`;
        } else {
          vorlaeufig = `${vorlaeufig} ${r[0].transcript}`;
        }
      }
      sitzungRef.current = fertig;
      melden(vorlaeufig);
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      // Schwerwiegender Fehler (z. B. not-allowed, network, audio-capture) —
      // Aufnahme beenden und Hinweis zeigen, sonst hängt die UI in "Lausche…"
      const code = `erkennung:${e.error || "unbekannt"}`;
      console.warn("[Sprache]", code, e.message || "");
      setFehler(code);
      stoppe();
    };

    rec.onend = () => {
      // Der Lauf ist zu Ende: sein Text ist fertig und zählt ab jetzt zum Gesamttext.
      // (Nur übernehmen, solange diese Instanz noch die aktuelle Aufnahme ist oder gerade
      // per „Fertig“ beendet wurde — eine neue Aufnahme hat die Refs schon zurückgesetzt.)
      if (recognitionRef.current === rec || recognitionRef.current === null) {
        gesamtRef.current = `${gesamtRef.current} ${sitzungRef.current}`.trim();
        sitzungRef.current = "";
      }
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
        melden();
      }
    };

    startZeitRef.current = Date.now();
    limitTimerRef.current = setTimeout(() => stoppe(), 180000);
    recognitionRef.current = rec;
    aufnimmtRef.current = true;
    try {
      rec.start();
      setAufnimmt(true);
    } catch (e) {
      const code = `start:${e?.name || "unbekannt"}`;
      console.warn("[Sprache]", code, e?.message || "");
      setFehler(code);
      aufnimmtRef.current = false;
      recognitionRef.current = null;
    }
  }

  // Aufnahme verwerfen: nur das Diktierte fällt weg, der Text von vorher bleibt stehen
  function verwerfen() {
    gesamtRef.current = "";
    sitzungRef.current = "";
    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null; // späte Ergebnisse dieser Aufnahme nicht mehr übernehmen
    }
    stoppe();
    onTranskriptRef.current(basisRef.current);
  }

  const sie = ansprache === "sie";

  if (!unterstuetzt) {
    return (
      <p className="mt-2" style={{ fontSize: 13, lineHeight: 1.5, color: "var(--farbe-text-daempft)" }}>
        In diesem Browser gibt es keine eingebaute Spracheingabe. Tipp: Viele Handy-Tastaturen haben eine Mikrofon-Taste — damit {sie ? "können Sie" : "kannst du"} die Antwort direkt ins Feld diktieren.
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
              background: "var(--farbe-grau)",
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
        // Aufnahme läuft — bewusst ruhig: kein Rot, kein Pulsieren, gleiche Fläche wie der Startknopf
        <div
          className="w-full flex items-center gap-3"
          role="status"
          style={{
            minHeight: 60,
            padding: "10px 10px 10px 10px",
            border: "1.5px solid var(--farbe-gut)",
            borderRadius: 10,
            background: "color-mix(in srgb, var(--farbe-gut) 10%, var(--farbe-bg))",
            color: "var(--farbe-text)",
          }}
        >
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--farbe-bg)", color: "var(--farbe-text)" }}
            aria-hidden="true"
          >
            <Mic size={18} />
          </span>
          <span className="flex flex-col flex-1">
            <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.3 }}>
              {sie ? "Wir hören zu – sprechen Sie einfach." : "Wir hören zu – sprich einfach."}
            </span>
            <span style={{ fontSize: 13.5, lineHeight: 1.4, color: "var(--farbe-text-daempft)" }}>
              {sie ? "Drücken Sie „Fertig“, wenn Sie alles gesagt haben." : "Drück „Fertig“, wenn du alles gesagt hast."}
            </span>
          </span>
          <button
            type="button"
            onClick={stoppe}
            className="shrink-0"
            style={{
              minHeight: 44,
              padding: "0 16px",
              borderRadius: 9,
              background: "var(--farbe-text)",
              color: "var(--farbe-bg)",
              fontSize: 14.5,
              fontWeight: 600,
            }}
          >
            Fertig
          </button>
          <button
            type="button"
            onClick={verwerfen}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ color: "var(--farbe-text-daempft)" }}
            aria-label="Aufnahme verwerfen"
            title="Aufnahme verwerfen"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {fehler && !aufnimmt && (
        <p className="mt-2" role="status" style={{ fontSize: 13, lineHeight: 1.5, color: "var(--farbe-text)" }}>
          {fehlerUrsache(fehler, sie)} {sie ? "Sie können" : "Du kannst"} die Antwort auch einfach eintippen.{" "}
          <span style={{ color: "var(--farbe-grau-mid)", fontSize: 12 }}>({String(fehler)})</span>
        </p>
      )}

      <p className="mt-3" style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--farbe-text-daempft)" }}>
        Es wird keine Audiodatei gespeichert. Die Umwandlung in Text übernimmt die Spracherkennung {sie ? "Ihres" : "deines"} Browsers — dabei wird die Aufnahme kurzzeitig an dessen Dienst übertragen. Gespeichert wird bei uns nur der Text, den {sie ? "Sie" : "du"} danach {sie ? "sehen und korrigieren können" : "siehst und korrigieren kannst"}.
      </p>
    </div>
  );
}