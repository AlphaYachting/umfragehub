import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BREITE, Etikett, F, Hauptknopf, Modulseite } from "@/components/oeffentlich/Oeffentlich";
import { Brotkrumen, StrukturierteDaten, useKopfdaten } from "@/components/oeffentlich/wissen/BeitragSeite";
import { SITE, istVorschau, lesezeit } from "@/inhalte/wissen";
import {
  MODUL_NAMEN_EN, MODUL_PFAD_EN, NACHFOLGE_EN, bereichNameEn, istNachfolgeEn, sichtbareBeitraegeEn,
} from "@/inhalte/wissen/en";

// English insights overview under /en/insights (17.11.2026), adapted from src/pages/wissen/Wissen.jsx.

const TITEL = "Insights for growing companies: team, brand, sales | andi fragt.";
const BESCHREIBUNG =
  "Practical guides from Rittler & Co in Graz, Austria: employee feedback, finding your USP, customer loyalty, sales and business succession.";

const SCHUH = [
  { modul: "team", satz: "Good people are leaving, and you don't really know why.", knopf: "The team interview" },
  { modul: "positionierung", satz: "Your advertising sounds like everyone else's.", knopf: "Positioning" },
  { modul: "kunden", satz: "Customers leave quietly, without saying why.", knopf: "The customer interview" },
  { modul: "vertrieb", satz: "Proposals go out, deals don't come back.", knopf: "The sales interview" },
];

function EntwurfsMarke({ b }) {
  if (b.status === "freigegeben") return null;
  return (
    <span className="inline-flex items-center min-h-[22px] px-2 rounded-full text-[11px] font-bold uppercase tracking-[0.08em]" style={{ background: "#fff4d6", color: "#5c4400" }}>
      Draft
    </span>
  );
}

