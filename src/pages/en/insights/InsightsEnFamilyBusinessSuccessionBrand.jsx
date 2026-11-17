import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/familyBusinessSuccessionBrand";

// /en/insights/family-business-succession-brand: English version of /wissen/generationenwechsel-familienunternehmen-marke. Own page so Base44 can set title and description.
export default function InsightsEnFamilyBusinessSuccessionBrand() {
  return <BeitragSeite beitrag={beitrag} />;
}
