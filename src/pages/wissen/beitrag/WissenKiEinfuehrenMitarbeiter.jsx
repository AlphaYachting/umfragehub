import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/kiEinfuehrenMitarbeiter";

// /wissen/ki-einfuehren-mitarbeiter: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenKiEinfuehrenMitarbeiter() {
  return <BeitragSeite beitrag={beitrag} />;
}