export default function InsightsEn() {
  const alle = useMemo(() => sichtbareBeitraegeEn(), []);
  const [thema, setThema] = useState("alle");
  const leit = alle.find((b) => b.leitartikel);
  const passt = (b, id) => id === "alle" || (id === "nachfolge" ? istNachfolgeEn(b) : b.modul === id);
  const liste = alle.filter((b) => b !== leit && passt(b, thema));
  const zeigeLeit = leit && passt(leit, thema);
  const zaehle = (id) => alle.filter((b) => passt(b, id)).length;
  const hatFreigegebene = alle.some((b) => b.status === "freigegeben");

  useKopfdaten({ titel: TITEL, beschreibung: BESCHREIBUNG, pfad: "/en/insights", typ: "website", robots: hatFreigegebene ? "index, follow" : "noindex, nofollow" });

  useEffect(() => {
    base44.analytics.track({ eventName: "wissen_uebersicht_view", properties: { pfad: "/en/insights" } });
  }, []);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Insights from andi fragt.",
      description: BESCHREIBUNG,
      url: SITE + "/en/insights",
      inLanguage: "en-GB",
      publisher: { "@type": "Organization", name: "Rittler & Co GmbH", url: SITE },
      blogPost: alle
        .filter((b) => b.status === "freigegeben")
        .map((b) => ({ "@type": "BlogPosting", headline: `${b.titel} ${b.titelAkzent}`.slice(0, 110), url: `${SITE}/en/insights/${b.slug}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/en" },
        { "@type": "ListItem", position: 2, name: "Insights", item: SITE + "/en/insights" },
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
    <Modulseite titel={TITEL} modul="Insights">
      <StrukturierteDaten daten={ld} />
      {istVorschau() && !hatFreigegebene && (
        <div className="text-sm font-semibold" style={{ background: "#fff4d6", borderBottom: "1px solid #f0d58a", color: "#5c4400" }}>
          <div className={`${BREITE} py-2.5`}>Preview: all articles are still drafts.</div>
        </div>
      )}

      <section className={`${BREITE} pt-7`}>
        <Brotkrumen teile={[{ name: "Home", pfad: "/en" }, { name: "Insights" }]} />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex-[1_1_620px] min-w-0">
            <Etikett>Insights</Etikett>
            <h1 className="mt-3.5 text-[clamp(38px,5vw,64px)] font-black uppercase leading-none">
              Honest answers to the questions <span style={{ color: F.akzent }}>business owners really ask.</span>
            </h1>
          </div>
          <p className="flex-[1_1_380px] min-w-0 text-[19px] leading-[1.6]" style={{ color: F.daempft }}>
            Employee feedback, positioning, customer loyalty and sales: practical guides from Rittler &amp; Co in Graz,
            Austria, for companies with 10 to 100 people.
          </p>
        </div>
        {alle.length > 0 && (
          <div role="group" aria-label="Filter articles by topic" className="mt-10 flex flex-wrap gap-2">
            {chip("alle", "All topics")}
            {Object.entries(MODUL_NAMEN_EN).map(([id, name]) => chip(id, name))}
            {zaehle("nachfolge") > 0 && chip("nachfolge", NACHFOLGE_EN)}
          </div>
        )}
      </section>

      {zeigeLeit && (
        <section aria-label="Featured article" className={`${BREITE} mt-9`}>
          <Link
            to={`/en/insights/${leit.slug}`}
            className="flex flex-wrap rounded-[28px] overflow-hidden text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
            style={{ background: F.dunkel, textDecoration: "none" }}
          >
            <div className="relative flex-[1_1_440px] min-h-[300px]">
              {leit.titelbild?.src && <img src={leit.titelbild.src} alt={leit.titelbild.alt || leit.titel || ""} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 40%" }} />}
            </div>
            <div className="flex-[1_1_440px] min-w-0 p-[clamp(28px,4vw,52px)] flex flex-col gap-[18px]">
              <span className="self-start flex flex-wrap gap-2">
                <span className="inline-flex items-center min-h-[30px] px-3 rounded-full text-xs font-bold uppercase tracking-[0.12em]" style={{ background: F.akzent }}>Featured</span>
                <EntwurfsMarke b={leit} />
              </span>
              <h2 className="text-[clamp(26px,2.8vw,36px)] font-black leading-[1.12]">{leit.titel} {leit.titelAkzent}</h2>
              <p className="text-lg leading-[1.6]" style={{ color: F.hellAufDunkel }}>{leit.teaser}</p>
              <span className="mt-auto pt-[18px] flex flex-wrap items-center justify-between gap-3 text-sm" style={{ borderTop: "1px solid #4a4a4a", color: F.hellAufDunkel }}>
                <span>Alfons Rittler, {lesezeit(leit)} min read</span>
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-white">Read more <ArrowRight size={16} aria-hidden="true" /></span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {liste.length > 0 && (
        <section aria-labelledby="h-beitraege" className={`${BREITE} pt-14`}>
          <h2 id="h-beitraege" className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: F.daempft }}>
            {thema === "alle" ? "All articles" : `Articles on ${thema === "nachfolge" ? NACHFOLGE_EN : MODUL_NAMEN_EN[thema]}`}
          </h2>
          <ul className="mt-5 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {liste.map((b) => (
              <li key={b.slug} className="flex">
                <Link
                  to={`/en/insights/${b.slug}`}
                  className="flex-1 flex flex-col gap-3.5 p-7 rounded-[22px] bg-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
                  style={{ border: `1px solid ${F.linie}`, color: F.text, textDecoration: "none" }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.link }}>
                      <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: F.akzent }} />
                      {bereichNameEn(b)}
                    </span>
                    <EntwurfsMarke b={b} />
                  </span>
                  <h3 className="text-[21px] font-bold leading-[1.3]">{b.titel} {b.titelAkzent}</h3>
                  <p className="leading-[1.6]" style={{ color: F.daempft }}>{b.teaser}</p>
                  <span className="mt-auto pt-3.5 flex items-center justify-between gap-3 text-sm" style={{ borderTop: `1px solid ${F.linie}`, color: F.daempft }}>
                    <span>{lesezeit(b)} min read</span>
                    <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: F.text }}>Read <ArrowRight size={15} aria-hidden="true" /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="h-module" className={`${BREITE} pt-[88px]`}>
        <Etikett>From reading to acting</Etikett>
        <h2 id="h-module" className="mt-3 text-[clamp(28px,3vw,38px)] font-black uppercase leading-[1.1]">Where does it hurt?</h2>
        <div className="mt-8 grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
          {SCHUH.map((s) => (
            <Link
              key={s.modul}
              to={MODUL_PFAD_EN[s.modul]}
              className="flex flex-col gap-2.5 p-6 rounded-[18px] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
              style={{ background: F.grau, color: F.text, textDecoration: "none" }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.link }}>{MODUL_NAMEN_EN[s.modul]}</span>
              <span className="text-lg font-bold leading-[1.35]">{s.satz}</span>
              <span className="mt-auto pt-2 text-sm font-bold">{s.knopf}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="h-abschluss" className="mt-24" style={{ background: F.akzent, color: "#ffffff" }}>
        <div className={`${BREITE} py-20 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <div className="flex-[1_1_560px] min-w-0">
            <h2 id="h-abschluss" className="text-[clamp(28px,3.2vw,42px)] font-black uppercase leading-[1.1]">Rather talk about your company right away?</h2>
            <p className="mt-3.5 text-lg leading-[1.6]">Free first call, about 30 minutes, online or by phone. A reply within 24 hours.</p>
          </div>
          <Hauptknopf href="/en/contact#anfrage" farbe={F.dunkel}>Request a first call</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
