import React, { useState, useEffect, useMemo, useRef } from "react";
import { ThumbsUp, ThumbsDown, HelpCircle, Undo2, X } from "lucide-react";
import {
  anzahlJeSeite,
  begriffeDerFrage,
  gemischt,
  neuerSeed,
  listenAusAuswahl,
  auswahlAusListen,
  SORT_PASST,
  SORT_WEISS_NICHT,
  SORT_PASST_NICHT,
} from "@/lib/werteSortierer";

// Werte-Sortierer für Befragte — drei Schritte auf einer Frageseite:
//   1. Sortieren (Karte für Karte, Wischen oder Pfeiltasten)
//   2. Die N treffendsten aus dem „Passt“-Stapel
//   3. Die N unpassendsten aus dem „Passt nicht“-Stapel
// Farben bewusst neutral (wie alle Antworten der Befragung): Rot und Grün würden Antworten werten.

const REDUZIERTE_BEWEGUNG = typeof window !== "undefined" &&
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function nachObenScrollen() {
  window.scrollTo({ top: 0, behavior: "auto" });
}

export default function WerteSortierer({ frage, wert, onChange, ansprache, textKontext }) {
  const v = wert || {};
  const sie = ansprache === "sie";
  const firma = String(textKontext?.firma || "").trim();
  const N = anzahlJeSeite(frage);
  const begriffe = useMemo(() => begriffeDerFrage(frage), [frage.optionen]); // eslint-disable-line react-hooks/exhaustive-deps
  const [seed] = useState(() => (Number(v.zahl) > 0 ? Number(v.zahl) : neuerSeed()));
  const reihenfolge = useMemo(() => gemischt(begriffe, seed), [begriffe, seed]);
  const sortierung = v.matrixWerte || {};
  const { ist, nicht } = listenAusAuswahl(v.auswahl);

  const offenIndex = reihenfolge.findIndex((b) => sortierung[b] === undefined);
  const sortFertig = offenIndex < 0;
  const position = sortFertig ? reihenfolge.length : offenIndex;

  const [phase, setPhase] = useState(() => {
    if (!sortFertig) return "sort";
    if (ist.length < N) return "best";
    if (nicht.length < N) return "worst";
    return "worst";
  });
  const [alleZeigen, setAlleZeigen] = useState(false);
  const [tippGesehen, setTippGesehen] = useState(position > 0);
  const [mausGeraet] = useState(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  const karteRef = useRef(null);
  const beschaeftigt = useRef(false);
  const aktuellerWert = useRef(v);
  aktuellerWert.current = v;

  function speichern(neueSortierung, neuIst, neuNicht) {
    onChange({
      ...aktuellerWert.current,
      matrixWerte: neueSortierung,
      auswahl: auswahlAusListen(neuIst, neuNicht),
      zahl: seed,
    });
  }

  // Sortieren abgeschlossen → Schritt 2
  useEffect(() => {
    if (phase === "sort" && sortFertig) {
      setPhase("best");
    }
  }, [phase, sortFertig]);

  // Beim Betreten eines Auswahlschritts: Stapel mit höchstens N Begriffen ist schon „gewählt“
  useEffect(() => {
    if (phase !== "best" && phase !== "worst") return;
    setAlleZeigen(false);
    nachObenScrollen();
    const schluessel = phase === "best" ? SORT_PASST : SORT_PASST_NICHT;
    const stapel = reihenfolge.filter((b) => sortierung[b] === schluessel);
    const gewaehlt = phase === "best" ? ist : nicht;
    const gesperrt = phase === "best" ? nicht : ist;
    if (gewaehlt.length === 0 && stapel.length > 0 && stapel.length <= N) {
      const vorbelegt = stapel.filter((b) => !gesperrt.includes(b));
      if (phase === "best") speichern(sortierung, vorbelegt, nicht);
      else speichern(sortierung, ist, vorbelegt);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function entscheiden(wertung) {
    if (beschaeftigt.current || phase !== "sort" || sortFertig) return;
    beschaeftigt.current = true;
    setTippGesehen(true);
    const begriff = reihenfolge[position];
    const karte = karteRef.current;
    const fertig = () => {
      beschaeftigt.current = false;
      speichern({ ...sortierung, [begriff]: wertung }, ist.filter((b) => b !== begriff), nicht.filter((b) => b !== begriff));
    };
    if (karte && !REDUZIERTE_BEWEGUNG) {
      const dx = wertung === SORT_PASST ? 1 : wertung === SORT_PASST_NICHT ? -1 : 0;
      karte.style.transition = "transform 0.2s ease, opacity 0.2s ease";
      karte.style.transform = dx ? `translateX(${dx * 120}%) rotate(${dx * 12}deg)` : "translateY(50%) scale(0.92)";
      karte.style.opacity = "0";
      setTimeout(fertig, 190);
    } else {
      fertig();
    }
  }

  function rueckgaengig() {
    if (position === 0) return;
    const letzter = reihenfolge[position - 1];
    const neu = { ...sortierung };
    delete neu[letzter];
    setPhase("sort");
    speichern(neu, ist.filter((b) => b !== letzter), nicht.filter((b) => b !== letzter));
  }

  // Tastatur: ← passt nicht · ↓ weiß nicht · → passt · Rücktaste = zurück
  useEffect(() => {
    if (phase !== "sort") return;
    function taste(e) {
      const ziel = e.target;
      if (ziel && (ziel.tagName === "INPUT" || ziel.tagName === "TEXTAREA" || ziel.isContentEditable)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); entscheiden(SORT_PASST); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); entscheiden(SORT_PASST_NICHT); }
      else if (e.key === "ArrowDown") { e.preventDefault(); entscheiden(SORT_WEISS_NICHT); }
      else if (e.key === "Backspace") { e.preventDefault(); rueckgaengig(); }
    }
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }); // bewusst ohne Abhängigkeiten: immer mit aktuellem Stand

  // Wischen
  const zug = useRef({ x0: null, y0: null, dx: 0, dy: 0 });
  function zeigerRunter(e) {
    if (beschaeftigt.current) return;
    zug.current = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0 };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* egal */ }
    if (karteRef.current) karteRef.current.style.transition = "none";
  }
  function zeigerBewegen(e) {
    const z = zug.current;
    if (z.x0 === null || !karteRef.current) return;
    z.dx = e.clientX - z.x0;
    z.dy = Math.max(0, e.clientY - z.y0);
    karteRef.current.style.transform = `translate(${z.dx}px, ${z.dy * 0.4}px) rotate(${z.dx / 18}deg)`;
    const k = karteRef.current;
    k.querySelector("[data-etikett='l']").style.opacity = String(Math.min(1, -z.dx / 90));
    k.querySelector("[data-etikett='r']").style.opacity = String(Math.min(1, z.dx / 90));
    k.querySelector("[data-etikett='u']").style.opacity = String(Math.abs(z.dx) < 40 ? Math.min(1, z.dy / 110) : 0);
  }
  function zeigerHoch() {
    const z = zug.current;
    if (z.x0 === null) return;
    zug.current = { x0: null, y0: null, dx: 0, dy: 0 };
    if (z.dx > 90) return entscheiden(SORT_PASST);
    if (z.dx < -90) return entscheiden(SORT_PASST_NICHT);
    if (z.dy > 110 && Math.abs(z.dx) < 60) return entscheiden(SORT_WEISS_NICHT);
    const k = karteRef.current;
    if (k) {
      k.style.transition = "transform 0.2s ease";
      k.style.transform = "";
      k.querySelectorAll("[data-etikett]").forEach((el) => { el.style.opacity = "0"; });
    }
  }

  // ---------------------------------------------------------------- Schritt 1
  if (phase === "sort" && !sortFertig) {
    const aktuell = reihenfolge[position];
    const naechster = reihenfolge[position + 1];
    const zaehle = (w) => Object.values(sortierung).filter((x) => x === w).length;
    return (
      <div className="ws">
        <div className="ws-kopf">
          <span className="ws-schritt">Schritt 1 von 3 · Sortieren</span>
          <span className="ws-zahl">{position + 1} von {reihenfolge.length}</span>
        </div>
        <div className="ws-balken" aria-hidden="true"><i style={{ width: `${(position / reihenfolge.length) * 100}%` }} /></div>

        <p className="ws-frage">Passt das zu {firma || "dem Unternehmen"}?</p>

        <div className="ws-stapel">
          {naechster && <div className="ws-karte ws-karte-hinten" aria-hidden="true"><span>{naechster}</span></div>}
          <div
            key={aktuell}
            ref={karteRef}
            className="ws-karte"
            role="group"
            aria-label={`Begriff: ${aktuell}`}
            onPointerDown={zeigerRunter}
            onPointerMove={zeigerBewegen}
            onPointerUp={zeigerHoch}
            onPointerCancel={zeigerHoch}
          >
            <span data-etikett="l" className="ws-etikett ws-etikett-l">Passt nicht</span>
            <span data-etikett="u" className="ws-etikett ws-etikett-u">Weiß nicht</span>
            <span data-etikett="r" className="ws-etikett ws-etikett-r">Passt</span>
            <span className="ws-wort">{aktuell}</span>
            {!tippGesehen && (
              <div className="ws-tipp" onPointerDown={(e) => e.stopPropagation()}>
                <span>
                  {mausGeraet ? (
                    <><b>Tipp:</b> <kbd>←</kbd> passt nicht · <kbd>↓</kbd> weiß nicht · <kbd>→</kbd> passt · <kbd>⌫</kbd> zurück</>
                  ) : (
                    <><b>Tipp:</b> Karte nach rechts wischen = passt, nach links = passt nicht, nach unten = weiß nicht.</>
                  )}
                </span>
                <button type="button" aria-label="Tipp schließen" onClick={() => setTippGesehen(true)}><X size={16} /></button>
              </div>
            )}
          </div>
        </div>

        <div className="ws-knoepfe">
          <button type="button" className="ws-knopf" onClick={() => entscheiden(SORT_PASST_NICHT)}>
            <ThumbsDown size={20} strokeWidth={2.2} />
            <span>Passt nicht</span>
            {mausGeraet && <kbd>←</kbd>}
          </button>
          <button type="button" className="ws-knopf ws-knopf-mitte" onClick={() => entscheiden(SORT_WEISS_NICHT)}>
            <HelpCircle size={20} strokeWidth={2.2} />
            <span>Weiß nicht</span>
            {mausGeraet && <kbd>↓</kbd>}
          </button>
          <button type="button" className="ws-knopf" onClick={() => entscheiden(SORT_PASST)}>
            <ThumbsUp size={20} strokeWidth={2.2} />
            <span>Passt</span>
            {mausGeraet && <kbd>→</kbd>}
          </button>
        </div>

        <div className="ws-stapelzahlen">
          <span>Passt nicht <b>{zaehle(SORT_PASST_NICHT)}</b></span>
          <span>Weiß nicht <b>{zaehle(SORT_WEISS_NICHT)}</b></span>
          <span>Passt <b>{zaehle(SORT_PASST)}</b></span>
        </div>

        <div className="ws-fuss">
          {position > 0 ? (
            <button type="button" className="ws-link" onClick={rueckgaengig}>
              <Undo2 size={14} /> Letzte Karte zurück{mausGeraet ? " (Rücktaste)" : ""}
            </button>
          ) : <span />}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Schritt 2 und 3
  const istBest = phase !== "worst";
  const schluessel = istBest ? SORT_PASST : SORT_PASST_NICHT;
  const gewaehlt = istBest ? ist : nicht;
  const gesperrt = istBest ? nicht : ist;
  const voll = gewaehlt.length >= N;
  const stapel = reihenfolge.filter((b) => sortierung[b] === schluessel && !gesperrt.includes(b));
  const unsicher = reihenfolge.filter((b) => sortierung[b] === SORT_WEISS_NICHT && !gesperrt.includes(b));
  const gegenseite = reihenfolge.filter((b) => sortierung[b] === (istBest ? SORT_PASST_NICHT : SORT_PASST) && !gesperrt.includes(b));
  const fehlen = Math.max(0, N - stapel.length);

  const gruppen = [[`${sie ? "Ihr" : "Dein"} „${istBest ? "Passt" : "Passt nicht"}“-Stapel`, stapel]];
  if (fehlen > 0 || alleZeigen) gruppen.push(["Weiß nicht", unsicher]);
  if (alleZeigen) gruppen.push([istBest ? "Passt nicht" : "Passt", gegenseite]);
  const sichtbareGruppen = gruppen.filter(([, liste]) => liste.length > 0);

  function umschalten(b) {
    const liste = [...gewaehlt];
    const i = liste.indexOf(b);
    if (i >= 0) liste.splice(i, 1);
    else if (liste.length < N) liste.push(b);
    else return;
    if (istBest) speichern(sortierung, liste, nicht);
    else speichern(sortierung, ist, liste);
  }

  const titel = istBest
    ? `Welche ${N} beschreiben ${firma || "das Unternehmen"} am besten?`
    : `Und umgekehrt: Welche ${N} passen am wenigsten zu ${firma || "dem Unternehmen"}?`;
  const hinweis = fehlen > 0
    ? `${sie ? "Ihr" : "Dein"} Stapel hat nur ${stapel.length}. ${sie ? "Ergänzen Sie" : "Ergänze"} aus „Weiß nicht“.`
    : stapel.length === N && gewaehlt.length === N
      ? `Genau ${N} in ${sie ? "Ihrem" : "deinem"} Stapel – die sind schon eingetragen.`
      : `${sie ? "Tippen Sie" : "Tippe"} die Begriffe in der Reihenfolge an, wie gut sie ${istBest ? "passen" : "nicht passen"}. Nochmal tippen nimmt sie wieder raus.`;

  return (
    <div className="ws">
      <div className="ws-kopf">
        <span className="ws-schritt">Schritt {istBest ? 2 : 3} von 3 · {istBest ? "Steht für" : "Steht nicht für"}</span>
      </div>
      <h3 className="ws-titel">{titel}</h3>
      <p className="ws-hinweis">{hinweis}</p>

      <ol className="ws-plaetze">
        {Array.from({ length: N }, (_, i) => {
          const b = gewaehlt[i];
          if (b) {
            return (
              <li key={i}>
                <button type="button" className="ws-platz ws-platz-belegt" onClick={() => umschalten(b)} aria-label={`Platz ${i + 1}: ${b} – entfernen`}>
                  <span className="ws-platz-nr">{i + 1}</span>
                  <span className="ws-platz-text">{b}</span>
                  <span className="ws-platz-weg">entfernen</span>
                </button>
              </li>
            );
          }
          return (
            <li key={i}>
              <div className={`ws-platz ${i === gewaehlt.length ? "ws-platz-naechster" : ""}`}>
                <span className="ws-platz-nr">{i + 1}</span>
                <span className="ws-platz-text">{i === gewaehlt.length ? `${sie ? "Tippen Sie" : "Tippe"} unten auf einen Begriff` : ""}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {sichtbareGruppen.map(([ueberschrift, liste]) => (
        <div key={ueberschrift} className="ws-gruppe">
          <div className="ws-gruppe-kopf"><span>{ueberschrift}</span><span>{liste.length}</span></div>
          <div className="ws-raster">
            {liste.map((b) => {
              const rang = gewaehlt.indexOf(b);
              const belegt = rang >= 0;
              return (
                <button
                  key={b}
                  type="button"
                  aria-pressed={belegt}
                  className={`ws-begriff ${belegt ? "ws-begriff-belegt" : ""} ${!belegt && voll ? "ws-begriff-blass" : ""}`}
                  onClick={() => umschalten(b)}
                >
                  <span className="ws-begriff-text">{b}</span>
                  <span className="ws-begriff-zeichen">{belegt ? rang + 1 : "+"}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!alleZeigen && fehlen === 0 && (unsicher.length + gegenseite.length) > 0 && (
        <button type="button" className="ws-link" onClick={() => setAlleZeigen(true)}>
          Nicht dabei? Alle übrigen Begriffe zeigen
        </button>
      )}

      <div className="ws-aktionen">
        {istBest ? (
          <>
            <button type="button" className="interview-btn-akzent ws-weiter" disabled={!voll} onClick={() => setPhase("worst")}>
              Weiter zu Schritt 3
            </button>
            <button type="button" className="ws-link" onClick={rueckgaengig}>
              <Undo2 size={14} /> Zurück zum Sortieren
            </button>
          </>
        ) : (
          <>
            <p className="ws-hinweis" style={{ margin: 0 }}>
              {voll
                ? `Fertig. ${sie ? "Tippen Sie" : "Tippe"} unten auf „Weiter“.`
                : `Noch ${N - gewaehlt.length} ${N - gewaehlt.length === 1 ? "Begriff" : "Begriffe"}.`}
            </p>
            <button type="button" className="ws-link" onClick={() => setPhase("best")}>
              <Undo2 size={14} /> Zurück zu Schritt 2
            </button>
          </>
        )}
      </div>
    </div>
  );
}
