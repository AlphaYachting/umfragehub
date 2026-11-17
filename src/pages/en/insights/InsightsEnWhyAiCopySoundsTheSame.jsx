import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/whyAiCopySoundsTheSame";

// /en/insights/why-ai-copy-sounds-the-same: English version of /wissen/ki-texte-klingen-gleich. Own page so Base44 can set title and description.
export default function InsightsEnWhyAiCopySoundsTheSame() {
  return <BeitragSeite beitrag={beitrag} />;
}
