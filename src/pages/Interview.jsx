import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Shield, Heart, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  themeVariablenSetzen,
  anspracheFormen,
  generiereToken,
  geschaetzteFrageDauerSekunden,
} from "@/lib/interview";
import FrageAntwort from "@/components/interview/FrageAntwort";

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

  async function antwortSpeichern(frage, wert) {
    if (testModus || !sessionToken) return;
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
          eingabeart: wert.eingabeart || "tippen",
          transkriptKorrigiert: !!wert.transkriptKorrigiert,
        },
      });
    } catch (e) {
      // stiller Fehler — Interview nicht blockieren
    }
  }

  function istBeantwortet(frage, wert) {
    if (!wert) return false;
    if (frage.typ === "skala" || frage.typ === "ja_nein") return wert.zahl !== undefined && wert.zahl !== null;
    if (frage.typ === "freitext") return !!(wert.text && wert.text.trim());
    if (frage.typ === "werte_auswahl") return (wert.ranking || []).length >= 1;
    return (wert.auswahl || []).length > 0;
  }

  async function weiter() {
    const item = fragenListe[currentIndex];
    if (!item) return;
    const wert = answers[item.frage.id];
    if (item.frage.pflicht && !istBeantwortet(item.frage, wert)) return;

    await antwortSpeichern(item.frage, wert);

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
  }

  function zurueck() {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    setAnimKey((k) => k + 1);
  }

  function ueberspringen() {
    const item = fragenListe[currentIndex];
    if (!item || item.frage.pflicht) return;
    setAnswers({ ...answers, [item.frage.id]: null });
    weiter();
  }

  async function abschliessen() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--farbe-bg)" }}>
        <div className="text-sm text-slate-400">Lade Interview…</div>
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
              <p className="text-sm text-slate-500">Dieser Interview-Link ist nicht gültig. Bitte prüfe den Link oder wende dich an die Person, die {a.klein} eingeladen hat.</p>
            </>
          )}
          {error === "entwurf" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Noch nicht freigeschaltet</h1>
              <p className="text-sm text-slate-500">Dieses Interview ist noch in Vorbereitung. Sobald es freigeschaltet ist, erreichst {a.duSie} es über diesen Link.</p>
            </>
          )}
          {error === "geschlossen" && (
            <>
              <h1 className="text-xl font-bold mb-2" style={{ color: "var(--farbe-text)" }}>Interview geschlossen</h1>
              <p className="text-sm text-slate-500">Die Teilnahme an diesem Interview ist leider beendet. Vielen Dank für das Interesse.</p>
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
          <p className="text-sm text-slate-500">Dieses Interview enthält noch keine Fragen.</p>
        </div>
      </div>
    );
  }

  if (screen === "welcome") {
    const hinweise = [
      { icon: Shield, text: `Vollständig anonym — wir können nicht sehen, wer ${a.duSie} ${a.bistSind}.` },
      { icon: Heart, text: "Es gibt kein richtig und kein falsch." },
      { icon: Clock, text: `Dauert etwa ${welle.geschaetzteDauerMinuten || 10} Minuten — ${a.duSie} ${a.kannstKönnen} jederzeit pausieren.` },
    ];
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
            <p className="text-base text-slate-600 mb-8 text-center" style={{ lineHeight: 1.6 }}>
              {welle.begruessungstext}
            </p>
          )}
          <div className="space-y-3 mb-8">
            {hinweise.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: "var(--farbe-grau)" }}>
                  <Icon size={20} style={{ color: "var(--farbe-akzent)" }} className="shrink-0 mt-0.5" />
                  <span className="text-sm" style={{ color: "var(--farbe-text)" }}>{h.text}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button onClick={starten} className="interview-btn-akzent px-10 py-4 text-base">
              Interview starten
            </button>
          </div>
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
            <p className="text-sm text-slate-500 mb-8">
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
          <p className="text-base text-slate-600 mb-6" style={{ lineHeight: 1.6 }}>
            {a.duSie.charAt(0).toUpperCase() + a.duSie.slice(1)} {a.hastHaben} {a.deinIhr}e Antworten wertvoll geteilt. Sie fließen anonymisiert in die Auswertung ein.
          </p>
          {welle.abschlusstext && (
            <p className="text-sm text-slate-500" style={{ lineHeight: 1.6 }}>
              {welle.abschlusstext}
            </p>
          )}
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
          <div className="text-xs text-slate-400 mb-6">
            Block {blockNr} von {item.blockCount} · noch etwa {verbleibendeMin} Minuten
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3" style={{ color: "var(--farbe-text)", lineHeight: 1.3 }}>
            {frage.text}
          </h2>
          {frage.hilfetext && (
            <p className="text-sm text-slate-400 mb-6" style={{ lineHeight: 1.6 }}>
              {frage.hilfetext}
            </p>
          )}
          <div className="mb-6">
            <FrageAntwort
              frage={frage}
              wert={wert}
              ansprache={projekt?.ansprache}
              onChange={(neu) => setAnswers({ ...answers, [frage.id]: neu })}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 py-4" style={{ background: "var(--farbe-bg)", borderTop: "1px solid var(--farbe-grau)" }}>
        <div className="max-w-[640px] mx-auto flex items-center justify-between gap-3">
          <div>
            {currentIndex > 0 && (
              <button onClick={zurueck} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800" style={{ minHeight: 48 }}>
                <ArrowLeft size={16} className="mr-1" /> Zurück
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!frage.pflicht && (
              <button onClick={ueberspringen} className="text-sm text-slate-400 hover:text-slate-600" style={{ minHeight: 48 }}>
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
      </div>
    </div>
  );
}