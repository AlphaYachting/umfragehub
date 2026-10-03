import React, { useRef } from "react";
import { Info } from "lucide-react";
import { platzhalterErsetzen } from "@/lib/interview";

// Aufklappbare Marginalie „Warum fragen wir das?" — linker Balken in der
// Akzentfarbe, eingerückter Text, etwas kleiner und gedämpfter.
// Zustand wird vom Eltern gehalten (pro Frage, solange die Sitzung läuft).
export default function ErklaerungBlock({ frage, offen, onToggle, textKontext }) {
  const containerRef = useRef(null);
  if (!frage.erklaerung || !frage.erklaerung.trim()) return null;

  const erklaerung = textKontext ? platzhalterErsetzen(frage.erklaerung, textKontext) : frage.erklaerung;
  const absaetze = erklaerung.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  function klicken() {
    const wirdOffen = !offen;
    onToggle(wirdOffen);
    if (wirdOffen && containerRef.current) {
      // sanft scrollen, damit der Text auf dem Handy sichtbar wird
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 60);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={klicken}
        aria-expanded={offen}
        aria-controls={`erklaerung-${frage.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium"
        style={{ color: "var(--farbe-text-daempft)", minHeight: 32 }}
      >
        <Info size={15} aria-hidden="true" />
        <span style={{ textDecoration: "underline", textDecorationColor: "var(--farbe-rahmen)", textUnderlineOffset: 3 }}>
          Warum fragen wir das?
        </span>
      </button>
      {offen && (
        <div
          ref={containerRef}
          id={`erklaerung-${frage.id}`}
          className="interview-erklaerung mt-2"
          style={{ color: "var(--farbe-text)", fontSize: "15px" }}
        >
          {absaetze.map((p, i) => (
            <p key={i} className="mb-2" style={{ lineHeight: 1.6 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}