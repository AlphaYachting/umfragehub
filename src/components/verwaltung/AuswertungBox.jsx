import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Pencil, Plus, Trash2, CheckCircle2, Save, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { Box, BoxKopf, BoxInhalt } from "@/components/shared/Box";
import { bestaetigen } from "@/components/shared/Bestaetigen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ZIELGRUPPE_LABELS } from "@/lib/interview";
import { alsDatum, datumKurz } from "@/lib/verwaltung";

// Reiter „Auswertung“ eines Projekts — nur für Admins.
// Die Zahlen rechnet die Funktion „auswertung“ (rein lesend, mit Mindestzahlen).
// Kernaussagen und Themen liegen in der Entität „Auswertung“ und gelten erst
// nach der Freigabe. Für den Kunden sichtbar ist ein eigener, späterer Schritt.
// Diese Ansicht ändert nichts an Interview, Welle, Session oder Antwort.

const TONLAGE = {
  kritisch: { label: "kritisch", klasse: "bg-status-attention-surface text-status-attention" },
  wunsch: { label: "Wunsch", klasse: "bg-status-info-surface text-status-info" },
  konstruktiv: { label: "konstruktiv", klasse: "bg-muted text-foreground" },
  positiv: { label: "positiv", klasse: "bg-status-done-surface text-status-done-text" },
  gemischt: { label: "gemischt", klasse: "bg-muted text-muted-foreground" },
};

