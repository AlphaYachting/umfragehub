import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, RefreshCw, X } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Seitenkopf from "@/components/shared/Seitenkopf";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import Abschnittstitel from "@/components/shared/Abschnittstitel";
import Listenzeile from "@/components/shared/Listenzeile";
import TypPille from "@/components/shared/TypPille";
import { Box } from "@/components/shared/Box";
import StatusBadge from "@/components/verwaltung/StatusBadge";
import Fortschritt from "@/components/verwaltung/Fortschritt";
import LinkAktionen from "@/components/verwaltung/LinkAktionen";
import { kachel } from "@/components/verwaltung/Kachel";
import { TON_TEXT, HINWEIS_TON } from "@/lib/designTon";
import {
  ladeGesamt,
  gemerkt,
  gruppiere,
  wellenKennzahlen,
  wellenHinweis,
  relativerTag,
} from "@/lib/verwaltung";

const FILTER = [
  { key: "laufend", label: "Laufend", passt: (st) => st !== "archiviert" },
  { key: "entwurf", label: "Entwurf", passt: (st) => st === "entwurf" },
  { key: "aktiv", label: "Aktiv", passt: (st) => st === "aktiv" },
  { key: "archiviert", label: "Archiviert", passt: (st) => st === "archiviert" },
  { key: "alle", label: "Alle", passt: () => true },
];

