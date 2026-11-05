import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/vertriebAnkurbeln";

// /wissen/vertrieb-ankurbeln: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenVertriebAnkurbeln() {
  return <BeitragSeite beitrag={beitrag} />;
}
