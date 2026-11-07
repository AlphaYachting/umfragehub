import React from "react";
import { Megaphone, Globe, MessageSquareQuote, Crosshair, Search, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Box } from "@/components/shared/Box";
import StatusEtikett from "@/components/shared/StatusEtikett";
import ModulPille from "@/components/aussenblick/ModulPille";

// Die Entscheidungsansicht eines Ziels in zehn Sekunden, in zwei Blöcken:
//   Urteil  — der eine Divergenz-Satz und der Zugriff (steht ganz oben auf der Zielkarte)
//   Quellen — was sie verkaufen wollen · wie sie auftreten · was Kunden sagen · wen sie wollen
// Alles andere der Zielkarte ist Beleg dafür.

const GRAD = {
  hoch: { label: "Divergenz hoch", ton: "attention" },
  mittel: { label: "Divergenz mittel", ton: "info" },
  gering: { label: "Divergenz gering", ton: "neutral" },
  offen: { label: "Divergenz offen", ton: "neutral" },
};

function Spalte({ symbol: Symbol, titel, text, className }) {
  return (
    <div className={cn("min-w-0 px-4 py-3.5 space-y-1.5", className)}>
      <p className="flex items-center gap-1.5 text-label uppercase text-muted-foreground">
        <Symbol className="w-3.5 h-3.5 shrink-0" />
        {titel}
      </p>
      <p className="text-body text-foreground">{text || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

// Block 1: das Urteil — Divergenz in einem Satz, darunter der Zugriff.
export function Urteil({ ziel }) {
  const b = ziel?.blick || {};
  const grad = GRAD[b.divergenzGrad] || GRAD.offen;
  if (!b.divergenz && !b.zugriff) {
    return (
      <Box>
        <div className="px-4 py-3.5">
          <p className="text-label uppercase text-muted-foreground">Urteil</p>
          <p className="text-meta text-muted-foreground mt-1">Kommt mit dem Scan: die Divergenz in einem Satz und wo wir zugreifen.</p>
        </div>
      </Box>
    );
  }
  return (
    <Box className="overflow-hidden">
      <div className={cn("px-5 py-4 space-y-2", grad.ton === "attention" && "shadow-[inset_3px_0_0_hsl(var(--status-attention))]")}>
        <StatusEtikett ton={grad.ton}>{grad.label}</StatusEtikett>
        <p className="text-page text-foreground">{b.divergenz || "—"}</p>
      </div>
      <div className="px-5 py-3.5 border-t bg-muted/30 flex gap-3 items-start shadow-[inset_3px_0_0_hsl(var(--primary))]">
        <Crosshair className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 space-y-1">
          <p className="flex items-center gap-2 text-label uppercase text-muted-foreground">
            Zugriff
            <ModulPille modul={ziel.modul} />
          </p>
          <p className="text-body text-foreground">{b.zugriff || "—"}</p>
        </div>
      </div>
    </Box>
  );
}

// Block 2: die Quellen — drei Spalten, darunter Wunschzielgruppe und Sichtbarkeit, dann die Eckdaten.
export default function AufEinenBlick({ ziel, eckdaten = [] }) {
  const b = ziel?.blick || {};
  const leer = !b.verkaufen && !b.auftritt && !b.kunden;

  if (leer) {
    return (
      <Box>
        <div className="px-4 py-3.5">
          <p className="text-label uppercase text-muted-foreground">Was wir gesehen haben</p>
          <p className="text-meta text-muted-foreground mt-1">Kommt mit dem Scan: Was sie verkaufen wollen, wie sie auftreten, was Kunden sagen.</p>
        </div>
      </Box>
    );
  }

  return (
    <Box className="overflow-hidden">
      <div className="grid md:grid-cols-3 md:divide-x divide-y md:divide-y-0">
        <Spalte symbol={Megaphone} titel="Sie werben für" text={b.verkaufen} />
        <Spalte symbol={Globe} titel="So treten sie auf" text={b.auftritt} />
        <Spalte symbol={MessageSquareQuote} titel="Das sagen Kunden" text={b.kunden} />
      </div>
      {(b.wunsch || b.sichtbarkeit) && (
        <div className="grid md:grid-cols-2 md:divide-x divide-y md:divide-y-0 border-t">
          <Spalte symbol={Target} titel="Wen sie eigentlich wollen" text={b.wunsch} />
          <Spalte symbol={Search} titel="Sichtbarkeit" text={b.sichtbarkeit} />
        </div>
      )}
      {eckdaten.length > 0 && (
        <p className="px-4 py-2.5 border-t bg-muted/30 text-meta text-muted-foreground">
          {eckdaten.filter(Boolean).join(" · ")}
        </p>
      )}
    </Box>
  );
}
