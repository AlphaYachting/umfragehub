import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/betriebsuebernahmeErste100Tage";

// /wissen/betriebsuebernahme-erste-100-tage: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenBetriebsuebernahmeErste100Tage() {
  return <BeitragSeite beitrag={beitrag} />;
}
