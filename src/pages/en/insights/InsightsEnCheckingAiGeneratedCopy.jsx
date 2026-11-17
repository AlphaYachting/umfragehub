import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/checkingAiGeneratedCopy";

// /en/insights/checking-ai-generated-copy: English version of /wissen/ki-texte-ueberpruefen. Own page so Base44 can set title and description.
export default function InsightsEnCheckingAiGeneratedCopy() {
  return <BeitragSeite beitrag={beitrag} />;
}
