import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/abschlussquoteErhoehen";

// /wissen/abschlussquote-erhoehen: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenAbschlussquoteErhoehen() {
  return <BeitragSeite beitrag={beitrag} />;
}
