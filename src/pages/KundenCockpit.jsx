import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Check, TrendingUp, Sparkles, CalendarDays, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Kunden-Cockpit unter /k/:code: der Auftraggeber sieht mit Passwort, wie weit
// jede Gruppe ist. Umgesetzt nach dem freigegebenen Prototyp (Design-Canvas
// „andi fragt. Kundenmodul“, 24.10.2026).
//
// Alle Zahlen kommen fertig gezählt aus der Funktion „kundenCockpit“; diese
// Seite sieht nie eine Antwort. Anonymitätsregeln stehen in der Funktion.
//
// Typografie wie auf der Startseite: Gilroy hat keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Sichtbare Texte deshalb
// mit Doppelpunkt, Komma oder Punkt schreiben.

const F = {
  akzent: "#ff3764",
  akzentTief: "#e02551",
  etikett: "#d4164a",
  etikettDunkel: "#ff7a98",
  text: "#2d2d2d",
  daempft: "#5a5a5a",
  grauMid: "#767676",
  linie: "#e8e6e4",
  grau: "#f6f5f4",
  hauch: "#fff0f3",
  hauchRand: "#f3c6d1",
  rosa: "#ffc2d0",
  gut: "#45d085",
  gutText: "#1d6b43",
  dunkel: "#2d2d2d",
};

const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";

const ZG = {
  geschaeftsfuehrung: { kurz: "Führung", bg: "#EEEDFE", text: "#3C3489", punkt: "#534AB7", lang: "Führung" },
  mitarbeiter: { kurz: "Team", bg: "#E6F1FB", text: "#0C447C", punkt: "#185FA5", lang: "Team" },
  kunden: { kurz: "Kunden", bg: "#E1F5EE", text: "#085041", punkt: "#0F6E56", lang: "Kunden" },
  partner: { kurz: "Partner", bg: "#FAEEDA", text: "#633806", punkt: "#854F0B", lang: "Partner" },
};
const zg = (k) => ZG[k] || ZG.mitarbeiter;

const zahl = (n) => new Intl.NumberFormat("de-DE").format(Math.round(n || 0));
const datumKurz = (k) => (k ? `${k.slice(8, 10)}.${k.slice(5, 7)}.` : "");
const H2 = "font-black uppercase leading-[1.1] text-[30px] sm:text-[40px]";
const speicherSchluessel = (code) => `kundencockpit_${code}`;

function lesen(k) {
  try { return window.sessionStorage.getItem(k); } catch (e) { return null; }
}
function schreiben(k, v) {
  try { if (v === null) window.sessionStorage.removeItem(k); else window.sessionStorage.setItem(k, v); } catch (e) { /* egal */ }
}

