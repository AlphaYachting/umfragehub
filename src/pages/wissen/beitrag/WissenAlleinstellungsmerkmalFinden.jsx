import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/alleinstellungsmerkmalFinden";

// /wissen/alleinstellungsmerkmal-finden: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenAlleinstellungsmerkmalFinden() {
  return <BeitragSeite beitrag={beitrag} />;
}
