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
const SPERRLISTE = ['falsch', 'Fehler', 'sollten', 'müssten', 'besser', 'anonym', 'digital', 'KI', 'Software', 'Tool', 'Analyse'];
// Was Rittler & Co ist — ein Satz im Text, in Alfons' Worten (07.11.2026). Nicht, wie es funktioniert.
const POSITIONIERUNG = 'Rittler & Co hat sich mit andi fragt. auf genau diese Frage spezialisiert: Welche Botschaft trägt wirklich — damit Werbung effizienter, zielgerichteter und nachhaltiger wird. Die Antwort holen wir nicht aus Annahmen, sondern aus dem Unternehmen selbst: von seinen Kunden und seinem Team.';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'nicht_berechtigt' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const zielId = String(body.zielId || '');
    const art = body.art === 'post' ? 'post' : 'mail'; // E-Mail ist der Standard (Alfons, 07.11.2026)
    const hinweis = String(body.hinweis || '').slice(0, 1500);
    // Überarbeiten: Alfons hat schon einen Entwurf und sagt (diktiert), was sich ändern soll
    const bisher = body.bisher && typeof body.bisher === 'object' && String(body.bisher.text || '').trim()
      ? { betreff: String(body.bisher.betreff || '').slice(0, 300), text: String(body.bisher.text || '').slice(0, 8000) }
      : null;
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

    // Köder: der stärkste Widerspruch, der ohnehin im Portal offen steht — ein Fakt aus dem eigenen
    // Material des Unternehmens, nebeneinander gelegt, ohne Wertung. Macht den Absatz „was wir für Sie tun“ konkret.
    const widersprueche = await db.Widerspruch.filter({ zielId });
    const rang = (w) => (w.staerke === 'stark' ? 0 : w.staerke === 'mittel' ? 1 : 2) * 10 + (w.portal === 'offen' ? 0 : w.portal === 'gesperrt' ? 1 : 5) + (w.reihenfolgePortal || w.nummer || 9) / 100;
    const koeder = widersprueche.filter((w) => w.portal !== 'intern' && w.belegA?.text && w.belegB?.text).sort((a, b) => rang(a) - rang(b))[0] || null;
    const w = ziel.werbung || {};
    const zahlen = [
      (w.meta || w.google || w.linkedin || w.tiktok) ? `${(w.meta || 0) + (w.google || 0) + (w.linkedin || 0) + (w.tiktok || 0)} aktive Anzeigen (${[w.meta ? `Meta ${w.meta}` : null, w.google ? `Google ${w.google}` : null, w.linkedin ? `LinkedIn ${w.linkedin}` : null, w.tiktok ? `TikTok ${w.tiktok}` : null].filter(Boolean).join(', ')})` : null,
      w.siegerbotschaft?.monate ? `älteste aktive Anzeige läuft seit ${w.siegerbotschaft.monate} Monaten${w.siegerbotschaft.seit ? ` (seit ${w.siegerbotschaft.seit})` : ''}` : null,
      ziel.stimmen?.googleWert ? `Google ${String(ziel.stimmen.googleWert).replace('.', ',')} bei ${ziel.stimmen.googleAnzahl || '?'} Bewertungen` : null,
      ziel.zielgruppen?.length ? `${ziel.zielgruppen.length} Zielgruppenbezeichnungen in Umlauf` : null,
      ziel.markennamen?.length ? `${ziel.markennamen.length} Markennamen in Umlauf` : null,
    ].filter(Boolean);

    const echterCode = haupt?.code || '';
    const prompt = bauePrompt({ ziel, fragen, code: echterCode || '[CODE]', codeFehlt: !echterCode, art, hinweis, kontakt, kontaktUnbelegt, notizen, bisher, koeder, zahlen });
    const ergebnis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          betreff: { type: 'string' },
          text: { type: 'string' },
          spiegelung: {
            type: 'object',
            properties: {
              gefuehl: { type: 'string', description: 'Ein Satz: Fühlt sich die Empfängerin beobachtet oder verstanden — und warum?' },
              risiko: { type: 'string', description: 'Der riskanteste Satz des Entwurfs, wörtlich zitiert, und in einem Halbsatz, warum.' },
              streichen: { type: 'string', description: 'Was du streichen würdest — im Zweifel streichen, nicht ergänzen. Oder: nichts.' },
            },
            required: ['gefuehl', 'risiko', 'streichen'],
          },
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
      spiegelung: r.spiegelung && typeof r.spiegelung === 'object'
        ? { gefuehl: String(r.spiegelung.gefuehl || '').trim(), risiko: String(r.spiegelung.risiko || '').trim(), streichen: String(r.spiegelung.streichen || '').trim() }
        : String(r.spiegelung || '').trim(),
      ueberarbeitet: Boolean(bisher),
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

