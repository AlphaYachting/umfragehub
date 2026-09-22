// Derzeit nicht verwendet — Reserve für serverseitige Transkription.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// ============================================================
// KONFIGURATION — Transkriptionsanbieter (einzige Stelle)
// ------------------------------------------------------------
// ANBIETER = "base44"  → eingebaute Whisper-Integration (Standard,
//                        kein API-Key nötig).
// ANBIETER = "extern"  → externer Anbieter. Dafür in den App-
//                        Einstellungen einen Anbieter-Schlüssel
//                        hinterlegen und den externen Zweig unten
//                        aktivieren.
// ============================================================
const ANBIETER = "base44";

export default async function(req) {
  try {
    const body = await req.json();
    const { file_uri } = body;
    if (!file_uri) {
      return Response.json({ error: "Audio-Datei fehlt." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Private Audiodatei über eine kurzlebige signierte URL zugänglich machen
    const { signed_url } = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri,
      expires_in: 120
    });

    let transkript = "";
    if (ANBIETER === "base44") {
      const result = await base44.asServiceRole.integrations.Core.TranscribeAudio({
        audio_url: signed_url
      });
      transkript = typeof result === "string" ? result : (result?.text || "");
    } else {
      // Platzhalter für externe Anbieter — hier fetch gegen die API
      // des gewählten Anbieters implementieren. Schlüssel dann über
      // die Runtime-Secrets der Plattform beziehen.
      throw new Error("Externer Anbieter noch nicht implementiert.");
    }

    // Hinweis: Die Audiodatei liegt im privaten Speicher; die signierte URL
    // verfällt nach 120s. Ein serverseitiges Löschen der Datei ist über das
    // SDK nicht verfügbar — für automatische Löschung eine geplante
    // Bereinigung vorsehen, sobald der Anbieter eine Delete-API bietet.

    return Response.json({ transkript });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}