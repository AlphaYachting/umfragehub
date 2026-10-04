import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { alle } from "@/lib/verwaltung";

// Kopfsuche — Wegweiser zu Projekt und Welle. Der Index wird einmal geladen und
// beim Fokussieren höchstens alle 30 Sekunden aufgefrischt.
const MERKER = "umfragehub_zuletzt";
const JE_GRUPPE = 6;

function zuletztLesen() {
  try {
    return JSON.parse(localStorage.getItem(MERKER) || "[]");
  } catch (e) {
    return [];
  }
}

function zuletztMerken(eintrag) {
  try {
    const liste = [eintrag, ...zuletztLesen().filter((x) => x.pfad !== eintrag.pfad)].slice(0, 6);
    localStorage.setItem(MERKER, JSON.stringify(liste));
  } catch (e) {
    // Ohne Browser-Speicher gibt es eben kein „Zuletzt geöffnet“
  }
}

function hervorheben(text, wort) {
  const t = String(text || "");
  const i = wort ? t.toLowerCase().indexOf(wort.toLowerCase()) : -1;
  if (i < 0) return t;
  return (
    <>
      {t.slice(0, i)}
      <span className="bg-primary/15 rounded-[2px]">{t.slice(i, i + wort.length)}</span>
      {t.slice(i + wort.length)}
    </>
  );
}

