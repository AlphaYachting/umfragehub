import React, { useEffect, useState } from "react";
import { Copy, ExternalLink, KeyRound, Eye, EyeOff, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Box, BoxKopf, BoxInhalt } from "@/components/shared/Box";
import { bestaetigen } from "@/components/shared/Bestaetigen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { OEFFENTLICHE_URL, inZwischenablage, alsDatum, relativerTag } from "@/lib/verwaltung";

// Kundenzugang eines Projekts: Link mit Passwort zum Kunden-Cockpit (/k/:code).
// Das Cockpit zeigt nur Zählwerte, die Regeln dazu stehen in der Funktion kundenCockpit.

const WOERTER = [
  "Ahornhain", "Bergwiese", "Sonnenkai", "Lindenblatt", "Mohnfeld", "Seeufer", "Kiefernweg",
  "Almrausch", "Birkenhain", "Quellbach", "Wiesental", "Felsgrat", "Kornfeld", "Hafenlicht",
];
const SICHTBAR = [
  ["bereiche", "Bereiche, ab Mindestzahl"],
  ["verlauf", "Verlauf und Erinnerungen"],
  ["zeiten", "Zeiten, nur gesammelt"],
  ["ablauf", "Ablauf und Termine"],
  ["module", "Weitere Module"],
  ["signale", "Signale nach Abschluss"],
];
const MODULNAMEN = {
  team: "Teambefragung", vertrieb: "Vertriebsbefragung", kunden: "Kundenbefragung",
  positionierung: "Positionierung", wiederholung: "Wiederholung in 12 Monaten",
};

function zufall(n) {
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  return arr;
}
function neuerCode() {
  const z = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(zufall(16), (x) => z[x % z.length]).join("");
}
function neuesPasswort() {
  const [a, b] = zufall(2);
  return `${WOERTER[a % WOERTER.length]}-${10 + (b % 90)}`;
}
const cockpitUrl = (code) => `${OEFFENTLICHE_URL}/k/${code}`;

