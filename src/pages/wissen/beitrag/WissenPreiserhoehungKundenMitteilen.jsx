import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/preiserhoehungKundenMitteilen";

// /wissen/preiserhoehung-kunden-mitteilen: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenPreiserhoehungKundenMitteilen() {
  return <BeitragSeite beitrag={beitrag} />;
}
