import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/mitarbeiterHaltenOhneGehaltserhoehung";

// /wissen/mitarbeiter-halten-ohne-gehaltserhoehung: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenMitarbeiterHaltenOhneGehaltserhoehung() {
  return <BeitragSeite beitrag={beitrag} />;
}
