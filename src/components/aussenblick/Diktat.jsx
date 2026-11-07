import React, { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Diktat für ein Textfeld der Verwaltung: Mikrofon drücken, sprechen, der Text erscheint
// live im Feld (vorläufig Erkanntes inklusive), Stopp drücken. Nutzt die Spracherkennung
// des Browsers — keine Audiodatei, kein Server. Eigene, schlanke Fassung für das
// Außenblick-Modul; die Interview-Komponente bleibt unberührt.

function anhaengen(basis, diktat) {
  const d = String(diktat || "").replace(/\s+/g, " ").trim();
  const b = String(basis || "");
  if (!d) return b;
  if (!b.trim()) return d;
  return /\s$/.test(b) ? b + d : `${b} ${d}`;
}

export function diktatMoeglich() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function Diktat({ wert, onChange, className }) {
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");
  const recRef = useRef(null);
  const basisRef = useRef("");
  const fertigRef = useRef("");
  const laufRef = useRef("");
  const vorlaeufigRef = useRef("");
  const aktivRef = useRef(false);
  const idRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const wertRef = useRef(wert);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { wertRef.current = wert; }, [wert]);
  useEffect(() => () => stopp(), []); // eslint-disable-line react-hooks/exhaustive-deps

  function melden(vorlaeufig = "") {
    onChangeRef.current(anhaengen(basisRef.current, `${fertigRef.current} ${laufRef.current} ${vorlaeufig}`));
  }

  function stopp() {
    aktivRef.current = false;
    setLaeuft(false);
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* egal */ }
      recRef.current = null;
    }
  }

  async function start() {
    stopp();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setFehler("Dieser Browser hat keine eingebaute Spracheingabe (Chrome oder Safari nehmen)."); return; }
    setFehler("");
    const meine = ++idRef.current;
    basisRef.current = wertRef.current || "";
    fertigRef.current = ""; laufRef.current = ""; vorlaeufigRef.current = "";

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach((t) => t.stop());
      } catch (e) {
        setFehler(e?.name === "NotAllowedError" ? "Das Mikrofon ist für diese Seite gesperrt — über das Schloss in der Adresszeile erlauben." : "Kein Mikrofon gefunden.");
        return;
      }
    }

    const rec = new SR();
    const sprache = navigator.language || "";
    rec.lang = /^de(-|$)/i.test(sprache) ? sprache : "de-AT";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      if (idRef.current !== meine) return;
      let fertig = "", vorlaeufig = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (!r || !r[0]) continue;
        if (r.isFinal) fertig = `${fertig} ${r[0].transcript}`;
        else vorlaeufig = `${vorlaeufig} ${r[0].transcript}`;
      }
      laufRef.current = fertig;
      vorlaeufigRef.current = vorlaeufig;
      melden(vorlaeufig);
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setFehler(e.error === "not-allowed" ? "Das Mikrofon ist für diese Seite gesperrt." : e.error === "network" ? "Der Spracherkennungsdienst des Browsers ist gerade nicht erreichbar." : "Die Spracheingabe lässt sich gerade nicht starten.");
      stopp();
    };
    rec.onend = () => {
      if (idRef.current === meine) {
        fertigRef.current = `${fertigRef.current} ${laufRef.current} ${vorlaeufigRef.current}`.replace(/\s+/g, " ").trim();
        laufRef.current = ""; vorlaeufigRef.current = "";
      }
      if (recRef.current !== rec) return;
      if (aktivRef.current) {
        setTimeout(() => { if (aktivRef.current && recRef.current === rec) { try { rec.start(); } catch { /* egal */ } } }, 200);
      } else {
        melden();
      }
    };
    recRef.current = rec;
    aktivRef.current = true;
    try { rec.start(); setLaeuft(true); } catch { setFehler("Die Spracheingabe lässt sich gerade nicht starten."); aktivRef.current = false; recRef.current = null; }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {laeuft ? (
        <Button type="button" size="sm" variant="outline" onClick={stopp} className="border-status-done text-status-done-text">
          <Square className="w-3.5 h-3.5 fill-current" /> Fertig — ich höre zu
        </Button>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={start} title="Änderungswünsche diktieren — der Text erscheint live im Feld">
          <Mic className="w-3.5 h-3.5" /> Diktieren
        </Button>
      )}
      {fehler && <span className="text-meta text-status-attention">{fehler}</span>}
    </div>
  );
}
