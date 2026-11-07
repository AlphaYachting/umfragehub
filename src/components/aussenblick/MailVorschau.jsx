import React, { useMemo } from "react";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { inZwischenablage } from "@/lib/verwaltung";

// Vorschau des Entwurfs so, wie ihn die Empfängerin liest: Betreff, Anrede, Absätze,
// die fünf Fragen als Liste, Link und Code hervorgehoben, Signatur. Zwei Knöpfe:
// Text kopieren, im Mailprogramm öffnen (mailto — Alfons verschickt selbst, die Software nie).

function absaetze(text) {
  const zeilen = String(text || "").replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  while (i < zeilen.length) {
    const z = zeilen[i];
    if (!z.trim()) { i++; continue; }
    if (/^\s*\d+[.)]\s+/.test(z)) {
      const li = [];
      while (i < zeilen.length && /^\s*\d+[.)]\s+/.test(zeilen[i])) { li.push(zeilen[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      out.push({ art: "liste", li });
      continue;
    }
    if (/andifragt\.at|\[CODE\]|Code[:\s]/i.test(z) && z.length < 140) { out.push({ art: "link", text: z.trim() }); i++; continue; }
    // Absatz: aufeinanderfolgende Zeilen bis zur Leerzeile; kurze Zeilen (Anrede, Gruß, Signatur) bleiben eigene Zeilen
    const p = [];
    while (i < zeilen.length && zeilen[i].trim() && !/^\s*\d+[.)]\s+/.test(zeilen[i])) { p.push(zeilen[i].trim()); i++; }
    const kurz = p.every((s) => s.length < 60);
    out.push({ art: kurz ? "zeilen" : "p", zeilen: p });
  }
  return out;
}

function markiere(text) {
  const teile = String(text).split(/(\[CODE\]|\[FRÜHERER KONTAKT — prüfen\])/);
  return teile.map((t, i) => /^\[/.test(t) ? <mark key={i} className="bg-status-attention-surface text-status-attention px-1 rounded font-semibold">{t}</mark> : <React.Fragment key={i}>{t}</React.Fragment>);
}

export default function MailVorschau({ art, betreff, text, an, anName, codeFehlt }) {
  const bloecke = useMemo(() => absaetze(text), [text]);
  if (!text) return null;
  const ganz = art === "mail" ? `Betreff: ${betreff || ""}\n\n${text}` : text;
  const mailto = `mailto:${encodeURIComponent(an || "")}?subject=${encodeURIComponent(betreff || "")}&body=${encodeURIComponent(text || "")}`;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-muted/30 flex flex-wrap items-center gap-2">
        <p className="text-label uppercase text-muted-foreground flex-1">So liest es {anName ? anName.split(" ").slice(-1)[0] : "die Empfängerin"}</p>
        <Button type="button" size="sm" variant="outline" onClick={() => { inZwischenablage(ganz); toast.success("Entwurf kopiert."); }}><Copy className="w-3.5 h-3.5" /> Kopieren</Button>
        {art === "mail" && (
          <Button type="button" size="sm" variant="outline" asChild disabled={codeFehlt}>
            <a href={mailto} title={codeFehlt ? "Erst nach der Freigabe — der Code fehlt noch" : "Öffnet den Entwurf im Mailprogramm; verschickt wird erst dort, von dir"} onClick={(e) => { if (codeFehlt) { e.preventDefault(); toast.error("Noch kein Code — erst freigeben, dann verschicken."); } }}>
              <Mail className="w-3.5 h-3.5" /> Im Mailprogramm öffnen
            </a>
          </Button>
        )}
      </div>
      <div className="px-6 py-5 max-w-[680px]">
        {art === "mail" && (
          <div className="mb-4 pb-3 border-b space-y-0.5">
            {(an || anName) && <p className="text-meta text-muted-foreground">An: <span className="text-foreground">{anName}{an ? ` <${an}>` : ""}</span></p>}
            <p className="text-meta text-muted-foreground">Betreff: <span className="text-foreground font-semibold">{betreff || <span className="text-muted-foreground">— noch kein Betreff —</span>}</span></p>
          </div>
        )}
        <div className="space-y-3.5 text-[14.5px] leading-[1.65] text-foreground">
          {bloecke.map((b, i) => {
            if (b.art === "liste") return <ol key={i} className="list-decimal pl-6 space-y-1.5">{b.li.map((t, j) => <li key={j}>{markiere(t)}</li>)}</ol>;
            if (b.art === "link") return <p key={i} className={cn("rounded-md border px-3 py-2 font-semibold tabular-nums", codeFehlt ? "border-status-attention/40 bg-status-attention-surface/40" : "bg-muted/40")}>{markiere(b.text)}</p>;
            if (b.art === "zeilen") return <p key={i}>{b.zeilen.map((z, j) => <React.Fragment key={j}>{markiere(z)}{j < b.zeilen.length - 1 && <br />}</React.Fragment>)}</p>;
            return <p key={i}>{markiere(b.zeilen.join(" "))}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
