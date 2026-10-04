import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FRAGETYP_LABELS, ZIELGRUPPE_LABELS } from "@/lib/interview";
import { toast } from "sonner";

export default function BibliothekDialog({ offen, onClose, onUebernehmen }) {
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterZielgruppe, setFilterZielgruppe] = useState("all");
  const [filterKategorie, setFilterKategorie] = useState("all");
  const [suche, setSuche] = useState("");
  const [auswahl, setAuswahl] = useState(new Set());

  useEffect(() => {
    if (!offen) return;
    laden();
  }, [offen]);

  async function laden() {
    setLoading(true);
    try {
      const liste = await base44.entities.Bibliotheksfrage.list("-created_date", 500);
      setFragen(liste);
    } catch (e) {
      toast.error("Bibliothek konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  function umschalten(id) {
    const neu = new Set(auswahl);
    if (neu.has(id)) neu.delete(id);
    else neu.add(id);
    setAuswahl(neu);
  }

  function gefiltert() {
    return fragen
      .filter((f) => {
        if (filterZielgruppe !== "all" && f.zielgruppe !== filterZielgruppe && f.zielgruppe !== "allgemein") return false;
        if (filterKategorie !== "all" && f.kategorie !== filterKategorie) return false;
        if (suche && !(f.text || "").toLowerCase().includes(suche.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
  }

  const kategorien = [...new Set(fragen.map((f) => f.kategorie).filter(Boolean))].sort();

  function uebernehmen() {
    const ausgewaehlt = fragen
      .filter((f) => auswahl.has(f.id))
      .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
    if (ausgewaehlt.length === 0) {
      toast.error("Bitte mindestens eine Frage auswählen.");
      return;
    }
    onUebernehmen(ausgewaehlt);
    setAuswahl(new Set());
    onClose();
  }

  if (!offen) return null;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl w-[96vw] max-h-[85vh] flex flex-col gap-0 p-0">
        <div className="p-5 border-b border-border">
          <DialogTitle className="text-value mb-3">Aus Fragenbibliothek übernehmen</DialogTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Suche…"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              className="sm:col-span-1"
            />
            <Select value={filterZielgruppe} onValueChange={setFilterZielgruppe}>
              <SelectTrigger><SelectValue placeholder="Zielgruppe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Zielgruppen</SelectItem>
                {Object.entries(ZIELGRUPPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterKategorie} onValueChange={setFilterKategorie}>
              <SelectTrigger><SelectValue placeholder="Kategorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {kategorien.map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Lade…</p>
          ) : gefiltert().length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Keine Fragen gefunden.</p>
          ) : (
            gefiltert().map((f) => (
              <button
                key={f.id}
                onClick={() => umschalten(f.id)}
                className={`w-full text-left p-3 rounded-md border-2 transition-colors ${
                  auswahl.has(f.id) ? "border-foreground bg-muted" : "border-border hover:border-foreground/25"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    auswahl.has(f.id) ? "bg-foreground border-foreground" : "border-input"
                  }`}>
                    {auswahl.has(f.id) && <Check size={12} className="text-background" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{f.text}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                      <span>{FRAGETYP_LABELS[f.typ]}</span>
                      {f.kategorie && <span>· {f.kategorie}</span>}
                      {f.zielgruppe && <span>· {ZIELGRUPPE_LABELS[f.zielgruppe]}</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{auswahl.size} ausgewählt</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={uebernehmen}>Übernehmen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
