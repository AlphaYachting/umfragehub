import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/unternehmensnachfolgeMarketing";

// /wissen/unternehmensnachfolge-marketing: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenUnternehmensnachfolgeMarketing() {
  return <BeitragSeite beitrag={beitrag} />;
}
