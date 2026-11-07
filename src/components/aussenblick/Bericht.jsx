import React from "react";
import { CheckCircle2, AlertTriangle, ArrowRight, ChevronDown, ChevronRight, Lightbulb, Scale, Eye, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Box, BoxKopf, BoxInhalt } from "@/components/shared/Box";
import StatusEtikett from "@/components/shared/StatusEtikett";
import ModulPille from "@/components/aussenblick/ModulPille";
import MarkdownLeicht from "@/components/aussenblick/MarkdownLeicht";
import { WIDERSPRUCH_TYP, STAERKE, PORTAL_STUFE, MODUL, HEBEL } from "@/lib/aussenblick";

// Der Bericht eines Ziels, in der Reihenfolge, in der Alfons ihn liest:
//   Was trägt · Was bricht  →  Warum wir das sagen (Belege)  →  Was wir vorschlagen  →  Einschätzung  →  Was wir gesehen haben
// Positiv ist grün, negativ ist orange, jede Behauptung hat zwei Belege nebeneinander und die Spannung als Schluss.

const GRUEN = "shadow-[inset_3px_0_0_hsl(var(--status-done))]";
const ORANGE = "shadow-[inset_3px_0_0_hsl(var(--status-attention))]";

function Punkte({ eintraege, symbol: Symbol, farbe, leer }) {
  if (!eintraege?.length) return <p className="text-meta text-muted-foreground">{leer}</p>;
  return (
    <ul className="space-y-2">
      {eintraege.map((t, i) => (
        <li key={i} className="flex gap-2.5 items-start text-body text-foreground">
          <Symbol className={cn("w-4 h-4 mt-[3px] shrink-0", farbe)} />
          <span className="min-w-0">{t}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------- Was trägt · Was bricht
export function TraegtBricht({ ziel }) {
  const s = ziel?.staerken || [];
  const w = ziel?.schwaechen || [];
  if (!s.length && !w.length) return null;
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Box className={cn("overflow-hidden", GRUEN)}>
        <BoxKopf titel="Was trägt" zaehler={s.length} hinweis="das Positive — darauf bauen wir" />
        <BoxInhalt><Punkte eintraege={s} symbol={CheckCircle2} farbe="text-status-done-text" leer="Noch nichts — kommt mit dem Befund." /></BoxInhalt>
      </Box>
      <Box className={cn("overflow-hidden", ORANGE)}>
        <BoxKopf titel="Was bricht" zaehler={w.length} hinweis="das Negative — hier verliert die Werbung" />
        <BoxInhalt><Punkte eintraege={w} symbol={AlertTriangle} farbe="text-status-attention" leer="Noch nichts — kommt mit dem Befund." /></BoxInhalt>
      </Box>
    </div>
  );
}

// ---------------------------------------------------------------- Belege
function BelegKarte({ kennung, beleg, voll }) {
  if (!beleg) return <div className="rounded-lg border border-dashed p-3 text-meta text-muted-foreground">Beleg {kennung} fehlt</div>;
  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-1.5 min-w-0">
      <p className="text-label uppercase text-muted-foreground">Beleg {kennung}{beleg.stufe ? ` · ${beleg.stufe}` : ""}</p>
      <p className={cn("text-body text-foreground", !voll && "line-clamp-3")}>{beleg.text}</p>
      <p className="text-meta text-muted-foreground flex flex-wrap gap-x-2">
        {beleg.url ? (
          <a href={beleg.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground break-all">{beleg.fundstelle || beleg.url}</a>
        ) : (
          <span>{beleg.fundstelle}</span>
        )}
        {beleg.datum && <span>· {beleg.datum}</span>}
      </p>
    </div>
  );
}

export function Belege({ widersprueche = [], offen = {}, setOffen }) {
  return (
    <Box>
      <BoxKopf titel="Warum wir das sagen" symbol={Scale} zaehler={widersprueche.length} hinweis="jede Behauptung mit zwei Belegen — beide öffentlich aufrufbar" />
      {widersprueche.length === 0 ? (
        <BoxInhalt><p className="text-meta text-muted-foreground">Noch keine Belege — kommen mit dem Befund.</p></BoxInhalt>
      ) : (
        <div className="divide-y">
          {widersprueche.map((ws) => {
            const typ = WIDERSPRUCH_TYP[ws.typ];
            const auf = !!offen[ws.id];
            return (
              <div key={ws.id} className={cn("px-4 py-4 space-y-3", ws.staerke === "stark" && ORANGE)}>
                <div className="flex items-start gap-3">
                  <span className="text-value tabular-nums text-muted-foreground w-6 shrink-0 pt-0.5">{ws.nummer ?? ""}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-object text-foreground">{ws.titel || typ?.label}</p>
                    <p className="text-label uppercase text-muted-foreground">Typ {typ?.nr} · {typ?.label}</p>
                  </div>
                  <span className="flex flex-col sm:flex-row gap-1.5 shrink-0 items-end sm:items-center">
                    <StatusEtikett ton={STAERKE[ws.staerke]?.ton}>{STAERKE[ws.staerke]?.label || ws.staerke}</StatusEtikett>
                    <StatusEtikett ton={PORTAL_STUFE[ws.portal]?.ton}>{PORTAL_STUFE[ws.portal]?.label || "intern"}</StatusEtikett>
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3 pl-9">
                  <BelegKarte kennung="A" beleg={ws.belegA} voll={auf} />
                  <BelegKarte kennung="B" beleg={ws.belegB} voll={auf} />
                </div>
                <div className="pl-9 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-[3px] shrink-0 text-status-attention" />
                  <p className="text-body font-semibold text-foreground">{ws.spannung}</p>
                </div>
                {(ws.zeile || setOffen) && (
                  <div className="pl-9 flex flex-wrap items-center gap-x-4 gap-y-1">
                    {setOffen && (
                      <button type="button" onClick={() => setOffen((o) => ({ ...o, [ws.id]: !auf }))} className="inline-flex items-center gap-1 text-meta text-muted-foreground hover:text-foreground">
                        {auf ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        {auf ? "Belege kürzen" : "Belege ganz lesen"}
                      </button>
                    )}
                    {auf && ws.zeile && <span className="text-meta text-muted-foreground">Zeile im Portal: „{ws.zeile}“</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------- Vorschlag
export function Vorschlag({ ziel }) {
  const modul = MODUL[ziel?.modul];
  const zweiter = MODUL[ziel?.modulZweiterSchritt];
  const hebel = ziel?.hebel || [];
  return (
    <Box className={cn("overflow-hidden", "shadow-[inset_3px_0_0_hsl(var(--primary))]")}>
      <BoxKopf
        titel="Was wir vorschlagen"
        symbol={Lightbulb}
        hinweis="Einstieg, Begründung, Hebel"
        aktion={ziel?.empfehlung && ziel.empfehlung !== "offen" ? (
          <StatusEtikett ton={ziel.empfehlung === "go" ? "done" : "neutral"}>Empfehlung: {ziel.empfehlung === "go" ? "go" : "no-go"}</StatusEtikett>
        ) : undefined}
      />
      <BoxInhalt>
        <div className="flex flex-wrap items-center gap-3">
          <ModulPille modul={ziel?.modul} />
          <p className="text-object text-foreground">
            {modul ? modul.label : "Noch kein Einstieg zugeordnet"}
            {zweiter && <span className="text-muted-foreground font-normal"> → danach {zweiter.label}</span>}
          </p>
        </div>
        {ziel?.blick?.zugriff && <p className="text-body text-foreground">{ziel.blick.zugriff}</p>}
        {ziel?.modulBegruendung && (
          <div className="space-y-1">
            <p className="text-label uppercase text-muted-foreground">Begründung</p>
            <p className="text-body text-foreground">{ziel.modulBegruendung}</p>
          </div>
        )}
        {hebel.length > 0 && (
          <div className="space-y-2">
            <p className="text-label uppercase text-muted-foreground">Hebel — als Logik, ohne Zahl</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {hebel.map((h, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p className="text-value text-foreground">{HEBEL[h.art] || h.art}</p>
                  <p className="text-meta text-foreground">{h.text}</p>
                </div>
              ))}
            </div>
            <p className="text-meta text-muted-foreground">Zahlen dazu liefert nur der Rechner im Portal — mit den Zahlen des Unternehmens.</p>
          </div>
        )}
      </BoxInhalt>
    </Box>
  );
}

// ---------------------------------------------------------------- Einschätzung
export function Einschaetzung({ ziel, scanHinweis }) {
  const hyp = ziel?.hypotheseErgebnis;
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Box className="lg:col-span-2">
        <BoxKopf titel="Einschätzung für dich" symbol={ClipboardCheck} hinweis={scanHinweis} />
        <BoxInhalt>
          {ziel?.kurzeinschaetzung ? <MarkdownLeicht text={ziel.kurzeinschaetzung} /> : <p className="text-meta text-muted-foreground">Noch keine — kommt mit dem Scan.</p>}
        </BoxInhalt>
      </Box>
      <div className="space-y-5">
        <Box>
          <BoxKopf titel="Deine Hypothese" />
          <BoxInhalt>
            <p className="text-body text-foreground">{ziel?.ausloeser || "—"}</p>
            <p>
              <StatusEtikett ton={hyp === "bestaetigt" ? "done" : hyp === "widerlegt" ? "attention" : hyp === "teils" ? "info" : "neutral"}>
                {!hyp || hyp === "offen" ? "noch offen" : hyp === "teils" ? "teils bestätigt" : hyp}
              </StatusEtikett>
            </p>
          </BoxInhalt>
        </Box>
        <Box>
          <BoxKopf titel="Ein Mensch prüft" zaehler={ziel?.offen?.length || 0} />
          <BoxInhalt>
            {ziel?.offen?.length ? (
              <ul className="list-disc pl-5 space-y-1 text-meta text-foreground">{ziel.offen.map((t, i) => <li key={i}>{t}</li>)}</ul>
            ) : (
              <p className="text-meta text-muted-foreground">Nichts offen.</p>
            )}
          </BoxInhalt>
        </Box>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Siegerbotschaft gegen Jüngste
export function Anzeigenpaar({ werbung }) {
  const w = werbung || {};
  if (!w.siegerbotschaft?.hook && !w.juengste?.hook) return null;
  return (
    <Box>
      <BoxKopf titel="Siegerbotschaft gegen Jüngste" symbol={Eye} hinweis="aus den Werbebibliotheken — was trägt, wohin es driftet" />
      <BoxInhalt>
        <div className="grid sm:grid-cols-2 gap-3">
          {w.siegerbotschaft?.hook && (
            <div className={cn("rounded-lg border bg-muted/30 p-3 space-y-1", GRUEN)}>
              <p className="text-label uppercase text-muted-foreground">Läuft am längsten</p>
              <p className="text-body text-foreground">„{w.siegerbotschaft.hook}“</p>
              <p className="text-meta text-muted-foreground">seit {w.siegerbotschaft.seit}{w.siegerbotschaft.monate ? ` · ${w.siegerbotschaft.monate} Monate` : ""}{w.siegerbotschaft.varianten ? ` · ${w.siegerbotschaft.varianten} Varianten` : ""}</p>
              <p className="text-meta text-muted-foreground">{[w.siegerbotschaft.zielgruppe, w.siegerbotschaft.markenname, w.siegerbotschaft.format].filter(Boolean).join(" · ")}</p>
            </div>
          )}
          {w.juengste?.hook && (
            <div className={cn("rounded-lg border bg-muted/30 p-3 space-y-1", ORANGE)}>
              <p className="text-label uppercase text-muted-foreground">Jüngste Anzeige</p>
              <p className="text-body text-foreground">„{w.juengste.hook}“</p>
              <p className="text-meta text-muted-foreground">seit {w.juengste.seit}{w.juengste.varianten ? ` · ${w.juengste.varianten} Varianten` : ""}</p>
              <p className="text-meta text-muted-foreground">{[w.juengste.zielgruppe, w.juengste.markenname, w.juengste.format].filter(Boolean).join(" · ")}</p>
            </div>
          )}
        </div>
        {w.pixel?.length > 0 && <p className="text-meta text-muted-foreground">Tracking: {w.pixel.join(", ")}</p>}
      </BoxInhalt>
    </Box>
  );
}
