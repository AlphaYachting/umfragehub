import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Außenblick-Modul: öffentliche Schnittstelle des Portals (andifragt.at/a/<code>).
// Läuft als Service-Rolle; Zugang nur mit einem Einladungscode im Status „versendet“
// (von Alfons von Hand gesetzt) oder, für eingeloggte Admins, mit ?vorschau=1.
//
// Liefert nur, was das Unternehmen sehen soll: feste Texte, die Spiegel-Karten in der
// Portal-Fassung (nie Titel, Spannung oder Belegstufen aus dem Befund), die fünf Fragen,
// die eigenen bisherigen Antworten. Schreibt Antworten, Rechnerläufe und Ereignisse —
// nichts davon löst einen Kontakt zum Unternehmen aus. Eigene Datei, eigene Entitäten;
// rührt keine Entität der Befragungssoftware an.

const MAX_FEHLVERSUCHE = 8;
const SPERRE_MINUTEN = 15;
const SCHWELLE_GESPERRT = 2; // so viele beantwortete Fragen schalten die gesperrten Karten frei
const LOESCHEN_NACH_TAGEN = 90;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities;
    const body = await req.json().catch(() => ({}));
    const aktion = String(body.aktion || 'laden');

    let admin = false;
    if (body.vorschau) {
      const user = await base44.auth.me().catch(() => null);
      admin = !!(user && user.role === 'admin');
    }

    const zugang = await pruefen(db, body, admin);
    if (zugang.fehler) return Response.json({ fehler: zugang.fehler });
    const { einladung, ziel } = zugang;

    if (aktion === 'laden') return Response.json(await laden(db, einladung, ziel, admin));
    if (aktion === 'antworten') return Response.json(await antworten(db, einladung, ziel, body, admin));
    if (aktion === 'rechner') return Response.json(await rechner(db, einladung, ziel, body, admin));
    if (aktion === 'ereignis') return Response.json(await ereignis(db, einladung, ziel, body, admin));
    return Response.json({ fehler: 'unbekannt' });
  } catch (error) {
    console.error('aussenblickPortal:', error?.message || error);
    return Response.json({ fehler: 'server' });
  }
}

// ---------------------------------------------------------------------------
// Zugang
// ---------------------------------------------------------------------------
async function pruefen(db, body, admin) {
  const code = String(body.code || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[A-Z0-9]{2,6}-[A-Z0-9]{4}(-W)?$/.test(code)) return { fehler: 'code' };
  const treffer = await db.Einladung.filter({ code });
  const einladung = treffer[0];
  if (!einladung) return { fehler: 'code' };

  if (einladung.gesperrtBis && new Date(einladung.gesperrtBis).getTime() > Date.now() && !admin) return { fehler: 'gesperrt' };

  if (!admin) {
    if (einladung.status !== 'versendet') {
      await fehlversuch(db, einladung);
      return { fehler: einladung.status === 'abgelaufen' ? 'abgelaufen' : 'code' };
    }
    if (einladung.gueltigBis && new Date(`${einladung.gueltigBis}T23:59:59`).getTime() < Date.now()) {
      await db.Einladung.update(einladung.id, { status: 'abgelaufen' }).catch(() => null);
      return { fehler: 'abgelaufen' };
    }
  }

  const ziel = await db.Ziel.get(einladung.zielId).catch(() => null);
  if (!ziel) return { fehler: 'code' };
  return { einladung, ziel };
}

