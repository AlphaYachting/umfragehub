import React, { useEffect, useState } from "react";
import { Etikett, F } from "@/components/oeffentlich/Oeffentlich";

// Kundenlogos von Rittler & Co als ruhiger Slider. Aus der Startseite ausgelagert (01.11.2026),
// damit Startseite und Über uns dieselbe Leiste zeigen.

// Kundenlogos von werbe-agentur-graz.at/kunden. Auswahl Alfons 25.10.2026 zuerst,
// danach die bisherigen. Jedes Logo nur einmal.
const LOGO_BASIS = "https://www.werbe-agentur-graz.at/assets/images/";
export const KUNDENLOGOS = [
  { name: "ATL Immoinvest", datei: "0/atl-10q4b2q7w8t7zzz.webp" },
  { name: "Haas Fertigbau", datei: "w/haas-fertigbau-8kp08ynrz293pp2.webp" },
  { name: "Steirerfleisch", datei: "b/steirerfleisch-76b8yv3vhvdpreq.webp" },
  { name: "Zeta", datei: "4/zeta-logo-1-bsm76qw5w9w7xpr.webp" },
  { name: "smaXtec", datei: "6/smaxtec-logo-172f1k1wvz6zk9n.svg" },
  { name: "WIGA", datei: "w/wiga-logo-qxxjhwww5vteyzf.webp" },
  { name: "Amiblu", datei: "7/amiblu-ma278bdy0xtmt5j.webp" },
  { name: "BFI Steiermark", datei: "4/client_bfi-bvp23r5xxf0t9ta.svg" },
  { name: "Drone Rescue Systems", datei: "t/drone-rescue-4f7dkas8pcmg7nj.webp" },
  { name: "NAVAX", datei: "2/logo-navax-cncjxfk668p80h6.webp" },
  { name: "Sappi", datei: "p/sappi-vq6hmxk9k3ykhh7.webp" },
  { name: "Leeb Balkone", datei: "y/leeb-wzbsa3753b3q8rb.webp" },
  { name: "Zeiss", datei: "a/client_zeiss-bk1gdn6mq34g5m7.svg" },
  { name: "Wienerberger", datei: "a/wienerberger_logo-57ntkym2r6gjj09.svg" },
  { name: "Weingut Pfeifer", datei: "8/pfeifer_logo-mtajnnff161zty3.svg" },
  { name: "Glavassevich & Fauster", datei: "6/glavassevich_logo-h6pktrctxqcsfpp.svg" },
  { name: "Weingut Tement", datei: "v/tement-t8dxfnf0e58we3v.webp" },
  { name: "Makava", datei: "a/MAKAvA-hm6gza1tc6bdxps.webp" },
  { name: "MFL Maschinenfabrik Liezen", datei: "n/mfl-logo-1dht9cbesf9q86n.svg" },
];

// Ein Logo im Slider. Alle Logos bekommen dieselbe optische Fläche, damit breite
// Schriftzüge (smaXtec) nicht riesig und quadratische Zeichen (Makava) nicht winzig wirken.
const LOGO_FLAECHE = 4000; // px² je Logo
const LOGO_MAX_B = 150;
const LOGO_MAX_H = 56;

function SliderLogo({ name, datei, kopie }) {
  const [mass, setMass] = useState(null);

  function vermessen(e) {
    const { naturalWidth: b, naturalHeight: h } = e.currentTarget;
    if (!b || !h) return;
    const verhaeltnis = b / h;
    let hoehe = Math.sqrt(LOGO_FLAECHE / verhaeltnis);
    let breite = hoehe * verhaeltnis;
    if (breite > LOGO_MAX_B) { breite = LOGO_MAX_B; hoehe = breite / verhaeltnis; }
    if (hoehe > LOGO_MAX_H) { hoehe = LOGO_MAX_H; breite = hoehe * verhaeltnis; }
    setMass({ breite: Math.round(breite), hoehe: Math.round(hoehe) });
  }

  return (
    <li className="kundenslider-logo">
      <img
        src={LOGO_BASIS + datei}
        alt={kopie ? "" : name}
        title={kopie ? undefined : name}
        decoding="async"
        onLoad={vermessen}
        style={mass ? { width: mass.breite, height: mass.hoehe } : { height: 40, width: "auto" }}
      />
    </li>
  );
}

