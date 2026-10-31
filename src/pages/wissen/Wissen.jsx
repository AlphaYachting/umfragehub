import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BREITE, Etikett, F, Hauptknopf, Modulseite } from "@/components/oeffentlich/Oeffentlich";
import { Brotkrumen, StrukturierteDaten, useKopfdaten } from "@/components/oeffentlich/wissen/BeitragSeite";
import { MODUL_NAMEN, MODUL_PFAD, SITE, istVorschau, lesezeit, sichtbareBeitraege } from "@/inhalte/wissen";

// Übersicht des Wissensbereichs /wissen (Vorlage: Prototyp "Wissen: Übersicht /wissen").
// Liest alle Beiträge aus src/inhalte/wissen selbst ein. Live erscheinen nur freigegebene
// Beiträge, in der Base44-Vorschau zusätzlich Entwürfe (mit Kennzeichnung).

const TITEL = "Wissen für KMU: Team, Marke, Kunden, Vertrieb | andi fragt.";
const BESCHREIBUNG =
  "Praxisnahe Ratgeber von Rittler & Co aus Graz: Mitarbeiterbefragung, Alleinstellungsmerkmal, Kundenbindung und Vertrieb für Unternehmen mit 10 bis 100 Leuten.";

const SCHUH = [
  { modul: "team", satz: "Gute Leute gehen, und du weißt nicht genau, warum.", knopf: "Zum Team-Interview" },
  { modul: "positionierung", satz: "Deine Werbung klingt wie die der anderen.", knopf: "Zur Positionierung" },
  { modul: "kunden", satz: "Kunden gehen still, ohne zu sagen, warum.", knopf: "Zum Kunden-Interview" },
  { modul: "vertrieb", satz: "Angebote gehen raus, Abschlüsse bleiben aus.", knopf: "Zum Vertriebs-Interview" },
];

function EntwurfsMarke({ b }) {
  if (b.status === "freigegeben") return null;
  return (
    <span className="inline-flex items-center min-h-[22px] px-2 rounded-full text-[11px] font-bold uppercase tracking-[0.08em]" style={{ background: "#fff4d6", color: "#5c4400" }}>
      Entwurf
    </span>
  );
}

