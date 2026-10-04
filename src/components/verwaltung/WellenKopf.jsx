import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Seitenkopf from "@/components/shared/Seitenkopf";
import TypPille from "@/components/shared/TypPille";
import StatusBadge from "@/components/verwaltung/StatusBadge";
import LinkAktionen from "@/components/verwaltung/LinkAktionen";

// Gemeinsamer Kopf der vier Sichten einer Welle: Zurück zum Projekt, Name,
// Zielgruppe und Status, Link-Aktionen, darunter die Reiter.
export default function WellenKopf({ welle, projekt, aktiv, children }) {
  const reiter = [
    { key: "dashboard", label: "Verlauf", to: `/welle/${welle.id}/dashboard` },
    { key: "editor", label: "Fragen", to: `/welle/${welle.id}/editor` },
    { key: "einladungen", label: "Einladungen", to: `/welle/${welle.id}/einladungen` },
    { key: "rohdaten", label: "Antworten", to: `/welle/${welle.id}/rohdaten` },
  ];
  return (
    <div className="space-y-4">
      <Seitenkopf
        zurueck={{ to: `/projekt/${welle.projektId}`, label: projekt?.name || "Zum Projekt" }}
        bereich="Welle"
        titel={welle.name}
        versalien={false}
        kontext={
          <span className="inline-flex items-center gap-2 flex-wrap mt-1">
            <TypPille zielgruppe={welle.zielgruppe} />
            <StatusBadge status={welle.status} />
            {projekt?.kundenname && <span>{projekt.kundenname}</span>}
          </span>
        }
        aktionen={<>{children}<LinkAktionen welle={welle} /></>}
      />
      <div className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground max-w-full overflow-x-auto">
        {reiter.map((r) => (
          <Link
            key={r.key}
            to={r.to}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              aktiv === r.key ? "bg-background text-foreground shadow" : "hover:text-foreground"
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
