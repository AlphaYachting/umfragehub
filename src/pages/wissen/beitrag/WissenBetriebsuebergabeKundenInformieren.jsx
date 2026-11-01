import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/betriebsuebergabeKundenInformieren";

// /wissen/betriebsuebergabe-kunden-informieren: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenBetriebsuebergabeKundenInformieren() {
  return <BeitragSeite beitrag={beitrag} />;
}
