import React, { useState, useEffect, useCallback, useMemo } from "react";
import { bestaetigen, eingabe } from "@/components/shared/Bestaetigen";
import { useParams } from "react-router-dom";
import { Copy, BarChart3, Mail, RefreshCw, Save, RotateCw, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  generiereToken,
  geschaetzteDauerMinuten,
  kapitelTitelAnzeige,
  sternchenEntfernen,
} from "@/lib/interview";
import { kachel } from "@/components/verwaltung/Kachel";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import WellenKopf from "@/components/verwaltung/WellenKopf";
import Fortschritt from "@/components/verwaltung/Fortschritt";
import VerlaufChart from "@/components/verwaltung/VerlaufChart";
import {
  wellenKennzahlen,
  wellenHinweis,
  verlaufProTag,
  relativerTag,
  teilnahmeUrl,
  einladungstext,
  inZwischenablage,
  alle,
} from "@/lib/verwaltung";

const TON_RAHMEN = {
  gut: "bg-status-done-surface border-status-done/40 text-status-done-text",
  warnung: "bg-status-attention-surface border-status-attention/30 text-status-attention",
  neutral: "bg-muted border-border text-foreground",
};

export default function WaveDashboard() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bloecke, setBloecke] = useState([]);
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aktualisiert, setAktualisiert] = useState(null);
  const [planEingeladen, setPlanEingeladen] = useState("");
  const [planEndetAm, setPlanEndetAm] = useState("");
  const [planMindest, setPlanMindest] = useState("");
  const [planSpeichert, setPlanSpeichert] = useState(false);

  const laden = useCallback(async (still = false) => {
    if (!still) setLoading(true);
    try {
      const [w, ss, bs] = await Promise.all([
        base44.entities.Welle.get(id),
        alle(base44.entities.Session, { wellenId: id }),
        alle(base44.entities.Block, { wellenId: id }, "reihenfolge"),
      ]);
      bs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
      const [p, ...fragenListen] = await Promise.all([
        base44.entities.Projekt.get(w.projektId),
        ...bs.map((b) => alle(base44.entities.Frage, { blockId: b.id }, "reihenfolge")),
      ]);
      const alleFragen = [];
      fragenListen.forEach((fs) => {
        fs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
        alleFragen.push(...fs);
      });
      setWelle(w);
      setProjekt(p);
      setSessions(ss);
      setBloecke(bs);
      setFragen(alleFragen);
      setPlanEingeladen(w.eingeladen ? String(w.eingeladen) : "");
      setPlanEndetAm(w.endetAm ? String(w.endetAm).slice(0, 10) : "");
      setPlanMindest(String(w.mindestTeilnehmer ?? 6));
      setAktualisiert(new Date());
    } catch (e) {
      toast.error("Verlauf konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    laden();
  }, [laden]);

  const k = useMemo(() => (welle ? wellenKennzahlen(welle, sessions) : null), [welle, sessions]);
  const verlauf = useMemo(() => verlaufProTag(sessions), [sessions]);

  // Wie weit kommen die Befragten? Je Block: Anteil der Teilnahmen, die ihn erreicht haben.
  const trichter = useMemo(() => {
    if (!sessions.length || !fragen.length) return [];
    const index = {};
    fragen.forEach((f, i) => { index[f.id] = i; });
    const position = sessions.map((s) => {
      if (s.status === "abgeschlossen") return fragen.length;
      const i = index[s.letzteFrageId];
      return i === undefined ? -1 : i; // -1 = gestartet, aber noch keine Antwort gespeichert
    });
    let start = 0;
    return bloecke.map((b) => {
      const anzahl = fragen.filter((f) => f.blockId === b.id).length;
      const erste = start;
      start += anzahl;
      // "erreicht" heißt: mindestens die letzte Frage davor beantwortet
      const erreicht = position.filter((pos) => pos >= erste - 1 && (erste === 0 || pos >= 0)).length;
      return {
        id: b.id,
        titel: kapitelTitelAnzeige(b.titel) || b.titel,
        fragen: anzahl,
        erreicht,
        anteil: Math.round((erreicht / sessions.length) * 100),
      };
    }).filter((b) => b.fragen > 0);
  }, [sessions, fragen, bloecke]);

  const abbruchDaten = useMemo(() => fragen.map((f, idx) => {
    const text = sternchenEntfernen(f.text || "");
    return {
      name: `F${idx + 1}`,
      label: text.slice(0, 60) + (text.length > 60 ? "…" : ""),
      abbrueche: sessions.filter((s) => s.status !== "abgeschlossen" && s.letzteFrageId === f.id).length,
    };
  }), [fragen, sessions]);

  async function statusAendern(neu) {
    if (neu === welle.status) return;
    if (neu === "live") {
      if (fragen.length === 0) {
        toast.error("Diese Welle hat noch keine Fragen — bitte zuerst unter „Fragen“ anlegen.");
        return;
      }
      if (!await bestaetigen("Welle freischalten? Der Teilnahmelink funktioniert ab sofort.")) return;
    }
    if (neu === "geschlossen" && !await bestaetigen("Welle schließen? Neue Teilnahmen sind dann nicht mehr möglich.")) return;
    try {
      await base44.entities.Welle.update(id, { status: neu });
      setWelle({ ...welle, status: neu });
      toast.success("Status aktualisiert.");
    } catch (e) {
      toast.error("Aktualisierung fehlgeschlagen.");
    }
  }

  async function planSpeichern() {
    const mindest = Number(planMindest);
    if (!(mindest >= 1)) {
      toast.error("Die Mindestzahl muss mindestens 1 sein.");
      return;
    }
    if (mindest < 5 && !await bestaetigen(`Mindestzahl ${mindest}? Unter 5 Personen lassen sich Antworten leicht einzelnen Menschen zuordnen — die Anonymität ist dann nicht mehr gesichert.`)) return;
    setPlanSpeichert(true);
    try {
      const daten = {
        mindestTeilnehmer: mindest,
        eingeladen: Number(planEingeladen) > 0 ? Number(planEingeladen) : null,
        endetAm: planEndetAm || null,
      };
      try {
        await base44.entities.Welle.update(id, daten);
      } catch (e) {
        // Falls der Server leere Werte nicht annimmt: gesetzte Felder trotzdem speichern
        const gesetzt = Object.fromEntries(Object.entries(daten).filter(([, v]) => v !== null));
        if (Object.keys(gesetzt).length === Object.keys(daten).length) throw e;
        await base44.entities.Welle.update(id, gesetzt);
        setWelle({ ...welle, ...gesetzt });
        toast.error("Gespeichert — ein geleertes Feld ließ sich aber nicht zurücksetzen.");
        return;
      }
      setWelle({ ...welle, ...daten });
      toast.success("Planung gespeichert.");
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setPlanSpeichert(false);
    }
  }

  async function kopiere(text, meldung) {
    const ok = await inZwischenablage(text);
    if (ok) toast.success(meldung);
    else toast.error("Kopieren nicht möglich.");
  }

  async function linkNeuErzeugen() {
    let msg = "Neuen Teilnahmelink erzeugen? Der bisherige Link und der QR-Code funktionieren danach nicht mehr.";
    if (sessions.length > 0) {
      msg += `\n\nEs gibt bereits ${sessions.length} Teilnahmen. Sie bleiben erhalten — wer noch nicht fertig ist, kann aber über den alten Link nicht mehr weitermachen.`;
    }
    if (!await bestaetigen(msg)) return;
    try {
      const linkToken = generiereToken();
      await base44.entities.Welle.update(id, { linkToken });
      setWelle({ ...welle, linkToken });
      toast.success("Neuer Link erzeugt.");
    } catch (e) {
      toast.error("Link konnte nicht erneuert werden.");
    }
  }

  if (loading) return <div className="v-seite v-lade">Lade Verlauf…</div>;
  if (!welle || !k) return <div className="v-seite v-lade">Welle nicht gefunden.</div>;

  const url = teilnahmeUrl(welle.linkToken);
  const hinweis = wellenHinweis(welle, k);
  const dauerBefragung = fragen.length ? geschaetzteDauerMinuten(fragen) : null;
  const planGeaendert =
    planEingeladen !== (welle.eingeladen ? String(welle.eingeladen) : "") ||
    planEndetAm !== (welle.endetAm ? String(welle.endetAm).slice(0, 10) : "") ||
    planMindest !== String(welle.mindestTeilnehmer ?? 6);

  return (
    <div className="v-seite">
      <WellenKopf welle={welle} projekt={projekt} aktiv="dashboard">
        <Button variant="ghost" size="sm" onClick={() => laden(true)} title="Zahlen neu laden">
          <RefreshCw size={15} className="mr-1" /> Aktualisieren
        </Button>
      </WellenKopf>

      {/* Wo steht die Welle */}
      <div className={`border rounded-lg px-5 py-4 ${TON_RAHMEN[hinweis.ton]}`}>
        <div className="text-sm font-medium mb-3">{hinweis.text}</div>
        <Fortschritt k={k} />
      </div>

      <Kennzahlleiste werte={[
        kachel(
          "Abgeschlossen",
          k.abgeschlossen,
          k.ruecklauf !== null ? `${k.ruecklauf} % Rücklauf` : `von ${k.mindest} nötigen`
        ),
        kachel("Begonnen, nicht beendet", k.offen, k.abschlussquote !== null ? `${k.abschlussquote} % schließen ab` : ""),
        kachel("Dauer (Median)", k.medianDauer !== null ? `${k.medianDauer} Min` : "—", dauerBefragung ? `geschätzt ${dauerBefragung} Min` : ""),
        kachel("Letzte Aktivität", relativerTag(k.letzteAktivitaet), k.abgeschlossen7Tage ? `${k.abgeschlossen7Tage} in 7 Tagen` : ""),
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status & Planung */}
        <div className="v-karte">
          <h2 className="v-h2 mb-3">Status &amp; Planung</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={welle.status} onValueChange={statusAendern}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entwurf">Entwurf — Link noch nicht aktiv</SelectItem>
                  <SelectItem value="live">Live — Befragte können teilnehmen</SelectItem>
                  <SelectItem value="geschlossen">Geschlossen — keine neuen Teilnahmen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Eingeladen</Label>
                <Input type="number" min="0" value={planEingeladen} onChange={(e) => setPlanEingeladen(e.target.value)} placeholder="—" />
              </div>
              <div className="space-y-1.5">
                <Label>Mindestzahl</Label>
                <Input type="number" min="1" value={planMindest} onChange={(e) => setPlanMindest(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Läuft bis</Label>
                <Input type="date" value={planEndetAm} onChange={(e) => setPlanEndetAm(e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              „Eingeladen“ ist die Zahl der Personen, die den Link bekommen — daraus ergibt sich der Rücklauf. Ab der
              Mindestzahl werden Einzelantworten sichtbar. Die Frist schließt die Welle nicht automatisch.
            </p>
            <div className="flex justify-end">
              <Button size="sm" onClick={planSpeichern} disabled={planSpeichert || !planGeaendert}>
                <Save size={15} className="mr-1" /> {planSpeichert ? "Speichert…" : "Planung speichern"}
              </Button>
            </div>
          </div>
        </div>

        {/* Link */}
        <div className="v-karte">
          <h2 className="v-h2 mb-3">Teilnahmelink</h2>
          <code className="block text-xs bg-muted px-3 py-2 rounded break-all text-foreground mb-3">{url}</code>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => kopiere(url, "Link kopiert.")}>
              <Copy size={15} className="mr-1" /> Link kopieren
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => kopiere(einladungstext({ welle, projekt, dauerMinuten: dauerBefragung }), "Einladungstext kopiert.")}
            >
              <Mail size={15} className="mr-1" /> Einladungstext kopieren
            </Button>
            {welle.status === "live" && (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost"><ExternalLink size={15} className="mr-1" /> Öffnen</Button>
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Ein Link für alle Befragten dieser Welle — so bleibt die Teilnahme anonym. Vorschau und QR-Code stehen oben rechts.
            {welle.status !== "live" && " Der Link funktioniert erst im Status „Live“."}
          </p>
          <div className="mt-4 pt-3 border-t border-border">
            <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={linkNeuErzeugen}>
              <RotateCw size={15} className="mr-1" /> Neuen Link erzeugen
            </Button>
            <span className="text-xs text-muted-foreground ml-1">macht den bisherigen ungültig</span>
          </div>
        </div>
      </div>

      {/* Verlauf */}
      <div className="v-karte">
        <h2 className="v-h2 mb-3">Verlauf</h2>
        <VerlaufChart daten={verlauf} mindest={k.mindest} />
      </div>

      {/* Trichter je Block */}
      <div className="v-karte">
        <h2 className="v-h2 mb-3">Wie weit kommen die Befragten?</h2>
        <p className="text-xs text-muted-foreground mb-4">Anteil aller begonnenen Teilnahmen, die den jeweiligen Abschnitt erreicht haben.</p>
        {trichter.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {fragen.length === 0 ? "Diese Welle hat noch keine Fragen." : "Noch keine Teilnahmen."}
          </p>
        ) : (
          <div className="space-y-2.5">
            {trichter.map((b) => (
              <div key={b.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_64px] gap-3 items-center text-sm">
                <span className="truncate text-foreground" title={b.titel}>{b.titel}</span>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: `${b.anteil}%` }} />
                </div>
                <span className="text-xs text-muted-foreground text-right whitespace-nowrap">{b.anteil} % · {b.erreicht}</span>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_64px] gap-3 items-center text-sm pt-1 border-t border-border">
              <span className="font-medium text-foreground">Abgeschlossen</span>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-status-done rounded-full" style={{ width: `${k.abschlussquote ?? 0}%` }} />
              </div>
              <span className="text-xs text-muted-foreground text-right whitespace-nowrap">{k.abschlussquote ?? 0} % · {k.abgeschlossen}</span>
            </div>
          </div>
        )}
      </div>

      {/* Abbruch-Analyse */}
      <div className="v-karte">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-muted-foreground" />
          <h2 className="v-h2">Abbrüche je Frage</h2>
        </div>
        {abbruchDaten.every((d) => d.abbrueche === 0) ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Noch keine Abbrüche erfasst.</p>
        ) : (
          <>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={abbruchDaten} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`${v} Abbrüche`, ""]}
                    labelFormatter={(label) => {
                      const item = abbruchDaten.find((d) => d.name === label);
                      return item ? `${label}: ${item.label}` : label;
                    }}
                  />
                  <Bar dataKey="abbrueche" radius={[4, 4, 0, 0]}>
                    {abbruchDaten.map((d, i) => (
                      <Cell key={i} fill={d.abbrueche > 0 ? "#d97706" : "#e5e7eb"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Zeigt, nach welcher Frage nicht beendete Teilnahmen stehen geblieben sind. Wer nur unterbrochen hat und später weitermacht, zählt bis dahin mit.
            </p>
          </>
        )}
      </div>

      {aktualisiert && (
        <p className="text-xs text-muted-foreground mt-4 text-right">
          Stand: {String(aktualisiert.getHours()).padStart(2, "0")}:{String(aktualisiert.getMinutes()).padStart(2, "0")} Uhr
        </p>
      )}
    </div>
  );
}
