import React, { useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  BREITE, Etikett, F, H1_STIL, KONTAKT_MAIL, KONTAKT_TEL, LEAD_STIL, Modulseite, TEXT_STIL,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";
import Erstgespraech from "@/components/oeffentlich/Erstgespraech";

// English contact page under /en/contact (17.11.2026), adapted from src/pages/Kontakt.jsx.
// The request form is the shared Erstgespraech component; it switches to English on /en.

const TEL_LINK = `tel:${KONTAKT_TEL.replace(/\s/g, "")}`;

const WEGE = [
  {
    icon: Phone,
    label: "Phone",
    wert: KONTAKT_TEL,
    href: TEL_LINK,
    text: "The quickest way: call and tell us briefly what it is about.",
  },
  {
    icon: Mail,
    label: "Email",
    wert: KONTAKT_MAIL,
    href: `mailto:${KONTAKT_MAIL}`,
    text: "Write to us about what you have in mind. We will reply as soon as we can.",
  },
  {
    icon: MapPin,
    label: "Address",
    wert: "Rittler & Co GmbH, Peter-Rosegger-Straße 27, 8053 Graz, Austria",
    href: null,
    text: "Visits by appointment only, so we can give you our full attention.",
  },
];

const ANLIEGEN = [
  "An interview for your company: who we interview, how many people, how long it takes.",
  "The brand check, our way of finding out where you stand when you don't know yet.",
  "An interview you have been invited to: if your link doesn't work, call us and we will send you a new one.",
];

export default function KontaktEn() {
  useEffect(() => {
    if (!window.location.hash.startsWith("#anfrage")) return undefined;
    const t = setTimeout(() => document.getElementById("anfrage")?.scrollIntoView({ block: "start" }), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <Modulseite titel="Free intro call | andi fragt. Graz" modul="Contact">
      <section className={`${BREITE} pt-14 pb-6`}>
        <Etikett>Contact</Etikett>
        <h1 className="mt-4 max-w-[900px]" style={H1_STIL}>
          Let's talk about <span style={{ color: F.akzent }}>your company.</span>
        </h1>
        <p className="mt-6" style={{ ...LEAD_STIL, color: F.daempft }}>
          Want to know what leadership, team, sales and customers really think? Request a free intro call, or get in
          touch by phone or email. We will tell you honestly whether an interview makes sense in your situation.
        </p>
      </section>

      <div className="mt-10">
        <Erstgespraech />
      </div>

      <section className={`${BREITE} pt-20 pb-10`}>
        <Etikett>Prefer to reach us directly?</Etikett>
        <ul className="mt-5 grid gap-4 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {WEGE.map(({ icon: Icon, label, wert, href, text }) => (
            <li key={label} className="rounded-lg p-6" style={{ background: F.grau, border: `1px solid ${F.linie}` }}>
              <Icon size={26} strokeWidth={1.5} style={{ color: F.akzent }} aria-hidden="true" />
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: F.etikett }}>{label}</p>
              <p className="mt-2 text-lg font-bold leading-[1.35]">
                {href ? (
                  <a href={href} className="hover:underline" style={{ color: F.text }}>{wert}</a>
                ) : (
                  <span style={{ color: F.text }}>{wert}</span>
                )}
              </p>
              <p className="mt-2 text-[15px] leading-snug" style={{ color: F.daempft }}>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${BREITE} py-14`} style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className="max-w-[680px]">
          <Etikett>What we can help with</Etikett>
          <h2 className="mt-3 text-2xl font-bold">Three typical requests</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {ANLIEGEN.map((a) => (
              <li key={a} className="flex gap-3" style={{ ...TEXT_STIL, color: F.daempft }}>
                <span className="shrink-0 w-1.5 h-1.5 mt-[11px] rounded-full" style={{ background: F.akzent }} aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px]" style={{ color: F.daempft }}>
            Have you been invited to an interview? Then you don't need us: just open the link in your invitation or
            enter the code on the{" "}
            <a href="/en#eingeladen" className="font-semibold hover:underline" style={{ color: F.link }}>home page</a>.
          </p>
        </div>
      </section>

      <Faq seite="kontakt" look="weiss" />
    </Modulseite>
  );
}
