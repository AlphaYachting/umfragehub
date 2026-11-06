import React from "react";
import { Megaphone, Globe, MessageSquareQuote, Crosshair, Search, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Box } from "@/components/shared/Box";
import StatusEtikett from "@/components/shared/StatusEtikett";
import ModulPille from "@/components/aussenblick/ModulPille";

// Die Entscheidungsansicht eines Ziels in zehn Sekunden:
// Was wollen sie verkaufen (Anzeigen) · Wie treten sie auf (Website) · Was sagen Kunden
// → Wen sie eigentlich wollen → Divergenz in einem Satz → Zugriff und Sichtbarkeit.
// Alles andere der Zielkarte ist Beleg dafür.

const GRAD = {
  hoch: { label: "Divergenz hoch", ton: "attention" },
  mittel: { label: "Divergenz mittel", ton: "info" },
  gering: { label: "Divergenz gering", ton: "neutral" },
  offen: { label: "Divergenz offen", ton: "neutral" },
};

function Spalte({ symbol: Symbol, titel, text }) {
  return (
    <div className="min-w-0 px-4 py-3.5 space-y-1.5">
      <p className="flex items-center gap-1.5 text-label uppercase text-muted-foreground">
        <Symbol className="w-3.5 h-3.5 shrink-0" />
        {titel}
      </p>
      <p className="text-body text-foreground">{text || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

export default function AufEinenBlick({ ziel }) {
  const b = ziel?.blick || {};
  const leer = !b.verkaufen && !b.auftritt && !b.kunden && !b.divergenz;
  const grad = GRAD[b.divergenzGrad] || GRAD.offen;

  if (leer) {
    return (
      <Box>
        <div className="px-4 py-3.5">
          <p className="text-label uppercase text-muted-foreground">Auf einen Blick</p>
          <p className="text-meta text-muted-foreground mt-1">Kommt mit dem Scan: Was sie verkaufen wollen, wie sie auftreten, was Kunden sagen, wo die Divergenz liegt.</p>
        </div>
      </Box>
    );
  }

  return (
    <Box className="overflow-hidden">
      {/* Drei Quellen nebeneinander */}
      <div className="grid md:grid-cols-3 md:divide-x divide-y md:divide-y-0 border-b">
        <Spalte symbol={Megaphone} titel="Sie werben für" text={b.verkaufen} />
        <Spalte symbol={Globe} titel="So treten sie auf" text={b.auftritt} />
        <Spalte symbol={MessageSquareQuote} titel="Das sagen Kunden" text={b.kunden} />
      </div>

      {/* Wen sie eigentlich wollen */}
      {b.wunsch && (
        <div className="px-4 py-3 border-b flex gap-3 items-start">
          <Target className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-label uppercase text-muted-foreground">Wen sie eigentlich wollen</p>
            <p className="text-body text-foreground">{b.wunsch}</p>
          </div>
        </div>
      )}

      {/* Divergenz — der eine Satz */}
      <div className={cn("px-4 py-4 border-b space-y-2", grad.ton === "attention" && "shadow-[inset_3px_0_0_hsl(var(--status-attention))]")}>
        <StatusEtikett ton={grad.ton}>{grad.label}</StatusEtikett>
        <p className="text-object text-foreground">{b.divergenz || "—"}</p>
      </div>

      {/* Zugriff und Sichtbarkeit */}
      <div className="grid md:grid-cols-2 md:divide-x divide-y md:divide-y-0">
        <div className="px-4 py-3.5 space-y-1.5 shadow-[inset_3px_0_0_hsl(var(--primary))]">
          <p className="flex items-center gap-2 text-label uppercase text-muted-foreground">
            <Crosshair className="w-3.5 h-3.5 shrink-0" />
            Zugriff
            <ModulPille modul={ziel.modul} />
          </p>
          <p className="text-body text-foreground">{b.zugriff || "—"}</p>
        </div>
        <Spalte symbol={Search} titel="Sichtbarkeit" text={b.sichtbarkeit} />
      </div>
    </Box>
  );
}
