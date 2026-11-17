import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/preparingBusinessHandover";

// /en/insights/preparing-business-handover: English version of /wissen/betriebsuebergabe-vorbereiten. Own page so Base44 can set title and description.
export default function InsightsEnPreparingBusinessHandover() {
  return <BeitragSeite beitrag={beitrag} />;
}
