import React from "react";
import { Link } from "react-router-dom";
import { F, KONTAKT_MAIL, KONTAKT_TEL } from "@/components/oeffentlich/Oeffentlich";
import Rechtstext, { Abschnitt, Angaben } from "@/components/oeffentlich/Rechtstext";

// Impressum von andifragt.at (02.11.2026).
// Grundlagen: § 5 ECG, § 14 UGB, § 25 MediengesetzG, § 63 GewO.
// Kein Hinweis auf die EU-OS-Plattform mehr: Die Plattform ist seit 20.07.2025 abgeschaltet
// (VO (EU) 2024/3228), ein toter Link gilt als abmahnfähig.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;
const RIS = "https://www.ris.bka.gv.at";

export default function Impressum() {
  return (
    <Rechtstext
      titel="Impressum"
      seitentitel="Impressum | andi fragt."
      etikett="Impressum"
      einleitung="Angaben nach § 5 E-Commerce-Gesetz, § 14 Unternehmensgesetzbuch und Offenlegung nach § 25 Mediengesetz."
    >
      <Abschnitt id="anbieter" titel="Anbieter dieser Website">
        <Angaben
          zeilen={[
            ["Unternehmen", "Rittler & Co GmbH"],
            ["Sitz und Anschrift", "Peter-Rosegger-Straße 27, 8053 Graz, Österreich"],
            ["Telefon", <a key="t" href={TEL_LINK} className="hover:underline" style={{ color: F.text }}>{KONTAKT_TEL}</a>],
            ["E-Mail", <a key="m" href={`mailto:${KONTAKT_MAIL}`} className="hover:underline" style={{ color: F.text }}>{KONTAKT_MAIL}</a>],
            ["Geschäftsführer", "Alfons Rittler"],
            ["Firmenbuchnummer", "FN 259589z"],
            ["Firmenbuchgericht", "Landesgericht für Zivilrechtssachen Graz"],
            ["UID-Nummer", "ATU61508069"],
            ["Unternehmensgegenstand", "Werbeagentur"],
          ]}
        />
      </Abschnitt>

      <Abschnitt id="marke" titel="Urheberschaft, Idee und Marke">
        <Angaben
          zeilen={[
            ["Idee, Konzept und Methode", "Alfons Rittler (Urheber)"],
            ["Marke andi fragt.", "Alfons Rittler"],
          ]}
        />
        <p>
          Idee, Konzept und Interview-Methode andi fragt. hat Alfons Rittler persönlich und ohne Mitwirkung der
          Rittler & Co GmbH entwickelt. Er ist ihr Urheber. Konzept, Methode und die Marke andi fragt. liegen bei
          ihm persönlich und gehören nicht zur Rittler & Co GmbH. Die Rittler & Co GmbH bietet die Interviews unter
          dieser Marke mit seiner Zustimmung an.
        </p>
      </Abschnitt>

      <Abschnitt id="gewerbe" titel="Gewerbe und Aufsicht">
        <Angaben
          zeilen={[
            ["Kammer", "Mitglied der Wirtschaftskammer Steiermark, Fachgruppe Werbung und Marktkommunikation"],
            ["Gewerbebehörde", "Magistrat Graz"],
            ["Berufsrecht", <span key="b">Gewerbeordnung 1994, abrufbar unter <a href={RIS} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: F.text }}>www.ris.bka.gv.at</a></span>],
          ]}
        />
      </Abschnitt>

      <Abschnitt id="offenlegung" titel="Offenlegung nach § 25 Mediengesetz">
        <Angaben
          zeilen={[
            ["Medieninhaber", "Rittler & Co GmbH, Peter-Rosegger-Straße 27, 8053 Graz"],
            ["Unternehmensgegenstand", "Werbeagentur"],
            ["Beteiligungsverhältnisse", "Gesellschafter und Anteile laut Firmenbuch, FN 259589z"],
            ["Grundlegende Richtung", "Information über die Interview-Angebote andi fragt. von Rittler & Co sowie Fachbeiträge zu Unternehmensführung, Marke, Marketing und Vertrieb."],
          ]}
        />
      </Abschnitt>

      <Abschnitt id="inhalte" titel="Inhalte und Links">
        <p>
          Wir prüfen die Inhalte dieser Website sorgfältig und halten sie aktuell. Beispiele, Beispielzahlen und
          Beispielsätze sind als solche gekennzeichnet. Für Inhalte fremder Websites, auf die wir verlinken, sind
          deren Betreiber verantwortlich. Erfahren wir von rechtswidrigen Inhalten auf einer verlinkten Seite,
          entfernen wir den Link.
        </p>
        <p>
          Texte, Grafiken und Fotos dieser Website sind urheberrechtlich geschützt. Eine Verwendung außerhalb der
          gesetzlich erlaubten Fälle braucht unsere Zustimmung.
        </p>
      </Abschnitt>

      <Abschnitt id="datenschutz" titel="Datenschutz">
        <p>
          Wie wir mit personenbezogenen Daten umgehen, auch bei Interviews, steht in unserer{" "}
          <Link to="/datenschutz" className="font-semibold underline" style={{ color: F.text }}>Datenschutzerklärung</Link>.
        </p>
      </Abschnitt>
    </Rechtstext>
  );
}
