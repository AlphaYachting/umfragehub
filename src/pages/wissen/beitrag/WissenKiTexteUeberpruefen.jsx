import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/kiTexteUeberpruefen";

// /wissen/ki-texte-ueberpruefen: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenKiTexteUeberpruefen() {
  return <BeitragSeite beitrag={beitrag} />;
}
