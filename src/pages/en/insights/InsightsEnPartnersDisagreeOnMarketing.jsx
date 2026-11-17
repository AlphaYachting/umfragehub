import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/partnersDisagreeOnMarketing";

// /en/insights/partners-disagree-on-marketing: English version of /wissen/gesellschafter-uneinig-marketing. Own page so Base44 can set title and description.
export default function InsightsEnPartnersDisagreeOnMarketing() {
  return <BeitragSeite beitrag={beitrag} />;
}