const FMT = new Intl.NumberFormat("de-AT", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const zahl = (x) => (x === null || x === undefined || isNaN(x) ? "–" : FMT.format(x));

function bandNamen(it) {
  if (it?.nps) return ["kritisch", "zufrieden", "begeistert"];
  return ["niedrig", "mittel", "hoch"];
}
function bandBereiche(it) {
  if (it?.nps) return ["0 bis 6", "7 bis 8", "9 bis 10"];
  return ["unteres Drittel", "Mitte", "oberes Drittel"];
}

function Chip({ className, children }) {
  return <span className={cn("inline-flex items-center text-[12px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap", className)}>{children}</span>;
}

function Baender({ b, label }) {
  const n = b[0] + b[1] + b[2];
  if (!n) return null;
  return (
    <div role="img" aria-label={label} className="flex h-3.5 rounded overflow-hidden gap-0.5 bg-muted">
      <div className="bg-status-attention" style={{ width: `${(b[0] / n) * 100}%` }} />
      <div className="bg-status-info/30" style={{ width: `${(b[1] / n) * 100}%` }} />
      <div className="bg-status-info" style={{ width: `${(b[2] / n) * 100}%` }} />
    </div>
  );
}

function leererEntwurf() {
  return { kernaussagen: [], themen: [], themenQuelle: "" };
}

export default function AuswertungBox({ projekt }) {
  const [daten, setDaten] = useState(null);
  const [satz, setSatz] = useState(null); // Datensatz der Entität Auswertung
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState(null);
  const [bearbeiten, setBearbeiten] = useState(false);
  const [entwurf, setEntwurf] = useState(leererEntwurf());
  const [speichert, setSpeichert] = useState(false);

  async function laden() {
    setLaedt(true);
    setFehler(null);
    try {
      const [res, saetze] = await Promise.all([
        base44.functions.invoke("auswertung", { projektId: projekt.id }),
        base44.entities.Auswertung.filter({ projektId: projekt.id }, "-created_date", 1),
      ]);
      const d = res?.data;
      if (!d || d.error) throw new Error(d?.error || "keine Daten");
      setDaten(d);
      setSatz(saetze?.[0] || null);
    } catch (e) {
      setFehler("Die Auswertung konnte nicht geladen werden.");
    } finally {
      setLaedt(false);
    }
  }

  useEffect(() => { laden(); }, [projekt.id]);

  const wellenById = useMemo(() => Object.fromEntries((daten?.wellen || []).map((w) => [w.id, w])), [daten]);
  const auswertbar = (daten?.wellen || []).filter((w) => w.auswertbar);
  const zuWenig = (daten?.wellen || []).filter((w) => !w.auswertbar);
  const fertigGesamt = auswertbar.reduce((s, w) => s + w.fertig, 0);
  const team = daten?.gruppen?.find((g) => g.zielgruppe === "mitarbeiter");
  const stimmungItem = daten?.stimmung ? daten.items.find((it) => it.key === daten.stimmung.key) : null;

  // -------------------------------------------------------------------------
  // Ergebnisfassung bearbeiten und freigeben
  // -------------------------------------------------------------------------
  function bearbeitenStarten() {
    setEntwurf({
      kernaussagen: [...(satz?.kernaussagen || [])],
      themen: (satz?.themen || []).map((t) => ({ ...t, jeWelle: { ...(t.jeWelle || {}) } })),
      themenQuelle: satz?.themenQuelle || "",
    });
    setBearbeiten(true);
  }

  async function speichern() {
    setSpeichert(true);
    try {
      const daten2 = {
        kernaussagen: entwurf.kernaussagen.map((s) => s.trim()).filter(Boolean),
        themen: entwurf.themen
          .filter((t) => (t.titel || "").trim())
          .map((t) => ({
            titel: t.titel.trim(),
            tonlage: t.tonlage || "gemischt",
            jeWelle: Object.fromEntries(Object.entries(t.jeWelle || {}).map(([k, v]) => [k, Math.max(0, Number(v) || 0)])),
          })),
        themenQuelle: entwurf.themenQuelle.trim(),
        status: "entwurf",
      };
      const neu = satz
        ? await base44.entities.Auswertung.update(satz.id, daten2)
        : await base44.entities.Auswertung.create({ projektId: projekt.id, vorschlagVon: "manuell", fassung: 0, ...daten2 });
      setSatz({ ...(satz || {}), ...neu, ...daten2 });
      setBearbeiten(false);
      toast.success(satz?.status === "freigegeben" ? "Gespeichert. Die Fassung muss neu freigegeben werden." : "Gespeichert.");
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setSpeichert(false);
    }
  }

  async function freigeben() {
    if (!satz) return;
    if (!await bestaetigen(
      "Diese Fassung freigeben? Damit bestätigst du Kernaussagen und Themen als Ergebnis. Nur die freigegebene Fassung fließt in Präsentation und später ins Kunden-Cockpit. Der Kunde sieht dadurch noch nichts.",
      { aktion: "Freigeben" }
    )) return;
    try {
      const user = await base44.auth.me().catch(() => null);
      const von = user?.full_name || user?.email || "Admin";
      const am = new Date().toISOString();
      const fassung = (satz.fassung || 0) + 1;
      const fassungen = [
        ...(satz.fassungen || []),
        { fassung, am, von, kernaussagen: satz.kernaussagen || [], themen: satz.themen || [] },
      ].slice(-20);
      const aenderung = { status: "freigegeben", fassung, freigegebenAm: am, freigegebenVon: von, fassungen };
      await base44.entities.Auswertung.update(satz.id, aenderung);
      setSatz({ ...satz, ...aenderung });
      toast.success(`Fassung ${fassung} freigegeben.`);
    } catch (e) {
      toast.error("Freigabe fehlgeschlagen.");
    }
  }

  async function kundenSichtbarSetzen(an) {
    if (!satz) return;
    if (an && !await bestaetigen(
      "Für den Kunden sichtbar machen? Das ist für die Zeit nach dem Workshop gedacht. Sichtbar wird nur die zuletzt freigegebene Fassung.",
      { aktion: "Sichtbar machen" }
    )) return;
    try {
      const aenderung = { kundenSichtbar: an, ...(an ? { kundenSichtbarAm: new Date().toISOString() } : {}) };
      await base44.entities.Auswertung.update(satz.id, aenderung);
      setSatz({ ...satz, ...aenderung });
      toast.success(an ? "Für den Kunden vorgemerkt." : "Für den Kunden nicht mehr sichtbar.");
    } catch (e) {
      toast.error("Ändern fehlgeschlagen.");
    }
  }

  // -------------------------------------------------------------------------
  if (laedt && !daten) return <div className="v-leer">Lade Auswertung…</div>;
  if (fehler && !daten) {
    return (
      <div className="v-leer space-y-3">
        <p>{fehler}</p>
        <Button variant="outline" size="sm" onClick={laden}><RefreshCw /> Erneut versuchen</Button>
      </div>
    );
  }
  if (!auswertbar.length) {
    return (
      <div className="v-leer">
        Noch keine Welle hat ihre Mindestzahl erreicht. Die Auswertung erscheint, sobald genug Interviews abgeschlossen sind.
        {zuWenig.length > 0 && <span className="block mt-2">{zuWenig.map((w) => `${w.name}: ${w.fertig} von ${w.mindest}`).join(" · ")}</span>}
      </div>
    );
  }

  const freigegeben = satz?.status === "freigegeben";
  const statusChip = !satz
    ? <Chip className="bg-muted text-muted-foreground">noch leer</Chip>
    : freigegeben
      ? <Chip className="bg-status-done-surface text-status-done-text">Fassung {satz.fassung} freigegeben{satz.freigegebenAm ? ` am ${datumKurz(alsDatum(satz.freigegebenAm), true)}` : ""}</Chip>
      : <Chip className="bg-status-attention-surface text-status-attention">Vorschlag, noch nicht freigegeben</Chip>;

  return (
    <div className="space-y-5">
      {/* Datenbasis */}
      <div className="bg-card border rounded-lg px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-meta text-muted-foreground">
        <span className="text-value text-foreground">{fertigGesamt} abgeschlossene Interviews</span>
        <span>{auswertbar.map((w) => `${w.name} ${w.fertig}`).join(" · ")}</span>
        {zuWenig.length > 0 && <span>unter Mindestzahl, nicht gezählt: {zuWenig.map((w) => w.name).join(", ")}</span>}
        <span>Zahlen erst ab Mindestzahl je Welle</span>
        <span className="ml-auto flex items-center gap-2">
          Stand {datumKurz(alsDatum(daten.stand), true)}, {new Date(daten.stand).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" })}
          <Button variant="ghost" size="sm" onClick={laden} disabled={laedt}><RefreshCw className={cn(laedt && "animate-spin")} /> Neu berechnen</Button>
        </span>
      </div>

      {(!daten.stimmung || daten.stimmung.quelle !== "stimmung") && team && (
        <div className="rounded-lg px-4 py-3 bg-status-attention-surface text-status-attention text-meta">
          {daten.stimmung?.quelle === "weiterempfehlung"
            ? "In diesem Projekt war die Stimmungsfrage aus dem Messkern noch nicht Teil der Interviews. Die Stimmung steht hier für die Weiterempfehlung als Arbeitgeber."
            : "In diesem Projekt gibt es keine Stimmungsfrage im Team-Interview. Mit dem Messkern erscheint hier die Kopfzahl „Wie gern arbeitest du zurzeit hier?“."}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
        {/* Stimmung */}
        <div className="lg:col-span-2 bg-card border-2 border-status-info rounded-lg p-5 space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-value text-foreground">Stimmung</h3>
            {stimmungItem && <span className="text-meta text-muted-foreground">{daten.stimmung.quelle === "stimmung" ? "Wie gern arbeitest du hier" : "Weiterempfehlung als Arbeitgeber"}, {stimmungItem.min} bis {stimmungItem.max}</span>}
          </div>
          {stimmungItem && stimmungItem.jeGruppe.mitarbeiter ? (() => {
            const g = stimmungItem.jeGruppe.mitarbeiter;
            const namen = bandNamen(stimmungItem);
            const bereiche = bandBereiche(stimmungItem);
            const wellenTeam = (team?.wellen || []).filter((wid) => stimmungItem.jeWelle[wid]);
            return (
              <>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-[52px] leading-none font-bold tracking-tight tabular-nums">{zahl(g.mittel)}</span>
                  <span className="text-meta text-muted-foreground">von {stimmungItem.max} · {g.n} Antworten</span>
                </div>
                <p className="text-sm">
                  <strong>{g.baender[2]} {namen[2]}</strong> ({bereiche[2]}) · {g.baender[1]} {namen[1]} ({bereiche[1]}) · <strong className="text-status-attention">{g.baender[0]} {namen[0]}</strong> ({bereiche[0]})
                </p>
                {wellenTeam.length > 1 && (
                  <div className="space-y-2.5">
                    {wellenTeam.map((wid) => {
                      const k = stimmungItem.jeWelle[wid];
                      return (
                        <div key={wid} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)_76px] gap-2.5 items-center text-meta">
                          <span className="truncate">{wellenById[wid]?.name}</span>
                          <Baender b={k.baender} label={`${wellenById[wid]?.name}: ${k.baender[2]} ${namen[2]}, ${k.baender[1]} ${namen[1]}, ${k.baender[0]} ${namen[0]}`} />
                          <span className="text-right text-muted-foreground tabular-nums">{zahl(k.mittel)} · n {k.n}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-[12px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-status-info" />{namen[2]}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-status-info/30" />{namen[1]}</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-status-attention" />{namen[0]}</span>
                </div>
              </>
            );
          })() : (
            <p className="text-meta text-muted-foreground">Keine Stimmungszahl für das Team vorhanden.</p>
          )}
        </div>

        {/* Ergebnisfassung: Kernaussagen */}
        <div className="lg:col-span-3 bg-card border rounded-lg p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-value text-foreground">Was ich dem Kunden sage</h3>
            {statusChip}
          </div>
          {bearbeiten ? (
            <div className="space-y-2">
              {entwurf.kernaussagen.map((s, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-meta text-muted-foreground pt-2 w-4">{i + 1}.</span>
                  <Textarea rows={2} value={s} onChange={(e) => setEntwurf({ ...entwurf, kernaussagen: entwurf.kernaussagen.map((x, j) => (j === i ? e.target.value : x)) })} />
                  <Button variant="ghost" size="icon-sm" aria-label="Kernaussage entfernen" onClick={() => setEntwurf({ ...entwurf, kernaussagen: entwurf.kernaussagen.filter((_, j) => j !== i) })}><Trash2 /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setEntwurf({ ...entwurf, kernaussagen: [...entwurf.kernaussagen, ""] })}><Plus /> Kernaussage</Button>
            </div>
          ) : satz?.kernaussagen?.length ? (
            <ol className="list-decimal pl-5 space-y-2.5 text-[15px] leading-relaxed">
              {satz.kernaussagen.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          ) : (
            <p className="text-meta text-muted-foreground">Noch keine Kernaussagen. Über „Bearbeiten“ anlegen oder von Claude vorschlagen lassen.</p>
          )}
          <div className="mt-auto pt-3 border-t flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12px] text-muted-foreground">
              {satz?.vorschlagVon ? `Vorschlag von ${satz.vorschlagVon}. ` : ""}Gilt erst nach deiner Freigabe. Gilt für Kernaussagen und Themen gemeinsam.
            </span>
            <div className="flex gap-2 flex-wrap">
              {bearbeiten ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setBearbeiten(false)}><X /> Abbrechen</Button>
                  <Button size="sm" onClick={speichern} disabled={speichert}><Save /> {speichert ? "Speichert…" : "Speichern"}</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={bearbeitenStarten}><Pencil /> Bearbeiten</Button>
                  {satz && !freigegeben && (satz.kernaussagen?.length || satz.themen?.length) ? (
                    <Button size="sm" className="bg-status-done-text hover:bg-status-done-text/90 text-white" onClick={freigeben}><CheckCircle2 /> Freigeben</Button>
                  ) : null}
                </>
              )}
            </div>
          </div>
          {satz && (satz.fassung || 0) > 0 && !bearbeiten && (
            <div className="flex items-center justify-between gap-3 flex-wrap rounded-md bg-muted px-3 py-2.5">
              <div className="text-meta">
                <span className="text-foreground font-medium">Für den Kunden sichtbar</span>
                <span className="block text-[12px] text-muted-foreground">
                  Erst nach dem Workshop. Sichtbar wäre Fassung {satz.fassung}. Das Kunden-Cockpit zeigt sie, sobald dort Phase 3 eingebaut ist.
                </span>
              </div>
              <Switch checked={!!satz.kundenSichtbar} onCheckedChange={kundenSichtbarSetzen} aria-label="Für den Kunden sichtbar" />
            </div>
          )}
        </div>
      </div>

      {/* Säulen aus dem Messkern */}
      <Box>
        <BoxKopf titel="Vier Säulen aus dem Messkern" hinweis="Index 0 bis 100 je Bereich" />
        <BoxInhalt>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Bleiben", "Kommen", "Fundament", "Markenwirkung"].map((s) => (
              <div key={s} className="rounded-lg border border-dashed px-4 py-3">
                <p className="text-value text-foreground">{s}</p>
                <p className="text-kpi text-muted-foreground">–</p>
              </div>
            ))}
          </div>
          <p className="text-meta text-muted-foreground">In diesem Projekt nicht verfügbar. Sobald der Messkern Teil eines Interviews mit Mitarbeitenden ist, erscheinen hier die vier Indizes je Bereich.</p>
        </BoxInhalt>
      </Box>

      {/* Zahlen je Zielgruppe und Bereich */}
      {daten.gruppen.map((g) => (
        <ZahlenTabelle key={g.zielgruppe} gruppe={g} items={daten.items.filter((it) => it.jeGruppe[g.zielgruppe])} wellenById={wellenById} />
      ))}

      {/* Stärken, Spannungsfelder, Führung gegen Team */}
      <StaerkenSpannungen daten={daten} />

      {/* Themen */}
      <Themen
        daten={daten}
        satz={satz}
        bearbeiten={bearbeiten}
        entwurf={entwurf}
        setEntwurf={setEntwurf}
        wellenById={wellenById}
        statusChip={statusChip}
        onBearbeiten={bearbeitenStarten}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
function ZahlenTabelle({ gruppe, items, wellenById }) {
  if (!items.length) return null;
  const mehrere = gruppe.wellen.length > 1;
  let letztesKapitel = null;
  return (
    <Box>
      <BoxKopf titel={`${ZIELGRUPPE_LABELS[gruppe.zielgruppe] || gruppe.zielgruppe}: Zahlen${mehrere ? " je Bereich" : ""}`} zaehler={items.length} hinweis={`${gruppe.fertig} Interviews`} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-[12px] text-muted-foreground border-b">
              <th scope="col" className="px-4 py-2 font-medium">Frage</th>
              {mehrere && gruppe.wellen.map((wid) => (
                <th key={wid} scope="col" className="px-3 py-2 font-medium text-right whitespace-nowrap">{wellenById[wid]?.name}</th>
              ))}
              <th scope="col" className="px-4 py-2 font-semibold text-right text-foreground">{mehrere ? "Gesamt" : "Wert"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const zeigeKapitel = it.kapitel && it.kapitel !== letztesKapitel;
              letztesKapitel = it.kapitel;
              const namen = bandNamen(it);
              const ges = it.jeGruppe[gruppe.zielgruppe];
              return (
                <React.Fragment key={it.key}>
                  {zeigeKapitel && (
                    <tr><td colSpan={mehrere ? gruppe.wellen.length + 2 : 2} className="px-4 pt-4 pb-1 text-label uppercase text-muted-foreground">{it.kapitel}</td></tr>
                  )}
                  <tr className="border-b border-border/60 align-top">
                    <th scope="row" className="px-4 py-2.5 text-left font-medium">
                      {it.zeile || it.frage}
                      <span className="block text-[12px] text-muted-foreground font-normal">
                        {it.zeile ? `${it.frage} · ` : ""}Skala {it.min} bis {it.max}{it.links || it.rechts ? ` (${it.links || it.min} bis ${it.rechts || it.max})` : ""} · darunter: {namen[2]}
                      </span>
                    </th>
                    {mehrere && gruppe.wellen.map((wid) => {
                      const k = it.jeWelle[wid];
                      return (
                        <td key={wid} className="px-3 py-2.5 text-right tabular-nums">
                          {k ? (<>{zahl(k.mittel)}<span className="block text-[12px] text-muted-foreground">{k.baender[2]} von {k.n}</span></>) : <span className="text-muted-foreground">·</span>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                      {zahl(ges.mittel)}
                      <span className="block text-[12px] text-muted-foreground font-normal">{ges.baender[2]} von {ges.n}</span>
                      {ges.einigkeit && (
                        <Chip className={cn("mt-1", ges.einigkeit === "einig" ? "bg-status-info-surface text-status-info" : "bg-status-attention-surface text-status-attention")}>
                          {ges.einigkeit === "einig" ? "einig" : "geht auseinander"}
                        </Chip>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-2.5 text-[12px] text-muted-foreground border-t">
        Schnitt auf der Skala der Frage, darunter wie viele im oberen Band liegen. · heißt: zu wenige Antworten in diesem Bereich, nicht ausgewiesen.
      </p>
    </Box>
  );
}

// ---------------------------------------------------------------------------
function StaerkenSpannungen({ daten }) {
  const basis = daten.gruppen.find((g) => g.zielgruppe === "mitarbeiter") || daten.gruppen[0];
  if (!basis) return null;
  const zg = basis.zielgruppe;
  const liste = daten.items.filter((it) => it.jeGruppe[zg]).map((it) => ({ it, k: it.jeGruppe[zg] }));
  const sortiert = [...liste].sort((a, b) => b.k.norm - a.k.norm);
  const anzahl = Math.min(3, Math.floor(sortiert.length / 2) || (sortiert.length ? 1 : 0));
  const staerken = sortiert.slice(0, anzahl);
  const schwach = sortiert.slice(-anzahl).reverse().filter((x) => !staerken.includes(x));
  const auseinander = liste.filter((x) => x.k.einigkeit === "auseinander" && !schwach.includes(x));
  const bereichStreuung = [];
  for (const it of daten.items) {
    for (const [wid, k] of Object.entries(it.jeWelle)) {
      if (k.einigkeit === "auseinander" && basis.wellen.includes(wid) && basis.wellen.length > 1) {
        bereichStreuung.push({ it, wid, k });
      }
    }
  }
  const name = (it) => it.zeile || it.frage;
  const wellenName = (wid) => daten.wellen.find((w) => w.id === wid)?.name || "";
  const vergleich = (daten.vergleich || []).filter((v) => v.deutlich).slice(0, 5);
  const hatFuehrung = daten.gruppen.some((g) => g.zielgruppe === "geschaeftsfuehrung");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Box>
        <BoxKopf titel="Stärken und Spannungsfelder" hinweis={ZIELGRUPPE_LABELS[zg]} />
        <BoxInhalt>
          {staerken.map(({ it, k }) => (
            <div key={`s-${it.key}`} className="flex gap-2.5 text-sm">
              <Chip className="bg-status-info-surface text-status-info h-fit">Stärke</Chip>
              <span>{name(it)}: {zahl(k.mittel)} von {it.max}, {k.baender[2]} von {k.n} im oberen Band</span>
            </div>
          ))}
          {schwach.map(({ it, k }) => (
            <div key={`w-${it.key}`} className="flex gap-2.5 text-sm">
              <Chip className="bg-status-attention-surface text-status-attention h-fit">Spannung</Chip>
              <span>{name(it)}: {zahl(k.mittel)} von {it.max}, {k.baender[0]} von {k.n} im unteren Band</span>
            </div>
          ))}
          {[...auseinander.map(({ it, k }) => ({ it, k, wo: "" })), ...bereichStreuung.map(({ it, k, wid }) => ({ it, k, wo: wellenName(wid) }))].slice(0, 4).map(({ it, k, wo }, i) => (
            <div key={`a-${i}`} className="flex gap-2.5 text-sm">
              <Chip className="bg-status-attention-surface text-status-attention h-fit">Streut</Chip>
              <span>{wo ? `${wo}: ` : ""}{name(it)}: die Meinungen gehen auseinander ({k.baender[2]} hoch, {k.baender[0]} niedrig)</span>
            </div>
          ))}
          {!staerken.length && <p className="text-meta text-muted-foreground">Keine Zahlenfragen ab Mindestzahl.</p>}
        </BoxInhalt>
      </Box>
      <Box>
        <BoxKopf titel="Führung gegen Team" hinweis="gleiche Fragen, Unterschied ab einem Punkt auf der 5er-Skala" />
        <BoxInhalt>
          {!hatFuehrung ? (
            <p className="text-meta text-muted-foreground">In diesem Projekt gab es keine ausgewertete Führungswelle. Mit den Spiegelfragen erscheint hier die Lücke zwischen Einschätzung der Führung und Team.</p>
          ) : !vergleich.length ? (
            <p className="text-meta text-muted-foreground">{(daten.vergleich || []).length ? `Bei ${daten.vergleich.length} gemeinsamen Fragen kein deutlicher Unterschied.` : "Führung und Team hatten keine gemeinsamen Zahlenfragen."}</p>
          ) : vergleich.map((v) => {
            const it = daten.items.find((x) => x.key === v.key);
            const f = it.jeGruppe.geschaeftsfuehrung;
            const t = it.jeGruppe.mitarbeiter;
            return (
              <div key={v.key} className="text-sm">
                <p className="font-medium">{name(it)}</p>
                <p className="text-meta text-muted-foreground">Führung {zahl(f.mittel)} · Team {zahl(t.mittel)} (Skala {it.min} bis {it.max})</p>
              </div>
            );
          })}
        </BoxInhalt>
      </Box>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Themen({ daten, satz, bearbeiten, entwurf, setEntwurf, wellenById, statusChip, onBearbeiten }) {
  const themen = bearbeiten ? entwurf.themen : (satz?.themen || []);
  const basis = satz?.themenBasis || {};
  const spalten = useMemo(() => {
    const ids = new Set(Object.keys(basis));
    for (const t of themen) for (const k of Object.keys(t.jeWelle || {})) ids.add(k);
    if (bearbeiten || !ids.size) {
      const team = daten.gruppen.find((g) => g.zielgruppe === "mitarbeiter") || daten.gruppen[0];
      (team?.wellen || []).forEach((w) => ids.add(w));
    }
    return daten.wellen.filter((w) => ids.has(w.id)).map((w) => w.id);
  }, [themen, basis, daten, bearbeiten]);
  const summe = (t) => Object.values(t.jeWelle || {}).reduce((s, v) => s + (Number(v) || 0), 0);
  const sortiert = bearbeiten ? themen.map((t, i) => ({ t, i })) : [...themen].map((t, i) => ({ t, i })).sort((a, b) => summe(b.t) - summe(a.t));
  const zelle = (v) => (!v ? <span className="text-muted-foreground">–</span> : v === 1 ? <span className="text-muted-foreground" title="nur eine Nennung, nicht ausgewiesen">·</span> : v);
  const basisGesamt = Object.values(basis).reduce((s, v) => s + (Number(v) || 0), 0);
  const offen = daten.freitext?.kapitel?.reduce((s, k) => s + k.gesamt, 0) || 0;

  function themaSetzen(i, feld, wert) {
    setEntwurf({ ...entwurf, themen: entwurf.themen.map((t, j) => (j === i ? { ...t, [feld]: wert } : t)) });
  }
  function anzahlSetzen(i, wid, wert) {
    setEntwurf({ ...entwurf, themen: entwurf.themen.map((t, j) => (j === i ? { ...t, jeWelle: { ...(t.jeWelle || {}), [wid]: wert } } : t)) });
  }

  return (
    <Box>
      <BoxKopf titel="Themen aus offenen Antworten" aktion={statusChip} />
      <BoxInhalt>
        {bearbeiten ? (
          <div className="space-y-1.5">
            <label className="text-meta text-muted-foreground" htmlFor="themen-quelle">Quelle (welche offenen Fragen)</label>
            <Input id="themen-quelle" value={entwurf.themenQuelle} onChange={(e) => setEntwurf({ ...entwurf, themenQuelle: e.target.value })} placeholder="z. B. Was fehlt dir? und Was würdest du als Erstes ändern?" />
          </div>
        ) : satz?.themenQuelle ? (
          <p className="text-meta text-muted-foreground">
            {satz.themenQuelle}{basisGesamt ? ` · ${basisGesamt} haben mindestens eine beantwortet` : ""}
          </p>
        ) : null}

        {!themen.length && !bearbeiten ? (
          <div className="text-meta text-muted-foreground space-y-2">
            <p>Noch keine Themen.{offen ? ` Es liegen ${offen} offene Antworten vor${daten.freitext.kapitel.length ? ` (${daten.freitext.kapitel.slice(0, 4).map((k) => `${k.name} ${k.gesamt}`).join(", ")})` : ""}.` : ""}</p>
            <Button variant="outline" size="sm" onClick={onBearbeiten}><Plus /> Themen anlegen</Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-[12px] text-muted-foreground border-b">
                  <th scope="col" className="px-4 py-2 font-medium">Thema</th>
                  <th scope="col" className="px-3 py-2 font-medium">Tonlage</th>
                  {spalten.map((wid) => (
                    <th key={wid} scope="col" className="px-3 py-2 font-medium text-right whitespace-nowrap">{wellenById[wid]?.name}{basis[wid] ? ` (${basis[wid]})` : ""}</th>
                  ))}
                  <th scope="col" className="px-4 py-2 font-semibold text-right text-foreground">Gesamt{basisGesamt ? ` (${basisGesamt})` : ""}</th>
                  {bearbeiten && <th className="w-10" />}
                </tr>
              </thead>
              <tbody>
                {sortiert.map(({ t, i }) => (
                  <tr key={i} className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left font-medium">
                      {bearbeiten ? <Input value={t.titel || ""} onChange={(e) => themaSetzen(i, "titel", e.target.value)} aria-label="Thema" /> : t.titel}
                    </th>
                    <td className="px-3 py-2">
                      {bearbeiten ? (
                        <Select value={t.tonlage || "gemischt"} onValueChange={(v) => themaSetzen(i, "tonlage", v)}>
                          <SelectTrigger className="w-36 h-9" aria-label="Tonlage"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(TONLAGE).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Chip className={TONLAGE[t.tonlage]?.klasse || TONLAGE.gemischt.klasse}>{TONLAGE[t.tonlage]?.label || t.tonlage}</Chip>
                      )}
                    </td>
                    {spalten.map((wid) => (
                      <td key={wid} className="px-3 py-2 text-right tabular-nums">
                        {bearbeiten
                          ? <Input type="number" min="0" className="w-16 h-9 text-right ml-auto" value={t.jeWelle?.[wid] ?? ""} onChange={(e) => anzahlSetzen(i, wid, e.target.value)} aria-label={`Nennungen ${wellenById[wid]?.name}`} />
                          : zelle(Number(t.jeWelle?.[wid]) || 0)}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right tabular-nums font-semibold">{summe(t)}</td>
                    {bearbeiten && (
                      <td className="pr-3">
                        <Button variant="ghost" size="icon-sm" aria-label="Thema entfernen" onClick={() => setEntwurf({ ...entwurf, themen: entwurf.themen.filter((_, j) => j !== i) })}><Trash2 /></Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {bearbeiten && (
          <Button variant="outline" size="sm" onClick={() => setEntwurf({ ...entwurf, themen: [...entwurf.themen, { titel: "", tonlage: "gemischt", jeWelle: {} }] })}><Plus /> Thema</Button>
        )}
        <p className="text-[12px] text-muted-foreground">
          Zahl = Personen, die das Thema nennen; eine Person kann mehrere Themen nennen. · heißt: nur eine Nennung, wird nicht ausgewiesen. Keine Originalzitate in dieser Ansicht, die stehen in den Rohdaten der Welle.
        </p>
      </BoxInhalt>
    </Box>
  );
}
