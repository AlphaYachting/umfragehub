import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, BookOpen, Lightbulb } from "lucide-react";
import { F } from "@/components/oeffentlich/Oeffentlich";
import { GRAFIK_ARTEN, NUMMERIERTE_GRAFIKEN } from "@/components/oeffentlich/wissen/Grafiken";

// Bausteine der Beitragsseiten im Wissensbereich. Jeder Baustein im Inhalt hat ein Feld
// "typ"; Baustein() wählt die passende Darstellung. Aussehen wie im Prototyp
// "Wissen: Layout Blogbeitrag" auf der Arbeitsfläche.
//
// Inline-Auszeichnung in allen Texten: **fett**, [Text](/pfad oder https://...), [[Platzhalter]].
// Typografie: Gilroy hat keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte.

const MUSTER = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\[[^\]]+\]\([^)\s]+\))/g;

export function Text({ children }) {
  const s = String(children ?? "");
  const teile = s.split(MUSTER).filter((t) => t !== "");
  return (
    <>
      {teile.map((t, i) => {
        if (t.startsWith("**") && t.endsWith("**")) {
          return <strong key={i} className="font-bold" style={{ color: F.text }}>{t.slice(2, -2)}</strong>;
        }
        if (t.startsWith("[[") && t.endsWith("]]")) {
          return (
            <span
              key={i}
              title="Platzhalter, vor der Freigabe ersetzen"
              className="px-1.5 rounded-md font-semibold"
              style={{ background: F.hauch, border: "1.5px dashed #ff3764", color: F.link, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
            >
              {t.slice(2, -2)}
            </span>
          );
        }
        const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t);
        if (m) {
          const [, text, ziel] = m;
          if (ziel.startsWith("/")) {
            return <Link key={i} to={ziel} className="font-semibold underline underline-offset-2 hover:no-underline" style={{ color: F.link }}>{text}</Link>;
          }
          return (
            <a key={i} href={ziel} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:no-underline" style={{ color: F.link }}>
              {text}
            </a>
          );
        }
        return <React.Fragment key={i}>{t}</React.Fragment>;
      })}
    </>
  );
}

const ABSATZ = "mb-[22px] text-[19px] leading-[1.72]";
const GRAU_TEXT = { color: "#3a3a3a" };

function Absatz({ b }) {
  return <p className={ABSATZ} style={GRAU_TEXT}><Text>{b.text}</Text></p>;
}

function FettText({ p }) {
  return (
    <>
      {p.fett && <strong className="font-bold" style={{ color: F.text }}>{p.fett}</strong>}
      {p.fett && p.text ? " " : null}
      <Text>{p.text}</Text>
    </>
  );
}

function Liste({ b }) {
  if (b.stil === "punkte") {
    return (
      <ul className="mb-[22px] pl-[22px] list-disc text-lg leading-[1.7]" style={GRAU_TEXT}>
        {b.punkte.map((p, i) => <li key={i} className="mb-2"><FettText p={p} /></li>)}
      </ul>
    );
  }
  return (
    <ul className="mb-[22px] flex flex-col gap-[18px]">
      {b.punkte.map((p, i) => (
        <li key={i} className="pl-[22px] text-lg leading-[1.65]" style={{ ...GRAU_TEXT, borderLeft: `3px solid ${F.hauchRand}` }}>
          <FettText p={p} />
        </li>
      ))}
    </ul>
  );
}

function Schritte({ b }) {
  return (
    <ol className="mb-[26px] flex flex-col gap-1">
      {b.punkte.map((p, i) => (
        <li
          key={i}
          className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-4"
          style={{ borderBottom: i < b.punkte.length - 1 ? `1px solid ${F.linie}` : "none" }}
        >
          <span aria-hidden="true" className="text-[28px] font-black leading-[1.1]" style={{ color: F.link }}>{i + 1}</span>
          <span className="text-lg leading-[1.6]" style={GRAU_TEXT}><FettText p={p} /></span>
        </li>
      ))}
    </ol>
  );
}

function Kasten({ b, art }) {
  const tipp = art === "tipp";
  const Icon = tipp ? Lightbulb : BookOpen;
  return (
    <aside
      aria-label={tipp ? "Tipp" : "Begriff"}
      className="mb-[26px] px-6 py-5 rounded-2xl grid grid-cols-[32px_minmax(0,1fr)] gap-3.5"
      style={tipp ? { background: "#eef8f2" } : { border: `1.5px solid ${F.dunkel}` }}
    >
      <Icon size={28} strokeWidth={1.7} aria-hidden="true" style={{ color: tipp ? "#2f9e64" : F.dunkel }} />
      <p className="text-[17px] leading-[1.6]" style={{ color: F.text }}>
        <strong className="font-bold">{tipp ? "Tipp aus der Praxis:" : "Kurz erklärt:"}</strong> <Text>{b.text}</Text>
      </p>
    </aside>
  );
}

function Zitat({ b }) {
  return (
    <blockquote
      className="my-8 pl-7 text-[clamp(24px,2.4vw,30px)] leading-[1.3] font-bold"
      style={{ borderLeft: `6px solid ${F.akzent}`, color: F.text }}
    >
      <Text>{b.text}</Text>
    </blockquote>
  );
}

function Tabelle({ b }) {
  return (
    <div className="mb-[22px] overflow-x-auto rounded-2xl" style={{ border: `1px solid ${F.linie}` }}>
      <table className="w-full min-w-[560px] border-collapse text-base leading-normal">
        <caption className="text-left px-4 py-3 text-sm" style={{ captionSide: "bottom", color: F.daempft }}>
          <strong className="font-bold" style={{ color: F.text }}>Tabelle {b._nr}:</strong> <Text>{b.unterschrift}</Text>
        </caption>
        <thead>
          <tr style={{ background: F.grau }}>
            <th scope="col" className="w-[26%] px-4 py-3.5"><span className="sr-only">Merkmal</span></th>
            <th scope="col" className="px-4 py-3.5 text-left text-[15px] font-bold" style={{ color: F.daempft }}>{b.kopf[0]}</th>
            <th scope="col" className="px-4 py-3.5 text-left text-[15px] font-black" style={{ color: F.text, background: F.hauch }}>{b.kopf[1]}</th>
          </tr>
        </thead>
        <tbody>
          {b.zeilen.map((z, i) => {
            const rand = i < b.zeilen.length - 1 ? `1px solid ${F.linie}` : "none";
            return (
              <tr key={i}>
                <th scope="row" className="px-4 py-3.5 text-left align-top font-bold" style={{ borderBottom: rand }}><Text>{z[0]}</Text></th>
                <td className="px-4 py-3.5 align-top" style={{ borderBottom: rand, color: F.daempft }}><Text>{z[1]}</Text></td>
                <td className="px-4 py-3.5 align-top font-semibold" style={{ borderBottom: rand, background: "#fffafb" }}><Text>{z[2]}</Text></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WortmarkeVerb({ verb, groesse = 26, punktFarbe = F.akzent }) {
  return (
    <span className="font-black leading-none" style={{ fontSize: groesse, letterSpacing: "-0.01em" }}>
      andi {verb}
      <span style={{ color: punktFarbe }}>.</span>
    </span>
  );
}

function Ablauf({ b }) {
  return (
    <ol className="mb-6 grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
      {b.schritte.map((s) => (
        <li key={s.verb} className="p-[22px] rounded-[18px]" style={{ border: `1px solid ${F.linie}` }}>
          <p><WortmarkeVerb verb={s.verb} /></p>
          <p className="mt-3 leading-[1.6]" style={{ color: F.daempft }}><Text>{s.text}</Text></p>
        </li>
      ))}
    </ol>
  );
}

function Pfeil({ farbe }) {
  return (
    <li aria-hidden="true" className="flex justify-center py-1.5" style={{ color: farbe }}>
      <ArrowDown size={22} strokeWidth={2.4} />
    </li>
  );
}

const ETIKETT_KLEIN = "text-xs font-semibold uppercase tracking-[0.14em]";

function Schaubild({ b }) {
  const [andi, setAndi] = useState(true);
  const knopf = (an) => ({
    minHeight: 44, padding: "0 18px", border: 0, borderRadius: 999, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer",
    background: an ? F.dunkel : "transparent", color: an ? "#ffffff" : F.text,
  });
  return (
    <figure className="mb-[30px] p-7 rounded-3xl" style={{ background: F.grau }}>
      <div role="group" aria-label="Ablauf wählen" className="inline-flex flex-wrap p-1 rounded-full bg-white" style={{ border: `1px solid ${F.linie}` }}>
        <button type="button" aria-pressed={!andi} onClick={() => setAndi(false)} style={knopf(!andi)}>{b.knopfUeblich}</button>
        <button type="button" aria-pressed={andi} onClick={() => setAndi(true)} style={knopf(andi)}>{b.knopfAndi}</button>
      </div>
      <div aria-live="polite" className="mt-6">
        {!andi ? (
          <ol className="flex flex-col">
            {b.ueblich.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Pfeil farbe="#a9a6a2" />}
                <li
                  className="px-5 py-[18px] rounded-[14px]"
                  style={s.durchgestrichen ? { background: "#ebe9e6", border: "1.5px dashed #a9a6a2", color: F.daempft } : { background: "#ffffff", border: `1px solid ${F.linie}` }}
                >
                  <span className={ETIKETT_KLEIN} style={{ color: F.daempft }}>{s.etikett}</span>
                  <br />
                  <strong
                    className="text-lg"
                    style={s.durchgestrichen ? { textDecoration: "line-through", textDecorationColor: "#ff3764", textDecorationThickness: 2 } : undefined}
                  >
                    {s.text}
                  </strong>
                </li>
              </React.Fragment>
            ))}
          </ol>
        ) : (
          <ol className="flex flex-col">
            <li className="px-5 py-[18px] rounded-[14px] bg-white" style={{ border: `1px solid ${F.linie}` }}>
              <span className={ETIKETT_KLEIN} style={{ color: F.daempft }}>{b.andi.gruppenTitel}</span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {b.andi.gruppen.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: F.hauch }}>{g}</span>
                ))}
              </div>
            </li>
            {b.andi.schritte.map((s) => (
              <React.Fragment key={s.verb}>
                <Pfeil farbe={F.akzent} />
                <li className="px-5 py-[18px] rounded-[14px] text-white" style={{ background: F.dunkel }}>
                  <WortmarkeVerb verb={s.verb} groesse={22} punktFarbe="#ff3764" />
                  <br />
                  <span style={{ color: F.hellAufDunkel }}>{s.text}</span>
                </li>
              </React.Fragment>
            ))}
            <Pfeil farbe={F.akzent} />
            <li className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]">
              {b.andi.ausgaenge.map((a) => (
                <div
                  key={a.titel}
                  className="px-5 py-[18px] rounded-[14px]"
                  style={a.akzent ? { background: F.akzent, color: "#ffffff" } : { background: "#ffffff", border: `2px solid ${F.dunkel}` }}
                >
                  <span className={ETIKETT_KLEIN} style={a.akzent ? undefined : { color: F.daempft }}>{a.titel}</span>
                  <ul className="mt-2.5 pl-[18px] list-disc leading-[1.6]">
                    {a.punkte.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </li>
          </ol>
        )}
      </div>
      <figcaption className="mt-[18px] text-sm leading-normal" style={{ color: F.daempft }}>
        <strong className="font-bold" style={{ color: F.text }}>Abbildung {b._nr}:</strong> <Text>{b.unterschrift}</Text>
      </figcaption>
    </figure>
  );
}

function Fall({ b }) {
  const zeile = (titel, wert) => (
    <p className="mt-2.5 leading-[1.6]" style={GRAU_TEXT}>
      <strong className="font-bold" style={{ color: F.text }}>{titel}</strong> <Text>{wert}</Text>
    </p>
  );
  return (
    <div className="mb-[30px] rounded-3xl overflow-hidden flex flex-wrap" style={{ border: `1px solid ${F.linie}` }}>
      {b.bild && (
        <figure className="relative flex-[1_1_240px] min-h-[240px]" style={{ background: F.dunkel }}>
          <img src={b.bild.src} alt={b.bild.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <figcaption className="absolute left-3 right-3 bottom-3 px-2.5 py-1.5 rounded-lg text-xs text-white" style={{ background: "rgba(45,45,45,0.8)" }}>
            Abbildung {b._nr}: <Text>{b.bild.unterschrift}</Text>
          </figcaption>
        </figure>
      )}
      <div className="flex-[2_1_340px] min-w-0 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: F.link }}>{b.etikett}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3.5">
          {b.fakten.map((f) => (
            <div key={f.name}>
              <dt className="text-xs font-semibold" style={{ color: F.daempft }}>{f.name}</dt>
              <dd className="mt-0.5 font-bold"><Text>{f.wert}</Text></dd>
            </div>
          ))}
        </dl>
        {zeile("Die Annahme:", b.annahme)}
        {zeile("Das Interview zeigte:", b.gezeigt)}
        {zeile("Daraus wurde:", b.ergebnis)}
      </div>
    </div>
  );
}

function VorherNachher({ b }) {
  return (
    <figure className="mb-[22px] p-7 rounded-3xl text-white" style={{ background: F.dunkel }}>
      <div className="grid gap-5 items-center grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        <div>
          <p className={ETIKETT_KLEIN} style={{ color: "#a9a6a2" }}>{b.vorherTitel}</p>
          <p
            className="mt-2.5 text-2xl font-bold leading-[1.25]"
            style={{ color: "#a9a6a2", textDecoration: "line-through", textDecorationColor: "#ff3764", textDecorationThickness: 3 }}
          >
            <Text>{b.vorher}</Text>
          </p>
        </div>
        <div>
          <p className={ETIKETT_KLEIN} style={{ color: F.etikettDunkel }}>{b.nachherTitel}</p>
          <p className="mt-2.5 text-[28px] font-black leading-[1.2]"><Text>{b.nachher}</Text></p>
        </div>
      </div>
      <figcaption className="mt-5 pt-4 text-sm leading-normal" style={{ borderTop: "1px solid #4a4a4a", color: F.hellAufDunkel }}>
        <strong className="font-bold text-white">Abbildung {b._nr}:</strong> <Text>{b.unterschrift}</Text>
      </figcaption>
    </figure>
  );
}

function Bild({ b }) {
  return (
    <figure className="mb-[30px]">
      <img src={b.src} alt={b.alt} loading="lazy" className="block w-full rounded-3xl object-cover" style={{ aspectRatio: b.format || "16 / 9" }} />
      <figcaption className="mt-2.5 text-sm leading-normal" style={{ color: F.daempft }}>
        <strong className="font-bold" style={{ color: F.text }}>Abbildung {b._nr}:</strong> <Text>{b.unterschrift}</Text>
      </figcaption>
    </figure>
  );
}

const ARTEN = {
  absatz: Absatz,
  liste: Liste,
  schritte: Schritte,
  begriff: (p) => <Kasten {...p} art="begriff" />,
  tipp: (p) => <Kasten {...p} art="tipp" />,
  zitat: Zitat,
  tabelle: Tabelle,
  ablauf: Ablauf,
  schaubild: Schaubild,
  fall: Fall,
  vorherNachher: VorherNachher,
  bild: Bild,
};

// Abbildungen und Tabellen fortlaufend nummerieren (über alle Abschnitte)
export function nummerieren(abschnitte) {
  let abb = 0;
  let tab = 0;
  return abschnitte.map((a) => ({
    ...a,
    bloecke: a.bloecke.map((b) => {
      if (b.typ === "tabelle") return { ...b, _nr: ++tab };
      if (["schaubild", "vorherNachher", "bild", ...NUMMERIERTE_GRAFIKEN].includes(b.typ) || (b.typ === "fall" && b.bild)) return { ...b, _nr: ++abb };
      return b;
    }),
  }));
}

export default function Baustein({ b }) {
  const Art = ARTEN[b.typ] || GRAFIK_ARTEN[b.typ];
  if (!Art) return null;
  return <Art b={b} />;
}
