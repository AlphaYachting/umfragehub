import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/findYourUsp";

// /en/insights/find-your-usp: English version of /wissen/alleinstellungsmerkmal-finden. Own page so Base44 can set title and description.
export default function InsightsEnFindYourUsp() {
  return <BeitragSeite beitrag={beitrag} />;
}
