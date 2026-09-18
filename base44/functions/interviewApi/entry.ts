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

async function saveAnswer(base44, { sessionToken, frageId, data }) {
  const sListe = await base44.asServiceRole.entities.Session.filter({ token: sessionToken });
  if (!sListe.length) {
    return Response.json({ error: "nicht_gefunden" });
  }
  const session = sListe[0];
  if (session.status === "abgeschlossen") {
    return Response.json({ error: "abgeschlossen" });
  }
  const existing = await base44.asServiceRole.entities.Antwort.filter({ sessionId: session.id, frageId });
  const daten = {
    auswahl: data.auswahl || [],
    zahl: data.zahl,
    text: data.text || "",
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