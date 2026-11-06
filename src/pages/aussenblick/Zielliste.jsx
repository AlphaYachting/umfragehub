import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Seitenkopf from "@/components/shared/Seitenkopf";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import Abschnittstitel from "@/components/shared/Abschnittstitel";
import Listenzeile from "@/components/shared/Listenzeile";
import StatusEtikett from "@/components/shared/StatusEtikett";
import { Box } from "@/components/shared/Box";
import { kachel } from "@/components/verwaltung/Kachel";
import { TON_TEXT } from "@/lib/designTon";
import { relativerTag, gruppiere } from "@/lib/verwaltung";
import ModulPille from "@/components/aussenblick/ModulPille";
import {
  ZIEL_STATUS, ZIEL_FILTER, STATUS_GRUPPE, BUDGETKLASSE, DOSIS_JE_WOCHE,
  ladeZiele, gemerktAussenblick, zielKennzahlen, versendetDieseWoche, zielAnlegen, kuerzelVorschlag, trichter,
} from "@/lib/aussenblick";

// Zielliste des Außenblick-Moduls: welche Unternehmen gerade geprüft werden, wo eine
// Entscheidung von Alfons fehlt, was unterwegs ist. Kein Knopf hier schickt etwas hinaus.
export default function Zielliste() {
  const navigate = useNavigate();
  const [daten, setDaten] = useState(() => gemerktAussenblick("ziele") || { ziele: [], widersprueche: [], einladungen: [], ereignisse: [] });
  const [loading, setLoading] = useState(true);
  const [suche, setSuche] = useState("");
  const [filter, setFilter] = useState("offen");
  const [dialog, setDialog] = useState(false);
  const [neu, setNeu] = useState({ unternehmen: "", website: "", kuerzel: "", region: "", branche: "", ausloeser: "", scanGleich: true });
  const [speichert, setSpeichert] = useState(false);

  async function laden() {
    setLoading(true);
    try {
      setDaten(await ladeZiele());
    } catch (e) {
      toast.error("Ziele konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { laden(); }, []);

  const zeilen = useMemo(() => {
    const wJeZiel = gruppiere(daten.widersprueche, "zielId");
    const eJeZiel = gruppiere(daten.einladungen, "zielId");
    const vJeZiel = gruppiere(daten.ereignisse, "zielId");
    return daten.ziele
      .map((z) => ({ ziel: z, status: z.status || "vorgemerkt", k: zielKennzahlen(z, wJeZiel[z.id] || [], eJeZiel[z.id] || [], vJeZiel[z.id] || []) }))
      .sort((a, b) => (b.k.letztes?.getTime() || 0) - (a.k.letztes?.getTime() || 0));
  }, [daten]);

  const kennzahlen = useMemo(() => {
    const offen = zeilen.filter((z) => !STATUS_GRUPPE.zu.includes(z.status));
    const entscheiden = zeilen.filter((z) => STATUS_GRUPPE.entscheiden.includes(z.status));
    const unterwegs = zeilen.filter((z) => ["versendet", "geoeffnet", "antworten"].includes(z.status));
    const grenze = Date.now() - 7 * 86400000;
    const antwortenWoche = daten.ereignisse.filter((e) => e.art === "frage_beantwortet" && new Date(e.am || e.created_date).getTime() > grenze).length;
    return { offen: offen.length, entscheiden: entscheiden.length, unterwegs: unterwegs.length, antwortenWoche, versendet: versendetDieseWoche(daten.einladungen) };
  }, [zeilen, daten]);

  const entscheiden = useMemo(() => zeilen.filter((z) => STATUS_GRUPPE.entscheiden.includes(z.status)), [zeilen]);
  const t = useMemo(() => trichter(daten.ziele), [daten]);

  const sichtbar = useMemo(() => {
    const q = suche.trim().toLowerCase();
    const f = ZIEL_FILTER.find((x) => x.key === filter) || ZIEL_FILTER[0];
    return zeilen.filter((z) => {
      if (!f.passt(z.status)) return false;
      if (!q) return true;
      return [z.ziel.unternehmen, z.ziel.kuerzel, z.ziel.region, z.ziel.branche, z.ziel.website].join(" ").toLowerCase().includes(q);
    });
  }, [zeilen, suche, filter]);

  function neuFeld(feld, wert) {
    setNeu((n) => {
      const next = { ...n, [feld]: wert };
      if (feld === "unternehmen" && (!n.kuerzel || n.kuerzel === kuerzelVorschlag(n.unternehmen))) next.kuerzel = kuerzelVorschlag(wert);
      return next;
    });
  }

  async function anlegen() {
    if (!neu.unternehmen.trim()) {
      toast.error("Bitte den Namen des Unternehmens eingeben.");
      return;
    }
    setSpeichert(true);
    try {
      const z = await zielAnlegen(neu);
      toast.success(neu.scanGleich ? "Ziel angelegt, Scan angefordert." : "Ziel vorgemerkt.");
      setDialog(false);
      setNeu({ unternehmen: "", website: "", kuerzel: "", region: "", branche: "", ausloeser: "", scanGleich: true });
      navigate(`/aussenblick/${z.id}`);
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    } finally {
      setSpeichert(false);
    }
  }

  const ersterLauf = loading && daten.ziele.length === 0;

  return (
    <div className="v-seite">
      <Seitenkopf
        bereich="Akquise"
        titel="Außenblick"
        kontext="Unternehmen, die online werben — geprüft, bevor jemand angeschrieben wird. Nichts hier geht ohne deine Hand hinaus."
        aktionen={
          <>
            <Button variant="ghost" size="icon" onClick={laden} title="Aktualisieren" aria-label="Aktualisieren">
              <RefreshCw className={cn(loading && "animate-spin")} />
            </Button>
            <Button onClick={() => setDialog(true)}>
              <Plus /> Neues Ziel
            </Button>
          </>
        }
      />

      {ersterLauf ? (
        <>
          <Skeleton className="h-[86px] w-full" />
          <Skeleton className="h-64 w-full" />
        </>
      ) : daten.ziele.length === 0 ? (
        <div className="v-leer">Noch kein Ziel — oben rechts über „Neues Ziel“ eine Website eintragen.</div>
      ) : (
        <>
          <Kennzahlleiste werte={[
            kachel("Ziele offen", kennzahlen.offen, "ohne abgeschlossene"),
            kachel("Zu entscheiden", kennzahlen.entscheiden, kennzahlen.entscheiden ? "Befund oder Freigabe wartet" : "nichts offen", kennzahlen.entscheiden ? "attention" : undefined),
            kachel("Portale unterwegs", kennzahlen.unterwegs, "versendet, geöffnet, beantwortet"),
            kachel("Antworten in 7 Tagen", kennzahlen.antwortenWoche, "aus den Portalen"),
            kachel("Versendet in 7 Tagen", `${kennzahlen.versendet} / ${DOSIS_JE_WOCHE}`, kennzahlen.versendet >= DOSIS_JE_WOCHE ? "Wochendosis erreicht" : "höchstens fünf je Woche", kennzahlen.versendet >= DOSIS_JE_WOCHE ? "attention" : undefined),
          ]} />

          {/* Trichter über alle Ziele — jede Zelle: wie viele mindestens so weit sind, darunter die Quote zur Stufe davor */}
          <Kennzahlleiste werte={[
            kachel("Scans", t.scans, "angefordert oder laufend"),
            kachel("Befunde", t.befunde, t.noGo ? `${t.noGo} no-go` : "go oder no-go offen"),
            kachel("Go", t.go, t.goQuote ? `${t.goQuote} der Befunde` : "—"),
            kachel("Versendet", t.versendet, "Briefe von Hand markiert"),
            kachel("Geöffnet", t.geoeffnet, t.oeffnungsQuote ? `${t.oeffnungsQuote} der Versendeten` : "—"),
            kachel("Antworten", t.antworten, t.antwortQuote ? `${t.antwortQuote} der Geöffneten` : "—"),
            kachel("Erstgespräche", t.erstgespraeche, t.gespraechsQuote ? `${t.gespraechsQuote} der Antworten` : "—"),
            kachel("Kunden", t.kunden, t.kundenQuote ? `${t.kundenQuote} der Erstgespräche` : "—", t.kunden ? "done" : undefined),
          ]} />

          {entscheiden.length > 0 && (
            <div className="space-y-3">
              <Abschnittstitel>Wartet auf dich</Abschnittstitel>
              <Box className="divide-y">
                {entscheiden.map(({ ziel, status, k }) => (
                  <div key={ziel.id} className="px-4 py-3 flex items-center gap-3.5 min-w-0 shadow-[inset_3px_0_0_hsl(var(--status-attention))]">
                    <ModulPille modul={ziel.modul} />
                    <div className="min-w-0 flex-1">
                      <button type="button" onClick={() => navigate(`/aussenblick/${ziel.id}`)} className="block text-object text-foreground truncate hover:underline text-left">
                        {ziel.unternehmen}
                      </button>
                      <p className="text-meta text-foreground truncate">{ziel.blick?.divergenz || ZIEL_STATUS[status]?.schritt}</p>
                      {ziel.blick?.divergenz && <p className={cn("text-meta", TON_TEXT.attention)}>{ZIEL_STATUS[status]?.schritt}</p>}
                    </div>
                    <StatusEtikett ton={ZIEL_STATUS[status]?.ton}>{ZIEL_STATUS[status]?.label}</StatusEtikett>
                    <span className="text-meta text-muted-foreground whitespace-nowrap hidden md:inline">
                      {k.stark} stark · {k.gesamt} gesamt
                    </span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/aussenblick/${ziel.id}`)}>Öffnen</Button>
                  </div>
                ))}
              </Box>
            </div>
          )}

          <div className="space-y-3">
            <Abschnittstitel>Ziele</Abschnittstitel>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {ZIEL_FILTER.map((f) => (
                  <button key={f.key} type="button" onClick={() => setFilter(f.key)} className={cn("v-chip", filter === f.key && "v-chip-aktiv")}>
                    {f.label} ({zeilen.filter((z) => f.passt(z.status)).length})
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-[280px]">
                <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={suche} onChange={(e) => setSuche(e.target.value)} placeholder="Unternehmen, Region, Branche …" className="pl-8 pr-8 bg-card" />
                {suche && (
                  <button type="button" onClick={() => setSuche("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Suche leeren">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {sichtbar.length === 0 ? (
              <div className="v-leer">
                {suche.trim() ? "Kein Ziel passt zur Suche. " : `Kein Ziel im Filter „${ZIEL_FILTER.find((f) => f.key === filter)?.label}“. `}
                <button type="button" className="underline" onClick={() => { setSuche(""); setFilter("alle"); }}>Alle Ziele anzeigen</button>
              </div>
            ) : (
              <Box className="divide-y overflow-hidden">
                {sichtbar.map(({ ziel, status, k }) => {
                  const bk = ziel.budgetklasse ? BUDGETKLASSE[ziel.budgetklasse] : null;
                  const label = [ziel.kuerzel, ziel.region, ziel.branche].filter(Boolean).join(" · ") || ziel.website;
                  // Die Divergenz in einem Satz, sobald der Scan sie geliefert hat — sonst die Eckdaten
                  const zusatz = ziel.blick?.divergenz || [
                    k.anzeigen ? `${k.anzeigen} Anzeigen aktiv` : null,
                    bk ? `Budgetklasse ${ziel.budgetklasse} (${bk.label})` : null,
                    k.letztes ? `zuletzt ${relativerTag(k.letztes)}` : null,
                  ].filter(Boolean).join(" · ");
                  return (
                    <Listenzeile
                      key={ziel.id}
                      typ={<ModulPille modul={ziel.modul} />}
                      titel={ziel.unternehmen}
                      label={label}
                      zusatz={zusatz}
                      etikett={<StatusEtikett ton={ZIEL_STATUS[status]?.ton}>{ZIEL_STATUS[status]?.label || status}</StatusEtikett>}
                      wert={k.gesamt ? k.stark : null}
                      wertHinweis={k.gesamt ? `stark von ${k.gesamt}` : "noch kein Befund"}
                      wertTon={k.stark >= 3 ? "attention" : "neutral"}
                      streifen={STATUS_GRUPPE.entscheiden.includes(status) ? "attention" : undefined}
                      onClick={() => navigate(`/aussenblick/${ziel.id}`)}
                      aktion={
                        k.haupt?.status === "versendet" ? (
                          <span className="text-meta text-muted-foreground whitespace-nowrap">{k.haupt.aufrufe || 0} Aufrufe{k.antworten ? ` · ${k.antworten} Antworten` : ""}</span>
                        ) : null
                      }
                    />
                  );
                })}
              </Box>
            )}
          </div>
        </>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Neues Ziel</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="z-unternehmen">Unternehmen</Label>
              <Input id="z-unternehmen" value={neu.unternehmen} onChange={(e) => neuFeld("unternehmen", e.target.value)} placeholder="z. B. Procfit GmbH" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="z-website">Website</Label>
              <Input id="z-website" value={neu.website} onChange={(e) => neuFeld("website", e.target.value)} placeholder="https://…" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="z-kuerzel">Kürzel</Label>
                <Input id="z-kuerzel" value={neu.kuerzel} onChange={(e) => neuFeld("kuerzel", e.target.value)} placeholder="pcf" maxLength={4} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="z-region">Region</Label>
                <Input id="z-region" value={neu.region} onChange={(e) => neuFeld("region", e.target.value)} placeholder="Steiermark" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="z-branche">Branche</Label>
              <Input id="z-branche" value={neu.branche} onChange={(e) => neuFeld("branche", e.target.value)} placeholder="z. B. Sourcing-Beratung" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="z-ausloeser">Auslöser — dein Eindruck</Label>
              <Textarea id="z-ausloeser" rows={3} value={neu.ausloeser} onChange={(e) => neuFeld("ausloeser", e.target.value)} placeholder="Was ist dir aufgefallen? Wird im Scan als Hypothese geprüft, nicht bestätigt." />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <Checkbox checked={neu.scanGleich} onCheckedChange={(v) => neuFeld("scanGleich", Boolean(v))} />
              Scan gleich anfordern
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)} disabled={speichert}>Abbrechen</Button>
            <Button onClick={anlegen} disabled={speichert}>{speichert ? "Legt an…" : "Ziel anlegen"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
