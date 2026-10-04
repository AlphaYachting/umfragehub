import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Shield, Heart, Clock, PauseCircle, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  themeVariablenSetzen,
  anspracheFormen,
  geschaetzteFrageDauerSekunden,
  renderFragetext,
  sternchenEntfernen,
  platzhalterErsetzen,
  matrixZeilenMitIds,
  kapitelTitelAnzeige,
} from "@/lib/interview";
import FrageAntwort from "@/components/interview/FrageAntwort";
import RechtlicheFusszeile from "@/components/interview/RechtlicheFusszeile";
import ErklaerungBlock from "@/components/interview/ErklaerungBlock";
import BrowserHinweis from "@/components/interview/BrowserHinweis";

// Browser-Speicher kann gesperrt sein (privater Modus, eingebettete Browser in Mail-/Messenger-Apps,
// strenge Datenschutz-Einstellungen). Die Befragung muss dann trotzdem laufen — nur das
// spätere Fortsetzen auf demselben Gerät entfällt.
function speicherLesen(schluessel) {
  try {
    return window.localStorage.getItem(schluessel);
  } catch {
    return null;
  }
}
function speicherSchreiben(schluessel, wert) {
  try {
    window.localStorage.setItem(schluessel, wert);
    return true;
  } catch {
    return false;
  }
}

