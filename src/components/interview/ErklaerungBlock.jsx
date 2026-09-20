import React, { useRef } from "react";

// Aufklappbare Marginalie „Warum fragen wir das?" — linker Balken in der
// Akzentfarbe, eingerückter Text, etwas kleiner und gedämpfter.
// Zustand wird vom Eltern gehalten (pro Frage, solange die Sitzung läuft).
export default function ErklaerungBlock({ frage, offen, onToggle }) {
  const containerRef = useRef(null);
  if (!frage.erklaerung || !frage.erklaerung.trim()) return null;

  const absaetze = frage.erklaerung.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

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
        className="text-sm font-medium hover:underline"
        style={{ color: "var(--farbe-akzent)" }}
      >
        Warum fragen wir das?
      </button>
      {offen && (
        <div
          ref={containerRef}
          id={`erklaerung-${frage.id}`}
          className="interview-erklaerung mt-2 text-sm"
          style={{ color: "var(--farbe-text-daempft)" }}
        >
          {absaetze.map((p, i) => (
            <p key={i} className="mb-2" style={{ lineHeight: 1.6 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}