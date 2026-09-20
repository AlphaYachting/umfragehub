import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Shield, Heart, Clock, PauseCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  themeVariablenSetzen,
  anspracheFormen,
  geschaetzteFrageDauerSekunden,
  renderFragetext,
  sternchenEntfernen,
} from "@/lib/interview";
import FrageAntwort from "@/components/interview/FrageAntwort";
import RechtlicheFusszeile from "@/components/interview/RechtlicheFusszeile";
import ErklaerungBlock from "@/components/interview/ErklaerungBlock";

export default function Interview() {
  const { linkToken } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const testModus = urlParams.get("test") === "1";

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

  const kannFortsetzen = !testModus && !!localStorage.getItem(`interview_${linkToken}`);

  const laden = useCallback(async () => {
    setLoading(true);
    try {
      const gespeichert = testModus ? null : localStorage.getItem(`interview_${linkToken}`);
      const res = await base44.functions.invoke("interviewApi", {
        aktion: "load",
        linkToken,
        sessionToken: gespeichert,
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
    if (screen === "frage") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [screen, currentIndex, animKey]);

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
      });
      const d = res?.data;
      if (d?.error) {
        setError(d.error);
        return;
      }
      setSessionToken(d.sessionToken);
      localStorage.setItem(`interview_${linkToken}`, d.sessionToken);
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
    const finaleAuswahl = (frage.typ === "werte_auswahl" && (wert.ranking || []).length)
      ? wert.ranking
      : (wert.auswahl || []);
    try {
      await base44.functions.invoke("interviewApi", {
        aktion: "saveAnswer",
        sessionToken,
        frageId: frage.id,
        data: {
          auswahl: finaleAuswahl,
          zahl: wert.zahl,
          text: wert.text || "",
          matrixWerte: wert.matrixWerte || null,
          eingabeart: wert.eingabeart || "tippen",
          transkriptKorrigiert: !!wert.transkriptKorrigiert,
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
      const zeilen = frage.matrixZeilen || [];
      if (!zeilen.length) return false;
      const gesetzt = Object.keys(wert.matrixWerte || {}).length;
      return gesetzt === zeilen.length;
    }
    if (frage.typ === "freitext") return !!(wert.text && wert.text.trim());
    if (frage.typ === "werte_auswahl") return (wert.ranking || []).length >= 1;
    return (wert.auswahl || []).length > 0;
  }

  const weiter = useCallback(async () => {
    const item = fragenListe[currentIndex];
    if (!item) return;
    const wert = answers[item.frage.id];
    if (item.frage.pflicht && !istBeantwortet(item.frage, wert)) return;

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
      setNaechsterBlock(fragenListe[currentIndex + 1].block);
      setScreen("blockuebergang");
      return;
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
    const key = item.frage.id;
    const serialized = JSON.stringify(wert);
    if (autoWeiterStateRef.current[key] === serialized) return;
    autoWeiterStateRef.current[key] = serialized;
    const timer = setTimeout(() => {
      weiterRef.current?.();
    }, 480);
    return () => clearTimeout(timer);
  }, [answers, currentIndex, fragenListe, screen]); // eslint-disable-line react-hooks/exhaustive-deps

  function zurueck() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function ueberspringen() {
    const item = fragenListe[currentIndex];
    if (!item || item.frage.pflicht) return;
    setAnswers({ ...answers, [item.frage.id]: null });
    weiter();
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

  const a = anspracheFormen(projekt?.ansprache);

  // Kapitelübersicht für den Welcome-Screen (Paket 6 Vorarbeit)
  const kapitelUebersicht = [];
  fragenListe.forEach((item) => {
    if (!kapitelUebersicht[item.blockIndex]) {
      kapitelUebersicht[item.blockIndex] = { nr: item.blockIndex + 1, titel: item.block.titel, anzahl: 0 };
    }
    kapitelUebersicht[item.blockIndex].anzahl++;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--farbe-bg)" }}>
        <div className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Lade Interview…</div>
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
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Dieser Interview-Link ist nicht gültig. Bitte prüfe den Link oder wende dich an die Person, die {a.klein} eingeladen hat.</p>
            </>
          )}
          {error === "entwurf" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Noch nicht freigeschaltet</h1>
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Dieses Interview ist noch in Vorbereitung. Sobald es freigeschaltet ist, erreichst {a.duSie} es über diesen Link.</p>
            </>
          )}
          {error === "geschlossen" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Interview geschlossen</h1>
              <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Die Teilnahme an diesem Interview ist leider beendet. Vielen Dank für das Interesse.</p>
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
          <p className="text-sm" style={{ color: "var(--farbe-grau-mid)" }}>Dieses Interview enthält noch keine Fragen.</p>
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
            <p>Diese Befragung ist vollständig anonym. Wir speichern keine Namen, keine E-Mail-Adressen und keinen Personenbezug. Auch IP-Adresse und Gerät werden nicht erfasst.</p>
            <p>Deine Antworten werden unter einem zufälligen Code gespeichert, der nur auf diesem Gerät liegt. So kannst du pausieren und später weitermachen — aber niemand kann die Antworten {a.dichSie} zuordnen.</p>
            <p>Einzelantworten sind für uns erst ab {welle.mindestTeilnehmer || 6} abgeschlossenen Interviews einsehbar. Darunter bleiben alle Antworten gesperrt, damit niemand aus einer kleinen Gruppe Rückschlüsse ziehen kann.</p>
            <p>Es gibt kein richtig und kein falsch. {a.duSie.charAt(0).toUpperCase() + a.duSie.slice(1)} {a.kannstKönnen} jede Frage überspringen (außer Pflichtfragen) und jederzeit mit „Zurück&ldquo; zu einer vorherigen Antwort zurückkehren.</p>
          </div>
          <RechtlicheFusszeile projekt={projekt} />
        </div>
      </div>
    );
  }

  if (screen === "welcome") {
    const zusicherungen = [
      { icon: Shield, text: `Vollständig anonym — wir können nicht sehen, wer ${a.duSie} ${a.bistSind}. Einzelantworten sind erst ab ${welle.mindestTeilnehmer || 6} Teilnehmern sichtbar.` },
      { icon: Heart, text: "Es gibt kein richtig und kein falsch — und zu jeder Frage gibt es eine kurze Erklärung, warum wir sie stellen." },
      { icon: Clock, text: `Dauert etwa ${welle.geschaetzteDauerMinuten || 10} Minuten — eine Frage pro Seite, jederzeit zurück.` },
    ];
    if (kannFortsetzen) {
      zusicherungen.push({ icon: PauseCircle, text: "Pausieren möglich — auf diesem Gerät geht es später genau da weiter, wo du aufgehört hast." });
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-xl w-full">
          {projekt?.logoUrl && (
            <div className="flex justify-center mb-8">
              <img src={projekt.logoUrl} alt="" className="h-16 w-auto object-contain" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-center" style={{ color: "var(--farbe-text)" }}>
            {welle.name}
          </h1>
          {welle.begruessungstext && (
            <p className="text-base mb-8 text-center" style={{ color: "var(--farbe-text-daempft)", lineHeight: 1.6 }}>
              {welle.begruessungstext}
            </p>
          )}

          {kapitelUebersicht.length > 0 && (
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--farbe-grau-mid)" }}>
                So ist die Befragung aufgebaut
              </div>
              <div className="space-y-2">
                {kapitelUebersicht.map((k) => (
                  <div key={k.nr} className="flex items-baseline gap-3 text-sm" style={{ color: "var(--farbe-text)" }}>
                    <span className="font-bold w-6 shrink-0" style={{ color: "var(--farbe-akzent)" }}>{k.nr}</span>
                    <span className="flex-1">{k.titel}</span>
                    <span className="text-xs" style={{ color: "var(--farbe-grau-mid)" }}>{k.anzahl} {k.anzahl === 1 ? "Frage" : "Fragen"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="divide-y mb-8" style={{ borderColor: "var(--farbe-grau)" }}>
            {zusicherungen.map((z, i) => {
              const Icon = z.icon;
              return (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <Icon size={20} style={{ color: "var(--farbe-akzent)" }} className="shrink-0 mt-0.5" />
                  <span className="text-sm" style={{ color: "var(--farbe-text)" }}>{z.text}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex justify-center">
              <button onClick={starten} className="interview-btn-akzent px-10 py-4 text-base">
                {kannFortsetzen ? "Weitermachen" : "Interview starten"}
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={() => setScreen("datenschutz")} className="text-sm hover:underline" style={{ color: "var(--farbe-grau-mid)" }}>
                Wie werden meine Daten gespeichert?
              </button>
            </div>
          </div>
          <RechtlicheFusszeile projekt={projekt} />
        </div>
      </div>
    );
  }

  if (screen === "blockuebergang") {
    const item = fragenListe[currentIndex];
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--farbe-gut)" }}>
              <Heart size={22} className="text-white" />
            </div>
          </div>
          {item?.block?.motivationstext && (
            <p className="text-lg mb-6" style={{ color: "var(--farbe-text)", lineHeight: 1.6 }}>
              {item.block.motivationstext}
            </p>
          )}
          {naechsterBlock && (
            <p className="text-sm mb-8" style={{ color: "var(--farbe-grau-mid)" }}>
              Weiter geht es mit: <span className="font-medium" style={{ color: "var(--farbe-text)" }}>{naechsterBlock.titel}</span>
            </p>
          )}
          <button onClick={blockuebergangWeiter} className="interview-btn-akzent px-8 py-3">
            Weiter
          </button>
        </div>
      </div>
    );
  }

  if (screen === "abschluss") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--farbe-bg)" }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: "var(--farbe-gut)" }}>
            <Heart size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--farbe-text)" }}>
            Vielen Dank!
          </h1>
          <p className="text-base mb-6" style={{ color: "var(--farbe-text-daempft)", lineHeight: 1.6 }}>
            {a.duSie.charAt(0).toUpperCase() + a.duSie.slice(1)} {a.hastHaben} {a.deinIhr}e Antworten wertvoll geteilt. Sie fließen anonymisiert in die Auswertung ein.
          </p>
          {welle.abschlusstext && (
            <p className="text-sm mb-6" style={{ color: "var(--farbe-grau-mid)", lineHeight: 1.6 }}>
              {welle.abschlusstext}
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
      <div className="w-full h-1" style={{ background: "var(--farbe-grau)" }}>
        <div className="h-full transition-all duration-300" style={{ width: `${fortschritt}%`, background: "var(--farbe-akzent)" }} />
      </div>

      <div className="flex-1 flex items-start justify-center px-6 pt-8 pb-32">
        <div key={animKey} className="max-w-[640px] w-full frage-uebergang-enter">
          <div className="text-xs mb-6 flex items-center gap-2" style={{ color: "var(--farbe-grau-mid)" }}>
            <span>Frage {currentIndex + 1} von {gesamt}</span>
            <span>·</span>
            <span className="hidden sm:inline">{item.block.titel} · </span>
            <span>noch etwa {verbleibendeMin} Min.</span>
          </div>
          <h2
            ref={frageHeadingRef}
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight mb-3 outline-none"
            style={{ color: "var(--farbe-text)", lineHeight: 1.3 }}
            dangerouslySetInnerHTML={{ __html: renderFragetext(frage.text) }}
            aria-label={sternchenEntfernen(frage.text)}
          />
          {frage.hilfetext && (
            <p className="text-sm mb-4" style={{ color: "var(--farbe-grau-mid)", lineHeight: 1.6 }}>
              {frage.hilfetext}
            </p>
          )}
          <ErklaerungBlock
            frage={frage}
            offen={!!erklaerungOffen[frage.id]}
            onToggle={(offen) => setErklaerungOffen({ ...erklaerungOffen, [frage.id]: offen })}
          />
          <div className="mt-6 mb-6">
            <FrageAntwort
              frage={frage}
              wert={wert}
              ansprache={projekt?.ansprache}
              onChange={(neu) => setAnswers({ ...answers, [frage.id]: neu })}
            />
          </div>
        </div>
      </div>

      <div className="interview-fusszeile px-6 py-4" style={{ background: "var(--farbe-bg)", borderTop: "1px solid var(--farbe-grau)" }}>
        <div className="max-w-[640px] mx-auto flex items-center justify-between gap-3">
          <div>
            {currentIndex > 0 && (
              <button onClick={zurueck} className="inline-flex items-center text-sm hover:opacity-70" style={{ color: "var(--farbe-grau-mid)", minHeight: 48 }}>
                <ArrowLeft size={16} className="mr-1" /> Zurück
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!frage.pflicht && (
              <button onClick={ueberspringen} className="text-sm hover:opacity-70" style={{ color: "var(--farbe-grau-mid)", minHeight: 48 }}>
                Überspringen
              </button>
            )}
            <button
              onClick={weiter}
              disabled={frage.pflicht && !istBeantwortet(frage, wert)}
              className="interview-btn-akzent px-8 py-3"
            >
              {currentIndex === gesamt - 1 ? "Abschließen" : "Weiter"}
            </button>
          </div>
        </div>
        {offlineHinweis && (
          <div className="max-w-[640px] mx-auto mt-2 text-center text-xs" style={{ color: "var(--farbe-grau-mid)" }}>
            Verbindung unterbrochen, {a.deinIhr}e Antworten werden gleich nachgesendet.
          </div>
        )}
      </div>
    </div>
  );
}