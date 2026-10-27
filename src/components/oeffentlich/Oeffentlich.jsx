import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Gemeinsame Bausteine der öffentlichen Seiten von andifragt.at
// (Startseite und die vier Modulseiten).
//
// Typografie wie auf der Startseite: Gilroy hat keine Gedankenstriche,
// typografischen Anführungszeichen oder Mittelpunkte. Texte deshalb mit
// Doppelpunkt, Komma oder Punkt statt Strich schreiben.
// Sprachregel: Auf den öffentlichen Seiten heißt es immer Interview, nie Befragung.

export const KONTAKT_MAIL = "office@rittler.co";
export const KONTAKT_TEL = "+43 316 570 117";
export const IMPRESSUM = "https://www.werbe-agentur-graz.at/impressum";
export const DATENSCHUTZ = "https://www.werbe-agentur-graz.at/datenschutz";
export const MARKENPRUEFSTAND = "https://www.werbe-agentur-graz.at/positionierung-agentur";

export const F = {
  akzent: "var(--farbe-akzent)",
  etikett: "#d4164a",
  etikettDunkel: "#ff7a98",
  link: "#c4103f",
  text: "var(--farbe-text)",
  daempft: "var(--farbe-text-daempft)",
  grau: "var(--farbe-grau)",
  hauch: "var(--farbe-akzent-hauch)",
  hauchRand: "#f3c6d1",
  linie: "var(--farbe-linie)",
  gut: "var(--farbe-gut)",
  dunkel: "#2d2d2d",
  dunkelKarte: "#3a3a3a",
  hellAufDunkel: "#d4d4d4",
};

export const mailAn = (betreff) => `mailto:${KONTAKT_MAIL}?subject=${encodeURIComponent(betreff)}`;

export const MODULE = [
  { id: "positionierung", pfad: "/positionierung", name: "Positionierung" },
  { id: "team", pfad: "/team", name: "Team" },
  { id: "kunden", pfad: "/kunden", name: "Kunden" },
  { id: "vertrieb", pfad: "/vertrieb", name: "Vertrieb" },
];

export const H1_STIL = {

  fontSize: "clamp(40px, 6vw, 76px)",
  fontWeight: 900,
  textTransform: "uppercase",
  lineHeight: 0.98,
};

export const H2_STIL = {

  fontSize: "clamp(30px, 3.4vw, 40px)",
  fontWeight: 900,
  textTransform: "uppercase",
  lineHeight: 1.12,
};

export const LEAD_STIL = { maxWidth: 680, fontSize: 20, lineHeight: 1.6 };
export const TEXT_STIL = { fontSize: 18, lineHeight: 1.65 };
export const BREITE = "max-w-6xl mx-auto px-6";

export function useSeitentitel(titel) {
  useEffect(() => {
    const vorher = document.title;
    document.title = titel;
    return () => {
      document.title = vorher;
    };
  }, [titel]);
}

// Kleine Bereichsbeschriftung: Medium, Versalien, weit gesperrt.
export function Etikett({ children, dunkel = false, className = "", style }) {
  return (
    <p
      className={`text-[13px] font-medium uppercase tracking-[0.2em] ${className}`}
      style={{ color: dunkel ? F.etikettDunkel : F.etikett, ...style }}
    >
      {children}
    </p>
  );
}

// Kleines Label über Inhalten in Karten.
export function Kleinlabel({ children, dunkel = false, style }) {
  return (
    <p
      className="text-xs font-medium uppercase tracking-[0.18em]"
      style={{ color: dunkel ? F.hellAufDunkel : F.daempft, ...style }}
    >
      {children}
    </p>
  );
}

export function Hauptknopf({ href, children, farbe = F.akzent, schrift = "#ffffff", pfeil = true }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 min-h-[48px] rounded px-6 text-sm font-semibold uppercase tracking-[0.04em]"
      style={{ background: farbe, color: schrift, textDecoration: "none" }}
    >
      {children} {pfeil && <ArrowRight size={16} aria-hidden="true" />}
    </a>
  );
}

// Die Wortmarken-Familie: andi fragt. / andi weiß. / andi macht. / andi zeigt.
// Gilroy Black (900) mit leicht engerer Laufweite, genau wie im Kunden-Cockpit.
export function Wortmarke({ verb = "fragt", groesse = 24, gewicht = 900, farbe, className = "" }) {
  return (
    <span className={className} style={{ fontSize: groesse, fontWeight: gewicht, lineHeight: 1, color: farbe, letterSpacing: "-0.01em" }}>
      andi {verb}
      <span style={{ color: F.akzent }}>.</span>
    </span>
  );
}

