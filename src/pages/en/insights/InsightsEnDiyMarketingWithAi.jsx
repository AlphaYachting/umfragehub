import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/diyMarketingWithAi";

// /en/insights/diy-marketing-with-ai: English version of /wissen/marketing-mit-ki-selbst-machen. Own page so Base44 can set title and description.
export default function InsightsEnDiyMarketingWithAi() {
  return <BeitragSeite beitrag={beitrag} />;
}
