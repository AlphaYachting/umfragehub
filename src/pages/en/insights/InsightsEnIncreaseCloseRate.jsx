import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/increaseCloseRate";

// /en/insights/increase-close-rate: English version of /wissen/abschlussquote-erhoehen. Own page so Base44 can set title and description.
export default function InsightsEnIncreaseCloseRate() {
  return <BeitragSeite beitrag={beitrag} />;
}
