import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, BarChart3 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { dauerInMinuten } from "@/lib/interview";

const STATUS_LABELS = {
  entwurf: "Entwurf",
  live: "Live",
  geschlossen: "Geschlossen",
};

export default function WaveDashboard() {
  const { id } = useParams();
  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bloecke, setBloecke] = useState([]);
  const [fragen, setFragen] = useState([]);
  const [loading, setLoading] = useState(true);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const w = await base44.entities.Welle.get(id);
      setWelle(w);
      const p = await base44.entities.Projekt.get(w.projektId);
      setProjekt(p);
      const ss = await base44.entities.Session.filter({ wellenId: id });
      setSessions(ss);
      const bs = await base44.entities.Block.filter({ wellenId: id });
      bs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
      setBloecke(bs);
      const alleFragen = [];
      for (const b of bs) {
        const fs = await base44.entities.Frage.filter({ blockId: b.id });
        fs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
        alleFragen.push(...fs);
      }
      setFragen(alleFragen);
    } catch (e) {
      toast.error("Dashboard konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    laden();
  }, [laden]);

  async function statusAendern(neu) {
    try {
      await base44.entities.Welle.update(id, { status: neu });
      setWelle({ ...welle, status: neu });
      toast.success("Status aktualisiert.");
    } catch (e) {
      toast.error("Aktualisierung fehlgeschlagen.");
    }
  }

  function linkKopieren() {
    const url = `${window.location.origin}/i/${welle.linkToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Link kopiert.");
  }

  if (loading) return <div className="p-10 text-slate-400 text-sm">Lade Dashboard…</div>;
  if (!welle) return <div className="p-10 text-slate-400">Welle nicht gefunden.</div>;

  const teilnahmeUrl = `${window.location.origin}/i/${welle.linkToken}`;
  const gestartet = sessions.length;
  const abgeschlossen = sessions.filter((s) => s.status === "abgeschlossen").length;
  const quote = gestartet > 0 ? Math.round((abgeschlossen / gestartet) * 100) : 0;
  const dauerWerte = sessions
    .filter((s) => s.status === "abgeschlossen" && s.startedAt && s.completedAt)
    .map((s) => dauerInMinuten(s.startedAt, s.completedAt));
  const durchschnittDauer = dauerWerte.length > 0
    ? Math.round((dauerWerte.reduce((a, b) => a + b, 0) / dauerWerte.length) * 10) / 10
    : 0;

  // Abbruch-Analyse: für jede Frage zählen, wie viele Sessions dort stehen geblieben sind (nicht abgeschlossen)
  const abbruchDaten = fragen.map((f, idx) => {
    const abbrueche = sessions.filter(
      (s) => s.status !== "abgeschlossen" && s.letzteFrageId === f.id
    ).length;
    return {
      name: `F${idx + 1}`,
      label: (f.text || "").slice(0, 40) + ((f.text || "").length > 40 ? "…" : ""),
      abbrueche,
    };
  });
  const maxAbbruch = Math.max(1, ...abbruchDaten.map((d) => d.abbrueche));

  const kachel = (label, wert, einheit) => (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">
        {wert}<span className="text-sm font-normal text-slate-400 ml-1">{einheit}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <Link to={`/projekt/${welle.projektId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Zurück zum Projekt
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mb-1">{welle.name}</h1>
      <p className="text-sm text-slate-500 mb-6">Wellen-Dashboard</p>

      {/* Teilnahmelink & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold mb-3">Teilnahmelink</h2>
          <div className="flex items-center gap-2 mb-3">
            <code className="flex-1 text-xs bg-slate-50 px-3 py-2 rounded truncate">{teilnahmeUrl}</code>
            <Button size="sm" variant="outline" onClick={linkKopieren}><Copy size={14} className="mr-1" /> Kopieren</Button>
          </div>
          <a href={teilnahmeUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost"><ExternalLink size={14} className="mr-1" /> Im neuen Tab öffnen</Button>
          </a>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-32 border border-slate-100 rounded flex items-center justify-center p-1">
              <QRCodeSVG value={teilnahmeUrl} size={120} level="M" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold mb-3">Status</h2>
          <div className="space-y-3">
            <Select value={welle.status} onValueChange={statusAendern}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entwurf">Entwurf</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="geschlossen">Geschlossen</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              {welle.status === "entwurf" && "Die Welle ist im Entwurf — der Link ist noch nicht aktiv."}
              {welle.status === "live" && "Die Welle ist live — Teilnehmer können das Interview durchlaufen."}
              {welle.status === "geschlossen" && "Die Welle ist geschlossen — keine neuen Teilnehmer mehr."}
            </p>
          </div>
          <Link to={`/welle/${id}/editor`} className="block mt-4">
            <Button variant="outline" size="sm" className="w-full">Zum Editor</Button>
          </Link>
          <Link to={`/welle/${id}/rohdaten`} className="block mt-2">
            <Button variant="outline" size="sm" className="w-full">Rohdaten & Export</Button>
          </Link>
        </div>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {kachel("Gestartete Sessions", gestartet, "")}
        {kachel("Abgeschlossene Sessions", abgeschlossen, "")}
        {kachel("Abschlussquote", quote, "%")}
        {kachel("Ø Dauer", durchschnittDauer, "Min")}
      </div>

      {/* Abbruch-Analyse */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-slate-400" />
          <h2 className="font-semibold">Abbruch-Analyse</h2>
        </div>
        {abbruchDaten.every((d) => d.abbrueche === 0) ? (
          <p className="text-sm text-slate-400 py-6 text-center">Noch keine Abbrüche erfasst.</p>
        ) : (
          <>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={abbruchDaten} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v) => [`${v} Abbrüche`, ""]}
                    labelFormatter={(label) => {
                      const item = abbruchDaten.find((d) => d.name === label);
                      return item ? item.label : label;
                    }}
                  />
                  <Bar dataKey="abbrueche" radius={[4, 4, 0, 0]}>
                    {abbruchDaten.map((d, i) => (
                      <Cell key={i} fill={d.abbrueche > 0 ? "#ff3764" : "#e5e7eb"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Zeigt, bei welcher Frage Teilnehmer am häufigsten abbrechen (letzte erreichte Frage).
            </p>
          </>
        )}
      </div>
    </div>
  );
}