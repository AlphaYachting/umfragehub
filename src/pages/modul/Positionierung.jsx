import React, { useState } from "react";
import {
  F, BREITE, H1_STIL, H2_STIL, LEAD_STIL, TEXT_STIL, MARKENPRUEFSTAND, mailAn,
  Etikett, Hauptknopf, FuerDich, RundesFoto, Modulseite, Beispielhinweis,
} from "@/components/oeffentlich/Oeffentlich";
import Faq from "@/components/oeffentlich/Faq";

// Modulseite 01 Positionierung (für Inhaber, Geschäftsführung, Marketing).
// Eigener Look: weiß, Kontur-Schrift, dunkler Umschalter Selbstbild gegen Kundenbild.

const BETREFF = "andi fragt. Positionierung";

const DATEN = [
  { name: "Qualität", i: 92, a: 74 },
  { name: "Erfahrung und Tradition", i: 88, a: 41 },
  { name: "Persönliche Betreuung", i: 55, a: 94 },
  { name: "Schnelle Reaktion", i: 38, a: 89 },
  { name: "Preis", i: 30, a: 22 },
];

const KOSTEN = [
  { heute: "Du verhandelst über den Preis", danach: "Kunden zahlen für das, was dich ausmacht.", text: "Wer seinen echten Unterschied kennt und klar benennt, muss ihn nicht mit Rabatt ersetzen." },
  { heute: "Werbung, die verpufft", danach: "Jeder Euro erzählt dieselbe Geschichte.", text: "Website, Anzeige und Angebot sprechen dieselbe Sprache. Das spart Budget und bleibt hängen." },
  { heute: "Die falschen Anfragen", danach: "Anfragen von Kunden, die zu dir passen.", text: "Eine klare Positionierung zieht die Richtigen an und hält die Schnäppchenjäger fern." },
];

// Die ANDI-Methode: vier Prüfsteine mit den Leitfragen vom Markenprüfstand (werbe-agentur-graz.at).
// Nur das Was, nicht das Wie: die Gewichtung bleibt das Handwerk von Rittler & Co.
const ANDI = [
  { b: "A", wort: "Aufmerksamkeit", frage: "Was zieht an?", text: "Welche Probleme und Wünsche deiner Kunden du aufgreifst und wo deine Marke sofort Relevanz erzeugt." },
  { b: "N", wort: "Nutzen", frage: "Was hat der Kunde davon?", text: "Welche konkreten Vorteile wirklich zählen: Zeit, Kosten, Service oder Betreuung." },
  { b: "D", wort: "Differenzierung", frage: "Warum gerade du?", text: "Was dich einzigartig macht, etwa Herkunft, besonderes Können oder die Art, wie du arbeitest." },
  { b: "I", wort: "Identität", frage: "Wofür stehst du?", text: "Welche Werte dich unverwechselbar machen, über deine Produkte hinaus." },
];

const KREISE = [
  { nr: "1", wer: "Geschäftsführung", text: "Wir beginnen mit deinem Bild: Ziele, Stärken, Wunschkunden.", frage: "Wofür sollen uns Kunden in drei Jahren kennen?" },
  { nr: "2", wer: "Team", text: "Die Menschen, die täglich mit Kunden arbeiten, wissen oft mehr als jede Strategie.", frage: "Wofür bedanken sich Kunden bei dir am häufigsten?" },
  { nr: "3", wer: "Kunden", text: "Das Bild von außen zeigt, was wirklich ankommt, und was fehlt.", frage: "Warum hast du dich damals für uns entschieden?" },
];

function Umschalter({ innen, setInnen }) {
  const knopf = (aktiv) => ({
    minHeight: 44,
    padding: "0 22px",
    border: 0,
    borderRadius: 999,
    background: aktiv ? F.akzent : "transparent",
    color: aktiv ? "#ffffff" : F.hellAufDunkel,
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  });
  return (
    <div role="group" aria-label="Sicht wählen" className="mt-7 inline-flex flex-wrap p-1 rounded-[28px]" style={{ background: "#3d3d3d" }}>
      <button type="button" aria-pressed={innen} onClick={() => setInnen(true)} style={knopf(innen)}>So siehst du dich</button>
      <button type="button" aria-pressed={!innen} onClick={() => setInnen(false)} style={knopf(!innen)}>So sehen dich Kunden</button>
    </div>
  );
}

