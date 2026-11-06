import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Copy, ExternalLink, KeyRound, MoreHorizontal, RefreshCw, Save, Send, Trash2, Phone, Pencil, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import Seitenkopf from "@/components/shared/Seitenkopf";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import StatusEtikett from "@/components/shared/StatusEtikett";
import { Box, BoxKopf, BoxInhalt } from "@/components/shared/Box";
import { bestaetigen } from "@/components/shared/Bestaetigen";
import { kachel } from "@/components/verwaltung/Kachel";
import ModulPille from "@/components/aussenblick/ModulPille";
import MarkdownLeicht from "@/components/aussenblick/MarkdownLeicht";
import { TON_TEXT } from "@/lib/designTon";
import { alsDatum, datumKurz, relativerTag, inZwischenablage } from "@/lib/verwaltung";
import {
  ZIEL_STATUS, STATUS_REIHENFOLGE, WIDERSPRUCH_TYP, STAERKE, PORTAL_STUFE, MODUL, HEBEL, BUDGETKLASSE,
  EINLADUNG_STATUS, EREIGNIS_ART, ROLLE,
  ladeZiel, zielAusZwischenspeicher, zielKennzahlen, ereignisZeit,
  statusSetzen, notizSchreiben, einladungAnlegen, versendetMarkieren, zielLoeschen, portalUrl, portalVorschauUrl,
} from "@/lib/aussenblick";

const REITER = ["befund", "portal", "brief", "verlauf", "register"];

