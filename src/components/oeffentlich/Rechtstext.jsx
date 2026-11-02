import React, { useEffect } from "react";
import { BREITE, Etikett, F, H1_STIL, Modulseite } from "@/components/oeffentlich/Oeffentlich";

// Gemeinsamer Rahmen für Impressum und Datenschutzerklärung (02.11.2026).
// Beide Seiten sind nur über den Fuß verlinkt, nicht über das Menü.
// Gilroy hat keine Gedankenstriche, typografischen Anführungszeichen oder Mittelpunkte.
//
// Offene Angaben stehen als <Offen> im Text: gestrichelt markiert, damit sie vor dem
// Veröffentlichen nicht übersehen werden. Vor der Freigabe alle ersetzen.

export function Offen({ children }) {
  return (
    <span
      title="Offen: vor dem Veröffentlichen klären"
      className="px-1.5 rounded"
      style={{ background: F.hauch, border: "1.5px dashed #ff3764", color: F.link, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
    >
      {children}
    </span>
  );
}

export function Abschnitt({ id, titel, children }) {
  return (
    <section id={id} className="pt-10 scroll-mt-6" style={{ borderTop: `1px solid ${F.linie}` }}>
      <h2 className="text-[24px] font-black leading-[1.25]">{titel}</h2>
      <div className="mt-4 flex flex-col gap-4 text-[17px] leading-[1.7]" style={{ color: F.daempft }}>
        {children}
      </div>
    </section>
  );
}

export function Unter({ titel, children }) {
  return (
    <div className="mt-2">
      <h3 className="text-[19px] font-bold leading-[1.35]" style={{ color: F.text }}>{titel}</h3>
      <div className="mt-2 flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function Liste({ eintraege }) {
  return (
    <ul className="flex flex-col gap-2 pl-5" style={{ listStyle: "disc" }}>
      {eintraege.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
  );
}

export function Angaben({ zeilen }) {
  return (
    <dl className="flex flex-col gap-2.5">
      {zeilen.map(([titel, wert]) => (
        <div key={titel} className="grid grid-cols-1 sm:grid-cols-[230px_minmax(0,1fr)] gap-x-4">
          <dt className="text-[15px]" style={{ color: F.daempft }}>{titel}</dt>
          <dd className="font-semibold" style={{ color: F.text }}>{wert}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Rechtstext({ titel, seitentitel, etikett, einleitung, stand, inhalt, children }) {
  // Sprungmarken wie /datenschutz#anfrage: nach dem Laden zum Abschnitt springen
  // (Modulseite scrollt beim Öffnen sonst nach oben).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 80);
    return () => clearTimeout(t);
  }, []);
  return (
    <Modulseite titel={seitentitel} modul={etikett}>
      <article className={`${BREITE} pt-12 pb-24`}>
        <div className="max-w-[820px]">
          <Etikett>{etikett}</Etikett>
          <h1 className="mt-4" style={{ ...H1_STIL, fontSize: "clamp(36px, 5vw, 60px)" }}>{titel}</h1>
          {einleitung && <p className="mt-6 text-[19px] leading-[1.6]" style={{ color: F.daempft }}>{einleitung}</p>}
          {stand && <p className="mt-3 text-sm" style={{ color: F.daempft }}>Stand: {stand}</p>}
          {inhalt && (
            <nav aria-label="Inhalt" className="mt-8 p-6 rounded-2xl" style={{ background: F.grau }}>
              <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.daempft }}>Inhalt</p>
              <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2 text-[15px] font-semibold">
                {inhalt.map(({ id, titel: t }, i) => (
                  <li key={id}>
                    <a href={`#${id}`} className="hover:underline" style={{ color: F.text }}>{i + 1}. {t}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="mt-12 flex flex-col gap-12">{children}</div>
        </div>
      </article>
    </Modulseite>
  );
}
