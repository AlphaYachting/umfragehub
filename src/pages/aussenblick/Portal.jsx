import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Lock, Check, Copy, ExternalLink, Phone, Mail, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Außenblick-Portal unter /a/:code — Stufe null des Kunden-Cockpits von andi fragt.
// Das Unternehmen sieht mit seinem Einladungscode seinen eigenen Spiegel, beantwortet
// fünf Fragen, kann die Fragen weitergeben (Welle), rechnet mit seinen Zahlen und
// kann ein Erstgespräch anfragen. Alles kommt aus der Funktion „aussenblickPortal“;
// diese Seite sieht nie den Befund, nie die Belegstufen, nie etwas Internes.
//
// Typografie wie auf der Startseite: Gilroy hat keine Gedankenstriche, typografischen
// Anführungszeichen oder Mittelpunkte. Feste Texte deshalb mit Doppelpunkt, Komma, Punkt.

const F = {
  akzent: "#ff3764",
  akzentTief: "#e02551",
  etikett: "#d4164a",
  text: "#2d2d2d",
  daempft: "#5a5a5a",
  grauMid: "#767676",
  linie: "#e8e6e4",
  grau: "#f6f5f4",
  hauch: "#fff0f3",
  hauchRand: "#f3c6d1",
  gut: "#45d085",
  gutText: "#1d6b43",
  dunkel: "#2d2d2d",
};
const KONTAKT_MAIL = "office@rittler.co";
const KONTAKT_TEL = "+43 316 570 117";
const H2 = "font-black uppercase leading-[1.1] text-[28px] sm:text-[38px]";
const BREITE = "max-w-[1040px] mx-auto px-5 sm:px-8";
const eur = (n) => (n === null || n === undefined || !Number.isFinite(n) ? "–" : new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n));

// Ansprache: das Portal spricht so, wie das Unternehmen seine Kunden anspricht.
function wort(ansprache) {
  const du = ansprache !== "sie";
  return {
    du,
    dein: du ? "dein" : "Ihr", deine: du ? "deine" : "Ihre", deinen: du ? "deinen" : "Ihren", deinem: du ? "deinem" : "Ihrem", deiner: du ? "deiner" : "Ihrer",
    Dein: du ? "Dein" : "Ihr", Deine: du ? "Deine" : "Ihre",
    du_: du ? "du" : "Sie", Du: du ? "Du" : "Sie", dir: du ? "dir" : "Ihnen", dich: du ? "dich" : "Sie",
    hast: du ? "hast" : "haben", kannst: du ? "kannst" : "können", willst: du ? "willst" : "wollen", bist: du ? "bist" : "sind", gibst: du ? "gibst" : "geben",
  };
}

function Nummer({ n }) {
  return <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: F.etikett }}>{n}</p>;
}

