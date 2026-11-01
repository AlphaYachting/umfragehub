import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, ChevronRight, Clock, Linkedin, Mail, Plus } from "lucide-react";
import { BREITE, F, Hauptknopf, Modulseite, Portraet } from "@/components/oeffentlich/Oeffentlich";
import Baustein, { Text, nummerieren } from "@/components/oeffentlich/wissen/Bausteine";
import { Kennzahlen } from "@/components/oeffentlich/wissen/Grafiken";
import Titelgrafik, { TITELGRAFIKEN } from "@/components/oeffentlich/wissen/Titelgrafiken";
import {
  MODUL_NAMEN, SITE, bereichName, beitragNachSlug, datumLang, istSichtbar, istVorschau, lesezeit, nurText, sichtbareBeitraege,
} from "@/inhalte/wissen";

// Gemeinsames Layout aller Beiträge im Wissensbereich (Vorlage: Prototyp
// "Wissen: Layout Blogbeitrag" auf der Arbeitsfläche, Bauanleitung uebergabe/wissen-layout.md).
// Jede Beitragsseite in src/pages/wissen/beitrag/ übergibt nur ihre Inhaltsdatei.
//
// Automatisch: Inhaltsverzeichnis aus den Abschnitten, Lesezeit, Nummern für Abbildungen und
// Tabellen, Seitentitel, Beschreibung, Canonical, Vorschaubild, strukturierte Daten
// (BlogPosting, FAQPage, BreadcrumbList), noindex für Entwürfe.

const AUTOR = { name: "Alfons Rittler", rolle: "Creative Director und Consultant" };

// Meta-Angaben im <head> setzen und beim Verlassen der Seite zurücksetzen
export function useKopfdaten({ titel, beschreibung, pfad, bild, robots, typ = "article" }) {
  useEffect(() => {
    const geaendert = [];
    const setze = (sel, attr, wert, erzeugen) => {
      let el = document.head.querySelector(sel);
      if (!el && wert) {
        el = erzeugen();
        document.head.appendChild(el);
        geaendert.push(() => el.remove());
      } else if (el) {
        const alt = el.getAttribute(attr);
        geaendert.push(() => (alt === null ? el.removeAttribute(attr) : el.setAttribute(attr, alt)));
      }
      if (el) el.setAttribute(attr, wert || "");
    };
    const meta = (key, name, wert) =>
      setze(`meta[${key}="${name}"]`, "content", wert, () => {
        const m = document.createElement("meta");
        m.setAttribute(key, name);
        return m;
      });
    const url = SITE + pfad;
    meta("name", "description", beschreibung);
    meta("name", "robots", robots || "index, follow");
    meta("property", "og:type", typ);
    meta("property", "og:title", titel);
    meta("property", "og:description", beschreibung);
    meta("property", "og:url", url);
    if (bild) meta("property", "og:image", SITE + bild);
    meta("name", "twitter:card", bild ? "summary_large_image" : "summary");
    setze('link[rel="canonical"]', "href", url, () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    });
    return () => geaendert.reverse().forEach((f) => f());
  }, [titel, beschreibung, pfad, bild, robots, typ]);
}

export function StrukturierteDaten({ daten }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }} />;
}

