import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FRAGETYP_LABELS } from "@/lib/interview";
import FrageForm from "./FrageForm";

export default function BlockEditor({
  block,
  fragen,
  onBlockAendern,
  onFrageSpeichern,
  onFrageLoeschen,
  onFrageNeu,
  dragHandleProps,
}) {
  const [offen, setOffen] = useState(true);
  const [bearbeiteteFrage, setBearbeiteteFrage] = useState(null); // id der gerade bearbeiteten Frage

  function blockFeld(f, w) {
    onBlockAendern({ ...block, [f]: w });
  }

  function frageBearbeiten(f) {
    setBearbeiteteFrage(bearbeiteteFrage === f.id ? null : f.id);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
        <span {...dragHandleProps} className="cursor-grab text-slate-400 hover:text-slate-600">
          <GripVertical size={18} />
        </span>
        <button onClick={() => setOffen(!offen)} className="text-slate-400 hover:text-slate-600">
          {offen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <Input
          value={block.titel || ""}
          onChange={(e) => blockFeld("titel", e.target.value)}
          className="flex-1 border-none bg-transparent font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Blocktitel"
        />
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {fragen.length} {fragen.length === 1 ? "Frage" : "Fragen"}
        </span>
      </div>

      {offen && (
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <Textarea
              value={block.motivationstext || ""}
              onChange={(e) => blockFeld("motivationstext", e.target.value)}
              placeholder="Motivationstext (wird nach Abschluss des Blocks angezeigt)"
              rows={2}
              className="text-sm"
            />
          </div>

          {fragen.length === 0 && (
            <p className="text-sm text-slate-400 py-2">Noch keine Fragen in diesem Block.</p>
          )}

          {fragen.map((f, idx) => (
            <div key={f.id} className="border border-slate-200 rounded-md">
              <div className="flex items-center justify-between p-3">
                <button
                  onClick={() => frageBearbeiten(f)}
                  className="flex-1 text-left"
                >
                  <span className="text-xs text-slate-400 mr-2">{idx + 1}.</span>
                  <span className="text-sm font-medium text-slate-800">
                    {f.text || "(leere Frage)"}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {FRAGETYP_LABELS[f.typ]}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onFrageLoeschen(f)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>

              {bearbeiteteFrage === f.id && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                  <FrageForm frage={f} onChange={(neu) => onFrageSpeichern(neu)} />
                  <div className="flex justify-end mt-3">
                    <Button size="sm" onClick={() => setBearbeiteteFrage(null)}>
                      Fertig
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={onFrageNeu} className="w-full border-dashed">
            <Plus size={14} className="mr-1" /> Frage hinzufügen
          </Button>
        </div>
      )}
    </div>
  );
}