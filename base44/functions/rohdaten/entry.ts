import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Serverseitige Rohdaten-Abfrage — erzwingt die Anonymitätssperre
// (Mindestteilnehmer), bevor auch nur eine Antwort den Server verlässt.
// Nur für eingeloggte Nutzer der App arbeitend.

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    // Auth prüfen, bevor irgendwelche Daten gelesen werden
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }
    const body = await req.json();
    const { wellenId } = body;
    if (!wellenId) {
      return Response.json({ error: "wellenId fehlt." }, { status: 400 });
    }

    const welle = await base44.asServiceRole.entities.Welle.get(wellenId);
    if (!welle) {
      return Response.json({ error: "Welle nicht gefunden." }, { status: 404 });
    }
    const mindest = welle.mindestTeilnehmer ?? 6;

    const sessions = await base44.asServiceRole.entities.Session.filter({ wellenId });
    const abgeschlossenCount = sessions.filter((s) => s.status === "abgeschlossen").length;

    // Schwelle nicht erreicht — keine einzige Antwort ausliefern
    if (abgeschlossenCount < mindest) {
      return Response.json({
        gesperrt: true,
        abgeschlossen: abgeschlossenCount,
        mindest,
      });
    }

    // Schwelle erreicht — Fragen, Antworten und Session-Tokens liefern
    const bloecke = await base44.asServiceRole.entities.Block.filter({ wellenId });
    bloecke.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
    const fragen = [];
    for (const b of bloecke) {
      const fs = await base44.asServiceRole.entities.Frage.filter({ blockId: b.id });
      fs.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
      fragen.push(...fs);
    }

    // Antworten aller Sessions (auch Abbrecher), jeweils mit Token und
    // Abschluss-Kennzeichnung angereichert
    const alleAntworten = [];
    for (const s of sessions) {
      const abgeschlossen = s.status === "abgeschlossen";
      const as = await base44.asServiceRole.entities.Antwort.filter({ sessionId: s.id });
      for (const a of as) {
        alleAntworten.push({
          id: a.id,
          sessionId: a.sessionId,
          frageId: a.frageId,
          auswahl: a.auswahl,
          zahl: a.zahl,
          text: a.text,
          matrixWerte: a.matrixWerte,
          eingabeart: a.eingabeart,
          transkriptKorrigiert: a.transkriptKorrigiert,
          session_token: s.token,
          session_abgeschlossen: abgeschlossen,
        });
      }
    }

    return Response.json({
      gesperrt: false,
      abgeschlossen: abgeschlossenCount,
      mindest,
      fragen,
      antworten: alleAntworten,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}