export function Brotkrumen({ teile }) {
  return (
    <nav aria-label="Brotkrumen">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm" style={{ color: F.daempft }}>
        {teile.map((t, i) => (
          <React.Fragment key={t.name}>
            {i > 0 && <li aria-hidden="true" className="inline-flex"><ChevronRight size={14} strokeWidth={2} /></li>}
            {t.pfad ? (
              <li><Link to={t.pfad} className="hover:underline" style={{ color: F.daempft }}>{t.name}</Link></li>
            ) : (
              <li aria-current="page" className="font-semibold" style={{ color: F.text }}>{t.name}</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export function Entwurfsbalken({ beitrag }) {
  if (!istVorschau() || beitrag.status === "freigegeben") return null;
  return (
    <div className="text-sm font-semibold" style={{ background: "#fff4d6", borderBottom: "1px solid #f0d58a", color: "#5c4400" }}>
      <div className={`${BREITE} py-2.5`}>
        Entwurf, nicht freigegeben. Nur in der Vorschau sichtbar, live auf andifragt.at ausgeblendet.
        {beitrag.geprueft ? ` Faktenprüfung vom ${datumLang(beitrag.geprueft)}.` : " Noch nicht geprüft."}
      </div>
    </div>
  );
}

function Inhaltsverzeichnis({ eintraege, aktiv, setAktiv }) {
  return (
    <ol className="border-l-2" style={{ borderColor: F.linie }}>
      {eintraege.map((t) => {
        const an = t.id === aktiv;
        return (
          <li key={t.id} className="-ml-0.5 border-l-2" style={{ borderColor: an ? F.akzent : "transparent" }}>
            <a
              href={`#${t.id}`}
              onClick={() => setAktiv(t.id)}
              aria-current={an ? "location" : undefined}
              className="grid grid-cols-[30px_minmax(0,1fr)] gap-2 items-baseline min-h-[40px] px-2.5 py-2 rounded-lg text-[15px] leading-[1.35] font-semibold hover:bg-[#f6f5f4]"
              style={{ color: an ? F.text : F.daempft, background: an ? F.hauch : undefined, textDecoration: "none" }}
            >
              <span className="font-black" style={{ color: F.link }}>{t.nr}</span>
              <span>{t.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function FaqListe({ faq }) {
  const [offen, setOffen] = useState({ 0: true });
  return (
    <div style={{ borderBottom: `1px solid ${F.linie}` }}>
      {faq.map((f, i) => {
        const auf = !!offen[i];
        return (
          <div key={f.q} className="py-5" style={{ borderTop: `1px solid ${F.linie}` }}>
            <h3>
              <button
                type="button"
                aria-expanded={auf}
                aria-controls={`faq-antwort-${i}`}
                onClick={() => setOffen((o) => ({ ...o, [i]: !auf }))}
                className="w-full grid grid-cols-[minmax(0,1fr)_36px] gap-4 items-center min-h-[44px] text-left cursor-pointer"
              >
                <span className="text-[19px] leading-[1.35] font-bold" style={{ color: F.text }}>{f.q}</span>
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center text-white transition-transform duration-200 motion-reduce:transition-none"
                  style={{ background: F.dunkel, transform: auf ? "rotate(45deg)" : "none" }}
                >
                  <Plus size={16} strokeWidth={2.6} />
                </span>
              </button>
            </h3>
            {/* Antwort bleibt im HTML, damit Google und KI-Assistenten sie lesen können */}
            <p id={`faq-antwort-${i}`} hidden={!auf} className="mt-3 mr-[52px] text-[17px] leading-[1.65]" style={{ color: "#3a3a3a" }}>
              <Text>{f.a}</Text>
            </p>
          </div>
        );
      })}
    </div>
  );
}

const H2_ABSCHNITT = "mt-2.5 mb-[22px] text-[clamp(26px,2.6vw,34px)] font-black leading-[1.15]";

function Nummer({ nr }) {
  return (
    <p aria-hidden="true" className="text-[44px] font-black leading-none" style={{ color: "transparent", WebkitTextStroke: `1.5px ${F.akzent}` }}>
      {nr}
    </p>
  );
}

export function BeitragKarte({ b, hell = true }) {
  return (
    <Link
      to={`/wissen/${b.slug}`}
      className="flex flex-col gap-3 p-[26px] rounded-[20px] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      style={{ background: hell ? "#ffffff" : F.grau, color: F.text, textDecoration: "none", border: hell ? "none" : `1px solid ${F.linie}` }}
    >
      <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: F.link }}>{b.leitartikel ? "Leitartikel" : bereichName(b)}</span>
      <span className="text-[21px] font-bold leading-[1.3]">{b.titel} {b.titelAkzent}</span>
      <span className="mt-auto text-sm" style={{ color: F.daempft }}>{lesezeit(b)} Minuten Lesezeit</span>
    </Link>
  );
}

export default function BeitragSeite({ beitrag }) {
  const b = beitrag;
  const sichtbar = istSichtbar(b);
  const pfad = `/wissen/${b.slug}`;
  const abschnitte = useMemo(() => nummerieren(b.abschnitte), [b]);
  const minuten = useMemo(() => lesezeit(b), [b]);

  const eintraege = useMemo(() => {
    const e = [{ id: "kurz", nr: "", label: "Das Wichtigste in Kürze" }];
    abschnitte.forEach((a, i) => e.push({ id: a.id, nr: String(i + 1).padStart(2, "0"), label: a.toc || nurText(a.frage) }));
    if (b.faq?.length) e.push({ id: "faq", nr: String(abschnitte.length + 1).padStart(2, "0"), label: "Häufige Fragen" });
    return e;
  }, [abschnitte, b.faq]);

  const [aktiv, setAktiv] = useState("kurz");
  // Aktuellen Abschnitt beim Scrollen im Inhaltsverzeichnis markieren
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const beob = new IntersectionObserver(
      (eintr) => {
        const sicht = eintr.filter((x) => x.isIntersecting).sort((a, c) => a.boundingClientRect.top - c.boundingClientRect.top);
        if (sicht[0]) setAktiv(sicht[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    eintraege.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) beob.observe(el);
    });
    return () => beob.disconnect();
  }, [eintraege]);

  useKopfdaten({
    titel: b.seitentitel,
    beschreibung: b.beschreibung,
    pfad,
    bild: b.titelbild?.src,
    robots: b.status === "freigegeben" ? "index, follow" : "noindex, nofollow",
  });

  const passend = useMemo(() => {
    const alle = sichtbareBeitraege().filter((x) => x.slug !== b.slug);
    const gewuenscht = (b.passend || []).map(beitragNachSlug).filter((x) => x && alle.includes(x));
    const rest = alle.filter((x) => !gewuenscht.includes(x));
    return [...gewuenscht, ...rest].slice(0, 3);
  }, [b]);

  if (!sichtbar) return <Navigate to="/wissen" replace />;

  const titelGanz = `${b.titel} ${b.titelAkzent}`;
  const datum = b.aktualisiert || b.erschienen || b.geprueft || undefined;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: titelGanz.slice(0, 110),
      description: b.beschreibung,
      image: b.titelbild?.src ? [SITE + b.titelbild.src] : undefined,
      datePublished: b.erschienen || undefined,
      dateModified: datum,
      inLanguage: "de-AT",
      mainEntityOfPage: SITE + pfad,
      author: { "@type": "Person", name: AUTOR.name, jobTitle: AUTOR.rolle, worksFor: { "@type": "Organization", name: "Rittler & Co GmbH" } },
      publisher: { "@type": "Organization", name: "Rittler & Co GmbH", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Wissen", item: SITE + "/wissen" },
        { "@type": "ListItem", position: 3, name: b.kurztitel, item: SITE + pfad },
      ],
    },
  ];
  if (b.faq?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: b.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: nurText(f.a) } })),
    });
  }

  const teilenUrl = encodeURIComponent(SITE + pfad);
  const anfrage = `/kontakt?thema=${b.modul}#anfrage`;

  return (
    <Modulseite titel={b.seitentitel} modul="Wissen">
      <StrukturierteDaten daten={ld} />
      <Entwurfsbalken beitrag={b} />

      {/* Beitragskopf */}
      <div className={`${BREITE} pt-7`}>
        <Brotkrumen teile={[{ name: "Start", pfad: "/" }, { name: "Wissen", pfad: "/wissen" }, { name: b.kurztitel }]} />
        <div className="mt-10 max-w-[900px]">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <span className="inline-flex items-center min-h-[30px] px-3 rounded-full text-[13px] font-bold uppercase tracking-[0.12em]" style={{ background: F.hauch, color: F.link }}>
              {b.etikett}
            </span>
            {b.themen?.length > 0 && <span className="text-sm" style={{ color: F.daempft }}>{b.themen.join(", ")}</span>}
          </div>
          <h1 className="mt-5 text-[clamp(36px,4.6vw,60px)] font-black leading-[1.04]" style={{ letterSpacing: "-0.01em" }}>
            {b.titel} <span style={{ color: F.akzent }}>{b.titelAkzent}</span>
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
            <div className="flex items-center gap-3">
              <Portraet className="w-12 h-12" />
              <span className="text-[15px] leading-[1.4]">
                <strong className="font-bold">{AUTOR.name}</strong>
                <br />
                <span style={{ color: F.daempft }}>{AUTOR.rolle}, Rittler &amp; Co, Graz</span>
              </span>
            </div>
            <p className="flex flex-wrap gap-x-[18px] gap-y-1 text-sm" style={{ color: F.daempft }}>
              {b.erschienen && <span>Erschienen am <time dateTime={b.erschienen}>{datumLang(b.erschienen)}</time></span>}
              {b.aktualisiert && b.aktualisiert !== b.erschienen && <span>Aktualisiert am <time dateTime={b.aktualisiert}>{datumLang(b.aktualisiert)}</time></span>}
              <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden="true" />{minuten} Minuten Lesezeit</span>
            </p>
          </div>
        </div>

        {TITELGRAFIKEN[b.slug] && (
          <figure className="mt-8 sm:mt-10">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden" style={{ background: F.dunkel }}>
              <Titelgrafik slug={b.slug} />
            </div>
            {b.titelbild?.unterschrift && <figcaption className="mt-2.5 text-sm" style={{ color: F.daempft }}><Text>{b.titelbild.unterschrift}</Text></figcaption>}
          </figure>
        )}
        {!TITELGRAFIKEN[b.slug] && b.titelbild?.src && (
          <figure className="mt-10">
            <div className="relative rounded-3xl overflow-hidden min-h-[240px]" style={{ aspectRatio: "16 / 7", background: F.dunkel }}>
              <img src={b.titelbild.src} alt={b.titelbild.alt} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "50% 40%" }} />
              {istVorschau() && b.titelbild.platzhalter && (
                <span className="absolute top-4 left-4 inline-flex items-center min-h-[26px] px-2.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.92)", border: "1.5px dashed #ff3764", color: F.link }}>
                  {b.titelbild.platzhalter}
                </span>
              )}
            </div>
            {b.titelbild.unterschrift && <figcaption className="mt-2.5 text-sm" style={{ color: F.daempft }}><Text>{b.titelbild.unterschrift}</Text></figcaption>}
          </figure>
        )}
      </div>

      {/* Inhaltsverzeichnis am Handy */}
      <div className={`${BREITE} mt-8 min-[1000px]:hidden`}>
        <details className="rounded-2xl group" style={{ border: `1px solid ${F.linie}`, background: F.grau }}>
          <summary className="flex items-center justify-between gap-3 min-h-[56px] px-5 font-bold cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            Inhalt dieses Beitrags <ChevronDown size={18} aria-hidden="true" className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-2.5 pb-3">
            <Inhaltsverzeichnis eintraege={eintraege} aktiv={aktiv} setAktiv={setAktiv} />
          </div>
        </details>
      </div>

      {/* Inhalt mit Seitenleiste */}
      <div className={`${BREITE} pt-12 flex flex-wrap items-start gap-x-[72px] gap-y-12`}>
        <aside aria-label="Inhaltsverzeichnis" className="hidden min-[1000px]:block shrink-0 w-[280px] sticky top-6">
          <p className="ml-2.5 mb-2.5 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: F.daempft }}>Inhalt</p>
          <Inhaltsverzeichnis eintraege={eintraege} aktiv={aktiv} setAktiv={setAktiv} />
          <div className="mt-7 p-[22px] rounded-[18px] text-white" style={{ background: F.dunkel }}>
            <p className="text-[17px] font-bold leading-[1.3]">{b.seitenleisteFrage}</p>
            <p className="mt-2 text-sm leading-normal" style={{ color: F.hellAufDunkel }}>Kostenloses Erstgespräch, rund 30 Minuten, online oder telefonisch.</p>
            <Link
              to={anfrage}
              className="mt-3.5 inline-flex items-center gap-2 min-h-[44px] px-4 rounded text-[13px] font-semibold uppercase tracking-[0.04em] text-white"
              style={{ background: F.akzent, textDecoration: "none" }}
            >
              Erstgespräch anfragen
            </Link>
          </div>
          <div className="mt-5 pl-2.5 flex items-center gap-2.5 text-sm" style={{ color: F.daempft }}>
            <span>Teilen:</span>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${teilenUrl}`} target="_blank" rel="nofollow noopener noreferrer" aria-label="Auf LinkedIn teilen"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ border: "1px solid #d6d3d0", color: F.text }}>
              <Linkedin size={18} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a href={`mailto:?subject=${encodeURIComponent(nurText(b.kurztitel))}&body=${teilenUrl}`} aria-label="Per E-Mail teilen"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full" style={{ border: "1px solid #d6d3d0", color: F.text }}>
              <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </aside>

        <article className="flex-[999_1_560px] min-w-0 max-w-[760px]">
          {/* Direkte Antwort */}
          <div className="px-[30px] py-7 rounded-[20px]" style={{ background: F.hauch }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: F.link }}>Kurz beantwortet</p>
            <p className="mt-2.5 text-[21px] leading-[1.55] font-semibold" style={{ color: F.text }}><Text>{b.kurzAntwort}</Text></p>
          </div>

          {/* Das Wichtigste in Kürze */}
          <section id="kurz" aria-labelledby="kurz-titel" className="mt-10 scroll-mt-6">
            <h2 id="kurz-titel" className="text-[22px] font-black uppercase tracking-[0.01em]">Das Wichtigste in Kürze</h2>
            <ul className="mt-[18px] flex flex-col gap-3.5">
              {b.wichtigstes.map((w, i) => (
                <li key={i} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-lg leading-[1.55]">
                  <span aria-hidden="true" className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white" style={{ background: w.akzent ? F.akzent : F.dunkel }}>
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span><strong className="font-bold">{w.fett}</strong> <Text>{w.text}</Text></span>
                </li>
              ))}
            </ul>
          </section>

          <Kennzahlen liste={b.kennzahlen} />

          <hr className="my-12" style={{ borderColor: F.linie }} />

          {abschnitte.map((a, i) => (
            <section key={a.id} id={a.id} aria-labelledby={`h-${a.id}`} className={`${i > 0 ? "mt-14" : ""} scroll-mt-6`}>
              <Nummer nr={String(i + 1).padStart(2, "0")} />
              <h2 id={`h-${a.id}`} className={H2_ABSCHNITT}>{a.frage}</h2>
              {a.bloecke.map((bl, j) => <Baustein key={j} b={bl} />)}
            </section>
          ))}

          {b.faq?.length > 0 && (
            <section id="faq" aria-labelledby="h-faq" className="mt-14 scroll-mt-6">
              <Nummer nr={String(abschnitte.length + 1).padStart(2, "0")} />
              <h2 id="h-faq" className="mt-2.5 mb-[18px] text-[clamp(26px,2.6vw,34px)] font-black leading-[1.15]">{b.faqTitel || "Häufige Fragen"}</h2>
              <FaqListe faq={b.faq} />
            </section>
          )}

          {b.quellen?.length > 0 && (
            <section aria-labelledby="h-quellen" className="mt-12">
              <h2 id="h-quellen" className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: F.daempft }}>Quellen und weiterlesen</h2>
              <ul className="mt-3 pl-[18px] list-disc text-[15px] leading-[1.7]" style={{ color: F.daempft }}>
                {b.quellen.map((q) => (
                  <li key={q.url}>
                    <a href={q.url} target="_blank" rel="nofollow noopener noreferrer" className="underline underline-offset-2 hover:no-underline" style={{ color: F.link }}>{q.titel}</a>
                    {q.herkunft ? `, ${q.herkunft}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Autor */}
          <section aria-label="Über den Autor" className="mt-12 p-7 rounded-3xl flex flex-wrap items-center gap-x-6 gap-y-5" style={{ background: F.grau }}>
            <Portraet className="w-[88px] h-[88px]" gross style={{ boxShadow: `0 0 0 5px ${F.grau}, 0 0 0 7px ${F.hauchRand}` }} />
            <div className="flex-[1_1_320px] min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: F.daempft }}>Geschrieben von</p>
              <p className="mt-1 text-xl font-black">{AUTOR.name}</p>
              <p className="mt-0.5 text-[15px]" style={{ color: F.daempft }}>{AUTOR.rolle}, Rittler &amp; Co, Graz</p>
              <p className="mt-2.5 leading-[1.6]" style={{ color: "#3a3a3a" }}>
                Rittler &amp; Co entwickelt seit über 20 Jahren Marken für Unternehmen in Österreich. Mit andi fragt. holt er die Marke dort ab, wo sie
                entsteht: bei den Menschen im Unternehmen.
              </p>
            </div>
          </section>
        </article>
      </div>

      {/* Passende Beiträge */}
      {passend.length > 0 && (
        <section aria-labelledby="h-weiter" className="mt-24" style={{ background: F.grau }}>
          <div className={`${BREITE} py-20`}>
            <p className="text-[13px] font-medium uppercase tracking-[0.2em]" style={{ color: F.etikett }}>Weiterlesen</p>
            <h2 id="h-weiter" className="mt-3 text-[clamp(28px,3vw,38px)] font-black uppercase leading-[1.1]">Passende Beiträge</h2>
            <div className="mt-9 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              {passend.map((p) => <BeitragKarte key={p.slug} b={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Abschluss */}
      <section aria-labelledby="h-abschluss" className={passend.length ? "" : "mt-24"} style={{ background: F.akzent, color: "#ffffff" }}>
        <div className={`${BREITE} py-20 flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <div className="flex-[1_1_560px] min-w-0">
            <h2 id="h-abschluss" className="text-[clamp(28px,3.2vw,42px)] font-black uppercase leading-[1.1]">{b.abschlussTitel}</h2>
            <p className="mt-3.5 text-lg leading-[1.6]">Kostenloses Erstgespräch, rund 30 Minuten, online oder telefonisch. Antwort innerhalb von 24 Stunden.</p>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <Hauptknopf href={anfrage} farbe={F.dunkel}>Erstgespräch anfragen</Hauptknopf>
            <Link to="/preise" className="inline-flex items-center gap-2 min-h-[44px] font-bold text-white underline underline-offset-2">
              Preise ansehen <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </Modulseite>
  );
}