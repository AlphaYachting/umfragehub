import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FolderOpen, Search, RefreshCw, ChevronRight } from "lucide-react";
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
import { toast } from "sonner";
import { kachel } from "@/components/verwaltung/Kachel";
import StatusBadge from "@/components/verwaltung/StatusBadge";
import Fortschritt from "@/components/verwaltung/Fortschritt";
import LinkAktionen from "@/components/verwaltung/LinkAktionen";
import {
  ladeGesamt,
  gruppiere,
  wellenKennzahlen,
  wellenHinweis,
  relativerTag,
  WELLE_STATUS,
} from "@/lib/verwaltung";

const FILTER = [
  { key: "laufend", label: "Laufend" },
  { key: "entwurf", label: "Entwurf" },
  { key: "aktiv", label: "Aktiv" },
  { key: "archiviert", label: "Archiviert" },
  { key: "alle", label: "Alle" },
];

const TON_KLASSE = {
  gut: "text-green-700",
  warnung: "text-amber-700",
  neutral: "text-slate-500",
};

export default function Projects() {
  const navigate = useNavigate();
  const [daten, setDaten] = useState({ projekte: [], wellen: [], sessions: [] });
  const [loading, setLoading] = useState(true);
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState("laufend");
  const [dialogOffen, setDialogOffen] = useState(false);
  const [neuName, setNeuName] = useState("");
  const [neuKunde, setNeuKunde] = useState("");
  const [speichern, setSpeichern] = useState(false);

  async function laden() {
    setLoading(true);
    try {
      setDaten(await ladeGesamt());
    } catch (e) {
      toast.error("Projekte konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    laden();
  }, []);

  // Je Projekt: Wellen mit Kennzahlen, Summen, letzte Aktivität
  const zeilen = useMemo(() => {
    const wellenJeProjekt = gruppiere(daten.wellen, "projektId");
    const sessionsJeWelle = gruppiere(daten.sessions, "wellenId");
    return daten.projekte.map((p) => {
      const wellen = (wellenJeProjekt[p.id] || [])
        .map((w) => ({ welle: w, k: wellenKennzahlen(w, sessionsJeWelle[w.id] || []) }))
        .sort((a, b) => (a.welle.name || "").localeCompare(b.welle.name || ""));
      let letzte = null;
      let gestartet = 0;
      let abgeschlossen = 0;
      for (const { k } of wellen) {
        gestartet += k.gestartet;
        abgeschlossen += k.abgeschlossen;
        if (k.letzteAktivitaet && (!letzte || k.letzteAktivitaet > letzte)) letzte = k.letzteAktivitaet;
      }
      return { projekt: p, wellen, gestartet, abgeschlossen, letzte };
    });
  }, [daten]);

  const liveWellen = useMemo(() => {
    const out = [];
    for (const z of zeilen) {
      if (z.projekt.status === "archiviert") continue;
      for (const w of z.wellen) if (w.welle.status === "live") out.push({ ...w, projekt: z.projekt });
    }
    return out;
  }, [zeilen]);

  const kennzahlen = useMemo(() => {
    const offen = zeilen.filter((z) => z.projekt.status !== "archiviert");
    return {
      projekte: offen.length,
      live: liveWellen.length,
      abgeschlossen: offen.reduce((s, z) => s + z.abgeschlossen, 0),
      woche: offen.reduce((s, z) => s + z.wellen.reduce((t, w) => t + w.k.abgeschlossen7Tage, 0), 0),
    };
  }, [zeilen, liveWellen]);

  const sichtbar = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return zeilen.filter((z) => {
      const st = z.projekt.status || "entwurf";
      if (filter === "laufend" && st === "archiviert") return false;
      if (["entwurf", "aktiv", "archiviert"].includes(filter) && st !== filter) return false;
      if (!q) return true;
      const text = [z.projekt.name, z.projekt.kundenname, ...z.wellen.map((w) => w.welle.name)]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [zeilen, suche, filter]);

  async function projektAnlegen() {
    if (!neuName.trim()) {
      toast.error("Bitte einen Projektnamen eingeben.");
      return;
    }
    setSpeichern(true);
    try {
      const neu = await base44.entities.Projekt.create({
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
      navigate(`/projekt/${neu.id}`);
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    } finally {
      setSpeichern(false);
    }
  }

  return (
    <div className="v-seite">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="v-h1">Übersicht</h1>
          <p className="v-unterzeile">Alle Projekte und laufenden Wellen auf einen Blick</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={laden} title="Aktualisieren" aria-label="Aktualisieren">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={() => setDialogOffen(true)}>
            <Plus size={18} className="mr-2" /> Neues Projekt
          </Button>
        </div>
      </div>

      {loading && daten.projekte.length === 0 ? (
        <div className="text-slate-400 text-sm">Lade Projekte…</div>
      ) : daten.projekte.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 mb-4">Noch keine Projekte angelegt.</p>
          <Button onClick={() => setDialogOffen(true)}>
            <Plus size={18} className="mr-2" /> Erstes Projekt anlegen
          </Button>
        </div>
      ) : (
        <>
          <div className="v-kacheln">
            {kachel("Projekte", kennzahlen.projekte, "ohne archivierte")}
            {kachel("Wellen live", kennzahlen.live)}
            {kachel("Abgeschlossene Interviews", kennzahlen.abgeschlossen, "insgesamt")}
            {kachel("Neu in 7 Tagen", kennzahlen.woche, "abgeschlossene Interviews")}
          </div>

          {/* Was gerade läuft */}
          <h2 className="v-h2 mb-3">Läuft gerade</h2>
          {liveWellen.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-lg px-5 py-6 text-sm text-slate-400 mb-8">
              Im Moment ist keine Welle live. Eine Welle wird in ihrem Projekt oder im Wellen-Verlauf freigeschaltet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
              {liveWellen.map(({ welle, k, projekt }) => {
                const h = wellenHinweis(welle, k);
                return (
                  <div key={welle.id} className="v-karte">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <Link to={`/welle/${welle.id}/dashboard`} className="font-semibold text-slate-900 hover:underline">
                          {welle.name}
                        </Link>
                        <div className="text-xs text-slate-500 truncate">
                          <Link to={`/projekt/${projekt.id}`} className="hover:underline">{projekt.name}</Link>
                          {projekt.kundenname ? ` · ${projekt.kundenname}` : ""}
                        </div>
                      </div>
                      <LinkAktionen welle={welle} mitText={false} variant="ghost" />
                    </div>
                    <Fortschritt k={k} />
                    <div className="flex items-center justify-between gap-3 mt-3 text-xs">
                      <span className={TON_KLASSE[h.ton]}>{h.text}</span>
                      <span className="text-slate-400 whitespace-nowrap">Zuletzt: {relativerTag(k.letzteAktivitaet)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Projektliste */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h2 className="v-h2">Projekte</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex bg-slate-100 rounded-lg p-1">
                {FILTER.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filter === f.key ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={suche}
                  onChange={(e) => setSuche(e.target.value)}
                  placeholder="Projekt, Kunde oder Welle"
                  className="pl-8 h-9 w-56 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="v-karte-flach divide-y divide-slate-100">
            <div className="hidden md:grid grid-cols-[minmax(0,2.2fr)_minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_20px] gap-4 px-5 py-2.5 text-xs font-medium text-slate-500">
              <span>Projekt</span>
              <span>Wellen</span>
              <span>Interviews</span>
              <span>Letzte Aktivität</span>
              <span />
            </div>
            {sichtbar.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-400 text-center">Kein Projekt passt zu Filter und Suche.</div>
            ) : (
              sichtbar.map(({ projekt: p, wellen, gestartet, abgeschlossen, letzte }) => (
                <Link
                  key={p.id}
                  to={`/projekt/${p.id}`}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_20px] gap-x-4 gap-y-2 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 truncate">{p.name}</span>
                      <StatusBadge status={p.status || "entwurf"} art="projekt" />
                    </div>
                    <div className="text-sm text-slate-500 truncate">{p.kundenname || "Kein Kundenname"}</div>
                  </div>
                  <div className="min-w-0 space-y-1">
                    {wellen.length === 0 ? (
                      <span className="text-sm text-slate-400">Noch keine Welle</span>
                    ) : (
                      wellen.slice(0, 4).map(({ welle: w, k }) => (
                        <div key={w.id} className="flex items-center gap-2 text-sm min-w-0">
                          <span className={`h-2 w-2 rounded-full shrink-0 ${WELLE_STATUS[w.status]?.punkt || "bg-slate-300"}`} title={WELLE_STATUS[w.status]?.label} />
                          <span className="truncate text-slate-700">{w.name}</span>
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-auto">
                            {k.abgeschlossen}/{k.ziel}
                          </span>
                        </div>
                      ))
                    )}
                    {wellen.length > 4 && <div className="text-xs text-slate-400">+ {wellen.length - 4} weitere</div>}
                  </div>
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">{abgeschlossen}</span>
                    <span className="text-slate-400"> abgeschlossen</span>
                    {gestartet > abgeschlossen && (
                      <div className="text-xs text-slate-400">{gestartet - abgeschlossen} begonnen</div>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">{relativerTag(letzte)}</div>
                  <ChevronRight size={16} className="text-slate-300 hidden md:block" />
                </Link>
              ))
            )}
          </div>
        </>
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
                placeholder="z. B. Markenprüfstand 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkunde">Kundenname</Label>
              <Input
                id="pkunde"
                value={neuKunde}
                onChange={(e) => setNeuKunde(e.target.value)}
                placeholder="so, wie er in den Fragen stehen soll"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOffen(false)} disabled={speichern}>
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
