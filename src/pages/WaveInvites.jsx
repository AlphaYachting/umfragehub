import React, { useState, useEffect, useCallback, useMemo } from "react";
import { bestaetigen, eingabe } from "@/components/shared/Bestaetigen";
import { useParams } from "react-router-dom";
import { Upload, Send, Bell, Trash2, Eye, Save, FlaskConical, Info } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { kachel } from "@/components/verwaltung/Kachel";
import Kennzahlleiste from "@/components/shared/Kennzahlleiste";
import WellenKopf from "@/components/verwaltung/WellenKopf";
import { alsDatum, datumKurz } from "@/lib/verwaltung";

const MAIL_REGEX = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;

// Eingefügten Text oder CSV in Einträge zerlegen. Je Zeile: eine Adresse und
// optional die Abteilung, getrennt durch Tab, Semikolon oder Komma — in beliebiger
// Reihenfolge. So funktioniert auch das Kopieren von zwei Spalten aus Excel.
export function adressenLesen(text) {
  const eintraege = [];
  const unlesbar = [];
  for (const zeileRoh of String(text || "").split(/\r?\n/)) {
    const zeile = zeileRoh.trim();
    if (!zeile) continue;
    const zellen = zeile.split(/[\t;,]/).map((z) => z.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    // Adresse irgendwo in der Zeile finden — auch in der Form "Anna Muster <anna@kunde.at>"
    const treffer = zeile.match(/[^\s@<>,;"']+@[^\s@<>,;"']+\.[^\s@<>,;"']{2,}/);
    if (!treffer) {
      // Kopfzeilen wie "E-Mail;Abteilung" stillschweigend überspringen
      if (!/mail|abteilung|bereich|name/i.test(zeile)) unlesbar.push(zeile);
      continue;
    }
    const email = treffer[0].toLowerCase();
    // Abteilung = letzte Spalte, die nicht die Adresse enthält
    const rest = zellen.filter((z) => !z.toLowerCase().includes(email));
    eintraege.push({ email, abteilung: rest[rest.length - 1] || "" });
  }
  return { eintraege, unlesbar };
}

const STATUS_TEXT = { neu: "noch nicht eingeladen", eingeladen: "eingeladen", fehler: "Versand fehlgeschlagen" };
const ART_TEXT = { einladung: "Einladung", reminder: "Erinnerung", test: "Test" };

export default function WaveInvites() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [d, setD] = useState(null); // Antwort der Funktion "einladungen/uebersicht"
  const [loading, setLoading] = useState(true);
  const [fehler, setFehler] = useState("");

  const [eingabe, setEingabe] = useState("");
  const [standardAbteilung, setStandardAbteilung] = useState("");
  const [importiert, setImportiert] = useState(false);

  const [vorlage, setVorlage] = useState("einladung"); // welcher Text gerade bearbeitet wird
  const [texte, setTexte] = useState(null);
  const [texteGeaendert, setTexteGeaendert] = useState(false);
  const [vorschau, setVorschau] = useState(null); // { betreff, html }
  const [testAdresse, setTestAdresse] = useState("");

  const [abteilung, setAbteilung] = useState("__alle");
  const [sendet, setSendet] = useState("");
  const [zeigeListe, setZeigeListe] = useState(false);

  const rufe = useCallback(async (aktion, daten = {}) => {
    const res = await base44.functions.invoke("einladungen", {
      aktion,
      wellenId: id,
      basisUrl: window.location.origin,
      ...daten,
    });
    const r = res?.data;
    if (!r) throw new Error("Keine Antwort vom Server.");
    if (r.error) throw new Error(r.error);
    return r;
  }, [id]);

  const laden = useCallback(async (still = false) => {
    if (!still) setLoading(true);
    try {
      const w = await base44.entities.Welle.get(id);
      setWelle(w);
      base44.entities.Projekt.get(w.projektId).then(setProjekt).catch(() => {});
      const r = await rufe("uebersicht");
      setD(r);
      setTexte((alt) => (alt && still ? alt : r.texte));
      setFehler("");
    } catch (e) {
      setFehler(e.message || "Einladungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id, rufe]);

  useEffect(() => {
    laden();
  }, [laden]);

  const gelesen = useMemo(() => adressenLesen(eingabe), [eingabe]);

  function dateiLesen(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEingabe(String(reader.result || ""));
    reader.onerror = () => toast.error("Datei konnte nicht gelesen werden.");
    reader.readAsText(file);
    e.target.value = "";
  }

  async function importieren() {
    if (!gelesen.eintraege.length) {
      toast.error("Keine gültige E-Mail-Adresse gefunden.");
      return;
    }
    setImportiert(true);
    try {
      const r = await rufe("importieren", { eintraege: gelesen.eintraege, standardAbteilung });
      const teile = [`${r.neu} neu`];
      if (r.doppelt) teile.push(`${r.doppelt} schon vorhanden`);
      if (r.ungueltigAnzahl) teile.push(`${r.ungueltigAnzahl} ungültig`);
      toast.success(`Eingespielt: ${teile.join(", ")}.`);
      setEingabe("");
      laden(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setImportiert(false);
    }
  }

  async function adresseEntfernen(e) {
    try {
      await rufe("entfernen", { ids: [e.id] });
      laden(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function alleEntfernen() {
    if (!await bestaetigen(`Alle ${d.zahlen.gesamt} Adressen dieser Welle löschen? Das lässt sich nicht rückgängig machen. Antworten sind davon nicht betroffen.`)) return;
    try {
      await rufe("entfernen", { alleAdressen: true });
      toast.success("Adressliste gelöscht.");
      laden(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function modusAendern(neu) {
    if (neu === d.modus) return;
    if (neu === "persoenlich" && !await bestaetigen(
      "Auf persönliche Links umstellen?\n\nDann bekommt jede Adresse einen eigenen Link, und das System vermerkt, wer begonnen hat. Erinnerungen gehen nur noch an alle anderen. Die Antworten bleiben ohne Bezug zur Adresse — die Startseite sagt den Befragten das aber ehrlich so.\n\nBei Mitarbeiterbefragungen vorher mit Betriebsrat bzw. Kunde abstimmen."
    )) return;
    if (d.zahlen.eingeladen > 0 && !await bestaetigen("Es wurden schon Einladungen verschickt. Bereits verschickte Mails behalten ihren bisherigen Link. Trotzdem umstellen?")) return;
    try {
      await rufe("einstellungen", { einladungsModus: neu });
      toast.success("Einladungsart geändert.");
      setTexte(null);
      setTexteGeaendert(false);
      laden();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function textFeld(feld, wert) {
    setTexte({ ...texte, [feld]: wert });
    setTexteGeaendert(true);
  }

  async function texteSpeichern() {
    try {
      await rufe("einstellungen", texte);
      setTexteGeaendert(false);
      toast.success("Vorlagen gespeichert.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function vorschauZeigen() {
    try {
      const r = await rufe("vorschau", { art: vorlage, entwurf: texte });
      setVorschau(r);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function testSenden() {
    if (!MAIL_REGEX.test(testAdresse.trim())) {
      toast.error("Bitte eine gültige Testadresse eingeben.");
      return;
    }
    setSendet("test");
    try {
      const r = await rufe("senden", { art: "test", vorlage, testAdresse: testAdresse.trim(), entwurf: texte });
      if (r.probelauf) toast.message("Probelauf: Es ist noch kein Versandkanal eingerichtet — es wurde nichts verschickt.");
      else toast.success(`Testmail an ${testAdresse.trim()} verschickt.`);
      laden(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendet("");
    }
  }

  // Versand in Stapeln, bis nichts mehr offen ist
  async function versenden(art) {
    const filter = abteilung === "__alle" ? "" : abteilung;
    const wer = filter ? `Abteilung „${filter}“` : "alle Abteilungen";
    const frage = art === "einladung"
      ? `Einladung jetzt verschicken (${wer})? Es werden nur Adressen angeschrieben, die noch keine Einladung bekommen haben.`
      : d.modus === "persoenlich"
        ? `Erinnerung jetzt verschicken (${wer})? Sie geht nur an Personen, die noch nicht begonnen haben.`
        : `Erinnerung jetzt verschicken (${wer})? Sie geht an alle Eingeladenen — auch an jene, die schon teilgenommen haben.`;
    if (texteGeaendert && !await bestaetigen("Die Vorlagen haben ungespeicherte Änderungen. Verschickt wird der gespeicherte Stand. Trotzdem fortfahren?")) return;
    if (!await bestaetigen(frage)) return;
    setSendet(art);
    const laufStart = new Date().toISOString();
    let gesendet = 0;
    let fehlgeschlagen = 0;
    try {
      for (let runde = 0; runde < 200; runde++) {
        const r = await rufe("senden", { art, abteilung: filter, laufStart });
        if (r.probelauf) {
          toast.message(`Probelauf: ${r.wuerdeSenden} ${r.wuerdeSenden === 1 ? "Mail würde" : "Mails würden"} verschickt${r.beispiele?.length ? `, z. B. an ${r.beispiele.join(", ")}` : ""}. Es ist noch kein Versandkanal eingerichtet.`);
          laden(true);
          return;
        }
        gesendet += r.gesendet;
        fehlgeschlagen += r.fehler;
        if (!r.rest || (r.gesendet === 0 && r.fehler === 0)) break;
      }
      if (gesendet === 0 && fehlgeschlagen === 0) toast.message("Es gab niemanden anzuschreiben.");
      else if (fehlgeschlagen) toast.error(`${gesendet} verschickt, ${fehlgeschlagen} fehlgeschlagen — siehe Adressliste.`);
      else toast.success(`${gesendet} ${gesendet === 1 ? "Mail" : "Mails"} verschickt.`);
    } catch (err) {
      toast.error(`${err.message}${gesendet ? ` (bis dahin ${gesendet} verschickt)` : ""}`);
    } finally {
      setSendet("");
      laden(true);
    }
  }

  if (loading) return <div className="v-seite v-lade">Lade Einladungen…</div>;
  if (!welle) return <div className="v-seite v-lade">Welle nicht gefunden.</div>;

  if (fehler || !d || !texte) {
    return (
      <div className="v-seite">
        <WellenKopf welle={welle} projekt={projekt} aktiv="einladungen" />
        <div className="bg-status-attention-surface border border-status-attention/30 rounded-lg p-5 text-sm text-status-attention">
          Die Einladungsfunktion antwortet nicht: {fehler || "unbekannter Fehler"}
          <div className="mt-3"><Button size="sm" variant="outline" onClick={() => laden()}>Erneut versuchen</Button></div>
        </div>
      </div>
    );
  }

  const z = d.zahlen;
  const pers = d.modus === "persoenlich";
  const istReminder = vorlage === "reminder";
  const betreffFeld = istReminder ? "reminderBetreff" : "mailBetreff";
  const textFeldName = istReminder ? "reminderText" : "mailText";
  const nichtLive = d.wellenStatus !== "live";

  return (
    <div className="v-seite">
      <WellenKopf welle={welle} projekt={projekt} aktiv="einladungen" />

      {/* Versandkanal */}
      {d.kanal.bereit ? (
        <div className="border border-status-done/40 bg-status-done-surface text-status-done-text rounded-lg px-5 py-3 text-sm">
          Versand eingerichtet — Absender: <span className="font-medium">{d.kanal.absender}</span>
        </div>
      ) : (
        <div className="border border-status-attention/30 bg-status-attention-surface text-status-attention rounded-lg px-5 py-3 text-sm flex gap-3">
          <FlaskConical size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-medium">Probelauf:</span> Es ist noch kein Versandkanal eingerichtet. Adressen, Vorlagen und
            Vorschau funktionieren bereits; beim Senden wird nur gezeigt, was verschickt würde — es geht keine Mail hinaus.
          </div>
        </div>
      )}

      <Kennzahlleiste werte={[
        kachel("Adressen", z.gesamt, `${d.abteilungen.length} ${d.abteilungen.length === 1 ? "Abteilung" : "Abteilungen"}`),
        kachel("Eingeladen", z.eingeladen, z.neu ? `${z.neu} noch offen` : z.gesamt ? "alle angeschrieben" : ""),
        kachel(pers ? "Begonnen" : "Erinnerbar", pers ? z.gestartet : z.erinnerbar, pers ? `${z.erinnerbar} noch nicht` : "alle Eingeladenen"),
        kachel("Fehlgeschlagen", z.fehler, z.fehler ? "siehe Adressliste" : ""),
      ]} />

      {/* Einladungsart */}
      <div className="v-karte">
        <h2 className="v-h2 mb-3">Einladungsart</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              key: "gemeinsam",
              titel: "Ein Link für alle",
              text: "Volle Anonymität: niemand weiß, wer teilgenommen hat. Die Erinnerung geht an alle Eingeladenen, mit dem Satz „Falls du schon mitgemacht hast: danke“.",
            },
            {
              key: "persoenlich",
              titel: "Persönlicher Link je Adresse",
              text: "Das System vermerkt, wer begonnen hat; die Erinnerung geht nur an die anderen. Antworten bleiben ohne Bezug zur Adresse. Die Startseite sagt das den Befragten offen.",
            },
          ].map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => modusAendern(o.key)}
              className={`text-left rounded-lg border p-4 transition-colors ${
                d.modus === o.key ? "border-foreground bg-muted" : "border-border hover:border-foreground/25"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-3.5 w-3.5 rounded-full border-2 ${d.modus === o.key ? "border-foreground bg-foreground" : "border-input"}`} />
                <span className="font-medium text-sm">{o.titel}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{o.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Adressen */}
      <div className="v-karte">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="v-h2">Adressen einspielen</h2>
          <label className="cursor-pointer">
            <span className="inline-flex items-center px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted/40">
              <Upload size={15} /> CSV-Datei wählen
            </span>
            <input type="file" accept=".csv,.txt,text/csv,text/plain" className="hidden" onChange={dateiLesen} />
          </label>
        </div>
        <Textarea
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          rows={5}
          placeholder={"Adressen einfügen — eine je Zeile, optional mit Abteilung:\nanna.muster@kunde.at;Außendienst\nmax.beispiel@kunde.at;Innendienst\n\nZwei Spalten aus Excel lassen sich direkt hineinkopieren."}
          className="font-mono text-sm"
        />
        <div className="flex items-end justify-between gap-3 flex-wrap mt-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Abteilung für Zeilen ohne Angabe (optional)</Label>
            <Input value={standardAbteilung} onChange={(e) => setStandardAbteilung(e.target.value)} placeholder="z. B. Außendienst" className="w-64 h-9" />
          </div>
          <div className="flex items-center gap-3">
            {eingabe.trim() && (
              <span className="text-xs text-muted-foreground">
                {gelesen.eintraege.length} {gelesen.eintraege.length === 1 ? "Adresse" : "Adressen"} erkannt
                {gelesen.unlesbar.length > 0 && <span className="text-status-attention"> · {gelesen.unlesbar.length} Zeilen ohne gültige Adresse</span>}
              </span>
            )}
            <Button onClick={importieren} disabled={importiert || !gelesen.eintraege.length}>
              {importiert ? "Spielt ein…" : "Einspielen"}
            </Button>
          </div>
        </div>
        {gelesen.unlesbar.length > 0 && (
          <p className="text-xs text-status-attention mt-2 break-all">Nicht lesbar: {gelesen.unlesbar.slice(0, 5).join(" | ")}{gelesen.unlesbar.length > 5 ? " …" : ""}</p>
        )}

        {z.gesamt > 0 && (
          <div className="mt-5 pt-4 border-t border-border">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="font-medium py-1.5 pr-3">Abteilung</th>
                    <th className="font-medium py-1.5 pr-3">Adressen</th>
                    <th className="font-medium py-1.5 pr-3">Eingeladen</th>
                    {pers && <th className="font-medium py-1.5 pr-3">Begonnen</th>}
                    <th className="font-medium py-1.5">Fehler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {d.abteilungen.map((a) => (
                    <tr key={a.name}>
                      <td className="py-1.5 pr-3 text-foreground">{a.name}</td>
                      <td className="py-1.5 pr-3">{a.gesamt}</td>
                      <td className="py-1.5 pr-3">{a.eingeladen}</td>
                      {pers && (
                        <td className="py-1.5 pr-3">
                          {a.gestartet === null ? <span className="text-muted-foreground" title={`Erst ab ${d.kleingruppe} Personen sichtbar`}>verdeckt</span> : a.gestartet}
                        </td>
                      )}
                      <td className={`py-1.5 ${a.fehler ? "text-status-attention" : "text-muted-foreground"}`}>{a.fehler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pers && (
              <p className="text-xs text-muted-foreground mt-2 flex gap-1.5">
                <Info size={13} className="shrink-0 mt-0.5" />
                Wer begonnen hat, wird nie je Person angezeigt — nur als Zahl, und je Abteilung erst ab {d.kleingruppe} Personen.
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <Button variant="ghost" size="sm" onClick={() => setZeigeListe(!zeigeListe)}>
                {zeigeListe ? "Adressliste ausblenden" : `Adressliste anzeigen (${z.gesamt})`}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-status-critical" onClick={alleEntfernen}>
                <Trash2 size={15} /> Alle Adressen löschen
              </Button>
            </div>
            {zeigeListe && (
              <div className="mt-2 max-h-80 overflow-auto border border-border rounded">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {d.empfaenger.map((e) => (
                      <tr key={e.id} className="hover:bg-muted/40">
                        <td className="px-3 py-1.5 font-mono text-xs text-foreground">{e.email}</td>
                        <td className="px-3 py-1.5 text-xs text-muted-foreground">{e.abteilung || "—"}</td>
                        <td className={`px-3 py-1.5 text-xs ${e.versandStatus === "fehler" ? "text-status-attention" : "text-muted-foreground"}`} title={e.fehlerText}>
                          {STATUS_TEXT[e.versandStatus]}
                          {e.anzahlErinnerungen > 0 ? ` · ${e.anzahlErinnerungen}× erinnert` : ""}
                          {e.versandStatus === "fehler" && e.fehlerText ? ` — ${e.fehlerText.slice(0, 60)}` : ""}
                        </td>
                        <td className="px-2 py-1 text-right">
                          <button type="button" onClick={() => adresseEntfernen(e)} className="text-muted-foreground/50 hover:text-status-critical p-1" title="Adresse entfernen" aria-label={`${e.email} entfernen`}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vorlagen */}
      <div className="v-karte">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="v-h2">Mailvorlagen</h2>
          <div className="inline-flex bg-muted rounded-lg p-1">
            {[["einladung", "Einladung"], ["reminder", "Erinnerung"]].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => setVorlage(k)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${vorlage === k ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Betreff</Label>
            <Input value={texte[betreffFeld] || ""} onChange={(e) => textFeld(betreffFeld, e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Text</Label>
            <Textarea value={texte[textFeldName] || ""} onChange={(e) => textFeld(textFeldName, e.target.value)} rows={9} />
            <p className="text-xs text-muted-foreground">
              Logo, Farben und der Knopf „Zur Befragung“ kommen automatisch aus dem Projekt-Design. Platzhalter:{" "}
              <code>{"{{firma}}"}</code>, <code>{"{{dauer}}"}</code> (Minuten, aus den Fragen berechnet), <code>{"{{frist}}"}</code>,{" "}
              <code>{"{{frist_satz}}"}</code> (ganzer Satz, entfällt ohne Frist).
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={vorschauZeigen}>
                <Eye size={15} /> Vorschau
              </Button>
              <Input value={testAdresse} onChange={(e) => setTestAdresse(e.target.value)} placeholder="Testadresse" className="h-9 w-56" />
              <Button variant="outline" size="sm" onClick={testSenden} disabled={sendet === "test"}>
                <Send size={15} /> {sendet === "test" ? "Sendet…" : "Testmail"}
              </Button>
            </div>
            <Button size="sm" onClick={texteSpeichern} disabled={!texteGeaendert}>
              <Save size={15} /> Vorlagen speichern
            </Button>
          </div>
        </div>
      </div>

      {/* Versand */}
      <div className="v-karte">
        <h2 className="v-h2 mb-3">Versenden</h2>
        {nichtLive && (
          <p className="text-sm text-status-attention bg-status-attention-surface border border-status-attention/30 rounded px-3 py-2 mb-3">
            Die Welle ist nicht live — der Link in der Mail würde noch nicht funktionieren. Bitte zuerst unter „Verlauf“ freischalten.
          </p>
        )}
        <div className="flex items-end gap-3 flex-wrap">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">An</Label>
            <Select value={abteilung} onValueChange={setAbteilung}>
              <SelectTrigger className="w-56 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__alle">Alle Abteilungen</SelectItem>
                {d.abteilungen.map((a) => (
                  <SelectItem key={a.name} value={a.name}>{a.name} ({a.gesamt})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => versenden("einladung")} disabled={!!sendet || nichtLive || z.gesamt === 0}>
            <Send size={15} /> {sendet === "einladung" ? "Sendet…" : "Einladung senden"}
          </Button>
          <Button variant="outline" onClick={() => versenden("reminder")} disabled={!!sendet || nichtLive || z.eingeladen === 0}>
            <Bell size={15} /> {sendet === "reminder" ? "Sendet…" : "Erinnerung senden"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Die Einladung geht nur an Adressen, die noch keine bekommen haben — nachträglich eingespielte Adressen lassen sich also einfach nachschicken.
          {pers
            ? " Die Erinnerung geht nur an Eingeladene, die noch nicht begonnen haben."
            : " Die Erinnerung geht an alle Eingeladenen."}
        </p>

        {d.versandlog.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-2">Bisherige Versandläufe</h3>
            <div className="space-y-1">
              {d.versandlog.map((v) => {
                const zeit = alsDatum(v.zeitpunkt);
                return (
                  <div key={v.id} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-muted-foreground w-20 shrink-0">{zeit ? datumKurz(zeit, true) : ""}</span>
                    <span className="w-20 shrink-0 font-medium">{ART_TEXT[v.art] || v.art}</span>
                    <span className="truncate">
                      {v.kanal === "probelauf"
                        ? `Probelauf — ${v.anzahl} ${v.anzahl === 1 ? "Mail wäre" : "Mails wären"} verschickt worden`
                        : `${v.erfolgreich} verschickt${v.fehlgeschlagen ? `, ${v.fehlgeschlagen} fehlgeschlagen` : ""}`}
                      {v.abteilung ? ` · ${v.abteilung}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!vorschau} onOpenChange={(o) => !o && setVorschau(null)}>
        <DialogContent className="max-w-2xl w-[96vw] h-[88vh] flex flex-col gap-3 p-4">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-base pr-8">Betreff: {vorschau?.betreff}</DialogTitle>
            <DialogDescription className="text-xs">
              So kommt die {istReminder ? "Erinnerung" : "Einladung"} an — mit dem aktuellen, auch ungespeicherten Text.
            </DialogDescription>
          </DialogHeader>
          <iframe
            title="Mailvorschau"
            sandbox=""
            srcDoc={vorschau?.html || ""}
            className="flex-1 min-h-0 w-full rounded-lg border border-border bg-muted"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
