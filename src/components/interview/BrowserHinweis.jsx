import React, { useMemo, useState } from "react";
import { Mic, Copy, Check } from "lucide-react";
import { spracheingabeCheck, browserTestFall } from "@/lib/browserCheck";

// Hinweis auf der Startseite: Wenn die Spracheingabe in diesem Browser nicht (sicher) funktioniert,
// empfehlen wir den passenden Browser und bieten den Link zum Kopieren an.
// Bewusst kein Sperrbildschirm — wer hier weitermacht, kann alles eintippen.
export default function BrowserHinweis({ ansprache, testName }) {
  const check = useMemo(() => spracheingabeCheck(browserTestFall(testName) || undefined), [testName]);
  const [kopiert, setKopiert] = useState(false);
  const [linkZeigen, setLinkZeigen] = useState(false);

  if (check.status === "ok") return null;

  const sie = ansprache === "sie";
  // Der Vorschau-Zusatz (?test=1&browser=…) gehört nicht in den kopierten Link
  const link = (() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("browser");
      return url.toString();
    } catch {
      return window.location.href;
    }
  })();

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(link);
      setKopiert(true);
    } catch {
      // Zwischenablage gesperrt (ältere oder eingebettete Browser): Link zum Markieren anzeigen
      setLinkZeigen(true);
    }
  }

  const titel = check.inApp
    ? `Tipp: Im Browser ${sie ? "können Sie" : "kannst du"} Antworten auch einsprechen`
    : `Tipp: In ${check.empfehlung} ${sie ? "können Sie" : "kannst du"} Antworten auch einsprechen`;

  let grund;
  if (check.inApp) {
    grund = `${sie ? "Sie haben" : "Du hast"} den Link in einer App geöffnet — dort funktioniert die Spracheingabe oft nicht.`;
  } else if (check.status === "fehlt") {
    grund = `${check.browserName || "Dieser Browser"} hat keine Spracheingabe.`;
  } else {
    grund = `In ${check.browserName || "diesem Browser"} funktioniert die Spracheingabe nicht zuverlässig.`;
  }

  return (
    <div
      role="note"
      style={{
        border: "1.5px solid var(--farbe-rahmen)",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 22,
        background: "var(--farbe-bg)",
        color: "var(--farbe-text)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--farbe-grau)", color: "var(--farbe-text)" }}
          aria-hidden="true"
        >
          <Mic size={18} />
        </span>
        <div className="flex-1" style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.35 }}>{titel}</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--farbe-text-daempft)", marginTop: 4 }}>
            {grund}{" "}
            {sie
              ? `Wenn Sie bei den offenen Fragen lieber sprechen als tippen: Link kopieren und in ${check.empfehlung} öffnen. Tippen geht hier genauso.`
              : `Wenn du bei den offenen Fragen lieber sprichst als tippst: Link kopieren und in ${check.empfehlung} öffnen. Tippen geht hier genauso.`}
          </p>
          <button
            type="button"
            onClick={kopieren}
            className="inline-flex items-center gap-2"
            style={{
              marginTop: 10,
              minHeight: 44,
              padding: "0 14px",
              border: "1.5px solid var(--farbe-rahmen)",
              borderRadius: 9,
              fontSize: 14.5,
              fontWeight: 600,
              background: "var(--farbe-bg)",
              color: "var(--farbe-text)",
            }}
          >
            {kopiert ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {kopiert ? "Link kopiert" : "Link kopieren"}
          </button>
          {linkZeigen && (
            <input
              readOnly
              value={link}
              onFocus={(e) => e.target.select()}
              aria-label="Link zur Befragung"
              style={{
                display: "block",
                width: "100%",
                marginTop: 8,
                minHeight: 44,
                padding: "0 10px",
                border: "1px solid var(--farbe-rahmen)",
                borderRadius: 8,
                fontSize: 13,
                background: "var(--farbe-bg)",
                color: "var(--farbe-text)",
              }}
            />
          )}
          <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--farbe-text-daempft)", marginTop: 8 }}>
            Diese Prüfung läuft nur auf {sie ? "Ihrem" : "deinem"} Gerät — es wird nichts davon gespeichert.
          </p>
        </div>
      </div>
    </div>
  );
}
