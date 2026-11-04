import React from "react";
import { F, KONTAKT_MAIL, KONTAKT_TEL } from "@/components/oeffentlich/Oeffentlich";
import Rechtstext, { Abschnitt, Angaben, Liste, Unter } from "@/components/oeffentlich/Rechtstext";

// Datenschutzerklärung von andifragt.at (Entwurf 02.11.2026), nach Art. 13 und 14 DSGVO,
// DSG und § 165 TKG 2021. Grundlage ist der tatsächliche Code der App (Stand 02.11.2026):
// - Hosting und Datenbank: Base44 (Auftragsverarbeiter, Server standardmäßig USA)
// - Seitenaufruf-Zähler von Base44 ohne Cookies (analyticsTracker in vite.config.js)
// - Gilroy-Schrift und Kundenlogos werden von werbe-agentur-graz.at geladen
// - Anfrageformular (Funktion anfrage), Benachrichtigung per Brevo
// - Interview: keine Verknüpfung Adresse und Antworten, nur Merker "gestartet";
//   Fortschritt im localStorage; Spracheingabe über die Spracherkennung des Browsers
// - Einladungen per Brevo ohne Öffnungs- und Klickmessung je Adresse
// - Kunden-Cockpit mit Zugangscode und Passwort, sessionStorage
// Offene Punkte sind mit <Offen> markiert und müssen vor dem Veröffentlichen ersetzt werden.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const INHALT = [
  { id: "verantwortlich", titel: "Wer verantwortlich ist" },
  { id: "website", titel: "Besuch dieser Website" },
  { id: "geraet", titel: "Speicherung auf deinem Gerät" },
  { id: "anfrage", titel: "Anfragen und Kontakt" },
  { id: "interviews", titel: "Teilnahme an einem Interview" },
  { id: "auftraggeber", titel: "Kunden-Cockpit für Auftraggeber" },
  { id: "dienstleister", titel: "Dienstleister und Empfänger" },
  { id: "usa", titel: "Übermittlung in die USA" },
  { id: "rechte", titel: "Deine Rechte" },
  { id: "aenderungen", titel: "Änderungen" },
];

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: F.text }}>{children}</a>
);

