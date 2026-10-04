import React, { useState, useEffect, useMemo } from "react";
import { bestaetigen, eingabe } from "@/components/shared/Bestaetigen";
import { useParams, Link } from "react-router-dom";
import { Plus, Save, Trash2, CopyPlus, Pencil, LineChart, Table2, Mail, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Seitenkopf from "@/components/shared/Seitenkopf";
import Abschnittstitel from "@/components/shared/Abschnittstitel";
import TypPille from "@/components/shared/TypPille";
import { Box, BoxKopf, BoxInhalt } from "@/components/shared/Box";
import { TON_TEXT, HINWEIS_TON } from "@/lib/designTon";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ZIELGRUPPE_LABELS, generiereToken } from "@/lib/interview";
import { kachel } from "@/components/verwaltung/Kachel";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import StatusBadge from "@/components/verwaltung/StatusBadge";
import Fortschritt from "@/components/verwaltung/Fortschritt";
import LinkAktionen from "@/components/verwaltung/LinkAktionen";
import VerlaufChart from "@/components/verwaltung/VerlaufChart";
import {
  ladeProjekt,
  wellenKennzahlen,
  wellenHinweis,
  verlaufProTag,
  relativerTag,
  datumKurz,
  welleDuplizieren,
  welleLoeschen,
} from "@/lib/verwaltung";

