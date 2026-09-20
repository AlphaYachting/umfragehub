import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Öffentliche Interview-API — läuft als Service-Rolle, damit anonyme
// Teilnehmer (ohne Login) Wellen lesen, Sessions starten, Antworten
// speichern und abschließen können. Zugriffskontrolle ausschließlich
// über die zufälligen linkToken / sessionToken.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { aktion } = body;

    if (aktion === "load") {
      return await loadInterview(base44, body);
    }
    if (aktion === "start") {
      return await startSession(base44, body);
    }
    if (aktion === "resume") {
      return await resumeSession(base44, body);
    }
    if (aktion === "saveAnswer") {
      return await saveAnswer(base44, body);
    }
    if (aktion === "complete") {
      return await completeSession(base44, body);
    }
    return Response.json({ error: "Unbekannte Aktion." });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}

async function loadInterview(base44, { linkToken, sessionToken }) {
  const wellen = await base44.asServiceRole.entities.Welle.filter({ linkToken });
  if (!wellen.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const welle = wellen[0];
  const projekt = await base44.asServiceRole.entities.Projekt.get(welle.projektId);
  const bloecke = await base44.asServiceRole.entities.Block.filter({ wellenId: welle.id });
  bloecke.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
  const bloeckeMitFragen = [];
  for (const b of bloecke) {
    const fragen = await base44.asServiceRole.entities.Frage.filter({ blockId: b.id });
    fragen.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
    bloeckeMitFragen.push({ ...b, fragen });
  }
  let session = null;
  let antworten = [];
  if (sessionToken) {
    const sListe = await base44.asServiceRole.entities.Session.filter({ token: sessionToken, wellenId: welle.id });
    if (sListe.length) {
      session = sListe[0];
      antworten = await base44.asServiceRole.entities.Antwort.filter({ sessionId: session.id });
    }
  }
  return Response.json({
    welle,
    projekt,
    bloecke: bloeckeMitFragen,
    session,
    antworten,
  });
}

function generiereToken(length = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}

async function startSession(base44, { linkToken }) {
  const wellen = await base44.asServiceRole.entities.Welle.filter({ linkToken });
  if (!wellen.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const welle = wellen[0];
  if (welle.status === "entwurf") {
    return Response.json({ error: "entwurf" });
  }
  if (welle.status === "geschlossen") {
    return Response.json({ error: "geschlossen" });
  }
  const token = generiereToken();
  const jetzt = new Date().toISOString();
  const session = await base44.asServiceRole.entities.Session.create({
    wellenId: welle.id,
    token,
    status: "gestartet",
    startedAt: jetzt,
    letzteFrageId: "",
  });
  return Response.json({ sessionToken: token, sessionId: session.id, startedAt: jetzt });
}

async function resumeSession(base44, { sessionToken }) {
  const sListe = await base44.asServiceRole.entities.Session.filter({ token: sessionToken });
  if (!sListe.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const session = sListe[0];
  const antworten = await base44.asServiceRole.entities.Antwort.filter({ sessionId: session.id });
  return Response.json({ session, antworten });
}

// Lädt alle Fragen einer Welle (über ihre Blöcke) und indiziert sie nach ID
async function fragenDerWelle(base44, welle) {
  const bloecke = await base44.asServiceRole.entities.Block.filter({ wellenId: welle.id });
  const fragen = {};
  for (const b of bloecke) {
    const liste = await base44.asServiceRole.entities.Frage.filter({ blockId: b.id });
    for (const f of liste) fragen[f.id] = f;
  }
  return fragen;
}

// Serverseitige Mindestprüfung einer Antwort gegen den Fragetyp
function validiereAntwort(frage, data) {
  const typ = frage.typ;
  const min = frage.skalaMin ?? 1;
  const max = frage.skalaMax ?? 5;
  if (typ === "single_choice" || typ === "multi_choice" || typ === "werte_auswahl" || typ === "limbic" || typ === "ja_nein") {
    // Auswahl muss Teil der erlaubten Optionen sein (bei ja_nein: Ja/Nein)
    const erlaubt = typ === "ja_nein" ? ["Ja", "Nein"] : (frage.optionen || []);
    const auswahl = data.auswahl || [];
    for (const a of auswahl) {
      if (!erlaubt.includes(a)) return `Ungültige Auswahl: ${a}`;
    }
  }
  if (typ === "skala" || typ === "schieberegler" || typ === "gegensatzpaar") {
    if (data.zahl !== undefined && data.zahl !== null && data.zahl !== "") {
      const z = Number(data.zahl);
      if (isNaN(z)) return "Wert ist keine Zahl";
      const gMin = typ === "gegensatzpaar" ? 0 : min;
      const gMax = typ === "gegensatzpaar" ? 100 : max;
      if (z < gMin || z > gMax) return `Wert außerhalb des Bereichs (${gMin}–${gMax})`;
    }
  }
  if (typ === "matrix") {
    const werte = data.matrixWerte || {};
    const zeilen = frage.matrixZeilen || [];
    for (const [idx, stufe] of Object.entries(werte)) {
      const s = Number(stufe);
      if (isNaN(s) || s < min || s > max) return `Matrix-Stufe für Zeile ${idx} außerhalb des Bereichs`;
    }
    if (zeilen.length && !zeilen.every((_, i) => werte[String(i)] === undefined || werte[String(i)] === null)) {
      // teilweise beantwortet ist erlaubt — nur Bereich prüfen
    }
  }
  return null;
}

async function saveAnswer(base44, { sessionToken, frageId, data }) {
  const sListe = await base44.asServiceRole.entities.Session.filter({ token: sessionToken });
  if (!sListe.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const session = sListe[0];
  if (session.status === "abgeschlossen") {
    return Response.json({ error: "abgeschlossen" });
  }
  // Frage muss zu dieser Welle gehören
  const welle = await base44.asServiceRole.entities.Welle.get(session.wellenId);
  const fragen = await fragenDerWelle(base44, welle);
  const frage = fragen[frageId];
  if (!frage) {
    return Response.json({ error: "frage_nicht_in_welle" });
  }
  // Werttyp prüfen
  const fehler = validiereAntwort(frage, data);
  if (fehler) {
    return Response.json({ error: `antwort_ungueltig`, details: fehler });
  }
  const existing = await base44.asServiceRole.entities.Antwort.filter({ sessionId: session.id, frageId });
  const daten = {
    auswahl: data.auswahl || [],
    zahl: data.zahl,
    text: data.text || "",
    matrixWerte: data.matrixWerte || null,
    eingabeart: data.eingabeart || "tippen",
    transkriptKorrigiert: !!data.transkriptKorrigiert,
  };
  if (existing.length) {
    await base44.asServiceRole.entities.Antwort.update(existing[0].id, daten);
  } else {
    await base44.asServiceRole.entities.Antwort.create({ sessionId: session.id, frageId, ...daten });
  }
  await base44.asServiceRole.entities.Session.update(session.id, { letzteFrageId: frageId });
  return Response.json({ ok: true });
}

async function completeSession(base44, { sessionToken }) {
  const sListe = await base44.asServiceRole.entities.Session.filter({ token: sessionToken });
  if (!sListe.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const session = sListe[0];
  await base44.asServiceRole.entities.Session.update(session.id, {
    status: "abgeschlossen",
    completedAt: new Date().toISOString(),
  });
  return Response.json({ ok: true });
}