// ---------------------------------------------------------------------------
export default function KundenCockpit() {
  const { code } = useParams();
  const [params, setParams] = useSearchParams();
  const vorschau = params.get("vorschau") === "1";
  const vorschauPhase = params.get("phase") === "abgeschlossen" ? "abgeschlossen" : null;

  const [daten, setDaten] = useState(null);
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState("");
  const [passwort, setPasswort] = useState(() => lesen(speicherSchluessel(code)) || "");
  const [brauchtPasswort, setBrauchtPasswort] = useState(false);
  const pwRef = useRef(passwort);

  useEffect(() => {
    const vorher = document.title;
    document.title = "andi fragt. | Dein Befragungs-Cockpit";
    return () => { document.title = vorher; };
  }, []);

  const laden = useCallback(async ({ pw, zaehlen = false, still = false } = {}) => {
    if (!still) setLaedt(true);
    try {
      const res = await base44.functions.invoke("kundenCockpit", {
        aktion: "laden",
        code,
        passwort: pw ?? pwRef.current,
        zaehlen,
        adminVorschau: vorschau,
        phase: vorschauPhase,
      });
      const d = res?.data;
      if (!d || d.error) {
        const e = d?.error || "serverfehler";
        if (e === "passwort" || e === "gesperrt" || e === "zugang" || e === "anmelden") {
          schreiben(speicherSchluessel(code), null);
          setBrauchtPasswort(true);
          setDaten(null);
        }
        setFehler(
          e === "anmelden" ? ""
          : e === "passwort" ? "Das Passwort stimmt nicht. Bitte prüfe die Schreibweise."
          : e === "gesperrt" ? `Zu viele Versuche. Bitte versuche es in ${d?.minuten || 15} Minuten noch einmal.`
          : e === "zugang" ? "Dieser Link ist nicht gültig oder nicht mehr freigeschaltet."
          : "Das Cockpit ist gerade nicht erreichbar. Bitte versuche es später noch einmal."
        );
        return;
      }
      setFehler("");
      setBrauchtPasswort(false);
      setDaten(d);
      if (!vorschau && pw !== undefined) schreiben(speicherSchluessel(code), pw);
    } catch (e) {
      setFehler("Das Cockpit ist gerade nicht erreichbar. Bitte versuche es später noch einmal.");
    } finally {
      setLaedt(false);
    }
  }, [code, vorschau, vorschauPhase]);

  // Erster Aufruf: Vorschau oder gemerktes Passwort, sonst Anmeldung
  useEffect(() => {
    if (vorschau || pwRef.current) laden({ pw: pwRef.current, zaehlen: true });
    else { setBrauchtPasswort(true); setLaedt(false); }
  }, [laden, vorschau]);

  // Alle fünf Minuten still auffrischen, solange das Cockpit offen ist
  useEffect(() => {
    if (!daten) return undefined;
    const t = setInterval(() => laden({ still: true }), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [daten, laden]);

  function anmelden(e) {
    e.preventDefault();
    const pw = passwort.trim();
    if (!pw) { setFehler("Bitte gib dein Passwort ein."); return; }
    pwRef.current = pw;
    laden({ pw, zaehlen: true });
  }

  function abmelden() {
    schreiben(speicherSchluessel(code), null);
    pwRef.current = "";
    setPasswort("");
    setDaten(null);
    setBrauchtPasswort(true);
  }

  async function interesseVormerken(modul) {
    try {
      const res = await base44.functions.invoke("kundenCockpit", {
        aktion: "interesse", code, passwort: pwRef.current, modul, adminVorschau: vorschau,
      });
      const d = res?.data;
      if (d?.ok) {
        setDaten((alt) => ({ ...alt, interesse: d.vorschau ? [...(alt.interesse || []), modul] : d.interesse }));
        return true;
      }
    } catch (e) { /* unten */ }
    return false;
  }

  if (laedt && !daten) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-[#e8e6e4] border-t-[#2d2d2d] rounded-full animate-spin" />
      </div>
    );
  }

  if (brauchtPasswort || !daten) {
    return (
      <Anmeldung
        passwort={passwort}
        setPasswort={setPasswort}
        onSubmit={anmelden}
        fehler={fehler}
        laedt={laedt}
      />
    );
  }

  return (
    <Cockpit
      d={daten}
      onAbmelden={abmelden}
      onInteresse={interesseVormerken}
      onAktualisieren={() => laden({ still: true })}
      vorschau={daten.vorschau}
      vorschauPhase={vorschauPhase}
      setPhase={(p) => { const n = new URLSearchParams(params); if (p) n.set("phase", p); else n.delete("phase"); setParams(n, { replace: true }); }}
    />
  );
}

// ---------------------------------------------------------------------------
// Anmeldung
// ---------------------------------------------------------------------------
function Kreise({ gross = 420, klein = 260, oben = false }) {
  const pos = oben ? { top: -gross * 0.38, right: -gross * 0.38 } : { bottom: -120, right: -120 };
  const posK = oben ? { top: -klein * 0.23, right: -klein * 0.23 } : { bottom: -40, right: -40 };
  return (
    <>
      <div aria-hidden="true" className="absolute rounded-full" style={{ ...pos, width: gross, height: gross, border: `2px solid ${F.akzent}`, opacity: 0.3 }} />
      <div aria-hidden="true" className="absolute rounded-full" style={{ ...posK, width: klein, height: klein, border: `2px solid ${F.akzent}`, opacity: 0.5 }} />
    </>
  );
}

function Anmeldung({ passwort, setPasswort, onSubmit, fehler, laedt }) {
  return (
    <div className="min-h-screen flex flex-wrap bg-white" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      <section className="relative overflow-hidden flex-[1_1_520px] min-w-0 text-white px-6 sm:px-14 py-12 flex flex-col justify-between gap-12" style={{ background: F.dunkel }}>
        <Kreise />
        <p className="relative text-[26px] font-black">andi fragt<span style={{ color: F.akzent }}>.</span></p>
        <div className="relative max-w-[520px]">
          <p className="text-[13px] font-medium uppercase tracking-[0.2em]" style={{ color: F.etikettDunkel }}>Dein Befragungs-Cockpit</p>
          <h1 className="mt-4 text-[38px] sm:text-[52px] leading-[1.05] font-black uppercase">
            Sieh, wie dein Unternehmen <span style={{ color: F.akzent }}>antwortet.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "#d9d6d3" }}>
            Rücklauf je Gruppe, Verlauf, Zeiten und die nächsten Schritte. Jederzeit aktuell, am Handy und am Computer.
          </p>
        </div>
        <ul className="relative flex flex-wrap gap-3">
          {["Volle Anonymität", "Live-Stand", "Nur Zahlen, keine Antworten"].map((t) => (
            <li key={t} className="flex items-center gap-2.5 min-h-[40px] px-4 rounded-full text-sm" style={{ border: "1px solid #5a5a5a" }}>
              <Check size={16} strokeWidth={2.4} color={F.gut} aria-hidden="true" /> {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex-[1_1_420px] min-w-0 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-[400px]">
          <h2 className="text-[32px] leading-tight font-extrabold">Willkommen</h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: F.daempft }}>
            Gib das Passwort ein, das du von Rittler &amp; Co bekommen hast.
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2.5">
            <label htmlFor="kc-pw" className="text-sm font-semibold">Passwort</label>
            <input
              id="kc-pw"
              type="password"
              autoComplete="current-password"
              value={passwort}
              onChange={(e) => setPasswort(e.target.value)}
              className="h-[52px] px-4 text-[17px] rounded-md bg-white focus:outline-none focus:ring-4 focus:ring-[#ffc2d0]"
              style={{ border: "1px solid #b3b3b3", fontFamily: "inherit" }}
              aria-invalid={!!fehler}
              aria-describedby={fehler ? "kc-fehler" : undefined}
            />
            {fehler && <p id="kc-fehler" role="alert" className="text-sm" style={{ color: "#b00d36" }}>{fehler}</p>}
            <button
              type="submit"
              disabled={laedt}
              className="mt-3.5 inline-flex items-center justify-center gap-2.5 min-h-[52px] rounded-md text-white text-[15px] font-semibold uppercase tracking-[0.04em] disabled:opacity-60"
              style={{ background: F.akzentTief }}
            >
              {laedt ? "Wird geöffnet" : "Cockpit öffnen"} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>
          <p className="mt-6 text-sm leading-relaxed" style={{ color: F.daempft }}>
            Passwort vergessen? Schreib uns an <a href={`mailto:${KONTAKT_MAIL}`} className="font-semibold hover:underline" style={{ color: "#c4103f" }}>{KONTAKT_MAIL}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cockpit
// ---------------------------------------------------------------------------
function Etikett({ children, dunkel = false, className = "" }) {
  return (
    <p className={`text-[13px] font-medium uppercase tracking-[0.2em] ${className}`} style={{ color: dunkel ? F.etikettDunkel : F.etikett }}>
      {children}
    </p>
  );
}

function Pille({ zielgruppe }) {
  const z = zg(zielgruppe);
  return (
    <span className="inline-flex items-center min-h-[28px] px-3 rounded-full text-[13px] font-semibold" style={{ background: z.bg, color: z.text }}>
      {z.kurz}
    </span>
  );
}

function Cockpit({ d, onAbmelden, onInteresse, onAktualisieren, vorschau, vorschauPhase, setPhase }) {
  const abgeschlossen = d.phase === "abgeschlossen";
  const a = d.anzeigen || {};
  const stand = new Date(d.stand);
  const standText = `${String(stand.getHours()).padStart(2, "0")}:${String(stand.getMinutes()).padStart(2, "0")} Uhr`;

  const nav = [
    abgeschlossen && d.signale && a.signale ? ["signale", "Erste Signale"] : null,
    ["gruppen", "Gruppen"],
    !abgeschlossen && a.verlauf && d.verlauf ? ["verlauf", "Verlauf"] : null,
    !abgeschlossen && a.zeiten && d.zeiten ? ["zeiten", "Zeiten"] : null,
    a.ablauf ? ["ablauf", abgeschlossen ? "Workshop" : "Ablauf"] : null,
    a.module ? ["mehr", "Mehr von andi"] : null,
  ].filter(Boolean);

  let nr = 0;
  const naechsteNr = () => String(++nr).padStart(2, "0");

  return (
    <div className="min-h-screen bg-white" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      {vorschau && (
        <div className="px-6 py-2.5 text-sm flex flex-wrap items-center gap-x-4 gap-y-2 justify-center" style={{ background: "#ffd8a8" }}>
          <span className="font-semibold">Vorschau für Rittler &amp; Co. Der Kunde sieht diese Leiste nicht.</span>
          <span className="inline-flex rounded-md overflow-hidden" style={{ border: "1px solid #2d2d2d" }}>
            <button type="button" onClick={() => setPhase(null)} className="px-3 min-h-[32px] font-medium" style={{ background: vorschauPhase ? "transparent" : "#2d2d2d", color: vorschauPhase ? "#2d2d2d" : "#fff" }}>Echter Stand</button>
            <button type="button" onClick={() => setPhase("abgeschlossen")} className="px-3 min-h-[32px] font-medium" style={{ background: vorschauPhase ? "#2d2d2d" : "transparent", color: vorschauPhase ? "#fff" : "#2d2d2d" }}>Als abgeschlossen</button>
          </span>
        </div>
      )}

      <header style={{ borderBottom: `1px solid ${F.linie}` }}>
        <div className="max-w-[1160px] mx-auto px-6 py-3.5 flex flex-wrap items-center gap-x-8 gap-y-2">
          <p className="text-[24px] font-black">andi fragt<span style={{ color: F.akzent }}>.</span></p>
          <nav aria-label="Bereiche" className="flex-1 flex flex-wrap gap-1">
            {nav.map(([id, t]) => (
              <a key={id} href={`#${id}`} className="inline-flex items-center min-h-[44px] px-3 text-sm font-medium hover:underline">{t}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {d.projekt.firma && <span className="text-sm font-semibold">{d.projekt.firma}</span>}
            {!vorschau && (
              <button type="button" onClick={onAbmelden} className="inline-flex items-center min-h-[40px] px-3.5 rounded-md text-[13px] font-medium" style={{ border: "1px solid #b3b3b3" }}>
                Abmelden
              </button>
            )}
          </div>
        </div>
      </header>

      <Einstieg d={d} standText={standText} onAktualisieren={onAktualisieren} />

      {abgeschlossen && a.signale && (
        <Signale s={d.signale} nr={naechsteNr()} />
      )}

      {abgeschlossen && a.ablauf && <Workshop d={d} nr={naechsteNr()} />}

      <Gruppen d={d} nr={naechsteNr()} abgeschlossen={abgeschlossen} />

      {!abgeschlossen && a.verlauf && d.verlauf && d.verlauf.tage.length >= 2 && <Verlauf v={d.verlauf} nr={naechsteNr()} />}

      {!abgeschlossen && a.zeiten && d.zeiten && <Zeiten z={d.zeiten} t={d.tiefe} nr={naechsteNr()} />}

      {!abgeschlossen && a.ablauf && <Ablauf d={d} nr={naechsteNr()} />}

      {a.module && <Module d={d} nr={naechsteNr()} onInteresse={onInteresse} />}

      <section className="max-w-[1160px] mx-auto px-6 pt-20 pb-12">
        <div className="rounded-[20px] text-white px-6 sm:px-9 py-10 flex flex-wrap items-center justify-between gap-7" style={{ background: F.dunkel }}>
          <div className="flex-[1_1_380px] min-w-0">
            <h2 className="text-[26px] sm:text-[30px] leading-tight font-black uppercase">{abgeschlossen ? "Neugierig geworden?" : "Fragen zur Befragung?"}</h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "#e2dfdc" }}>
              Rittler &amp; Co begleitet deine Befragung von der ersten Frage bis zur fertigen Kommunikation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${KONTAKT_MAIL}`} className="inline-flex items-center min-h-[48px] px-5 rounded-md bg-white text-[15px] font-semibold" style={{ color: F.text }}>{KONTAKT_MAIL}</a>
            <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="inline-flex items-center min-h-[48px] px-5 rounded-md text-[15px] font-semibold text-white" style={{ border: "1px solid #767676" }}>{KONTAKT_TEL}</a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-3 text-[13px] leading-relaxed" style={{ color: F.grauMid }}>
          <p className="max-w-[640px]">Dieses Cockpit zeigt ausschließlich Teilnahmezahlen. Antworten einzelner Personen sind für niemanden einsehbar, auch nicht für die Geschäftsführung.</p>
          <p>andi fragt. ist ein Angebot von Rittler &amp; Co</p>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Einstieg({ d, standText, onAktualisieren }) {
  const abgeschlossen = d.phase === "abgeschlossen";
  const k = d.kennzahlen;
  const kacheln = [];
  kacheln.push({ wert: zahl(k.fertig), text: abgeschlossen ? "Interviews aus allen Gruppen" : "Interviews fertig beantwortet" });
  if (k.minutenGesamt) {
    const std = k.minutenGesamt >= 60;
    kacheln.push({
      wert: std ? zahl(k.minutenGesamt / 60) : zahl(k.minutenGesamt),
      einheit: std ? " Std." : " Min.",
      text: "Zeit, die sich dein Unternehmen für die Antworten genommen hat",
    });
  }
  if (d.tiefe && d.tiefe.woerter > 0) kacheln.push({ wert: zahl(d.tiefe.woerter), text: "Wörter in offenen Antworten, getippt und gesprochen" });
  if (abgeschlossen && d.signale) {
    kacheln.push({ wert: zahl(d.signale.anzahl), text: "Signale, die wir im Workshop mit dir öffnen", akzent: true });
  } else if (!abgeschlossen && k.ende && k.ende.tage >= 0) {
    kacheln.push({
      wert: String(k.ende.tage),
      einheit: k.ende.tage === 1 ? " Tag" : " Tage",
      text: `bis die Befragung ${zg(k.ende.zielgruppe).lang === "Team" ? "im Team" : `bei ${zg(k.ende.zielgruppe).lang}`} am ${datumKurz(k.ende.datum)} endet`,
      akzent: true,
    });
  } else if (!abgeschlossen && k.begonnen > 0) {
    kacheln.push({ wert: zahl(k.begonnen), text: "haben begonnen und sind noch dabei", akzent: true });
  }

  return (
    <section className="relative overflow-hidden text-white" style={{ background: F.dunkel }}>
      <Kreise gross={520} klein={320} oben />
      <div className="relative max-w-[1160px] mx-auto px-6 pt-16 pb-20 flex flex-wrap gap-12 items-end">
        <div className="flex-[1_1_460px] min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {abgeschlossen ? (
              <span className="inline-flex items-center gap-2 min-h-[30px] px-3 rounded-full text-[13px] font-semibold" style={{ background: "rgba(69,208,133,0.16)", color: "#7fe0ab" }}>
                <Check size={14} strokeWidth={3} color={F.gut} aria-hidden="true" /> Interviews abgeschlossen
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 min-h-[30px] px-3 rounded-full text-[13px] font-semibold" style={{ background: "rgba(69,208,133,0.16)", color: "#7fe0ab" }}>
                <LivePunkt /> Live
              </span>
            )}
            <span className="text-[13px]" style={{ color: "#cfcbc7" }}>Stand heute, {standText}</span>
            <button type="button" onClick={onAktualisieren} aria-label="Aktualisieren" className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10">
              <RefreshCw size={15} color="#cfcbc7" aria-hidden="true" />
            </button>
          </div>
          {d.projekt.name && <Etikett dunkel className="mt-7">{d.projekt.name}</Etikett>}
          <h1 className="mt-3 text-[40px] sm:text-[56px] leading-[1.04] font-black uppercase">
            {abgeschlossen
              ? <>Dein Unternehmen <span style={{ color: F.akzent }}>hat gesprochen.</span></>
              : <>Deine Befragung <span style={{ color: F.akzent }}>läuft.</span></>}
          </h1>
          <p className="mt-6 max-w-[540px] text-lg leading-relaxed" style={{ color: "#e2dfdc" }}>
            {abgeschlossen
              ? "Alle Gruppen sind fertig. Jetzt verdichten wir die Antworten mit der ANDI-Methode. Was wir dabei schon sehen, zeigen wir dir hier, ohne etwas vorwegzunehmen."
              : "Hier siehst du jederzeit, wie weit jede Gruppe ist. Wer was geantwortet hat, sieht niemand, auch wir nicht. Genau deshalb antworten alle ehrlich."}
          </p>
        </div>
        <div className="flex-[1_1_440px] min-w-0 grid grid-cols-2 gap-px rounded-2xl overflow-hidden" style={{ background: "#4a4a4a" }}>
          {kacheln.slice(0, 4).map((kc, i) => (
            <div key={i} className="px-6 pt-6 pb-5" style={{ background: F.dunkel }}>
              <p className="text-[40px] sm:text-[52px] leading-none font-extrabold" style={kc.akzent ? { color: F.akzent } : undefined}>
                {kc.wert}{kc.einheit && <span className="text-[22px] sm:text-[26px] font-bold">{kc.einheit}</span>}
              </p>
              <p className="mt-2.5 text-sm leading-snug" style={{ color: "#cfcbc7" }}>{kc.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Ring({ g }) {
  const r = 44;
  const C = 2 * Math.PI * r;
  const basis = g.eingeladen || Math.max(g.mindest, g.fertig + g.begonnen) || 1;
  const a = Math.min(1, g.fertig / basis) * C;
  const b = Math.min(1 - a / C, g.begonnen / basis) * C;
  const pct = Math.round((g.fertig / basis) * 100);
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112" role="img" aria-label={`${g.fertig} fertig, ${g.begonnen} begonnen`}>
        <circle cx="56" cy="56" r={r} fill="none" stroke="#f1efed" strokeWidth="12" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={F.rosa} strokeWidth="12" strokeDasharray={`${b} ${C}`} strokeDashoffset={-a} transform="rotate(-90 56 56)" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={F.akzent} strokeWidth="12" strokeDasharray={`${a} ${C}`} transform="rotate(-90 56 56)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-extrabold leading-none">{pct}<span className="text-base">%</span></span>
        <span className="mt-0.5 text-[11px]" style={{ color: F.daempft }}>{g.eingeladen ? "fertig" : "der Mindestzahl"}</span>
      </div>
    </div>
  );
}

function Gruppen({ d, nr, abgeschlossen }) {
  const b = d.anzeigen?.bereiche ? d.bereiche : null;
  return (
    <section id="gruppen" className="max-w-[1160px] mx-auto px-6 pt-24 scroll-mt-4">
      <Etikett>{nr} Gruppen</Etikett>
      <h2 className={`mt-3 ${H2}`}>{abgeschlossen ? "Wer geantwortet hat" : "Wer schon geantwortet hat"}</h2>
      <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed" style={{ color: F.daempft }}>
        Jede Gruppe beantwortet ihre eigene Befragung. Ausgewertet wird eine Gruppe erst, wenn genug Personen teilgenommen haben. So bleibt jede einzelne Antwort geschützt.
      </p>

      {d.gruppen.length === 0 ? (
        <p className="mt-10 text-base" style={{ color: F.daempft }}>Sobald die erste Gruppe startet, siehst du hier ihren Rücklauf.</p>
      ) : (
        <div className="mt-10 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {d.gruppen.map((g, i) => {
            const offen = g.eingeladen ? Math.max(0, g.eingeladen - g.fertig - g.begonnen) : null;
            const fertigSt = g.status === "geschlossen";
            return (
              <article key={i} className="rounded-2xl p-7 flex flex-col gap-6 bg-white" style={{ border: `1px solid ${F.linie}` }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <Pille zielgruppe={g.zielgruppe} />
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: fertigSt ? F.gutText : "#c4103f" }}>
                    <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: fertigSt ? F.gut : F.akzent }} />
                    {fertigSt ? "Abgeschlossen" : g.endetAm ? `Läuft bis ${datumKurz(g.endetAm)}` : "Läuft"}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <Ring g={g} />
                  <div className="min-w-0">
                    <h3 className="text-[22px] leading-tight font-extrabold">{g.name || zg(g.zielgruppe).lang}</h3>
                    <p className="mt-1.5 text-sm leading-snug" style={{ color: F.daempft }}>
                      {g.eingeladen ? `${g.fertig} von ${g.eingeladen} fertig` : `${g.fertig} fertig`}
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-3 gap-2 py-4" style={{ borderTop: `1px solid ${F.linie}`, borderBottom: `1px solid ${F.linie}` }}>
                  <Zelle farbe={F.akzent} titel="Fertig" wert={g.fertig} />
                  <Zelle farbe={F.rosa} titel="Begonnen" wert={g.begonnen} />
                  <Zelle farbe="#f1efed" rand titel="Noch offen" wert={offen === null ? "?" : offen} />
                </dl>
                {g.schwelle ? (
                  <p className="flex items-center gap-2.5 text-sm font-medium" style={{ color: F.gutText }}>
                    <Check size={18} strokeWidth={2.6} color="#1d9a5b" aria-hidden="true" /> Auswertbar: Mindestzahl {g.mindest} erreicht
                  </p>
                ) : (
                  <p className="flex items-center gap-2.5 text-sm font-medium" style={{ color: F.daempft }}>
                    <Lock size={16} aria-hidden="true" /> Noch {g.mindest - g.fertig} bis zur Auswertung
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {b && (
        <div className="mt-5 rounded-2xl p-6 sm:p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ background: F.grau, border: `1px solid ${F.linie}` }}>
          <div className="flex-[1_1_280px] min-w-0">
            <Pille zielgruppe={b.zielgruppe} />
            <h3 className="mt-4 text-[26px] leading-tight font-extrabold">Beteiligung nach Bereichen</h3>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: F.daempft }}>
              Wie viele aus jedem Bereich schon begonnen haben. Bereiche mit weniger als {b.schwelle} Personen fassen wir zusammen, damit niemand erkennbar wird.
            </p>
            <p className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed">
              <Lock size={18} className="shrink-0 mt-0.5" aria-hidden="true" /> Du siehst nur Anzahlen, nie Namen. Wer begonnen hat, bleibt unsichtbar.
            </p>
          </div>
          <ul className="flex-[2_1_440px] min-w-0 flex flex-col gap-4">
            {b.zeilen.map((z) => {
              const pct = Math.round((z.begonnen / z.gesamt) * 100);
              return (
                <li key={z.name}>
                  <div className="flex justify-between gap-3 text-[15px]">
                    <span className="font-semibold">{z.name}</span>
                    <span style={{ color: F.daempft }}><strong style={{ color: F.text }}>{pct} %</strong>, {z.begonnen} von {z.gesamt}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full overflow-hidden" style={{ background: F.linie }} role="img" aria-label={`${z.name}: ${z.begonnen} von ${z.gesamt} haben begonnen`}>
                    <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: z.zusammen ? F.grauMid : F.dunkel }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

function Zelle({ farbe, rand = false, titel, wert }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs" style={{ color: F.daempft }}>
        <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ background: farbe, border: rand ? "1px solid #d6d3d0" : undefined }} />
        {titel}
      </dt>
      <dd className="mt-1 text-lg font-bold">{wert}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Verlauf({ v, nr }) {
  const n = v.tage.length;
  const maxNeu = Math.max(1, ...v.tage.map((t) => t.neu));
  const maxGes = Math.max(1, ...v.tage.map((t) => t.gesamt)) * 1.05;
  const punkte = v.tage.map((t, i) => `${i * 10 + 5},${(100 - (t.gesamt / maxGes) * 100).toFixed(2)}`).join(" ");
  const flaeche = `5,100 ${punkte} ${(n - 1) * 10 + 5},100`;
  const jedes = n > 28 ? 3 : n > 16 ? 2 : 1;
  const staerkster = v.tage.reduce((m, t) => (t.neu > (m?.neu || 0) ? t : m), null);
  const letzter = v.tage[n - 1];
  const spalten = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };

  let einsicht;
  if (v.schuebe.length) {
    const [erste, ...weitere] = v.schuebe;
    const rest = weitere.map((s) => `, nach der am ${datumKurz(s.datum)} weitere ${s.anzahl}`).join("");
    einsicht = {
      titel: "Jede Erinnerung bringt einen Schub.",
      text: `Nach der Erinnerung am ${datumKurz(erste.datum)} kamen in zwei Tagen ${erste.anzahl} fertige Interviews dazu${rest}.`,
    };
  } else if (staerkster && staerkster.neu > 0) {
    einsicht = {
      titel: `Stärkster Tag bisher: ${datumKurz(staerkster.datum)}`,
      text: `An diesem Tag wurden ${staerkster.neu} Interviews fertig. Die meisten Antworten kommen in den ersten Tagen nach einer Einladung oder Erinnerung.`,
    };
  }

  return (
    <section id="verlauf" className="max-w-[1160px] mx-auto px-6 pt-28 scroll-mt-4">
      <Etikett>{nr} Verlauf</Etikett>
      <h2 className={`mt-3 ${H2}`}>So hat sich die Befragung entwickelt</h2>
      <div className="mt-10 flex flex-wrap gap-5">
        <div className="flex-[3_1_560px] min-w-0 rounded-2xl p-5 sm:p-7" style={{ border: `1px solid ${F.linie}` }}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: F.daempft }}>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3 h-3 rounded-sm" style={{ background: "#cfcbc7" }} />Fertige Interviews je Tag</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-3 h-3 rounded-sm" style={{ background: F.akzent }} />Tag mit Einladung oder Erinnerung</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-[18px] h-[3px] rounded" style={{ background: F.dunkel }} />Gesamt</span>
          </div>
          <div className="mt-7 overflow-x-auto">
            <div style={{ minWidth: Math.max(480, n * 22) }}>
              <div className="relative h-[240px]" role="img" aria-label={`Verlauf: insgesamt ${letzter.gesamt} fertige Interviews`}>
                <div aria-hidden="true" className="absolute inset-x-0 top-10 border-t border-dashed" style={{ borderColor: F.linie }} />
                <div aria-hidden="true" className="absolute inset-x-0 top-[140px] border-t border-dashed" style={{ borderColor: F.linie }} />
                <div className="absolute inset-x-0 bottom-0 top-10 grid items-end gap-1.5" style={spalten}>
                  {v.tage.map((t) => (
                    <div key={t.datum} className="relative h-[200px] flex flex-col justify-end items-center" title={`${datumKurz(t.datum)}: ${t.neu} neu, ${t.gesamt} gesamt`}>
                      {t.ereignis && (
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-white px-1.5 py-0.5 rounded" style={{ background: F.akzentTief }}>
                          {n > 21 ? t.ereignis.slice(0, 1) : t.ereignis}
                        </span>
                      )}
                      <div className="w-full max-w-[26px] rounded-t" style={{ height: Math.max(2, Math.round((t.neu / maxNeu) * 110)), background: t.ereignis ? F.akzent : "#cfcbc7" }} />
                    </div>
                  ))}
                </div>
                <svg viewBox={`0 0 ${n * 10} 100`} preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 top-10 w-full h-[200px] overflow-visible">
                  <polygon points={flaeche} fill={F.dunkel} fillOpacity="0.05" />
                  <polyline points={punkte} fill="none" stroke={F.dunkel} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="absolute -right-1 top-6 text-[15px] font-extrabold text-white px-2 py-1 rounded" style={{ background: F.dunkel }}>{letzter.gesamt}</span>
              </div>
              <div className="mt-2.5 grid gap-1.5" style={spalten}>
                {v.tage.map((t, i) => {
                  const we = t.wt === "Sa" || t.wt === "So";
                  return (
                    <div key={t.datum} className="text-center text-[11px] leading-tight" style={{ color: we ? F.grauMid : F.text }}>
                      {(i % jedes === 0 || i === n - 1) && <><div className="font-semibold">{Number(t.datum.slice(8, 10))}.</div><div>{t.wt}</div></>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs" style={{ color: F.grauMid }}>
            Begonnene Interviews zählen erst mit dem Abschluss.{v.vorher ? ` Davor bereits ${v.vorher} fertig.` : ""}
          </p>
        </div>

        <aside className="flex-[1_1_280px] min-w-0 flex flex-col gap-5">
          {einsicht && (
            <div className="rounded-2xl p-7" style={{ background: F.hauch }}>
              <TrendingUp size={28} strokeWidth={1.6} color={F.akzentTief} aria-hidden="true" />
              <h3 className="mt-3.5 text-[22px] leading-snug font-extrabold">{einsicht.titel}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed" style={{ color: F.daempft }}>{einsicht.text}</p>
            </div>
          )}
          <div className="rounded-2xl p-7" style={{ border: `1px solid ${F.linie}` }}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: F.daempft }}>Dein Beitrag</p>
            <p className="mt-2.5 text-[22px] leading-snug font-extrabold">Ein kurzes Wort von dir wirkt.</p>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: F.daempft }}>
              Wenn du im Team erwähnst, dass dir die Befragung wichtig ist, machen mehr mit. Wer begonnen hat, kann jederzeit dort weitermachen, wo er aufgehört hat.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Zeiten({ z, t, nr }) {
  const maxTz = Math.max(1, ...z.tageszeiten.map((x) => x.n));
  const maxWt = Math.max(1, ...z.wochentage.map((x) => x.n));
  const summe = z.tageszeiten.reduce((a, x) => a + x.n, 0) || 1;
  const spitzen = z.tageszeiten.filter((x) => x.n === maxTz).map((x) => x.name);
  const abend = z.tageszeiten.find((x) => x.name === "Abend")?.n || 0;
  const abendAnteil = Math.round((abend / summe) * 100);
  const wtSpitze = z.wochentage.find((x) => x.n === maxWt);
  const wtNamen = { Mo: "Montag", Di: "Dienstag", Mi: "Mittwoch", Do: "Donnerstag", Fr: "Freitag", Sa: "Samstag", So: "Sonntag" };

  return (
    <section id="zeiten" className="max-w-[1160px] mx-auto px-6 pt-28 scroll-mt-4">
      <Etikett>{nr} Zeiten</Etikett>
      <h2 className={`mt-3 ${H2}`}>Wann und wie lange geantwortet wird</h2>
      <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed" style={{ color: F.daempft }}>
        Alle Zeiten zeigen wir nur gesammelt über alle Gruppen. So lässt sich aus keiner Uhrzeit auf eine Person schließen.
      </p>
      <div className="mt-10 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
        <div className="rounded-2xl p-7" style={{ border: `1px solid ${F.linie}` }}>
          <h3 className="text-xl font-extrabold">Tageszeit</h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            {z.tageszeiten.map((x) => (
              <li key={x.name} className="grid items-center gap-3 text-sm" style={{ gridTemplateColumns: "104px minmax(0,1fr) 28px" }}>
                <span><span className="block font-semibold">{x.name}</span><span className="block text-xs" style={{ color: F.daempft }}>{x.zeit}</span></span>
                <span className="h-3.5 rounded-full overflow-hidden" style={{ background: "#f1efed" }}>
                  <span className="block h-3.5 rounded-full" style={{ width: `${(x.n / maxTz) * 100}%`, background: x.n === maxTz ? F.akzent : F.dunkel }} />
                </span>
                <span className="text-right font-bold">{x.n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed" style={{ color: F.daempft }}>
            {spitzen.length === 1 ? `${spitzen[0]} ist die stärkste Zeit.` : `${spitzen.slice(0, -1).join(", ")} und ${spitzen[spitzen.length - 1]} sind gleich stark.`}
            {abendAnteil >= 15 ? ` ${abendAnteil} % der Interviews entstehen am Abend, also in Ruhe von zu Hause aus.` : ""}
          </p>
        </div>

        <div className="rounded-2xl p-7" style={{ border: `1px solid ${F.linie}` }}>
          <h3 className="text-xl font-extrabold">Wochentag</h3>
          <div className="mt-5 h-40 grid grid-cols-7 gap-2.5 items-end">
            {z.wochentage.map((x) => (
              <div key={x.name} className="h-40 flex flex-col items-center justify-end gap-1.5">
                <span className="text-[13px] font-bold">{x.n}</span>
                <div className="w-full max-w-[34px] rounded-t" style={{ height: Math.max(3, Math.round((x.n / maxWt) * 120)), background: x.n === maxWt ? F.akzent : F.dunkel }} />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2.5">
            {z.wochentage.map((x) => <span key={x.name} className="text-center text-xs" style={{ color: F.daempft }}>{x.name}</span>)}
          </div>
          {wtSpitze && wtSpitze.n > 0 && (
            <p className="mt-5 text-sm leading-relaxed" style={{ color: F.daempft }}>{wtNamen[wtSpitze.name]} ist bisher der stärkste Antworttag.</p>
          )}
        </div>

        <div className="rounded-2xl p-7 text-white flex flex-col gap-5" style={{ background: F.dunkel }}>
          <h3 className="text-xl font-extrabold">Dauer und Tiefe</h3>
          {z.dauerMedian ? (
            <div>
              <p className="text-[48px] leading-none font-extrabold">{z.dauerMedian}<span className="text-2xl font-bold"> Min.</span></p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#cfcbc7" }}>
                dauert ein Interview im Mittel{z.dauerGeplant ? `, geplant waren ${z.dauerGeplant} Minuten` : ""}.
                {z.dauerGeplant && z.dauerMedian > z.dauerGeplant ? " Wer sich Zeit nimmt, antwortet ausführlicher." : ""}
              </p>
            </div>
          ) : null}
          {t && t.offeneAntworten > 0 && (
            <div className="pt-5" style={{ borderTop: "1px solid #4a4a4a" }}>
              <p className="text-[48px] leading-none font-extrabold">{zahl(t.offeneAntworten)}</p>
              <p className="mt-2 text-sm" style={{ color: "#cfcbc7" }}>offene Antworten in eigenen Worten</p>
            </div>
          )}
          {t && t.anteilGesprochen > 0 && (
            <div className="pt-5" style={{ borderTop: "1px solid #4a4a4a" }}>
              <div className="flex justify-between text-sm"><span>davon gesprochen</span><strong>{t.anteilGesprochen} %</strong></div>
              <div className="mt-2.5 h-2.5 rounded-full overflow-hidden" style={{ background: "#4a4a4a" }}>
                <div className="h-2.5 rounded-full" style={{ width: `${t.anteilGesprochen}%`, background: F.akzent }} />
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed" style={{ color: "#cfcbc7" }}>Sprechen statt Tippen macht es leicht, auch am Handy viel zu sagen.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Die vier Schritte als Wortmarken-Familie der Dachmarke „andi fragt.“:
// andi + Verb + Punkt. Der Punkt zeigt den Stand (pink = läuft, grün = erledigt, grau = geplant).
const SCHRITTE = [
  { verb: "fragt", kurz: "Digitale Interviews", text: "Alle Gruppen antworten anonym, am Handy oder am Computer." },
  { verb: "weiß", kurz: "Analyse", text: "Wir verdichten alle Antworten mit der ANDI-Methode und suchen die Abweichungen." },
  { verb: "macht", kurz: "Klarheit und Essenz", text: "Die wahren Stärken, gemeinsam im Workshop geschärft." },
  { verb: "zeigt", kurz: "Kommunikation", text: "Klare Botschaften für Kunden, Team, Vertrieb und Bewerbende." },
];

const PUNKT = { aktiv: F.akzent, fertig: F.gut, offen: "#cfcbc7" };

function Wortmarke({ verb, status = "aktiv", className = "", zweizeilig = false }) {
  const offen = status === "offen";
  return (
    <span className={`font-black tracking-[-0.01em] ${className}`} style={{ color: offen ? "#9a9692" : F.text }}>
      andi{zweizeilig ? <br /> : " "}{verb}<span style={{ color: PUNKT[status] }}>.</span>
    </span>
  );
}

// Pulsierender Live-Punkt; bei „Bewegung reduzieren“ ruhig
function LivePunkt() {
  return (
    <span aria-hidden="true" className="relative inline-flex w-2.5 h-2.5">
      <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping motion-reduce:animate-none" style={{ background: F.gut }} />
      <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ background: F.gut }} />
    </span>
  );
}

function schritte(d) {
  const abgeschlossen = d.phase === "abgeschlossen";
  const enden = d.gruppen.filter((g) => g.status === "live" && g.endetAm).map((g) => g.endetAm).sort();
  const letztesEnde = enden[enden.length - 1];
  const t = d.termine || {};
  return [
    { status: abgeschlossen ? "fertig" : "aktiv", datum: abgeschlossen ? "abgeschlossen" : letztesEnde ? `bis ${datumKurz(letztesEnde)}` : "läuft gerade" },
    { status: abgeschlossen ? "aktiv" : "offen", datum: abgeschlossen ? "Analyse läuft" : (t.analyseAb || "nach den Interviews") },
    { status: "offen", datum: t.workshop ? `Workshop ${t.workshop}` : "Termin folgt" },
    { status: "offen", datum: t.kommunikationAb || "nach dem Workshop" },
  ].map((s, i) => ({ ...SCHRITTE[i], ...s }));
}

function Ablauf({ d, nr }) {
  const liste = schritte(d);
  const label = { aktiv: "Läuft gerade", offen: "Geplant", fertig: "Erledigt" };
  return (
    <section id="ablauf" className="max-w-[1160px] mx-auto px-6 pt-28 scroll-mt-4">
      <Etikett>{nr} Ablauf</Etikett>
      <h2 className={`mt-3 ${H2}`}>Wo wir gerade stehen</h2>
      <ol className="mt-10 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {liste.map((s, i) => {
          const aktiv = s.status === "aktiv";
          return (
            <li key={s.verb} className="rounded-2xl px-6 py-7 flex flex-col gap-3.5" style={{ border: aktiv ? `2px solid ${F.akzent}` : `1px solid ${F.linie}`, background: aktiv ? F.hauch : "#fff" }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-extrabold" style={{ color: aktiv ? F.akzentTief : F.grauMid }}>0{i + 1}</span>
                <span className="inline-flex items-center min-h-[26px] px-2.5 rounded-full text-xs font-semibold" style={{ background: aktiv ? F.akzentTief : "#f1efed", color: aktiv ? "#fff" : F.daempft }}>{label[s.status]}</span>
              </div>
              <p className="mt-2.5 text-[34px] leading-none"><Wortmarke verb={s.verb} status={s.status} /></p>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: aktiv ? F.akzentTief : F.daempft }}>{s.kurz}</h3>
              <p className="text-[15px] leading-relaxed" style={{ color: F.daempft }}>{s.text}</p>
              <p className="mt-auto pt-3 text-sm font-semibold" style={{ borderTop: `1px solid ${F.linie}` }}>{s.datum}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 relative rounded-2xl overflow-hidden flex flex-wrap" style={{ border: `1px solid ${F.linie}` }}>
        <div className="flex-[1_1_340px] min-w-0 px-8 py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: F.daempft }}>Bald an dieser Stelle</p>
          <h3 className="mt-3 text-[30px] leading-tight font-black uppercase">Dein Ergebnis</h3>
          <p className="mt-3.5 text-base leading-relaxed" style={{ color: F.daempft }}>
            Sobald alle Gruppen fertig sind, verdichten wir die Antworten mit der ANDI-Methode. Deine Ergebnisse erscheinen dann genau hier: Stärken, Abweichungen zwischen den Gruppen und klare Empfehlungen.
          </p>
        </div>
        <div className="flex-[1_1_420px] min-w-0 relative px-8 py-9" style={{ background: F.grau }}>
          <div aria-hidden="true" className="flex flex-col gap-[18px]" style={{ filter: "blur(5px)" }}>
            {[["A", 72, 58, 44], ["N", 64, 81, 70], ["D", 88, 46, 39], ["I", 76, 69, 62]].map(([b, w1, w2, w3]) => (
              <div key={b} className="grid items-center gap-3" style={{ gridTemplateColumns: "36px minmax(0,1fr)" }}>
                <span className="text-[26px] font-black" style={{ color: F.akzent }}>{b}</span>
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 rounded-full" style={{ width: `${w1}%`, background: F.dunkel }} />
                  <div className="h-2.5 rounded-full" style={{ width: `${w2}%`, background: F.akzent }} />
                  <div className="h-2.5 rounded-full" style={{ width: `${w3}%`, background: "#9fd7e8" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2.5 min-h-[44px] px-4 rounded-full bg-white text-sm font-semibold" style={{ boxShadow: "0 8px 24px rgba(45,45,45,0.14)" }}>
              <Lock size={16} aria-hidden="true" /> Wird nach der Analyse freigeschaltet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Workshop({ d, nr }) {
  const liste = schritte(d);
  const t = d.termine || {};
  const anzahl = d.signale?.anzahl;
  return (
    <section id="ablauf" className="max-w-[1160px] mx-auto px-6 pt-28 scroll-mt-4">
      <div className="rounded-[20px] px-6 sm:px-10 py-12 flex flex-wrap items-center gap-10" style={{ background: F.hauch }}>
        <p aria-hidden="true" className="shrink-0 text-[56px] sm:text-[64px] leading-[0.95]"><Wortmarke verb="macht" zweizeilig /></p>
        <div className="flex-[1_1_420px] min-w-0">
          <Etikett>{nr} Workshop</Etikett>
          <h2 className="mt-3 text-[28px] sm:text-[36px] leading-[1.12] font-black uppercase">
            {anzahl ? `${anzahl} Signale. ` : "Deine Ergebnisse. "}<span style={{ color: F.akzent }}>Ein gemeinsamer Termin.</span>
          </h2>
          <p className="mt-3.5 text-[17px] leading-relaxed" style={{ color: F.daempft }}>
            Im Workshop öffnen wir die Signale, zeigen dir ausgewählte Stimmen aus allen Gruppen und schärfen gemeinsam die Essenz deines Unternehmens. Mit klaren Empfehlungen statt Worthülsen.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2.5 min-h-[52px] px-5 rounded-md bg-white text-base font-bold" style={{ border: `1px solid ${F.hauchRand}` }}>
              <CalendarDays size={18} color={F.akzentTief} aria-hidden="true" /> {t.workshop || "Termin wird gerade vereinbart"}
            </span>
            <a href={`mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent(`andi fragt. Workshop ${d.projekt.firma || ""}`.trim())}`} className="inline-flex items-center gap-2.5 min-h-[52px] px-5 rounded-md text-white text-sm font-semibold uppercase tracking-[0.04em]" style={{ background: F.akzentTief }}>
              {t.workshop ? "Termin bestätigen" : "Termin vorschlagen"} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <ol className="mt-5 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {liste.map((s, i) => {
          const aktiv = s.status === "aktiv";
          const fertig = s.status === "fertig";
          return (
            <li key={s.verb} className="rounded-xl px-5 py-4 flex items-center gap-3.5" style={{ border: aktiv ? `2px solid ${F.akzent}` : `1px solid ${F.linie}`, background: aktiv ? F.hauch : "#fff" }}>
              <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold" style={{ background: fertig ? F.gut : aktiv ? F.akzentTief : "#f1efed", color: fertig ? "#1b4d33" : aktiv ? "#fff" : F.daempft }}>
                {fertig ? <Check size={16} strokeWidth={3} aria-label="erledigt" /> : i + 1}
              </span>
              <span>
                <span className="block text-[19px]"><Wortmarke verb={s.verb} status={s.status} /></span>
                <span className="block text-[13px]" style={{ color: F.daempft }}>{s.datum}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Verborgen() {
  return (
    <span aria-hidden="true" className="flex items-center gap-2 text-[13px]" style={{ color: F.grauMid }}>
      <Lock size={12} strokeWidth={2.4} />
      <span className="whitespace-nowrap" style={{ filter: "blur(4px)" }}>Verborgenes Thema</span>
    </span>
  );
}

function GrosseZahl({ wert, text, akzent = false }) {
  return (
    <div>
      <p className="text-[64px] leading-none font-extrabold" style={akzent ? { color: F.akzent } : undefined}>{wert}</p>
      <p className="mt-2 max-w-[180px] text-sm leading-snug" style={{ color: F.daempft }}>{text}</p>
    </div>
  );
}

function Signale({ s, nr }) {
  const paarText = (p) => `${zg(p.a).lang} und ${zg(p.b).lang}`;
  return (
    <section id="signale" className="max-w-[1160px] mx-auto px-6 pt-24 scroll-mt-4">
      <Etikett>{nr} Erste Signale</Etikett>
      <h2 className={`mt-3 ${H2}`}>Da steckt <span style={{ color: F.akzent }}>etwas drin.</span></h2>
      <p className="mt-4 max-w-[700px] text-[17px] leading-relaxed" style={{ color: F.daempft }}>
        Hier siehst du noch keine Ergebnisse, nur wo es spannend wird. Was genau dahintersteckt, öffnen wir gemeinsam im Workshop. Erst mit der Einordnung wird aus einer Zahl eine Erkenntnis.
      </p>

      {!s && (
        <p className="mt-10 text-base" style={{ color: F.daempft }}>Für Signale braucht es in mindestens einer Gruppe die Mindestzahl an Interviews. Die Auswertung besprechen wir direkt im Workshop.</p>
      )}

      {s?.einigkeit && (
        <article className="mt-10 rounded-2xl p-6 sm:p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ border: `1px solid ${F.linie}` }}>
          <div className="flex-[1_1_300px] min-w-0">
            <Pille zielgruppe={s.einigkeit.zielgruppe} />
            <h3 className="mt-4 text-[26px] leading-tight font-extrabold">Wo {s.einigkeit.zielgruppe === "mitarbeiter" ? "sich dein Team" : `sich die Gruppe ${zg(s.einigkeit.zielgruppe).lang}`} einig ist</h3>
            <div className="mt-6 flex flex-wrap gap-8">
              <GrosseZahl wert={s.einigkeit.einig} text="Themen mit auffallend klarer Meinung" />
              <GrosseZahl wert={s.einigkeit.auseinander} text="Themen, bei denen die Meinungen weit auseinandergehen" akzent />
            </div>
            <p className="mt-6 text-[15px] leading-relaxed" style={{ color: F.daempft }}>
              Wo alle gleich denken, liegt oft eine Stärke, die ihr nach außen noch nicht zeigt. Wo die Meinungen auseinandergehen, liegt Gesprächsbedarf.
            </p>
          </div>
          {s.einigkeit.reihen.length > 0 && (
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-3.5" role="img" aria-label="Themen als Punktreihen: eng beieinander heißt einig, weit verstreut heißt uneinig. Die Themen bleiben bis zum Workshop verborgen.">
              {s.einigkeit.reihen.map((r, i) => (
                <div key={i} className="grid items-center gap-4" style={{ gridTemplateColumns: "130px minmax(0,1fr)" }}>
                  <Verborgen />
                  <div className="relative h-7 rounded-full" style={{ background: F.grau }}>
                    {r.punkte.map((x, j) => (
                      <span key={j} className="absolute top-2 w-3 h-3 -ml-1.5 rounded-full" style={{ left: `${Math.max(2, Math.min(98, x))}%`, background: r.weit ? F.akzent : F.dunkel, opacity: 0.8 }} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="grid gap-4 text-xs" style={{ gridTemplateColumns: "130px minmax(0,1fr)", color: F.grauMid }}>
                <span />
                <span className="flex justify-between"><span>trifft nicht zu</span><span>trifft voll zu</span></span>
              </div>
            </div>
          )}
        </article>
      )}

      {s?.abweichungen && (
        <article className="mt-5 rounded-2xl p-6 sm:p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ background: F.grau, border: `1px solid ${F.linie}` }}>
          <div className="flex-[1_1_300px] min-w-0">
            <div className="flex flex-wrap gap-2">
              {[...new Set(s.abweichungen.paare.flatMap((p) => [p.a, p.b]))].map((k) => <Pille key={k} zielgruppe={k} />)}
            </div>
            <h3 className="mt-4 text-[26px] leading-tight font-extrabold">Selbstbild und Fremdbild</h3>
            <div className="mt-6 flex flex-wrap gap-8">
              {s.abweichungen.paare.map((p, i) => (
                <GrosseZahl key={i} wert={p.anzahl} text={`deutliche Abweichungen zwischen ${paarText(p)}`} akzent={i === 0} />
              ))}
            </div>
            <p className="mt-6 text-[15px] leading-relaxed" style={{ color: F.daempft }}>
              Genau hier setzt die ANDI-Methode an: Nicht der Durchschnitt ist spannend, sondern wo das Bild von innen und das Bild von außen auseinanderfallen.
            </p>
          </div>
          {s.abweichungen.beispiele.length > 0 && (
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-5" role="img" aria-label="Verborgene Themen mit den Positionen zweier Gruppen auf einer Skala und dem Abstand dazwischen.">
              {s.abweichungen.beispiele.map((b, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <Verborgen />
                    <span className="font-semibold">{paarText(b)}</span>
                  </div>
                  <div aria-hidden="true" className="mt-2 relative h-6">
                    <div className="absolute inset-x-0 top-[11px] h-0.5" style={{ background: "#d6d3d0" }} />
                    <div className="absolute top-2 h-2 rounded-full" style={{ left: `${Math.min(b.xa, b.xb)}%`, width: `${Math.abs(b.xa - b.xb)}%`, background: F.akzent, opacity: 0.35 }} />
                    <span className="absolute top-0.5 w-5 h-5 -ml-2.5 rounded-full border-[3px] border-white box-border" style={{ left: `${b.xa}%`, background: zg(b.a).punkt }} />
                    <span className="absolute top-0.5 w-5 h-5 -ml-2.5 rounded-full border-[3px] border-white box-border" style={{ left: `${b.xb}%`, background: zg(b.b).punkt }} />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: F.daempft }}>
                {[...new Set(s.abweichungen.beispiele.flatMap((b) => [b.a, b.b]))].map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="w-3 h-3 rounded-full" style={{ background: zg(k).punkt }} />{zg(k).lang}</span>
                ))}
              </div>
            </div>
          )}
        </article>
      )}

      {s?.intensitaet && (
        <article className="mt-5 rounded-2xl p-6 sm:p-8 flex flex-wrap gap-x-14 gap-y-8" style={{ border: `1px solid ${F.linie}` }}>
          <div className="flex-[1_1_300px] min-w-0">
            <span className="inline-flex items-center min-h-[28px] px-3 rounded-full text-[13px] font-semibold" style={{ background: "#f1efed" }}>Alle Gruppen</span>
            <h3 className="mt-4 text-[26px] leading-tight font-extrabold">Worüber am meisten gesprochen wurde</h3>
            <p className="mt-6 text-[64px] leading-none font-extrabold" style={{ color: F.akzent }}>
              {Number(s.intensitaet.spitze.faktor).toFixed(1).replace(".", ",")}<span className="text-[30px]">fach</span>
            </p>
            <p className="mt-2 max-w-[320px] text-sm leading-snug" style={{ color: F.daempft }}>so viel Text je Antwort wie im Schnitt beim Thema {s.intensitaet.spitze.name}</p>
            <p className="mt-6 text-[15px] leading-relaxed" style={{ color: F.daempft }}>Wo Menschen viel schreiben, ist ihnen etwas wichtig. Ob Lob oder Kritik, zeigen wir dir im Workshop.</p>
          </div>
          <div className="flex-[1_1_420px] min-w-0">
            {(() => {
              const max = Math.max(...s.intensitaet.kapitel.map((k) => k.faktor), 1);
              const schnitt = (1 / max) * 100;
              return (
                <>
                  <ul className="flex flex-col gap-4">
                    {s.intensitaet.kapitel.map((k) => (
                      <li key={k.name} className="grid items-center gap-3.5 text-sm" style={{ gridTemplateColumns: "minmax(120px,180px) minmax(0,1fr) 44px" }}>
                        <span className="font-semibold">{k.name}</span>
                        <span className="relative h-4 rounded-full" style={{ background: F.grau }}>
                          <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(k.faktor / max) * 100}%`, background: k.name === s.intensitaet.spitze.name ? F.akzent : F.dunkel }} />
                          <span aria-hidden="true" className="absolute -top-1.5 -bottom-1.5 border-l-2 border-dashed" style={{ left: `${schnitt}%`, borderColor: F.grauMid }} />
                        </span>
                        <span className="text-right font-bold">{Number(k.faktor).toFixed(1).replace(".", ",")}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex items-center gap-2 text-xs" style={{ color: F.daempft }}>
                    <span aria-hidden="true" className="w-3.5 border-t-2 border-dashed" style={{ borderColor: F.grauMid }} />Durchschnitt aller Themen = 1,0
                  </p>
                </>
              );
            })()}
          </div>
        </article>
      )}

      {s && (
        <p className="mt-6 flex items-start gap-2.5 max-w-[760px] text-sm leading-relaxed" style={{ color: F.daempft }}>
          <Lock size={18} className="shrink-0 mt-0.5" color={F.text} aria-hidden="true" />
          Signale entstehen erst nach Abschluss aller Gruppen und nur aus Fragen mit Skala und aus der Textmenge. Keine Antwort und keine Person ist daraus erkennbar.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
const MODUL_TEXTE = {
  team: {
    nr: "02", kurz: "Teambefragung", titel: "Damit die Guten bleiben.",
    text: "Die anonyme Teambefragung zeigt, was dein Team hält, was es bremst und was es sich wünscht. Daraus entsteht eine Arbeitgebermarke, die stimmt.",
  },
  kunden: {
    nr: "03", kurz: "Kundenbefragung", titel: "Mehr Erfolg, als du glaubst.",
    text: "Kunden sagen selten von sich aus, warum sie bei dir kaufen oder was sie fast zur Konkurrenz getrieben hätte. Gefragt erzählen sie es gern.",
  },
  vertrieb: {
    nr: "04", kurz: "Vertriebsbefragung", titel: "Frag die, die verkaufen.",
    text: "Außendienst, Innendienst und Kunden wissen am genauesten, wo Abschlüsse gelingen und wo sie hängen bleiben. Wir holen dieses Wissen ab, bevor du investierst.",
  },
  wiederholung: {
    nr: "12", kurz: "Wiederholung in 12 Monaten", titel: "Sieh, was sich bewegt hat.",
    text: "Gleiche Kernfragen, neuer Stand. Du siehst schwarz auf weiß, welche Maßnahmen wirken, verglichen mit deinem Ergebnis von heute.",
  },
};

function Module({ d, nr, onInteresse }) {
  const [laeuft, setLaeuft] = useState(null);
  const [fehler, setFehler] = useState("");
  const vorgemerkt = new Set(d.interesse || []);

  const auswahl = useMemo(() => {
    const zgs = new Set(d.gruppen.map((g) => g.zielgruppe));
    const team = d.gruppen.filter((g) => g.zielgruppe === "mitarbeiter");
    const teamFertig = team.reduce((a, g) => a + g.fertig, 0);
    const teamEingeladen = team.reduce((a, g) => a + (g.eingeladen || 0), 0);
    const liste = [];
    if (!zgs.has("mitarbeiter")) {
      liste.push({ key: "team", hook: `${d.kennzahlen.fertig} Interviews zeigen: In deinem Unternehmen wird geantwortet. Eine starke Basis für deine Arbeitgebermarke.` });
    }
    if (!zgs.has("kunden")) {
      liste.push({
        key: "kunden",
        hook: teamEingeladen && teamFertig / teamEingeladen >= 0.5
          ? `${Math.round((teamFertig / teamEingeladen) * 100)} % deines Teams haben ihre Sicht gesagt. Mit der Außensicht deiner Kunden wird das Bild vollständig.`
          : teamFertig
            ? "Dein Team sagt gerade seine Sicht. Mit der Außensicht deiner Kunden wird das Bild vollständig."
            : "Mit der Außensicht deiner Kunden wird das Bild vollständig.",
      });
    }
    liste.push({
      key: "vertrieb",
      hook: zgs.has("kunden")
        ? "Deine Kunden haben geantwortet. Mit dem Blick des Vertriebs wird das Bild vollständig."
        : "Wer täglich verkauft, weiß, welche Argumente beim Kunden wirklich ankommen.",
    });
    liste.push({ key: "wiederholung", hook: "Dein heutiges Ergebnis wird zum Ausgangswert für jeden späteren Vergleich." });
    return liste.slice(0, 3).map((m) => ({ ...m, ...MODUL_TEXTE[m.key] }));
  }, [d]);

  async function vormerken(key) {
    setLaeuft(key);
    setFehler("");
    const ok = await onInteresse(key);
    if (!ok) setFehler("Das hat nicht geklappt. Schreib uns gern direkt an office@rittler.co.");
    setLaeuft(null);
  }

  return (
    <section id="mehr" className="mt-28 scroll-mt-4" style={{ background: F.hauch }}>
      <div className="max-w-[1160px] mx-auto px-6 py-24">
        <Etikett>{nr} Mehr von andi</Etikett>
        <h2 className={`mt-3 ${H2}`}>Was andi noch für dich <span style={{ color: F.akzent }}>fragen kann.</span></h2>
        <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed" style={{ color: F.daempft }}>Dieselbe Methode, andere Fragen. Jede Befragung baut auf dem auf, was du schon weißt.</p>
        {fehler && <p role="alert" className="mt-6 text-sm font-medium" style={{ color: "#b00d36" }}>{fehler}</p>}
        <div className="mt-12 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {auswahl.map((m) => {
            const ist = vorgemerkt.has(m.key);
            return (
              <article key={m.key} className="bg-white rounded-[20px] px-7 py-8 flex flex-col gap-4" style={{ border: `1px solid ${F.hauchRand}` }}>
                <span aria-hidden="true" className="block text-[80px] leading-[0.9] font-black" style={{ color: "transparent", WebkitTextStroke: `2px ${F.akzent}` }}>{m.nr}</span>
                <Etikett className="mt-2">{m.kurz}</Etikett>
                <h3 className="text-[26px] leading-[1.15] font-black uppercase">{m.titel}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: F.daempft }}>{m.text}</p>
                <p className="px-4 py-3.5 rounded-[10px] text-sm leading-relaxed flex gap-2.5" style={{ background: F.grau }}>
                  <Sparkles size={18} color={F.akzentTief} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{m.hook}</span>
                </p>
                <div className="mt-auto pt-2">
                  {ist ? (
                    <div role="status" className="flex items-center justify-center gap-2.5 min-h-[50px] rounded-md text-sm font-semibold" style={{ background: "#e3f7ec", color: F.gutText }}>
                      <Check size={18} strokeWidth={2.6} color="#1d9a5b" aria-hidden="true" /> Vorgemerkt. Wir melden uns bei dir.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => vormerken(m.key)}
                      disabled={laeuft === m.key}
                      className="w-full inline-flex items-center justify-center gap-2.5 min-h-[50px] rounded-md text-white text-sm font-semibold uppercase tracking-[0.04em] disabled:opacity-60"
                      style={{ background: F.akzentTief }}
                    >
                      {laeuft === m.key ? "Wird vorgemerkt" : "Interesse vormerken"} <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

