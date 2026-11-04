import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BREITE, Etikett, F, H1_STIL, LEAD_STIL, Modulseite } from "@/components/oeffentlich/Oeffentlich";
import { useKopfdaten } from "@/components/oeffentlich/wissen/BeitragSeite";

// Unbekannte Adressen: eigene Seite statt Weiterleitung auf die Startseite.
// noindex, damit Google und KI-Suchen keine Kopien der Startseite unter fremden Adressen speichern.
// Typografie: keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte (Gilroy).

const ZIELE = [
  { pfad: "/", name: "Startseite" },
  { pfad: "/positionierung", name: "Positionierung" },
  { pfad: "/team", name: "Team" },
  { pfad: "/kunden", name: "Kunden" },
  { pfad: "/vertrieb", name: "Vertrieb" },
  { pfad: "/wissen", name: "Wissen" },
  { pfad: "/kontakt", name: "Kontakt" },
];

export default function NichtGefunden() {
  const { pathname } = useLocation();
  useKopfdaten({
    titel: "Seite nicht gefunden | andi fragt.",
    beschreibung: "Diese Seite gibt es auf andifragt.at nicht. Hier findest du die Module, den Wissensbereich und den Kontakt zu Rittler & Co in Graz.",
    pfad: pathname,
    robots: "noindex, follow",
    typ: "website",
  });

  return (
    <Modulseite titel="Seite nicht gefunden | andi fragt." modul="">
      <section className={`${BREITE} pt-20 pb-28`}>
        <Etikett>Fehler 404</Etikett>
        <h1 className="mt-4 max-w-[900px]" style={H1_STIL}>
          Diese Seite gibt es nicht.
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
          Vielleicht hat sich die Adresse geändert. Hier geht es weiter:
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {ZIELE.map((z) => (
            <li key={z.pfad}>
              <Link
                to={z.pfad}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full text-[15px] font-semibold"
                style={{ border: `1.5px solid ${F.linie}`, color: F.text, textDecoration: "none" }}
              >
                {z.name} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Modulseite>
  );
}
