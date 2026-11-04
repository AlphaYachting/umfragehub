import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/mitarbeiterbefragungIso45001";

// /wissen/mitarbeiterbefragung-iso-45001: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMitarbeiterbefragungIso45001() {
  return <BeitragSeite beitrag={beitrag} />;
}