export default function Wissen() {
  const alle = useMemo(() => sichtbareBeitraege(), []);
  const [thema, setThema] = useState("alle");
  const leit = alle.find((b) => b.leitartikel);
  const liste = alle.filter((b) => b !== leit && (thema === "alle" || b.modul === thema));
  const zeigeLeit = leit && (thema === "alle" || leit.modul === thema);
  const zaehle = (id) => alle.filter((b) => id === "alle" || b.modul === id).length;
  const hatFreigegebene = alle.some((b) => b.status === "freigegeben");

  useKopfdaten({ titel: TITEL, beschreibung: BESCHREIBUNG, pfad: "/wissen", typ: "website", robots: hatFreigegebene ? "index, follow" : "noindex, nofollow" });

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Wissen von andi fragt.",
      description: BESCHREIBUNG,
      url: SITE + "/wissen",
      inLanguage: "de-AT",
      publisher: { "@type": "Organization", name: "Rittler & Co GmbH", url: SITE },
      blogPost: alle
        .filter((b) => b.status === "freigegeben")
        .map((b) => ({ "@type": "BlogPosting", headline: `${b.titel}: ${b.titelAkzent}`.slice(0, 110), url: `${SITE}/wissen/${b.slug}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Wissen", item: SITE + "/wissen" },
      ],
    },
  ];

  const chip = (id, name) => {
    const an = thema === id;
    return (
      <button
        key={id}
        type="button"
        aria-pressed={an}
        onClick={() => setThema(id)}
        className="inline-flex items-center gap-2 min-h-[44px] px-[18px] rounded-full text-[15px] font-bold cursor-pointer"
        style={{ background: an ? F.dunkel : "#ffffff", color: an ? "#ffffff" : F.text, border: `1px solid ${an ? F.dunkel : "#d4d4d4"}` }}
      >
        {name} <span className="opacity-65 font-semibold">{zaehle(id)}</span>
      </button>
    );
  };

  return (
    <Modulseite titel={TITEL} modul="Wissen">
      <StrukturierteDaten daten={ld} />
      {istVorschau() && !hatFreigegebene && (
        <div className="text-sm font-semibold" style={{ background: "#fff4d6", borderBottom: "1px solid #f0d58a", color: "#5c4400" }}>
          <div className={`${BREITE} py-2.5`}>Vorschau: Alle Beiträge sind noch Entwürfe. Live auf andifragt.at ist diese Seite leer und nicht im Menü.</div>
        </div>
      )}

      <section className={`${BREITE} pt-7`}>
        <Brotkrumen teile={[{ name: "Start", pfad: "/" }, { name: "Wissen" }]} />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex-[1_1_620px] min-w-0">
            <Etikett>Wissen</Etikett>
            <h1 className="mt-3.5 text-[clamp(38px,5vw,64px)] font-black uppercase leading-none">
              Ehrliche Antworten auf die Fragen, <span style={{ color: F.akzent }}>die Unternehmer wirklich stellen.</span>
            </h1>
          </div>
          <p className="flex-[1_1_380px] min-w-0 text-[19px] leading-[1.6]" style={{ color: F.daempft }}>
            Mitarbeiterbefragung, Positionierung, Kundenzufriedenheit und Vertrieb: praxisnahe Ratgeber von Rittler &amp; Co aus Graz für Unternehmen mit 10 bis 100 Leuten.
          </p>
        </div>
        {alle.length > 0 && (
          <div role="group" aria-label="Beiträge nach Thema filtern" className="mt-10 flex flex-wrap gap-2">
            {chip("alle", "Alle Themen")}
            {Object.entries(MODUL_NAMEN).map(([id, name]) => chip(id, name))}
          </div>
        )}
      </section>

      {alle.length === 0 && (
        <section className={`${BREITE} pt-14`}>
          <p className="max-w-[640px] text-lg leading-[1.6]" style={{ color: F.daempft }}>
            Die ersten Beiträge erscheinen in Kürze. Bis dahin beantworten wir deine Fragen gern persönlich im kostenlosen Erstgespräch.
          </p>
        </section>
      )}

      {zeigeLeit && (
        <section aria-label="Leitartikel" className={`${BREITE} mt-9`}>
          <Link
            to={`/wissen/${leit.slug}`}
            className="flex flex-wrap rounded-[28px] overflow-hidden text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
            style={{ background: F.dunkel, textDecoration: "none" }}
          >
            <div className="relative flex-[1_1_440px] min-h-[300px]">
              {leit.titelbild?.src && <img src={leit.titelbild.src} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 40%" }} />}
            </div>
            <div className="flex-[1_1_440px] min-w-0 p-[clamp(28px,4vw,52px)] flex flex-col gap-[18px]">
              <span className="self-start flex flex-wrap gap-2">
                <span className="inline-flex items-center min-h-[30px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.12em]" style={{ background: F.akzent }}>Leitartikel</span>
                <EntwurfsMarke b={leit} />
              </span>
              <h2 className="text-[clamp(26px,2.8vw,36px)] font-black leading-[1.12]">{leit.titel}: {leit.titelAkzent}</h2>
              <p className="text-lg leading-[1.6]" style={{ color: F.hellAufDunkel }}>{leit.teaser}</p>
              <span className="mt-auto pt-[18px] flex flex-wrap items-center justify-between gap-3 text-sm" style={{ borderTop: "1px solid #4a4a4a", color: F.hellAufDunkel }}>
                <span>Alfons Rittler, {lesezeit(leit)} Minuten Lesezeit</span>
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-white">Weiterlesen <ArrowRight size={16} aria-hidden="true" /></span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {liste.length > 0 && (
        <section aria-labelledby="h-beitraege" className={`${BREITE} pt-14`}>
          <h2 id="h-beitraege" className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: F.daempft }}>
            {thema === "alle" ? "Alle Beiträge" : `Beiträge zum Thema ${MODUL_NAMEN[thema]}`}
          </h2>
          <ul className="mt-5 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {liste.map((b) => (
              <li key={b.slug} className="flex">
                <Link
                  to={`/wissen/${b.slug}`}
                  className="flex-1 flex flex-col gap-3.5 p-7 rounded-[22px] bg-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
                  style={{ border: `1px solid ${F.linie}`, color: F.text, textDecoration: "none" }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.link }}>
                      <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: F.akzent }} />
                      {MODUL_NAMEN[b.modul]}
                    </span>
                    <EntwurfsMarke b={b} />
                  </span>
                  <h3 className="text-[21px] font-bold leading-[1.3]">{b.titel}: {b.titelAkzent}</h3>
                  <p className="leading-[1.6]" style={{ color: F.daempft }}>{b.teaser}</p>
                  <span className="mt-auto pt-3.5 flex items-center justify-between gap-3 text-sm" style={{ borderTop: `1px solid ${F.linie}`, color: F.daempft }}>
                    <span>{lesezeit(b)} Minuten Lesezeit</span>
                    <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: F.text }}>Lesen <ArrowRight size={15} aria-hidden="true" /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="h-module" className={`${BREITE} pt-[88px]`}>
        <Etikett>Vom Lesen zum Handeln</Etikett>
        <h2 id="h-module" className="mt-3 text-[clamp(28px,3vw,38px)] font-black uppercase leading-[1.1]">Wo drückt der Schuh?</h2>
        <div className="mt-8 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
          {SCHUH.map((s) => (
            <Link
              key={s.modul}
              to={MODUL_PFAD[s.modul]}
              className="flex flex-col gap-2.5 p-6 rounded-[18px] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              style={{ background: F.grau, color: F.text, textDecoration: "none" }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.link }}>{MODUL_NAMEN[s.modul]}</span>
              <span className="text-lg font-bold leading-[1.35]">{s.satz}</span>
              <span className="mt-auto pt-2 text-sm font-bold">{s.knopf}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-abschluss" className="mt-24" style={{ background: F.akzent, color: "#ffffff" }}>
        <div className={`${BREITE} py-20 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <div className="flex-[1_1_560px] min-w-0">
            <h2 id="h-abschluss" className="text-[clamp(28px,3.2vw,42px)] font-black uppercase leading-[1.1]">Lieber gleich über dein Unternehmen reden?</h2>
            <p className="mt-3.5 text-lg leading-[1.6]">Kostenloses Erstgespräch, rund 30 Minuten, online oder telefonisch. Antwort innerhalb von 24 Stunden.</p>
          </div>
          <Hauptknopf href="/kontakt#anfrage" farbe={F.dunkel}>Erstgespräch anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
