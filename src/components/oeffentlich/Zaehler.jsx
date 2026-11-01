import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { F } from "@/components/oeffentlich/Oeffentlich";

// Zum Ausprobieren: Eine Gruppe wird erst gezeigt, wenn genug Interviews da sind.
// Genutzt auf der Teamseite und auf Über uns.
export const MINDESTZAHL = 6;

export default function Zaehler({ titel = "Das siehst du", bereich = "Werkstatt" }) {
  const [n, setN] = useState(3);
  const offen = n >= MINDESTZAHL;
  let sichtbar;
  if (n === 0) sichtbar = "Noch nichts. Hier wartet niemand auf einzelne Antworten.";
  else if (!offen) sichtbar = `Nur, dass ${n} von ${MINDESTZAHL} nötigen Interviews da sind. Keine Antworten, keine Tendenz.`;
  else sichtbar = `Ab jetzt das gemeinsame Bild der ${bereich}. Nie eine einzelne Antwort, nie ein Name.`;

  return (
    <div className="flex-[1_1_440px] min-w-0 rounded-[28px] p-8" style={{ background: F.dunkelKarte }}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-bold">Bereich {bereich}</p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setN((x) => Math.max(0, x - 1))}
            aria-label="Ein Interview weniger"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ border: "1px solid #767676", background: "transparent" }}
          >
            <Minus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span aria-live="polite" className="min-w-[48px] text-center text-[30px] font-black">{n}</span>
          <button
            type="button"
            onClick={() => setN((x) => Math.min(10, x + 1))}
            aria-label="Ein Interview mehr"
            className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white"
            style={{ background: F.akzent }}
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div aria-hidden="true" className="mt-[22px] flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => {
          const voll = i < n;
          const farbe = offen ? "#45d085" : F.akzent;
          return (
            <span
              key={i}
              className="w-[30px] h-[30px] rounded-full box-border"
              style={{ background: voll ? farbe : "transparent", border: `2px solid ${voll ? farbe : "#767676"}` }}
            />
          );
        })}
      </div>
      <div className="mt-6 rounded-[18px] p-5" style={{ background: offen ? "#45d085" : "#4a4a4a", color: offen ? F.dunkel : "#ffffff" }}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-85">{titel}</p>
        <p aria-live="polite" className="mt-1.5 text-lg leading-[1.4] font-bold">{sichtbar}</p>
      </div>
      <p className="mt-3.5 text-xs" style={{ color: "#b3b3b3" }}>Die Mindestzahl legen wir mit dir fest, standardmäßig {MINDESTZAHL}.</p>
    </div>
  );
}
