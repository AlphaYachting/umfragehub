import React, { useState } from "react";
import {
  Archive, Banknote, CirclePause, Clock, Copy, Equal, EyeOff, FileQuestion, Gauge, Handshake, Layers,
  MessageSquareX, PhoneOff, RefreshCw, Scale, ShieldAlert, Target, TrendingUp, TriangleAlert, UserX, Users, X, Zap,
  Star, Globe, MessageCircle, User, Heart, Wrench, FileText, TrendingDown, Check,
} from "lucide-react";
import { F } from "@/components/oeffentlich/Oeffentlich";
import { Text } from "@/components/oeffentlich/wissen/Bausteine";

// Grafik-Bausteine der Beitragsseiten: Kennzahlen, Karten und Abbildungen.
// Aussehen wie in den Prototypen "Wissen Nr. ... visuell" auf der Arbeitsfläche.
// Alles ist responsive: Raster mit auto-fit, SVGs mit viewBox, und wo Schrift im SVG am Handy
// zu klein würde, gibt es eine eigene schmale Fassung (sm:hidden / hidden sm:block).
// Regel für Inhalte: Zahlen nur mit Quelle aus dem Beitragstext; Beispiele immer als Beispiel kennzeichnen.

const PINK = "#ff3764";
const PINK_HELL = "#ffb3c4";
const SCHRIFT = "'Gilroy', 'Outfit', Arial, sans-serif";

export const SYMBOLE = {
  perspektive: TrendingUp, druck: Gauge, stumm: MessageSquareX, fuehrung: UserX, geld: Banknote, nein: X,
  waage: Scale, telefon: PhoneOff, warnung: TriangleAlert, schnell: Zap, wechsel: RefreshCw, unsichtbar: EyeOff,
  pause: CirclePause, gruppe: Users, uhr: Clock, varianten: Layers, kopie: Copy, schild: ShieldAlert,
  gleich: Equal, frage: FileQuestion, archiv: Archive, ziel: Target, handschlag: Handshake,
  stern: Star, globus: Globe, sprechblase: MessageCircle, person: User, herz: Heart, werkzeug: Wrench,
  dokument: FileText, abwaerts: TrendingDown,
};

const FARBEN = { akzent: PINK, hell: PINK_HELL, dunkel: F.dunkel, grau: "#b3b3b3", mittel: "#8a8a8a", leer: "#dcd8d4", gruen: "#e3f4ea" };
const farbe = (f) => FARBEN[f] || f || F.dunkel;

function Grafik({ b, children }) {
  const rahmen = b.stil === "rahmen";
  return (
    <figure className="mt-2 mb-8 p-5 sm:p-[26px] rounded-[20px]" style={rahmen ? { border: `1px solid ${F.linie}` } : { background: F.grau }}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: F.link }}>Abbildung {b._nr}</p>
      {b.titel && <p className="mt-1.5 text-[19px] sm:text-[21px] font-extrabold leading-[1.3]" style={{ color: F.text }}><Text>{b.titel}</Text></p>}
      {children}
      {b.fazit && <p className="mt-[18px] text-base sm:text-[17px] leading-[1.55] font-semibold" style={{ color: F.text }}><Text>{b.fazit}</Text></p>}
      {b.unterschrift && <figcaption className="mt-3 text-sm leading-normal" style={{ color: F.daempft }}><Text>{b.unterschrift}</Text></figcaption>}
    </figure>
  );
}

function Legende({ eintraege, className = "mt-3.5" }) {
  if (!eintraege?.length) return null;
  return (
    <div className={`${className} flex flex-wrap gap-x-5 gap-y-2 text-sm sm:text-[15px] font-semibold`} style={{ color: F.text }}>
      {eintraege.map((e, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className={e.form === "balken" ? "w-6 h-1.5 rounded-sm" : e.form === "quadrat" ? "w-3.5 h-3.5 rounded-[3px]" : "w-3.5 h-3.5 rounded-full"}
            style={{ background: farbe(e.farbe) }}
          />
          <Text>{e.text}</Text>
        </span>
      ))}
    </div>
  );
}

// Kennzahlen: drei dunkle Kacheln unter "Das Wichtigste in Kürze"
export function Kennzahlen({ liste }) {
  if (!liste?.length) return null;
  return (
    <div role="list" aria-label="Zahlen zum Thema" className="mt-9 grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]">
      {liste.map((k, i) => (
        <div role="listitem" key={i} className="flex flex-col gap-2.5 px-[22px] py-6 rounded-[18px]" style={{ background: F.dunkel }}>
          <p className={`${String(k.wert).length > 4 ? "text-[40px] sm:text-[46px]" : "text-[48px] sm:text-[56px]"} font-black leading-[1.05] text-white`}>
            {k.wert}{k.einheit && <span style={{ color: PINK }}>{k.einheit}</span>}
          </p>
          <p className="text-base leading-normal" style={{ color: "#e6e6e6" }}>{k.text}</p>
          <p className="mt-auto text-[13px] leading-[1.4]" style={{ color: "#b3b3b3" }}>{k.quelle}</p>
        </div>
      ))}
    </div>
  );
}