export default function Projects() {
  const navigate = useNavigate();
  // Zuletzt Geladenes sofort zeigen, frische Daten kommen im Hintergrund
  const [daten, setDaten] = useState(() => gemerkt("gesamt") || { projekte: [], wellen: [], sessions: [] });
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
      let abgeschlossen = 0;
      for (const { k } of wellen) {
        abgeschlossen += k.abgeschlossen;
        if (k.letzteAktivitaet && (!letzte || k.letzteAktivitaet > letzte)) letzte = k.letzteAktivitaet;
      }
      return { projekt: p, status: p.status || "entwurf", wellen, abgeschlossen, letzte };
    });
  }, [daten]);

  const liveWellen = useMemo(() => {
    const out = [];
    for (const z of zeilen) {
      if (z.status === "archiviert") continue;
      for (const w of z.wellen) if (w.welle.status === "live") out.push({ ...w, projekt: z.projekt });
    }
    return out;
  }, [zeilen]);

  const kennzahlen = useMemo(() => {
    const offen = zeilen.filter((z) => z.status !== "archiviert");
    return {
      projekte: offen.length,
      abgeschlossen: offen.reduce((s, z) => s + z.abgeschlossen, 0),
      woche: offen.reduce((s, z) => s + z.wellen.reduce((t, w) => t + w.k.abgeschlossen7Tage, 0), 0),
      fehlt: liveWellen.filter((w) => !w.k.schwelleErreicht).length,
    };
  }, [zeilen, liveWellen]);

  const sichtbar = useMemo(() => {
    const q = suche.trim().toLowerCase();
    const f = FILTER.find((x) => x.key === filter) || FILTER[0];
    return zeilen.filter((z) => {
      if (!f.passt(z.status)) return false;
      if (!q) return true;
      return [z.projekt.name, z.projekt.kundenname, ...z.wellen.map((w) => w.welle.name)].join(" ").toLowerCase().includes(q);
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

  const ersterLauf = loading && daten.projekte.length === 0;

  return (
    <div className="v-seite">
      <Seitenkopf
        titel="Übersicht"
        aktionen={
          <>
            <Button variant="ghost" size="icon" onClick={laden} title="Aktualisieren" aria-label="Aktualisieren">
              <RefreshCw className={cn(loading && "animate-spin")} />
            </Button>
            <Button onClick={() => setDialogOffen(true)}>
              <Plus /> Neues Projekt
            </Button>
          </>
        }
      />

      {ersterLauf ? (
        <>
          <Skeleton className="h-[86px] w-full" />
          <Skeleton className="h-64 w-full" />
        </>
      ) : daten.projekte.length === 0 ? (
        <div className="v-leer">Noch kein Projekt — oben rechts über „Neues Projekt“ starten.</div>
      ) : (
        <>
          <Kennzahlleiste werte={[
            kachel("Projekte", kennzahlen.projekte, "ohne archivierte"),
            kachel("Wellen live", liveWellen.length, kennzahlen.fehlt ? `${kennzahlen.fehlt} unter der Mindestzahl` : undefined, kennzahlen.fehlt ? "attention" : undefined),
            kachel("Abgeschlossene Interviews", kennzahlen.abgeschlossen, "insgesamt"),
            kachel("Neu in 7 Tagen", kennzahlen.woche, "abgeschlossene Interviews"),
          ]} />

          {/* Was gerade läuft — erscheint nur, wenn etwas läuft */}
          {liveWellen.length > 0 && (
            <div className="space-y-3">
              <Abschnittstitel>Läuft gerade</Abschnittstitel>
              <Box className="divide-y">
                {liveWellen.map(({ welle, k, projekt }) => {
                  const h = wellenHinweis(welle, k);
                  const ton = HINWEIS_TON[h.ton];
                  return (
                    <div key={welle.id} className={cn("px-4 py-3 space-y-2", ton === "attention" && "shadow-[inset_3px_0_0_hsl(var(--status-attention))]")}>
                      <div className="flex items-center gap-3.5 min-w-0">
                        <TypPille zielgruppe={welle.zielgruppe} />
                        <div className="min-w-0 flex-1">
                          <Link to={`/welle/${welle.id}/dashboard`} className="block text-object text-foreground truncate hover:underline">
                            {welle.name}
                          </Link>
                          <p className="text-label uppercase text-muted-foreground truncate">
                            {[projekt.kundenname, projekt.name].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span className="text-meta text-muted-foreground whitespace-nowrap hidden md:inline">zuletzt {relativerTag(k.letzteAktivitaet)}</span>
                        <LinkAktionen welle={welle} mitText={false} variant="ghost" />
                      </div>
                      <Fortschritt k={k} />
                      {ton !== "done" && <p className={cn("text-meta", ton === "attention" ? TON_TEXT.attention : "text-muted-foreground")}>{h.text}</p>}
                    </div>
                  );
                })}
              </Box>
            </div>
          )}

          <div className="space-y-3">
            <Abschnittstitel>Projekte</Abschnittstitel>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {FILTER.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn("v-chip", filter === f.key && "v-chip-aktiv")}
                  >
                    {f.label} ({zeilen.filter((z) => f.passt(z.status)).length})
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-[280px]">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={suche}
                  onChange={(e) => setSuche(e.target.value)}
                  placeholder="Projekt, Kunde, Welle …"
                  className="pl-8 pr-8 bg-card"
                />
                {suche && (
                  <button type="button" onClick={() => setSuche("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Suche leeren">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {sichtbar.length === 0 ? (
              <div className="v-leer">
                {suche.trim() ? "Kein Projekt passt zur Suche. " : `Kein Projekt im Filter „${FILTER.find((f) => f.key === filter)?.label}“. `}
                <button type="button" className="underline" onClick={() => { setSuche(""); setFilter("alle"); }}>
                  Alle Projekte anzeigen
                </button>
              </div>
            ) : (
              <Box className="divide-y overflow-hidden">
                {sichtbar.map(({ projekt: p, status, wellen, abgeschlossen, letzte }) => {
                  const live = wellen.filter((w) => w.welle.status === "live").length;
                  const wellenText = wellen.length === 0
                    ? "Noch keine Welle"
                    : `${wellen.length} ${wellen.length === 1 ? "Welle" : "Wellen"}${live ? ` · ${live} live` : ""} · zuletzt ${relativerTag(letzte)}`;
                  return (
                    <Listenzeile
                      key={p.id}
                      titel={p.name}
                      label={p.kundenname || "Kein Kundenname"}
                      zusatz={wellenText}
                      etikett={<StatusBadge status={status} art="projekt" />}
                      wert={abgeschlossen}
                      wertHinweis="abgeschlossen"
                      onClick={() => navigate(`/projekt/${p.id}`)}
                    />
                  );
                })}
              </Box>
            )}
          </div>
        </>
      )}

      <Dialog open={dialogOffen} onOpenChange={setDialogOffen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neues Projekt</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pname">Projektname</Label>
              <Input id="pname" value={neuName} onChange={(e) => setNeuName(e.target.value)} placeholder="z. B. Markenprüfstand 2026" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkunde">Kundenname</Label>
              <Input id="pkunde" value={neuKunde} onChange={(e) => setNeuKunde(e.target.value)} placeholder="so, wie er in den Fragen stehen soll" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOffen(false)} disabled={speichern}>
              Abbrechen
            </Button>
            <Button onClick={projektAnlegen} disabled={speichern}>
              {speichern ? "Legt an…" : "Projekt anlegen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
