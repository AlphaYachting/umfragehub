import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";

// Verlauf einer Welle oder eines Projekts: begonnene und abgeschlossene
// Interviews, aufsummiert je Tag. Optional mit Linie bei der Mindestzahl.
export default function VerlaufChart({ daten, mindest = null, hoehe = 220 }) {
  if (!daten || daten.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Noch keine Teilnahmen — der Verlauf erscheint mit dem ersten Interview.</p>;
  }
  const maxWert = Math.max(mindest || 0, ...daten.map((d) => d.gestartet));
  const schritt = Math.max(1, Math.ceil(daten.length / 10));

  return (
    <div>
      <div style={{ width: "100%", height: hoehe }}>
        <ResponsiveContainer>
          <AreaChart data={daten} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="tag" tick={{ fontSize: 11, fill: "#94a3b8" }} interval={schritt - 1} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
            <YAxis allowDecimals={false} domain={[0, Math.max(1, maxWert)]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#e2e8f0" }}
              formatter={(wert, name, eintrag) => {
                const neu = name === "Abgeschlossen" ? eintrag.payload.neuAbgeschlossen : eintrag.payload.neuGestartet;
                return [`${wert}${neu ? ` (+${neu} an diesem Tag)` : ""}`, name];
              }}
            />
            {mindest ? (
              <ReferenceLine y={mindest} stroke="#64748b" strokeDasharray="4 4" label={{ value: `Mindestzahl ${mindest}`, position: "insideTopLeft", fontSize: 11, fill: "#64748b" }} />
            ) : null}
            <Area type="stepAfter" dataKey="gestartet" name="Begonnen" stroke="#94a3b8" fill="#e2e8f0" strokeWidth={1.5} />
            <Area type="stepAfter" dataKey="abgeschlossen" name="Abgeschlossen" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-done border border-status-done/40" /> Abgeschlossen</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-muted border border-input" /> Begonnen</span>
        <span className="text-muted-foreground">aufsummiert je Tag</span>
      </div>
    </div>
  );
}
