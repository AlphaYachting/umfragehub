import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StatusBadge from "@/components/verwaltung/StatusBadge";
import LinkAktionen from "@/components/verwaltung/LinkAktionen";
import { ZIELGRUPPE_LABELS } from "@/lib/interview";

// Gemeinsamer Kopf für Editor, Dashboard und Rohdaten einer Welle:
// Brotkrumen, Name, Status, Link-Aktionen und die Reiter zwischen den drei Ansichten.
export default function WellenKopf({ welle, projekt, aktiv, children }) {
  const reiter = [
    { key: "dashboard", label: "Verlauf", to: `/welle/${welle.id}/dashboard` },
    { key: "editor", label: "Fragen", to: `/welle/${welle.id}/editor` },
    { key: "rohdaten", label: "Antworten & Export", to: `/welle/${welle.id}/rohdaten` },
  ];
  return (
    <div className="mb-6">
      <nav className="flex items-center gap-1 text-sm text-slate-500 mb-3 flex-wrap">
        <Link to="/" className="hover:text-slate-800">Projekte</Link>
        <ChevronRight size={14} className="text-slate-300" />
        <Link to={`/projekt/${welle.projektId}`} className="hover:text-slate-800">
          {projekt?.name || "Projekt"}
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-slate-800">{welle.name}</span>
      </nav>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{welle.name}</h1>
            <StatusBadge status={welle.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {projekt?.kundenname ? `${projekt.kundenname} · ` : ""}
            {ZIELGRUPPE_LABELS[welle.zielgruppe] || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {children}
          <LinkAktionen welle={welle} />
        </div>
      </div>
      <div className="flex gap-6 border-b border-slate-200 mt-5">
        {reiter.map((r) => (
          <Link
            key={r.key}
            to={r.to}
            className={`pb-2.5 -mb-px text-sm font-medium border-b-2 transition-colors ${
              aktiv === r.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
