import React, { useState, useEffect, useRef } from "react";
import { Plus, Copy, Trash2, Download, Upload, Pencil, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FRAGETYP_LABELS, ZIELGRUPPE_LABELS } from "@/lib/interview";
import FrageForm from "@/components/welle/FrageForm";

export default function QuestionLibrary() {
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterZielgruppe, setFilterZielgruppe] = useState("all");
  const [filterKategorie, setFilterKategorie] = useState("all");
  const [suche, setSuche] = useState("");
  const [bearbeiten, setBearbeiten] = useState(null); // id oder "neu"
  const [neu, setNeu] = useState(null);
  const [importiert, setImportiert] = useState(false);
  const importRef = useRef(null);

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

  useEffect(() => {
    laden();
  }, []);

  function gefiltert() {
    return fragen.filter((f) => {
      if (filterZielgruppe !== "all" && f.zielgruppe !== filterZielgruppe && f.zielgruppe !== "allgemein") return false;
      if (filterKategorie !== "all" && f.kategorie !== filterKategorie) return false;
      if (suche && !(f.text || "").toLowerCase().includes(suche.toLowerCase())) return false;
      return true;
    });
  }

  const kategorien = [...new Set(fragen.map((f) => f.kategorie).filter(Boolean))].sort();

  function neueFrageOeffnen() {
    setNeu({
      typ: "freitext",
      text: "",
      hilfetext: "",
      pflicht: true,
      optionen: [],
      skalaMin: 1,
      skalaMax: 5,
      sprachantwortErlaubt: false,
      zielgruppe: "allgemein",
      kategorie: "",
    });
  }

  async function speichern(frage, id) {
    try {
      if (id) {
        await base44.entities.Bibliotheksfrage.update(id, frage);
        toast.success("Aktualisiert.");
      } else {
        await base44.entities.Bibliotheksfrage.create(frage);
        toast.success("Frage angelegt.");
      }
      setBearbeiten(null);
      setNeu(null);
      laden();
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    }
  }

  async function duplizieren(f) {
    try {
      const { id, created_date, updated_date, created_by_id, ...rest } = f;
      await base44.entities.Bibliotheksfrage.create({
        ...rest,
        text: (f.text || "") + " (Kopie)",
      });
      toast.success("Dupliziert.");
      laden();
    } catch (e) {
      toast.error("Duplizieren fehlgeschlagen.");
    }
  }

  async function loeschen(f) {
    if (!confirm("Frage aus der Bibliothek löschen?")) return;
    try {
      await base44.entities.Bibliotheksfrage.delete(f.id);
      laden();
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  function exportieren() {
    const data = JSON.stringify(fragen.map(({ id, created_date, updated_date, created_by_id, ...rest }) => rest), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fragenbibliothek.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importieren(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportiert(true);
    try {
      const text = await file.text();
      const liste = JSON.parse(text);
      if (!Array.isArray(liste)) throw new Error("Keine Liste");
      let count = 0;
      for (const f of liste) {
        await base44.entities.Bibliotheksfrage.create({
          typ: f.typ || "freitext",
          text: f.text || "",
          hilfetext: f.hilfetext || "",
          pflicht: f.pflicht !== false,
          optionen: f.optionen || [],
          skalaMin: f.skalaMin ?? 1,
          skalaMax: f.skalaMax ?? 5,
          skalaLabelLinks: f.skalaLabelLinks || "",
          skalaLabelRechts: f.skalaLabelRechts || "",
          auswertungstag: f.auswertungstag || "",
          sprachantwortErlaubt: !!f.sprachantwortErlaubt,
          zielgruppe: f.zielgruppe || "allgemein",
          kategorie: f.kategorie || "",
          reihenfolge: 0,
        });
        count++;
      }
      toast.success(`${count} Frage(n) importiert.`);
      laden();
    } catch (err) {
      toast.error("Import fehlgeschlagen: ungültiges JSON.");
    } finally {
      setImportiert(false);
      if (importRef.current) importRef.current.value = "";
    }
  }

  const editObj = bearbeiten ? fragen.find((f) => f.id === bearbeiten) : null;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fragenbibliothek</h1>
          <p className="text-sm text-slate-500 mt-1">Wiederverwendbarer Fragenpool</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={exportieren}><Download size={15} className="mr-1" /> Export</Button>
          <Button variant="outline" size="sm" onClick={() => importRef.current?.click()} disabled={importiert}>
            {importiert ? <><span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin inline-block mr-2" /> Import läuft…</> : <><Upload size={15} className="mr-1" /> Import</>}
          </Button>
          <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={importieren} />
          <Button size="sm" onClick={neueFrageOeffnen}><Plus size={15} className="mr-1" /> Neue Frage</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Input placeholder="Suche…" value={suche} onChange={(e) => setSuche(e.target.value)} />
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

      {loading ? (
        <p className="text-sm text-slate-400">Lade…</p>
      ) : gefiltert().length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-12">Keine Fragen gefunden.</p>
      ) : (
        <div className="space-y-2">
          {gefiltert().map((f) => (
            <div key={f.id} className="bg-white border border-slate-200 rounded-md p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{f.text || "(leere Frage)"}</div>
                  <div className="text-xs text-slate-400 mt-1 flex gap-3 flex-wrap">
                    <span>{FRAGETYP_LABELS[f.typ]}</span>
                    {f.kategorie && <span>· {f.kategorie}</span>}
                    {f.zielgruppe && <span>· {ZIELGRUPPE_LABELS[f.zielgruppe]}</span>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setBearbeiten(f.id)}><Pencil size={15} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => duplizieren(f)}><Copy size={15} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => loeschen(f)} className="text-red-500"><Trash2 size={15} /></Button>
                </div>
              </div>

              {bearbeiten === f.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <FrageEditorBib frage={f} onSave={(fr) => speichern(fr, f.id)} onCancel={() => setBearbeiten(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {neu && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setNeu(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Neue Bibliotheksfrage</h3>
            <FrageEditorBib frage={neu} onSave={(fr) => speichern(fr, null)} onCancel={() => setNeu(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

function FrageEditorBib({ frage, onSave, onCancel }) {
  const [daten, setDaten] = useState(frage);
  return (
    <div className="space-y-4">
      <FrageForm frage={daten} onChange={setDaten} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Zielgruppe</Label>
          <Select value={daten.zielgruppe || "allgemein"} onValueChange={(v) => setDaten({ ...daten, zielgruppe: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(ZIELGRUPPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kategorie</Label>
          <Input value={daten.kategorie || ""} onChange={(e) => setDaten({ ...daten, kategorie: e.target.value })} placeholder="z. B. Führung" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}><X size={15} className="mr-1" /> Abbrechen</Button>
        <Button onClick={() => onSave(daten)}><Check size={15} className="mr-1" /> Speichern</Button>
      </div>
    </div>
  );
}