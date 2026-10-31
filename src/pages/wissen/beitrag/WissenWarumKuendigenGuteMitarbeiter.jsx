import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/warumKuendigenGuteMitarbeiter";

// /wissen/warum-kuendigen-gute-mitarbeiter: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenWarumKuendigenGuteMitarbeiter() {
  return <BeitragSeite beitrag={beitrag} />;
}
