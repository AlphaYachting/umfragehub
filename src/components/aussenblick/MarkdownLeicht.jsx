import React, { useMemo } from "react";

// Leichter Markdown-Leser für Register und Befund aus dem Scan: Überschriften,
// Tabellen, Listen, Absätze, **fett**, `code`, Links. Keine Abhängigkeit, keine HTML-Ausgabe.

function inline(text, key) {
  const teile = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g;
  let letzte = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > letzte) teile.push(text.slice(letzte, m.index));
    const t = m[0];
    if (t.startsWith("**")) teile.push(<strong key={`${key}-${i++}`} className="font-semibold text-foreground">{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) teile.push(<code key={`${key}-${i++}`} className="px-1 rounded bg-muted text-[12px]">{t.slice(1, -1)}</code>);
    else if (t.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t);
      teile.push(<a key={`${key}-${i++}`} href={mm[2]} target="_blank" rel="noopener noreferrer" className="underline text-primary break-all">{mm[1]}</a>);
    } else teile.push(<a key={`${key}-${i++}`} href={t} target="_blank" rel="noopener noreferrer" className="underline text-primary break-all">{t}</a>);
    letzte = m.index + t.length;
  }
  if (letzte < text.length) teile.push(text.slice(letzte));
  return teile;
}

function zellen(zeile) {
  return zeile.replace(/^\|/, "").replace(/\|$/, "").split("|").map((z) => z.trim());
}

export default function MarkdownLeicht({ text }) {
  const bloecke = useMemo(() => {
    const zeilen = String(text || "").split(/\r?\n/);
    const out = [];
    let i = 0;
    while (i < zeilen.length) {
      const z = zeilen[i];
      if (!z.trim()) { i++; continue; }
      const h = /^(#{1,4})\s+(.*)$/.exec(z);
      if (h) { out.push({ art: "h", stufe: h[1].length, text: h[2] }); i++; continue; }
      if (z.trim().startsWith("|")) {
        const tz = [];
        while (i < zeilen.length && zeilen[i].trim().startsWith("|")) { tz.push(zeilen[i]); i++; }
        const kopf = zellen(tz[0]);
        const koerper = tz.slice(1).filter((r) => !/^\|?\s*:?-{2,}/.test(r)).map(zellen);
        out.push({ art: "tabelle", kopf, koerper });
        continue;
      }
      if (/^\s*([-*]|\d+\.)\s+/.test(z)) {
        const li = [];
        const nummeriert = /^\s*\d+\./.test(z);
        while (i < zeilen.length && /^\s*([-*]|\d+\.)\s+/.test(zeilen[i])) {
          let t = zeilen[i].replace(/^\s*([-*]|\d+\.)\s+/, "");
          i++;
          // Fortsetzungszeilen (eingerückt) gehören zum Punkt
          while (i < zeilen.length && /^\s{2,}\S/.test(zeilen[i]) && !/^\s*([-*]|\d+\.)\s+/.test(zeilen[i])) { t += " " + zeilen[i].trim(); i++; }
          li.push(t);
        }
        out.push({ art: "liste", nummeriert, li });
        continue;
      }
      if (z.trim() === "---") { out.push({ art: "linie" }); i++; continue; }
      // Absatz bis zur Leerzeile
      const p = [];
      while (i < zeilen.length && zeilen[i].trim() && !/^(#{1,4})\s+/.test(zeilen[i]) && !zeilen[i].trim().startsWith("|") && !/^\s*([-*]|\d+\.)\s+/.test(zeilen[i])) { p.push(zeilen[i].trim()); i++; }
      out.push({ art: "p", text: p.join(" ") });
    }
    return out;
  }, [text]);

  if (!text) return <p className="text-meta text-muted-foreground">Noch nichts hinterlegt.</p>;

  return (
    <div className="space-y-3 text-body text-foreground">
      {bloecke.map((b, i) => {
        if (b.art === "h") {
          const cls = b.stufe <= 1 ? "text-page" : b.stufe === 2 ? "text-object pt-2" : "text-value pt-1";
          return <p key={i} className={cls}>{inline(b.text, i)}</p>;
        }
        if (b.art === "p") return <p key={i} className="leading-relaxed">{inline(b.text, i)}</p>;
        if (b.art === "linie") return <hr key={i} className="border-border" />;
        if (b.art === "liste") {
          const Tag = b.nummeriert ? "ol" : "ul";
          return (
            <Tag key={i} className={b.nummeriert ? "list-decimal pl-5 space-y-1" : "list-disc pl-5 space-y-1"}>
              {b.li.map((t, j) => <li key={j}>{inline(t, `${i}-${j}`)}</li>)}
            </Tag>
          );
        }
        if (b.art === "tabelle") {
          return (
            <div key={i} className="overflow-x-auto border rounded-lg">
              <table className="w-full text-[12.5px] leading-snug">
                <thead className="bg-muted/60">
                  <tr>{b.kopf.map((k, j) => <th key={j} className="text-left px-2.5 py-1.5 font-semibold whitespace-nowrap">{inline(k, `${i}-k${j}`)}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {b.koerper.map((r, j) => (
                    <tr key={j} className="align-top">
                      {r.map((c, m) => <td key={m} className="px-2.5 py-1.5 min-w-[80px]">{inline(c, `${i}-${j}-${m}`)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
