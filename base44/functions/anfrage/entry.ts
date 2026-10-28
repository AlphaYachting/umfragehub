import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Öffentliches Anfrageformular auf andifragt.at/kontakt (Erstgespräch).
//
// - Ohne Login erreichbar, schreibt als Service-Rolle in die Entität Anfrage.
//   Lesen dürfen Anfragen nur Admins.
// - Spam-Schutz: verstecktes Feld, Mindest-Ausfüllzeit, höchstens 3 Anfragen je
//   E-Mail-Adresse und Stunde, höchstens 40 Anfragen je Stunde insgesamt.
// - Benachrichtigung per Brevo an ANFRAGE_EMPFAENGER (sonst office@rittler.co),
//   Antworten gehen direkt an die anfragende Person (replyTo). Die anfragende
//   Person bekommt bewusst keine automatische Mail: sonst ließe sich das Formular
//   missbrauchen, um Mails an fremde Adressen zu schicken.
// - Fehlt Brevo oder scheitert der Versand, ist die Anfrage trotzdem gespeichert.

const THEMEN = ['positionierung', 'team', 'kunden', 'vertrieb', 'einstieg', 'offen'];
const THEMEN_NAME: Record<string, string> = {
  positionierung: 'Positionierung', team: 'Team', kunden: 'Kunden', vertrieb: 'Vertrieb',
  einstieg: 'Erst einmal der Einstieg', offen: 'Weiß ich noch nicht',
};
const KANAELE = ['telefon', 'online'];
const MAIL_REGEX = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;
const MINDEST_SEKUNDEN = 3;
const STUNDE = 60 * 60 * 1000;

function env(name: string): string {
  try {
    return (Deno.env.get(name) || '').trim().replace(/^["']+|["']+$/g, '').trim();
  } catch (_e) {
    return '';
  }
}

function text(v: unknown, max: number): string {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function absenderTeilen(s: string) {
  const m = /^\s*"?(.*?)"?\s*<([^>]+)>\s*$/.exec(String(s || ''));
  return m && m[1] ? { name: m[1].trim(), email: m[2].trim() } : { email: (m ? m[2] : String(s || '')).trim() };
}

export default async function (req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Nur POST.' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities;
    const body = await req.json().catch(() => ({}));

    // Verstecktes Feld ausgefüllt oder zu schnell: still „ok“ melden, nichts speichern
    const sekunden = Number(body.dauerSekunden);
    if (text(body.webseite, 200) || (Number.isFinite(sekunden) && sekunden < MINDEST_SEKUNDEN)) {
      return Response.json({ ok: true });
    }

    const a = {
      name: text(body.name, 120),
      firma: text(body.firma, 160),
      email: text(body.email, 200).toLowerCase(),
      telefon: text(body.telefon, 60),
      themen: (Array.isArray(body.themen) ? body.themen : []).map(String).filter((t) => THEMEN.includes(t)).slice(0, 6),
      kanal: KANAELE.includes(String(body.kanal)) ? String(body.kanal) : 'online',
      nachricht: text(body.nachricht, 3000),
      herkunft: text(body.herkunft, 200),
      status: 'neu',
    };

    const fehler: Record<string, string> = {};
    if (!a.name) fehler.name = 'Bitte gib deinen Namen an.';
    if (!a.firma) fehler.firma = 'Bitte gib dein Unternehmen an.';
    if (!MAIL_REGEX.test(a.email)) fehler.email = 'Bitte gib eine gültige E-Mail-Adresse an.';
    if (Object.keys(fehler).length) return Response.json({ ok: false, fehler }, { status: 200 });

    const seit = Date.now() - STUNDE;
    const neueste = await db.Anfrage.list('-created_date', 60);
    const inDerStunde = neueste.filter((x) => new Date(x.created_date).getTime() > seit);
    if (inDerStunde.length >= 40 || inDerStunde.filter((x) => x.email === a.email).length >= 3) {
      return Response.json({ ok: false, zuViele: true }, { status: 200 });
    }

    const gespeichert = await db.Anfrage.create(a);

    // Benachrichtigung an Rittler & Co
    let mailOk = false;
    let mailFehler = '';
    const schluessel = env('BREVO_API_KEY');
    const absender = env('MAIL_ABSENDER');
    if (schluessel && absender) {
      const themen = a.themen.length ? a.themen.map((t) => THEMEN_NAME[t]).join(', ') : 'nicht angegeben';
      const zeilen: [string, string][] = [
        ['Name', a.name], ['Unternehmen', a.firma], ['E-Mail', a.email], ['Telefon', a.telefon || 'nicht angegeben'],
        ['Worum es geht', themen], ['Gespräch', a.kanal === 'telefon' ? 'Telefon' : 'Online'],
        ['Nachricht', a.nachricht || 'keine'], ['Von Seite', a.herkunft || '/kontakt'],
      ];
      const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2d2d2d">
<p style="font-size:18px;font-weight:bold;margin:0 0 4px">Neue Anfrage für ein Erstgespräch</p>
<p style="margin:0 0 16px;color:#5a5a5a">Versprochen ist eine Antwort innerhalb von 24 Stunden. Antworten auf diese Mail gehen direkt an die anfragende Person.</p>
<table cellpadding="6" style="border-collapse:collapse">${zeilen.map(([k, v]) =>
        `<tr><td style="vertical-align:top;color:#5a5a5a;white-space:nowrap">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table></div>`;
      const textInhalt = zeilen.map(([k, v]) => `${k}: ${v}`).join('\n');
      try {
        const r = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': schluessel, 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({
            sender: absenderTeilen(absender),
            to: [{ email: env('ANFRAGE_EMPFAENGER') || 'office@rittler.co' }],
            replyTo: { email: a.email, name: a.name },
            subject: `Anfrage Erstgespräch: ${a.name}, ${a.firma}`.slice(0, 180),
            htmlContent: html,
            textContent: textInhalt,
            tags: ['andifragt', 'anfrage'],
          }),
        });
        mailOk = r.ok;
        if (!r.ok) mailFehler = `Brevo ${r.status}: ${(await r.text()).slice(0, 200)}`;
      } catch (e) {
        mailFehler = String(e?.message || e).slice(0, 200);
      }
    } else {
      mailFehler = 'Kein Versandkanal eingerichtet (BREVO_API_KEY oder MAIL_ABSENDER fehlt).';
    }
    if (mailFehler) console.error(`anfrage: ${mailFehler}`);
    await db.Anfrage.update(gespeichert.id, { mailOk, mailFehler: mailFehler.slice(0, 300) });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(`anfrage: ${error?.message || error}`);
    return Response.json({ ok: false, serverfehler: true }, { status: 200 });
  }
}