// Karten mit Symbol, ersetzen Listen mit Randstrich
// stil "ergebnis": für Karten, die zeigen, was der Kunde bekommt. Grün mit Haken statt Pink, damit es positiv wirkt.
const GRUEN = { flaeche: "#f2fbf6", rand: "#cdeedb", symbol: "#1f7a4a", haken: "#45d085" };
function Karten({ b }) {
  const dunkel = b.stil === "dunkel";
  const ergebnis = b.stil === "ergebnis";
  return (
    <ul className="mb-[26px] grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]">
      {b.karten.map((k, i) => {
        const Symbol = SYMBOLE[k.symbol] || X;
        const anlass = !!k.anlass;
        const kreis = ergebnis ? "#ffffff" : dunkel ? PINK : anlass ? "#ffffff" : k.symbol === "nein" ? F.grau : F.hauch;
        const strich = ergebnis ? GRUEN.symbol : dunkel ? F.dunkel : anlass || k.symbol === "nein" ? F.daempft : F.link;
        return (
          <li
            key={i}
            className="flex flex-col gap-3 p-[22px] rounded-[18px]"
            style={ergebnis ? { background: GRUEN.flaeche, border: `1px solid ${GRUEN.rand}` } : dunkel ? { background: F.dunkel } : anlass ? { background: F.grau, border: "1.5px dashed #b3b3b3" } : { border: `1px solid ${F.linie}` }}
          >
            <span className="flex items-center justify-between gap-2.5">
              <span aria-hidden="true" className="relative inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ background: kreis }}>
                <Symbol size={k.symbol === "nein" ? 22 : 24} strokeWidth={k.symbol === "nein" ? 2.4 : 2} color={strich} />
                {ergebnis && (
                  <span className="absolute -right-1 -bottom-1 inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: GRUEN.haken, boxShadow: `0 0 0 2px ${GRUEN.flaeche}` }}>
                    <Check size={12} strokeWidth={3.2} color="#ffffff" />
                  </span>
                )}
              </span>
              {anlass && <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: F.daempft }}>{k.anlass}</span>}
            </span>
            <span className="text-[19px] font-extrabold leading-[1.3]" style={{ color: dunkel ? "#ffffff" : F.text }}>{k.titel}</span>
            <span className="text-base leading-[1.6]" style={{ color: dunkel ? "#d4d4d4" : F.daempft }}><Text>{k.text}</Text></span>
          </li>
        );
      })}
    </ul>
  );
}

