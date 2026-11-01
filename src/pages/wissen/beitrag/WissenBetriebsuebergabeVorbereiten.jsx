import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/betriebsuebergabeVorbereiten";

// /wissen/betriebsuebergabe-vorbereiten: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenBetriebsuebergabeVorbereiten() {
  return <BeitragSeite beitrag={beitrag} />;
}
