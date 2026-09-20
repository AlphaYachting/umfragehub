import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ZIELGRUPPE_LABELS,
  generiereToken,
} from "@/lib/interview";

const STATUS_LABELS = {
  entwurf: "Entwurf",
  live: "Live",
  geschlossen: "Geschlossen",
};

const STATUS_FARBEN = {
  entwurf: "bg-slate-100 text-slate-700",
  live: "bg-green-100 text-green-700",
  geschlossen: "bg-amber-100 text-amber-700",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [projekt, setProjekt] = useState(null);
  const [wellen, setWellen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speichern, setSpeichern] = useState(false);
  const [neueWelle, setNeueWelle] = useState(false);
  const [welleName, setWelleName] = useState("");
  const [welleZielgruppe, setWelleZielgruppe] = useState("mitarbeiter");

  async function laden() {
    setLoading(true);
    try {
      const p = await base44.entities.Projekt.get(id);
      setProjekt(p);
      const w = await base44.entities.Welle.filter({ projektId: id });
      w.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setWellen(w);
    } catch (e) {
      toast.error("Projekt konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    laden();
  }, [id]);

  function feldAendern(feld, wert) {
    setProjekt({ ...projekt, [feld]: wert });
  }

  async function speichernProjekt() {
    setSpeichern(true);
    try {
      await base44.entities.Projekt.update(id, {
        name: projekt.name,
        kundenname: projekt.kundenname,
        briefing: projekt.briefing,
        theme: projekt.theme,
        logoUrl: projekt.logoUrl,
        farbePrimaer: projekt.farbePrimaer,
        farbeSekundaer: projekt.farbeSekundaer,
        farbeText: projekt.farbeText,
        farbeHintergrund: projekt.farbeHintergrund,
        schriftFamilie: projekt.schriftFamilie,
        schriftUrl: projekt.schriftUrl,
        datenschutzUrl: projekt.datenschutzUrl,
        impressumUrl: projekt.impressumUrl,
        ansprache: projekt.ansprache,
        status: projekt.status,
      });
      toast.success("Gespeichert.");
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSpeichern(false);
    }
  }

  async function logoHochladen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({
        file,
      });
      feldAendern("logoUrl", file_url);
      toast.success("Logo hochgeladen.");
    } catch (err) {
      toast.error("Logo-Upload fehlgeschlagen.");
    }
  }

  async function welleAnlegen() {
    if (!welleName.trim()) {
      toast.error("Bitte einen Wellennamen eingeben.");
      return;
    }
    try {
      await base44.entities.Welle.create({
        projektId: id,
        name: welleName.trim(),
        zielgruppe: welleZielgruppe,
        linkToken: generiereToken(),
        status: "entwurf",
        mindestTeilnehmer: 6,
        begruessungstext: "",
        abschlusstext: "",
        geschaetzteDauerMinuten: 10,
      });
      toast.success("Welle angelegt.");
      setNeueWelle(false);
      setWelleName("");
      laden();
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    }
  }

  async function welleLoeschen(w) {
    if (!confirm(`Welle "${w.name}" wirklich löschen? Alle Blöcke, Fragen und Antworten gehen verloren.`)) return;
    try {
      const bloecke = await base44.entities.Block.filter({ wellenId: w.id });
      for (const b of bloecke) {
        await base44.entities.Frage.deleteMany({ blockId: b.id });
      }
      await base44.entities.Block.deleteMany({ wellenId: w.id });
      const sessions = await base44.entities.Session.filter({ wellenId: w.id });
      for (const s of sessions) {
        await base44.entities.Antwort.deleteMany({ sessionId: s.id });
      }
      await base44.entities.Session.deleteMany({ wellenId: w.id });
      await base44.entities.Welle.delete(w.id);
      toast.success("Welle gelöscht.");
      laden();
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  if (loading) return <div className="p-10 text-slate-400 text-sm">Lade Projekt…</div>;
  if (!projekt) return <div className="p-10 text-slate-400">Projekt nicht gefunden.</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Zurück zur Projektübersicht
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mb-1">{projekt.name}</h1>
      <p className="text-sm text-slate-500 mb-8">{projekt.kundenname || "Kein Kundenname"}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Briefing</h2>
          <Textarea
            value={projekt.briefing || ""}
            onChange={(e) => feldAendern("briefing", e.target.value)}
            placeholder="Hintergrund, Ziele, Kontext des Projekts…"
            rows={8}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Design</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={projekt.theme} onValueChange={(v) => feldAendern("theme", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rittler">Rittler (Pink)</SelectItem>
                  <SelectItem value="neutral">Neutral (Dunkelblau)</SelectItem>
                  <SelectItem value="kunde">Kunde (eigene Farben)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                {projekt.logoUrl ? (
                  <img src={projekt.logoUrl} alt="Logo" className="h-12 w-auto max-w-[120px] object-contain border border-slate-200 rounded p-1" />
                ) : (
                  <div className="h-12 w-20 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">Kein Logo</div>
                )}
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-3 py-2 text-sm border border-slate-200 rounded-md hover:bg-slate-50">
                    Logo hochladen
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={logoHochladen} />
                </label>
              </div>
            </div>

            {projekt.theme === "kunde" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Primärfarbe</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={projekt.farbePrimaer || "#ff3764"} onChange={(e) => feldAendern("farbePrimaer", e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
                    <Input value={projekt.farbePrimaer || ""} onChange={(e) => feldAendern("farbePrimaer", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sekundärfarbe</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={projekt.farbeSekundaer || "#45d085"} onChange={(e) => feldAendern("farbeSekundaer", e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
                    <Input value={projekt.farbeSekundaer || ""} onChange={(e) => feldAendern("farbeSekundaer", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Ansprache</Label>
              <Select value={projekt.ansprache} onValueChange={(v) => feldAendern("ansprache", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="du">Du</SelectItem>
                  <SelectItem value="sie">Sie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={projekt.status} onValueChange={(v) => feldAendern("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entwurf">Entwurf</SelectItem>
                  <SelectItem value="aktiv">Aktiv</SelectItem>
                  <SelectItem value="archiviert">Archiviert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4">Schrift &amp; Rechtliches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Schriftfamilie (CSS-Font-Stack, optional)</Label>
            <Input
              value={projekt.schriftFamilie || ""}
              onChange={(e) => feldAendern("schriftFamilie", e.target.value)}
              placeholder="z. B. 'Inter', 'Helvetica Neue', sans-serif"
            />
          </div>
          <div className="space-y-2">
            <Label>Schrift-URL (Google Fonts, optional)</Label>
            <Input
              value={projekt.schriftUrl || ""}
              onChange={(e) => feldAendern("schriftUrl", e.target.value)}
              placeholder="https://fonts.googleapis.com/css2?family=Inter&display=swap"
            />
          </div>
          {projekt.theme === "kunde" && (
            <>
              <div className="space-y-2">
                <Label>Textfarbe (optional)</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={projekt.farbeText || "#2d2d2d"} onChange={(e) => feldAendern("farbeText", e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
                  <Input value={projekt.farbeText || ""} onChange={(e) => feldAendern("farbeText", e.target.value)} placeholder="#2d2d2d" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hintergrundfarbe (optional)</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={projekt.farbeHintergrund || "#ffffff"} onChange={(e) => feldAendern("farbeHintergrund", e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
                  <Input value={projekt.farbeHintergrund || ""} onChange={(e) => feldAendern("farbeHintergrund", e.target.value)} placeholder="#ffffff" />
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Datenschutz-URL (optional)</Label>
            <Input
              value={projekt.datenschutzUrl || ""}
              onChange={(e) => feldAendern("datenschutzUrl", e.target.value)}
              placeholder="https://…/datenschutz"
            />
          </div>
          <div className="space-y-2">
            <Label>Impressum-URL (optional)</Label>
            <Input
              value={projekt.impressumUrl || ""}
              onChange={(e) => feldAendern("impressumUrl", e.target.value)}
              placeholder="https://…/impressum"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Sind Datenschutz- und Impressum-URL gesetzt, erscheinen sie als Fußzeile im Teilnehmer-Frontend.
        </p>
      </div>

      <div className="flex justify-end mb-8">
        <Button onClick={speichernProjekt} disabled={speichern}>
          <Save size={16} className="mr-2" /> {speichern ? "Speichert…" : "Projekt speichern"}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Wellen</h2>
          <Button size="sm" onClick={() => setNeueWelle(true)}>
            <Plus size={16} className="mr-1" /> Neue Welle
          </Button>
        </div>

        {wellen.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">Noch keine Wellen angelegt.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {wellen.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{w.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_FARBEN[w.status]}`}>
                      {STATUS_LABELS[w.status]}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {ZIELGRUPPE_LABELS[w.zielgruppe]} · Mindestteilnehmer: {w.mindestTeilnehmer}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/welle/${w.id}/editor`}>
                    <Button variant="outline" size="sm">Editor</Button>
                  </Link>
                  <Link to={`/welle/${w.id}/dashboard`}>
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => welleLoeschen(w)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {neueWelle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setNeueWelle(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-4">Neue Welle</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name der Welle</Label>
                <Input value={welleName} onChange={(e) => setWelleName(e.target.value)} placeholder="z. B. Welle 1 — Mitarbeiter" autoFocus />
              </div>
              <div className="space-y-2">
                <Label>Zielgruppe</Label>
                <Select value={welleZielgruppe} onValueChange={setWelleZielgruppe}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ZIELGRUPPE_LABELS).filter(([k]) => k !== "allgemein").map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setNeueWelle(false)}>Abbrechen</Button>
              <Button onClick={welleAnlegen}>Anlegen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}