const zahl = (n) => String(Math.round(n / 1000) * 1000).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Rechner({ r }) {
  const [wert, setWert] = useState(r.start);
  return (
    <div className="mt-7 pt-6" style={{ borderTop: "1px solid #d6d3d0" }}>
      <label htmlFor="regler-wert" className="block text-[17px] font-extrabold" style={{ color: F.text }}>{r.label}</label>
      <p className="mt-1.5 text-[26px] sm:text-[28px] font-black leading-[1.2]" style={{ color: F.text }}>
        {zahl(wert)} {r.einheit} <span className="text-base font-semibold" style={{ color: F.daempft }}>{r.zusatz}</span>
      </p>
      <input
        id="regler-wert"
        type="range"
        min={r.min}
        max={r.max}
        step={r.step}
        value={wert}
        onChange={(e) => setWert(Number(e.target.value))}
        aria-valuetext={`${zahl(wert)} ${r.einheit}`}
        className="w-full h-11 m-0 cursor-pointer"
        style={{ accentColor: PINK }}
      />
      <div aria-live="polite" className="mt-2.5 grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))]">
        {r.ergebnisse.map((e) => (
          <div key={e.name} className="p-4 rounded-[14px]" style={{ background: e.dunkel ? F.dunkel : "#ffffff" }}>
            <p className="text-sm leading-[1.4]" style={{ color: e.dunkel ? "#d4d4d4" : F.daempft }}>{e.name}</p>
            <p className="mt-1 text-[22px] font-black leading-[1.2]" style={{ color: e.dunkel ? "#ffffff" : F.text }}>rund {zahl(wert * e.faktor)} {r.einheit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontale Balken, wahlweise mit Rechner
function Balken({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-[22px] flex flex-col gap-[18px]">
        {b.zeilen.map((z) => (
          <div key={z.label}>
            <div className="flex justify-between gap-3 text-base font-bold" style={{ color: F.text }}>
              <span>{z.label}</span>
              <span className="font-black whitespace-nowrap" style={{ color: z.akzent ? F.link : F.text }}>{z.wert}</span>
            </div>
            <div aria-hidden="true" className="mt-2 rounded-full" style={{ height: b.dick ? 22 : 16, background: "#e8e6e4" }}>
              <div className="rounded-full" style={{ width: `${z.anteil}%`, height: "100%", background: z.akzent ? PINK : z.grau ? "#8a8a8a" : F.dunkel }} />
            </div>
          </div>
        ))}
      </div>
      {b.rechner && <Rechner r={b.rechner} />}
    </Grafik>
  );
}

// Figuren-Raster (Personen), zum Beispiel 34 von 40
function Figuren({ b }) {
  const spalten = b.spalten || 10;
  const reihen = Math.ceil(b.gesamt / spalten);
  return (
    <Grafik b={b}>
      <svg viewBox={`0 0 ${spalten * 64} ${reihen * 80}`} width="100%" role="img" aria-label={b.beschreibung} className="block mt-5" style={{ maxWidth: spalten * 56 }}>
        {Array.from({ length: b.gesamt }, (_, i) => {
          const x = (i % spalten) * 64;
          const y = Math.floor(i / spalten) * 80;
          const f = i < b.markiert ? farbe(b.farbeMarkiert || "akzent") : farbe(b.farbeRest || "#c9c6c3");
          return (
            <g key={i} fill={f}>
              <circle cx={x + 32} cy={y + 22} r="11" />
              <path d={`M${x + 14} ${y + 70} v-12 a18 18 0 0 1 36 0 v12 z`} />
            </g>
          );
        })}
      </svg>
      <Legende eintraege={b.legende} />
    </Grafik>
  );
}

// Waffel-Raster: 100 Felder je Kennzahl
function Waffel({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-5 grid gap-7 grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        {b.felder.map((w, n) => (
          <div key={n}>
            <div role="img" aria-label={`${w.zahl} von 100 Feldern gefärbt`} className="grid grid-cols-10 gap-1 max-w-[280px]">
              {Array.from({ length: 100 }, (_, i) => (
                <span key={i} className="aspect-square rounded-[3px]" style={{ background: i < w.zahl ? (w.akzent ? PINK : F.dunkel) : "#dcd8d4" }} />
              ))}
            </div>
            <p className="mt-3.5 text-[40px] font-black leading-none" style={{ color: w.akzent ? F.link : F.text }}>{w.zahl}</p>
            <p className="mt-1.5 text-base leading-normal" style={{ color: "#3a3a3a" }}>{w.text}</p>
          </div>
        ))}
      </div>
    </Grafik>
  );
}

// Verlauf zweier Werte zwischen zwei Zeitpunkten (Steigungsdiagramm)
function VerlaufSvg({ b, w, xl, xr, gross }) {
  const hoehe = 360;
  const y = (v) => 340 - (v / b.max) * 280;
  const fs = gross ? { kopf: 16, name: 19, wert: 28 } : { kopf: 13, name: 15, wert: 22 };
  return (
    <svg viewBox={`0 0 ${w} ${hoehe}`} width="100%" role="img" aria-label={b.beschreibung} className="block" style={{ fontFamily: SCHRIFT }}>
      <text x={xl} y="26" fill={F.daempft} fontSize={fs.kopf} fontWeight="600" textAnchor="middle">{b.links}</text>
      <text x={xr} y="26" fill={F.daempft} fontSize={fs.kopf} fontWeight="600" textAnchor="middle">{b.rechts}</text>
      <line x1={xl} y1="44" x2={xl} y2="345" stroke="#e8e6e4" strokeWidth="2" />
      <line x1={xr} y1="44" x2={xr} y2="345" stroke="#e8e6e4" strokeWidth="2" />
      {b.linien.map((l) => {
        const c = l.akzent ? PINK : "#8a8a8a";
        const t = l.akzent ? F.link : F.text;
        return (
          <g key={l.name}>
            <line x1={xl} y1={y(l.von)} x2={xr} y2={y(l.bis)} stroke={c} strokeWidth={l.akzent ? 5 : 4} strokeLinecap="round" />
            <circle cx={xl} cy={y(l.von)} r="9" fill={c} />
            <circle cx={xr} cy={y(l.bis)} r="9" fill={c} />
            <text x={gross ? 24 : 6} y={y(l.von) + 7} fill={t} fontSize={fs.name} fontWeight="700">{l.name}</text>
            <text x={xl - (gross ? 20 : 16)} y={y(l.von) + 9} fill={t} fontSize={fs.wert} fontWeight="900" textAnchor="end">{l.von} %</text>
            <text x={xr + (gross ? 22 : 16)} y={y(l.bis) + 9} fill={t} fontSize={fs.wert} fontWeight="900">{l.bis} %</text>
          </g>
        );
      })}
    </svg>
  );
}

function Verlauf({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-[18px] hidden sm:block"><VerlaufSvg b={b} w={760} xl={230} xr={560} gross /></div>
      <div className="mt-[18px] sm:hidden"><VerlaufSvg b={b} w={420} xl={160} xr={318} /></div>
    </Grafik>
  );
}

// Zeitstrahl in Stufen mit Phasen-Farbe
function Zeitstrahl({ b }) {
  const rand = { handeln: PINK, spaet: "#d6d3d0", ende: F.dunkel };
  const ziffer = { handeln: F.link, spaet: F.daempft, ende: F.text };
  return (
    <Grafik b={b}>
      <Legende eintraege={b.legende} />
      <ol className="mt-5 grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,128px),1fr))]">
        {b.stufen.map((s, i) => (
          <li key={i} className="pt-3.5" style={{ borderTop: `6px solid ${rand[s.phase] || PINK}` }}>
            <span className="text-[13px] font-black" style={{ color: ziffer[s.phase] || F.link }}>{i + 1}</span>
            <p className="mt-1 text-base font-extrabold leading-[1.3]" style={{ color: F.text }}>{s.titel}</p>
            <p className="mt-1.5 text-sm leading-normal" style={{ color: F.daempft }}>{s.text}</p>
          </li>
        ))}
      </ol>
    </Grafik>
  );
}

// Punkte auf einer Skala: zwei Sichten je Thema (Hantel) oder ein Punkt je Gruppe (Streuung)
function Skalenzeile({ punkte, spanne, schnitt }) {
  return (
    <span aria-hidden="true" className="relative h-7">
      <span className="absolute left-0 right-0 top-3 h-1 rounded-sm" style={{ background: "#dcd8d4" }} />
      {schnitt != null && <span className="absolute top-0 bottom-0" style={{ left: `${schnitt}%`, borderLeft: "2px dashed #8a8a8a" }} />}
      {spanne && <span className="absolute top-2.5 h-2 rounded" style={{ left: `${spanne.von}%`, width: `${spanne.bis - spanne.von}%`, background: spanne.akzent ? PINK_HELL : "#d6d3d0" }} />}
      {punkte.map((p, i) => (
        <span key={i} className="absolute rounded-full" style={{ left: `calc(${p.pos}% - ${p.gross ? 11 : 9}px)`, top: p.gross ? 3 : 5, width: p.gross ? 22 : 18, height: p.gross ? 22 : 18, background: p.farbe }} />
      ))}
    </span>
  );
}

function Hebelmarke({ text }) {
  return (
    <span className="self-start px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.08em]" style={{ background: F.hauch, border: `1px solid ${PINK}`, color: F.link }}>
      {text}
    </span>
  );
}

function Hantel({ b }) {
  return (
    <Grafik b={b}>
      <Legende eintraege={b.legende} />
      <div className="mt-[22px] grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[128px_minmax(0,1fr)] gap-x-4 gap-y-1 items-center">
        <span />
        <span aria-hidden="true" className="flex justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: F.daempft }}>
          <span>{b.skala[0]}</span><span>{b.skala[1]}</span>
        </span>
        {b.zeilen.map((z) => {
          const von = Math.min(z.a, z.b);
          const bis = Math.max(z.a, z.b);
          return (
            <React.Fragment key={z.label}>
              <span className="flex flex-col gap-0.5 py-2.5">
                <span className={`text-[15px] sm:text-base ${z.hebel ? "font-extrabold" : "font-bold"}`} style={{ color: F.text }}>{z.label}</span>
                {z.hebel && <Hebelmarke text={b.hebelText} />}
              </span>
              <Skalenzeile spanne={{ von, bis, akzent: z.hebel }} punkte={[{ pos: z.b, farbe: PINK }, { pos: z.a, farbe: F.dunkel }]} />
            </React.Fragment>
          );
        })}
      </div>
    </Grafik>
  );
}

function Streuung({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-[18px] flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
        <span className="text-[48px] sm:text-[56px] font-black leading-none" style={{ color: F.text }}>{b.wert}</span>
        <span className="text-base font-semibold" style={{ color: F.daempft }}>{b.wertText}</span>
      </div>
      <div className="mt-[22px] grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[112px_minmax(0,1fr)] gap-x-4 gap-y-1.5 items-center">
        {b.zeilen.map((z) => (
          <React.Fragment key={z.label}>
            <span className="flex flex-col gap-0.5 py-2.5">
              <span className={`text-[15px] sm:text-base ${z.hebel ? "font-extrabold" : "font-bold"}`} style={{ color: F.text }}>{z.label}</span>
              {z.hebel && <Hebelmarke text={b.hebelText} />}
            </span>
            <Skalenzeile schnitt={b.schnitt} punkte={[{ pos: z.pos, farbe: z.hebel ? PINK : F.dunkel, gross: z.hebel }]} />
          </React.Fragment>
        ))}
        <span />
        <span aria-hidden="true" className="relative h-5 text-[13px] font-bold" style={{ color: F.daempft }}>
          <span className="absolute left-0">{b.skala[0]}</span>
          <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${b.schnitt}%` }}>{b.schnittText}</span>
          <span className="absolute right-0">{b.skala[1]}</span>
        </span>
      </div>
    </Grafik>
  );
}

// Drei Kreise, die sich überschneiden
function Venn({ b }) {
  const zeilen = (liste, x, yMitte, f) => liste.map((t, i) => (
    <text key={i} x={x} y={yMitte - (liste.length - 1) * 13 + i * 26 + 7} fill={f} fontSize="21" fontWeight="800" textAnchor="middle">{t}</text>
  ));
  return (
    <Grafik b={b}>
      <svg viewBox="0 0 640 540" width="100%" role="img" aria-label={b.beschreibung} className="block mx-auto mt-4 max-w-[560px]" style={{ fontFamily: SCHRIFT }}>
        <circle cx="230" cy="210" r="170" fill={F.dunkel} fillOpacity="0.07" stroke={F.dunkel} strokeWidth="2" />
        <circle cx="410" cy="210" r="170" fill="#8a8a8a" fillOpacity="0.08" stroke="#8a8a8a" strokeWidth="2" />
        <circle cx="320" cy="360" r="170" fill={PINK} fillOpacity="0.12" stroke={PINK} strokeWidth="2.5" />
        {zeilen(b.kreise[0], 150, 160, F.text)}
        {zeilen(b.kreise[1], 490, 160, F.text)}
        {zeilen(b.kreise[2], 320, 470, F.link)}
        <circle cx="320" cy="262" r="46" fill={PINK} />
        {b.mitte.map((t, i) => (
          <text key={i} x="320" y={262 - (b.mitte.length - 1) * 11 + i * 22 + 6} fill={F.dunkel} fontSize="18" fontWeight="900" textAnchor="middle">{t}</text>
        ))}
      </svg>
    </Grafik>
  );
}

// Test zum Anklicken: Kandidat wählen, drei Fragen, Ergebnis
function Test({ b }) {
  const [wahl, setWahl] = useState(0);
  const STIL = {
    ja: { text: "Ja", grund: "#e3f4ea", schrift: "#1d6b43" },
    kaum: { text: "Kaum", grund: "#fff3d6", schrift: "#7a4f00" },
    nein: { text: "Nein", grund: "#e8e6e4", schrift: "#3a3a3a" },
  };
  const k = b.kandidaten[wahl];
  return (
    <Grafik b={b}>
      <div role="group" aria-label="Kandidat wählen" className="mt-4 flex flex-wrap gap-2">
        {b.kandidaten.map((c, i) => (
          <button
            key={c.name}
            type="button"
            aria-pressed={i === wahl}
            onClick={() => setWahl(i)}
            className="inline-flex items-center min-h-[44px] px-4 rounded-full text-[15px] font-bold text-left"
            style={i === wahl ? { background: F.dunkel, color: "#ffffff", border: `1.5px solid ${F.dunkel}` } : { background: "#ffffff", color: F.text, border: "1.5px solid #d6d3d0" }}
          >
            {c.name}
          </button>
        ))}
      </div>
      <ol className="mt-5 grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))]">
        {b.fragen.map((f, i) => {
          const s = STIL[k.antworten[i]];
          return (
            <li key={f} className="flex flex-col gap-3 p-[18px] rounded-2xl" style={{ background: F.grau }}>
              <span className="text-[13px] font-black" style={{ color: F.daempft }}>Frage {i + 1}</span>
              <span className="text-[17px] font-extrabold leading-[1.35]" style={{ color: F.text }}>{f}</span>
              <span className="self-start inline-flex items-center min-h-[30px] px-3 rounded-full text-sm font-extrabold" style={{ background: s.grund, color: s.schrift }}>{s.text}</span>
            </li>
          );
        })}
      </ol>
      <div aria-live="polite" className="mt-3.5 px-5 py-[18px] rounded-2xl" style={k.usp ? { background: F.hauch, border: `2px solid ${PINK}` } : { background: F.grau, border: "2px solid #d6d3d0" }}>
        <p className="text-[19px] font-black leading-[1.3]" style={{ color: k.usp ? F.link : F.text }}>{k.usp ? b.jaText : b.neinText}</p>
        <p className="mt-1.5 text-base leading-[1.55]" style={{ color: "#3a3a3a" }}>{k.erklaerung}</p>
      </div>
    </Grafik>
  );
}

// Zwei Gesprächsverläufe nebeneinander
function Dialog({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-5 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))]">
        {b.seiten.map((s) => (
          <div key={s.etikett} className="flex flex-col gap-3 p-5 rounded-2xl" style={{ background: s.akzent ? F.hauch : F.grau }}>
            <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: s.akzent ? F.link : F.daempft }}>{s.etikett}</span>
            <span className="self-start max-w-[90%] px-4 py-3 text-base leading-normal bg-white" style={{ borderRadius: "16px 16px 16px 4px", color: F.text }}>{s.frage}</span>
            <span className="self-end max-w-[90%] px-4 py-3 text-base leading-normal" style={{ borderRadius: "16px 16px 4px 16px", background: s.akzent ? F.dunkel : "#d6d3d0", color: s.akzent ? "#ffffff" : F.text }}>{s.antwort}</span>
            <span className="mt-auto text-sm leading-normal" style={{ color: F.daempft }}>{s.fazit}</span>
          </div>
        ))}
      </div>
    </Grafik>
  );
}

// Gruppen mit farbiger Oberkante und Schlusszeile
function Gruppen({ b }) {
  return (
    <Grafik b={{ ...b, fazit: undefined }}>
      <ol className="mt-5 grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))]">
        {b.gruppen.map((g) => (
          <li key={g.name} className="flex flex-col gap-2 p-5 rounded-2xl bg-white" style={{ borderTop: `6px solid ${farbe(g.farbe)}` }}>
            <span className="text-lg font-extrabold" style={{ color: F.text }}>{g.name}</span>
            <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: g.farbe === "akzent" ? F.link : F.daempft }}>{g.zweck}</span>
            <span className="text-base leading-normal" style={{ color: "#3a3a3a" }}>{g.frage}</span>
          </li>
        ))}
      </ol>
      {b.fazit && (
        <p className="mt-3 px-5 py-[18px] rounded-2xl text-base sm:text-[17px] leading-normal font-bold text-white" style={{ background: F.dunkel }}>
          <Text>{b.fazit}</Text>
        </p>
      )}
    </Grafik>
  );
}

// Kreislauf mit fünf Stationen; am Handy als Liste
const KREIS_PUNKTE = [[320, 65], [463, 169], [408, 336], [232, 336], [177, 169]];
const KREIS_TEXT = [
  { x: 320, y: 22, anker: "middle" }, { x: 502, y: 175, anker: "start" }, { x: 446, y: 388, anker: "start" },
  { x: 194, y: 388, anker: "end" }, { x: 138, y: 175, anker: "end" },
];
function Kreislauf({ b }) {
  return (
    <Grafik b={b}>
      <svg viewBox="0 0 640 430" width="100%" role="img" aria-label={b.beschreibung} className="hidden sm:block mx-auto mt-3.5 max-w-[580px]" style={{ fontFamily: SCHRIFT }}>
        <circle cx="320" cy="215" r="150" fill="none" stroke="#f3c6d1" strokeWidth="10" />
        <path d="M 176 168 A 150 150 0 0 1 300 66" fill="none" stroke={PINK} strokeWidth="10" strokeLinecap="round" />
        {KREIS_PUNKTE.map(([x, y], i) => {
          const letzter = i === KREIS_PUNKTE.length - 1;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="28" fill={letzter ? PINK : F.dunkel} />
              <text x={x} y={y + 8} fill={letzter ? F.dunkel : "#ffffff"} fontSize="22" fontWeight="900" textAnchor="middle">{i + 1}</text>
              <text x={KREIS_TEXT[i].x} y={KREIS_TEXT[i].y} fill={letzter ? F.link : F.text} fontSize="17" fontWeight="800" textAnchor={KREIS_TEXT[i].anker}>{b.schritte[i]}</text>
            </g>
          );
        })}
        {b.mitte.map((t, i) => (
          <text key={i} x="320" y={208 + i * 24} fill={F.daempft} fontSize="17" fontWeight="600" textAnchor="middle">{t}</text>
        ))}
      </svg>
      <ol className="sm:hidden mt-4 flex flex-col gap-2">
        {b.schritte.map((s, i) => {
          const letzter = i === b.schritte.length - 1;
          return (
            <li key={s} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 items-center">
              <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9 rounded-full text-base font-black" style={{ background: letzter ? PINK : F.dunkel, color: letzter ? F.dunkel : "#ffffff" }}>{i + 1}</span>
              <span className="text-base font-extrabold" style={{ color: letzter ? F.link : F.text }}>{s}</span>
            </li>
          );
        })}
        <li className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 items-center">
          <span aria-hidden="true" className="inline-flex items-center justify-center w-9 h-9"><RefreshCw size={20} color={PINK} /></span>
          <span className="text-[15px] font-semibold" style={{ color: F.daempft }}>{b.mitte.join(" ")}</span>
        </li>
      </ol>
    </Grafik>
  );
}

// Zwei Spalten mit gestapelten Teilen (zum Beispiel Aufbau eines Angebots)
const TEIL = {
  grau: { background: "#e0dcd8", color: "#3a3a3a" },
  dunkel: { background: F.dunkel, color: "#ffffff" },
  fehlt: { border: "1.5px dashed #b3b3b3", color: F.daempft },
  akzent: { background: PINK, color: F.dunkel, fontWeight: 900, paddingTop: 16, paddingBottom: 16 },
  hauch: { background: F.hauch, color: F.text },
  hell: { background: F.grau, color: F.text },
};
function Aufbau({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
        {b.spalten.map((s) => (
          <div key={s.titel}>
            <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: s.akzent ? F.link : F.daempft }}>{s.titel}</p>
            <div role="img" aria-label={`${s.titel}: ${s.teile.map((t) => t.text).join(", ")}`} className="flex flex-col gap-2 p-[18px] rounded-xl"
              style={s.akzent ? { background: "#ffffff", border: `2px solid ${PINK}` } : { background: F.grau, border: "1px solid #e0dcd8" }}>
              {s.teile.map((t) => (
                <span key={t.text} className="px-3.5 py-3 rounded-lg text-[15px] font-bold" style={TEIL[t.art] || TEIL.grau}>{t.text}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Grafik>
  );
}

// Balken von 0 bis 100 mit Abschnitten, Markierungen und Legende
function Spanne({ b }) {
  return (
    <Grafik b={b}>
      <div role="img" aria-label={b.beschreibung} className="mt-[26px]">
        <div className="relative h-11 rounded-[10px] overflow-hidden" style={{ background: "#e0dcd8" }}>
          {b.segmente.map((s, i) => (
            <span key={i} className="absolute top-0 bottom-0" style={{ left: `${s.von}%`, width: `${s.bis - s.von}%`, background: farbe(s.farbe) }} />
          ))}
        </div>
        {b.marken?.length > 0 && (
          <div aria-hidden="true" className="relative h-[26px] mt-1.5 text-[13px] font-bold" style={{ color: F.daempft }}>
            {b.marken.map((m) => (
              <span key={m} className="absolute" style={m === 0 ? { left: 0 } : m === 100 ? { right: 0 } : { left: `${m}%`, transform: "translateX(-50%)" }}>{m} %</span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        {b.legende.map((e, i) => (
          <div key={i} className="grid grid-cols-[16px_minmax(0,1fr)] gap-2.5 items-start">
            <span aria-hidden="true" className="mt-1 w-4 h-4 rounded-[3px]" style={{ background: farbe(e.farbe) }} />
            <span className="text-[15px] leading-[1.45]" style={{ color: F.text }}><Text>{e.text}</Text></span>
          </div>
        ))}
      </div>
    </Grafik>
  );
}

// Kunde für Kunde: Vorjahr und dieses Jahr
const STATUS = {
  stabil: { text: "stabil", style: { background: "#e3f4ea", color: "#1d6b43" } },
  weniger: { text: "still weniger", style: { background: F.hauch, border: `1px solid ${PINK}`, color: F.link } },
  weg: { text: "gegangen", style: { background: F.dunkel, color: "#ffffff" } },
};
function Kundenliste({ b }) {
  return (
    <Grafik b={b}>
      <Legende eintraege={b.legende} />
      <div className="mt-[18px] grid grid-cols-[72px_minmax(0,1fr)_auto] sm:grid-cols-[92px_minmax(0,1fr)_128px] gap-3.5 items-center">
        {b.zeilen.map((z) => (
          <React.Fragment key={z.name}>
            <span className="text-[15px] sm:text-base font-bold" style={{ color: F.text }}>{z.name}</span>
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="h-2.5 rounded-[3px]" style={{ width: `${z.vorher}%`, background: "#b3b3b3" }} />
              <span className="h-2.5 rounded-[3px]" style={{ width: `${z.jetzt}%`, minWidth: 4, background: F.dunkel }} />
            </span>
            <span className="justify-self-start px-2.5 py-[3px] rounded-full text-xs sm:text-[13px] font-extrabold whitespace-nowrap" style={STATUS[z.status].style}>{STATUS[z.status].text}</span>
          </React.Fragment>
        ))}
      </div>
    </Grafik>
  );
}

// Weg in drei Schritten (zum Beispiel vom Selbstbild zum Versprechen)
function Weg({ b }) {
  const art = {
    alt: { box: { background: F.grau }, etikett: F.daempft, text: { color: F.daempft, textDecoration: "line-through", textDecorationColor: PINK, textDecorationThickness: 2 }, notiz: F.daempft },
    hauch: { box: { background: F.hauch }, etikett: F.link, text: { color: F.text }, notiz: F.daempft },
    dunkel: { box: { background: F.dunkel }, etikett: "#ff8fa8", text: { color: "#ffffff" }, notiz: "#d4d4d4" },
  };
  return (
    <Grafik b={b}>
      <ol className="mt-[18px] grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        {b.schritte.map((s, i) => {
          const a = art[s.art] || art.hauch;
          return (
            <li key={i} className="flex flex-col gap-2.5 p-5 rounded-2xl" style={a.box}>
              <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: a.etikett }}>{i + 1} {s.etikett}</span>
              <span className="text-xl font-extrabold leading-[1.3]" style={a.text}>{s.text}</span>
              <span className="mt-auto text-sm leading-normal" style={{ color: a.notiz }}>{s.notiz}</span>
            </li>
          );
        })}
      </ol>
    </Grafik>
  );
}

// Spiegelbalken: links eine Sicht, rechts die andere
function Spiegel({ b }) {
  return (
    <Grafik b={b}>
      <div aria-hidden="true" className="mt-[18px] grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_118px_minmax(0,1fr)] gap-x-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em]">
        <span className="text-right" style={{ color: F.text }}>{b.links}</span><span /><span style={{ color: F.link }}>{b.rechts}</span>
      </div>
      <div role="img" aria-label={b.beschreibung} className="mt-2.5 grid grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_118px_minmax(0,1fr)] gap-x-2.5 gap-y-3 items-center">
        {b.zeilen.map((z) => (
          <React.Fragment key={z.label}>
            <span className="flex justify-end"><span className="h-[18px] rounded-l" style={{ width: `${z.l}%`, background: F.dunkel }} /></span>
            <span className="text-center text-sm sm:text-[15px] font-extrabold leading-[1.2]" style={{ color: F.text }}>{z.label}</span>
            <span><span className="block h-[18px] rounded-r" style={{ width: `${z.r}%`, background: PINK }} /></span>
          </React.Fragment>
        ))}
      </div>
    </Grafik>
  );
}

// Ab hier: Grafik-Bausteine der Nachfolge-Beiträge (Zielgruppe 2), nach den Prototypen "Nachfolge N1 bis N5 visuell"

// Zwei überlappende Kreise mit Schnittmenge
function Schnittmenge({ b }) {
  return (
    <Grafik b={b}>
      <svg viewBox="0 0 520 230" width="100%" role="img" aria-label={b.beschreibung} className="hidden sm:block mt-4 mx-auto max-w-[520px]" style={{ fontFamily: SCHRIFT }}>
        <circle cx="195" cy="115" r="100" fill="#8a8a8a" fillOpacity="0.35" />
        <circle cx="325" cy="115" r="100" fill={PINK} fillOpacity="0.35" />
        {b.links.map((t, i) => (
          <text key={`l${i}`} x="135" y={112 + i * 20} fill={F.text} fontSize="16" fontWeight="700" textAnchor="middle">{t}</text>
        ))}
        {b.rechts.map((t, i) => (
          <text key={`r${i}`} x="385" y={112 + i * 20} fill={F.text} fontSize="16" fontWeight="700" textAnchor="middle">{t}</text>
        ))}
        <text x="260" y="122" fill={F.text} fontSize="18" fontWeight="900" textAnchor="middle">{b.mitte}</text>
      </svg>
      <svg viewBox="0 0 300 370" width="100%" role="img" aria-label={b.beschreibung} className="block sm:hidden mt-4 mx-auto max-w-[300px]" style={{ fontFamily: SCHRIFT }}>
        <circle cx="150" cy="120" r="108" fill="#8a8a8a" fillOpacity="0.35" />
        <circle cx="150" cy="250" r="108" fill={PINK} fillOpacity="0.35" />
        {b.links.map((t, i) => (
          <text key={`l${i}`} x="150" y={66 + i * 24} fill={F.text} fontSize="20" fontWeight="700" textAnchor="middle">{t}</text>
        ))}
        {b.rechts.map((t, i) => (
          <text key={`r${i}`} x="150" y={292 + i * 24} fill={F.text} fontSize="20" fontWeight="700" textAnchor="middle">{t}</text>
        ))}
        <text x="150" y="192" fill={F.text} fontSize="22" fontWeight="900" textAnchor="middle">{b.mitte}</text>
      </svg>
    </Grafik>
  );
}

// Gestufte Balken: je wichtiger, desto schmaler und persönlicher
function Stufen({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-5 flex flex-col gap-2.5">
        {b.stufen.map((s) => (
          <div
            key={s.titel}
            className="mx-auto px-[18px] py-3.5 rounded-[14px] text-center"
            style={{ width: `max(${s.breite}%, 220px)`, maxWidth: "100%", ...(s.akzent ? { background: PINK, color: "#ffffff" } : { background: "#ffffff", border: "1px solid #d6d3d0", color: F.text }) }}
          >
            <span className="block text-[17px] font-extrabold">{s.titel}</span>
            <span className="block text-[15px] leading-normal">{s.text}</span>
          </div>
        ))}
      </div>
    </Grafik>
  );
}

// Musterbrief als Blatt Papier
function Brief({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-[18px] px-5 sm:px-[30px] py-6 sm:py-7 rounded-[10px] bg-white" style={{ border: `1px solid ${F.linie}`, boxShadow: "0 18px 36px -28px rgba(45,45,45,0.5)" }}>
        <div aria-hidden="true" className="flex justify-between items-center gap-3 pb-3.5" style={{ borderBottom: `1px solid ${F.linie}` }}>
          <span className="w-[120px] h-3 rounded-md" style={{ background: "#d6d3d0" }} />
          <span className="w-[70px] h-2.5 rounded-[5px]" style={{ background: "#e8e6e4" }} />
        </div>
        <p className="mt-[18px] text-[17px] sm:text-lg leading-[1.7]" style={{ color: F.text }}>{b.anrede}</p>
        <p className="mt-2.5 text-[17px] sm:text-lg leading-[1.7]" style={{ color: F.text }}><Text>{b.text}</Text></p>
        <div aria-hidden="true" className="mt-[18px] flex flex-col gap-2">
          <span className="h-2.5 rounded-[5px]" style={{ width: "92%", background: "#f0eeec" }} />
          <span className="h-2.5 rounded-[5px]" style={{ width: "78%", background: "#f0eeec" }} />
        </div>
      </div>
    </Grafik>
  );
}

// Übergangsphase: zwei Zeilen über mehrere Monate, Stärke 0 bis 4
const UEBERGANG = {
  dunkel: ["#e8e6e4", "#d6d3d0", "#8a8a8a", "#6a6a6a", F.dunkel],
  akzent: ["#fbe3ea", "#f3c6d1", "#ff8fa8", "#ff8fa8", PINK],
};
function Uebergang({ b }) {
  const sp = `repeat(${b.spalten.length}, minmax(0, 1fr))`;
  return (
    <Grafik b={b}>
      <div role="img" aria-label={b.beschreibung} className="mt-5 grid grid-cols-[84px_minmax(0,1fr)] sm:grid-cols-[110px_minmax(0,1fr)] gap-x-3.5 gap-y-3 items-center">
        <span className="text-xs sm:text-[13px] font-semibold" style={{ color: F.daempft }}>{b.kopf}</span>
        <span className="grid gap-1 text-xs sm:text-[13px] font-semibold text-center" style={{ gridTemplateColumns: sp, color: F.daempft }}>
          {b.spalten.map((s) => <span key={s}>{s}</span>)}
        </span>
        {b.reihen.map((r) => (
          <React.Fragment key={r.name}>
            <span className="text-sm sm:text-[15px] font-bold" style={{ color: F.text }}>{r.name}</span>
            <span aria-hidden="true" className="grid gap-1" style={{ gridTemplateColumns: sp }}>
              {r.werte.map((w, i) => <span key={i} className="h-[26px] rounded-md" style={{ background: (UEBERGANG[r.farbe] || UEBERGANG.dunkel)[w] }} />)}
            </span>
          </React.Fragment>
        ))}
      </div>
      {b.legende && <p className="mt-3 text-sm" style={{ color: F.text }}>{b.legende}</p>}
    </Grafik>
  );
}

// Vierfeld: zwei Achsen, ein Feld hervorgehoben
function Vierfeld({ b }) {
  return (
    <Grafik b={b}>
      <div className="mt-5 grid grid-cols-[22px_minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:gap-2.5">
        <span className="row-span-2 text-center text-xs sm:text-[13px] font-bold" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: F.daempft }}>{b.achseLinks}</span>
        {b.felder.map((f) => (
          <div key={f.kopf} className="flex flex-col gap-1.5 p-3.5 sm:p-[18px] rounded-[14px] min-h-[110px]" style={f.akzent ? { background: PINK } : { background: "#ffffff", border: `1px solid ${F.linie}` }}>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em]" style={{ color: f.akzent ? "#ffffff" : F.daempft }}>{f.kopf}</span>
            <span lang="de" className="text-[15px] sm:text-[17px] font-extrabold leading-[1.35] hyphens-auto [overflow-wrap:break-word]" style={{ color: f.akzent ? "#ffffff" : F.text }}>{f.text}</span>
          </div>
        ))}
        <span />
        <span className="col-span-2 text-center text-xs sm:text-[13px] font-bold" style={{ color: F.daempft }}>{b.achseUnten}</span>
      </div>
    </Grafik>
  );
}

export const GRAFIK_ARTEN = {
  karten: Karten,
  balken: Balken,
  figuren: Figuren,
  waffel: Waffel,
  verlauf: Verlauf,
  zeitstrahl: Zeitstrahl,
  hantel: Hantel,
  streuung: Streuung,
  venn: Venn,
  test: Test,
  dialog: Dialog,
  gruppen: Gruppen,
  kreislauf: Kreislauf,
  aufbau: Aufbau,
  spanne: Spanne,
  kundenliste: Kundenliste,
  weg: Weg,
  spiegel: Spiegel,
  schnittmenge: Schnittmenge,
  stufen: Stufen,
  brief: Brief,
  uebergang: Uebergang,
  vierfeld: Vierfeld,
};

// Diese Typen sind Abbildungen und bekommen eine Nummer
export const NUMMERIERTE_GRAFIKEN = Object.keys(GRAFIK_ARTEN).filter((t) => t !== "karten");
