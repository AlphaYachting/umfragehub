import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, Hauptknopf, KONTAKT_MAIL, KONTAKT_TEL, LEAD_STIL, Modulseite, TEXT_STIL, mailAn,
} from "@/components/oeffentlich/Oeffentlich";

// Öffentliche Kontaktseite von andifragt.at.
//
// Telefon, E-Mail und Adresse stehen als klarer Text (nicht nur als Symbol),
// damit sie auch für Suchmaschinen und Screenreader eindeutig sind.
//
// Typografie wie auf den Modulseiten: Gilroy hat keine Gedankenstriche.
// Sprachregel: Auf den öffentlichen Seiten heißt es immer Interview, nie Befragung.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const WEGE = [
  {
    icon: Phone,
    label: "Telefon",
    wert: KONTAKT_TEL,
    href: TEL_LINK,
    text: "Der schnellste Weg: anrufen und kurz schildern, worum es geht.",
  },
  {
    icon: Mail,
    label: "E-Mail",
    wert: KONTAKT_MAIL,
    href: `mailto:${KONTAKT_MAIL}`,
    text: "Schreib uns, was du vorhast. Wir antworten so bald wie möglich.",
  },
  {
    icon: MapPin,
    label: "Adresse",
    wert: "Rittler & Co GmbH, Peter-Rosegger-Straße 27, 8053 Graz",
    href: null,
    text: "Besuche bitte nach Vereinbarung, damit sich jemand Zeit nimmt.",
  },
];

const ANLIEGEN = [
  "Ein Interview für dein Unternehmen: Wer soll befragt werden, wie viele Personen, wie lange es dauert.",
  "Der Markenprüfstand, unsere Standortbestimmung, wenn du noch nicht weißt, wo du stehst.",
  "Ein Interview, zu dem du eingeladen wurdest: Wenn dein Link nicht funktioniert, ruf an und wir schicken dir einen neuen.",
];

export default function Kontakt() {
  return (
    <Modulseite titel="Kontakt | andi fragt. Rittler & Co, Graz" modul="Kontakt">
      <section className={`${BREITE} pt-14 pb-6`}>
        <Etikett>Kontakt</Etikett>
        <h1 className="mt-4 max-w-[900px]" style={H1_STIL}>
          Reden wir über <span style={{ color: F.akzent }}>dein Unternehmen.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
          Du willst wissen, was Führung, Team, Vertrieb und Kunden wirklich denken? Dann melde dich bei uns:
          telefonisch, per E-Mail oder über die Adresse unten. Wir sagen dir offen, ob ein Interview in deiner
          Situation Sinn ergibt.
        </p>
      </section>

      {/* Die drei Wege */}
      <section className={`${BREITE} py-10`}>
        <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {WEGE.map(({ icon: Icon, label, wert, href, text }) => (
            <li key={label} className="rounded-lg p-6" style={{ background: F.grau, border: `1px solid ${F.linie}` }}>
              <Icon size={26} strokeWidth={1.5} style={{ color: F.akzent }} aria-hidden="true" />
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.etikett }}>{label}</p>
              <p className="mt-2 text-lg font-bold leading-[1.35]">
                {href ? (
                  <a href={href} className="hover:underline" style={{ color: F.text }}>{wert}</a>
                ) : (
                  <span style={{ color: F.text }}>{wert}</span>
                )}
              </p>
              <p className="mt-2 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Hauptknopf href={mailAn("andi fragt. Termin vereinbaren")}>Termin vereinbaren</Hauptknopf>
        </div>
      </section>

      {/* Worum es gehen kann */}
      <section className={`${BREITE} py-14`} style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className="max-w-[680px]">
          <Etikett>Worum es gehen kann</Etikett>
          <h2 className="mt-3 text-2xl font-bold">Drei typische Anliegen</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {ANLIEGEN.map((a) => (
              <li key={a} className="flex gap-3" style={{ ...TEXT_STIL, color: F.daempft }}>
                <span className="shrink-0 w-1.5 h-1.5 mt-[11px] rounded-full" style={{ background: F.akzent }} aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px]" style={{ color: F.daempft }}>
            Du wurdest zu einem Interview eingeladen? Dann brauchst du uns nicht: Öffne einfach den Link aus
            deiner Einladung oder gib den Code auf der{" "}
            <a href="/#eingeladen" className="font-semibold hover:underline" style={{ color: F.link }}>Startseite</a> ein.
          </p>
        </div>
      </section>
    </Modulseite>
  );
}