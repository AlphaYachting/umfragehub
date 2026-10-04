import React, { useState } from "react";
import { Smartphone, Monitor, RotateCw, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { vorschauUrl } from "@/lib/verwaltung";

// Vorschau der Befragung direkt in der Verwaltung — Handy- oder Desktop-Breite.
// Läuft im Vorschau-Modus (?test=1): es wird nichts gespeichert, Pflichtfragen
// lassen sich überspringen, und es geht auch im Status „Entwurf“.
export default function VorschauDialog({ welle, offen, onClose }) {
  const [modus, setModus] = useState("handy");
  const [zaehler, setZaehler] = useState(0);
  if (!welle) return null;
  const url = vorschauUrl(welle.linkToken);

  const umschalter = (wert, Icon, label) => (
    <button
      type="button"
      onClick={() => setModus(wert)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
        modus === wert ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );

  return (
    <Dialog open={offen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] h-[92vh] flex flex-col gap-3 p-4">
        <DialogHeader className="space-y-0">
          <DialogTitle className="text-base pr-8">Vorschau — {welle.name}</DialogTitle>
          <DialogDescription className="text-xs">
            So sehen Befragte die Welle. Im Vorschau-Modus wird nichts gespeichert.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex bg-muted rounded-lg p-1">
            {umschalter("handy", Smartphone, "Handy")}
            {umschalter("desktop", Monitor, "Desktop")}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setZaehler(zaehler + 1)}>
              <RotateCw size={15} /> Von vorne
            </Button>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink size={15} /> Neuer Tab
              </Button>
            </a>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-muted rounded-lg flex justify-center overflow-hidden">
          <iframe
            key={`${modus}-${zaehler}`}
            src={url}
            title={`Vorschau ${welle.name}`}
            allow="microphone"
            className={
              modus === "handy"
                ? "h-full w-[390px] max-w-full bg-card border-x border-border"
                : "h-full w-full bg-card"
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