// ---------------------------------------------------------------------------
export default function Portal() {
  const { code } = useParams();
  const [params] = useSearchParams();
  const vorschau = params.get("vorschau") === "1";
  const [d, setD] = useState(null);
  const [laedt, setLaedt] = useState(true);
  const [fehler, setFehler] = useState("");

  const rufen = useCallback(async (body) => {
    const res = await base44.functions.invoke("aussenblickPortal", { code, vorschau, ...body });
    return res?.data || {};
  }, [code, vorschau]);

  const laden = useCallback(async () => {
    setLaedt(true);
    try {
      const r = await rufen({ aktion: "laden" });
      if (r.fehler) { setFehler(r.fehler); setD(null); } else { setD(r); setFehler(""); }
    } catch (e) {
      setFehler("server");
    } finally {
      setLaedt(false);
    }
  }, [rufen]);

  useEffect(() => { laden(); }, [laden]);
  useEffect(() => {
    const vorher = document.title;
    document.title = d?.unternehmen ? `andi fragt. | Außenblick für ${d.unternehmen}` : "andi fragt. | Außenblick";
    return () => { document.title = vorher; };
  }, [d?.unternehmen]);

  // Verweildauer je Block: beim Verlassen eines Blocks (oder der Seite) einmal melden
  const blockStart = useRef({});
  const gemeldet = useRef({});
  const melden = useCallback((block, sek) => {
    if (vorschau || !d) return;
    if (gemeldet.current[block] && sek <= gemeldet.current[block]) return;
    gemeldet.current[block] = sek;
    rufen({ aktion: "ereignis", art: "block", block, dauerSekunden: sek }).catch(() => null);
  }, [rufen, vorschau, d]);
  useEffect(() => {
    if (!d) return undefined;
    const knoten = Array.from(document.querySelectorAll("section[data-block]"));
    const io = new IntersectionObserver((eintraege) => {
      eintraege.forEach((e) => {
        const b = e.target.getAttribute("data-block");
        if (e.isIntersecting) blockStart.current[b] = Date.now();
        else if (blockStart.current[b]) {
          const sek = Math.round((Date.now() - blockStart.current[b]) / 1000);
          delete blockStart.current[b];
          if (sek >= 3) melden(b, sek);
        }
      });
    }, { threshold: 0.4 });
    knoten.forEach((k) => io.observe(k));
    const beimVerlassen = () => {
      Object.entries(blockStart.current).forEach(([b, t]) => { const sek = Math.round((Date.now() - t) / 1000); if (sek >= 3) melden(b, sek); });
    };
    document.addEventListener("visibilitychange", beimVerlassen);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", beimVerlassen); };
  }, [d, melden]);

  if (laedt && !d) return <Huelle><p className="py-24 text-center" style={{ color: F.daempft }}>Einen Moment …</p></Huelle>;
  if (fehler || !d) return <Huelle><Fehler art={fehler} /></Huelle>;

  const w = wort(d.ansprache);
  if (d.welle) return <Huelle vorschau={d.vorschau}><Welle d={d} w={w} rufen={rufen} /></Huelle>;
  return (
    <Huelle vorschau={d.vorschau} unternehmen={d.unternehmen} nav>
      <Einstieg d={d} w={w} />
      <Spiegel d={d} w={w} />
      <Fragen d={d} w={w} rufen={rufen} neuLaden={laden} />
      <WelleBlock d={d} w={w} rufen={rufen} />
      <Rechner d={d} w={w} rufen={rufen} />
      <Erstgespraech d={d} w={w} rufen={rufen} code={code} />
    </Huelle>
  );
}

// ---------------------------------------------------------------------------
function Huelle({ children, vorschau, unternehmen, nav }) {
  const punkte = [["einstieg", "Einstieg"], ["spiegel", "Der Spiegel"], ["fragen", "Fünf Fragen"], ["welle", "Die Welle"], ["rechner", "Der Rechner"], ["erstgespraech", "Erstgespräch"]];
  return (
    <div className="min-h-screen bg-white" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      {vorschau && (
        <div className="px-6 py-2.5 text-sm text-center font-semibold" style={{ background: "#ffd8a8" }}>
          Vorschau für Rittler &amp; Co: Nichts wird gezählt oder gespeichert. Das Unternehmen sieht diese Leiste nicht.
        </div>
      )}
      <header style={{ borderBottom: `1px solid ${F.linie}` }}>
        <div className={`${BREITE} py-3.5 flex flex-wrap items-center gap-x-8 gap-y-2`}>
          <Link to="/" className="text-[24px] font-black" style={{ color: F.text, textDecoration: "none" }}>andi fragt<span style={{ color: F.akzent }}>.</span></Link>
          {nav && (
            <nav aria-label="Abschnitte" className="flex-1 hidden md:flex flex-wrap gap-1">
              {punkte.map(([id, t]) => <a key={id} href={`#${id}`} className="inline-flex items-center min-h-[44px] px-3 text-sm font-medium hover:underline" style={{ color: F.text }}>{t}</a>)}
            </nav>
          )}
          {unternehmen && <span className="ml-auto text-sm font-semibold">{unternehmen}</span>}
        </div>
      </header>
      {children}
      <footer style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className={`${BREITE} py-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px]`} style={{ color: F.daempft }}>
          <span>Rittler &amp; Co GmbH, Graz</span>
          <a href="/impressum" className="hover:underline" style={{ color: F.daempft }}>Impressum</a>
          <a href="/datenschutz" className="hover:underline" style={{ color: F.daempft }}>Datenschutz</a>
          <span className="w-full sm:w-auto sm:ml-auto">Diese Seite ist nur für den Empfänger des Codes bestimmt.</span>
        </div>
      </footer>
    </div>
  );
}

