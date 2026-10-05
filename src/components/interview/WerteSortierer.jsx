import React, { useState, useEffect, useMemo, useRef } from "react";
import { ThumbsUp, ThumbsDown, HelpCircle, Undo2 } from "lucide-react";
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

export default function WerteSortierer({ frage, wert, onChange, ansprache, textKontext, onStatus, weiterAbfangen }) {
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

  const nichtsSortiert = Object.keys(sortierung).length === 0;
  const [phase, setPhase] = useState(() => {
    if (!sortFertig) return nichtsSortiert ? "intro" : "sort";
    if (ist.length < N) return "best";
    if (nicht.length < N) return "worst";
    return "worst";
  });
  const [alleZeigen, setAlleZeigen] = useState(false);
  const [mausGeraet] = useState(() =>
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
  // Weggeworfene Karte fliegt als eigene Kopie hinaus — die nächste Karte ist sofort bedienbar
  const [flug, setFlug] = useState(null);

  const karteRef = useRef(null);
  // Immer der neueste Antwortstand — auch wenn schnell hintereinander gewischt/getippt wird,
  // bevor React neu gezeichnet hat
  const aktuellerWert = useRef(v);
  aktuellerWert.current = v;

  function speichern(neueSortierung, neuIst, neuNicht) {
    const neu = {
      ...aktuellerWert.current,
      matrixWerte: neueSortierung,
      auswahl: auswahlAusListen(neuIst, neuNicht),
      zahl: seed,
    };
    aktuellerWert.current = neu;
    onChange(neu);
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

  // Eine Entscheidung — rechnet immer mit dem neuesten Stand (aktuellerWert), nicht mit dem
  // Stand der letzten Zeichnung. So geht auch bei sehr schnellem Wischen nichts verloren.
  function entscheiden(wertung, start = { dx: 0, dy: 0 }) {
    if (phase !== "sort") return;
    const stand = aktuellerWert.current || {};
    const sort = stand.matrixWerte || {};
    const idx = reihenfolge.findIndex((b) => sort[b] === undefined);
    if (idx < 0) return;
    const begriff = reihenfolge[idx];
    const listen = listenAusAuswahl(stand.auswahl);
    if (!REDUZIERTE_BEWEGUNG) {
      setFlug({ begriff, wertung, dx: start.dx, dy: start.dy, id: `${begriff}-${Date.now()}` });
    }
    speichern(
      { ...sort, [begriff]: wertung },
      listen.ist.filter((b) => b !== begriff),
      listen.nicht.filter((b) => b !== begriff)
    );
  }

  function rueckgaengig() {
    const stand = aktuellerWert.current || {};
    const sort = stand.matrixWerte || {};
    const idx = reihenfolge.findIndex((b) => sort[b] === undefined);
    const pos = idx < 0 ? reihenfolge.length : idx;
    if (pos === 0) return;
    const letzter = reihenfolge[pos - 1];
    const neu = { ...sort };
    delete neu[letzter];
    const listen = listenAusAuswahl(stand.auswahl);
    setFlug(null);
    setPhase("sort");
    speichern(neu, listen.ist.filter((b) => b !== letzter), listen.nicht.filter((b) => b !== letzter));
  }

  // Den Weiter-Knopf der Fußzeile steuern: welche Beschriftung, ob er aktiv ist, und was er tut.
  // So gibt es auf jeder Stufe genau EINEN Weiter-Knopf — unten, wo er immer ist.
  const voll = (phase === "best" ? ist.length : nicht.length) >= N;
  const statusText = JSON.stringify({ phase, voll });
  const letzterStatus = useRef("");
  useEffect(() => {
    if (!onStatus || statusText === letzterStatus.current) return;
    letzterStatus.current = statusText;
    if (phase === "intro") onStatus({ kannWeiter: true, beschriftung: "Los geht's" });
    else if (phase === "sort") onStatus({ kannWeiter: false, beschriftung: "Weiter" });
    else if (phase === "best") onStatus({ kannWeiter: voll, beschriftung: "Weiter zu Schritt 3" });
    else onStatus({ kannWeiter: voll, beschriftung: null });
  });
  useEffect(() => () => { if (onStatus) onStatus(null); if (weiterAbfangen) weiterAbfangen(null); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Gibt true zurück, wenn der Klick innerhalb des Moduls verarbeitet wurde
  if (weiterAbfangen) {
    weiterAbfangen(() => {
      if (phase === "intro") { setPhase("sort"); return true; }
      if (phase === "best" && voll) { setPhase("worst"); return true; }
      return false;
    });
  }

  // Tastatur: ← passt nicht · ↓ weiß nicht · → passt · Rücktaste = zurück · Enter startet
  useEffect(() => {
    if (phase !== "sort" && phase !== "intro") return;
    function taste(e) {
      const ziel = e.target;
      if (ziel && (ziel.tagName === "INPUT" || ziel.tagName === "TEXTAREA" || ziel.isContentEditable)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (phase === "intro") {
        if (e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); setPhase("sort"); }
        return;
      }
      if (e.repeat) return;
      if (e.key === "ArrowRight") { e.preventDefault(); entscheiden(SORT_PASST); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); entscheiden(SORT_PASST_NICHT); }
      else if (e.key === "ArrowDown") { e.preventDefault(); entscheiden(SORT_WEISS_NICHT); }
      else if (e.key === "Backspace") { e.preventDefault(); rueckgaengig(); }
    }
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }); // bewusst ohne Abhängigkeiten: immer mit aktuellem Stand

  // Wischen — Zeiger-Ereignisse (Finger, Maus, Stift). Entschieden wird nach Weg ODER Tempo:
  // ein kurzer, schneller Wisch zählt genauso wie ein langer, langsamer.
  const zug = useRef(null);
  function etiketten(dx, dy) {
    const k = karteRef.current;
    if (!k) return;
    const setze = (sel, o) => { const el = k.querySelector(sel); if (el) el.style.opacity = String(Math.max(0, Math.min(1, o))); };
    setze("[data-etikett='l']", -dx / 80);
    setze("[data-etikett='r']", dx / 80);
    setze("[data-etikett='u']", Math.abs(dx) < 40 ? dy / 100 : 0);
  }
  function karteZuruecksetzen() {
    const k = karteRef.current;
    if (!k) return;
    k.style.transition = "transform 0.18s ease";
    k.style.transform = "";
    etiketten(0, 0);
  }
  function zeigerRunter(e) {
    if (e.button !== undefined && e.button > 0) return; // nur Hauptknopf / erster Finger
    if (zug.current) return;
    zug.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, t0: performance.now(), tx: performance.now(), xv: e.clientX, yv: e.clientY, vx: 0, vy: 0 };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* nicht überall */ }
    if (karteRef.current) karteRef.current.style.transition = "none";
  }
  function zeigerBewegen(e) {
    const z = zug.current;
    if (!z || e.pointerId !== z.id || !karteRef.current) return;
    const jetzt = performance.now();
    const dt = Math.max(1, jetzt - z.tx);
    z.vx = (e.clientX - z.xv) / dt;
    z.vy = (e.clientY - z.yv) / dt;
    z.xv = e.clientX; z.yv = e.clientY; z.tx = jetzt;
    z.dx = e.clientX - z.x0;
    z.dy = Math.max(0, e.clientY - z.y0);
    karteRef.current.style.transform = `translate(${z.dx}px, ${z.dy * 0.5}px) rotate(${z.dx / 18}deg)`;
    etiketten(z.dx, z.dy);
  }
  function zeigerHoch(e) {
    const z = zug.current;
    if (!z || (e && e.pointerId !== undefined && e.pointerId !== z.id)) return;
    zug.current = null;
    const { dx, dy, vx, vy } = z;
    const seitlich = Math.abs(dx) >= Math.abs(dy);
    const weitGenug = seitlich ? Math.abs(dx) > 80 : dy > 90;
    const schnellGenug = seitlich ? Math.abs(dx) > 30 && Math.abs(vx) > 0.45 : dy > 30 && vy > 0.45;
    if (weitGenug || schnellGenug) {
      const wertung = seitlich ? (dx > 0 ? SORT_PASST : SORT_PASST_NICHT) : SORT_WEISS_NICHT;
      entscheiden(wertung, { dx, dy: dy * 0.5 });
      return;
    }
    karteZuruecksetzen();
  }

  // ---------------------------------------------------------------- Einleitung
  if (phase === "intro") {
    const anzahl = reihenfolge.length;
    const minuten = Math.max(1, Math.round((anzahl * 2 + 40) / 60));
    const name = firma || "das Unternehmen";
    return (
      <div className="ws ws-intro">
        <div className="ws-kopf"><span className="ws-schritt">So geht's</span></div>
        <ol className="ws-schritte">
          <li>
            <span className="ws-schritte-nr">1</span>
            <span>
              <b>Sortieren:</b> {sie ? "Sie sehen" : "Du siehst"} {anzahl} Begriffe, immer nur einen. Passt er zu {name}, passt er nicht, oder {sie ? "wissen Sie" : "weißt du"} es nicht?
              <span className="ws-schritte-zusatz">
                {mausGeraet
                  ? <>Am schnellsten mit den Pfeiltasten <kbd>←</kbd> passt nicht · <kbd>↓</kbd> weiß nicht · <kbd>→</kbd> passt.</>
                  : <>Karte nach rechts wischen = passt, nach links = passt nicht, nach unten = weiß nicht. Oder {sie ? "tippen Sie" : "tippe"} auf die Knöpfe.</>}
              </span>
            </span>
          </li>
          <li>
            <span className="ws-schritte-nr">2</span>
            <span><b>Die {N} treffendsten</b> aus {sie ? "Ihrem" : "deinem"} „Passt“-Stapel auswählen.</span>
          </li>
          <li>
            <span className="ws-schritte-nr">3</span>
            <span><b>Die {N} unpassendsten</b> aus {sie ? "Ihrem" : "deinem"} „Passt nicht“-Stapel auswählen.</span>
          </li>
        </ol>
        <p className="ws-hinweis">
          Dauer etwa {minuten} {minuten === 1 ? "Minute" : "Minuten"}. {sie ? "Entscheiden Sie" : "Entscheide"} aus dem Bauch heraus — es gibt kein richtig oder falsch.
        </p>
        <p className="ws-hinweis ws-unten-hinweis">
          {sie ? "Tippen Sie" : "Tippe"} unten auf „Los geht's“{mausGeraet ? (sie ? " oder drücken Sie Enter" : " oder drücke Enter") : ""}.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------- Schritt 1
  if (phase === "sort" && !sortFertig) {
    const aktuell = reihenfolge[position];
    const naechster = reihenfolge[position + 1];
    const zaehle = (w) => Object.values(sortierung).filter((x) => x === w).length;
    const flugKlasse = flug
      ? (flug.wertung === SORT_PASST ? "ws-flug-r" : flug.wertung === SORT_PASST_NICHT ? "ws-flug-l" : "ws-flug-u")
      : "";
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
            onLostPointerCapture={zeigerHoch}
            onDragStart={(e) => e.preventDefault()}
          >
            <span data-etikett="l" className="ws-etikett ws-etikett-l">Passt nicht</span>
            <span data-etikett="u" className="ws-etikett ws-etikett-u">Weiß nicht</span>
            <span data-etikett="r" className="ws-etikett ws-etikett-r">Passt</span>
            <span className="ws-wort">{aktuell}</span>
          </div>
          {flug && (
            <div
              key={flug.id}
              className={`ws-karte ws-flug ${flugKlasse}`}
              style={{ "--start-x": `${flug.dx}px`, "--start-y": `${flug.dy}px` }}
              aria-hidden="true"
              onAnimationEnd={() => setFlug((f) => (f && f.id === flug.id ? null : f))}
            >
              <span className="ws-wort">{flug.begriff}</span>
            </div>
          )}
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

        {position < 3 && (
          <p className="ws-wischhinweis">
            {mausGeraet
              ? <>Pfeiltasten: <kbd>←</kbd> passt nicht · <kbd>↓</kbd> weiß nicht · <kbd>→</kbd> passt</>
              : "Wischen: rechts = passt · links = passt nicht · unten = weiß nicht"}
          </p>
        )}

        <div className="ws-fuss">
          {position > 0 ? (
            <button type="button" className="ws-link" onClick={rueckgaengig}>
              <Undo2 size={14} /> Letzte Karte zurück{mausGeraet ? " (Rücktaste)" : ""}
            </button>
          ) : (
            <button type="button" className="ws-link" onClick={() => setPhase("intro")}>
              Anleitung nochmal ansehen
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Schritt 2 und 3
  const istBest = phase !== "worst";
  const schluessel = istBest ? SORT_PASST : SORT_PASST_NICHT;
  const gewaehlt = istBest ? ist : nicht;
  const gesperrt = istBest ? nicht : ist;
  const platzVoll = gewaehlt.length >= N;
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
                  className={`ws-begriff ${belegt ? "ws-begriff-belegt" : ""} ${!belegt && platzVoll ? "ws-begriff-blass" : ""}`}
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
            <p className="ws-hinweis" style={{ margin: 0 }}>
              {platzVoll
                ? `${sie ? "Tippen Sie" : "Tippe"} unten auf „Weiter zu Schritt 3“.`
                : `Noch ${N - gewaehlt.length} ${N - gewaehlt.length === 1 ? "Begriff" : "Begriffe"}.`}
            </p>
            <button type="button" className="ws-link" onClick={rueckgaengig}>
              <Undo2 size={14} /> Zurück zum Sortieren
            </button>
          </>
        ) : (
          <>
            <p className="ws-hinweis" style={{ margin: 0 }}>
              {platzVoll
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
