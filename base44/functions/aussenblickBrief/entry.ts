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
    const art = body.art === 'post' ? 'post' : 'mail'; // E-Mail ist der Standard (Alfons, 07.11.2026)
    const hinweis = String(body.hinweis || '').slice(0, 800);
    if (!zielId) return Response.json({ error: 'zielId fehlt' }, { status: 400 });

    const db = base44.asServiceRole.entities;
    const ziel = await db.Ziel.get(zielId);
    if (!ziel) return Response.json({ error: 'ziel_fehlt' }, { status: 404 });
    const fragen = (await db.Portalfrage.filter({ zielId })).sort((a, b) => (a.nummer || 0) - (b.nummer || 0));
    const einladungen = await db.Einladung.filter({ zielId });
    const haupt = einladungen.find((e) => e.art !== 'welle');

    // Kontakt-Kontext: früherer Kontakt, Aufhänger, Notizen und Anrufe aus dem Verlauf.
    // Die Regel von Alfons: Gab es Kontakt, muss der Text ihn konkret nennen — die KI prüft den Kontext.
    const verlauf = (await db.Ereignis.filter({ zielId })).filter((x) => ['notiz', 'anruf', 'erstgespraech_klick'].includes(x.art) && (x.details || x.text));
    verlauf.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
    const notizen = [
      ...(ziel.notizen ? [String(ziel.notizen)] : []),
      ...verlauf.slice(0, 6).map((x) => `${x.created_date ? String(x.created_date).slice(0, 10) : ''} ${x.art === 'anruf' ? 'Anruf' : 'Notiz'}: ${String(x.details || x.text || '')}`.trim()),
    ].map((s) => s.slice(0, 400));
    const kontakt = String(ziel.warmerDraht || '').trim();
    const kontaktUnbelegt = /zu pr[üu]fen|falls belegbar|unbelegt|vermutlich|unsicher|\?/i.test(kontakt);

    const echterCode = haupt?.code || '';
    const prompt = bauePrompt({ ziel, fragen, code: echterCode || '[CODE]', codeFehlt: !echterCode, art, hinweis, kontakt, kontaktUnbelegt, notizen });
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
    let text = String(r.text || '').trim();
    if (!text) return Response.json({ error: 'leer' }, { status: 502 });

    // Ohne Einladung darf kein Code im Text stehen — erfundene Codes auf den Platzhalter zurücksetzen
    if (!echterCode && !text.includes('[CODE]')) {
      text = text.replace(/(Code\s*:?\s*)([A-Za-z0-9][A-Za-z0-9\-_]{2,})/g, '$1[CODE]');
      if (!text.includes('[CODE]') && text.includes(PORTAL)) text = text.replace(PORTAL, `${PORTAL} | Code: [CODE]`);
    }

    // Sperrwörter nachprüfen — das Modell soll sie meiden, wir melden, wenn eines durchrutscht
    const treffer = SPERRLISTE.filter((w) => new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${w}([^A-Za-zÄÖÜäöüß]|$)`).test(text));
    return Response.json({
      art,
      betreff: String(r.betreff || '').trim(),
      text,
      spiegelung: String(r.spiegelung || '').trim(),
      sperrwoerter: treffer,
      codeFehlt: !echterCode,
      kontext: { kontakt: Boolean(kontakt), kontaktUnbelegt: Boolean(kontakt) && kontaktUnbelegt, aufhaenger: Boolean(ziel.briefAufhaenger), notizen: notizen.length },
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

function bauePrompt({ ziel, fragen, code, codeFehlt, art, hinweis, kontakt, kontaktUnbelegt, notizen }) {
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

FRÜHERER KONTAKT MIT RITTLER & CO (geprüfter Kontext — das Wichtigste für den Einstieg):
${kontakt || '(keiner bekannt — dann ist es der erste Kontakt)'}
${kontakt && !kontaktUnbelegt ? `REGEL: Der erste Satz nennt diesen Kontakt konkret — Zeitpunkt (Monat oder Datum) und Anlass in den Worten des Kontexts, z. B. „Anfang Juli haben Sie bei uns angefragt, weil …; am 9. Juli haben wir uns per Teams kennengelernt.“ Kein vager Satz wie „unsere Wege haben sich gekreuzt“. Kein Wort dazu, warum es damals nicht weiterging, kein Bedauern, kein Vorwurf. Danach die Brücke: Seither sind mir Ihre Anzeigen öfter begegnet …` : ''}${kontakt && kontaktUnbelegt ? `REGEL: Dieser Kontakt ist noch nicht belegt. Nenn ihn nicht als Tatsache. Schreib stattdessen an diese Stelle genau den Platzhalter [FRÜHERER KONTAKT — prüfen] als eigenen Satz, damit Alfons ihn ersetzt.` : ''}

AUFHÄNGER (zusätzlich, ein Satz; kein Lob, keine Floskel):
${ziel.briefAufhaenger || '(keiner hinterlegt — dann Nähe oder Branche nehmen)'}

NOTIZEN UND ANRUFE VON ALFONS (Kontext, nur verwenden, wenn es den Einstieg konkreter macht; nichts davon zitieren, was intern klingt):
${notizen.length ? notizen.map((n) => `- ${n}`).join('\n') : '- keine'}

WAS WIR GESEHEN HABEN (nur für dein Verständnis — NICHT in den Text, kein Befund, keine Kritik):
- Sie werben für: ${blick.verkaufen || ''}
- So treten sie auf: ${blick.auftritt || ''}
- Divergenz: ${blick.divergenz || ''}

DIE FÜNF FRAGEN (wortgleich übernehmen, Sie-Form, nummeriert 1–5, nichts hinzufügen):
${fragenText}

PORTAL: ${PORTAL} · Code ${code} · Die Seite ist nur für den Empfänger und bleibt 30 Tage offen; dort kann er die fünf Fragen beantworten.${codeFehlt ? '\nDer Einladungscode existiert noch nicht. Schreib exakt den Platzhalter [CODE] in eckigen Klammern an die Stelle des Codes. Erfinde keinen Code.' : ''}

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
FORM: E-Mail, höchstens 140 Wörter im Fließtext plus die fünf Fragen. Aufbau: Betreff (höchstens sechs Wörter; gibt es einen früheren Kontakt, knüpft der Betreff daran an, z. B. „Ihre Anfrage im Juli — ein Nachtrag“; sonst der Aufhänger; nie „Fünf Fragen“ im Betreff), Anrede, ein Satz zum früheren Kontakt (wenn vorhanden) oder Aufhänger, ein Satz „Ihre Anzeigen sind mir öfter begegnet. Ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt.“ (sinngemäß, nicht wörtlich zwingend), Überleitung zu den fünf Fragen, die Liste, dann Link und Code in einer eigenen Zeile mit dem Hinweis, dass die Seite nur für sie/ihn ist und 30 Tage offen bleibt, Gruß mit Name, Firma, Telefon. Keine Signatur-Floskeln, kein Disclaimer, kein Logo-Hinweis.
"text" enthält nur den E-Mail-Text ohne Betreff — als reiner Text mit Zeilenumbrüchen: Anrede eigene Zeile, Absätze durch Leerzeile getrennt, jede der fünf Fragen in einer eigenen Zeile, Link und Code in einer eigenen Zeile, Gruß und Signatur je eigene Zeile. Kein Markdown.`;
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
Absatz 1: Der frühere Kontakt konkret (wenn vorhanden), dann der Aufhänger — zusammen höchstens zwei Sätze.
Absatz 2: Ihre Anzeigen sind mir in den letzten Wochen öfter begegnet. Ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt. Dabei sind mir fünf Fragen gekommen, die ich Ihnen nicht beantworten kann — nur Sie: (sinngemäß)
Die fünf Fragen als Liste 1–5.
Absatz 3: Was mir dabei aufgefallen ist, habe ich auf einer Seite zusammengestellt — nur Dinge, die jeder sieht, der Sie sucht. Dann Link und Code in eigener Zeile. Dort können Sie die fünf Fragen gleich beantworten; die Seite ist nur für Sie und bleibt 30 Tage offen.
Grußformel, Name, Firma, Telefon, E-Mail.
"betreff" = die Betreffzeile. "text" = der gesamte Brief von der Anschrift bis zur Unterschrift als reiner Text mit Zeilenumbrüchen, ohne Markdown.`;
}