function datumZeit(d) {
  if (!d) return "—";
  const t = datumKurz(d, true);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${t} ${hh}:${mm}`;
}

function heuteTag() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Ein Beleg: Text, Fundstelle als Link, Datum, Belegstufe
function Beleg({ titel, beleg }) {
  if (!beleg) return null;
  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 min-w-0">
      <p className="text-label uppercase text-muted-foreground">{titel}</p>
      <p className="text-body text-foreground">{beleg.text}</p>
      <p className="text-meta text-muted-foreground flex flex-wrap gap-x-2">
        {beleg.url ? (
          <a href={beleg.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground break-all">{beleg.fundstelle || beleg.url}</a>
        ) : (
          <span>{beleg.fundstelle}</span>
        )}
        {beleg.datum && <span>· {beleg.datum}</span>}
        {beleg.stufe && <span>· {beleg.stufe}</span>}
      </p>
    </div>
  );
}

function Karte({ titel, karte }) {
  if (!karte) return null;
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1.5 min-w-0">
      <p className="text-label uppercase text-muted-foreground">{titel}</p>
      <p className="text-body text-foreground">{karte.text}</p>
      {karte.label && (
        <p className="text-meta text-muted-foreground">
          {karte.url ? <a href={karte.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">{karte.label}</a> : karte.label}
        </p>
      )}
    </div>
  );
}

function Liste({ titel, eintraege, leer }) {
  return (
    <div className="space-y-1.5">
      <p className="text-label uppercase text-muted-foreground">{titel}</p>
      {eintraege?.length ? (
        <ul className="list-disc pl-5 space-y-1 text-body text-foreground">{eintraege.map((t, i) => <li key={i}>{t}</li>)}</ul>
      ) : (
        <p className="text-meta text-muted-foreground">{leer || "—"}</p>
      )}
    </div>
  );
}

export default function Zielkarte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [d, setD] = useState(() => zielAusZwischenspeicher(id));
  const [loading, setLoading] = useState(!d);
  const [reiter, setReiter] = useState(() => {
    const r = new URLSearchParams(window.location.search).get("reiter");
    return REITER.includes(r) ? r : "befund";
  });
  const [offen, setOffen] = useState({});
  const [beschaeftigt, setBeschaeftigt] = useState(false);
  const [versand, setVersand] = useState(null); // Einladung, die als versendet markiert werden soll
  const [versandweg, setVersandweg] = useState("post");
  const [versandAm, setVersandAm] = useState(heuteTag);
  const [brief, setBrief] = useState({ briefText: "", briefAufhaenger: "", warmerDraht: "", postadresse: "" });
  const [briefGeaendert, setBriefGeaendert] = useState(false);
  const [notiz, setNotiz] = useState("");
  const [registerAnsicht, setRegisterAnsicht] = useState("befund");

  const ziel = d?.ziel || null;

  function anwenden(neu) {
    setD(neu);
    const z = neu.ziel || {};
    setBrief({ briefText: z.briefText || "", briefAufhaenger: z.briefAufhaenger || "", warmerDraht: z.warmerDraht || "", postadresse: z.postadresse || "" });
    setBriefGeaendert(false);
  }

  async function laden(still = false) {
    if (!still) setLoading(true);
    try {
      anwenden(await ladeZiel(id));
    } catch (e) {
      toast.error("Ziel konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const vorab = zielAusZwischenspeicher(id);
    if (vorab) {
      anwenden(vorab);
      setLoading(false);
      laden(true);
    } else {
      laden();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const k = useMemo(() => (ziel ? zielKennzahlen(ziel, d.widersprueche, d.einladungen, d.ereignisse) : null), [d, ziel]);

  const spiegel = useMemo(
    () => (d?.widersprueche || []).filter((w) => w.portal === "offen" || w.portal === "gesperrt").sort((a, b) => (a.reihenfolgePortal ?? 99) - (b.reihenfolgePortal ?? 99)),
    [d]
  );
  const antwortenJeFrage = useMemo(() => {
    const m = {};
    for (const a of d?.antworten || []) {
      if (!m[a.nummer]) m[a.nummer] = [];
      m[a.nummer].push(a);
    }
    return m;
  }, [d]);
  const verlauf = useMemo(
    () => [...(d?.ereignisse || [])].sort((a, b) => (ereignisZeit(b)?.getTime() || 0) - (ereignisZeit(a)?.getTime() || 0)),
    [d]
  );

  async function tun(fn, meldung) {
    setBeschaeftigt(true);
    try {
      await fn();
      if (meldung) toast.success(meldung);
      await laden(true);
    } catch (e) {
      toast.error("Das hat nicht geklappt.");
    } finally {
      setBeschaeftigt(false);
    }
  }

  async function status(neu, frage) {
    if (frage && !(await bestaetigen(frage, { aktion: ZIEL_STATUS[neu]?.label || "Weiter" }))) return;
    await tun(() => statusSetzen(ziel, neu), `Status: ${ZIEL_STATUS[neu]?.label}.`);
  }

  async function freigeben() {
    if (!(await bestaetigen("Portal und Brief freigeben? Danach fehlt nur noch der Versand per Post — und dein Häkchen „versendet“. Der Code bleibt bis dahin geschlossen.", { aktion: "Freigeben" }))) return;
    await tun(async () => {
      let haupt = d.einladungen.find((e) => e.art !== "welle");
      if (!haupt) haupt = await einladungAnlegen(ziel, "unternehmen", { empfaengerName: ziel.entscheider?.[0]?.name || "", empfaengerRolle: ziel.entscheider?.[0]?.rolle || "", adresse: ziel.postadresse || "" });
      if (!d.einladungen.find((e) => e.art === "welle")) await einladungAnlegen(ziel, "welle");
      for (const e of [haupt]) {
        if (e.status === "entwurf") await base44.entities.Einladung.update(e.id, { status: "freigegeben", freigegebenAm: new Date().toISOString() });
      }
      await statusSetzen(ziel, "freigegeben", `Code ${haupt.code} freigegeben, noch nicht versendet`);
    }, "Freigegeben. Code ist angelegt, öffnet aber erst nach dem Versand.");
  }

  async function codeAnlegen() {
    await tun(async () => {
      await einladungAnlegen(ziel, "unternehmen", { empfaengerName: ziel.entscheider?.[0]?.name || "", empfaengerRolle: ziel.entscheider?.[0]?.rolle || "", adresse: ziel.postadresse || "" });
      await einladungAnlegen(ziel, "welle");
    }, "Codes angelegt (Entwurf).");
  }

  async function versendetBestaetigen() {
    const e = versand;
    setVersand(null);
    await tun(() => versendetMarkieren(ziel, e, { versandweg, am: new Date(`${versandAm}T12:00:00`).toISOString() }), "Als versendet markiert — der Code ist jetzt 30 Tage gültig.");
  }

  async function briefSpeichern() {
    await tun(async () => {
      await base44.entities.Ziel.update(ziel.id, brief);
    }, "Brief gespeichert.");
  }

  async function notizSpeichern(art = "notiz") {
    if (!notiz.trim()) return;
    const text = notiz.trim();
    setNotiz("");
    await tun(async () => {
      if (art === "anruf") await base44.entities.Ereignis.create({ zielId: ziel.id, art: "anruf", von: "alfons", am: new Date().toISOString(), details: text });
      else await notizSchreiben(ziel, text);
    }, art === "anruf" ? "Anruf notiert." : "Notiz gespeichert.");
  }

  async function loeschen() {
    if (!(await bestaetigen(`Ziel „${ziel.unternehmen}“ löschen? Befund, Widersprüche, Fragen, Antworten, Codes und Verlauf werden mitgelöscht.`))) return;
    await tun(() => zielLoeschen(ziel));
    navigate("/aussenblick");
  }

  if (loading && !ziel) {
    return <div className="v-seite"><div className="v-lade">Lade …</div></div>;
  }
  if (!ziel) {
    return <div className="v-seite"><div className="v-leer">Ziel nicht gefunden.</div></div>;
  }

  const st = ziel.status || "vorgemerkt";
  const haupt = k.haupt;
  const welle = k.welle;
  const bk = ziel.budgetklasse ? BUDGETKLASSE[ziel.budgetklasse] : null;
  const w = ziel.werbung || {};
  const kanaele = [w.meta ? `Meta ${w.meta}` : null, w.google ? `Google ${w.google}` : null, w.linkedin ? `LinkedIn ${w.linkedin}` : null, w.tiktok ? `TikTok ${w.tiktok}` : null].filter(Boolean).join(" · ");

  // Die eine Handlung, die jetzt dran ist — alles andere steht im Menü
  let haupthandlung = null;
  if (st === "vorgemerkt") haupthandlung = <Button onClick={() => status("scan_angefordert")} disabled={beschaeftigt}><RefreshCw /> Scan anfordern</Button>;
  else if (st === "befund") haupthandlung = (
    <>
      <Button variant="outline" onClick={() => status("no_go", "No-go? Es wird kein Portal gebaut. Das Ziel kann später auf Beobachtung gesetzt werden.")} disabled={beschaeftigt}>No-go</Button>
      <Button onClick={() => status("go", "Go? Portal und Brief werden als Nächstes gebaut und dir zur Freigabe vorgelegt. Noch geht nichts hinaus.")} disabled={beschaeftigt}>Go</Button>
    </>
  );
  else if (st === "go") haupthandlung = <Button onClick={() => status("freigabe")} disabled={beschaeftigt}>Portal und Brief liegen vor</Button>;
  else if (st === "freigabe") haupthandlung = <Button onClick={freigeben} disabled={beschaeftigt}><KeyRound /> Freigeben</Button>;
  else if (st === "freigegeben" && haupt) haupthandlung = <Button onClick={() => setVersand(haupt)} disabled={beschaeftigt}><Send /> Als versendet markieren</Button>;
  else if (["versendet", "geoeffnet", "antworten"].includes(st)) haupthandlung = <Button variant="outline" onClick={() => status("erstgespraech")} disabled={beschaeftigt}><Phone /> Erstgespräch vereinbart</Button>;
  else if (st === "erstgespraech") haupthandlung = <Button onClick={() => status("kunde")} disabled={beschaeftigt}>Kunde gewonnen</Button>;
  else if (st === "kunde") haupthandlung = <Button variant="outline" disabled title="Kommt in Schritt 2: legt das Projekt mit den Widersprüchen als Hypothesen an">Interview aus Befund anlegen</Button>;

  return (
    <div className="v-seite">
      <Seitenkopf
        zurueck={{ to: "/aussenblick", label: "Außenblick" }}
        bereich={`Ziel · ${ziel.kuerzel || ""}`}
        titel={ziel.unternehmen}
        versalien={false}
        kontext={[ziel.website, ziel.sitz, ziel.groesse ? `${ziel.groesse} Mitarbeitende` : null, ziel.branche].filter(Boolean).join(" · ")}
        aktionen={
          <>
            <StatusEtikett ton={ZIEL_STATUS[st]?.ton}>{ZIEL_STATUS[st]?.label || st}</StatusEtikett>
            {haupthandlung}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Weitere Aktionen" aria-label="Weitere Aktionen"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Status setzen</DropdownMenuLabel>
                {STATUS_REIHENFOLGE.filter((s) => s !== st && s !== "versendet").map((s) => (
                  <DropdownMenuItem key={s} onClick={() => status(s)}>{ZIEL_STATUS[s].label}</DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => laden()}><RefreshCw className="w-4 h-4" /> Aktualisieren</DropdownMenuItem>
                <DropdownMenuItem onClick={loeschen} className="text-status-critical"><Trash2 className="w-4 h-4" /> Ziel löschen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      {ziel.naechsterSchritt || ZIEL_STATUS[st]?.schritt ? (
        <p className={cn("text-meta", ["befund", "freigabe"].includes(st) ? TON_TEXT.attention : "text-muted-foreground")}>
          Nächster Schritt: {ziel.naechsterSchritt || ZIEL_STATUS[st]?.schritt}
        </p>
      ) : null}

      <Kennzahlleiste werte={[
        kachel("Anzeigen aktiv", k.anzeigen || "—", kanaele || "noch kein Scan"),
        kachel("Budgetklasse", ziel.budgetklasse ? `${ziel.budgetklasse} · ${bk?.label}` : "—", ziel.budgetklasseBegruendung || (bk ? bk.text : "aus Anzeigen, Laufzeit, Kanälen")),
        kachel("Widersprüche", k.gesamt || "—", k.gesamt ? `${k.stark} stark · ${k.imPortal} im Portal` : "noch kein Befund", k.stark >= 3 ? "attention" : undefined),
        kachel("Kundenstimmen", ziel.stimmen?.googleWert ? `${String(ziel.stimmen.googleWert).replace(".", ",")} · ${ziel.stimmen.googleAnzahl || 0}` : "—", "Google-Bewertung · Anzahl"),
        kachel("Portal", haupt ? EINLADUNG_STATUS[haupt.status]?.label : "kein Code", haupt ? (haupt.status === "versendet" ? `${haupt.aufrufe || 0} Aufrufe${haupt.zuletztGeoeffnet ? ` · zuletzt ${relativerTag(alsDatum(haupt.zuletztGeoeffnet))}` : ""}` : `Code ${haupt.code}`) : "kommt mit der Freigabe", haupt?.status === "versendet" ? "done" : undefined),
      ]} />

      <Tabs value={reiter} onValueChange={setReiter}>
        <TabsList>
          <TabsTrigger value="befund">Befund</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="verlauf">Verlauf{verlauf.length ? ` (${verlauf.length})` : ""}</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------------------ Befund */}
        <TabsContent value="befund" className="space-y-5 mt-4">
          <div className="grid lg:grid-cols-3 gap-5">
            <Box className="lg:col-span-2">
              <BoxKopf titel="Kurzeinschätzung" hinweis={ziel.scanAm ? `Scan ${datumKurz(alsDatum(ziel.scanAm), true)}${ziel.scanVon ? ` · ${ziel.scanVon}` : ""}` : undefined} />
              <BoxInhalt>
                {ziel.kurzeinschaetzung ? <MarkdownLeicht text={ziel.kurzeinschaetzung} /> : <p className="text-meta text-muted-foreground">Noch kein Befund — kommt mit dem Scan.</p>}
                {ziel.empfehlung && ziel.empfehlung !== "offen" && (
                  <p className="pt-1"><StatusEtikett ton={ziel.empfehlung === "go" ? "done" : "neutral"}>Empfehlung: {ziel.empfehlung === "go" ? "go" : "no-go"}</StatusEtikett></p>
                )}
              </BoxInhalt>
            </Box>
            <Box>
              <BoxKopf titel="Deine Hypothese" />
              <BoxInhalt>
                <p className="text-body text-foreground">{ziel.ausloeser || "—"}</p>
                <p>
                  <StatusEtikett ton={ziel.hypotheseErgebnis === "bestaetigt" ? "done" : ziel.hypotheseErgebnis === "widerlegt" ? "attention" : ziel.hypotheseErgebnis === "teils" ? "info" : "neutral"}>
                    {ziel.hypotheseErgebnis === "offen" || !ziel.hypotheseErgebnis ? "noch offen" : ziel.hypotheseErgebnis === "teils" ? "teils bestätigt" : ziel.hypotheseErgebnis}
                  </StatusEtikett>
                </p>
                {ziel.wunschzielgruppe && (
                  <div className="pt-1">
                    <p className="text-label uppercase text-muted-foreground">Wunschzielgruppe</p>
                    <p className="text-body text-foreground">{ziel.wunschzielgruppe}</p>
                  </div>
                )}
                {ziel.entscheider?.length > 0 && (
                  <div className="pt-1">
                    <p className="text-label uppercase text-muted-foreground">Entscheider</p>
                    {ziel.entscheider.map((e, i) => <p key={i} className="text-body text-foreground">{e.name}{e.rolle ? ` — ${e.rolle}` : ""}</p>)}
                  </div>
                )}
              </BoxInhalt>
            </Box>
          </div>

          <Box>
            <BoxKopf titel="Widersprüche" zaehler={d.widersprueche.length} hinweis="beide Belege öffentlich, jeder aufrufbar" />
            {d.widersprueche.length === 0 ? (
              <BoxInhalt><p className="text-meta text-muted-foreground">Noch keine — kommen mit dem Befund.</p></BoxInhalt>
            ) : (
              <div className="divide-y">
                {d.widersprueche.map((ws) => {
                  const typ = WIDERSPRUCH_TYP[ws.typ];
                  const auf = !!offen[ws.id];
                  return (
                    <div key={ws.id} className={cn("px-4 py-3 space-y-2", ws.staerke === "stark" && "shadow-[inset_3px_0_0_hsl(var(--status-attention))]")}>
                      <button type="button" onClick={() => setOffen((o) => ({ ...o, [ws.id]: !auf }))} className="w-full flex items-start gap-3 text-left">
                        {auf ? <ChevronDown className="w-4 h-4 mt-1 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />}
                        <span className="text-value tabular-nums text-muted-foreground w-6 shrink-0">{ws.nummer ?? ""}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-object text-foreground">{ws.titel || typ?.label}</span>
                          <span className="block text-label uppercase text-muted-foreground">Typ {typ?.nr} · {typ?.label}</span>
                          <span className="block text-body text-foreground mt-1">{ws.spannung}</span>
                        </span>
                        <span className="flex flex-col sm:flex-row gap-1.5 shrink-0 items-end sm:items-center">
                          <StatusEtikett ton={STAERKE[ws.staerke]?.ton}>{STAERKE[ws.staerke]?.label || ws.staerke}</StatusEtikett>
                          <StatusEtikett ton={PORTAL_STUFE[ws.portal]?.ton}>{PORTAL_STUFE[ws.portal]?.label || "intern"}</StatusEtikett>
                        </span>
                      </button>
                      {auf && (
                        <div className="grid md:grid-cols-2 gap-3 pl-7">
                          <Beleg titel="Beleg A" beleg={ws.belegA} />
                          <Beleg titel="Beleg B" beleg={ws.belegB} />
                          {ws.zeile && <p className="md:col-span-2 text-meta text-muted-foreground">Zeile im Portal: „{ws.zeile}“</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Box>

          <div className="grid lg:grid-cols-2 gap-5">
            <Box>
              <BoxKopf titel="Siegerbotschaft gegen Jüngste" hinweis="aus den Werbebibliotheken" />
              <BoxInhalt>
                {w.siegerbotschaft?.hook || w.juengste?.hook ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {w.siegerbotschaft?.hook && (
                      <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                        <p className="text-label uppercase text-muted-foreground">Läuft am längsten</p>
                        <p className="text-body text-foreground">„{w.siegerbotschaft.hook}“</p>
                        <p className="text-meta text-muted-foreground">seit {w.siegerbotschaft.seit}{w.siegerbotschaft.monate ? ` · ${w.siegerbotschaft.monate} Monate` : ""}{w.siegerbotschaft.varianten ? ` · ${w.siegerbotschaft.varianten} Varianten` : ""}</p>
                        <p className="text-meta text-muted-foreground">{[w.siegerbotschaft.zielgruppe, w.siegerbotschaft.markenname, w.siegerbotschaft.format].filter(Boolean).join(" · ")}</p>
                      </div>
                    )}
                    {w.juengste?.hook && (
                      <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                        <p className="text-label uppercase text-muted-foreground">Jüngste Anzeige</p>
                        <p className="text-body text-foreground">„{w.juengste.hook}“</p>
                        <p className="text-meta text-muted-foreground">seit {w.juengste.seit}{w.juengste.varianten ? ` · ${w.juengste.varianten} Varianten` : ""}</p>
                        <p className="text-meta text-muted-foreground">{[w.juengste.zielgruppe, w.juengste.markenname, w.juengste.format].filter(Boolean).join(" · ")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-meta text-muted-foreground">Noch keine Anzeigen erfasst.</p>
                )}
                {w.pixel?.length > 0 && <p className="text-meta text-muted-foreground">Tracking: {w.pixel.join(", ")}</p>}
              </BoxInhalt>
            </Box>
            <Box>
              <BoxKopf titel="Modul und Hebel" aktion={<ModulPille modul={ziel.modul} />} />
              <BoxInhalt>
                <p className="text-body text-foreground">
                  {ziel.modul ? <strong className="font-semibold">{MODUL[ziel.modul]?.label}</strong> : "Noch nicht zugeordnet"}
                  {ziel.modulZweiterSchritt && <span className="text-muted-foreground"> → danach {MODUL[ziel.modulZweiterSchritt]?.label}</span>}
                </p>
                {ziel.modulBegruendung && <p className="text-meta text-muted-foreground">{ziel.modulBegruendung}</p>}
                {ziel.hebel?.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {ziel.hebel.map((h, i) => (
                      <div key={i}>
                        <p className="text-label uppercase text-muted-foreground">{HEBEL[h.art] || h.art}</p>
                        <p className="text-body text-foreground">{h.text}</p>
                      </div>
                    ))}
                    <p className="text-meta text-muted-foreground">Zahlen dazu liefert nur der Rechner im Portal — mit den Zahlen des Unternehmens.</p>
                  </div>
                )}
              </BoxInhalt>
            </Box>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <Box>
              <BoxKopf titel="Stärken" hinweis="intern" />
              <BoxInhalt><Liste eintraege={ziel.staerken} leer="—" /></BoxInhalt>
            </Box>
            <Box>
              <BoxKopf titel="Lücken" hinweis="intern" />
              <BoxInhalt><Liste eintraege={ziel.schwaechen} leer="—" /></BoxInhalt>
            </Box>
            <Box>
              <BoxKopf titel="Ein Mensch prüft" hinweis="offen" />
              <BoxInhalt>
                <Liste eintraege={ziel.offen} leer="Nichts offen." />
                {(ziel.markennamen?.length > 0 || ziel.zielgruppen?.length > 0) && (
                  <div className="pt-2 space-y-2">
                    {ziel.markennamen?.length > 0 && (
                      <div>
                        <p className="text-label uppercase text-muted-foreground">Markennamen in Umlauf ({ziel.markennamen.length})</p>
                        <p className="text-meta text-foreground">{ziel.markennamen.join(" · ")}</p>
                      </div>
                    )}
                    {ziel.zielgruppen?.length > 0 && (
                      <div>
                        <p className="text-label uppercase text-muted-foreground">Zielgruppen in Umlauf ({ziel.zielgruppen.length})</p>
                        <p className="text-meta text-foreground">{ziel.zielgruppen.join(" · ")}</p>
                      </div>
                    )}
                  </div>
                )}
              </BoxInhalt>
            </Box>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ Portal */}
        <TabsContent value="portal" className="space-y-5 mt-4">
          <Box>
            <BoxKopf
              titel="Einladungscode"
              symbol={KeyRound}
              hinweis="öffnet erst nach deinem Häkchen „versendet“"
              aktion={!haupt ? <Button variant="outline" size="sm" onClick={codeAnlegen} disabled={beschaeftigt}>Codes anlegen (Entwurf)</Button> : null}
            />
            <BoxInhalt>
              {!haupt ? (
                <p className="text-meta text-muted-foreground">Noch kein Code. Er wird mit der Freigabe angelegt — oder jetzt als Entwurf, falls du den Link schon im Brief brauchst.</p>
              ) : (
                <div className="space-y-3">
                  {[haupt, welle].filter(Boolean).map((e) => (
                    <div key={e.id} className="grid md:grid-cols-[1fr_auto] gap-3 items-start rounded-lg border p-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-object text-foreground">{e.code}</span>
                          <StatusEtikett ton={EINLADUNG_STATUS[e.status]?.ton}>{EINLADUNG_STATUS[e.status]?.label}</StatusEtikett>
                          <span className="text-meta text-muted-foreground">{e.art === "welle" ? "Welle: Mitarbeitende und Kunden" : "Unternehmen (Brief)"}</span>
                        </div>
                        <p className="text-meta text-muted-foreground break-all">
                          {portalUrl(e.code)}
                          {e.status === "versendet" && e.gueltigBis ? ` · gültig bis ${datumKurz(alsDatum(e.gueltigBis), true)}` : ""}
                          {e.status === "versendet" ? ` · ${e.aufrufe || 0} Aufrufe` : ""}
                          {e.versendetAm ? ` · versendet ${datumKurz(alsDatum(e.versendetAm), true)} (${e.versandweg})` : ""}
                        </p>
                        {e.empfaengerName && <p className="text-meta text-muted-foreground">an {e.empfaengerName}{e.empfaengerRolle ? `, ${e.empfaengerRolle}` : ""}</p>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button variant="ghost" size="sm" onClick={async () => { (await inZwischenablage(portalUrl(e.code))) ? toast.success("Link kopiert.") : toast.error("Kopieren nicht möglich."); }}><Copy /> Link</Button>
                        <a href={portalVorschauUrl(e.code)} target="_blank" rel="noopener noreferrer" title="Vorschau — die Portalseite kommt in Schritt 2">
                          <Button variant="ghost" size="sm"><ExternalLink /> Vorschau</Button>
                        </a>
                        {e.art !== "welle" && e.status !== "versendet" && (
                          <Button size="sm" onClick={() => setVersand(e)} disabled={beschaeftigt}><Send /> Als versendet markieren</Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-meta text-muted-foreground flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Die Software verschickt nichts. Brief drucken, zur Post bringen, dann hier markieren — erst dann lässt sich der Link öffnen. Die Portalseite selbst (andifragt.at/a/…) kommt in Schritt 2.</p>
                </div>
              )}
            </BoxInhalt>
          </Box>

          <Box>
            <BoxKopf titel="Der Spiegel — was das Unternehmen sieht" zaehler={spiegel.length} hinweis="offen sofort, gesperrt nach zwei Antworten" />
            {spiegel.length === 0 ? (
              <BoxInhalt><p className="text-meta text-muted-foreground">Noch kein Widerspruch fürs Portal freigegeben. In der Befund-Liste je Widerspruch „Im Portal“ oder „Nach 2 Antworten“ setzen.</p></BoxInhalt>
            ) : (
              <div className="divide-y">
                {spiegel.map((ws, i) => (
                  <div key={ws.id} className="px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-value tabular-nums text-muted-foreground">{i + 1}</span>
                      <StatusEtikett ton={PORTAL_STUFE[ws.portal]?.ton}>{PORTAL_STUFE[ws.portal]?.label}</StatusEtikett>
                      <span className="text-meta text-muted-foreground">Typ {WIDERSPRUCH_TYP[ws.typ]?.nr} · {ws.titel}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Karte titel="Karte A" karte={ws.portalA?.text ? ws.portalA : { text: ws.belegA?.text, label: ws.belegA?.fundstelle, url: ws.belegA?.url }} />
                      <Karte titel="Karte B" karte={ws.portalB?.text ? ws.portalB : { text: ws.belegB?.text, label: ws.belegB?.fundstelle, url: ws.belegB?.url }} />
                    </div>
                    {ws.zeile && <p className="text-body text-foreground">{ws.zeile}</p>}
                  </div>
                ))}
              </div>
            )}
          </Box>

          <Box>
            <BoxKopf titel="Die fünf Fragen" zaehler={d.fragen.length} hinweis={d.antworten.length ? `${d.antworten.length} Antworten` : "noch keine Antwort"} />
            {d.fragen.length === 0 ? (
              <BoxInhalt><p className="text-meta text-muted-foreground">Noch keine Fragen — kommen mit dem Befund.</p></BoxInhalt>
            ) : (
              <div className="divide-y">
                {d.fragen.map((f) => (
                  <div key={f.id} className="px-4 py-3 space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-value tabular-nums text-muted-foreground w-5 shrink-0">{f.nummer}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-body text-foreground">{f.text}</p>
                        {f.textWelle && f.textWelle !== f.text && <p className="text-meta text-muted-foreground">Welle: {f.textWelle}</p>}
                        <p className="text-label uppercase text-muted-foreground mt-1">{f.kategorie}{f.hilfetext ? ` · ${f.hilfetext}` : ""}</p>
                      </div>
                    </div>
                    {(antwortenJeFrage[f.nummer] || []).map((a) => (
                      <div key={a.id} className="ml-8 rounded-lg border bg-status-done-surface p-3 space-y-1">
                        <p className="text-meta text-muted-foreground"><StatusEtikett ton="done">{ROLLE[a.rolle] || a.rolle}</StatusEtikett> {a.beantwortetAm ? datumZeit(alsDatum(a.beantwortetAm)) : ""}</p>
                        <p className="text-body text-foreground whitespace-pre-wrap">{a.text}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Box>

          <div className="grid lg:grid-cols-2 gap-5">
            <Box>
              <BoxKopf titel="Rechner" hinweis="Zahlen des Unternehmens, nicht unsere" />
              <BoxInhalt>
                {d.rechner.length === 0 ? (
                  <p className="text-meta text-muted-foreground">Noch nicht benutzt. Wer den Rechner ausfüllt, ist heiß.</p>
                ) : (
                  <div className="space-y-2">
                    {d.rechner.map((r) => (
                      <div key={r.id} className="rounded-lg border p-3 text-meta text-foreground">
                        <p>{datumZeit(alsDatum(r.am || r.created_date))} · Budget {r.budgetMonat} € · {r.anfragen} Anfragen · {r.auftraege} Aufträge</p>
                        <p className="text-muted-foreground">je Anfrage {r.kostenJeAnfrage} € · je Auftrag {r.kostenJeAuftrag} €{r.regler ? ` · Regler ${r.regler.r1}/${r.regler.r2}/${r.regler.r3} %` : ""}</p>
                      </div>
                    ))}
                  </div>
                )}
              </BoxInhalt>
            </Box>
            <Box>
              <BoxKopf titel="Feste Texte im Portal" hinweis={`Ansprache: ${ziel.ansprache === "du" ? "du" : "Sie"}`} />
              <BoxInhalt>
                {ziel.portalTexte && Object.values(ziel.portalTexte).some(Boolean) ? (
                  <div className="space-y-2">
                    {[["einstiegSatz", "Einstieg"], ["einstiegFolgt", "Was folgt"], ["welleText", "Welle"], ["welleWeiterleitung", "Weiterleitungstext"], ["rechnerHebel", "Hebel im Rechner"], ["erstgespraechText", "Erstgespräch"], ["erstgespraechKontakt", "Kontakt"]].map(([key, label]) => ziel.portalTexte[key] ? (
                      <div key={key}>
                        <p className="text-label uppercase text-muted-foreground">{label}</p>
                        <p className="text-body text-foreground">{ziel.portalTexte[key]}</p>
                      </div>
                    ) : null)}
                  </div>
                ) : (
                  <p className="text-meta text-muted-foreground">Kommen mit Phase 4 (Portal bauen).</p>
                )}
              </BoxInhalt>
            </Box>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ Brief */}
        <TabsContent value="brief" className="space-y-5 mt-4">
          <div className="grid lg:grid-cols-3 gap-5">
            <Box className="lg:col-span-2">
              <BoxKopf titel="Brief" symbol={Pencil} hinweis="eine Seite, per Post, Sie-Form" aktion={<Button size="sm" onClick={briefSpeichern} disabled={!briefGeaendert || beschaeftigt}><Save /> Speichern</Button>} />
              <BoxInhalt>
                <Textarea
                  rows={22}
                  value={brief.briefText}
                  onChange={(e) => { setBrief({ ...brief, briefText: e.target.value }); setBriefGeaendert(true); }}
                  placeholder="Kommt mit Phase 5 — oder hier selbst schreiben: Aufhänger, „Ihre Anzeigen haben mich auf fünf Fragen gebracht“, die fünf Fragen, Link und Code, Name und Telefon."
                  className="font-inter text-[14px] leading-relaxed"
                />
              </BoxInhalt>
            </Box>
            <div className="space-y-5">
              <Box>
                <BoxKopf titel="Versand" />
                <BoxInhalt>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-aufhaenger">Aufhänger</Label>
                    <Input id="b-aufhaenger" value={brief.briefAufhaenger} onChange={(e) => { setBrief({ ...brief, briefAufhaenger: e.target.value }); setBriefGeaendert(true); }} placeholder="Nähe, Branche, frühere Anfrage" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-draht">Warmer Draht (zu prüfen)</Label>
                    <Input id="b-draht" value={brief.warmerDraht} onChange={(e) => { setBrief({ ...brief, warmerDraht: e.target.value }); setBriefGeaendert(true); }} placeholder="frühere Anfrage, Messe, LinkedIn" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-adresse">Postadresse</Label>
                    <Textarea id="b-adresse" rows={4} value={brief.postadresse} onChange={(e) => { setBrief({ ...brief, postadresse: e.target.value }); setBriefGeaendert(true); }} />
                  </div>
                  {haupt && (
                    <p className="text-meta text-muted-foreground">Code im Brief: <span className="font-mono text-foreground">{haupt.code}</span> · {portalUrl(haupt.code)}</p>
                  )}
                  {haupt && haupt.status !== "versendet" ? (
                    <Button className="w-full" onClick={() => setVersand(haupt)} disabled={beschaeftigt}><Send /> Als versendet markieren</Button>
                  ) : haupt ? (
                    <p className="text-meta text-status-done-text">Versendet am {datumKurz(alsDatum(haupt.versendetAm), true)} ({haupt.versandweg}).</p>
                  ) : (
                    <p className="text-meta text-muted-foreground">Der Code entsteht mit der Freigabe.</p>
                  )}
                </BoxInhalt>
              </Box>
              <div className="v-hinweis border-l-border">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                <p className="text-meta text-muted-foreground">Per Post, nicht per Mail: Werbe-E-Mails ohne Einwilligung sind in Österreich auch im B2B heikel (TKG). Rechtliche Freigabe vor einem breiten Rollout ist deine Sache. Nach 10 Tagen ohne Öffnung ein kurzer Anruf, kein zweiter Brief.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------ Verlauf */}
        <TabsContent value="verlauf" className="space-y-5 mt-4">
          <Box>
            <BoxKopf titel="Notiz oder Anruf festhalten" />
            <BoxInhalt>
              <Textarea rows={3} value={notiz} onChange={(e) => setNotiz(e.target.value)} placeholder="Was war? Wer hat was gesagt?" />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => notizSpeichern("anruf")} disabled={!notiz.trim() || beschaeftigt}><Phone /> Anruf</Button>
                <Button size="sm" onClick={() => notizSpeichern("notiz")} disabled={!notiz.trim() || beschaeftigt}>Notiz</Button>
              </div>
            </BoxInhalt>
          </Box>
          <Box>
            <BoxKopf titel="Verlauf" zaehler={verlauf.length} hinweis="nichts hier löst einen Kontakt zum Unternehmen aus" />
            {verlauf.length === 0 ? (
              <BoxInhalt><p className="text-meta text-muted-foreground">Noch nichts passiert.</p></BoxInhalt>
            ) : (
              <div className="divide-y">
                {verlauf.map((e) => (
                  <div key={e.id} className="px-4 py-2.5 grid grid-cols-[140px_1fr] gap-3 items-start">
                    <span className="text-meta text-muted-foreground tabular-nums">{datumZeit(ereignisZeit(e))}</span>
                    <div className="min-w-0">
                      <p className="text-body text-foreground">
                        {EREIGNIS_ART[e.art] || e.art}
                        {e.block ? ` · ${e.block}` : ""}
                        {e.dauerSekunden ? ` · ${Math.round(e.dauerSekunden)} s` : ""}
                        <span className="text-muted-foreground"> · {e.von === "alfons" ? "Alfons" : e.von === "unternehmen" ? "Unternehmen" : e.von === "welle" ? "Welle" : "System"}</span>
                      </p>
                      {e.details && <p className="text-meta text-muted-foreground whitespace-pre-wrap">{e.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>
        </TabsContent>

        {/* ------------------------------------------------------------ Register */}
        <TabsContent value="register" className="space-y-5 mt-4">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setRegisterAnsicht("befund")} className={cn("v-chip", registerAnsicht === "befund" && "v-chip-aktiv")}>Befund</button>
            <button type="button" onClick={() => setRegisterAnsicht("register")} className={cn("v-chip", registerAnsicht === "register" && "v-chip-aktiv")}>Faktenregister</button>
            <span className="text-meta text-muted-foreground ml-2">intern — nie ins Portal</span>
          </div>
          <Box>
            <BoxInhalt className="p-5">
              {/* Ein Feld fasst rund 16 KB — längere Register liegen in drei Teilen */}
              <MarkdownLeicht text={registerAnsicht === "befund" ? ziel.befundMarkdown : [ziel.registerMarkdown, ziel.registerMarkdown2, ziel.registerMarkdown3].filter(Boolean).join("\n\n")} />
            </BoxInhalt>
          </Box>
        </TabsContent>
      </Tabs>

      {/* Versand von Hand markieren — der einzige Weg, einen Code scharf zu schalten */}
      <Dialog open={!!versand} onOpenChange={(o) => !o && setVersand(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Brief versendet?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-body text-muted-foreground">Damit wird der Code <span className="font-mono text-foreground">{versand?.code}</span> 30 Tage lang gültig und das Portal lässt sich öffnen. Die Software hat nichts verschickt — das warst du.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Weg</Label>
                <Select value={versandweg} onValueChange={setVersandweg}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="persoenlich">Persönlich übergeben</SelectItem>
                    <SelectItem value="telefon">Am Telefon genannt</SelectItem>
                    <SelectItem value="mail">E-Mail (nur mit Einwilligung)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-am">Am</Label>
                <Input id="v-am" type="date" value={versandAm} onChange={(e) => setVersandAm(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVersand(null)}>Abbrechen</Button>
            <Button onClick={versendetBestaetigen} disabled={beschaeftigt}><Send /> Ja, versendet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
