import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/businessSuccessionMarketing";

// /en/insights/business-succession-marketing: English version of /wissen/unternehmensnachfolge-marketing. Own page so Base44 can set title and description.
export default function InsightsEnBusinessSuccessionMarketing() {
  return <BeitragSeite beitrag={beitrag} />;
}
