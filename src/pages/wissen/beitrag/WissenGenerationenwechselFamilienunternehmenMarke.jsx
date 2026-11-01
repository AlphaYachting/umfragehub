import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/generationenwechselFamilienunternehmenMarke";

// /wissen/generationenwechsel-familienunternehmen-marke: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenGenerationenwechselFamilienunternehmenMarke() {
  return <BeitragSeite beitrag={beitrag} />;
}