export default function KundenzugangBox({ projekt }) {
  const [zugang, setZugang] = useState(null);
  const [laedt, setLaedt] = useState(true);
  const [zeigen, setZeigen] = useState(false);
  const [termine, setTermine] = useState({ analyseAb: "", workshopTermin: "", kommunikationAb: "" });
  const [speichert, setSpeichert] = useState(false);

  useEffect(() => {
    let aktiv = true;
    (async () => {
      try {
        const liste = await base44.entities.Kundenzugang.filter({ projektId: projekt.id });
        if (!aktiv) return;
        const z = liste[0] || null;
        setZugang(z);
        if (z) setTermine({ analyseAb: z.analyseAb || "", workshopTermin: z.workshopTermin || "", kommunikationAb: z.kommunikationAb || "" });
      } catch (e) {
        toast.error("Kundenzugang konnte nicht geladen werden.");
      } finally {
        if (aktiv) setLaedt(false);
      }
    })();
    return () => { aktiv = false; };
  }, [projekt.id]);

  async function aendern(daten, meldung) {
    try {
      const neu = await base44.entities.Kundenzugang.update(zugang.id, daten);
      setZugang({ ...zugang, ...daten, ...(neu || {}) });
      if (meldung) toast.success(meldung);
    } catch (e) {
      toast.error("Speichern fehlgeschlagen.");
    }
  }

  async function anlegen() {
    try {
      const z = await base44.entities.Kundenzugang.create({
        projektId: projekt.id,
        code: neuerCode(),
        passwort: neuesPasswort(),
        aktiv: true,
        fehlversuche: 0,
        aufrufe: 0,
        interesse: [],
        anzeigen: { bereiche: true, verlauf: true, zeiten: true, ablauf: true, module: true, signale: true },
      });
      setZugang(z);
      setZeigen(true);
      toast.success("Kundenzugang angelegt.");
    } catch (e) {
      toast.error("Kundenzugang konnte nicht angelegt werden.");
    }
  }

  async function passwortNeu() {
    if (!await bestaetigen("Neues Passwort erzeugen? Das bisherige Passwort funktioniert danach nicht mehr.")) return;
    setZeigen(true);
    await aendern({ passwort: neuesPasswort(), fehlversuche: 0, gesperrtBis: new Date(0).toISOString() }, "Neues Passwort erzeugt.");
  }

  async function kopiere(text, meldung) {
    if (await inZwischenablage(text)) toast.success(meldung);
    else toast.error("Kopieren nicht möglich.");
  }

  function zugangsdatenText() {
    return [
      `Dein Befragungs-Cockpit${projekt.kundenname ? ` für ${projekt.kundenname}` : ""}:`,
      cockpitUrl(zugang.code),
      `Passwort: ${zugang.passwort}`,
      "",
      "Dort siehst du jederzeit, wie weit jede Gruppe ist. Antworten einzelner Personen sind für niemanden einsehbar.",
    ].join("\n");
  }

  async function termineSpeichern() {
    setSpeichert(true);
    await aendern(termine, "Termine gespeichert.");
    setSpeichert(false);
  }

  if (laedt) return <div className="v-lade">Lade Kundenzugang…</div>;

  if (!zugang) {
    return (
      <Box>
        <BoxKopf titel="Kundenzugang" />
        <BoxInhalt>
          <p className="text-body text-muted-foreground">
            Eigener Link mit Passwort für den Auftraggeber. Er sieht dort den Rücklauf je Gruppe, Verlauf, Zeiten, den Ablauf und weitere Module. Antworten sieht er nie.
          </p>
          <Button onClick={anlegen}><KeyRound /> Kundenzugang anlegen</Button>
        </BoxInhalt>
      </Box>
    );
  }

  const anzeigen = { bereiche: true, verlauf: true, zeiten: true, ablauf: true, module: true, signale: true, ...(zugang.anzeigen || {}) };
  const geoeffnet = alsDatum(zugang.zuletztGeoeffnet);
  const gesperrt = alsDatum(zugang.gesperrtBis);
  const termineGeaendert =
    termine.analyseAb !== (zugang.analyseAb || "") ||
    termine.workshopTermin !== (zugang.workshopTermin || "") ||
    termine.kommunikationAb !== (zugang.kommunikationAb || "");
  const vorschauBasis = `${window.location.origin}/k/${zugang.code}?vorschau=1`;

  return (
    <div className="space-y-5">
      <Box>
        <BoxKopf
          titel="Kundenzugang"
          hinweis={zugang.aktiv === false ? "ausgeschaltet" : "aktiv"}
          aktion={
            <Switch
              checked={zugang.aktiv !== false}
              onCheckedChange={(v) => aendern({ aktiv: v }, v ? "Kundenzugang eingeschaltet." : "Kundenzugang ausgeschaltet.")}
              aria-label="Kundenzugang aktiv"
            />
          }
        />
        <BoxInhalt className={zugang.aktiv === false ? "opacity-50" : ""}>
          <div className="space-y-2">
            <Label htmlFor="kz-link">Link für den Kunden</Label>
            <div className="flex gap-2 flex-wrap">
              <Input id="kz-link" readOnly value={cockpitUrl(zugang.code)} className="flex-1 min-w-[220px] bg-muted" />
              <Button variant="outline" onClick={() => kopiere(cockpitUrl(zugang.code), "Link kopiert.")}><Copy /> Kopieren</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kz-pw">Passwort</Label>
            <div className="flex gap-2 flex-wrap">
              <Input id="kz-pw" readOnly value={zeigen ? zugang.passwort : "••••••••••••"} className="flex-1 min-w-[180px] bg-muted tracking-wide" />
              <Button variant="outline" onClick={() => setZeigen(!zeigen)}>{zeigen ? <EyeOff /> : <Eye />} {zeigen ? "Verbergen" : "Anzeigen"}</Button>
              <Button variant="outline" onClick={passwortNeu}><KeyRound /> Neu erzeugen</Button>
            </div>
            {gesperrt && gesperrt > new Date() && (
              <p className="text-meta text-status-attention">Nach zu vielen Fehlversuchen kurz gesperrt. Ein neues Passwort hebt die Sperre auf.</p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap pt-1">
            <Button onClick={() => kopiere(zugangsdatenText(), "Zugangsdaten für die Mail kopiert.")}><Copy /> Zugangsdaten kopieren</Button>
            <a href={vorschauBasis} target="_blank" rel="noopener noreferrer">
              <Button variant="outline"><ExternalLink /> Als Kunde ansehen</Button>
            </a>
            <a href={`${vorschauBasis}&phase=abgeschlossen`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline"><ExternalLink /> Vorschau nach Abschluss</Button>
            </a>
          </div>
          <p className="text-meta text-muted-foreground">
            Die Vorschau funktioniert ohne Passwort, solange du angemeldet bist, und zählt nicht als Aufruf.
          </p>
        </BoxInhalt>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Box>
          <BoxKopf titel="Was der Kunde sieht" />
          <BoxInhalt>
            <p className="text-meta text-muted-foreground">Rücklauf je Gruppe ist immer sichtbar.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
              {SICHTBAR.map(([k, t]) => (
                <label key={k} className="flex items-center gap-2.5 text-body cursor-pointer">
                  <Checkbox
                    checked={!!anzeigen[k]}
                    onCheckedChange={(v) => aendern({ anzeigen: { ...anzeigen, [k]: !!v } })}
                  />
                  {t}
                </label>
              ))}
            </div>
          </BoxInhalt>
        </Box>

        <Box>
          <BoxKopf titel="Termine im Ablauf" />
          <BoxInhalt>
            <p className="text-meta text-muted-foreground">Freier Text, zum Beispiel „ab 9.11.“ oder „am Do 26.11., 9 Uhr“. Leer lassen zeigt „Termin folgt“.</p>
            {[
              ["analyseAb", "andi weiß: Analyse", "ab 9.11."],
              ["workshopTermin", "andi macht: Workshop", "am Do 26.11., 9 Uhr"],
              ["kommunikationAb", "andi zeigt: Kommunikation", "ab Dezember"],
            ].map(([k, l, p]) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={`kz-${k}`}>{l}</Label>
                <Input id={`kz-${k}`} value={termine[k]} placeholder={p} onChange={(e) => setTermine({ ...termine, [k]: e.target.value })} />
              </div>
            ))}
            <Button onClick={termineSpeichern} disabled={!termineGeaendert || speichert}><Save /> Termine speichern</Button>
          </BoxInhalt>
        </Box>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Box>
          <BoxKopf titel="Aufrufe" />
          <BoxInhalt>
            <p className="text-kpi">{zugang.aufrufe || 0}</p>
            <p className="text-meta text-muted-foreground">{geoeffnet ? `zuletzt ${relativerTag(geoeffnet)}` : "noch nie geöffnet"}</p>
          </BoxInhalt>
        </Box>
        <Box>
          <BoxKopf titel="Vorgemerktes Interesse" zaehler={(zugang.interesse || []).length} />
          <BoxInhalt>
            {(zugang.interesse || []).length === 0 ? (
              <p className="text-meta text-muted-foreground">Noch nichts vorgemerkt. Jede Vormerkung kommt zusätzlich als Mail an office@rittler.co.</p>
            ) : (
              <ul className="space-y-1.5">
                {zugang.interesse.map((i) => (
                  <li key={i.modul} className="flex justify-between gap-3 text-body">
                    <span className="font-medium">{MODULNAMEN[i.modul] || i.modul}</span>
                    <span className="text-muted-foreground">{relativerTag(alsDatum(i.am))}</span>
                  </li>
                ))}
              </ul>
            )}
          </BoxInhalt>
        </Box>
      </div>
    </div>
  );
}
