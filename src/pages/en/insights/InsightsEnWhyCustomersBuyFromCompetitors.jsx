import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/whyCustomersBuyFromCompetitors";

// /en/insights/why-customers-buy-from-competitors: English version of /wissen/warum-kaufen-kunden-bei-der-konkurrenz. Own page so Base44 can set title and description.
export default function InsightsEnWhyCustomersBuyFromCompetitors() {
  return <BeitragSeite beitrag={beitrag} />;
}
