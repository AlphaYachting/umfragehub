import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZIELGRUPPE_LABELS } from "@/lib/interview";
import { toast } from "sonner";

// Komplett-Import: wählt eine ganze Bibliothek (Container / Zielgruppe) aus
// und legt automatisch Blöcke aus den Fragen-Kategorien an.
// onImport erhält ein Array von { kategorie, fragen: [Bibliotheksfrage] }.
export default function BibliothekImportDialog({ offen, onClose, onImport }) {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState("all");
  const [filterZielgruppe, setFilterZielgruppe] = useState("all");
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!offen) return;
    laden();
  }, [offen]);

  async function laden() {
    setLoading(true);
    try {
      const cs = await base44.entities.BibliotheksContainer.list("-created_date", 500);
      setContainers(cs.map((c) => c.name));
      const liste = await base44.entities.Bibliotheksfrage.list("-created_date", 500);
      setFragen(liste);
    } catch (e) {
      toast.error("Bibliothek konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  function gefiltert() {
    return fragen
      .filter((f) => {
        if (selectedContainer !== "all" && f.container !== selectedContainer) return false;
        if (filterZielgruppe !== "all" && f.zielgruppe !== filterZielgruppe && f.zielgruppe !== "allgemein") return false;
        return true;
      })
      .sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
  }

  // Fragen nach Kategorie gruppieren — jede Kategorie wird ein Block
  function gruppiert() {
    const liste = gefiltert();
    const map = {};
    for (const f of liste) {
      const kat = f.kategorie || "Ohne Kategorie";
      if (!map[kat]) map[kat] = [];
      map[kat].push(f);
    }
    return Object.entries(map)
      .map(([kategorie, fs]) => ({
        kategorie,
        fragen: fs,
        minReihenfolge: Math.min(...fs.map((f) => f.reihenfolge ?? 0)),
      }))
      .sort((a, b) => a.minReihenfolge - b.minReihenfolge);
  }

  function bestaetigen() {
    const gruppen = gruppiert();
    if (gruppen.length === 0) {
      toast.error("Keine Fragen für die Auswahl gefunden.");
      return;
    }
    onImport(gruppen);
    onClose();
  }

  if (!offen) return null;

  const gruppen = gruppiert();
  const totalFragen = gruppen.reduce((s, g) => s + g.fragen.length, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-semibold mb-1">Komplette Bibliothek importieren</h3>
          <p className="text-sm text-slate-500 mb-4">
            Es werden automatisch Blöcke aus den Kategorien der Fragen angelegt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={selectedContainer} onValueChange={setSelectedContainer}>
              <SelectTrigger><SelectValue placeholder="Container" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Container</SelectItem>
                {containers.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterZielgruppe} onValueChange={setFilterZielgruppe}>
              <SelectTrigger><SelectValue placeholder="Zielgruppe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Zielgruppen</SelectItem>
                {Object.entries(ZIELGRUPPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-8">Lade…</p>
          ) : gruppen.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Keine Fragen gefunden.</p>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                <strong>{totalFragen} Fragen</strong> in <strong>{gruppen.length} Blöcken</strong>:
              </div>
              {gruppen.map((g) => (
                <div key={g.kategorie} className="border border-slate-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-800">{g.kategorie}</span>
                    <span className="text-xs text-slate-400">{g.fragen.length} Frage(n)</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {g.fragen.slice(0, 3).map((f) => (f.text || "").slice(0, 60)).join(" · ")}
                    {g.fragen.length > 3 && " …"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">{totalFragen} Fragen, {gruppen.length} Blöcke</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button onClick={bestaetigen} disabled={gruppen.length === 0}>Importieren</Button>
          </div>
        </div>
      </div>
    </div>
  );
}