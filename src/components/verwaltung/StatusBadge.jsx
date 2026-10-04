import React from "react";
import StatusEtikett from "@/components/shared/StatusEtikett";
import { WELLE_STATUS, PROJEKT_STATUS } from "@/lib/verwaltung";
import { WELLE_STATUS_TON, PROJEKT_STATUS_TON } from "@/lib/designTon";

// Status von Welle oder Projekt als Statusetikett — der Ton kommt aus lib/designTon
export default function StatusBadge({ status, art = "welle" }) {
  const projekt = art === "projekt";
  const label = (projekt ? PROJEKT_STATUS : WELLE_STATUS)[status]?.label || status || "—";
  const ton = (projekt ? PROJEKT_STATUS_TON : WELLE_STATUS_TON)[status] || "neutral";
  return <StatusEtikett ton={ton}>{label}</StatusEtikett>;
}
