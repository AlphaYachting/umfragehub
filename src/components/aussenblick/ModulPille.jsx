import React from "react";
import { ZIELGRUPPE_PILLE } from "@/lib/designTon";
import { MODUL } from "@/lib/aussenblick";

// Pille für das Einstiegsmodul eines Ziels — gleiche Breite und Farbpaare wie die Typ-Pille
// der Wellen, damit die Zeilen der Zielliste wie die der Übersicht lesbar sind.
export default function ModulPille({ modul }) {
  const m = MODUL[modul];
  const s = m ? ZIELGRUPPE_PILLE[m.pille] : null;
  if (!s) {
    return (
      <span className="inline-flex items-center justify-center w-[104px] shrink-0 h-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.5px] bg-muted text-muted-foreground">
        offen
      </span>
    );
  }
  const kurz = modul === "positionierung" ? "Position." : modul === "kunden" ? "Kunden" : modul === "team" ? "Team" : "Vertrieb";
  return (
    <span
      title={m.label}
      className="inline-flex items-center justify-center w-[104px] shrink-0 h-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.5px]"
      style={{ backgroundColor: s.pillBg, color: s.pillText }}
    >
      {kurz}
    </span>
  );
}
