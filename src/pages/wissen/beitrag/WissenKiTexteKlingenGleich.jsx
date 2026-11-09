import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/kiTexteKlingenGleich";

// /wissen/ki-texte-klingen-gleich: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenKiTexteKlingenGleich() {
  return <BeitragSeite beitrag={beitrag} />;
}
