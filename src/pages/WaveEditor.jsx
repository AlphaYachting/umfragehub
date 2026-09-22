import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ArrowLeft, Plus, Trash2, ExternalLink, Save, Library } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FRAGETYP_LABELS, sternchenEntfernen } from "@/lib/interview";
import BlockEditor from "@/components/welle/BlockEditor";
import BibliothekDialog from "@/components/welle/BibliothekDialog";

export default function WaveEditor() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [bloecke, setBloecke] = useState([]);
  const [fragen, setFragen] = useState({}); // blockId -> [fragen]
  const [loading, setLoading] = useState(true);
  const [bibDialog, setBibDialog] = useState(false);
  const [bibZielBlock, setBibZielBlock] = useState(null);
  const [speichern, setSpeichern] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const w = await base44.entities.Welle.get(id);
      setWelle(w);
      const p = await base44.entities.Projekt.get(w.projektId);
      setProjekt(p);
      const bs = await base44.entities.Block.filter({ wellenId: id });
      bs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
      setBloecke(bs);
      const ss = await base44.entities.Session.filter({ wellenId: id });
      setSessionCount(ss.length);
      const fMap = {};
      for (const b of bs) {
        const fs = await base44.entities.Frage.filter({ blockId: b.id });
        fs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
        fMap[b.id] = fs;
      }
      setFragen(fMap);
    } catch (e) {
      toast.error("Welle konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    laden();
  }, [laden]);

  function welleFeld(f, w) {
    setWelle({ ...welle, [f]: w });
  }

  async function welleSpeichern() {
    setSpeichern(true);
    try {
      await base44.entities.Welle.update(id, {
        name: welle.name,
        begruessungstext: welle.begruessungstext,
        abschlusstext: welle.abschlusstext,
        mindestTeilnehmer: welle.mindestTeilnehmer,
        geschaetzteDauerMinuten: welle.geschaetzteDauerMinuten,
      });
      toast.success("Gespeichert.");
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSpeichern(false);
    }
  }

  async function blockHinzu() {
    try {
      const neu = await base44.entities.Block.create({
        wellenId: id,
        titel: "Neuer Block",
        reihenfolge: bloecke.length,
        motivationstext: "",
      });
      setBloecke([...bloecke, neu]);
      setFragen({ ...fragen, [neu.id]: [] });
    } catch (e) {
      toast.error("Block konnte nicht angelegt werden.");
    }
  }

  async function blockAendern(b) {
    setBloecke(bloecke.map((x) => (x.id === b.id ? b : x)));
    try {
      await base44.entities.Block.update(b.id, { titel: b.titel, motivationstext: b.motivationstext });
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    }
  }

  async function blockLoeschen(b) {
    if (!confirm(`Block "${b.titel}" löschen? Alle Fragen gehen verloren.`)) return;
    try {
      await base44.entities.Frage.deleteMany({ blockId: b.id });
      await base44.entities.Block.delete(b.id);
      setBloecke(bloecke.filter((x) => x.id !== b.id));
      const fMap = { ...fragen };
      delete fMap[b.id];
      setFragen(fMap);
      toast.success("Block gelöscht.");
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  async function frageNeu(blockId) {
    try {
      const neu = await base44.entities.Frage.create({
        blockId,
        reihenfolge: (fragen[blockId] || []).length,
        typ: "freitext",
        text: "",
        hilfetext: "",
        pflicht: true,
        optionen: [],
        skalaMin: 1,
        skalaMax: 5,
        sprachantwortErlaubt: false,
      });
      setFragen({ ...fragen, [blockId]: [...(fragen[blockId] || []), neu] });
    } catch (e) {
      toast.error("Frage konnte nicht angelegt werden.");
    }
  }

  async function frageSpeichern(f) {
    setFragen({
      ...fragen,
      [f.blockId]: (fragen[f.blockId] || []).map((x) => (x.id === f.id ? f : x)),
    });
    try {
      await base44.entities.Frage.update(f.id, {
        typ: f.typ,
        text: f.text,
        hilfetext: f.hilfetext,
        pflicht: f.pflicht,
        optionen: f.optionen,
        skalaMin: f.skalaMin,
        skalaMax: f.skalaMax,
        skalaLabelLinks: f.skalaLabelLinks,
        skalaLabelRechts: f.skalaLabelRechts,
        auswertungstag: f.auswertungstag,
        sprachantwortErlaubt: f.sprachantwortErlaubt,
      });
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    }
  }

  async function frageLoeschen(f) {
    try {
      const vorhandene = await base44.entities.Antwort.filter({ frageId: f.id });
      const n = vorhandene.length;
      let msg = `Frage "${sternchenEntfernen(f.text) || "(leere Frage)"}" löschen?`;
      if (n > 0) {
        msg += `\n\nZu dieser Frage liegen bereits ${n} ${n === 1 ? "Antwort" : "Antworten"} vor. Beim Löschen gehen sie unwiderruflich verloren.`;
      }
      if (!confirm(msg)) return;
      if (n > 0) {
        await base44.entities.Antwort.deleteMany({ frageId: f.id });
      }
      await base44.entities.Frage.delete(f.id);
      setFragen({
        ...fragen,
        [f.blockId]: (fragen[f.blockId] || []).filter((x) => x.id !== f.id),
      });
      toast.success("Frage gelöscht.");
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  async function reorderBlocks(neueReihenfolge) {
    setBloecke(neueReihenfolge);
    for (let i = 0; i < neueReihenfolge.length; i++) {
      const b = neueReihenfolge[i];
      if (b.reihenfolge !== i) {
        await base44.entities.Block.update(b.id, { reihenfolge: i });
      }
    }
  }

  async function reorderFragen(blockId, neueReihenfolge) {
    setFragen({ ...fragen, [blockId]: neueReihenfolge });
    for (let i = 0; i < neueReihenfolge.length; i++) {
      const f = neueReihenfolge[i];
      if (f.reihenfolge !== i) {
        await base44.entities.Frage.update(f.id, { reihenfolge: i });
      }
    }
  }

  function onDragEnd(result) {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "block") {
      const neu = Array.from(bloecke);
      const [bewegt] = neu.splice(source.index, 1);
      neu.splice(destination.index, 0, bewegt);
      reorderBlocks(neu);
    } else if (type === "frage") {
      const blockId = destination.droppableId;
      const liste = Array.from(fragen[blockId] || []);
      const [bewegt] = liste.splice(source.index, 1);
      liste.splice(destination.index, 0, bewegt);
      reorderFragen(blockId, liste);
    }
  }

  async function bibliothekUebernehmen(ausgewaehlteFragen) {
    const blockId = bibZielBlock;
    if (!blockId) return;
    const startReihenfolge = (fragen[blockId] || []).length;
    const neue = [];
    for (let i = 0; i < ausgewaehlteFragen.length; i++) {
      const vf = ausgewaehlteFragen[i];
      const erstellt = await base44.entities.Frage.create({
        blockId,
        reihenfolge: startReihenfolge + i,
        typ: vf.typ,
        text: vf.text,
        hilfetext: vf.hilfetext,
        pflicht: vf.pflicht,
        optionen: vf.optionen || [],
        skalaMin: vf.skalaMin,
        skalaMax: vf.skalaMax,
        skalaLabelLinks: vf.skalaLabelLinks,
        skalaLabelRechts: vf.skalaLabelRechts,
        auswertungstag: vf.auswertungstag,
        sprachantwortErlaubt: vf.sprachantwortErlaubt,
      });
      neue.push(erstellt);
    }
    setFragen({ ...fragen, [blockId]: [...(fragen[blockId] || []), ...neue] });
    toast.success(`${ausgewaehlteFragen.length} Frage(n) übernommen.`);
  }

  if (loading) return <div className="p-10 text-slate-400 text-sm">Lade Welle…</div>;
  if (!welle) return <div className="p-10 text-slate-400">Welle nicht gefunden.</div>;

  const vorschauUrl = `${window.location.origin}/i/${welle.linkToken}?test=1`;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-2">
        <Link to={`/projekt/${welle.projektId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} className="mr-1" /> Zurück zum Projekt
        </Link>
        <a href={vorschauUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink size={16} className="mr-1" /> Vorschau
          </Button>
        </a>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-1">{welle.name}</h1>
      <p className="text-sm text-slate-500 mb-6">Wellen-Editor</p>

      {welle.status === "live" && sessionCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6 text-sm text-amber-900">
          <strong>Hinweis:</strong> Diese Welle läuft bereits und hat {sessionCount} Teilnehmer. Änderungen an Fragen verfälschen die Auswertung. Fragen ergänzen ist unbedenklich, umformulieren oder löschen nicht.
        </div>
      )}

      {/* Wellen-Einstellungen */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-4">
        <h2 className="font-semibold">Wellen-Einstellungen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={welle.name || ""} onChange={(e) => welleFeld("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mindestteilnehmer</Label>
            <Input
              type="number"
              value={welle.mindestTeilnehmer ?? 6}
              onChange={(e) => welleFeld("mindestTeilnehmer", Number(e.target.value))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Begrüßungstext</Label>
          <Textarea value={welle.begruessungstext || ""} onChange={(e) => welleFeld("begruessungstext", e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Abschlusstext</Label>
          <Textarea value={welle.abschlusstext || ""} onChange={(e) => welleFeld("abschlusstext", e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Geschätzte Dauer (Minuten)</Label>
          <Input
            type="number"
            value={welle.geschaetzteDauerMinuten ?? 10}
            onChange={(e) => welleFeld("geschaetzteDauerMinuten", Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={welleSpeichern} disabled={speichern} size="sm">
            <Save size={15} className="mr-1" /> {speichern ? "Speichert…" : "Einstellungen speichern"}
          </Button>
        </div>
      </div>

      {/* Blöcke */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Blöcke & Fragen</h2>
        <Button size="sm" variant="outline" onClick={blockHinzu}>
          <Plus size={15} className="mr-1" /> Block
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bloecke" type="block">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {bloecke.map((b, bIdx) => (
                <Draggable key={b.id} draggableId={b.id} index={bIdx}>
                  {(pDrag) => (
                    <div ref={pDrag.innerRef} {...pDrag.draggableProps}>
                      <div className="relative">
                        <BlockEditor
                          block={b}
                          fragen={fragen[b.id] || []}
                          onBlockAendern={blockAendern}
                          onFrageSpeichern={frageSpeichern}
                          onFrageLoeschen={frageLoeschen}
                          onFrageNeu={() => frageNeu(b.id)}
                          dragHandleProps={pDrag.dragHandleProps}
                        />
                        <div className="flex items-center justify-between mt-2 px-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setBibZielBlock(b.id);
                              setBibDialog(true);
                            }}
                          >
                            <Library size={15} className="mr-1" /> Aus Bibliothek übernehmen
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => blockLoeschen(b)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={15} className="mr-1" /> Block löschen
                          </Button>
                        </div>

                        {/* Fragen Drag & Drop innerhalb Block */}
                        <Droppable droppableId={b.id} type="frage">
                          {(pDrop) => (
                            <div ref={pDrop.innerRef} {...pDrop.droppableProps} className="mt-2 space-y-2">
                              {(fragen[b.id] || []).map((f, fIdx) => (
                                <Draggable key={f.id} draggableId={f.id} index={fIdx}>
                                  {(pFrag) => (
                                    <div
                                      ref={pFrag.innerRef}
                                      {...pFrag.draggableProps}
                                      {...pFrag.dragHandleProps}
                                      className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded px-3 py-2 text-sm cursor-grab"
                                    >
                                      <span className="text-slate-300">⋮⋮</span>
                                      <span className="text-xs text-slate-400">{fIdx + 1}.</span>
                                      <span className="flex-1 truncate text-slate-700">{f.text || "(leere Frage)"}</span>
                                      <span className="text-xs text-slate-400">{FRAGETYP_LABELS[f.typ]}</span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {pDrop.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {bloecke.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-slate-400 text-sm mb-3">Noch keine Blöcke. Lege den ersten Block an.</p>
          <Button onClick={blockHinzu}><Plus size={16} className="mr-1" /> Block anlegen</Button>
        </div>
      )}

      <BibliothekDialog
        offen={bibDialog}
        onClose={() => setBibDialog(false)}
        onUebernehmen={bibliothekUebernehmen}
      />
    </div>
  );
}