import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/warumKaufenKundenBeiDerKonkurrenz";

// /wissen/warum-kaufen-kunden-bei-der-konkurrenz: eigene Seite je Beitrag, damit Base44 Titel und Beschreibung je Beitrag setzen kann.
export default function WissenWarumKaufenKundenBeiDerKonkurrenz() {
  return <BeitragSeite beitrag={beitrag} />;
}
