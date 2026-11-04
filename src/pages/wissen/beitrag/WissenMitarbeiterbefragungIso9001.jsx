import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/mitarbeiterbefragungIso9001";

// /wissen/mitarbeiterbefragung-iso-9001: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMitarbeiterbefragungIso9001() {
  return <BeitragSeite beitrag={beitrag} />;
}
