import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Eingang zum Außenblick-Portal unter /aussenblick: der Code aus dem Brief oder der
// E-Mail führt nach /a/<code>. Öffentlich, ohne Login; zeigt nichts außer dem Feld.

const F = { akzent: "#ff3764", etikett: "#d4164a", text: "#2d2d2d", daempft: "#5a5a5a", linie: "#e8e6e4", grau: "#f6f5f4" };
const KONTAKT_TEL = "+43 316 570 117";

export default function PortalEingang() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  useEffect(() => {
    const vorher = document.title;
    document.title = "andi fragt. | Außenblick";
    return () => { document.title = vorher; };
  }, []);
  function weiter(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase().replace(/\s+/g, "");
    if (!c) return;
    navigate(`/a/${encodeURIComponent(c)}`);
  }
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ color: F.text, fontFamily: "var(--schrift-marke)" }}>
      <header style={{ borderBottom: `1px solid ${F.linie}` }}>
        <div className="max-w-[1040px] mx-auto px-5 sm:px-8 py-3.5">
          <Link to="/" className="text-[24px] font-black" style={{ color: F.text, textDecoration: "none" }}>andi fragt<span style={{ color: F.akzent }}>.</span></Link>
        </div>
      </header>
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: F.etikett }}>Der Außenblick</p>
        <h1 className="font-black uppercase leading-[0.98] text-[36px] sm:text-[56px] max-w-[760px]">Wir haben nur getan, was Ihr nächster Kunde auch tut: gegoogelt.</h1>
        <p className="mt-6 text-[18px] leading-[1.6] max-w-[640px]" style={{ color: F.daempft }}>Sie haben einen Brief oder eine E-Mail mit einem Code bekommen. Damit öffnet sich Ihre Seite: was jeder sieht, der Sie sucht, und fünf Fragen, die nur Sie beantworten können.</p>
        <form onSubmit={weiter} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-[560px]">
          <label className="flex-1">
            <span className="sr-only">Code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code, z. B. PCF-7K3M-Q9XA"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="w-full min-h-[56px] rounded-md px-4 text-[20px] font-bold tracking-[0.08em] uppercase outline-none focus:ring-2"
              style={{ border: `1px solid ${F.linie}`, background: F.grau, color: F.text }}
            />
          </label>
          <button type="submit" disabled={!code.trim()} className="inline-flex items-center justify-center gap-2 min-h-[56px] rounded px-7 text-sm font-semibold uppercase tracking-[0.04em] disabled:opacity-50" style={{ background: F.akzent, color: "#fff" }}>
            Seite öffnen <ArrowRight size={16} />
          </button>
        </form>
        <p className="mt-6 text-[14px]" style={{ color: F.daempft }}>Kein Code? Dann ist diese Seite nicht für Sie gedacht. Fragen beantwortet Alfons Rittler gern: {KONTAKT_TEL}</p>
      </main>
      <footer style={{ borderTop: `1px solid ${F.linie}` }}>
        <div className="max-w-[1040px] mx-auto px-5 sm:px-8 py-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: F.daempft }}>
          <span>Rittler &amp; Co GmbH, Graz</span>
          <a href="/impressum" className="hover:underline" style={{ color: F.daempft }}>Impressum</a>
          <a href="/datenschutz" className="hover:underline" style={{ color: F.daempft }}>Datenschutz</a>
        </div>
      </footer>
    </div>
  );
}