async function fehlversuch(db, einladung) {
  const n = (einladung.fehlversuche || 0) + 1;
  const patch = { fehlversuche: n };
  if (n >= MAX_FEHLVERSUCHE) patch.gesperrtBis = new Date(Date.now() + SPERRE_MINUTEN * 60000).toISOString();
  await db.Einladung.update(einladung.id, patch).catch(() => null);
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------
async function laden(db, einladung, ziel, admin) {
  const welle = einladung.art === 'welle';
  const [widersprueche, fragen, antworten] = await Promise.all([
    db.Widerspruch.filter({ zielId: ziel.id }),
    db.Portalfrage.filter({ zielId: ziel.id }),
    db.Portalantwort.filter({ zielId: ziel.id, einladungId: einladung.id }),
  ]);

  // Erstes Öffnen: Ereignis, Zähler, Status des Ziels — nur für echte Besuche, nie in der Vorschau
  if (!admin) {
    const erstes = !(einladung.aufrufe > 0);
    await db.Einladung.update(einladung.id, { aufrufe: (einladung.aufrufe || 0) + 1, zuletztGeoeffnet: new Date().toISOString(), fehlversuche: 0 }).catch(() => null);
    if (erstes) {
      await db.Ereignis.create({ zielId: ziel.id, einladungId: einladung.id, art: 'geoeffnet', von: welle ? 'welle' : 'unternehmen', am: new Date().toISOString(), details: welle ? 'Welle-Code zum ersten Mal geöffnet' : 'Portal zum ersten Mal geöffnet' }).catch(() => null);
      if (!welle && ziel.status === 'versendet') await db.Ziel.update(ziel.id, { status: 'geoeffnet', naechsterSchritt: 'Portal wurde geöffnet — abwarten, nach 10 Tagen ohne Antwort ein kurzer Anruf.' }).catch(() => null);
    }
  }

  const beantwortet = new Set(antworten.map((a) => a.nummer));
  const frei = admin || beantwortet.size >= SCHWELLE_GESPERRT;
  const spiegel = widersprueche
    .filter((w) => w.portal === 'offen' || w.portal === 'gesperrt')
    .sort((a, b) => (a.reihenfolgePortal || a.nummer || 99) - (b.reihenfolgePortal || b.nummer || 99))
    .map((w) => ({
      id: w.id,
      zeile: w.zeile || '',
      gesperrt: w.portal === 'gesperrt' && !frei,
      a: w.portal === 'gesperrt' && !frei ? null : karte(w.portalA, w.belegA),
      b: w.portal === 'gesperrt' && !frei ? null : karte(w.portalB, w.belegB),
    }));

  const t = ziel.portalTexte || {};
  return {
    ok: true,
    vorschau: admin,
    welle,
    unternehmen: ziel.unternehmen,
    ansprache: ziel.ansprache === 'sie' ? 'sie' : 'du',
    entscheider: (ziel.entscheider || [])[0]?.name || '',
    texte: {
      einstiegSatz: t.einstiegSatz || '',
      einstiegFolgt: t.einstiegFolgt || '',
      welleText: t.welleText || '',
      welleWeiterleitung: t.welleWeiterleitung || '',
      rechnerHebel: t.rechnerHebel || '',
      erstgespraechText: t.erstgespraechText || '',
      erstgespraechKontakt: t.erstgespraechKontakt || '',
    },
    spiegel,
    gesperrteKarten: spiegel.filter((s) => s.gesperrt).length,
    schwelle: SCHWELLE_GESPERRT,
    fragen: fragen
      .sort((a, b) => (a.nummer || 0) - (b.nummer || 0))
      .map((f) => ({ nummer: f.nummer, text: welle && f.textWelle ? f.textWelle : f.text, hilfetext: f.hilfetext || '' })),
    antworten: antworten.map((a) => ({ nummer: a.nummer, text: a.text, am: a.beantwortetAm })),
    welleCode: welle ? null : await welleCode(db, ziel, einladung, admin),
    hebel: (ziel.hebel || []).slice(0, 3).map((h) => h.text),
    gueltigBis: einladung.gueltigBis || null,
  };
}

function karte(portal, beleg) {
  if (portal && (portal.text || portal.label)) return { label: portal.label || '', text: portal.text || '', url: portal.url || beleg?.url || '' };
  if (beleg && beleg.text) return { label: beleg.fundstelle || '', text: beleg.text, url: beleg.url || '' };
  return null;
}

// Der Welle-Code gehört zum selben Ziel; gezeigt wird er nur, wenn Alfons ihn freigegeben oder
// versendet hat. In der Vorschau wird er angezeigt, falls vorhanden.
async function welleCode(db, ziel, einladung, admin) {
  const alle = await db.Einladung.filter({ zielId: ziel.id, art: 'welle' });
  const w = alle.find((e) => e.status === 'versendet') || (admin ? alle[0] : null);
  return w ? w.code : null;
}

// ---------------------------------------------------------------------------
// Schreiben
// ---------------------------------------------------------------------------
async function antworten(db, einladung, ziel, body, admin) {
  const nummer = Number(body.nummer);
  const text = String(body.text || '').trim().slice(0, 4000);
  if (!(nummer >= 1 && nummer <= 5) || !text) return { fehler: 'eingabe' };
  if (admin && body.vorschau) return { ok: true, vorschau: true };

  const welle = einladung.art === 'welle';
  const rolle = welle ? (body.rolle === 'kunde' ? 'kunde' : body.rolle === 'mitarbeiter' ? 'mitarbeiter' : 'unbekannt') : 'unternehmen';
  const jetzt = new Date();
  const loeschenAb = new Date(jetzt.getTime() + LOESCHEN_NACH_TAGEN * 86400000).toISOString().slice(0, 10);

  // Das Unternehmen selbst darf eine Antwort überschreiben; Wellen-Antworten sind je Person neu.
  const vorhandene = welle ? [] : await db.Portalantwort.filter({ zielId: ziel.id, einladungId: einladung.id, nummer });
  if (vorhandene[0]) {
    await db.Portalantwort.update(vorhandene[0].id, { text, beantwortetAm: jetzt.toISOString() });
  } else {
    await db.Portalantwort.create({ zielId: ziel.id, einladungId: einladung.id, nummer, text, rolle, beantwortetAm: jetzt.toISOString(), loeschenAb });
  }
  await db.Ereignis.create({ zielId: ziel.id, einladungId: einladung.id, art: 'frage_beantwortet', von: welle ? 'welle' : 'unternehmen', am: jetzt.toISOString(), details: `Frage ${nummer} beantwortet${welle ? ` (${rolle})` : ''}` }).catch(() => null);
  if (!welle && ['versendet', 'geoeffnet'].includes(ziel.status)) {
    await db.Ziel.update(ziel.id, { status: 'antworten', naechsterSchritt: 'Antworten lesen — und das Erstgespräch anbieten, sobald es passt.' }).catch(() => null);
  }
  const alle = await db.Portalantwort.filter({ zielId: ziel.id, einladungId: einladung.id });
  const frei = new Set(alle.map((a) => a.nummer)).size >= SCHWELLE_GESPERRT;
  return { ok: true, beantwortet: alle.length, frei };
}

async function rechner(db, einladung, ziel, body, admin) {
  const budgetMonat = zahl(body.budgetMonat);
  const anfragen = zahl(body.anfragen);
  const auftraege = zahl(body.auftraege);
  if (budgetMonat === null && anfragen === null && auftraege === null) return { fehler: 'eingabe' };
  const kostenJeAnfrage = budgetMonat !== null && anfragen ? Math.round((budgetMonat / anfragen) * 100) / 100 : null;
  const kostenJeAuftrag = budgetMonat !== null && auftraege ? Math.round((budgetMonat / auftraege) * 100) / 100 : null;
  if (admin && body.vorschau) return { ok: true, vorschau: true, kostenJeAnfrage, kostenJeAuftrag };
  const regler = body.regler && typeof body.regler === 'object' ? { r1: zahl(body.regler.r1) ?? 0, r2: zahl(body.regler.r2) ?? 0, r3: zahl(body.regler.r3) ?? 0 } : undefined;
  await db.Rechnerlauf.create({ zielId: ziel.id, einladungId: einladung.id, am: new Date().toISOString(), budgetMonat, anfragen, auftraege, kostenJeAnfrage, kostenJeAuftrag, regler });
  await db.Ereignis.create({ zielId: ziel.id, einladungId: einladung.id, art: 'rechner', von: einladung.art === 'welle' ? 'welle' : 'unternehmen', am: new Date().toISOString(), details: `Rechner: Budget ${budgetMonat ?? '–'}, Anfragen ${anfragen ?? '–'}, Aufträge ${auftraege ?? '–'}` }).catch(() => null);
  return { ok: true, kostenJeAnfrage, kostenJeAuftrag };
}

async function ereignis(db, einladung, ziel, body, admin) {
  const art = String(body.art || '');
  if (!['block', 'welle_geteilt', 'erstgespraech_klick'].includes(art)) return { fehler: 'eingabe' };
  if (admin && body.vorschau) return { ok: true, vorschau: true };
  const block = String(body.block || '').slice(0, 40);
  const dauer = zahl(body.dauerSekunden);
  // Blöcke nur einmal je Einladung festhalten (mit der längsten Verweildauer), sonst füllt sich der Verlauf
  if (art === 'block') {
    const alte = (await db.Ereignis.filter({ zielId: ziel.id, einladungId: einladung.id, art: 'block' })).filter((e) => e.block === block);
    if (alte[0]) {
      if (dauer !== null && dauer > (alte[0].dauerSekunden || 0)) await db.Ereignis.update(alte[0].id, { dauerSekunden: dauer }).catch(() => null);
      return { ok: true };
    }
  }
  await db.Ereignis.create({ zielId: ziel.id, einladungId: einladung.id, art, block: block || undefined, dauerSekunden: dauer ?? undefined, von: einladung.art === 'welle' ? 'welle' : 'unternehmen', am: new Date().toISOString(), details: art === 'erstgespraech_klick' ? 'Erstgespräch angeklickt' : art === 'welle_geteilt' ? 'Welle-Link kopiert' : undefined }).catch(() => null);
  if (art === 'erstgespraech_klick' && einladung.art !== 'welle' && ['versendet', 'geoeffnet', 'antworten'].includes(ziel.status)) {
    await db.Ziel.update(ziel.id, { status: 'erstgespraech', naechsterSchritt: 'Erstgespräch angeklickt — Termin anbieten.' }).catch(() => null);
  }
  return { ok: true };
}

function zahl(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : null;
}