// „Für dich als“ mit den Rollen der Zielgruppe.
export function FuerDich({ rollen, dunkel = false, mitte = false, className = "mt-7" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${mitte ? "justify-center" : ""} ${className}`}>
      <span
        className="mr-1 text-xs font-medium uppercase tracking-[0.2em]"
        style={{ color: dunkel ? F.hellAufDunkel : F.daempft }}
      >
        Für dich als
      </span>
      {rollen.map((r) => (
        <span
          key={r}
          className="inline-flex items-center min-h-[32px] px-3.5 rounded-full text-sm font-medium"
          style={
            dunkel
              ? { border: "1px solid #767676", color: "#ffffff" }
              : { background: "#ffffff", border: `1px solid ${F.hauchRand}`, color: F.text }
          }
        >
          {r}
        </span>
      ))}
    </div>
  );
}

// Rundes Foto mit Ring. ringe: [{ abstand, farbe, gestrichelt }]
export function RundesFoto({ src, alt, groesse = 320, ringe = [], rand, className = "" }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: groesse, maxWidth: "100%", aspectRatio: "1 / 1" }}>
      {ringe.map((r, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full"
          style={{ inset: -r.abstand, border: `2px ${r.gestrichelt ? "dashed" : "solid"} ${r.farbe}` }}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={groesse}
        height={groesse}
        loading="lazy"
        className="relative block w-full h-full rounded-full object-cover"
        style={rand ? { border: rand, boxSizing: "border-box" } : undefined}
      />
    </div>
  );
}

// Kopf der Modulseiten: Wortmarke, das Thema der Seite, Module, Kontakt.
export function Kopf({ modul, dunkel = false, randUnten = true }) {
  const schrift = dunkel ? "#ffffff" : F.text;
  return (
    <header style={{ borderBottom: randUnten ? `1px solid ${dunkel ? "#444444" : F.linie}` : "none" }}>
      <div className={`${BREITE} min-h-[80px] flex flex-wrap items-center justify-between gap-x-7 gap-y-3`}>
        <span className="inline-flex items-center gap-3.5">
          <Link to="/" aria-label="andi fragt. Zur Startseite" style={{ color: schrift, textDecoration: "none" }}>
            <Wortmarke />
          </Link>
          {modul && (
            <>
              <span aria-hidden="true" style={{ width: 1, height: 22, background: dunkel ? "#767676" : "#b3b3b3" }} />
              <span
                className="text-[13px] font-medium uppercase tracking-[0.2em]"
                style={{ color: dunkel ? F.etikettDunkel : F.etikett }}
              >
                {modul}
              </span>
            </>
          )}
        </span>
        <nav aria-label="Module" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-semibold">
          {MODULE.map((m) => {
            const aktiv = m.name === modul;
            return (
              <Link
                key={m.id}
                to={m.pfad}
                aria-current={aktiv ? "page" : undefined}
                className="hidden min-[900px]:inline-flex items-center min-h-[44px]"
                style={{
                  color: aktiv ? (dunkel ? F.etikettDunkel : F.link) : schrift,
                  textDecoration: "none",
                  borderBottom: aktiv ? `2px solid ${F.akzent}` : "2px solid transparent",
                }}
              >
                {m.name}
              </Link>
            );
          })}
          <Link
            to="/preise"
            aria-current={modul === "Preise" ? "page" : undefined}
            className="hidden min-[900px]:inline-flex items-center min-h-[44px]"
            style={{
              color: modul === "Preise" ? (dunkel ? F.etikettDunkel : F.link) : schrift,
              textDecoration: "none",
              borderBottom: modul === "Preise" ? `2px solid ${F.akzent}` : "2px solid transparent",
            }}
          >
            Preise
          </Link>
          <Link
            to="/ueber-uns"
            className="hidden min-[900px]:inline-flex items-center min-h-[44px]"
            style={{ color: schrift, textDecoration: "none" }}
          >
            Über uns
          </Link>
          <Link
            to="/kontakt"
            className="inline-flex items-center min-h-[44px] px-4 rounded"
            style={{ background: dunkel ? F.akzent : F.dunkel, color: "#ffffff", textDecoration: "none" }}
          >
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Fuss({ dunkel = false, hintergrund }) {
  const farbe = dunkel ? "#b3b3b3" : F.daempft;
  return (
    <footer style={{ borderTop: `1px solid ${dunkel ? "#444444" : F.linie}`, background: hintergrund }}>
      <div className={`${BREITE} py-8 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between text-sm`} style={{ color: farbe }}>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <strong className="font-semibold" style={{ color: dunkel ? "#ffffff" : F.text }}>Rittler &amp; Co GmbH</strong>
          <span>Peter-Rosegger-Straße 27, 8053 Graz</span>
          <a href={`tel:${KONTAKT_TEL.replace(/\s/g, "")}`} className="hover:underline" style={{ color: farbe }}>{KONTAKT_TEL}</a>
          <a href={`mailto:${KONTAKT_MAIL}`} className="hover:underline" style={{ color: farbe }}>{KONTAKT_MAIL}</a>
        </div>
        <div className="flex gap-5">
          <Link to="/" className="hover:underline" style={{ color: farbe }}>Zur Startseite</Link>
          <Link to="/preise" className="hover:underline" style={{ color: farbe }}>Preise</Link>
          <Link to="/ueber-uns" className="hover:underline" style={{ color: farbe }}>Über uns</Link>
          <Link to="/kontakt" className="hover:underline" style={{ color: farbe }}>Kontakt</Link>
          <a href={IMPRESSUM} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: farbe }}>Impressum</a>
          <a href={DATENSCHUTZ} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: farbe }}>Datenschutz</a>
          {/* Bewusst kein Link zur Verwaltung */}
        </div>
      </div>
    </footer>
  );
}

// Rahmen jeder Modulseite: Hintergrund, Schrift, Kopf, Fuß, beim Öffnen nach oben.
export function Modulseite({ titel, modul, hintergrund = "#ffffff", dunkel = false, kopfRand = true, fussDunkel, fussHintergrund, children }) {
  useSeitentitel(titel);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div
      className="min-h-screen"
      style={{ background: hintergrund, color: dunkel ? "#ffffff" : F.text, fontFamily: "var(--schrift-marke)" }}
    >
      <Kopf modul={modul} dunkel={dunkel} randUnten={kopfRand} />
      <main>{children}</main>
      <Fuss dunkel={fussDunkel ?? dunkel} hintergrund={fussHintergrund} />
    </div>
  );
}

export function Beispielhinweis({ dunkel = false, children = "Beispiel zur Veranschaulichung, keine echten Daten.", className = "mt-4" }) {
  return (
    <p className={`text-[13px] ${className}`} style={{ color: dunkel ? "#b3b3b3" : F.daempft }}>
      {children}
    </p>
  );
}