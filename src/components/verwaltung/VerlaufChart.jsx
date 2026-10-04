import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";

// Farben ausschließlich aus den Tokens
const F = {
  linie: "hsl(var(--border))",
  grau: "hsl(var(--muted-foreground))",
  flaeche: "hsl(var(--muted))",
  dunkel: "hsl(var(--foreground))",
};

// Verlauf einer Welle oder eines Projekts: begonnene und abgeschlossene
// Interviews, aufsummiert je Tag. Optional mit Linie bei der Mindestzahl.
export default function VerlaufChart({ daten, mindest = null, hoehe = 220 }) {
  if (!daten || daten.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Noch keine Teilnahme — der Verlauf beginnt mit dem ersten Interview.</p>;
  }
  const maxWert = Math.max(mindest || 0, ...daten.map((d) => d.gestartet));
  const schritt = Math.max(1, Math.ceil(daten.length / 10));

  return (
    <div>
      <div style={{ width: "100%", height: hoehe }}>
        <ResponsiveContainer>
          <AreaChart data={daten} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={F.linie} vertical={false} />
            <XAxis dataKey="tag" tick={{ fontSize: 11, fill: F.grau }} interval={schritt - 1} tickLine={false} axisLine={{ stroke: F.linie }} />
            <YAxis allowDecimals={false} domain={[0, Math.max(1, maxWert)]} tick={{ fontSize: 11, fill: F.grau }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: F.linie, boxShadow: "none" }}
              formatter={(wert, name, eintrag) => {
                const neu = name === "Abgeschlossen" ? eintrag.payload.neuAbgeschlossen : eintrag.payload.neuGestartet;
                return [`${wert}${neu ? ` (+${neu} an diesem Tag)` : ""}`, name];
              }}
            />
            {mindest ? (
              <ReferenceLine y={mindest} stroke={F.grau} strokeDasharray="4 4" label={{ value: `Mindestzahl ${mindest}`, position: "insideTopLeft", fontSize: 11, fill: F.grau }} />
            ) : null}
            <Area type="stepAfter" dataKey="gestartet" name="Begonnen" stroke={F.grau} fill={F.flaeche} fillOpacity={1} strokeWidth={1} />
            <Area type="stepAfter" dataKey="abgeschlossen" name="Abgeschlossen" stroke={F.dunkel} fill={F.dunkel} fillOpacity={0.14} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 text-meta text-muted-foreground mt-2">
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-foreground" /> Abgeschlossen</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 bg-muted border" /> Begonnen</span>
        <span>aufsummiert je Tag</span>
      </div>
    </div>
  );
}
