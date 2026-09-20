import React from "react";

// Dezente rechtliche Fußzeile für Welcome- und Abschluss-Screen.
// Nur sichtbar, wenn am Projekt mindestens eine URL hinterlegt ist.
export default function RechtlicheFusszeile({ projekt }) {
  if (!projekt) return null;
  const datenschutz = projekt.datenschutzUrl;
  const impressum = projekt.impressumUrl;
  if (!datenschutz && !impressum) return null;
  return (
    <div className="mt-10 pt-4 border-t text-center" style={{ borderColor: "var(--farbe-grau)" }}>
      <div className="text-xs flex items-center justify-center gap-2" style={{ color: "var(--farbe-grau-mid)" }}>
        {datenschutz && (
          <a href={datenschutz} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--farbe-grau-mid)" }}>
            Datenschutz
          </a>
        )}
        {datenschutz && impressum && <span>·</span>}
        {impressum && (
          <a href={impressum} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--farbe-grau-mid)" }}>
            Impressum
          </a>
        )}
      </div>
      <div className="text-xs mt-1.5" style={{ color: "var(--farbe-grau-mid)" }}>
        Befragung durchgeführt mit rittler&co
      </div>
    </div>
  );
}