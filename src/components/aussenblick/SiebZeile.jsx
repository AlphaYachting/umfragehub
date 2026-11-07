import React from "react";
import { cn } from "@/lib/utils";
import StatusEtikett from "@/components/shared/StatusEtikett";
import { ZIEL_STATUS } from "@/lib/aussenblick";

// Eine Zeile der Zielliste für Ziele aus der Reviersuche: die ersten Kennzahlen des Siebs
// groß und auf einen Blick — Punkte, Werbedruck, Widerspruch, Draht, Anzeigen, ob jetzt geworben wird.
// Nur Anzeige, kein Knopf hier schickt etwas hinaus.

// Ab 6 Punkten Kandidat für den tiefen Scan, unter 3 Beobachtung, dazwischen entscheidet Alfons.
export function siebTon(punkte) {
  if (punkte >= 6) return "attention";
  if (punkte >= 3) return "info";
  return "neutral";
}

const PUNKTE_FLAECHE = {
  attention: "bg-status-attention-surface text-status-attention",
  info: "bg-status-info-surface text-status-info",
  neutral: "bg-muted text-muted-foreground",
};

// „Sieb 8/10: …“ — die Punkte stehen schon groß links, der Satz beginnt danach
export function siebSatz(ziel) {
  return String(ziel.blick?.divergenz || "").replace(/^Sieb\s*\d+\s*\/\s*10\s*:\s*/i, "");
}

function Punkte({ wert, von }) {
  return (
    <span className="inline-flex gap-[3px]" aria-hidden="true">
      {Array.from({ length: von }, (_, i) => (
        <span key={i} className={cn("w-2.5 h-2.5 rounded-[2px]", i < wert ? "bg-foreground" : "bg-muted")} />
      ))}
    </span>
  );
}

function Messwert({ label, wert, von, text }) {
  return (
    <div className="flex items-center gap-2 min-w-0" title={`${label} ${wert} von ${von}`}>
      <span className="text-label uppercase text-muted-foreground w-[92px] shrink-0">{label}</span>
      <Punkte wert={wert || 0} von={von} />
      <span className="text-value tabular-nums w-4 text-right shrink-0">{wert ?? "–"}</span>
      {text && <span className="text-meta text-muted-foreground truncate">{text}</span>}
    </div>
  );
}

function Kanal({ label, wert }) {
  const n = Number(wert) || 0;
  return (
    <div className="min-w-[56px]">
      <p className={cn("text-value tabular-nums leading-tight", n ? "text-foreground" : "text-muted-foreground")}>{n ? n : "–"}</p>
      <p className="text-label uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

export default function SiebZeile({ ziel, status, onClick }) {
  const s = ziel.sieb || {};
  const w = ziel.werbung || {};
  const ton = siebTon(s.punkte || 0);
  const label = [ziel.region, ziel.branche].filter(Boolean).join(" · ");
  const satz = siebSatz(ziel);
  const st = ZIEL_STATUS[status] || {};
  return (
    <div
      onClick={onClick}
      className="grid gap-x-5 gap-y-3 px-4 py-4 cursor-pointer hover:bg-muted/40 items-center grid-cols-[64px_minmax(0,1fr)] lg:grid-cols-[64px_minmax(0,1fr)_300px_230px_auto]"
    >
      {/* Punkte */}
      <div
        className={cn("w-16 h-16 rounded-lg flex flex-col items-center justify-center row-span-2 lg:row-span-1", PUNKTE_FLAECHE[ton])}
        title="Punkte aus dem Sieb: Werbedruck + Widerspruch + Draht"
      >
        <span className="text-[28px] leading-none font-extrabold tabular-nums">{s.punkte ?? "–"}</span>
        <span className="text-label">von 10</span>
      </div>

      {/* Unternehmen */}
      <div className="min-w-0">
        <p className="text-object text-foreground truncate">{ziel.unternehmen}</p>
        {label && <p className="text-label uppercase text-muted-foreground truncate">{label}</p>}
        {satz && (
          <p
            className="text-body text-muted-foreground mt-1"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            title={satz}
          >
            {satz}
          </p>
        )}
      </div>

      {/* Werbedruck, Widerspruch, Draht */}
      <div className="col-start-2 lg:col-start-auto space-y-1.5 min-w-0">
        <Messwert label="Werbedruck" wert={s.werbedruck} von={4} />
        <Messwert label="Widerspruch" wert={s.widerspruch} von={3} />
        <Messwert label="Draht" wert={s.draht} von={3} text={s.drahtKurz} />
      </div>

      {/* Anzeigen und ob jetzt geworben wird */}
      <div className="col-start-2 lg:col-start-auto min-w-0">
        <div className="flex gap-3">
          <Kanal label="LinkedIn" wert={w.linkedin} />
          <Kanal label="Google" wert={w.google} />
          <Kanal label="Meta" wert={w.meta} />
        </div>
        {s.wirbtJetzt ? (
          <p className="text-meta text-status-done-text mt-1.5 truncate" title={s.jetzt ? `In den letzten 30 Tagen: ${s.jetzt}` : "Anzeige in den letzten 30 Tagen"}>
            <span className="inline-block w-2 h-2 rounded-full bg-status-done mr-1.5 align-middle" />
            wirbt jetzt{s.jetzt ? `: ${s.jetzt}` : ""}
          </p>
        ) : (
          <p className="text-meta text-muted-foreground mt-1.5">derzeit keine Anzeige</p>
        )}
      </div>

      {/* Status */}
      <div className="col-start-2 lg:col-start-auto flex lg:justify-end">
        <StatusEtikett ton={st.ton}>{st.label || status}</StatusEtikett>
      </div>
    </div>
  );
}
