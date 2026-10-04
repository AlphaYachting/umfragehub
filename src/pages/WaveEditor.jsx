import React, { useState, useEffect, useCallback } from "react";
import { bestaetigen } from "@/components/shared/Bestaetigen";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, Save, Library, GripVertical } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FRAGETYP_LABELS, sternchenEntfernen, frageFelderAuslesen } from "@/lib/interview";
import BlockEditor from "@/components/welle/BlockEditor";
import BibliothekDialog from "@/components/welle/BibliothekDialog";
import BibliothekImportDialog from "@/components/welle/BibliothekImportDialog";
import WellenKopf from "@/components/verwaltung/WellenKopf";

export default function WaveEditor() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [bloecke, setBloecke] = useState([]);
  const [fragen, setFragen] = useState({}); // blockId -> [fragen]
  const [loading, setLoading] = useState(true);
  const [bibDialog, setBibDialog] = useState(false);
  const [bibZielBlock, setBibZielBlock] = useState(null);
  const [bibImportDialog, setBibImportDialog] = useState(false);
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
    if (!await bestaetigen(`Block "${b.titel}" löschen? Alle Fragen gehen verloren.`)) return;
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
      // Schema v2: EINE Feldliste — erklaerung, stufenWorte, matrixZeilen und
      // die neuen Felder gingen hier bisher beim Speichern verloren.
      await base44.entities.Frage.update(f.id, frageFelderAuslesen(f));
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
      if (!await bestaetigen(msg)) return;
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
      // Schema v2: alle Fragefelder mitnehmen (vorher fehlten erklaerung,
      // stufenWorte und matrixZeilen — Matrix-Fragen kamen ohne Zeilen an)
      const erstellt = await base44.entities.Frage.create({
        ...frageFelderAuslesen(vf),
        optionen: vf.optionen || [],
        blockId,
        reihenfolge: startReihenfolge + i,
      });
      neue.push(erstellt);
    }
    setFragen({ ...fragen, [blockId]: [...(fragen[blockId] || []), ...neue] });
    toast.success(`${ausgewaehlteFragen.length} Frage(n) übernommen.`);
  }

  async function bibliothekKomplettImportieren(gruppen) {
    const blockStartReihenfolge = bloecke.length;
    const neueBloecke = [];
    const neueFragenMap = { ...fragen };

    for (let i = 0; i < gruppen.length; i++) {
      const g = gruppen[i];
      const block = await base44.entities.Block.create({
        wellenId: id,
        titel: g.kategorie,
        reihenfolge: blockStartReihenfolge + i,
        motivationstext: "",
      });
      neueBloecke.push(block);
      neueFragenMap[block.id] = [];

      for (let j = 0; j < g.fragen.length; j++) {
        const vf = g.fragen[j];
        const erstellt = await base44.entities.Frage.create({
          ...frageFelderAuslesen(vf),
          optionen: vf.optionen || [],
          blockId: block.id,
          reihenfolge: j,
        });
        neueFragenMap[block.id].push(erstellt);
      }
    }

    setBloecke([...bloecke, ...neueBloecke]);
    setFragen(neueFragenMap);
    const totalFragen = gruppen.reduce((s, g) => s + g.fragen.length, 0);
    toast.success(`${totalFragen} Fragen in ${gruppen.length} Blöcken importiert.`);
  }

  if (loading) return <div className="v-seite v-lade">Lade Welle…</div>;
  if (!welle) return <div className="v-seite v-lade">Welle nicht gefunden.</div>;

  return (
    <div className="v-seite">
      <WellenKopf welle={welle} projekt={projekt} aktiv="editor" />

      {welle.status === "live" && sessionCount > 0 && (
        <div className="bg-status-attention-surface border border-status-attention/30 rounded-lg p-4 text-sm text-status-attention">
          <strong>Hinweis:</strong> Diese Welle läuft bereits und hat {sessionCount} Teilnehmer. Änderungen an Fragen verfälschen die Auswertung. Fragen ergänzen ist unbedenklich, umformulieren oder löschen nicht.
        </div>
      )}

      {/* Wellen-Einstellungen */}
      <div className="v-karte space-y-4">
        <h2 className="v-h2">Wellen-Einstellungen</h2>
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
          <p className="text-xs text-muted-foreground">
            Steht auf der Startseite unter dem Titel. Anonymität, „kein richtig, kein falsch“, Dauer und Pausieren zeigt die Startseite schon selbst — hier nur Anlass und Nutzen, 2–3 Sätze. Platzhalter wie <code>{"{{firma}}"}</code> und <code>{"{{du}}"}</code> werden ersetzt.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Abschlusstext</Label>
          <Textarea value={welle.abschlusstext || ""} onChange={(e) => welleFeld("abschlusstext", e.target.value)} rows={3} />
          <p className="text-xs text-muted-foreground">
            Steht auf der Schlussseite unter dem Dank. Der Dank selbst ist schon da — hier nur, was mit den Ergebnissen passiert und wann.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Geschätzte Dauer (Minuten) — nur intern; Befragte sehen die aus den Fragen berechnete Dauer</Label>
          <Input
            type="number"
            value={welle.geschaetzteDauerMinuten ?? 10}
            onChange={(e) => welleFeld("geschaetzteDauerMinuten", Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={welleSpeichern} disabled={speichern} size="sm">
            <Save size={15} /> {speichern ? "Speichert…" : "Einstellungen speichern"}
          </Button>
        </div>
      </div>

      {/* Blöcke */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="v-h2">Blöcke & Fragen</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setBibImportDialog(true)}>
            <Library size={15} /> Komplette Bibliothek
          </Button>
          <Button size="sm" variant="outline" onClick={blockHinzu}>
            <Plus size={15} /> Block
          </Button>
        </div>
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
                            <Library size={15} /> Aus Bibliothek übernehmen
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => blockLoeschen(b)}
                            className="text-status-critical hover:text-status-critical"
                          >
                            <Trash2 size={15} /> Block löschen
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
                                      className="flex items-center gap-2 bg-muted border border-border rounded px-3 py-2 text-sm cursor-grab"
                                    >
                                      <GripVertical size={14} className="text-muted-foreground shrink-0" />
                                      <span className="text-xs text-muted-foreground">{fIdx + 1}.</span>
                                      <span className="flex-1 truncate text-foreground">{f.text || "(leere Frage)"}</span>
                                      <span className="text-xs text-muted-foreground">{FRAGETYP_LABELS[f.typ]}</span>
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
        <div className="v-leer space-y-3">
          <p>Diese Welle hat noch keine Fragen. Lege den ersten Block an oder übernimm die komplette Bibliothek.</p>
          <Button variant="outline" onClick={blockHinzu}><Plus size={16} /> Block anlegen</Button>
        </div>
      )}

      <BibliothekDialog
        offen={bibDialog}
        onClose={() => setBibDialog(false)}
        onUebernehmen={bibliothekUebernehmen}
      />

      <BibliothekImportDialog
        offen={bibImportDialog}
        onClose={() => setBibImportDialog(false)}
        onImport={bibliothekKomplettImportieren}
      />
    </div>
  );
}