export default function ProjectDetail() {
  const { id } = useParams();
  const [projekt, setProjekt] = useState(null);
  const [wellen, setWellen] = useState([]);
  const [sessionsJeWelle, setSessionsJeWelle] = useState({});
  const [loading, setLoading] = useState(true);
  const [speichern, setSpeichern] = useState(false);
  const [ungespeichert, setUngespeichert] = useState(false);
  const [neueWelle, setNeueWelle] = useState(false);
  const [welleName, setWelleName] = useState("");
  const [welleZielgruppe, setWelleZielgruppe] = useState("mitarbeiter");
  const [welleEingeladen, setWelleEingeladen] = useState("");
  const [welleEndetAm, setWelleEndetAm] = useState("");
  const [beschaeftigt, setBeschaeftigt] = useState(null);
  const [reiter, setReiter] = useState("wellen"); // Wellen-ID, an der gerade gearbeitet wird

  async function laden(still = false) {
    if (!still) setLoading(true);
    try {
      const d = await ladeProjekt(id);
      d.wellen.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setProjekt(d.projekt);
      setWellen(d.wellen);
      setSessionsJeWelle(d.sessionsJeWelle);
      setUngespeichert(false);
    } catch (e) {
      toast.error("Projekt konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    laden();
  }, [id]);

  const wellenMitZahlen = useMemo(
    () => wellen.map((w) => ({ welle: w, k: wellenKennzahlen(w, sessionsJeWelle[w.id] || []) })),
    [wellen, sessionsJeWelle]
  );

  const summe = useMemo(() => {
    let gestartet = 0;
    let abgeschlossen = 0;
    let letzte = null;
    for (const { k } of wellenMitZahlen) {
      gestartet += k.gestartet;
      abgeschlossen += k.abgeschlossen;
      if (k.letzteAktivitaet && (!letzte || k.letzteAktivitaet > letzte)) letzte = k.letzteAktivitaet;
    }
    return {
      gestartet,
      abgeschlossen,
      letzte,
      live: wellen.filter((w) => w.status === "live").length,
    };
  }, [wellenMitZahlen, wellen]);

  const verlauf = useMemo(
    () => verlaufProTag(Object.values(sessionsJeWelle).flat()),
    [sessionsJeWelle]
  );

  function feldAendern(feld, wert) {
    setProjekt({ ...projekt, [feld]: wert });
    setUngespeichert(true);
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
      });
      setUngespeichert(false);
      toast.success("Gespeichert.");
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSpeichern(false);
    }
  }

  // Projektstatus wird sofort gespeichert — unabhängig von den übrigen Einstellungen
  async function projektStatus(neu) {
    const alt = projekt.status;
    setProjekt((p) => ({ ...p, status: neu }));
    try {
      await base44.entities.Projekt.update(id, { status: neu });
      toast.success("Projektstatus aktualisiert.");
    } catch (e) {
      setProjekt((p) => ({ ...p, status: alt }));
      toast.error("Aktualisierung fehlgeschlagen.");
    }
  }

  async function logoHochladen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      feldAendern("logoUrl", file_url);
      toast.success("Logo hochgeladen — bitte noch speichern.");
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
      const daten = {
        projektId: id,
        name: welleName.trim(),
        zielgruppe: welleZielgruppe,
        linkToken: generiereToken(),
        status: "entwurf",
        mindestTeilnehmer: 6,
        begruessungstext: "",
        abschlusstext: "",
        geschaetzteDauerMinuten: 10,
      };
      if (Number(welleEingeladen) > 0) daten.eingeladen = Number(welleEingeladen);
      if (welleEndetAm) daten.endetAm = welleEndetAm;
      await base44.entities.Welle.create(daten);
      toast.success("Welle angelegt.");
      setNeueWelle(false);
      setWelleName("");
      setWelleEingeladen("");
      setWelleEndetAm("");
      laden(true);
    } catch (e) {
      toast.error("Anlegen fehlgeschlagen.");
    }
  }

  async function welleStatus(w, neu) {
    if (neu === w.status) return;
    if (neu === "live" && !await bestaetigen(`Welle „${w.name}“ freischalten? Der Teilnahmelink funktioniert ab sofort.`)) return;
    if (neu === "geschlossen" && !await bestaetigen(`Welle „${w.name}“ schließen? Neue Teilnahmen sind dann nicht mehr möglich.`)) return;
    try {
      await base44.entities.Welle.update(w.id, { status: neu });
      setWellen((liste) => liste.map((x) => (x.id === w.id ? { ...x, status: neu } : x)));
      toast.success("Status aktualisiert.");
    } catch (e) {
      toast.error("Aktualisierung fehlgeschlagen.");
    }
  }

  async function duplizieren(w) {
    const name = await eingabe(
      "Name der Kopie — Blöcke und Fragen werden übernommen, Antworten nicht. Die Kopie bekommt einen eigenen Link.",
      `${w.name} (Kopie)`
    );
    if (!name || !name.trim()) return;
    setBeschaeftigt(w.id);
    try {
      const r = await welleDuplizieren(w, name.trim());
      toast.success(`Kopie angelegt: ${r.bloecke} Blöcke, ${r.fragen} Fragen.`);
      laden(true);
    } catch (e) {
      toast.error("Duplizieren fehlgeschlagen — bitte prüfen, ob eine unvollständige Kopie entstanden ist.");
      laden(true);
    } finally {
      setBeschaeftigt(null);
    }
  }

  async function loeschen(w, k) {
    let msg = `Welle „${w.name}“ wirklich löschen? Alle Blöcke und Fragen gehen verloren.`;
    if (k.gestartet > 0) {
      msg += `\n\nAchtung: Zu dieser Welle liegen ${k.gestartet} Teilnahmen vor (${k.abgeschlossen} abgeschlossen). Ihre Antworten werden unwiderruflich gelöscht.`;
    }
    if (!await bestaetigen(msg)) return;
    setBeschaeftigt(w.id);
    try {
      await welleLoeschen(w);
      toast.success("Welle gelöscht.");
      laden(true);
    } catch (e) {
      toast.error("Löschen fehlgeschlagen.");
    } finally {
      setBeschaeftigt(null);
    }
  }

  if (loading) return <div className="v-seite v-lade">Lade Projekt…</div>;
  if (!projekt) return <div className="v-seite v-lade">Projekt nicht gefunden.</div>;

  return (
    <div className="v-seite">
      <Seitenkopf
        zurueck={{ to: "/", label: "Übersicht" }}
        bereich="Projekt"
        titel={projekt.name}
        versalien={false}
        kontext={
          <span className="inline-flex items-center gap-2 flex-wrap mt-1">
            <StatusBadge status={projekt.status || "entwurf"} art="projekt" />
            <span>{projekt.kundenname || "Kein Kundenname"}</span>
          </span>
        }
        aktionen={
          <>
            <Select value={projekt.status || "entwurf"} onValueChange={projektStatus}>
              <SelectTrigger className="w-36 bg-card" aria-label="Projektstatus"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entwurf">Entwurf</SelectItem>
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="archiviert">Archiviert</SelectItem>
              </SelectContent>
            </Select>
            <Button variant={reiter === "wellen" ? "default" : "outline"} onClick={() => setNeueWelle(true)}>
              <Plus /> Neue Welle
            </Button>
          </>
        }
      />

      <Tabs value={reiter} onValueChange={setReiter}>
        <TabsList>
          <TabsTrigger value="wellen">Wellen ({wellen.length})</TabsTrigger>
          <TabsTrigger value="einstellungen">
            Einstellungen{ungespeichert ? " •" : ""}
          </TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------------ */}
        <TabsContent value="wellen" className="mt-4 space-y-5">
          <Kennzahlleiste werte={[
            kachel("Wellen", wellen.length, `${summe.live} live`),
            kachel("Abgeschlossen", summe.abgeschlossen, "Interviews"),
            kachel("Begonnen", summe.gestartet - summe.abgeschlossen, "noch nicht beendet"),
            kachel("Letzte Aktivität", relativerTag(summe.letzte)),
          ]} />

          {wellen.length === 0 ? (
            <div className="v-leer">Dieses Projekt hat noch keine Welle — oben rechts über „Neue Welle“ anlegen.</div>
          ) : (
            <div className="space-y-3">
              <Abschnittstitel>Wellen</Abschnittstitel>
              {wellenMitZahlen.map(({ welle: w, k }) => {
                const h = wellenHinweis(w, k);
                const ton = HINWEIS_TON[h.ton];
                const arbeitet = beschaeftigt === w.id;
                return (
                  <Box key={w.id} streifen={ton === "attention" ? "attention" : undefined} className={cn(arbeitet && "opacity-50 pointer-events-none")}>
                    <div className="flex items-center gap-3.5 px-4 py-3 flex-wrap border-b">
                      <TypPille zielgruppe={w.zielgruppe} />
                      <div className="min-w-0 flex-1">
                        <Link to={`/welle/${w.id}/dashboard`} className="block text-object text-foreground truncate hover:underline">
                          {w.name}
                        </Link>
                        <p className="text-label uppercase text-muted-foreground truncate">
                          {[
                            k.frist ? `läuft bis ${datumKurz(k.frist, true)}` : null,
                            k.gestartet > 0 ? `zuletzt ${relativerTag(k.letzteAktivitaet)}` : "noch keine Teilnahme",
                          ].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <StatusBadge status={w.status} />
                      <LinkAktionen welle={w} mitText={false} variant="ghost" />
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <Fortschritt k={k} />
                      {ton !== "done" && <p className={cn("text-meta", ton === "attention" ? TON_TEXT.attention : "text-muted-foreground")}>{h.text}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap px-4 py-2.5 border-t">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link to={`/welle/${w.id}/dashboard`}><Button variant="outline" size="sm"><LineChart /> Verlauf</Button></Link>
                        <Link to={`/welle/${w.id}/editor`}><Button variant="outline" size="sm"><Pencil /> Fragen</Button></Link>
                        <Link to={`/welle/${w.id}/einladungen`}><Button variant="outline" size="sm"><Mail /> Einladungen</Button></Link>
                        <Link to={`/welle/${w.id}/rohdaten`}><Button variant="outline" size="sm"><Table2 /> Antworten</Button></Link>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Select value={w.status} onValueChange={(v) => welleStatus(w, v)}>
                          <SelectTrigger className="w-36 h-8 text-meta" aria-label="Status der Welle"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entwurf">Entwurf</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="geschlossen">Geschlossen</SelectItem>
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Weitere Aktionen"><MoreHorizontal /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => duplizieren(w)}><CopyPlus className="w-4 h-4 mr-2 text-muted-foreground" /> Duplizieren</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => loeschen(w, k)}><Trash2 className="w-4 h-4 mr-2 text-muted-foreground" /> Löschen …</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Box>
                );
              })}
            </div>
          )}

          {wellen.length > 0 && (
            <Box>
              <BoxKopf titel="Verlauf über alle Wellen" />
              <BoxInhalt><VerlaufChart daten={verlauf} /></BoxInhalt>
            </Box>
          )}
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        <TabsContent value="einstellungen" className="mt-4 space-y-5">
          <div className="v-karte">
            <h2 className="v-h2 mb-3">Stammdaten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Projektname</Label>
                <Input value={projekt.name || ""} onChange={(e) => feldAendern("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Kundenname</Label>
                <Input value={projekt.kundenname || ""} onChange={(e) => feldAendern("kundenname", e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  Erscheint in den Fragen überall, wo <code>{"{{firma}}"}</code> steht.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="v-karte">
              <h2 className="v-h2 mb-3">Briefing</h2>
              <Textarea
                value={projekt.briefing || ""}
                onChange={(e) => feldAendern("briefing", e.target.value)}
                placeholder="Hintergrund, Ziele, Kontext des Projekts…"
                rows={10}
              />
              <p className="text-xs text-muted-foreground mt-2">Nur intern — Befragte sehen das Briefing nie.</p>
            </div>

            <div className="v-karte">
              <h2 className="v-h2 mb-3">Design</h2>
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
                      <img src={projekt.logoUrl} alt="Logo" className="h-12 w-auto max-w-[120px] object-contain border border-border rounded p-1" />
                    ) : (
                      <div className="h-12 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">Kein Logo</div>
                    )}
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-3 py-2 text-sm border border-border rounded-md hover:bg-muted/40">
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
                        <input type="color" value={projekt.farbePrimaer || "#ff3764"} onChange={(e) => feldAendern("farbePrimaer", e.target.value)} className="h-9 w-12 rounded border border-border" />
                        <Input value={projekt.farbePrimaer || ""} onChange={(e) => feldAendern("farbePrimaer", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Sekundärfarbe</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={projekt.farbeSekundaer || "#45d085"} onChange={(e) => feldAendern("farbeSekundaer", e.target.value)} className="h-9 w-12 rounded border border-border" />
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
              </div>
            </div>
          </div>

          <div className="v-karte">
            <h2 className="v-h2 mb-3">Schrift &amp; Rechtliches</h2>
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
                      <input type="color" value={projekt.farbeText || "#2d2d2d"} onChange={(e) => feldAendern("farbeText", e.target.value)} className="h-9 w-12 rounded border border-border" />
                      <Input value={projekt.farbeText || ""} onChange={(e) => feldAendern("farbeText", e.target.value)} placeholder="#2d2d2d" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hintergrundfarbe (optional)</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={projekt.farbeHintergrund || "#ffffff"} onChange={(e) => feldAendern("farbeHintergrund", e.target.value)} className="h-9 w-12 rounded border border-border" />
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
            <p className="text-xs text-muted-foreground mt-3">
              Sind Datenschutz- und Impressum-URL gesetzt, erscheinen sie als Fußzeile im Teilnehmer-Frontend.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 sticky bottom-4">
            {ungespeichert && (
              <span className="text-xs text-status-attention bg-status-attention-surface border border-status-attention/30 rounded px-2 py-1">
                Ungespeicherte Änderungen
              </span>
            )}
            <Button onClick={speichernProjekt} disabled={speichern}>
              <Save size={16} /> {speichern ? "Speichert…" : "Einstellungen speichern"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={neueWelle} onOpenChange={setNeueWelle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Welle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name der Welle</Label>
              <Input value={welleName} onChange={(e) => setWelleName(e.target.value)} placeholder="z. B. Welle 1 — Außendienst" autoFocus />
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Eingeladene Personen (optional)</Label>
                <Input type="number" min="0" value={welleEingeladen} onChange={(e) => setWelleEingeladen(e.target.value)} placeholder="z. B. 24" />
              </div>
              <div className="space-y-2">
                <Label>Läuft bis (optional)</Label>
                <Input type="date" value={welleEndetAm} onChange={(e) => setWelleEndetAm(e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Beides lässt sich später im Verlauf der Welle ändern. Die Frist schließt die Welle nicht automatisch.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNeueWelle(false)}>Abbrechen</Button>
            <Button onClick={welleAnlegen}>Anlegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
