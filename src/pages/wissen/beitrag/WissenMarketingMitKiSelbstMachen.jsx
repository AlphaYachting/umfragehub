import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/marketingMitKiSelbstMachen";

// /wissen/marketing-mit-ki-selbst-machen: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMarketingMitKiSelbstMachen() {
  return <BeitragSeite beitrag={beitrag} />;
}