export default function Datenschutz() {
  return (
    <Rechtstext
      titel="Datenschutz"
      seitentitel="Datenschutzerklärung | andi fragt."
      etikett="Datenschutz"
      einleitung="Hier steht, welche personenbezogenen Daten wir auf andifragt.at verarbeiten, wofür, auf welcher Rechtsgrundlage, wer sie bekommt und wie lange wir sie aufheben. Für Besucherinnen und Besucher, für alle, die uns anfragen, und für alle, die an einem Interview teilnehmen."
      stand="2. November 2026"
      inhalt={INHALT}
    >
      <Abschnitt id="verantwortlich" titel="1. Wer verantwortlich ist">
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website nach Art. 4 Z 7 DSGVO ist:</p>
        <Angaben
          zeilen={[
            ["Unternehmen", "Rittler & Co GmbH"],
            ["Anschrift", "Peter-Rosegger-Straße 27, 8053 Graz, Österreich"],
            ["E-Mail", <a key="m" href={`mailto:${KONTAKT_MAIL}`} className="hover:underline" style={{ color: F.text }}>{KONTAKT_MAIL}</a>],
            ["Telefon", <a key="t" href={TEL_LINK} className="hover:underline" style={{ color: F.text }}>{KONTAKT_TEL}</a>],
          ]}
        />
        <p>
          Bei Interviews arbeiten wir im Auftrag eines Unternehmens, das dich eingeladen hat. Wie die
          Verantwortung dann verteilt ist, steht in Abschnitt 5.
        </p>
      </Abschnitt>

      <Abschnitt id="website" titel="2. Besuch dieser Website">
        <Unter titel="Bereitstellung und Server-Protokolle">
          <p>
            Diese Website und ihre Datenbank laufen auf der Plattform Base44 (Base44, Inc., ein Unternehmen der
            Wix.com-Gruppe). Base44 verarbeitet die Daten als unser Auftragsverarbeiter nach Art. 28 DSGVO. Die
            Server stehen in den USA (siehe Abschnitt 8).
          </p>
          <p>
            Wenn du eine Seite aufrufst, verarbeitet der Server technisch notwendige Daten: deine IP-Adresse,
            Datum und Uhrzeit, die aufgerufene Adresse, Browser und Betriebssystem sowie die Seite, von der du
            kommst. Das brauchen wir, um die Website auszuliefern, stabil zu betreiben und gegen Angriffe zu
            schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1
            lit. f DSGVO). Die Protokolle werden gelöscht, sobald sie für diese Zwecke nicht mehr gebraucht werden.
          </p>
        </Unter>
        <Unter titel="Zählung der Seitenaufrufe">
          <p>
            Base44 zählt, welche Bereiche dieser Website aufgerufen werden. Dabei wird nur der Name des Bereichs
            übertragen, etwa Startseite oder Preise. Es werden keine Cookies gesetzt, kein Profil gebildet und
            keine Werbedienste eingebunden. Rechtsgrundlage ist unser berechtigtes Interesse, die Website zu
            verbessern (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </Unter>
        <Unter titel="Schrift und Kundenlogos">
          <p>
            Unsere Hausschrift und die Logos unserer Kunden laden wir von unserer eigenen Agentur-Website
            werbe-agentur-graz.at. Dabei erhält dieser Server deine IP-Adresse, weil er die Dateien sonst nicht
            ausliefern kann. Wir verwenden keine Schriften von Google oder anderen Anbietern. Rechtsgrundlage ist
            unser berechtigtes Interesse an einem einheitlichen Auftritt (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </Unter>
        <Unter titel="Links zu anderen Websites">
          <p>
            Links zu anderen Websites, etwa zu Quellen in unseren Fachbeiträgen, öffnen erst eine Verbindung, wenn
            du sie anklickst. Für die Verarbeitung dort ist der jeweilige Betreiber verantwortlich.
          </p>
        </Unter>
      </Abschnitt>

      <Abschnitt id="geraet" titel="3. Speicherung auf deinem Gerät">
        <p>
          Wir setzen keine Cookies für Statistik, Werbung oder Profile. Darum gibt es auf dieser Website auch
          kein Cookie-Banner. In einigen Fällen legen wir Angaben im Speicher deines Browsers ab, weil die
          Funktion, die du nutzt, sonst nicht funktioniert (§ 165 Abs. 3 TKG 2021):
        </p>
        <Liste
          eintraege={[
            "Im Interview: dein Fortschritt, damit du unterbrechen und später weitermachen kannst. Der Eintrag bleibt in deinem Browser, bis du ihn löschst.",
            "Im Kunden-Cockpit: die Anmeldung für die Dauer der Sitzung. Der Eintrag verschwindet, wenn du das Fenster schließt.",
            "In der internen Verwaltung: die Anmeldung unseres Teams.",
          ]}
        />
        <p>Du kannst diese Einträge jederzeit in den Einstellungen deines Browsers löschen.</p>
      </Abschnitt>

      <Abschnitt id="anfrage" titel="4. Anfragen und Kontakt">
        <Unter titel="Anfrageformular und Preisrechner">
          <p>
            Wenn du über das Formular auf der Kontaktseite oder im Preisrechner ein Erstgespräch anfragst,
            verarbeiten wir: Name, Unternehmen, E-Mail-Adresse, auf Wunsch Telefonnummer, die gewählten Themen,
            ob du online oder telefonisch reden willst, deine Nachricht, beim Preisrechner deine Auswahl mit
            Richtpreis und die Seite, von der die Anfrage kommt. Zum Schutz vor automatisierten Einsendungen
            prüfen wir außerdem, wie lange das Ausfüllen gedauert hat und wie viele Anfragen von derselben
            E-Mail-Adresse kommen.
          </p>
          <p>
            Wir verwenden die Angaben nur, um dich zu kontaktieren und ein Angebot vorzubereiten. Rechtsgrundlage
            sind vorvertragliche Maßnahmen auf deine Anfrage (Art. 6 Abs. 1 lit. b DSGVO) und für den Schutz vor
            Missbrauch unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). Die Anfrage wird in unserer
            Datenbank bei Base44 gespeichert. Eine Benachrichtigung mit deinen Angaben geht per E-Mail über den
            Versanddienst Brevo an unser Team.
          </p>
          <p>
            Wird aus der Anfrage kein Auftrag, löschen wir sie spätestens 12 Monate nach dem letzten Kontakt.
            Wird ein Auftrag daraus, heben wir die Daten so lange auf, wie es das Unternehmens- und Steuerrecht
            verlangt, in der Regel sieben Jahre (§ 132 BAO, § 212 UGB).
          </p>
        </Unter>
        <Unter titel="E-Mail und Telefon">
          <p>
            Schreibst du uns oder rufst du an, verarbeiten wir deine Angaben, um dein Anliegen zu bearbeiten
            (Art. 6 Abs. 1 lit. b oder f DSGVO). Es gelten dieselben Fristen wie beim Formular.
          </p>
        </Unter>
      </Abschnitt>

      <Abschnitt id="interviews" titel="5. Teilnahme an einem Interview">
        <Unter titel="Wer verantwortlich ist">
          <p>
            Wir führen Interviews im Auftrag von Unternehmen durch, etwa mit deren Team, Kunden oder Vertrieb.
            Das Unternehmen, das dich eingeladen hat, legt fest, wer eingeladen wird. Wir entwickeln die Fragen,
            führen das Interview technisch durch und werten aus. Wie die Verantwortung zwischen uns und dem Auftraggeber verteilt ist, regelt der Vertrag mit ihm, als Auftragsverarbeitung nach Art. 28 DSGVO oder als gemeinsame Verantwortung nach Art. 26 DSGVO.
            Für Fragen zu deinen Daten kannst du dich immer direkt an uns wenden.
          </p>
        </Unter>
        <Unter titel="Einladung per E-Mail">
          <p>
            Lädt das Unternehmen per E-Mail ein, bekommen wir dafür die E-Mail-Adressen, nach Gruppen geordnet.
            Wir verschicken damit die Einladung und höchstens die angekündigten Erinnerungen über den Versanddienst
            Brevo. Ob du eine Mail öffnest oder einen Link anklickst, werten wir nicht je Adresse aus. Zu deiner
            Adresse merken wir uns nur, ob du das Interview begonnen hast, damit wir dich nicht unnötig erinnern.
          </p>
        </Unter>
        <Unter titel="Deine Antworten">
          <p>
            Deine Antworten speichern wir ohne Namen, ohne E-Mail-Adresse und ohne Verbindung zu deinem
            Einladungslink. Wer welche Antwort gegeben hat, lässt sich aus unseren Daten nicht ablesen. Das
            Unternehmen sieht Ergebnisse nur gebündelt und erst ab einer Mindestzahl von Teilnehmenden je Gruppe,
            in der Regel sechs. Einzelne Antworten bekommt es nicht zu sehen.
          </p>
          <p>
            In offenen Antworten schreibst du in eigenen Worten. Bitte nenne dort keine Namen und keine
            Gesundheits- oder anderen besonders sensiblen Angaben über dich oder andere. Zitate aus offenen Antworten geben wir nur ohne Hinweise auf Personen weiter.
          </p>
          <p>
            Die Auswertung machen Menschen in unserem Team. Setzen wir Software oder KI zum Ordnen und Zusammenfassen ein, bekommt sie nur die Antworten selbst, nie Namen oder E-Mail-Adressen.
            Es gibt keine automatisierte Entscheidung über dich im Sinn von Art. 22 DSGVO.
          </p>
          <p>
            Die Teilnahme ist freiwillig. Rechtsgrundlage ist das berechtigte Interesse des Auftraggebers und
            unser eigenes, ein ehrliches Bild aus dem Unternehmen zu bekommen (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </Unter>
        <Unter titel="Spracheingabe">
          <p>
            Statt zu tippen, kannst du Antworten auch sprechen. Dafür nutzen wir die Spracherkennung, die in
            deinem Browser eingebaut ist. Je nach Browser wird deine Sprache dabei vom Anbieter des Browsers
            verarbeitet, bei Chrome etwa von Google, bei Safari von Apple, teils auf Servern außerhalb der EU.
            Wir bekommen keine Tonaufnahme, sondern nur den erkannten Text, den du vor dem Absenden korrigieren
            kannst. Die Spracheingabe ist freiwillig. Startest du sie, willigst du in diese Verarbeitung ein
            (Art. 6 Abs. 1 lit. a DSGVO). Tippen geht immer.
          </p>
        </Unter>
        <Unter titel="Wie lange wir aufheben">
          <Liste
            eintraege={[
              <span key="1">E-Mail-Adressen für Einladungen: Löschung spätestens 30 Tage nach Ende der Interviewphase.</span>,
              <span key="2">Antworten: Aufbewahrung bis zum Abschluss des Projekts und für einen vereinbarten Vergleich mit einer späteren Runde, danach Löschung spätestens 24 Monate nach Projektabschluss.</span>,
            ]}
          />
        </Unter>
      </Abschnitt>

      <Abschnitt id="auftraggeber" titel="6. Kunden-Cockpit für Auftraggeber">
        <p>
          Auftraggeber sehen in einem eigenen Bereich, wie viele Interviews je Gruppe schon abgeschlossen sind.
          Der Zugang läuft über einen Zugangscode und ein Passwort. Wir verarbeiten dafür die Anmeldung und die
          Angaben zum Projekt, um den Vertrag zu erfüllen (Art. 6 Abs. 1 lit. b DSGVO). Inhalte einzelner
          Antworten zeigt das Cockpit nicht.
        </p>
      </Abschnitt>

      <Abschnitt id="dienstleister" titel="7. Dienstleister und Empfänger">
        <p>Wir geben personenbezogene Daten nur an Dienstleister weiter, die wir dafür vertraglich verpflichtet haben:</p>
        <Liste
          eintraege={[
            <span key="b"><strong style={{ color: F.text }}>Base44, Inc.</strong>, Wix.com-Gruppe, USA: Betrieb der Website, Datenbank, Server-Protokolle. <A href="https://base44.com/about-us/legal/privacy-policy">Datenschutz bei Base44</A></span>,
            <span key="v"><strong style={{ color: F.text }}>Brevo</strong> (Sendinblue-Gruppe, Frankreich und Deutschland, Server in der EU): Versand von Einladungen, Erinnerungen und Benachrichtigungen. <A href="https://www.brevo.com/de/legal/privacypolicy/">Datenschutz bei Brevo</A></span>,
            <span key="w"><strong style={{ color: F.text }}>Unser Webserver für werbe-agentur-graz.at</strong>: Auslieferung von Schrift und Logos.</span>,
          ]}
        />
        <p>
          Die Spracherkennung im Browser ist kein Dienst von uns, sondern eine Funktion deines Browsers. Darüber
          hinaus geben wir Daten nur weiter, wenn ein Gesetz uns dazu verpflichtet.
        </p>
      </Abschnitt>

      <Abschnitt id="usa" titel="8. Übermittlung in die USA">
        <p>
          Base44 ist ein Unternehmen mit Sitz in den USA. Für Übermittlungen dorthin hat Base44 in seinem
          Auftragsverarbeitungsvertrag die Standardvertragsklauseln der EU-Kommission vereinbart (Art. 46 Abs. 2
          lit. c DSGVO) und stützt sich, wo vorhanden, auf das EU-US Data Privacy Framework (Art. 45 DSGVO).
          Das Data Privacy Framework ist gültig, gegen den Beschluss läuft aber ein Verfahren beim Europäischen
          Gerichtshof. Eine Kopie der Garantien bekommst du auf Anfrage bei uns.
        </p>
      </Abschnitt>

      <Abschnitt id="rechte" titel="9. Deine Rechte">
        <p>Du hast das Recht auf:</p>
        <Liste
          eintraege={[
            "Auskunft über deine Daten (Art. 15 DSGVO)",
            "Berichtigung (Art. 16 DSGVO) und Löschung (Art. 17 DSGVO)",
            "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "Datenübertragbarkeit (Art. 20 DSGVO)",
            "Widerspruch gegen Verarbeitungen auf Grund berechtigter Interessen (Art. 21 DSGVO)",
            "Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
          ]}
        />
        <p>
          Interview-Antworten speichern wir ohne Verbindung zu deiner Person. Wir können sie dir deshalb in der
          Regel nicht zuordnen, auch nicht für eine Auskunft oder Löschung (Art. 11 DSGVO). Kannst du uns
          Angaben nennen, mit denen sich deine Antworten eindeutig finden lassen, prüfen wir das gern.
        </p>
        <p>
          Schreib uns an <a href={`mailto:${KONTAKT_MAIL}`} className="font-semibold underline" style={{ color: F.text }}>{KONTAKT_MAIL}</a>.
          Wir antworten innerhalb eines Monats. Du kannst dich außerdem bei der Österreichischen
          Datenschutzbehörde beschweren: Barichgasse 40 bis 42, 1030 Wien, dsb@dsb.gv.at,{" "}
          <A href="https://www.dsb.gv.at">www.dsb.gv.at</A>.
        </p>
      </Abschnitt>

      <Abschnitt id="aenderungen" titel="10. Änderungen">
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich unsere Website, unsere Dienstleister oder die
          Rechtslage ändern. Es gilt die Fassung, die hier steht.
        </p>
      </Abschnitt>
    </Rechtstext>
  );
}