function bauePrompt({ ziel, fragen, code, codeFehlt, art, hinweis, kontakt, kontaktUnbelegt, notizen, bisher, koeder, zahlen }) {
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

WAS WIR FÜR SIE TUN (Pflicht: ein kurzer Absatz von drei Sätzen, nach den fünf Fragen und vor dem Link — auf DIESES Unternehmen gemünzt, nicht allgemein):
Satz 1 — der Köder: ein Fakt aus dem eigenen Material des Unternehmens, nebeneinander gelegt, ohne Wertung, ohne „falsch“, ohne Schlussfolgerung. Nimm dafür diesen Widerspruch:
${koeder ? `  A: ${koeder.belegA.text} (${koeder.belegA.fundstelle || ''})\n  B: ${koeder.belegB.text} (${koeder.belegB.fundstelle || ''})\n  Im Portal steht dazu: ${koeder.zeile || koeder.spannung || ''}` : '  (keiner hinterlegt — dann die Zahlen unten nehmen)'}
  Zahlen des Unternehmens, die du nennen darfst (alle öffentlich): ${zahlen.length ? zahlen.join(' · ') : 'keine'}
Satz 2 — was wir daraus machen, in Verbindung mit Satz 1: Rittler & Co hat sich mit andi fragt. darauf spezialisiert, genau das zu klären — welche Botschaft trägt — und zwar nicht aus Annahmen, sondern aus dem Unternehmen selbst: von den Kunden, die geblieben sind, und vom Team.
Satz 3 — was die Geschäftsführerin davon hat, konkret in ihren Zahlen: das Budget (ihre Anzeigenzahl nennen) fließt in die eine Botschaft, die trägt (effizienter); eine Zielgruppe statt vieler (zielgerichteter); eine Botschaft in den Worten der eigenen Kunden, die Jahre hält statt Wochen (nachhaltiger).
Verboten in diesem Absatz: Allgemeinplätze ohne Bezug auf ihre Zahlen oder ihr Material („Botschaften, die wirklich tragen“ allein reicht nicht), Fachjargon, mehr als drei Sätze.
Haltung: ${POSITIONIERUNG}

REGELN (hart):
- Sie-Form. Deutsch (Österreich). Kein Gendersternchen.
- Kein Befund, keine Kritik, keine Bewertung des Unternehmens, keine Lösung für den Empfänger, kein Ratschlag. Die Spezialisierung von Rittler & Co darf und soll genannt werden (siehe WER WIR SIND) — als Satz, was wir tun und wofür, nicht als Ablauf.
- Verboten sind diese Wörter: ${SPERRLISTE.join(', ')}. Auch nicht „anonym“, „digital“, „Interview-Software“ oder irgendein Hinweis, wie andi fragt. arbeitet. Kein Produktname außer „andi fragt.“.
- Keine Mitbewerber nennen. Nichts Privates über Personen.
- Keine Zahl, die nicht aus dem Aufhänger oder den Fragen stammt.
- Kein Lob („beeindruckend“, „spannend“, „toll“), keine Floskeln („ich hoffe, es geht Ihnen gut“).
- Die fünf Fragen stehen als nummerierte Liste im Text, wortgleich wie oben.
- Link und Code stehen gut sichtbar in einer eigenen Zeile.
${bisher ? `\nÜBERARBEITUNG — das ist der Modus dieses Aufrufs. Hier ist der bisherige Entwurf, den Alfons schon gelesen hat:\n---\n${bisher.betreff ? `Betreff: ${bisher.betreff}\n\n` : ''}${bisher.text}\n---\nAlfons will diese Änderungen (diktiert, kann umgangssprachlich sein): „${hinweis}“\nSetz genau diese Änderungen um und lass alles andere wortgleich stehen — keine neuen Formulierungen an Stellen, die er nicht genannt hat, keine neue Gliederung, die fünf Fragen bleiben wortgleich, sofern er nicht ausdrücklich eine Frage ändern will. Die Regeln oben gelten weiter.\n` : hinweis ? `\nHINWEIS VON ALFONS (hat Vorrang vor Stilfragen, nie vor den Regeln): ${hinweis}\n` : ''}
AUSGABE als JSON mit den Feldern "betreff", "text", "spiegelung".
- "spiegelung" ist ein Objekt mit drei Feldern, aus Sicht der Empfängerin/des Empfängers, die/der gerade Geld in diese Anzeigen steckt: "gefuehl" (ein Satz: fühlt sie/er sich beobachtet oder verstanden, und warum), "risiko" (der riskanteste Satz wörtlich zitiert plus ein Halbsatz warum), "streichen" (was du streichen würdest — im Zweifel streichen, nicht ergänzen; sonst „nichts“).
`;

  if (art === 'mail') {
    return `${gemeinsam}
FORM: E-Mail, höchstens 170 Wörter im Fließtext plus die fünf Fragen. Aufbau: Betreff (höchstens sechs Wörter; gibt es einen früheren Kontakt, knüpft der Betreff daran an, z. B. „Ihre Anfrage im Juli — ein Nachtrag“; sonst der Aufhänger; nie „Fünf Fragen“ im Betreff), Anrede, ein Satz zum früheren Kontakt (wenn vorhanden) oder Aufhänger, ein Satz „Ihre Anzeigen sind mir öfter begegnet. Ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt.“ (sinngemäß, nicht wörtlich zwingend), Überleitung zu den fünf Fragen, die Liste, dann ein bis zwei Sätze WER WIR SIND, dann Link und Code in einer eigenen Zeile mit dem Hinweis, dass die Seite nur für sie/ihn ist und 30 Tage offen bleibt, Gruß mit Name, Firma, Telefon. Keine Signatur-Floskeln, kein Disclaimer, kein Logo-Hinweis.
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
Absatz 3: Ein bis zwei Sätze WER WIR SIND.
Absatz 4: Was mir dabei aufgefallen ist, habe ich auf einer Seite zusammengestellt — nur Dinge, die jeder sieht, der Sie sucht. Dann Link und Code in eigener Zeile. Dort können Sie die fünf Fragen gleich beantworten; die Seite ist nur für Sie und bleibt 30 Tage offen.
Grußformel, Name, Firma, Telefon, E-Mail.
"betreff" = die Betreffzeile. "text" = der gesamte Brief von der Anschrift bis zur Unterschrift als reiner Text mit Zeilenumbrüchen, ohne Markdown.`;
}
