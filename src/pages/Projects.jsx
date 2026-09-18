import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen, Archive } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STATUS_LABELS = {
  entwurf: "Entwurf",
  aktiv: "Aktiv",
  archiviert: "Archiviert",
};

const STATUS_FARBEN = {
  entwurf: "bg-slate-100 text-slate-700",
  aktiv: "bg-green-100 text-green-700",
  archiviert: "bg-slate-100 text-slate-500",
};

export default function Projects() {
  const [projekte, setProjekte] = useState([]);
  const [wellenCounts, setWellenCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialogOffen, setDialogOffen] = useState(false);
  const [neuName, setNeuName] = useState("");
  const [neuKunde, setNeuKunde] = useState("");
  const [speichern, setSpeichern] = useState(false);

  async function laden() {
    setLoading(true);
    try {
      const liste = await base44.entities.Projekt.list("-created_date", 200);
      setProjekte(liste);
      const counts = {};
      for (const p of liste) {
        const wellen = await base44.entities.Welle.filter({ projektId: p.id });
        counts[p.id] = wellen.length;
      }
      setWellenCounts(counts);
    } catch (e) {
      toast.error("Projekte konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    laden();
  }, []);

  async function projektAnlegen() {
    if (!neuName.trim()) {
      toast.error("Bitte einen Projektnamen eingeben.");
      return;
    }
    setSpeichern(true);
    try {
      await base44.entities.Projekt.create({
        name: neuName.trim(),
        kundenname: neuKunde.trim(),
        briefing: "",
        theme: "neutral",
        ansprache: "du",
        status: "entwurf",
        farbePrimaer: "#1f3a5f",
        farbeSekundaer: "#3a7d5c",
      });
      toast.success("Projekt angelegt.");
      setDialogOffen(false);
      setNeuName("");
      setNeuKunde("");
      laden();
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    } finally {
      setSpeichern(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projekte</h1>
          <p className="text-sm text-slate-500 mt-1">
            Alle Interview-Projekte auf einen Blick
          </p>
        </div>
        <Button onClick={() => setDialogOffen(true)}>
          <Plus size={18} className="mr-2" /> Neues Projekt
        </Button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Lade Projekte…</div>
      ) : projekte.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 mb-4">Noch keine Projekte angelegt.</p>
          <Button onClick={() => setDialogOffen(true)}>
            <Plus size={18} className="mr-2" /> Erstes Projekt anlegen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projekte.map((p) => (
            <Link
              key={p.id}
              to={`/projekt/${p.id}`}
              className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                  {p.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_FARBEN[p.status]}`}
                >
                  {STATUS_LABELS[p.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                {p.kundenname || "—"}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{wellenCounts[p.id] ?? 0} Wellen</span>
                <span>·</span>
                <span>
                  {p.theme === "rittler"
                    ? "Theme: Rittler"
                    : p.theme === "kunde"
                    ? "Theme: Kunde"
                    : "Theme: Neutral"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={dialogOffen} onOpenChange={setDialogOffen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Projekt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="pname">Projektname</Label>
              <Input
                id="pname"
                value={neuName}
                onChange={(e) => setNeuName(e.target.value)}
                placeholder="z. B. Kultur-Check 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkunde">Kundenname</Label>
              <Input
                id="pkunde"
                value={neuKunde}
                onChange={(e) => setNeuKunde(e.target.value)}
                placeholder="z. B. Rittler AG"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOffen(false)}
              disabled={speichern}
            >
              Abbrechen
            </Button>
            <Button onClick={projektAnlegen} disabled={speichern}>
              {speichern ? "Wird angelegt…" : "Anlegen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}