// Kunden-Slider in ruhigen Einzelschritten (Wunsch 25.10.2026: nicht durchlaufen):
// Die Reihe steht SLIDER_PAUSE ms still und gleitet dann um genau ein Logo nach rechts.
// Drei gleiche Reihen hintereinander; nach einer vollen Runde springt die Spur
// unsichtbar zurück, dadurch läuft es endlos ohne Lücke. Beim Darüberfahren hält er an.
const SLIDER_PAUSE = 2600;
const SLIDER_GLEITEN = 900;

export default function KundenSlider({ titel = "Kunden, die Rittler & Co vertrauen", hintergrund = F.grau }) {
  const anzahl = KUNDENLOGOS.length;
  const [schritt, setSchritt] = useState(0);
  const [gleitet, setGleitet] = useState(true);
  const [angehalten, setAngehalten] = useState(false);

  // Nächster Schritt nach der Pause
  useEffect(() => {
    if (angehalten) return undefined;
    const t = setTimeout(() => {
      setGleitet(true);
      setSchritt((s) => s + 1);
    }, SLIDER_PAUSE);
    return () => clearTimeout(t);
  }, [schritt, angehalten]);

  // Nach einer vollen Runde ohne Animation an den Anfang zurück (sieht identisch aus)
  useEffect(() => {
    if (schritt < anzahl) return undefined;
    const t = setTimeout(() => {
      setGleitet(false);
      setSchritt(0);
    }, SLIDER_GLEITEN + 60);
    return () => clearTimeout(t);
  }, [schritt, anzahl]);

  const reihe = (kopie, schluessel) => (
    <ul key={schluessel} className="kundenslider-reihe" aria-hidden={kopie ? "true" : undefined}>
      {KUNDENLOGOS.map((l) => (
        <SliderLogo key={l.name} {...l} kopie={kopie} />
      ))}
    </ul>
  );

  return (
    <section aria-label="Kunden von Rittler & Co" className="py-16" style={{ background: hintergrund }}>
      <style>{`
        .kundenslider { --platz: 210px; overflow: hidden; background: var(--farbe-grau); -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
        .kundenslider-spur { display: flex; width: max-content; background: var(--farbe-grau); will-change: transform; }
        .kundenslider-reihe { display: flex; align-items: center; margin: 0; padding: 0; list-style: none; }
        .kundenslider-logo { flex: 0 0 var(--platz); width: var(--platz); height: 96px; display: flex; align-items: center; justify-content: center; }
        .kundenslider-logo img { display: block; object-fit: contain; filter: grayscale(1) contrast(1.3); mix-blend-mode: multiply; opacity: .8; transition: filter .4s ease, opacity .4s ease; }
        .kundenslider-logo img:hover { filter: none; opacity: 1; }
        @media (max-width: 640px) { .kundenslider { --platz: 160px; } .kundenslider-logo { height: 80px; } .kundenslider-logo img { transform: scale(.82); } }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <Etikett>{titel}</Etikett>
      </div>
      <div
        className="kundenslider mt-8"
        onMouseEnter={() => setAngehalten(true)}
        onMouseLeave={() => setAngehalten(false)}
      >
        <div
          className="kundenslider-spur"
          style={{
            transform: `translate3d(calc(var(--platz) * ${schritt - anzahl}), 0, 0)`,
            transition: gleitet ? `transform ${SLIDER_GLEITEN}ms cubic-bezier(.65, 0, .35, 1)` : "none",
          }}
        >
          {reihe(false, "a")}
          {reihe(true, "b")}
          {reihe(true, "c")}
        </div>
      </div>
    </section>
  );
}

