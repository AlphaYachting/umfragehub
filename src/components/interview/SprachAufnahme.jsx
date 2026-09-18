import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SprachAufnahme({ onTranskript, ansprache }) {
  const [aufnimmt, setAufnimmt] = useState(false);
  const [sekunden, setSekunden] = useState(0);
  const [pegel, setPegel] = useState(0);
  const [verarbeitet, setVerarbeitet] = useState(false);
  const [fehler, setFehler] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => stoppeAlles();
  }, []);

  function stoppeAlles() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
    }
  }

  async function start() {
    setFehler(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const pegelLoop = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        setPegel(Math.min(1, Math.sqrt(sum / dataArray.length) * 3));
        rafRef.current = requestAnimationFrame(pegelLoop);
      };
      pegelLoop();

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.start();
      setAufnimmt(true);
      setSekunden(0);
      timerRef.current = setInterval(() => setSekunden((s) => s + 1), 1000);
    } catch (e) {
      setFehler(true);
    }
  }

  async function stop() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    setAufnimmt(false);
    setVerarbeitet(true);
    stoppeAlles();

    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "aufnahme.webm", { type: "audio/webm" });
      try {
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
        const res = await base44.functions.invoke("transkribiere", { file_uri });
        const transkript = res?.data?.transkript || "";
        if (transkript) {
          onTranskript(transkript);
        } else {
          setFehler(true);
        }
      } catch (e) {
        setFehler(true);
      } finally {
        setVerarbeitet(false);
      }
    };
    mr.stop();
  }

  const mm = String(Math.floor(sekunden / 60)).padStart(2, "0");
  const ss = String(sekunden % 60).padStart(2, "0");

  return (
    <div className="mt-3">
      {!aufnimmt && !verarbeitet && (
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
      )}

      {aufnimmt && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={stop}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: "var(--farbe-akzent)" }}
          >
            <Square size={16} />
          </button>
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-1">{mm}:{ss} · Aufnahme läuft</div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--farbe-grau)" }}>
              <div
                className="h-full transition-all"
                style={{ width: `${pegel * 100}%`, background: "var(--farbe-akzent)" }}
              />
            </div>
          </div>
          <button type="button" onClick={stop} className="text-sm text-slate-500" style={{ minHeight: 48 }}>
            Stoppen
          </button>
        </div>
      )}

      {verarbeitet && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin" /> Wird transkribiert…
        </div>
      )}

      {fehler && !aufnimmt && !verarbeitet && (
        <p className="text-xs text-slate-400 mt-2">
          Die Sprachaufnahme konnte leider nicht verarbeitet werden. {ansprache === "sie" ? "Sie können" : "Du kannst"} die Antwort einfach eintippen.
        </p>
      )}
    </div>
  );
}