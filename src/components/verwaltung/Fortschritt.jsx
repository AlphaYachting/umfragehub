import React from "react";
import { Check } from "lucide-react";

// Fortschrittszähler einer Welle — als Stückzahl, nicht als Prozent.
// Balken 6 px, Füllung schwarz; feine Marke bei der Mindestzahl, wenn das Ziel darüber liegt.
export default function Fortschritt({ k }) {
  const skala = Math.max(k.ziel, k.abgeschlossen, 1);
  const pct = Math.min(100, (k.abgeschlossen / skala) * 100);
  const marke = k.eingeladen && k.mindest < skala ? (k.mindest / skala) * 100 : null;
  const amZiel = k.abgeschlossen >= k.ziel && k.ziel > 0;

  let text;
  if (k.eingeladen) text = `${k.abgeschlossen} von ${k.eingeladen} abgeschlossen`;
  else text = `${k.abgeschlossen} von ${k.mindest} nötigen abgeschlossen`;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative h-1.5 flex-1 min-w-[80px] rounded-[3px] bg-border">
        <div className="absolute inset-y-0 left-0 rounded-[3px] bg-foreground" style={{ width: `${pct}%` }} />
        {marke !== null && (
          <div className="absolute -inset-y-1 w-px bg-muted-foreground" style={{ left: `${marke}%` }} title={`Mindestzahl: ${k.mindest}`} />
        )}
      </div>
      <span className="text-sm font-semibold text-foreground whitespace-nowrap tabular-nums inline-flex items-center gap-1.5">
        {amZiel && <Check className="w-3.5 h-3.5" />}
        {text}
      </span>
      {k.offen > 0 && <span className="text-meta text-muted-foreground whitespace-nowrap tabular-nums hidden sm:inline">{k.offen} begonnen</span>}
    </div>
  );
}
