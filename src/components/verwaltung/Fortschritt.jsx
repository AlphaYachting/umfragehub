import React from "react";

// Fortschrittsbalken einer Welle: abgeschlossen (kräftig), begonnen (hell),
// Markierung bei der Mindestteilnehmerzahl, wenn das Ziel darüber liegt.
export default function Fortschritt({ k, kompakt = false }) {
  const skala = Math.max(k.ziel, k.gestartet, 1);
  const pctAbgeschlossen = Math.min(100, (k.abgeschlossen / skala) * 100);
  const pctGestartet = Math.min(100, (k.gestartet / skala) * 100);
  const marker = k.mindest < skala ? (k.mindest / skala) * 100 : null;
  const farbe = k.schwelleErreicht ? "bg-green-500" : "bg-slate-700";
  const zielText = k.eingeladen ? `${k.eingeladen} eingeladen` : `${k.mindest} nötig`;

  return (
    <div className="min-w-0">
      <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-slate-300" style={{ width: `${pctGestartet}%` }} />
        <div className={`absolute inset-y-0 left-0 ${farbe}`} style={{ width: `${pctAbgeschlossen}%` }} />
        {marker !== null && (
          <div
            className="absolute inset-y-0 w-0.5 bg-slate-900/60"
            style={{ left: `${marker}%` }}
            title={`Mindestzahl: ${k.mindest}`}
          />
        )}
      </div>
      <div className={`mt-1 text-slate-500 ${kompakt ? "text-[11px]" : "text-xs"}`}>
        <span className="font-medium text-slate-800">{k.abgeschlossen}</span> abgeschlossen
        <span className="text-slate-400"> · {zielText}</span>
        {k.offen > 0 && <span className="text-slate-400"> · {k.offen} begonnen</span>}
      </div>
    </div>
  );
}
