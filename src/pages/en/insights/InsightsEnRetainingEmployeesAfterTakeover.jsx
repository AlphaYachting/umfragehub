import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/retainingEmployeesAfterTakeover";

// /en/insights/retaining-employees-after-takeover: English version of /wissen/mitarbeiter-nach-betriebsuebernahme. Own page so Base44 can set title and description.
export default function InsightsEnRetainingEmployeesAfterTakeover() {
  return <BeitragSeite beitrag={beitrag} />;
}
