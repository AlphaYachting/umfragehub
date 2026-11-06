import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Außenblick-Modul: schreibt den Kontaktbrief (Post) oder die Kontakt-E-Mail eines Ziels
// mit dem Sprachmodell der Plattform. Nur für Admins.
//
// Die Funktion schreibt nichts in die Datenbank und verschickt nichts. Der Text kommt in
// die Zielkarte zurück; Alfons liest, ändert und speichert von Hand. Sie gehört zum
// Außenblick-Modul und rührt keine Entität der Befragungssoftware an.

const ABSENDER = {
  name: 'Alfons Rittler',
  firma: 'Rittler & Co · andi fragt.',
  telefon: '+43 316 57 01 17',
  mail: 'office@rittler.co',
  ort: 'Graz',
};
const PORTAL = 'andifragt.at/aussenblick';
const SPERRLISTE = ['falsch', 'Fehler', 'sollten', 'müssten', 'besser', 'anonym', 'digital', 'Methode', 'KI', 'Software', 'Tool', 'Analyse'];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'nicht_berechtigt' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const zielId = String(body.zielId || '');
    const art = body.art === 'mail' ? 'mail' : 'post';
    const hinweis = String(body.hinweis || '').slice(0, 800);
    if (!zielId) return Response.json({ error: 'zielId fehlt' }, { status: 400 });

    const db = base44.asServiceRole.entities;
    const ziel = await db.Ziel.get(zielId);
    if (!ziel) return Response.json({ error: 'ziel_fehlt' }, { status: 404 });
    const fragen = (await db.Portalfrage.filter({ zielId })).sort((a, b) => (a.nummer || 0) - (b.nummer || 0));
    const einladungen = await db.Einladung.filter({ zielId });
    const haupt = einladungen.find((e) => e.art !== 'welle');

    const prompt = bauePrompt({ ziel, fragen, code: haupt?.code || '<CODE — entsteht mit der Freigabe>', art, hinweis });
    const ergebnis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          betreff: { type: 'string' },
          text: { type: 'string' },
          spiegelung: { type: 'string' },
        },
        required: ['text', 'spiegelung'],
      },
    });
    const r = typeof ergebnis === 'string' ? sicherParsen(ergebnis) : (ergebnis || {});
    const text = String(r.text || '').trim();
    if (!text) return Response.json({ error: 'leer' }, { status: 502 });

    // Sperrwörter nachprüfen — das Modell soll sie meiden, wir melden, wenn eines durchrutscht
    const treffer = SPERRLISTE.filter((w) => new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${w}([^A-Za-zÄÖÜäöüß]|$)`).test(text));
    return Response.json({
      art,
      betreff: String(r.betreff || '').trim(),
      text,
      spiegelung: String(r.spiegelung || '').trim(),
      sperrwoerter: treffer,
    });
  } catch (error) {
    console.error('aussenblickBrief:', error?.message || error);
    return Response.json({ error: 'serverfehler' }, { status: 500 });
  }
}

function sicherParsen(s) {
  try { return JSON.parse(s); } catch (_) {
    const m = /\{[\s\S]*\}/.exec(s);
    if (m) { try { return JSON.parse(m[0]); } catch (_) { /* unten */ } }
    return { text: s };
  }
}

function sieForm(frage) {
  // Die Portalfragen stehen in der Ansprache des Unternehmens (oft du); der erste Kontakt ist Sie.
  return String(frage || '')
    .replace(/\bdeine\b/g, 'Ihre').replace(/\bDeine\b/g, 'Ihre')
    .replace(/\bdeinen\b/g, 'Ihren').replace(/\bdeinem\b/g, 'Ihrem').replace(/\bdeiner\b/g, 'Ihrer')
    .replace(/\bdein\b/g, 'Ihr').replace(/\bDein\b/g, 'Ihr')
    .replace(/\beure\b/g, 'Ihre').replace(/\beuren\b/g, 'Ihren').replace(/\beurem\b/g, 'Ihrem').replace(/\beuer\b/g, 'Ihr')
    .replace(/\bdu wirbst\b/g, 'Sie werben').replace(/\bdu\b/g, 'Sie').replace(/\bdich\b/g, 'Sie').replace(/\bdir\b/g, 'Ihnen');
}

function bauePrompt({ ziel, fragen, code, art, hinweis }) {
  const e = (ziel.entscheider || [])[0] || {};
  const fragenText = fragen.length
    ? fragen.map((f) => `${f.nummer}. ${sieForm(f.text)}`).join('\n')
    : '(Noch keine Fragen hinterlegt — fünf Platzhalter in eckigen Klammern setzen.)';
  const blick = ziel.blick || {};
  const heute = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const gemeinsam = `
Du schreibst für Alfons Rittler (Rittler & Co, Graz; Angebot „andi fragt.“) den ersten Kontakt an ein Unternehmen, das online wirbt. Der Kontakt soll neugierig machen, nicht belehren. Grundhaltung: Die Antwort steckt im Unternehmen; wir haben nur getan, was sein nächster Kunde auch tut — gegoogelt — und dabei fünf Fragen gefunden, die nur das Unternehmen beantworten kann.

EMPFÄNGER
- Unternehmen: ${ziel.unternehmen}
- Entscheider: ${e.name || '[Name]'}${e.rolle ? `, ${e.rolle}` : ''}
- Adresse: ${(ziel.postadresse || ziel.sitz || '').replace(/\n/g, ', ')}
- Website: ${ziel.website || ''}

AUFHÄNGER (ein bis zwei Sätze, daraus den Einstieg bauen; kein Lob, keine Floskel):
${ziel.briefAufhaenger || '(keiner hinterlegt — dann Nähe oder Branche nehmen)'}
Warmer Draht (nur erwähnen, wenn hier etwas steht, und nur als Tatsache, nicht als Vorwurf): ${ziel.warmerDraht || '—'}

WAS WIR GESEHEN HABEN (nur für dein Verständnis — NICHT in den Text, kein Befund, keine Kritik):
- Sie werben für: ${blick.verkaufen || ''}
- So treten sie auf: ${blick.auftritt || ''}
- Divergenz: ${blick.divergenz || ''}

DIE FÜNF FRAGEN (wortgleich übernehmen, Sie-Form, nummeriert 1–5, nichts hinzufügen):
${fragenText}

PORTAL: ${PORTAL} · Code ${code} · Die Seite ist nur für den Empfänger und bleibt 30 Tage offen; dort kann er die fünf Fragen beantworten.

ABSENDER: ${ABSENDER.name}, ${ABSENDER.firma}, ${ABSENDER.telefon}, ${ABSENDER.mail}

REGELN (hart):
- Sie-Form. Deutsch (Österreich). Kein Gendersternchen.
- Kein Befund, keine Kritik, keine Bewertung des Unternehmens, keine Lösung, kein Ratschlag.
- Verboten sind diese Wörter: ${SPERRLISTE.join(', ')}. Auch nicht „anonym“, „digital“, „Interview-Software“ oder irgendein Hinweis, wie andi fragt. arbeitet. Kein Produktname außer „andi fragt.“.
- Keine Mitbewerber nennen. Nichts Privates über Personen.
- Keine Zahl, die nicht aus dem Aufhänger oder den Fragen stammt.
- Kein Lob („beeindruckend“, „spannend“, „toll“), keine Floskeln („ich hoffe, es geht Ihnen gut“).
- Die fünf Fragen stehen als nummerierte Liste im Text, wortgleich wie oben.
- Link und Code stehen gut sichtbar in einer eigenen Zeile.
${hinweis ? `\nHINWEIS VON ALFONS (hat Vorrang vor Stilfragen, nie vor den Regeln): ${hinweis}\n` : ''}
AUSGABE als JSON mit den Feldern "betreff", "text", "spiegelung".
- "spiegelung": drei Sätze aus Sicht der Empfängerin/des Empfängers, die/der gerade Geld in diese Anzeigen steckt: Fühlt sie/er sich beobachtet oder verstanden? Welcher Satz ist der riskanteste? Was würdest du streichen? (Im Zweifel streichen, nicht ergänzen.)
`;

  if (art === 'mail') {
    return `${gemeinsam}
FORM: E-Mail, höchstens 140 Wörter im Fließtext plus die fünf Fragen. Aufbau: Betreff (ohne „Fünf Fragen“ im Betreff zu verraten — eher der Aufhänger in fünf Wörtern), Anrede, ein Satz Aufhänger, ein Satz „Ihre Anzeigen sind mir öfter begegnet. Ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt.“ (sinngemäß, nicht wörtlich zwingend), Überleitung zu den fünf Fragen, die Liste, dann Link und Code in einer eigenen Zeile mit dem Hinweis, dass die Seite nur für sie/ihn ist und 30 Tage offen bleibt, Gruß mit Name, Firma, Telefon. Keine Signatur-Floskeln, kein Disclaimer, kein Logo-Hinweis.
"text" enthält nur den E-Mail-Text ohne Betreff.`;
  }

  return `${gemeinsam}
FORM: Brief per Post, eine Seite, höchstens 220 Wörter im Fließtext plus die fünf Fragen. Aufbau genau so:
Anschrift (Name, Rolle, Unternehmen, Adresse, jede Angabe eigene Zeile)
Leerzeile
${ABSENDER.ort}, ${heute}
Leerzeile
Betreffzeile: Fünf Fragen zu ${ziel.unternehmen}
Leerzeile
Anrede (Sehr geehrte Frau … / Sehr geehrter Herr …)
Absatz 1: Aufhänger (ein bis zwei Sätze).
Absatz 2: Ihre Anzeigen sind mir in den letzten Wochen öfter begegnet. Ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt. Dabei sind mir fünf Fragen gekommen, die ich Ihnen nicht beantworten kann — nur Sie: (sinngemäß)
Die fünf Fragen als Liste 1–5.
Absatz 3: Was mir dabei aufgefallen ist, habe ich auf einer Seite zusammengestellt — nur Dinge, die jeder sieht, der Sie sucht. Dann Link und Code in eigener Zeile. Dort können Sie die fünf Fragen gleich beantworten; die Seite ist nur für Sie und bleibt 30 Tage offen.
Grußformel, Name, Firma, Telefon, E-Mail.
"betreff" = die Betreffzeile. "text" = der gesamte Brief von der Anschrift bis zur Unterschrift als reiner Text mit Zeilenumbrüchen, ohne Markdown.`;
}
