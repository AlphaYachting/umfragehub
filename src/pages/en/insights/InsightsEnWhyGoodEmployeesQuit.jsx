import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/whyGoodEmployeesQuit";

// /en/insights/why-good-employees-quit: English version of /wissen/warum-kuendigen-gute-mitarbeiter. Own page so Base44 can set title and description.
export default function InsightsEnWhyGoodEmployeesQuit() {
  return <BeitragSeite beitrag={beitrag} />;
}