export default function Positionierung() {
  const [innen, setInnen] = useState(true);

  return (
    <Modulseite titel="Positionierung | andi fragt." modul="Positionierung">
      {/* Einstieg: typografisch, mit rundem Foto */}
      <section className={`${BREITE} pt-20 pb-[72px] flex flex-wrap items-center gap-x-14 gap-y-12`}>
        <div className="flex-[3_1_620px] min-w-0">
          <Etikett>Modul 01 Positionierung</Etikett>
          <h1 className="mt-4" style={{ ...H1_STIL, letterSpacing: "-0.015em" }}>
            Du bist besser
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${F.dunkel}` }}>als dein Auftritt.</span>
          </h1>
          <div className="mt-9 flex flex-wrap items-end gap-x-16 gap-y-8">
            <p className="flex-[1_1_480px]" style={{ ...LEAD_STIL, color: F.daempft }}>
              Deine Kunden kaufen aus Gründen, die auf deiner Website nicht stehen. Dein Team kennt sie, deine
              Stammkunden auch. Wir holen diese Gründe im Interview ab und machen daraus eine Positionierung, für die
              man <strong className="font-semibold" style={{ color: F.text }}>mehr bezahlt.</strong>
            </p>
            <Hauptknopf href={mailAn(BETREFF)}>Erstgespräch vereinbaren</Hauptknopf>
          </div>
          <FuerDich rollen={["Inhaber", "Geschäftsführung", "Marketing"]} />
        </div>
        <div className="flex-[2_1_300px] min-w-0 flex justify-center">
          <RundesFoto
            src="/bilder/positionierung.webp"
            alt="Unternehmer im Gespräch mit einem Berater in seiner Werkstatt"
            groesse={320}
            ringe={[{ abstand: 14, farbe: F.dunkel }, { abstand: 30, farbe: F.hauchRand }]}
          />
        </div>
      </section>

      {/* Die ANDI-Methode: bewusst weit oben, gleich nach dem Einstieg */}
      <section id="andi" aria-labelledby="andi-titel" style={{ background: F.hauch }}>
        <div className={`${BREITE} py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-5">
            <div className="flex-[1_1_520px] min-w-0">
              <Etikett>Die ANDI-Methode</Etikett>
              <h2 id="andi-titel" className="mt-3" style={H2_STIL}>
                Vier Prüfsteine <span style={{ color: F.akzent }}>für deine Marke.</span>
              </h2>
            </div>
            <p className="flex-[1_1_380px] min-w-0" style={{ ...TEXT_STIL, color: F.daempft }}>
              Alles, was Geschäftsführung, Team und Kunden im Interview sagen, prüfen wir an vier Fragen. Entwickelt aus
              über 500 Markenprojekten. Wie wir gewichten, bleibt unser Handwerk.
            </p>
          </div>
          <div className="mt-12 grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
            {ANDI.map((s) => (
              <div key={s.b} className="p-7 rounded-[20px] bg-white">
                <span aria-hidden="true" className="block text-[80px] font-black leading-[0.8]" style={{ color: F.akzent }}>{s.b}</span>
                <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em]" style={{ color: F.etikett }}>{s.wort}</h3>
                <p className="mt-2 text-[22px] font-bold leading-[1.25]">{s.frage}</p>
                <p className="mt-3 leading-[1.6]" style={{ color: F.daempft }}>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[760px] text-lg leading-[1.6] font-semibold">
            In der Präsentation siehst du für jeden Prüfstein, wo deine Marke stark ist und wo dein Auftritt hinter dem
            zurückbleibt, was Team und Kunden erleben.
          </p>
        </div>
      </section>

      {/* Interaktiv: Selbstbild gegen Kundenbild */}
      <section style={{ background: F.dunkel, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_360px] min-w-0">
            <Etikett dunkel>Die Lücke</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Was du erzählst. <span style={{ color: F.akzent }}>Was ankommt.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.hellAufDunkel }}>
              So sieht eine typische Lücke aus. Schalte um und sieh, wie unterschiedlich dieselbe Firma von innen und
              außen wirkt.
            </p>
            <Umschalter innen={innen} setInnen={setInnen} />
            <Beispielhinweis dunkel />
          </div>
          <div className="flex-[1_1_480px] min-w-0 rounded-[20px] p-8" style={{ background: F.dunkelKarte }}>
            <p aria-live="polite" className="text-lg font-bold">
              {innen ? "Was wir über uns erzählen" : "Warum Kunden wirklich bei uns kaufen"}
            </p>
            <ul className="mt-5 flex flex-col gap-[18px]">
              {DATEN.map((d) => {
                const wert = innen ? d.i : d.a;
                const diff = d.a - d.i;
                let notiz = `${wert} von 100`;
                let notizFarbe = F.hellAufDunkel;
                if (!innen && diff >= 30) { notiz = "unterschätzt"; notizFarbe = "#45d085"; }
                if (!innen && diff <= -30) { notiz = "überschätzt"; notizFarbe = F.etikettDunkel; }
                return (
                  <li key={d.name}>
                    <div className="flex justify-between gap-3 text-[15px] font-semibold">
                      <span>{d.name}</span>
                      <span style={{ color: notizFarbe }}>{notiz}</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full overflow-hidden" style={{ background: "#4a4a4a" }}>
                      <div
                        className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${wert}%`, background: innen ? F.hellAufDunkel : F.akzent }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 pt-[18px] text-[15px] leading-[1.55]" style={{ borderTop: "1px solid #4a4a4a", color: "#ffd3dd" }}>
              {innen
                ? "Die Website spricht von Tradition und Qualität. Klingt gut, sagt aber jeder."
                : "Gekauft wird wegen Betreuung und Tempo. Genau das kommt im Auftritt kaum vor."}
            </p>
          </div>
        </div>
      </section>

      {/* Was die Lücke kostet */}
      <section className={`${BREITE} pt-[104px]`}>
        <h2 className="max-w-[760px]" style={H2_STIL}>
          Diese Lücke <span style={{ color: F.akzent }}>kostet Geld.</span> Jeden Tag.
        </h2>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]" style={{ borderTop: `2px solid ${F.dunkel}` }}>
          {KOSTEN.map((k) => (
            <article key={k.danach} className="pt-[30px] pr-7 pb-[34px]" style={{ borderBottom: `1px solid ${F.linie}` }}>
              <p
                className="text-[15px] font-semibold"
                style={{ color: F.daempft, textDecoration: "line-through", textDecorationColor: F.akzent, textDecorationThickness: 2 }}
              >
                {k.heute}
              </p>
              <h3 className="mt-3.5 text-2xl font-bold leading-[1.2]">{k.danach}</h3>
              <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>{k.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Drei Kreise: von innen nach außen */}
      <section className={`${BREITE} pt-28 flex flex-wrap items-center gap-x-20 gap-y-14`}>
        <div className="flex-[1_1_440px] min-w-0 flex justify-center">
          <div
            role="img"
            aria-label="Drei Kreise von innen nach außen: Geschäftsführung, Team, Kunden"
            className="relative"
            style={{ width: 460, maxWidth: "100%", aspectRatio: "1 / 1" }}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: F.hauch, border: `2px solid ${F.hauchRand}` }} />
            <div className="absolute rounded-full" style={{ inset: "17%", background: "#ffd3dd" }} />
            <div className="absolute rounded-full flex items-center justify-center" style={{ inset: "34%", background: F.dunkel }}>
              <span className="-mt-[18px] text-[44px] font-black uppercase text-white">Du</span>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.1em]" style={{ top: "5%", color: "#a80f39" }}>Kunden</span>
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold uppercase tracking-[0.1em]" style={{ top: "21%", color: "#a80f39" }}>Team</span>
            <span
              className="absolute left-1/2 px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap text-white"
              style={{ bottom: "36%", transform: "translate(-50%, 50%)", background: F.dunkel }}
            >
              Geschäftsführung
            </span>
          </div>
        </div>
        <div className="flex-[1_1_420px] min-w-0">
          <Etikett>Von innen nach außen</Etikett>
          <h2 className="mt-3" style={H2_STIL}>
            Drei Kreise, <span style={{ color: F.akzent }}>ein Bild.</span>
          </h2>
          <ol className="mt-7 flex flex-col gap-[22px]">
            {KREISE.map((r) => (
              <li key={r.nr} className="grid grid-cols-[44px_minmax(0,1fr)] gap-4">
                <span
                  aria-hidden="true"
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black"
                  style={{ border: `2px solid ${F.akzent}`, color: F.etikett }}
                >
                  {r.nr}
                </span>
                <div>
                  <h3 className="text-[19px] font-bold">{r.wer}</h3>
                  <p className="mt-1 leading-[1.55]" style={{ color: F.daempft }}>{r.text}</p>
                  <p className="mt-2 font-bold italic">{r.frage}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mensch statt Maschine */}
      <section className={`${BREITE} mt-28`}>
        <div className="max-w-[860px] py-2 pl-8" style={{ borderLeft: `6px solid ${F.akzent}` }}>
          <p className="text-[clamp(22px,2.6vw,30px)] leading-[1.3] font-bold">
            Eine Software zählt Antworten. Wir lesen sie. Die beste Positionierung steckt selten in der häufigsten
            Antwort, sondern in dem einen Satz, den drei Kunden unabhängig voneinander fast gleich sagen.
          </p>
          <p className="mt-4 text-[15px] font-semibold" style={{ color: F.daempft }}>So arbeiten wir bei Rittler &amp; Co</p>
        </div>
      </section>

      {/* Ergebnis: Positionierung auf einer Seite */}
      <section className="mt-28" style={{ background: F.grau }}>
        <div className={`${BREITE} py-24 flex flex-wrap items-center gap-x-[72px] gap-y-12`}>
          <div className="flex-[1_1_380px] min-w-0">
            <Etikett>Das Ergebnis</Etikett>
            <h2 className="mt-3" style={H2_STIL}>
              Eine Seite, <span style={{ color: F.akzent }}>die alles steuert.</span>
            </h2>
            <p className="mt-5" style={{ ...TEXT_STIL, color: F.daempft }}>
              Neben Handout und Präsentation bekommst du deine Positionierung auf einer Seite. Für Website, Angebot,
              Messestand und Stellenanzeige. Damit alle dieselbe Geschichte erzählen.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5 font-semibold">
              <li>Analyse-Handout mit allen Abweichungen</li>
              <li>Präsentation bei dir, mit Zeit für Diskussion</li>
              <li>Positionierung auf einer Seite</li>
              <li>Empfehlungen für die nächsten 90 Tage</li>
            </ul>
          </div>
          <div className="flex-[1_1_440px] min-w-0 flex justify-center">
            <div
              role="img"
              aria-label="Beispiel einer Positionierung auf einer Seite"
              className="bg-white rounded-md px-[34px] py-9"
              style={{ width: 420, maxWidth: "100%", boxShadow: "0 30px 60px -30px rgba(45,45,45,0.45)", transform: "rotate(-2deg)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: F.etikett }}>Beispiel</p>
              <p className="mt-3.5 text-xs font-semibold" style={{ color: F.daempft }}>Unser Versprechen</p>
              <p className="mt-1 text-[22px] leading-[1.2] font-bold">Wir sind die, die zurückrufen.</p>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>Drei Beweise</p>
              <div className="mt-2 flex flex-col gap-2">
                {["92%", "78%", "85%"].map((b) => (
                  <div key={b} className="h-2.5 rounded" style={{ width: b, background: F.hauchRand }} />
                ))}
              </div>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>So klingen wir</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["direkt", "handfest", "regional"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: F.dunkel }}>{t}</span>
                ))}
              </div>
              <p className="mt-[18px] text-xs font-semibold" style={{ color: F.daempft }}>Das sagen wir nicht mehr</p>
              <p className="mt-1 text-[15px] font-semibold" style={{ color: F.daempft, textDecoration: "line-through", textDecorationColor: F.akzent }}>
                Qualität und Service seit 1987
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Markenprüfstand */}
      <section className={`${BREITE} pt-24`}>
        <div className="rounded-3xl px-11 py-10 flex flex-wrap items-center justify-between gap-x-12 gap-y-6" style={{ border: `2px solid ${F.dunkel}` }}>
          <div className="flex-[1_1_520px] min-w-0">
            <Etikett>Der nächste Schritt</Etikett>
            <h3 className="mt-2.5 text-[28px] leading-[1.15] font-bold">Aus der Erkenntnis wird ein Auftritt.</h3>
            <p className="mt-2.5 leading-[1.6]" style={{ color: F.daempft }}>
              Das Interview ist der Kern des ANDI-Markenprüfstands von Rittler &amp; Co. Auf Wunsch setzen wir die
              Positionierung gleich um, von der Botschaft bis zur Website.
            </p>
          </div>
          <a
            href={MARKENPRUEFSTAND}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[48px] px-6 rounded text-sm font-semibold"
            style={{ border: `1px solid ${F.dunkel}`, color: F.text, textDecoration: "none" }}
          >
            Zum Markenprüfstand
          </a>
        </div>
      </section>

      {/* Häufige Fragen */}
      <Faq seite="positionierung" look="weiss" />

      {/* Abschluss */}
      <section className="mt-[104px]" style={{ background: F.akzent, color: "#ffffff" }}>
        <div className={`${BREITE} py-[88px] flex flex-wrap items-center justify-between gap-x-12 gap-y-7`}>
          <h2 className="flex-[1_1_560px]" style={H2_STIL}>Finde heraus, wofür man dich wirklich bezahlt.</h2>
          <Hauptknopf href={mailAn(BETREFF)} farbe={F.dunkel}>Unverbindlich anfragen</Hauptknopf>
        </div>
      </section>
    </Modulseite>
  );
}