function Fehler({ art }) {
  const text = art === "abgelaufen"
    ? ["Dieser Zugang ist abgelaufen.", "Die Seite war 30 Tage offen. Rufen Sie an, dann öffnen wir sie noch einmal: " + KONTAKT_TEL]
    : art === "gesperrt"
      ? ["Zu viele Versuche.", "Bitte in 15 Minuten noch einmal."]
      : art === "server"
        ? ["Gerade nicht erreichbar.", "Bitte in ein paar Minuten noch einmal versuchen."]
        : ["Diesen Code kennen wir nicht.", "Bitte die Schreibweise prüfen, er steht in Ihrem Brief oder Ihrer E-Mail. Oder anrufen: " + KONTAKT_TEL];
  return (
    <div className={`${BREITE} py-24 max-w-[640px]`}>
      <p className={H2}>{text[0]}</p>
      <p className="mt-4 text-[18px] leading-[1.6]" style={{ color: F.daempft }}>{text[1]}</p>
      <Link to="/aussenblick" className="inline-flex items-center gap-2 mt-8 min-h-[48px] rounded px-6 text-sm font-semibold uppercase tracking-[0.04em]" style={{ background: F.akzent, color: "#fff", textDecoration: "none" }}>Code noch einmal eingeben <ArrowRight size={16} /></Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
function Einstieg({ d, w }) {
  const t = d.texte;
  return (
    <section id="einstieg" data-block="einstieg" className={`${BREITE} pt-14 pb-16 sm:pt-20 sm:pb-20`}>
      <Nummer n="01 · Für {d.unternehmen}" />
      <h1 className="font-black uppercase leading-[0.98] text-[36px] sm:text-[56px] max-w-[880px]">
        {t.einstiegSatz || (w.du ? "Wir haben nur getan, was dein nächster Kunde auch tut: gegoogelt." : "Wir haben nur getan, was Ihr nächster Kunde auch tut: gegoogelt.")}
      </h1>
      <p className="mt-6 text-[19px] sm:text-[21px] leading-[1.6] max-w-[720px]">
        {t.einstiegFolgt || (w.du ? "Was uns dabei aufgefallen ist, und fünf Fragen, die nur du beantworten kannst." : "Was uns dabei aufgefallen ist, und fünf Fragen, die nur Sie beantworten können.")}
      </p>
      <p className="mt-5 text-[15px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>
        Alles auf dieser Seite ist öffentlich: {w.deine} Website, {w.deine} Anzeigen, {w.deine} Bewertungen. Wir haben nichts bewertet, nur nebeneinander gelegt. Jede Karte hat ihre Fundstelle.
      </p>
      <a href="#spiegel" className="inline-flex items-center gap-2 mt-8 min-h-[48px] rounded px-6 text-sm font-semibold uppercase tracking-[0.04em]" style={{ background: F.dunkel, color: "#fff", textDecoration: "none" }}>Zum Spiegel <ArrowRight size={16} /></a>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Karte({ k, kennung }) {
  if (!k) return null;
  return (
    <div className="rounded-lg p-5 sm:p-6 flex flex-col gap-2 min-w-0" style={{ background: "#fff", border: `1px solid ${F.linie}` }}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: F.grauMid }}>{kennung} · {k.label}</p>
      <p className="text-[17px] leading-[1.55]">{k.text}</p>
      {k.url && <a href={k.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold mt-1 hover:underline" style={{ color: F.etikett }}>Fundstelle ansehen <ExternalLink size={14} /></a>}
    </div>
  );
}

function Spiegel({ d, w }) {
  const offen = d.spiegel.filter((s) => !s.gesperrt);
  const gesperrt = d.spiegel.filter((s) => s.gesperrt);
  return (
    <section id="spiegel" data-block="spiegel" style={{ background: F.grau }}>
      <div className={`${BREITE} py-16 sm:py-20`}>
        <Nummer n="02 · Der Spiegel" />
        <h2 className={H2}>Was jeder sieht, der {w.dich} sucht.</h2>
        <p className="mt-4 text-[17px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>Links und rechts stehen zwei Dinge, die beide von {w.dir} stammen. Wir sagen nicht, was richtig wäre. Wir legen sie nebeneinander.</p>
        <div className="mt-10 space-y-10">
          {offen.map((s, i) => (
            <div key={s.id}>
              <p className="text-[20px] sm:text-[24px] font-black leading-[1.25] mb-4">{String(i + 1).padStart(2, "0")} {s.zeile}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Karte k={s.a} kennung="A" />
                <Karte k={s.b} kennung="B" />
              </div>
            </div>
          ))}
          {gesperrt.length > 0 && (
            <div className="rounded-lg p-6 flex gap-4 items-start" style={{ background: "#fff", border: `1px dashed ${F.hauchRand}` }}>
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: F.hauch, color: F.etikett }}><Lock size={18} /></span>
              <div>
                <p className="text-[18px] font-black">{gesperrt.length === 1 ? "Eine weitere Karte" : `${gesperrt.length} weitere Karten`} öffnen sich nach {w.deinen} Antworten.</p>
                <p className="mt-1 text-[15px] leading-[1.6]" style={{ color: F.daempft }}>Sobald {w.du_} {d.schwelle} der fünf Fragen beantwortet {w.hast}, zeigen wir den Rest. Nicht als Belohnung, sondern damit {w.deine} Antworten nicht von unseren Karten gefärbt sind.</p>
                <a href="#fragen" className="inline-flex items-center gap-1.5 mt-3 text-[14px] font-semibold hover:underline" style={{ color: F.etikett }}>Zu den Fragen <ArrowRight size={14} /></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Frage({ f, antwort, w, onSpeichern, rolle }) {
  const [text, setText] = useState(antwort?.text || "");
  const [laeuft, setLaeuft] = useState(false);
  const [ok, setOk] = useState(Boolean(antwort));
  useEffect(() => { setText(antwort?.text || ""); setOk(Boolean(antwort)); }, [antwort?.text]); // eslint-disable-line react-hooks/exhaustive-deps
  const geaendert = text.trim() && text.trim() !== (antwort?.text || "").trim();
  async function speichern() {
    if (!text.trim()) return;
    setLaeuft(true);
    try { await onSpeichern(f.nummer, text.trim(), rolle); setOk(true); } finally { setLaeuft(false); }
  }
  return (
    <div className="rounded-lg p-5 sm:p-6" style={{ border: `1px solid ${ok ? F.gut : F.linie}`, background: "#fff" }}>
      <div className="flex gap-4 items-start">
        <span className="text-[28px] font-black leading-none tabular-nums" style={{ color: F.akzent }}>{f.nummer}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[19px] sm:text-[21px] font-bold leading-[1.35]">{f.text}</p>
          {f.hilfetext && <p className="mt-1.5 text-[14px]" style={{ color: F.daempft }}>{f.hilfetext}</p>}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={w.du ? "Deine Antwort, ein Satz genügt." : "Ihre Antwort, ein Satz genügt."}
            className="mt-4 w-full rounded-md p-3 text-[16px] leading-[1.5] outline-none focus:ring-2"
            style={{ border: `1px solid ${F.linie}`, background: F.grau, color: F.text }}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={speichern} disabled={laeuft || !text.trim() || (!geaendert && ok)} className="inline-flex items-center gap-2 min-h-[44px] rounded px-5 text-sm font-semibold uppercase tracking-[0.04em] disabled:opacity-50" style={{ background: ok && !geaendert ? "#fff" : F.akzent, color: ok && !geaendert ? F.gutText : "#fff", border: ok && !geaendert ? `1px solid ${F.gut}` : "none" }}>
              {ok && !geaendert ? <><Check size={16} /> Gespeichert</> : laeuft ? "Speichert …" : ok ? "Änderung speichern" : "Antwort speichern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fragen({ d, w, rufen, neuLaden }) {
  const antworten = useMemo(() => Object.fromEntries((d.antworten || []).map((a) => [a.nummer, a])), [d.antworten]);
  const [stand, setStand] = useState(Object.keys(antworten).length);
  const [frei, setFrei] = useState(d.gesperrteKarten === 0);
  async function speichern(nummer, text) {
    const r = await rufen({ aktion: "antworten", nummer, text });
    if (r.fehler) throw new Error(r.fehler);
    setStand(r.beantwortet ?? stand + 1);
    if (r.frei && !frei) { setFrei(true); neuLaden(); }
  }
  return (
    <section id="fragen" data-block="fragen" className={`${BREITE} py-16 sm:py-20`}>
      <Nummer n="03 · Fünf Fragen" />
      <h2 className={H2}>Fünf Fragen, die nur {w.du_} beantworten {w.kannst}.</h2>
      <p className="mt-4 text-[17px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>Keine Falle, keine Prüfung. Jede Frage zeigt auf eine Stelle, an der {w.deine} Kanäle verschiedene Dinge sagen. Ein Satz je Frage reicht. {w.Deine} Antworten landen bei Alfons Rittler, sonst nirgends.</p>
      <div className="mt-10 space-y-4">
        {d.fragen.map((f) => <Frage key={f.nummer} f={f} antwort={antworten[f.nummer]} w={w} onSpeichern={speichern} />)}
      </div>
      {d.gesperrteKarten > 0 && !frei && (
        <p className="mt-6 text-[15px]" style={{ color: F.daempft }}>{stand} von {d.schwelle} Antworten: dann öffnen sich die weiteren Karten im Spiegel.</p>
      )}
      {frei && d.gesperrteKarten > 0 && (
        <p className="mt-6 text-[15px] font-semibold" style={{ color: F.gutText }}>Danke. Die weiteren Karten sind jetzt oben im Spiegel offen.</p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
function WelleBlock({ d, w, rufen }) {
  const [kopiert, setKopiert] = useState(false);
  const link = d.welleCode ? `${window.location.origin}/a/${d.welleCode}` : "";
  const text = `${d.texte.welleWeiterleitung || (w.du ? "Ich habe fünf Fragen zu unserem Unternehmen bekommen, die ich gern aus deiner Sicht beantwortet hätte. Dauert fünf Minuten:" : "Ich habe fünf Fragen zu unserem Unternehmen bekommen, die ich gern aus Ihrer Sicht beantwortet hätte. Dauert fünf Minuten:")}\n${link}`;
  async function kopieren() {
    try { await navigator.clipboard.writeText(text); } catch { /* egal */ }
    setKopiert(true);
    rufen({ aktion: "ereignis", art: "welle_geteilt" }).catch(() => null);
    setTimeout(() => setKopiert(false), 3000);
  }
  return (
    <section id="welle" data-block="welle" style={{ background: F.dunkel, color: "#fff" }}>
      <div className={`${BREITE} py-16 sm:py-20`}>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#ff7a98" }}>04 · Die Welle</p>
        <h2 className={H2}>Dieselben fünf Fragen, andere Augen.</h2>
        <p className="mt-4 text-[17px] leading-[1.6] max-w-[720px]" style={{ color: "#d4d4d4" }}>{d.texte.welleText || (w.du ? "Gib die fünf Fragen an drei Mitarbeitende und drei Kunden weiter. Gehen die Antworten auseinander, hast du die Unschärfe selbst erlebt, bevor jemand etwas ändert." : "Geben Sie die fünf Fragen an drei Mitarbeitende und drei Kunden weiter. Gehen die Antworten auseinander, haben Sie die Unschärfe selbst erlebt, bevor jemand etwas ändert.")}</p>
        {link ? (
          <div className="mt-8 rounded-lg p-5" style={{ background: "#3a3a3a" }}>
            <p className="text-[13px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#d4d4d4" }}>{w.Dein} Link zum Weitergeben</p>
            <p className="mt-2 text-[18px] font-bold break-all">{link}</p>
            <p className="mt-3 text-[15px] leading-[1.6] whitespace-pre-wrap" style={{ color: "#d4d4d4" }}>{text.split("\n")[0]}</p>
            <button type="button" onClick={kopieren} className="inline-flex items-center gap-2 mt-5 min-h-[48px] rounded px-6 text-sm font-semibold uppercase tracking-[0.04em]" style={{ background: kopiert ? F.gut : F.akzent, color: "#fff" }}>
              {kopiert ? <><Check size={16} /> Kopiert</> : <><Copy size={16} /> Text und Link kopieren</>}
            </button>
            <p className="mt-4 text-[13px]" style={{ color: "#b3b3b3" }}>Wer über diesen Link antwortet, sieht nur die fünf Fragen, nicht den Spiegel. Die Antworten gehen an Rittler &amp; Co, ohne Namen.</p>
          </div>
        ) : (
          <p className="mt-8 text-[15px]" style={{ color: "#d4d4d4" }}>Den Link zum Weitergeben bekommst {w.du_} von Alfons Rittler, sobald {w.deine} eigenen Antworten da sind.</p>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Rechner({ d, w, rufen }) {
  const [budget, setBudget] = useState("");
  const [anfragen, setAnfragen] = useState("");
  const [auftraege, setAuftraege] = useState("");
  const [r1, setR1] = useState(0); // mehr passende Anfragen, Prozent
  const [r2, setR2] = useState(0); // höhere Abschlussquote, Prozent
  const [r3, setR3] = useState(0); // weniger Budget, Prozent
  const [gemerkt, setGemerkt] = useState(false);
  const z = (s) => { const n = Number(String(s).replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) && n > 0 ? n : null; };
  const b = z(budget), a = z(anfragen), u = z(auftraege);
  const jeAnfrage = b && a ? b / a : null;
  const jeAuftrag = b && u ? b / u : null;
  const b2 = b ? b * (1 - r3 / 100) : null;
  const a2 = a ? a * (1 + r1 / 100) : null;
  const quote = a && u ? u / a : null;
  const u2 = a2 && quote ? a2 * quote * (1 + r2 / 100) : null;
  const jeAuftrag2 = b2 && u2 ? b2 / u2 : null;
  async function merken() {
    const r = await rufen({ aktion: "rechner", budgetMonat: b, anfragen: a, auftraege: u, regler: { r1, r2, r3 } });
    if (!r.fehler) setGemerkt(true);
  }
  const feld = (label, wert, setzen, einheit) => (
    <label className="block">
      <span className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: F.grauMid }}>{label}</span>
      <span className="mt-1.5 flex items-center rounded-md" style={{ border: `1px solid ${F.linie}`, background: "#fff" }}>
        <input inputMode="decimal" value={wert} onChange={(e) => { setzen(e.target.value); setGemerkt(false); }} className="w-full min-h-[48px] px-3 text-[18px] font-bold bg-transparent outline-none" placeholder="0" />
        <span className="px-3 text-[14px]" style={{ color: F.grauMid }}>{einheit}</span>
      </span>
    </label>
  );
  const regler = (label, wert, setzen, max) => (
    <label className="block">
      <span className="flex justify-between text-[14px]"><span>{label}</span><span className="font-bold tabular-nums">+{wert} %</span></span>
      <input type="range" min={0} max={max} step={5} value={wert} onChange={(e) => setzen(Number(e.target.value))} className="w-full mt-1.5" style={{ accentColor: F.akzent }} />
    </label>
  );
  return (
    <section id="rechner" data-block="rechner" style={{ background: F.grau }}>
      <div className={`${BREITE} py-16 sm:py-20`}>
        <Nummer n="05 · Der Rechner" />
        <h2 className={H2}>{w.Deine} Zahlen. Unsere Rechnung.</h2>
        <p className="mt-4 text-[17px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>Drei Zahlen, die nur {w.du_} {w.hast}. Wir rechnen nur, wir schätzen nichts. Was {w.du_} hier {w.gibst}, bleibt {w.dein}e Zahl.</p>
        <div className="mt-10 grid md:grid-cols-[1fr_1fr] gap-8">
          <div className="space-y-4">
            {feld("Monatsbudget für Anzeigen", budget, setBudget, "€")}
            {feld("Anfragen je Monat", anfragen, setAnfragen, "Stück")}
            {feld("Abschlüsse je Monat", auftraege, setAuftraege, "Stück")}
          </div>
          <div className="rounded-lg p-6" style={{ background: "#fff", border: `1px solid ${F.linie}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: F.grauMid }}>Heute</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div><p className="text-[30px] font-black tabular-nums leading-none">{eur(jeAnfrage)}</p><p className="mt-1 text-[14px]" style={{ color: F.daempft }}>je Anfrage</p></div>
              <div><p className="text-[30px] font-black tabular-nums leading-none">{eur(jeAuftrag)}</p><p className="mt-1 text-[14px]" style={{ color: F.daempft }}>je Abschluss</p></div>
            </div>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: F.grauMid }}>Was wäre, wenn</p>
            <div className="mt-3 space-y-4">
              {regler("mehr Anfragen aus der richtigen Zielgruppe", r1, setR1, 100)}
              {regler("höhere Abschlussquote", r2, setR2, 100)}
              {regler("weniger Budget", r3, setR3, 50)}
            </div>
            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${F.linie}` }}>
              <p className="text-[30px] font-black tabular-nums leading-none" style={{ color: jeAuftrag2 && jeAuftrag && jeAuftrag2 < jeAuftrag ? F.gutText : F.text }}>{eur(jeAuftrag2)}</p>
              <p className="mt-1 text-[14px]" style={{ color: F.daempft }}>je Abschluss, mit {w.deinen} Annahmen</p>
            </div>
            <button type="button" onClick={merken} disabled={!b || gemerkt} className="inline-flex items-center gap-2 mt-6 min-h-[44px] rounded px-5 text-sm font-semibold uppercase tracking-[0.04em] disabled:opacity-50" style={{ background: gemerkt ? "#fff" : F.dunkel, color: gemerkt ? F.gutText : "#fff", border: gemerkt ? `1px solid ${F.gut}` : "none" }}>
              {gemerkt ? <><Check size={16} /> Für das Gespräch gemerkt</> : "Für das Erstgespräch merken"}
            </button>
          </div>
        </div>
        {(d.texte.rechnerHebel || d.hebel?.length > 0) && (
          <div className="mt-10 max-w-[760px]">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: F.grauMid }}>Woher der Hebel kommt</p>
            <p className="mt-2 text-[17px] leading-[1.6]">{d.texte.rechnerHebel || d.hebel[0]}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function Erstgespraech({ d, w, rufen, code }) {
  const betreff = encodeURIComponent(`Erstgespräch ${d.unternehmen} (${code})`);
  function klick() { rufen({ aktion: "ereignis", art: "erstgespraech_klick" }).catch(() => null); }
  return (
    <section id="erstgespraech" data-block="erstgespraech" className={`${BREITE} py-16 sm:py-24`}>
      <Nummer n="06 · Erstgespräch" />
      <h2 className={H2}>Dreißig Minuten mit {d.texte.erstgespraechKontakt || "Alfons Rittler"}.</h2>
      <p className="mt-4 text-[17px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>{d.texte.erstgespraechText || (w.du ? "Kostenlos, keine Präsentation. Du bringst deine fünf Antworten mit, wir bringen die Fundstellen." : "Kostenlos, keine Präsentation. Sie bringen Ihre fünf Antworten mit, wir bringen die Fundstellen.")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`mailto:${KONTAKT_MAIL}?subject=${betreff}`} onClick={klick} className="inline-flex items-center gap-2 min-h-[52px] rounded px-7 text-sm font-semibold uppercase tracking-[0.04em]" style={{ background: F.akzent, color: "#fff", textDecoration: "none" }}><Mail size={16} /> Termin anfragen</a>
        <a href={`tel:${KONTAKT_TEL.replace(/\s+/g, "")}`} onClick={klick} className="inline-flex items-center gap-2 min-h-[52px] rounded px-7 text-sm font-semibold uppercase tracking-[0.04em]" style={{ border: `1px solid ${F.text}`, color: F.text, textDecoration: "none" }}><Phone size={16} /> {KONTAKT_TEL}</a>
      </div>
      <p className="mt-8 text-[13px] leading-[1.6] max-w-[720px]" style={{ color: F.grauMid }}>
        {w.Deine} Antworten und Zahlen gehen ausschließlich an Rittler &amp; Co GmbH und werden ohne Folgekontakt nach 90 Tagen gelöscht.{d.gueltigBis ? ` Diese Seite bleibt bis ${d.gueltigBis.slice(8, 10)}.${d.gueltigBis.slice(5, 7)}.${d.gueltigBis.slice(0, 4)} offen.` : ""}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Welle: Mitarbeitende und Kunden sehen nur die fünf Fragen.
function Welle({ d, w, rufen }) {
  const [rolle, setRolle] = useState("");
  const [fertig, setFertig] = useState(0);
  async function speichern(nummer, text) {
    const r = await rufen({ aktion: "antworten", nummer, text, rolle });
    if (r.fehler) throw new Error(r.fehler);
    setFertig((n) => n + 1);
  }
  return (
    <section data-block="welle-fragen" className={`${BREITE} py-14 sm:py-20`}>
      <Nummer n={`Fünf Fragen zu ${d.unternehmen}`} />
      <h1 className="font-black uppercase leading-[0.98] text-[34px] sm:text-[52px] max-w-[880px]">{d.unternehmen} hat {w.dich} um {w.deine} Sicht gebeten.</h1>
      <p className="mt-5 text-[18px] leading-[1.6] max-w-[720px]" style={{ color: F.daempft }}>Fünf Fragen, ein Satz je Frage. Kein Name, keine E-Mail. {w.Deine} Antworten gehen an Rittler &amp; Co, die Agentur, die {d.unternehmen} dabei begleitet, und werden nur gesammelt weitergegeben.</p>
      <div className="mt-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: F.grauMid }}>{w.Du} {w.bist} …</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[["mitarbeiter", w.du ? "im Team" : "im Team"], ["kunde", w.du ? "Kunde oder Kundin" : "Kunde oder Kundin"], ["unbekannt", "etwas anderes"]].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setRolle(k)} className="inline-flex items-center min-h-[44px] px-4 rounded-full text-[15px] font-medium" style={rolle === k ? { background: F.dunkel, color: "#fff" } : { border: `1px solid ${F.hauchRand}`, color: F.text, background: "#fff" }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-4" style={{ opacity: rolle ? 1 : 0.45, pointerEvents: rolle ? "auto" : "none" }}>
        {d.fragen.map((f) => <Frage key={f.nummer} f={f} antwort={null} w={w} onSpeichern={speichern} rolle={rolle} />)}
      </div>
      {fertig >= d.fragen.length && d.fragen.length > 0 && (
        <p className="mt-8 text-[18px] font-bold" style={{ color: F.gutText }}>Danke. Das war alles.</p>
      )}
      {!rolle && <p className="mt-4 text-[14px]" style={{ color: F.daempft }}>Bitte zuerst oben wählen, aus welcher Sicht {w.du_} {w.du ? "antwortest" : "antworten"}.</p>}
    </section>
  );
}

export { RefreshCw };
