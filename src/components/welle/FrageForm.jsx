import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { FRAGETYP_LABELS } from "@/lib/interview";

// Wiederverwendbares Formular für eine Frage (Frage wie auch Bibliotheksfrage)
export default function FrageForm({ frage, onChange }) {
  function feld(f, wert) {
    onChange({ ...frage, [f]: wert });
  }

  function optionAendern(idx, wert) {
    const neu = [...(frage.optionen || [])];
    neu[idx] = wert;
    feld("optionen", neu);
  }
  function optionHinzu() {
    feld("optionen", [...(frage.optionen || []), ""]);
  }
  function optionWeg(idx) {
    feld("optionen", (frage.optionen || []).filter((_, i) => i !== idx));
  }

  const brauchtOptionen = ["single_choice", "multi_choice", "werte_auswahl", "limbic"].includes(frage.typ);
  const brauchtSkala = frage.typ === "skala";
  const istFreitext = frage.typ === "freitext";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Fragetext</Label>
        <Textarea
          value={frage.text || ""}
          onChange={(e) => feld("text", e.target.value)}
          rows={2}
          placeholder="Wie lautet die Frage?"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fragetyp</Label>
          <Select value={frage.typ} onValueChange={(v) => feld("typ", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(FRAGETYP_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Hilfetext</Label>
          <Input
            value={frage.hilfetext || ""}
            onChange={(e) => feld("hilfetext", e.target.value)}
            placeholder="Optional, kleiner Hinweis"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <div className="flex items-center gap-2">
          <Switch checked={!!frage.pflicht} onCheckedChange={(v) => feld("pflicht", v)} id="pflicht" />
          <Label htmlFor="pflicht" className="cursor-pointer">Pflichtfrage</Label>
        </div>
        {istFreitext && (
          <div className="flex items-center gap-2">
            <Switch checked={!!frage.sprachantwortErlaubt} onCheckedChange={(v) => feld("sprachantwortErlaubt", v)} id="sprache" />
            <Label htmlFor="sprache" className="cursor-pointer">Sprachantwort erlaubt</Label>
          </div>
        )}
      </div>

      {brauchtOptionen && (
        <div className="space-y-2">
          <Label>Optionen</Label>
          {(frage.optionen || []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => optionAendern(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
              />
              <Button variant="ghost" size="sm" onClick={() => optionWeg(i)} className="text-red-500">
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={optionHinzu}>
            <Plus size={14} className="mr-1" /> Option hinzufügen
          </Button>
        </div>
      )}

      {brauchtSkala && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label>Skala Min</Label>
            <Input type="number" value={frage.skalaMin ?? 1} onChange={(e) => feld("skalaMin", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Skala Max</Label>
            <Input type="number" value={frage.skalaMax ?? 5} onChange={(e) => feld("skalaMax", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Label links</Label>
            <Input value={frage.skalaLabelLinks || ""} onChange={(e) => feld("skalaLabelLinks", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Label rechts</Label>
            <Input value={frage.skalaLabelRechts || ""} onChange={(e) => feld("skalaLabelRechts", e.target.value)} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Auswertungs-Tag (optional)</Label>
        <Input
          value={frage.auswertungstag || ""}
          onChange={(e) => feld("auswertungstag", e.target.value)}
          placeholder="z. B. engagement, führung, zufriedenheit"
        />
      </div>
    </div>
  );
}