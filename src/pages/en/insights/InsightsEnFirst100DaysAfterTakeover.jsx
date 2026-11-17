import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/first100DaysAfterTakeover";

// /en/insights/first-100-days-after-takeover: English version of /wissen/betriebsuebernahme-erste-100-tage. Own page so Base44 can set title and description.
export default function InsightsEnFirst100DaysAfterTakeover() {
  return <BeitragSeite beitrag={beitrag} />;
}
