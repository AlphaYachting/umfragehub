import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FRAGETYP_LABELS, sternchenEntfernen } from "@/lib/interview";

export default function RawData() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [fragen, setFragen] = useState([]);
  const [antworten, setAntworten] = useState([]);
  const [loading, setLoading] = useState(true);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const w = await base44.entities.Welle.get(id);
      setWelle(w);
      const ss = await base44.entities.Session.filter({ wellenId: id });
      setSessions(ss);
      const bs = await base44.entities.Block.filter({ wellenId: id });
      bs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
      const alleF = [];
      for (const b of bs) {
        const fs = await base44.entities.Frage.filter({ blockId: b.id });
        fs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
        alleF.push(...fs);
      }
      setFragen(alleF);
      const alleA = [];
      for (const s of ss) {
        const as = await base44.entities.Antwort.filter({ sessionId: s.id });
        alleA.push(...as);
      }
      setAntworten(alleA);
    } catch (e) {
      toast.error("Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    laden();
  }, [laden]);

  const abgeschlossenCount = sessions.filter((s) => s.status === "abgeschlossen").length;
  const mindest = welle?.mindestTeilnehmer ?? 6;
  const gesperrt = abgeschlossenCount < mindest;

  function antwortWert(a, f) {
    if (!a) return "";
    if (!f) return "";
    if (["skala", "ja_nein", "schieberegler", "gegensatzpaar"].includes(f.typ)) return String(a.zahl ?? "");
    if (f.typ === "matrix") {
      const mw = a.matrixWerte || {};
      return (f.matrixZeilen || []).map((z, i) => `${z}: ${mw[String(i)] ?? ""}`).join(" | ");
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
      const s = sessions.find((x) => x.id === a.sessionId);
      return {
        session_token: s?.token,
        frage_text: sternchenEntfernen(f?.text),
        frage_typ: f?.typ,
        auswahl: a.auswahl,
        zahl: a.zahl,
        matrix_werte: a.matrixWerte || null,
        text: a.text,
        eingabeart: a.eingabeart,
        transkript_korrigiert: a.transkriptKorrigiert,
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
    const headers = ["session_token", "frage", "fragetyp", "auswahl", "zahl", "matrix_werte", "text", "eingabeart", "transkript_korrigiert"];
    const lines = [headers.join(",")];
    for (const a of antworten) {
      const f = fragen.find((x) => x.id === a.frageId);
      const s = sessions.find((x) => x.id === a.sessionId);
      const matrixStr = a.matrixWerte ? Object.entries(a.matrixWerte).map(([k, v]) => `${k}:${v}`).join("; ") : "";
      const row = [
        s?.token || "",
        sternchenEntfernen(f?.text || "").replace(/"/g, '""'),
        f?.typ || "",
        (a.auswahl || []).join("; ").replace(/"/g, '""'),
        a.zahl ?? "",
        matrixStr.replace(/"/g, '""'),
        (a.text || "").replace(/"/g, '""').replace(/\n/g, " "),
        a.eingabeart || "",
        a.transkriptKorrigiert ? "ja" : "nein",
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

  if (loading) return <div className="p-10 text-slate-400 text-sm">Lade Rohdaten…</div>;
  if (!welle) return <div className="p-10 text-slate-400">Welle nicht gefunden.</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <Link to={`/welle/${id}/dashboard`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Zurück zum Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rohdaten</h1>
          <p className="text-sm text-slate-500 mt-1">{welle.name}</p>
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <Lock className="mx-auto mb-3 text-amber-500" size={32} />
          <p className="text-amber-800 font-medium mb-1">
            Zum Schutz der Anonymität sind Einzelantworten erst ab {mindest} abgeschlossenen Interviews einsehbar.
          </p>
          <p className="text-sm text-amber-700">
            Bisher abgeschlossen: {abgeschlossenCount} von {mindest} nötig.
          </p>
          <p className="text-xs text-amber-600 mt-3">
            Kennzahlen (Anzahl, Fortschritt) sind im Dashboard bereits sichtbar.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-slate-600">Session</th>
                <th className="text-left px-3 py-2 font-medium text-slate-600">Frage</th>
                <th className="text-left px-3 py-2 font-medium text-slate-600">Typ</th>
                <th className="text-left px-3 py-2 font-medium text-slate-600">Antwort</th>
                <th className="text-left px-3 py-2 font-medium text-slate-600">Eingabe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {antworten.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-slate-400 py-8">Keine Antworten vorhanden.</td></tr>
              ) : (
                antworten.map((a) => {
                  const f = fragen.find((x) => x.id === a.frageId);
                  const s = sessions.find((x) => x.id === a.sessionId);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-xs text-slate-400 font-mono">{s?.token?.slice(0, 8)}…</td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {f ? sternchenEntfernen(f.text) : <span className="text-slate-400 italic">(Frage gelöscht)</span>}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500">{f ? FRAGETYP_LABELS[f.typ] : ""}</td>
                      <td className="px-3 py-2 text-slate-800 max-w-md">{antwortWert(a, f)}</td>
                      <td className="px-3 py-2 text-xs text-slate-500">{a.eingabeart}</td>
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