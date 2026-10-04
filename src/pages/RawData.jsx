import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import WellenKopf from "@/components/verwaltung/WellenKopf";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FRAGETYP_LABELS, sternchenEntfernen, matrixZeilenMitIds } from "@/lib/interview";

export default function RawData() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [fragen, setFragen] = useState([]);
  const [antworten, setAntworten] = useState([]);
  const [gesperrt, setGesperrt] = useState(true);
  const [abgeschlossenCount, setAbgeschlossenCount] = useState(0);
  const [mindest, setMindest] = useState(6);
  const [loading, setLoading] = useState(true);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const w = await base44.entities.Welle.get(id);
      setWelle(w);
      base44.entities.Projekt.get(w.projektId).then(setProjekt).catch(() => {});
      const res = await base44.functions.invoke("rohdaten", { wellenId: id });
      const d = res?.data;
      if (!d || d.error) {
        toast.error(d?.error || "Daten konnten nicht geladen werden.");
        setLoading(false);
        return;
      }
      setGesperrt(!!d.gesperrt);
      setAbgeschlossenCount(d.abgeschlossen ?? 0);
      setMindest(d.mindest ?? 6);
      setFragen(d.fragen || []);
      setAntworten(d.antworten || []);
    } catch (e) {
      toast.error("Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    laden();
  }, [laden]);

  function antwortWert(a, f) {
    if (!a) return "";
    if (!f) return "";
    if (["skala", "ja_nein", "schieberegler", "gegensatzpaar"].includes(f.typ)) return String(a.zahl ?? "");
    if (f.typ === "matrix") {
      const mw = a.matrixWerte || {};
      return matrixZeilenMitIds(f).map((z) => `${z.text}: ${mw[z.id] ?? ""}`).join(" | ");
    }
    if (f.typ === "freitext") return a.text || "";
    if (a.auswahl && a.auswahl.length) return a.auswahl.join("; ");
    return "";
  }

  function exportJSON() {
    if (gesperrt) {
      toast.error("Export gesperrt — Mindestteilnehmerzahl noch nicht erreicht.");
      return;
    }
    const rows = antworten.map((a) => {
      const f = fragen.find((x) => x.id === a.frageId);
      // Matrix-Werte mit Zeilen-ID und Zeilentext, damit die Auswertung ohne Index auskommt
      const matrixWerte = f?.typ === "matrix" && a.matrixWerte
        ? matrixZeilenMitIds(f).map((z) => ({ zeile_id: z.id, zeile: z.text, wert: a.matrixWerte[z.id] ?? null }))
        : null;
      return {
        session_token: a.session_token,
        frage_schluessel: f?.schluessel || "",
        kernfrage: !!f?.kernfrage,
        kernversion: f?.kernversion || "",
        auswertungstag: f?.auswertungstag || "",
        frage_text: sternchenEntfernen(f?.text),
        frage_typ: f?.typ,
        polaritaet: f?.polaritaet || "neutral",
        auswahl: a.auswahl,
        zahl: a.zahl,
        matrix_werte: matrixWerte,
        text: a.text,
        eingabeart: a.eingabeart,
        transkript_korrigiert: a.transkriptKorrigiert,
        session_abgeschlossen: a.session_abgeschlossen ? "ja" : "nein",
      };
    });
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rohdaten_${welle.name || "welle"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    if (gesperrt) {
      toast.error("Export gesperrt — Mindestteilnehmerzahl noch nicht erreicht.");
      return;
    }
    const headers = ["session_token", "frage_schluessel", "kernfrage", "auswertungstag", "frage", "fragetyp", "auswahl", "zahl", "matrix_werte", "text", "eingabeart", "transkript_korrigiert", "session_abgeschlossen"];
    const lines = [headers.join(",")];
    for (const a of antworten) {
      const f = fragen.find((x) => x.id === a.frageId);
      const matrixStr = f?.typ === "matrix" && a.matrixWerte
        ? matrixZeilenMitIds(f).map((z) => `${z.id}:${a.matrixWerte[z.id] ?? ""}`).join("; ")
        : "";
      const row = [
        a.session_token || "",
        f?.schluessel || "",
        f?.kernfrage ? "ja" : "nein",
        f?.auswertungstag || "",
        sternchenEntfernen(f?.text || "").replace(/"/g, '""'),
        f?.typ || "",
        (a.auswahl || []).join("; ").replace(/"/g, '""'),
        a.zahl ?? "",
        matrixStr.replace(/"/g, '""'),
        (a.text || "").replace(/"/g, '""').replace(/\n/g, " "),
        a.eingabeart || "",
        a.transkriptKorrigiert ? "ja" : "nein",
        a.session_abgeschlossen ? "ja" : "nein",
      ];
      lines.push(row.map((v) => `"${v}"`).join(","));
    }
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rohdaten_${welle.name || "welle"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="v-seite v-lade">Lade Rohdaten…</div>;
  if (!welle) return <div className="v-seite v-lade">Welle nicht gefunden.</div>;

  return (
    <div className="v-seite">
      <WellenKopf welle={welle} projekt={projekt} aktiv="rohdaten" />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="v-h2">Antworten</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {gesperrt
              ? `${abgeschlossenCount} von ${mindest} nötigen Interviews abgeschlossen`
              : `${abgeschlossenCount} abgeschlossene Interviews · ${antworten.length} Antworten`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportJSON} disabled={gesperrt}>
            <Download size={15} className="mr-1" /> JSON
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={gesperrt}>
            <Download size={15} className="mr-1" /> CSV
          </Button>
        </div>
      </div>

      {gesperrt ? (
        <div className="bg-status-attention-surface border border-status-attention/30 rounded-lg p-8 text-center">
          <Lock className="mx-auto mb-3 text-status-attention" size={32} />
          <p className="text-status-attention font-medium mb-1">
            Zum Schutz der Anonymität sind Einzelantworten erst ab {mindest} abgeschlossenen Interviews einsehbar.
          </p>
          <p className="text-sm text-status-attention">
            Bisher abgeschlossen: {abgeschlossenCount} von {mindest} nötig.
          </p>
          <p className="text-xs text-status-attention mt-3">
            Kennzahlen (Anzahl, Fortschritt) sind im <Link to={`/welle/${id}/dashboard`} className="underline">Verlauf</Link> bereits sichtbar.
          </p>
        </div>
      ) : (
        <div className="v-karte-flach overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Session</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Frage</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Typ</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Antwort</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Eingabe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {antworten.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted-foreground py-8">Keine Antworten vorhanden.</td></tr>
              ) : (
                antworten.map((a) => {
                  const f = fragen.find((x) => x.id === a.frageId);
                  return (
                    <tr key={a.id} className="hover:bg-muted/40">
                      <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{a.session_token?.slice(0, 8)}…</td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {f ? sternchenEntfernen(f.text) : <span className="text-muted-foreground italic">(Frage gelöscht)</span>}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{f ? FRAGETYP_LABELS[f.typ] : ""}</td>
                      <td className="px-3 py-2 text-foreground max-w-md">{antwortWert(a, f)}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{a.eingabeart}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}