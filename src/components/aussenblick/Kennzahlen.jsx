import React from "react";
import { cn } from "@/lib/utils";
import { TON_STREIFEN } from "@/lib/designTon";

// Eine Kennzahlreihe für das Außenblick-Modul — gleiche Optik wie die Kennzahlleiste der
// Verwaltung, aber der Hinweis darf auf zwei Zeilen umbrechen, statt abgeschnitten zu werden,
// und die Zelle bleibt auch bei sechs Kacheln lesbar. Eigene Datei, damit die geteilte
// Komponente unverändert bleibt.
const ZELLE = "text-left px-4 py-3.5 min-w-0 border-border border-t [&:nth-child(-n+2)]:border-t-0 md:[&:nth-child(-n+3)]:border-t-0 xl:border-t-0 md:[&:not(:nth-child(3n+1))]:border-l xl:[&:not(:first-child)]:border-l";

export default function Kennzahlen({ werte = [] }) {
  return (
    <div className="bg-card border rounded-lg grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {werte.map((w, i) => (
        <div key={i} className={cn(ZELLE, (w.ton === "attention" || w.ton === "critical") && TON_STREIFEN[w.ton])}>
          <p className="text-label uppercase text-muted-foreground truncate" title={w.label}>{w.label}</p>
          <div className="tabular-nums text-kpi text-foreground whitespace-nowrap">{w.wert}</div>
          {w.hinweis && (
            <p className={cn("text-meta leading-snug line-clamp-2", w.ton === "done" ? "text-status-done-text" : "text-muted-foreground")} title={typeof w.hinweis === "string" ? w.hinweis : undefined}>
              {w.hinweis}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
