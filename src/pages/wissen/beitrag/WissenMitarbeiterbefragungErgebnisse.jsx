import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/mitarbeiterbefragungErgebnisse";

// /wissen/mitarbeiterbefragung-ergebnisse: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMitarbeiterbefragungErgebnisse() {
  return <BeitragSeite beitrag={beitrag} />;
}
