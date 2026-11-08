import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Außenblick-Modul: schreibt die erste Kontakt-E-Mail (Welle 1) eines Ziels — oder, ohne
// früheren Kontakt, den Brief per Post — mit dem Sprachmodell der Plattform. Nur für Admins.
//
// Fassung vom 08.11.2026: Mail mit zweiseitigem Anhang statt fünf Fragen mit Portal-Code.
// Aufbau: Hook (belegter früherer Kontakt) → „gegoogelt, Google und ChatGPT gefragt“ → drei
// Fakten aus dem eigenen Material des Unternehmens → die Spannung als eine Frage → Anhang mit
// Nutzen → 15 Minuten → „keine Agentur, Wissen statt Bauchgefühl“ → Anruf angekündigt.
// Das Portal kommt erst nach dem Gespräch; deshalb steht kein Code und kein Link im Text.
//
// Die Funktion schreibt nichts in die Datenbank und verschickt nichts. Der Text kommt in
// die Zielkarte zurück; Alfons liest, ändert und speichert von Hand.

const ABSENDER = {
  name: 'Alfons Rittler',
  rolle: 'Geschäftsführer Rittler & Co',
  telefon: '+43 316 57 01 17',
  mail: 'a.rittler@rittler.co',
  ort: 'Graz',
  gruss: 'Mit Fragen und Grüßen aus Graz,',
};
const SPERRLISTE = ['falsch', 'Fehler', 'sollten', 'müssten', 'besser', 'anonym', 'digital', 'Software', 'Tool', 'Analyse'];
// „KI“ ist nur für unsere Methode gesperrt; „Googles KI-Modus“ darf stehen, wenn er zitiert wird.
const KI_FREI = /Googles? KI-Modus|KI-Modus/g;
// Was nie in die erste Mail gehört, gleich welches Unternehmen — die Funktion meldet Treffer.
const GRENZEN = [
  { wort: 'Umsatzanteil', re: /(Umsatz|Prozent des Umsatzes|Drittel des Umsatzes|% des Umsatzes)/i },
  { wort: 'Portal/Code', re: /(andifragt\.at\/|\[CODE\]|Einladungscode|\bCode\b)/i },
  { wort: 'Rezension/kununu', re: /(kununu|Rezension|„[^“]{5,}“\s*\(?\s*(Google-)?Bewertung)/i },
  { wort: 'Agentursprache', re: /(spezialisiert|zielgerichtet|effizienter|nachhaltiger|Botschaften, die wirklich tragen)/i },
];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'nicht_berechtigt' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const zielId = String(body.zielId || '');
    const art = body.art === 'post' ? 'post' : 'mail';
    const hinweis = String(body.hinweis || '').slice(0, 1500);
    const bisher = body.bisher && typeof body.bisher === 'object' && String(body.bisher.text || '').trim()
      ? { betreff: String(body.bisher.betreff || '').slice(0, 300), text: String(body.bisher.text || '').slice(0, 8000) }
      : null;
    if (!zielId) return Response.json({ error: 'zielId fehlt' }, { status: 400 });

    const db = base44.asServiceRole.entities;
    const ziel = await db.Ziel.get(zielId);
    if (!ziel) return Response.json({ error: 'ziel_fehlt' }, { status: 404 });

    const verlauf = (await db.Ereignis.filter({ zielId })).filter((x) => ['notiz', 'anruf'].includes(x.art) && (x.details || x.text));
    verlauf.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')));
    const notizen = [
      ...(ziel.notizen ? [String(ziel.notizen)] : []),
      ...verlauf.slice(0, 6).map((x) => `${x.created_date ? String(x.created_date).slice(0, 10) : ''} ${x.art === 'anruf' ? 'Anruf' : 'Notiz'}: ${String(x.details || x.text || '')}`.trim()),
    ].map((s) => s.slice(0, 600));
    const kontakt = String(ziel.warmerDraht || '').trim();
    const kontaktUnbelegt = /zu pr[üu]fen|falls belegbar|unbelegt|vermutlich|unsicher|\?/i.test(kontakt);

    const widersprueche = await db.Widerspruch.filter({ zielId });
    const rang = (w) => (w.staerke === 'stark' ? 0 : w.staerke === 'mittel' ? 1 : 2) * 10 + (w.nummer || 9) / 100;
    const material = widersprueche
      .filter((w) => w.belegA?.text && w.belegB?.text)
      .sort((a, b) => rang(a) - rang(b))
      .slice(0, 6)
      .map((w) => `- ${w.titel || w.typ}: A „${w.belegA.text}“ (${w.belegA.fundstelle || ''}) · B „${w.belegB.text}“ (${w.belegB.fundstelle || ''}) · Spannung: ${w.spannung || w.zeile || ''}`);

    const w = ziel.werbung || {};
    const zahlen = [
      (w.meta || w.google || w.linkedin || w.tiktok) ? `Anzeigen: ${[w.linkedin ? `LinkedIn ${w.linkedin}` : null, w.google ? `Google ${w.google}` : null, w.meta ? `Meta ${w.meta}` : null, w.tiktok ? `TikTok ${w.tiktok}` : null].filter(Boolean).join(', ')}` : null,
      w.siegerbotschaft?.hook ? `längste Anzeige: „${w.siegerbotschaft.hook}“${w.siegerbotschaft.monate ? `, ${w.siegerbotschaft.monate} Monate` : ''}` : null,
      w.juengste?.hook ? `jüngste Anzeige: „${w.juengste.hook}“` : null,
      ziel.stimmen?.googleAnzahl ? `${ziel.stimmen.googleAnzahl} Google-Bewertungen${ziel.stimmen.googleWert ? `, Schnitt ${String(ziel.stimmen.googleWert).replace('.', ',')}` : ''}` : null,
      ziel.markennamen?.length ? `Namen in Umlauf: ${ziel.markennamen.join(', ')}` : null,
    ].filter(Boolean);

    const befund = String(ziel.befundMarkdown || '').slice(0, 9000);
    const kurz = String(ziel.registerMarkdown3 || '').slice(0, 3500);
    const anruftag = String(body.anruftag || 'Donnerstag');

    const prompt = bauePrompt({ ziel, art, hinweis, kontakt, kontaktUnbelegt, notizen, bisher, material, zahlen, befund, kurz, anruftag });
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
              gefuehl: { type: 'string', description: 'Ein Satz: Fühlt sich der Empfänger beobachtet oder verstanden — und warum?' },
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
    const text = String(r.text || '').trim();
    if (!text) return Response.json({ error: 'leer' }, { status: 502 });

    const ohneKiModus = text.replace(KI_FREI, '');
    const treffer = [
      ...SPERRLISTE.filter((s) => new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${s}([^A-Za-zÄÖÜäöüß]|$)`).test(text)),
      ...(/(^|[^A-Za-zÄÖÜäöüß])KI([^A-Za-zÄÖÜäöüß-]|$)/.test(ohneKiModus) ? ['KI (nur „Googles KI-Modus“ erlaubt)'] : []),
      ...GRENZEN.filter((g) => g.re.test(text)).map((g) => g.wort),
    ];
    const woerter = text.split(/\s+/).filter(Boolean).length;

    return Response.json({
      art,
      betreff: String(r.betreff || '').trim() || `Was Ihr nächster Kunde über ${kurzname(ziel)} erfährt`,
      text,
      spiegelung: r.spiegelung && typeof r.spiegelung === 'object'
        ? { gefuehl: String(r.spiegelung.gefuehl || '').trim(), risiko: String(r.spiegelung.risiko || '').trim(), streichen: String(r.spiegelung.streichen || '').trim() }
        : String(r.spiegelung || '').trim(),
      ueberarbeitet: Boolean(bisher),
      sperrwoerter: treffer,
      woerter,
      codeFehlt: false, // Welle 1 braucht keinen Code mehr; das Portal kommt nach dem Gespräch
      kontext: { kontakt: Boolean(kontakt), kontaktUnbelegt: Boolean(kontakt) && kontaktUnbelegt, aufhaenger: Boolean(ziel.briefAufhaenger), notizen: notizen.length, befund: Boolean(befund) },
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

function kurzname(ziel) {
  return String(ziel.unternehmen || '').replace(/\s+(GmbH|AG|KG|OG|e\.U\.|Group GmbH|GmbH & Co KG).*$/i, '').replace(/\s+Group$/i, '').trim() || ziel.unternehmen;
}

function bauePrompt({ ziel, art, hinweis, kontakt, kontaktUnbelegt, notizen, bisher, material, zahlen, befund, kurz, anruftag }) {
  const e = (ziel.entscheider || [])[0] || {};
  const name = kurzname(ziel);
  const heute = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const gemeinsam = `
Du schreibst für Alfons Rittler (Rittler & Co, Graz; Leistung „andi fragt.“) die ERSTE Nachricht an ein Unternehmen, das online wirbt. Ziel: eine strategisch gute, kurze Nachricht, die den Empfänger trifft, ihn neugierig auf den beigelegten zweiseitigen Anhang macht und zu 15 Minuten Gespräch führt. Sie soll sich nicht wie Werbung einer Agentur lesen, sondern wie der Blick eines Kollegen, der genau hingesehen hat.

EMPFÄNGER
- Unternehmen: ${ziel.unternehmen} (in der Nachricht kurz: ${name})
- Entscheider: ${e.name || '[Name]'}${e.rolle ? `, ${e.rolle}` : ''}
- Website: ${ziel.website || ''}

FRÜHERER KONTAKT (geprüft, wenn nicht anders markiert):
${kontakt || '(keiner — dann ist es der erste Kontakt; Einstieg über den Aufhänger)'}
${kontakt && !kontaktUnbelegt ? 'REGEL: Der erste Satz nennt diesen Kontakt konkret — Monat und Jahr und Anlass, in einfachen Worten, ohne interne Namen von Mitarbeitenden von Rittler & Co. Dann: „Es ist bei der Anfrage geblieben.“ oder sinngemäß. Kein Bedauern, kein Vorwurf.' : ''}${kontakt && kontaktUnbelegt ? 'REGEL: Dieser Kontakt ist nicht belegt. Nenn ihn nicht als Tatsache, sondern schreib als ersten Satz genau den Platzhalter [FRÜHERER KONTAKT — prüfen].' : ''}

AUFHÄNGER UND VORGABEN VON ALFONS (haben Vorrang vor allem außer den harten Regeln):
${ziel.briefAufhaenger || '(keine)'}

NOTIZEN UND ANRUFE (Kontext; darin stehen oft Regeln, was draußen bleibt — beachten, nichts Internes zitieren):
${notizen.length ? notizen.map((n) => `- ${n}`).join('\n') : '- keine'}

MATERIAL, AUS DEM DU DIE DREI FAKTEN WÄHLST (alles öffentlich, vom Unternehmen selbst; nur Fakten, die der Empfänger selbst nachprüfen kann):
Zahlen: ${zahlen.length ? zahlen.join(' · ') : 'keine'}
Widersprüche aus dem Befund:
${material.length ? material.join('\n') : '- keine hinterlegt'}

BEFUND (intern, nur zum Verstehen — NICHT abschreiben, keine Fundstellen, keine Zielzustände, keine Bewertung):
${befund || '(kein Befund)'}
${kurz ? `\nKURZFASSUNG DER RECHERCHE (intern):\n${kurz}` : ''}

AUFBAU (genau diese Reihenfolge, insgesamt höchstens 200 Wörter ohne Anrede und Gruß):
1. Einstieg, höchstens zwei Sätze: der frühere Kontakt konkret (oder der Aufhänger). Dann: „Seither sind mir Ihre Anzeigen öfter begegnet, und ich habe getan, was Ihr nächster Kunde auch tut: gegoogelt und Google und ChatGPT gefragt.“ (sinngemäß, gern kürzer).
2. „Drei Dinge daraus:“ und drei Zeilen, jede mit Gedankenstrich „– “, jede höchstens 30 Wörter, jede ein Fakt aus dem eigenen Material des Unternehmens, nebeneinander gelegt, ohne Wertung. Wenn das Material eine Antwort von Googles KI-Modus oder ChatGPT enthält, ist das der erste Fakt (was die Antwortmaschine über das Unternehmen sagt — und wo es bei der Frage eines Wunschkunden fehlt oder unter anderem Namen auftaucht). Ein Fakt aus den Anzeigen (längste gegen jüngste, oder Anzeige gegen Website). Ein Fakt, der überrascht (Namen, Einträge, Bewertungen als Zahl). Zahlen nur aus dem Material.
3. Die Spannung als EINE Frage, ein Satz, die nur der Empfänger beantworten kann (z. B. „Welches der beiden soll Ihr nächster Kunde kennen?“). Erkennt das Material eine gewollte Trennung (zwei Unternehmen, zwei Websites), erkenne sie in einem Halbsatz an und frage nach den Kanälen.
4. Anhang ankündigen, ein Satz, mit dem Nutzen in seinen Worten: „Im Anhang steht das auf zwei Seiten, mit dem, was Sie davon haben: …“ — zwei oder drei kurze Nutzen (mehr Anfragen aus demselben Budget, weniger bezahlte Klicks ins Leere, mehr Aufträge aus denselben Anfragen; oder auf das Unternehmen gemünzt). Keine Prozentzahl, keine Euro.
5. Vorschlag, ein Satz: 15 Minuten, Telefon oder Teams, kostenlos; am Ende wissen beide, ob wir helfen können und ob er das will. Wenn es einen Marketingverantwortlichen gibt, ist er eingeladen — ohne Namen.
6. Schlussabsatz, PFLICHT, zwei bis drei Sätze: „Ich möchte Ihnen keine Agentur verkaufen.“ Rittler & Co hat 25 Jahre Werbung gemacht und sich daraus weiterentwickelt; heute Wissen statt Bauchgefühl: Was ${name} für Entscheidungen über Botschaft, Zielgruppe und Namen braucht, hat das Unternehmen verlässlich schon in sich — bei den Kunden, die geblieben sind, im Team, im Vertrieb —, nur sieht es niemand. Was sein Team oder seine Agentur daraus macht, bleibt seine Sache.
7. Letzte Zeile: „Sagen Sie mir, wann es Ihnen passt, oder ich rufe Sie am ${anruftag} kurz an.“
8. Gruß: „${ABSENDER.gruss}“ und darunter „${ABSENDER.name}“. Keine weitere Signatur (die setzt das Mailprogramm).

HARTE REGELN:
- Sie-Form, Deutsch (Österreich), kein Gendersternchen, kein Markdown, kein Fettdruck.
- Verbotene Wörter: ${SPERRLISTE.join(', ')}, sowie „KI“ für unsere Arbeit. „Googles KI-Modus“ und „ChatGPT“ dürfen genannt werden, wenn du ihre Antworten über das Unternehmen wiedergibst.
- Nie erklären, wie andi fragt. arbeitet. Kein Interview-, Befragungs- oder Methodenbegriff. Kein Portal, kein Link, kein Code, keine Fragenliste.
- Keine Kundennamen des Unternehmens, keine Umsatzanteile oder Umsatzzahlen, keine Rezensionen im Wortlaut, kein kununu, keine Standorte von Mitarbeitenden, nichts Privates über Personen, keine Mitbewerber.
- Keine Agentursprache: nicht „spezialisiert“, „zielgerichtet“, „effizienter“, „nachhaltiger“, „Botschaften, die wirklich tragen“, keine Floskeln, kein Lob („beeindruckend“, „spannend“).
- Keine Zahl, die nicht im Material steht. Nichts, was das Unternehmen mit einem Anruf bei seiner Agentur in einer Woche erledigt hätte, als Fakt 1.
- Jede Zeile muss der Empfänger selbst nachprüfen können, ohne uns zu glauben.
- Betreff: Standard „Was Ihr nächster Kunde über ${name} erfährt“ (passt zur Headline des Anhangs); nur bei ausdrücklichem Hinweis von Alfons ein anderer, höchstens acht Wörter.
${bisher ? `\nÜBERARBEITUNG — das ist der Modus dieses Aufrufs. Bisheriger Entwurf, den Alfons gelesen hat:\n---\n${bisher.betreff ? `Betreff: ${bisher.betreff}\n\n` : ''}${bisher.text}\n---\nAlfons will diese Änderungen (diktiert, kann umgangssprachlich sein): „${hinweis}“\nSetz genau diese Änderungen um und lass alles andere wortgleich stehen. Die Regeln oben gelten weiter.\n` : hinweis ? `\nHINWEIS VON ALFONS (Vorrang vor Stilfragen, nie vor den harten Regeln): ${hinweis}\n` : ''}
AUSGABE als JSON mit "betreff", "text", "spiegelung".
- "spiegelung": Objekt aus Sicht des Empfängers, der gerade Geld in diese Anzeigen steckt: "gefuehl" (ein Satz: beobachtet oder verstanden, und warum), "risiko" (der riskanteste Satz wörtlich plus ein Halbsatz warum), "streichen" (was du streichen würdest, sonst „nichts“).
`;

  if (art === 'mail') {
    return `${gemeinsam}
FORM: E-Mail. "text" = nur der E-Mail-Text ohne Betreff, reiner Text: Anrede („Sehr geehrte Frau …,“ / „Sehr geehrter Herr …,“) eigene Zeile, Absätze durch Leerzeile getrennt, „Drei Dinge daraus:“ eigene Zeile, jeder Fakt eigene Zeile mit „– “, Gruß und Name je eigene Zeile.`;
  }

  return `${gemeinsam}
FORM: Brief per Post (ohne früheren Kontakt der Standard), eine Seite; der zweiseitige Anhang liegt bei. Statt „Im Anhang“ heißt es „Beigelegt finden Sie …“. Statt „oder ich rufe Sie am ${anruftag} kurz an“: „Ich rufe Sie in der kommenden Woche kurz an.“ Aufbau:
Anschrift (Name, Rolle, Unternehmen, Adresse ${String(ziel.postadresse || ziel.sitz || '').replace(/\n/g, ', ')} — jede Angabe eigene Zeile)
Leerzeile
${ABSENDER.ort}, ${heute}
Leerzeile
Betreffzeile
Leerzeile
Dann der Text wie oben, am Ende Gruß, Name, ${ABSENDER.rolle}, ${ABSENDER.telefon}, ${ABSENDER.mail} je eigene Zeile.
"betreff" = die Betreffzeile. "text" = der gesamte Brief von der Anschrift bis zur Unterschrift, reiner Text.`;
}
