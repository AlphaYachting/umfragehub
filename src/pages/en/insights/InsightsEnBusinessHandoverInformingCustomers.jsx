import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/businessHandoverInformingCustomers";

// /en/insights/business-handover-informing-customers: English version of /wissen/betriebsuebergabe-kunden-informieren. Own page so Base44 can set title and description.
export default function InsightsEnBusinessHandoverInformingCustomers() {
  return <BeitragSeite beitrag={beitrag} />;
}
