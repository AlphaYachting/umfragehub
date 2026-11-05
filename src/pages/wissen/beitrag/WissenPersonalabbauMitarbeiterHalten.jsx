import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/personalabbauMitarbeiterHalten";

// /wissen/personalabbau-mitarbeiter-halten: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenPersonalabbauMitarbeiterHalten() {
  return <BeitragSeite beitrag={beitrag} />;
}
