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
import { FRAGETYP_LABELS, zeilenIdAusText } from "@/lib/interview";

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

  // Matrix-Zeilen (Schema v2): Text und stabile ID laufen als parallele Arrays
  function zeilenIds() {
    const zeilen = frage.matrixZeilen || [];
    const ids = [...(frage.matrixZeilenIds || [])];
    while (ids.length < zeilen.length) ids.push("");
    return ids.slice(0, zeilen.length);
  }
  function matrixZeileAendern(idx, wert) {
    const neu = [...(frage.matrixZeilen || [])];
    neu[idx] = wert;
    const ids = zeilenIds();
    const andere = ids.filter((_, i) => i !== idx);
    const alterText = frage.matrixZeilen?.[idx] || "";
    // ID automatisch aus dem Text ableiten — nur bei neu angelegten Zeilen (noch ohne Text)
    // oder solange die ID noch der Automatik des alten Textes entspricht.
    // Alt-Zeilen ohne ID behalten den Index als ID, damit bestehende Antworten lesbar bleiben.
    const istNeu = ids[idx] === "" && alterText === "";
    const istAutomatik = ids[idx] !== "" && ids[idx] === zeilenIdAusText(alterText, andere);
    if (istNeu || istAutomatik) {
      ids[idx] = zeilenIdAusText(wert, andere);
    }
    onChange({ ...frage, matrixZeilen: neu, matrixZeilenIds: ids });
  }
  function matrixZeilenIdAendern(idx, wert) {
    const ids = zeilenIds();
    ids[idx] = wert.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    feld("matrixZeilenIds", ids);
  }
  function matrixZeileHinzu() {
    const ids = zeilenIds();
    onChange({ ...frage, matrixZeilen: [...(frage.matrixZeilen || []), ""], matrixZeilenIds: [...ids, ""] });
  }
  function matrixZeileWeg(idx) {
    const ids = zeilenIds();
    onChange({
      ...frage,
      matrixZeilen: (frage.matrixZeilen || []).filter((_, i) => i !== idx),
      matrixZeilenIds: ids.filter((_, i) => i !== idx),
    });
  }

  function stufeAendern(idx, f, wert) {
    const neu = [...(frage.stufenWorte || [])];
    neu[idx] = { ...neu[idx], [f]: wert };
    feld("stufenWorte", neu);
  }
  function stufeHinzu() {
    feld("stufenWorte", [...(frage.stufenWorte || []), { bis: 0, wort: "" }]);
  }
  function stufeWeg(idx) {
    feld("stufenWorte", (frage.stufenWorte || []).filter((_, i) => i !== idx));
  }

  const brauchtOptionen = ["single_choice", "multi_choice", "werte_auswahl", "limbic"].includes(frage.typ);
  const brauchtSkala = ["skala", "schieberegler", "gegensatzpaar", "matrix"].includes(frage.typ);
  const brauchtMatrixZeilen = frage.typ === "matrix";
  const brauchtStufenWorte = ["schieberegler", "gegensatzpaar"].includes(frage.typ);
  const brauchtAuswahlgrenzen = ["multi_choice", "limbic"].includes(frage.typ);
  const brauchtPolaritaet = ["multi_choice", "limbic", "werte_auswahl", "freitext"].includes(frage.typ);
  const istFreitext = frage.typ === "freitext";
  const istKern = !!frage.kernfrage;

  return (
    <div className="space-y-4">
      {istKern && (
        <div className="rounded-md border border-status-attention/30 bg-status-attention-surface px-3 py-2 text-xs text-status-attention">
          Kernfrage {frage.kernversion ? `(v${frage.kernversion})` : ""} — Text, Optionen und Zeilen sind Teil des Benchmark-Kerns.
          Änderungen daran machen Ergebnisse mit anderen Kunden unvergleichbar.
        </div>
      )}

      <div className="space-y-2">
        <Label>Fragetext</Label>
        <Textarea
          value={frage.text || ""}
          onChange={(e) => feld("text", e.target.value)}
          rows={2}
          placeholder="Wie lautet die Frage?"
        />
        <p className="text-xs text-muted-foreground">
          Wort in Sternchen setzen, um es hervorzuheben — z.&nbsp;B. „Welche Werte *erlebst* du wirklich?&ldquo;
          Jede Frage bekommt genau eine Markierung: das Wort, um das sich die Frage dreht (ein bis drei Wörter, z.&nbsp;B. „Stärken&ldquo;, „Anlass&ldquo;). Bei verneinten Fragen gehört „nicht&ldquo; in die Markierung. Eine ganze Aussage in Sternchen wird als eigener Block dargestellt.
          Platzhalter: <code>{"{{firma}}"}</code> für den Kundennamen, <code>{"{{du}}"}</code>, <code>{"{{dein}}"}</code> oder frei <code>{"{{siehst|sehen}}"}</code> für Du/Sie.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Schlüssel</Label>
          <Input
            value={frage.schluessel || ""}
            onChange={(e) => feld("schluessel", e.target.value.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase())}
            placeholder="z. B. andi_i_wertewelt_pro"
          />
          <p className="text-xs text-muted-foreground">Stabil über alle Kunden — Basis für Benchmark.</p>
        </div>
        <div className="space-y-2">
          <Label>Kernversion</Label>
          <Input
            value={frage.kernversion || ""}
            onChange={(e) => feld("kernversion", e.target.value)}
            placeholder="z. B. 1.0"
          />
        </div>
        <div className="space-y-2">
          <Label>Bezug auf Frage (Schlüssel)</Label>
          <Input
            value={frage.bezugSchluessel || ""}
            onChange={(e) => feld("bezugSchluessel", e.target.value)}
            placeholder="bei Folgefragen, z. B. Warum-Frage"
          />
        </div>
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

      <div className="space-y-2">
        <Label>Erklärung — „Warum fragen wir das?&ldquo; (optional)</Label>
        <Textarea
          value={frage.erklaerung || ""}
          onChange={(e) => feld("erklaerung", e.target.value)}
          rows={3}
          placeholder="Warum stellen wir diese Frage? Was soll der Befragte dabei bedenken?"
        />
        <p className="text-xs text-muted-foreground">
          Mehrere Absätze durch eine Leerzeile trennen. Wird den Teilnehmern aufklappbar angezeigt.
        </p>
      </div>

      <div className="flex items-center gap-6 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          <Switch checked={!!frage.pflicht} onCheckedChange={(v) => feld("pflicht", v)} id="pflicht" />
          <Label htmlFor="pflicht" className="cursor-pointer">Pflichtfrage</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={!!frage.kernfrage} onCheckedChange={(v) => feld("kernfrage", v)} id="kernfrage" />
          <Label htmlFor="kernfrage" className="cursor-pointer">Kernfrage (Benchmark)</Label>
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
              <Button variant="ghost" size="sm" onClick={() => optionWeg(i)} className="text-status-critical">
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={optionHinzu}>
            <Plus size={14} className="mr-1" /> Option hinzufügen
          </Button>
        </div>
      )}

      {brauchtPolaritaet && (
        <div className="space-y-2">
          <Label>Polarität</Label>
          <Select value={frage.polaritaet || "neutral"} onValueChange={(v) => feld("polaritaet", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="pro">Pro — „steht für“</SelectItem>
              <SelectItem value="contra">Contra — „steht nicht für“</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Für Fragepaare mit gleicher Begriffsliste (steht für / steht nicht für).</p>
        </div>
      )}

      {brauchtAuswahlgrenzen && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Min. Auswahl</Label>
            <Input type="number" min={0} value={frage.minAuswahl ?? ""} onChange={(e) => feld("minAuswahl", e.target.value === "" ? undefined : Number(e.target.value))} placeholder="keine" />
          </div>
          <div className="space-y-2">
            <Label>Max. Auswahl</Label>
            <Input type="number" min={0} value={frage.maxAuswahl ?? ""} onChange={(e) => feld("maxAuswahl", e.target.value === "" ? undefined : Number(e.target.value))} placeholder="keine" />
          </div>
        </div>
      )}

      {brauchtMatrixZeilen && (
        <div className="space-y-2">
          <Label>Matrix-Aussagen</Label>
          {(frage.matrixZeilen || []).map((zeile, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={zeile}
                onChange={(e) => matrixZeileAendern(i, e.target.value)}
                placeholder={`Aussage ${i + 1}`}
              />
              <Input
                value={zeilenIds()[i] || ""}
                onChange={(e) => matrixZeilenIdAendern(i, e.target.value)}
                placeholder="id"
                className="w-36 font-mono text-xs"
                title="Stabile Zeilen-ID für die Auswertung"
              />
              <Button variant="ghost" size="sm" onClick={() => matrixZeileWeg(i)} className="text-status-critical">
                <X size={16} />
              </Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Die ID bleibt stabil, auch wenn der Text später angepasst wird — Antworten hängen an der ID.</p>
          <Button variant="outline" size="sm" onClick={matrixZeileHinzu}>
            <Plus size={14} className="mr-1" /> Aussage hinzufügen
          </Button>
        </div>
      )}

      {brauchtStufenWorte && (
        <div className="space-y-2">
          <Label>Stufen-Worte (verbale Beschriftung, aufsteigend)</Label>
          {(frage.stufenWorte || []).map((stufe, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                type="number"
                value={stufe.bis ?? 0}
                onChange={(e) => stufeAendern(i, "bis", Number(e.target.value))}
                placeholder="bis Wert"
                className="w-28"
              />
              <Input
                value={stufe.wort || ""}
                onChange={(e) => stufeAendern(i, "wort", e.target.value)}
                placeholder="Wort z. B. „deutlich spürbar&ldquo;"
              />
              <Button variant="ghost" size="sm" onClick={() => stufeWeg(i)} className="text-status-critical">
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={stufeHinzu}>
            <Plus size={14} className="mr-1" /> Stufe hinzufügen
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