export default function Interview() {
  const { linkToken } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const testModus = urlParams.get("test") === "1";
  // Persönlicher Einladungslink (?e=…) — dient nur dazu, beim Start "hat begonnen" zu vermerken
  const einladungsToken = urlParams.get("e") || "";

  const [welle, setWelle] = useState(null);
  const [projekt, setProjekt] = useState(null);
  const [fragenListe, setFragenListe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [screen, setScreen] = useState("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionToken, setSessionToken] = useState(null);
  const [naechsterBlock, setNaechsterBlock] = useState(null);
  const [startZeit, setStartZeit] = useState(null);
  const [beantwortetCount, setBeantwortetCount] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [erklaerungOffen, setErklaerungOffen] = useState({});
  const [offlineHinweis, setOfflineHinweis] = useState(false);

  // Warteschlange für fehlgeschlagene Antworten (Paket 0.3)
  const warteschlangeRef = useRef([]);
  const [warteschlangeGroesse, setWarteschlangeGroesse] = useState(0);

  const frageHeadingRef = useRef(null);
  const weiterRef = useRef(null);
  const autoWeiterStateRef = useRef({});
  // FEHLER 1: blockiert Auto-Weiter bei Fragen, die beim Betreten schon beantwortet waren
  const beimBetretenBeantwortetRef = useRef(false);

  const kannFortsetzen = !testModus && !!speicherLesen(`interview_${linkToken}`);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const gespeichert = testModus ? null : speicherLesen(`interview_${linkToken}`);
      const res = await base44.functions.invoke("interviewApi", {
        aktion: "load",
        linkToken,
        sessionToken: gespeichert,
        vorschau: testModus,
      });
      const d = res?.data;
      if (!d || d.error) {
        setError(d?.error || "nicht_gefunden");
        setLoading(false);
        return;
      }
      setWelle(d.welle);
      setProjekt(d.projekt);
      themeVariablenSetzen(d.projekt);
      if (d.welle?.name) document.title = d.welle.name;

      // Flache Fragenliste
      const flach = [];
      (d.bloecke || []).forEach((b, bi) => {
        (b.fragen || []).forEach((f) => {
          flach.push({ frage: f, block: b, blockIndex: bi, blockCount: (d.bloecke || []).length });
        });
      });
      setFragenListe(flach);

      if (!testModus && d.session) {
        setSessionToken(d.session.token);
        const aMap = {};
        (d.antworten || []).forEach((a) => {
          aMap[a.frageId] = {
            auswahl: a.auswahl || [],
            zahl: a.zahl,
            text: a.text || "",
            matrixWerte: a.matrixWerte || {},
            eingabeart: a.eingabeart,
            transkriptKorrigiert: a.transkriptKorrigiert,
          };
        });
        setAnswers(aMap);
        // FEHLER 1: Auto-Weiter-Gedächtnis für bereits beantwortete Fragen vorbelegen
        (d.antworten || []).forEach((a) => {
          const w = {
            auswahl: a.auswahl || [],
            zahl: a.zahl,
            text: a.text || "",
            matrixWerte: a.matrixWerte || {},
            eingabeart: a.eingabeart,
            transkriptKorrigiert: a.transkriptKorrigiert,
          };
          autoWeiterStateRef.current[a.frageId] = JSON.stringify(w);
        });
        setBeantwortetCount((d.antworten || []).length);
        setStartZeit(new Date(d.session.startedAt).getTime());
        if (d.session.status === "abgeschlossen") {
          setScreen("abschluss");
        } else {
          const pos = flach.findIndex((item) => !aMap[item.frage.id]);
          if (pos < 0 || pos >= flach.length) {
            setScreen("abschluss");
          } else {
            setCurrentIndex(pos);
            setScreen("frage");
          }
        }
      }
    } catch (e) {
      setError("nicht_gefunden");
    } finally {
      setLoading(false);
    }
  }, [linkToken, testModus]);

  useEffect(() => {
    laden();
  }, [laden]);

  // Fokus auf die Frageüberschrift beim Screenwechsel (Paket 5.6)
  useEffect(() => {
    if (screen === "frage" && frageHeadingRef.current) {
      frageHeadingRef.current.focus({ preventScroll: true });
    }
    if (screen === "frage" || screen === "blockuebergang") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    // FEHLER 1: merken, ob die Frage beim Betreten schon beantwortet war
    if (screen === "frage") {
      const item = fragenListe[currentIndex];
      beimBetretenBeantwortetRef.current = !!(item && istBeantwortet(item.frage, answers[item.frage.id]));
    }
  }, [screen, currentIndex, animKey]); // eslint-disable-line react-hooks/exhaustive-deps

  async function starten() {
    if (testModus) {
      setScreen("frage");
      setCurrentIndex(0);
      setStartZeit(Date.now());
      return;
    }
    try {
      const res = await base44.functions.invoke("interviewApi", {
        aktion: "start",
        linkToken,
        einladung: einladungsToken || undefined,
      });
      const d = res?.data;
      if (d?.error) {
        setError(d.error);
        return;
      }
      setSessionToken(d.sessionToken);
      speicherSchreiben(`interview_${linkToken}`, d.sessionToken);
      setStartZeit(Date.now());
      setScreen("frage");
      setCurrentIndex(0);
    } catch (e) {
      setError("nicht_gefunden");
    }
  }

  // Warteschlange leeren — fehlgeschlagene Antworten erneut senden
  async function warteschlangeLeeren() {
    const queue = warteschlangeRef.current;
    if (!queue.length) return;
    const nochOffen = [];
    for (const eintrag of queue) {
      const ok = await sendenEinmalig(eintrag.frage, eintrag.wert);
      if (!ok) nochOffen.push(eintrag);
    }
    warteschlangeRef.current = nochOffen;
    setWarteschlangeGroesse(nochOffen.length);
    if (nochOffen.length === 0) setOfflineHinweis(false);
  }

  async function sendenEinmalig(frage, wert) {
    const w = wert || {};
    const finaleAuswahl = (frage.typ === "werte_auswahl" && (w.ranking || []).length)
      ? w.ranking
      : (w.auswahl || []);
    try {
      await base44.functions.invoke("interviewApi", {
        aktion: "saveAnswer",
        sessionToken,
        frageId: frage.id,
        data: {
          auswahl: finaleAuswahl,
          zahl: w.zahl,
          text: w.text || "",
          matrixWerte: w.matrixWerte || null,
          eingabeart: w.eingabeart || "tippen",
          transkriptKorrigiert: !!w.transkriptKorrigiert,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function antwortSpeichern(frage, wert) {
    if (testModus || !sessionToken) return;
    const ok = await sendenEinmalig(frage, wert);
    if (!ok) {
      // in Warteschlange aufnehmen und Hinweis einblenden
      const queue = warteschlangeRef.current;
      const vorhanden = queue.find((e) => e.frage.id === frage.id);
      if (vorhanden) vorhanden.wert = wert;
      else queue.push({ frage, wert });
      warteschlangeRef.current = queue;
      setWarteschlangeGroesse(queue.length);
      setOfflineHinweis(true);
      // nach kurzer Wartezeit einmal erneut versuchen
      setTimeout(() => { warteschlangeLeeren(); }, 2500);
    } else {
      // erfolgreich — falls diese Frage in der Warteschlange war, entfernen
      const queue = warteschlangeRef.current.filter((e) => e.frage.id !== frage.id);
      warteschlangeRef.current = queue;
      setWarteschlangeGroesse(queue.length);
      if (queue.length === 0) setOfflineHinweis(false);
    }
  }

  function istBeantwortet(frage, wert) {
    if (!wert) return false;
    if (frage.typ === "skala" || frage.typ === "ja_nein") return wert.zahl !== undefined && wert.zahl !== null;
    if (frage.typ === "schieberegler" || frage.typ === "gegensatzpaar") return wert.zahl !== undefined && wert.zahl !== null;
    if (frage.typ === "matrix") {
      const zeilen = matrixZeilenMitIds(frage);
      if (!zeilen.length) return false;
      const mw = wert.matrixWerte || {};
      return zeilen.every((z) => mw[z.id] !== undefined && mw[z.id] !== null);
    }
    if (frage.typ === "freitext") return !!(wert.text && wert.text.trim());
    if (frage.typ === "werte_auswahl") return (wert.ranking || []).length === 3;
    const anzahl = (wert.auswahl || []).length;
    if ((frage.typ === "multi_choice" || frage.typ === "limbic") && frage.minAuswahl) {
      return anzahl >= frage.minAuswahl;
    }
    return anzahl > 0;
  }

  const weiter = useCallback(async (expliziterWert) => {
    const item = fragenListe[currentIndex];
    if (!item) return;
    // Härte ab: ein React-Event-Objekt oder kein einfaches Objekt wird als
    // "nicht übergeben" behandelt, damit onClick={weiter} nicht die Antwort
    // überschreibt.
    if (expliziterWert !== undefined && (typeof expliziterWert !== "object" || expliziterWert === null || "nativeEvent" in expliziterWert)) {
      expliziterWert = undefined;
    }
    const wert = expliziterWert !== undefined ? expliziterWert : answers[item.frage.id];
    if (!testModus && item.frage.pflicht && !istBeantwortet(item.frage, wert)) return;

    await antwortSpeichern(item.frage, wert);
    // vor dem Weiter eventuell noch offene Antworten nachsenden
    await warteschlangeLeeren();

    const istLetzteImBlock = currentIndex === fragenListe.length - 1 ||
      fragenListe[currentIndex + 1].blockIndex !== item.blockIndex;
    const istLetzteUeberhaupt = currentIndex === fragenListe.length - 1;

    if (istLetzteUeberhaupt) {
      await abschliessen();
      return;
    }
    if (istLetzteImBlock) {
      // Zwischenseite nur, wenn für das nächste Kapitel ein Motivationstext hinterlegt ist.
      // Eine Seite, auf der nur „Kapitel x von y“ und „Weiter“ steht, ist ein Klick ohne Nutzen —
      // der Kapitelname steht ohnehin über jeder Frage.
      const naechstes = fragenListe[currentIndex + 1];
      if (String(naechstes.block?.motivationstext || "").trim()) {
        setNaechsterBlock(naechstes.block);
        setScreen("blockuebergang");
        return;
      }
    }
    setCurrentIndex(currentIndex + 1);
    setAnimKey((k) => k + 1);
  }, [currentIndex, fragenListe, answers, sessionToken, testModus]);

  weiterRef.current = weiter;

  // Automatisch weiter bei Einfachauswahl (Paket 5.3) — nur bei neuer Auswahl
  useEffect(() => {
    const item = fragenListe[currentIndex];
    if (!item || screen !== "frage") return;
    const typ = item.frage.typ;
    if (typ !== "single_choice" && typ !== "ja_nein") return;
    const wert = answers[item.frage.id];
    if (!istBeantwortet(item.frage, wert)) return;
    // FEHLER 1: keine Automatik bei Fragen, die beim Betreten schon beantwortet waren
    if (beimBetretenBeantwortetRef.current) return;
    const key = item.frage.id;
    const serialized = JSON.stringify(wert);
    if (autoWeiterStateRef.current[key] === serialized) return;
    autoWeiterStateRef.current[key] = serialized;
    const timer = setTimeout(() => {
      weiterRef.current?.();
    }, 480);
    return () => clearTimeout(timer);
  }, [answers, currentIndex, fragenListe, screen]); // eslint-disable-line react-hooks/exhaustive-deps

  async function zurueck() {
    if (currentIndex === 0) return;
    // FEHLER 2: aktuelle Antwort speichern, bevor zurückgegangen wird (ohne Pflichtprüfung)
    const item = fragenListe[currentIndex];
    if (item) await antwortSpeichern(item.frage, answers[item.frage.id]);
    await warteschlangeLeeren();
    setCurrentIndex(currentIndex - 1);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function ueberspringen() {
    const item = fragenListe[currentIndex];
    if (!item || item.frage.pflicht) return;
    // FEHLER 3: explizit leeren Wert speichern, nicht auf setAnswers+weiter() verlassen
    const leererWert = { auswahl: [], ranking: [], text: "", matrixWerte: {} };
    setAnswers({ ...answers, [item.frage.id]: leererWert });
    weiter(leererWert);
  }

  async function abschliessen() {
    // erst Warteschlange leeren, dann Abschluss (Paket 0.3)
    await warteschlangeLeeren();
    if (warteschlangeRef.current.length) {
      // ein zweiter Versuch mit Wartezeit
      await new Promise((r) => setTimeout(r, 1500));
      await warteschlangeLeeren();
    }
    if (testModus) {
      setScreen("abschluss");
      return;
    }
    try {
      await base44.functions.invoke("interviewApi", { aktion: "complete", sessionToken });
    } catch (e) {
      // dennoch Abschluss zeigen
    }
    setScreen("abschluss");
  }

  function blockuebergangWeiter() {
    setCurrentIndex(currentIndex + 1);
    setScreen("frage");
    setAnimKey((k) => k + 1);
  }

  const gesamt = fragenListe.length;
  const fortschritt = gesamt > 0 ? Math.round((currentIndex / gesamt) * 100) : 0;
  const verbleibendeBasisSek = fragenListe.slice(currentIndex).reduce(
    (s, item) => s + geschaetzteFrageDauerSekunden(item.frage.typ), 0
  );
  let pace = 1;
  if (startZeit && beantwortetCount > 0) {
    const verstrichenSek = (Date.now() - startZeit) / 1000;
    const basisBeantwortet = fragenListe.slice(0, currentIndex).reduce(
      (s, item) => s + geschaetzteFrageDauerSekunden(item.frage.typ), 0
    );
    if (basisBeantwortet > 0) pace = verstrichenSek / basisBeantwortet;
  }
  const verbleibendeMin = Math.max(1, Math.round((verbleibendeBasisSek * pace) / 60));
  // Gesamtdauer für die Startseite — dieselbe Rechnung wie die Restzeit im Kopf der Fragen,
  // damit beide Angaben zusammenpassen.
  const gesamtDauerMin = Math.max(1, Math.round(
    fragenListe.reduce((s, item) => s + geschaetzteFrageDauerSekunden(item.frage.typ), 0) / 60
  ));

  const a = anspracheFormen(projekt?.ansprache);
  // Kontext für Platzhalter im Fragetext ({{firma}}, {{du}}, {{siehst|sehen}} …)
  const textKontext = { firma: projekt?.firma, ansprache: projekt?.ansprache };

  // Kapitelübersicht für den Welcome-Screen (Paket 6 Vorarbeit)
  const kapitelUebersicht = [];
  fragenListe.forEach((item) => {
    if (!kapitelUebersicht[item.blockIndex]) {
      kapitelUebersicht[item.blockIndex] = { nr: item.blockIndex + 1, titel: item.block.titel, anzahl: 0 };
    }
    kapitelUebersicht[item.blockIndex].anzahl++;
  });
  const kapitelListe = kapitelUebersicht.filter(Boolean);
  const totalBloecke = kapitelUebersicht.filter(Boolean).length;
  const zielgruppeText = {
    geschaeftsfuehrung: "Geschäftsführungsbefragung",
    mitarbeiter: "Mitarbeiterbefragung",
    kunden: "Kundenbefragung",
    partner: "Partnerbefragung",
    allgemein: "Befragung",
  }[welle?.zielgruppe] || "Befragung";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--farbe-bg)" }}>
        <div className="flex flex-col items-center gap-4" role="status">
          <div className="interview-lader" aria-hidden="true" />
          <div className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Die Befragung wird geladen…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-md text-center">
          {error === "nicht_gefunden" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Link ungültig</h1>
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Dieser Link zur Befragung ist nicht gültig. Bitte prüfe den Link oder wende dich an die Person, die {a.klein} eingeladen hat.</p>
            </>
          )}
          {error === "entwurf" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Noch nicht freigeschaltet</h1>
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Diese Befragung ist noch in Vorbereitung. Sobald sie freigeschaltet ist, erreichst {a.duSie} sie über diesen Link.</p>
            </>
          )}
          {error === "geschlossen" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Befragung geschlossen</h1>
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Die Teilnahme an dieser Befragung ist leider beendet. Vielen Dank für das Interesse.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (gesamt === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Keine Fragen</h1>
          <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Diese Befragung enthält noch keine Fragen.</p>
        </div>
      </div>
    );
  }

  if (screen === "datenschutz") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-lg w-full">
          <button onClick={() => setScreen("welcome")} className="inline-flex items-center text-sm mb-6" style={{ color: "var(--farbe-grau-mid)" }}>
            <ArrowLeft size={16} className="mr-1" /> Zurück
          </button>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--farbe-text)" }}>Wie wir mit deinen Daten umgehen</h1>
          <div className="space-y-4 text-sm" style={{ color: "var(--farbe-text-daempft)", lineHeight: 1.7 }}>
            {welle.einladungsModus === "persoenlich" && einladungsToken ? (
              <p>{a.deinIhr.charAt(0).toUpperCase() + a.deinIhr.slice(1)}e Antworten sind anonym. Über {a.duSie === "Sie" ? "Ihren" : "deinen"} persönlichen Einladungslink vermerken wir nur, dass {a.duSie} begonnen {a.hastHaben} — damit wir niemanden unnötig erinnern. Welche Antworten von wem stammen, wird nicht gespeichert: Zwischen der E-Mail-Adresse und den Antworten gibt es keine Verbindung. Auch IP-Adresse und Gerät werden nicht erfasst.</p>
            ) : (
              <p>Diese Befragung ist vollständig anonym. Wir speichern keine Namen, keine E-Mail-Adressen und keinen Personenbezug. Auch IP-Adresse und Gerät werden nicht erfasst.</p>
            )}
            <p>Deine Antworten werden unter einem zufälligen Code gespeichert, der nur auf diesem Gerät liegt. So kannst du pausieren und später weitermachen — aber niemand kann die Antworten {a.dichSie} zuordnen.</p>
            <p>Einzelantworten sind für uns erst ab {welle.mindestTeilnehmer || 6} abgeschlossenen Befragungen einsehbar. Darunter bleiben alle Antworten gesperrt, damit niemand aus einer kleinen Gruppe Rückschlüsse ziehen kann.</p>
            <p>Es gibt kein richtig und kein falsch. {a.duSie.charAt(0).toUpperCase() + a.duSie.slice(1)} {a.kannstKönnen} jede Frage überspringen (außer Pflichtfragen) und jederzeit mit „Zurück&ldquo; zu einer vorherigen Antwort zurückkehren.</p>
            <p>Wenn {a.duSie} eine Frage per Sprache {a.duSie === "Sie" ? "beantworten" : "beantwortest"} (sofern angeboten), wird keine Audiodatei gespeichert. Die Umwandlung in Text übernimmt die Spracherkennung {a.duSie === "Sie" ? "Ihres" : "deines"} Browsers — dabei wird die Aufnahme kurzzeitig an dessen Dienst übertragen. Gespeichert wird bei uns nur der Text, den {a.duSie} danach {a.duSie === "Sie" ? "sehen und korrigieren können" : "siehst und korrigieren kannst"}.</p>
          </div>
          <RechtlicheFusszeile projekt={projekt} />
        </div>
      </div>
    );
  }

  if (screen === "welcome") {
    const zusicherungen = [
      welle.einladungsModus === "persoenlich" && einladungsToken
        ? { icon: Shield, lead: "Antworten bleiben anonym.", text: `Wir sehen nur, ob ${a.duSie} teilgenommen ${a.hastHaben} — nicht, was ${a.duSie} ${a.duSie === "Sie" ? "antworten" : "antwortest"}. Antworten werden ohne Name, E-Mail und Gerät gespeichert und erst ab ${welle.mindestTeilnehmer || 6} abgeschlossenen Befragungen überhaupt sichtbar.` }
        : { icon: Shield, lead: "Vollständig anonym.", text: `Wir sehen nicht, wer ${a.duSie} ${a.bistSind}. Es werden weder Name noch E-Mail noch Gerät gespeichert. Einzelantworten werden erst ab ${welle.mindestTeilnehmer || 6} abgeschlossenen Befragungen überhaupt sichtbar.` },
      { icon: Heart, lead: "Kein richtig, kein falsch.", text: `Zu jeder Frage gibt es eine Erklärung, warum wir sie stellen – einfach auf „Warum fragen wir das?“ tippen.` },
      { icon: Clock, lead: `Etwa ${gesamtDauerMin} Minuten.`, text: `Eine Frage pro Seite, ${a.duSie} ${a.kannstKönnen} jederzeit zurück.` },
      { icon: PauseCircle, lead: "Pausieren geht.", text: `${a.duSie === "Sie" ? "Schließen Sie" : "Schließ"} den Tab einfach — auf demselben Gerät geht es später dort weiter, wo ${a.duSie} aufgehört ${a.hastHaben}.` },
    ];
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-[560px] w-full">
          {projekt?.logoUrl && (
            <div className="flex justify-center mb-6">
              <img src={projekt.logoUrl} alt="" style={{ height: 52, width: "auto" }} className="object-contain" />
            </div>
          )}
          <div className="text-center mb-5" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--farbe-akzent)" }}>
            {zielgruppeText}
          </div>
          <h1 className="interview-welcome-heading text-center" style={{ color: "var(--farbe-text)", marginBottom: 26 }}>
            {welle.name}
          </h1>
          {welle.begruessungstext && (
            <p className="text-center" style={{ color: "var(--farbe-text-daempft)", fontSize: "16.5px", lineHeight: 1.65, marginBottom: 26, whiteSpace: "pre-line", textWrap: "pretty" }}>
              {platzhalterErsetzen(welle.begruessungstext, textKontext)}
            </p>
          )}

          <div style={{ border: "1px solid var(--farbe-linie)", borderRadius: 12, overflow: "hidden", marginBottom: 26 }}>
            {zusicherungen.map((z, i) => {
              const Icon = z.icon;
              return (
                <div key={i} className="flex items-start gap-3" style={{ padding: 16, borderBottom: i < zusicherungen.length - 1 ? "1px solid var(--farbe-linie)" : "none" }}>
                  <Icon size={20} style={{ color: "var(--farbe-akzent)" }} className="shrink-0 mt-0.5" />
                  <span style={{ fontSize: "14.5px", color: "var(--farbe-text)", lineHeight: 1.5 }}>
                    <strong style={{ fontWeight: 700 }}>{z.lead}</strong> {z.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Browser-Empfehlung: nur wenn es offene Fragen gibt (dort zählt die Spracheingabe) und
              noch nicht in diesem Browser begonnen wurde — sonst ginge der Zwischenstand verloren. */}
          {!kannFortsetzen && fragenListe.some((i) => i.frage.typ === "freitext") && (
            <BrowserHinweis ansprache={projekt?.ansprache} testName={testModus ? urlParams.get("browser") : null} />
          )}

          <div className="space-y-3" style={{ marginBottom: 34 }}>
            <div className="flex justify-center">
              <button onClick={starten} className="interview-btn-akzent" style={{ height: 58, fontSize: 17, paddingLeft: 38, paddingRight: 38 }}>
                {kannFortsetzen ? "Weitermachen" : "Befragung starten"}
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={() => setScreen("datenschutz")} className="text-sm hover:underline" style={{ color: "var(--farbe-grau-mid)", minHeight: 44 }}>
                Wie werden meine Daten gespeichert?
              </button>
            </div>
          </div>

          {kapitelListe.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--farbe-grau-mid)", marginBottom: 12 }}>
                {a.duSie === "Sie" ? "Das erwartet Sie" : "Das erwartet dich"}
              </div>
              <div style={{ borderTop: "1px solid var(--farbe-linie)" }}>
                {kapitelListe.map((k) => (
                  <div key={k.nr} className="flex items-center gap-3" style={{ padding: "12px 0", borderBottom: "1px solid var(--farbe-linie)" }}>
                    <span className="flex items-center justify-center shrink-0" style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--farbe-grau)", fontSize: "12.5px", fontWeight: 700, color: "var(--farbe-text)" }}>{k.nr}</span>
                    <span className="flex-1" style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--farbe-text)" }}>{kapitelTitelAnzeige(k.titel)}</span>
                    <span style={{ fontSize: "12.5px", color: "var(--farbe-grau-mid)" }}>{k.anzahl} {k.anzahl === 1 ? "Frage" : "Fragen"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <RechtlicheFusszeile projekt={projekt} />
        </div>
      </div>
    );
  }

  if (screen === "blockuebergang") {
    const naechstesItem = fragenListe[currentIndex + 1];
    const naechsterBlockIdx = naechstesItem?.blockIndex ?? 0;
    const blockNr = naechsterBlockIdx + 1;
    const blockTitel = kapitelTitelAnzeige(naechsterBlock?.titel);
    const titelAnzeigen = blockTitel && blockTitel !== "Neuer Block";
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-[560px] w-full text-center">
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--farbe-akzent)", marginBottom: 16 }}>
            Kapitel {blockNr} von {totalBloecke}
          </div>
          <div className="mx-auto mb-6" style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--farbe-akzent-hauch)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: "var(--farbe-akzent)" }}>{blockNr}</span>
          </div>
          {titelAnzeigen && (
            <h2 className="interview-fragetext" style={{ color: "var(--farbe-text)", marginBottom: 20 }}>
              {blockTitel}
            </h2>
          )}
          {naechsterBlock?.motivationstext && (
            <p style={{ color: "var(--farbe-text-daempft)", fontSize: "16.5px", lineHeight: 1.65, marginBottom: 26, whiteSpace: "pre-line", textWrap: "pretty" }}>
              {platzhalterErsetzen(naechsterBlock.motivationstext, textKontext)}
            </p>
          )}
          <button onClick={blockuebergangWeiter} className="interview-btn-akzent" style={{ paddingLeft: 32, paddingRight: 32 }}>
            Weiter
          </button>
        </div>
      </div>
    );
  }

  if (screen === "abschluss") {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-[560px] w-full text-center">
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--farbe-akzent)", marginBottom: 16 }}>
            Geschafft
          </div>
          <div className="mx-auto mb-6" style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--farbe-gut)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={32} strokeWidth={2.6} className="text-white" />
          </div>
          <h1 className="interview-welcome-heading" style={{ color: "var(--farbe-text)", marginBottom: 16 }}>
            Vielen <span style={{ color: "var(--farbe-akzent)" }}>Dank</span>!
          </h1>
          <p style={{ color: "var(--farbe-text-daempft)", fontSize: "16.5px", lineHeight: 1.65, marginBottom: 26 }}>
            {a.duSie === "Sie"
              ? "Danke, dass Sie sich die Zeit genommen haben. Ihre Antworten fließen anonymisiert in die Auswertung ein."
              : "Danke, dass du dir die Zeit genommen hast. Deine Antworten fließen anonymisiert in die Auswertung ein."}
          </p>
          {welle.abschlusstext && (
            <p style={{ color: "var(--farbe-text-daempft)", fontSize: "16px", lineHeight: 1.65, marginBottom: 26, whiteSpace: "pre-line", textWrap: "pretty" }}>
              {platzhalterErsetzen(welle.abschlusstext, textKontext)}
            </p>
          )}
          <RechtlicheFusszeile projekt={projekt} />
        </div>
      </div>
    );
  }

  const item = fragenListe[currentIndex];
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--farbe-bg)" }}>
        <button onClick={abschliessen} className="interview-btn-akzent px-8 py-3">Abschließen</button>
      </div>
    );
  }
  const frage = item.frage;
  const wert = answers[frage.id] || {};
  const blockNr = item.blockIndex + 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--farbe-bg)" }}>
      <div className="w-full h-1" style={{ background: "var(--farbe-linie)" }}>
        <div className="h-full transition-all duration-300" style={{ width: `${fortschritt}%`, background: "var(--farbe-akzent)" }} />
      </div>

      {testModus && (
        <div className="w-full text-center py-1.5 text-xs font-medium" style={{ background: "var(--farbe-akzent-hauch)", color: "var(--farbe-akzent-tief)" }}>
          Vorschau-Modus — keine Antworten werden gespeichert
        </div>
      )}

      <div className="flex-1 flex items-start justify-center px-5 pt-6 pb-6">
        <div key={animKey} className="max-w-[560px] w-full frage-uebergang-enter">
          {/* Kopf: Kapitelname als eigene Zeile (auch am Handy) — gibt gleich lautenden Fragen ihren Zusammenhang */}
          <div className="mb-6">
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--farbe-text)", marginBottom: 3 }}>
              {(kapitelTitelAnzeige(item.block.titel) && item.block.titel !== "Neuer Block")
                ? kapitelTitelAnzeige(item.block.titel)
                : `Kapitel ${blockNr}`}
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--farbe-grau-mid)", fontSize: "12.5px" }}>
              <span>Frage {currentIndex + 1} von {gesamt}</span>
              <span className="interview-trennpunkt" />
              <span>noch etwa {verbleibendeMin} Min.</span>
            </div>
          </div>
          <h2
            ref={frageHeadingRef}
            tabIndex={-1}
            className={`interview-fragetext outline-none ${sternchenEntfernen(platzhalterErsetzen(frage.text, textKontext)).length > 95 ? "interview-fragetext-lang" : ""}`}
            style={{ color: "var(--farbe-text)", marginBottom: 12 }}
            dangerouslySetInnerHTML={{ __html: renderFragetext(frage.text, textKontext, { polaritaet: frage.polaritaet }) }}
            aria-label={sternchenEntfernen(platzhalterErsetzen(frage.text, textKontext))}
          />
          {frage.hilfetext && (
            <p style={{ color: "var(--farbe-text-daempft)", fontSize: "16px", lineHeight: 1.6, marginBottom: 16 }}>
              {platzhalterErsetzen(frage.hilfetext, textKontext)}
            </p>
          )}
          <ErklaerungBlock
            frage={frage}
            textKontext={textKontext}
            offen={!!erklaerungOffen[frage.id]}
            onToggle={(offen) => setErklaerungOffen({ ...erklaerungOffen, [frage.id]: offen })}
          />
          <div className="mt-8">
            <FrageAntwort
              frage={frage}
              wert={wert}
              ansprache={projekt?.ansprache}
              textKontext={textKontext}
              onChange={(neu) => setAnswers({ ...answers, [frage.id]: neu })}
            />
          </div>
        </div>
      </div>

      <div className="interview-fusszeile">
        <div className="max-w-[560px] mx-auto flex items-center justify-between gap-3">
          <div>
            {currentIndex > 0 && (
              <button onClick={zurueck} aria-label="Zurück" className="inline-flex items-center text-sm hover:opacity-70" style={{ color: "var(--farbe-grau-mid)", minHeight: 48, minWidth: 44 }}>
                <ArrowLeft size={16} className="mr-1" /> <span className="interview-zurueck-wort">Zurück</span>
              </button>
            )}
          </div>
          <div className="interview-fuss-aktionen">
            {(!frage.pflicht || testModus) && (
              <button onClick={ueberspringen} className="text-sm hover:opacity-70" style={{ color: "var(--farbe-grau-mid)", minHeight: 48 }}>
                Überspringen
              </button>
            )}
            <button
              onClick={() => weiter()}
              disabled={!testModus && frage.pflicht && !istBeantwortet(frage, wert)}
              className="interview-btn-akzent interview-fuss-weiter"
            >
              {currentIndex === gesamt - 1 ? "Abschließen" : "Weiter"}
            </button>
          </div>
        </div>
        {offlineHinweis && (
          <div className="max-w-[560px] mx-auto mt-2 text-center text-xs" style={{ color: "var(--farbe-grau-mid)" }}>
            Verbindung unterbrochen, {a.deinIhr}e Antworten werden gleich nachgesendet.
          </div>
        )}
      </div>
    </div>
  );
}