export default function Kopfsuche() {
  const navigate = useNavigate();
  const feld = useRef(null);
  const geladenAm = useRef(0);
  const [index, setIndex] = useState([]);
  const [text, setText] = useState("");
  const [aktiv, setAktiv] = useState(false);
  const [markiert, setMarkiert] = useState(0);

  async function indexLaden() {
    if (Date.now() - geladenAm.current < 30000) return;
    geladenAm.current = Date.now();
    try {
      const [projekte, wellen] = await Promise.all([alle(base44.entities.Projekt), alle(base44.entities.Welle)]);
      const projektName = Object.fromEntries(projekte.map((p) => [p.id, p]));
      setIndex([
        ...projekte.map((p) => ({
          gruppe: "Projekte", schild: "Projekt", titel: p.name || "", unter: p.kundenname || "",
          pfad: `/projekt/${p.id}`, suchtext: `${p.name} ${p.kundenname}`.toLowerCase(),
        })),
        ...wellen.map((w) => ({
          gruppe: "Wellen", schild: "Welle", titel: w.name || "",
          unter: [projektName[w.projektId]?.name, projektName[w.projektId]?.kundenname].filter(Boolean).join(" · "),
          pfad: `/welle/${w.id}/dashboard`,
          suchtext: `${w.name} ${projektName[w.projektId]?.name || ""} ${projektName[w.projektId]?.kundenname || ""}`.toLowerCase(),
        })),
      ]);
    } catch (e) {
      geladenAm.current = 0;
    }
  }

  // ⌘K / Strg+K setzt den Fokus und markiert den Inhalt
  useEffect(() => {
    const taste = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        feld.current?.focus();
        feld.current?.select();
      }
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, []);

  const wort = text.trim();
  const { gruppen, flach } = useMemo(() => {
    if (!wort) {
      const zuletzt = zuletztLesen();
      return { gruppen: zuletzt.length ? [{ titel: "Zuletzt geöffnet", anzahl: zuletzt.length, treffer: zuletzt, mehr: 0 }] : [], flach: zuletzt };
    }
    const q = wort.toLowerCase();
    const out = [];
    const flachListe = [];
    for (const name of ["Projekte", "Wellen"]) {
      const treffer = index.filter((x) => x.gruppe === name && x.suchtext.includes(q));
      if (!treffer.length) continue;
      const gezeigt = treffer.slice(0, JE_GRUPPE);
      out.push({ titel: name, anzahl: treffer.length, treffer: gezeigt, mehr: treffer.length - gezeigt.length });
      flachListe.push(...gezeigt);
    }
    return { gruppen: out, flach: flachListe };
  }, [wort, index, aktiv]); // eslint-disable-line react-hooks/exhaustive-deps

  function oeffnen(t) {
    if (!t) return;
    zuletztMerken({ gruppe: t.gruppe, schild: t.schild, titel: t.titel, unter: t.unter, pfad: t.pfad });
    setText("");
    setAktiv(false);
    feld.current?.blur();
    navigate(t.pfad);
  }

  function tasten(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMarkiert((m) => Math.min(flach.length - 1, m + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMarkiert((m) => Math.max(0, m - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      oeffnen(flach[markiert]);
    } else if (e.key === "Escape") {
      // Esc leert erst die Eingabe und schließt dann
      if (text) setText("");
      else feld.current?.blur();
    }
  }

  let laufend = -1;
  return (
    <div className="relative w-full max-w-[720px]">
      <div
        className={cn(
          "flex items-center gap-2 h-[38px] px-3 rounded-[3px] border transition-colors",
          aktiv ? "bg-background border-foreground" : "bg-muted border-border"
        )}
      >
        <Search className={cn("w-4 h-4 shrink-0", aktiv ? "text-primary" : "text-muted-foreground")} />
        <input
          ref={feld}
          value={text}
          onChange={(e) => { setText(e.target.value); setMarkiert(0); }}
          onFocus={() => { setAktiv(true); setMarkiert(0); indexLaden(); }}
          onBlur={() => setAktiv(false)}
          onKeyDown={tasten}
          placeholder="Projekt, Kunde, Welle …"
          aria-label="Suche"
          className="flex-1 min-w-0 bg-transparent outline-none text-[13.5px] text-foreground placeholder:text-muted-foreground"
        />
        <span className="text-[10.5px] text-muted-foreground shrink-0 hidden sm:inline">⌘K</span>
      </div>

      {aktiv && (wort || gruppen.length > 0) && (
        <div
          className="absolute left-0 right-0 top-[44px] z-40 bg-background border border-foreground rounded-[3px] overflow-auto shadow-md"
          style={{ maxHeight: "min(62vh, 470px)" }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {gruppen.length === 0 ? (
            <div className="px-[14px] py-4">
              <p className="text-[13.5px] text-foreground">Nichts zu „{wort}“ gefunden.</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Versuch es mit dem Kundennamen oder einem Teil des Projektnamens.</p>
            </div>
          ) : (
            gruppen.map((g) => (
              <div key={g.titel}>
                <div className="flex items-center justify-between px-[14px] pt-3 pb-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-[1.8px] text-primary">{g.titel}</span>
                  <span className="text-[10.5px] text-muted-foreground">{g.anzahl}</span>
                </div>
                {g.treffer.map((t) => {
                  laufend += 1;
                  const nr = laufend;
                  return (
                    <button
                      key={t.pfad}
                      type="button"
                      onMouseEnter={() => setMarkiert(nr)}
                      onClick={() => oeffnen(t)}
                      className={cn(
                        "w-full flex items-center gap-3 text-left px-[14px] py-2 border-l-[2.5px]",
                        nr === markiert ? "border-primary bg-primary/[0.06]" : "border-transparent"
                      )}
                    >
                      <span className="w-12 shrink-0 text-[9px] font-bold uppercase text-muted-foreground">{t.schild}</span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold text-foreground truncate">{hervorheben(t.titel, wort)}</span>
                        {t.unter && <span className="block text-[12px] text-muted-foreground truncate">{hervorheben(t.unter, wort)}</span>}
                      </span>
                    </button>
                  );
                })}
                {g.mehr > 0 && <p className="px-[14px] pb-2 text-[11.5px] text-muted-foreground">… {g.mehr} weitere in {g.titel}</p>}
              </div>
            ))
          )}
          <div className="border-t px-[14px] py-1.5 text-[10.5px] text-muted-foreground">↑↓ wählen · ↵ öffnen · Esc schließen</div>
        </div>
      )}
    </div>
  );
}
