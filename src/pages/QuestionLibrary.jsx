import React, { useState, useEffect, useRef } from "react";
import { Plus, Copy, Trash2, Download, Upload, Pencil, Check, X, FolderPlus, Folder } from "lucide-react";
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
  const [bearbeiten, setBearbeiten] = useState(null);
  const [neu, setNeu] = useState(null);
  const [importiert, setImportiert] = useState(false);
  const [container, setContainer] = useState("Allgemein");
  const [containerNamen, setContainerNamen] = useState(["Allgemein"]);
  const [neuerContainer, setNeuerContainer] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameWert, setRenameWert] = useState("");
  const importRef = useRef(null);

  async function laden() {
    setLoading(true);
    try {
      const liste = await base44.entities.Bibliotheksfrage.list("-created_date", 500);
      setFragen(liste);
      let containers = await base44.entities.BibliotheksContainer.list("-created_date", 500);
      // Einmalige Migration: beim ersten Laden Container-Namen aus bestehenden
      // Bibliotheksfragen in die neue Entity übernehmen
      if (containers.length === 0) {
        const ausFragen = [...new Set(liste.map((f) => f.container).filter(Boolean))];
        const namen = [...new Set([...ausFragen, "Allgemein"])];
        if (namen.length > 0) {
          await base44.entities.BibliotheksContainer.bulkCreate(namen.map((name) => ({ name })));
          containers = await base44.entities.BibliotheksContainer.list("-created_date", 500);
        }
      }
      const alle = [...new Set([...containers.map((c) => c.name), "Allgemein"])];
      setContainerNamen(alle);
      if (!alle.includes(container)) setContainer(alle[0] || "Allgemein");
    } catch (e) {
      toast.error("Bibliothek konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    laden();
  }, []);

  async function containerHinzufuegen() {
    const name = neuerContainer.trim();
    if (!name) return;
    if (containerNamen.includes(name)) {
      toast.error("Container existiert bereits.");
      return;
    }
    try {
      await base44.entities.BibliotheksContainer.create({ name });
      setContainerNamen([...containerNamen, name]);
      setContainer(name);
      setNeuerContainer("");
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    }
  }

  async function containerUmbenennen(alterName) {
    const neuName = renameWert.trim();
    if (!neuName || neuName === alterName) {
      setRenameId(null);
      return;
    }
    if (containerNamen.includes(neuName)) {
      toast.error("Name existiert bereits.");
      return;
    }
    try {
      const inContainer = fragen.filter((f) => f.container === alterName);
      await base44.entities.Bibliotheksfrage.bulkUpdate(
        inContainer.map((f) => ({ id: f.id, container: neuName }))
      );
      const containers = await base44.entities.BibliotheksContainer.filter({ name: alterName });
      if (containers.length) {
        await base44.entities.BibliotheksContainer.update(containers[0].id, { name: neuName });
      }
      const neueNamen = containerNamen.map((n) => (n === alterName ? neuName : n));
      setContainerNamen(neueNamen);
      setContainer(neuName);
      setRenameId(null);
      setRenameWert("");
      toast.success("Container umbenannt.");
      laden();
    } catch (e) {
      toast.error("Umbenennen fehlgeschlagen.");
    }
  }

  async function containerLoeschen(name) {
    const inContainer = fragen.filter((f) => f.container === name);
    const msg = inContainer.length
      ? `Container „${name}" mit ${inContainer.length} Frage(n) löschen?`
      : `Leeren Container „${name}" löschen?`;
    if (!confirm(msg)) return;
    try {
      if (inContainer.length) {
        await base44.entities.Bibliotheksfrage.deleteMany({ container: name });
      }
      const containers = await base44.entities.BibliotheksContainer.filter({ name });
      if (containers.length) {
        await base44.entities.BibliotheksContainer.delete(containers[0].id);
      }
      const neueNamen = containerNamen.filter((n) => n !== name);
      setContainerNamen(neueNamen);
      if (container === name) setContainer("Allgemein");
      toast.success("Container gelöscht.");
      laden();
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  function gefiltert() {
    return fragen.filter((f) => {
      if (f.container !== container) return false;
      if (filterZielgruppe !== "all" && f.zielgruppe !== filterZielgruppe && f.zielgruppe !== "allgemein") return false;
      if (filterKategorie !== "all" && f.kategorie !== filterKategorie) return false;
      if (suche && !(f.text || "").toLowerCase().includes(suche.toLowerCase())) return false;
      return true;
    });
  }

  const kategorien = [...new Set(fragen.filter((f) => f.container === container).map((f) => f.kategorie).filter(Boolean))].sort();
  const containerCounts = {};
  fragen.forEach((f) => {
    const c = f.container || "Allgemein";
    containerCounts[c] = (containerCounts[c] || 0) + 1;
  });

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
      container,
    });
  }

  async function speichern(frage, id) {
    try {
      const daten = { ...frage, container: frage.container || container };
      if (id) {
        await base44.entities.Bibliotheksfrage.update(id, daten);
        toast.success("Aktualisiert.");
      } else {
        await base44.entities.Bibliotheksfrage.create(daten);
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
    const data = JSON.stringify(
      fragen
        .filter((f) => f.container === container)
        .map(({ id, created_date, updated_date, created_by_id, ...rest }) => rest),
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fragenbibliothek_${container.replace(/\s+/g, "_")}.json`;
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
          container: f.container || container,
          reihenfolge: 0,
        });
        count++;
      }
      if (!containerNamen.includes(container)) {
        await base44.entities.BibliotheksContainer.create({ name: container });
        setContainerNamen([...containerNamen, container]);
      }
      toast.success(`${count} Frage(n) in „${container}" importiert.`);
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fragenbibliothek</h1>
          <p className="text-sm text-slate-500 mt-1">Wiederverwendbare Fragen-Container</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Container-Seitenleiste */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 px-2 mb-1">Container</div>
          <div className="space-y-1 max-h-[60vh] overflow-auto">
            {containerNamen.map((c) => (
              <div
                key={c}
                className={`group flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-sm transition-colors ${
                  container === c ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"
                }`}
                onClick={() => setContainer(c)}
              >
                <Folder size={15} className="shrink-0" />
                {renameId === c ? (
                  <input
                    autoFocus
                    value={renameWert}
                    onChange={(e) => setRenameWert(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") containerUmbenennen(c);
                      if (e.key === "Escape") setRenameId(null);
                    }}
                    className="flex-1 min-w-0 bg-white text-slate-900 text-sm rounded px-1 py-0.5 outline-none"
                  />
                ) : (
                  <span className="flex-1 truncate">{c}</span>
                )}
                <span className={`text-xs ${container === c ? "text-slate-400" : "text-slate-400"}`}>
                  {containerCounts[c] || 0}
                </span>
                {renameId === c ? (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); containerUmbenennen(c); }}
                      className="p-0.5 hover:opacity-70"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenameId(null); }}
                      className="p-0.5 hover:opacity-70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenameId(c); setRenameWert(c); }}
                      className="p-0.5 hover:opacity-70"
                      title="Umbenennen"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); containerLoeschen(c); }}
                      className="p-0.5 hover:opacity-70"
                      title="Container löschen"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="Neuer Container…"
              value={neuerContainer}
              onChange={(e) => setNeuerContainer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && containerHinzufuegen()}
              className="h-8 text-sm"
            />
            <Button variant="outline" size="sm" onClick={containerHinzufuegen} className="shrink-0">
              <FolderPlus size={15} />
            </Button>
          </div>
        </div>

        {/* Fragen im Container */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-semibold">{container}</h2>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={exportieren} disabled={gefiltert().length === 0}>
                <Download size={15} className="mr-1" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => importRef.current?.click()} disabled={importiert}>
                {importiert ? (
                  <><span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin inline-block mr-2" /> Import läuft…</>
                ) : (
                  <><Upload size={15} className="mr-1" /> Import</>
                )}
              </Button>
              <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={importieren} />
              <Button size="sm" onClick={neueFrageOeffnen}>
                <Plus size={15} className="mr-1" /> Neue Frage
              </Button>
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
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-sm text-slate-400 mb-3">Keine Fragen in diesem Container.</p>
              <p className="text-xs text-slate-400">Importiere eine JSON-Datei oder lege eine neue Frage an.</p>
            </div>
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
                        {f.zielgruppe && <span>· {ZIELGRUPPE_LABELS[f.zielgruppe]}</span>}
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
        </div>
      </div>

      {neu && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setNeu(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Neue Frage in „{container}"</h3>
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