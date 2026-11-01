import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/mitarbeiterNachBetriebsuebernahme";

// /wissen/mitarbeiter-nach-betriebsuebernahme: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMitarbeiterNachBetriebsuebernahme() {
  return <BeitragSeite beitrag={beitrag} />;
}
