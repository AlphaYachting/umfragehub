import React from "react";
import { WELLE_STATUS, PROJEKT_STATUS } from "@/lib/verwaltung";

// Einheitliche Status-Marke für Wellen und Projekte
export default function StatusBadge({ status, art = "welle", className = "" }) {
  const tabelle = art === "projekt" ? PROJEKT_STATUS : WELLE_STATUS;
  const s = tabelle[status] || { label: status || "—", klasse: "bg-slate-100 text-slate-600", punkt: "bg-slate-300" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${s.klasse} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.punkt}`} />
      {s.label}
    </span>
  );
}
