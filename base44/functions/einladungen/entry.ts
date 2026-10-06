import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Einladungen und Erinnerungen per E-Mail — Adresslisten je Welle, Vorlagen,
// Versand über einen austauschbaren Kanal.
//
// Grundsätze:
// - Nur für eingeloggte Admins. Befragte kommen mit dieser Funktion nie in Berührung.
// - Zwischen Empfänger und Session/Antwort gibt es KEINE Verknüpfung. Im Modus
//   "persoenlich" wird beim Start nur das Häkchen "gestartet" gesetzt (interviewApi).
// - Wer begonnen hat, verlässt den Server nie je Person — nur als Summe, und je
//   Abteilung erst ab KLEINGRUPPE Personen.
// - Ohne eingerichteten Versandkanal läuft alles als Probelauf: es wird nichts
//   verschickt und kein Empfängerstatus verändert.
//
// Versandkanal: Umgebungsvariable BREVO_API_KEY (bevorzugt) oder RESEND_API_KEY,
// dazu MAIL_ABSENDER (z. B. "Befragung <befragung@beispiel.at>" — bei Brevo muss
// diese Adresse dort als Absender bestätigt sein). Optional APP_URL für die Links.
//
// Layouts (nur Brevo): je Welle kann für Einladung und Erinnerung eine
// transaktionale Brevo-Vorlage gewählt werden. Ohne Auswahl gilt das
// UmfrageHub-Standardlayout im Projekt-Design. Platzhalter im Brevo-Layout siehe
// layoutParams().

const KLEINGRUPPE = 5;
const SEITE = 200;
const STAPEL = 20;
const MAIL_REGEX = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Nicht eingeloggt." }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Nur für Administratoren." }, { status: 403 });

    const body = await req.json();
    const db = base44.asServiceRole.entities;
    const { aktion, wellenId } = body;

    if (aktion === "status") return Response.json(kanalInfo());
    if (aktion === "layouts") return Response.json(await brevoLayouts());
    if (!wellenId) return Response.json({ error: "wellenId fehlt." }, { status: 400 });
    const welle = await db.Welle.get(wellenId);
    if (!welle) return Response.json({ error: "Welle nicht gefunden." }, { status: 404 });

    if (aktion === "uebersicht") return Response.json(await uebersicht(db, welle));
    if (aktion === "importieren") return Response.json(await importieren(db, welle, body));
    if (aktion === "entfernen") return Response.json(await entfernen(db, welle, body));
    if (aktion === "einstellungen") return Response.json(await einstellungen(db, welle, body));
    if (aktion === "vorschau") return Response.json(await vorschau(db, welle, body));
    if (aktion === "senden") return Response.json(await senden(db, welle, body));
    return Response.json({ error: "Unbekannte Aktion." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
function env(name: string): string {
  try {
    return Deno.env.get(name) || "";
  } catch (_e) {
    return "";
  }
}

function kanalInfo() {
  const brevo = env("BREVO_API_KEY");
  const resend = env("RESEND_API_KEY");
  const absender = env("MAIL_ABSENDER");
  const fehlt: string[] = [];
  if (!brevo && !resend) fehlt.push("BREVO_API_KEY");
  if (!absender) fehlt.push("MAIL_ABSENDER");
  const layouts = !!brevo; // Brevo-Layouts lassen sich auch ohne Absender schon auswählen
  if (fehlt.length) return { kanal: "probelauf", bereit: false, absender, fehlt, layouts };
  return { kanal: brevo ? "brevo" : "resend", bereit: true, absender, fehlt, layouts };
}

function absenderTeilen(s: string) {
  const m = /^\s*"?(.*?)"?\s*<([^>]+)>\s*$/.exec(String(s || ""));
  return m && m[1] ? { name: m[1].trim(), email: m[2].trim() } : { email: (m ? m[2] : String(s || "")).trim() };
}

function layoutId(welle, art) {
  if (!env("BREVO_API_KEY")) return null;
  const roh = art === "reminder" ? welle.layoutReminder : welle.layoutEinladung;
  const id = parseInt(String(roh || ""), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

async function alle(entitaet, query, sort = "created_date") {
  const out = [];
  for (let seite = 0; seite < 50; seite++) {
    const teil = await entitaet.filter(query, sort, SEITE, out.length);
    if (!teil || teil.length === 0) break;
    out.push(...teil);
    if (teil.length < SEITE) break;
  }
  return out;
}

function generiereToken(length = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function istPersoenlich(welle) {
  return welle.einladungsModus === "persoenlich";
}

// ---------------------------------------------------------------------------
// Vorlagen
// ---------------------------------------------------------------------------
function standardTexte(welle, projekt) {
  const sie = projekt?.ansprache === "sie";
  const pers = istPersoenlich(welle);
  const anonym = pers
    ? (sie
      ? "Ihre Antworten bleiben anonym: Wir sehen nur, ob Sie teilgenommen haben — nicht, was Sie geantwortet haben."
      : "Deine Antworten bleiben anonym: Wir sehen nur, ob du teilgenommen hast — nicht, was du geantwortet hast.")
    : (sie
      ? "Die Befragung ist anonym: Niemand kann sehen, wer was geantwortet hat."
      : "Die Befragung ist anonym: Niemand kann sehen, wer was geantwortet hat.");
  const reminderAnAlle = pers
    ? ""
    : (sie
      ? "\n\nFalls Sie schon teilgenommen haben: vielen Dank — dann ist diese Nachricht für Sie erledigt."
      : "\n\nFalls du schon mitgemacht hast: vielen Dank — dann ist diese Nachricht für dich erledigt.");
  if (sie) {
    return {
      mailBetreff: "Ihre Sicht auf {{firma}} — kurze Befragung",
      mailText:
        "Guten Tag,\n\nwie sehen Sie {{firma}}? Genau das möchten wir von Ihnen wissen — in einer Befragung, die etwa {{dauer}} Minuten dauert und am Handy genauso funktioniert wie am Computer.\n\n" +
        anonym + " Sie können jederzeit unterbrechen und später weitermachen.{{frist_satz}}",
      reminderBetreff: "Erinnerung: Ihre Sicht auf {{firma}}",
      reminderText:
        "Guten Tag,\n\ndie Befragung zu {{firma}} läuft noch{{frist_bis}}. Je mehr Stimmen zusammenkommen, desto klarer wird das Bild — Ihre fehlt uns noch.\n\nEtwa {{dauer}} Minuten, anonym, am Handy oder am Computer." +
        reminderAnAlle,
    };
  }
  return {
    mailBetreff: "Deine Sicht auf {{firma}} — kurze Befragung",
    mailText:
      "Hallo,\n\nwie siehst du {{firma}}? Genau das möchten wir von dir wissen — in einer Befragung, die etwa {{dauer}} Minuten dauert und am Handy genauso funktioniert wie am Computer.\n\n" +
      anonym + " Du kannst jederzeit unterbrechen und später weitermachen.{{frist_satz}}",
    reminderBetreff: "Erinnerung: Deine Sicht auf {{firma}}",
    reminderText:
      "Hallo,\n\ndie Befragung zu {{firma}} läuft noch{{frist_bis}}. Je mehr Stimmen zusammenkommen, desto klarer wird das Bild — deine fehlt uns noch.\n\nEtwa {{dauer}} Minuten, anonym, am Handy oder am Computer." +
      reminderAnAlle,
  };
}

function texte(welle, projekt) {
  const std = standardTexte(welle, projekt);
  return {
    mailBetreff: welle.mailBetreff || std.mailBetreff,
    mailText: welle.mailText || std.mailText,
    reminderBetreff: welle.reminderBetreff || std.reminderBetreff,
    reminderText: welle.reminderText || std.reminderText,
  };
}

function frageSekunden(typ) {
  switch (typ) {
    case "single_choice":
    case "ja_nein": return 12;
    case "multi_choice": return 20;
    case "skala":
    case "schieberegler":
    case "gegensatzpaar": return 15;
    case "werte_auswahl": return 45;
    case "limbic": return 35;
    case "matrix": return 30;
    case "freitext": return 60;
    default: return 20;
  }
}

async function dauerMinuten(db, welle) {
  const bloecke = await alle(db.Block, { wellenId: welle.id }, "reihenfolge");
  let sekunden = 0;
  for (const b of bloecke) {
    const fragen = await alle(db.Frage, { blockId: b.id }, "reihenfolge");
    for (const f of fragen) sekunden += frageSekunden(f.typ);
  }
  return sekunden ? Math.max(1, Math.round(sekunden / 60)) : (welle.geschaetzteDauerMinuten || 10);
}

function fristText(welle) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(welle.endetAm || ""));
  return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

function platzhalter(text, k) {
  const sie = k.sie;
  const fristSatz = k.frist
    ? (sie ? `\n\nBitte nehmen Sie bis ${k.frist} teil.` : `\n\nBitte mach bis ${k.frist} mit.`)
    : "";
  return String(text || "")
    .replace(/\{\{\s*firma\s*\}\}/gi, k.firma)
    .replace(/\{\{\s*dauer\s*\}\}/gi, String(k.dauer))
    .replace(/\{\{\s*frist_satz\s*\}\}/gi, fristSatz)
    .replace(/\{\{\s*frist_bis\s*\}\}/gi, k.frist ? ` bis ${k.frist}` : "")
    .replace(/\{\{\s*frist\s*\}\}/gi, k.frist || "")
    .replace(/\{\{\s*link\s*\}\}/gi, k.link);
}

function farben(projekt) {
  if (projekt?.theme === "kunde") {
    return { knopf: projekt.farbeSekundaer || "#45d085", akzent: projekt.farbePrimaer || "#1f3a5f" };
  }
  if (projekt?.theme === "rittler") return { knopf: "#45d085", akzent: "#ff3764" };
  return { knopf: "#3a7d5c", akzent: "#1f3a5f" };
}

function knopfTextfarbe(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return "#ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.0762 ? "#ffffff" : "#2d2d2d";
}

// HTML-Mail: Tabellenlayout und Inline-Styles, damit sie in Outlook, Gmail und am Handy gleich aussieht
function mailHtml({ betreff, text, link, projekt, sie }) {
  const f = farben(projekt);
  const firma = projekt?.kundenname || "";
  const absaetze = String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px 0;">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const logo = projekt?.logoUrl
    ? `<img src="${esc(projekt.logoUrl)}" alt="${esc(firma)}" height="40" style="display:block;height:40px;width:auto;border:0;">`
    : `<div style="font-size:18px;font-weight:700;color:${f.akzent};">${esc(firma)}</div>`;
  const rechtliches = [
    projekt?.datenschutzUrl ? `<a href="${esc(projekt.datenschutzUrl)}" style="color:#8a8f98;">Datenschutz</a>` : "",
    projekt?.impressumUrl ? `<a href="${esc(projekt.impressumUrl)}" style="color:#8a8f98;">Impressum</a>` : "",
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");
  const grund = sie
    ? `Sie erhalten diese Nachricht, weil ${esc(firma || "Ihr Unternehmen")} Sie zu dieser Befragung eingeladen hat.`
    : `Du erhältst diese Nachricht, weil ${esc(firma || "dein Unternehmen")} dich zu dieser Befragung eingeladen hat.`;
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(betreff)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;">
<tr><td style="padding:28px 32px 8px 32px;">${logo}</td></tr>
<tr><td style="padding:16px 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#2d2d2d;">${absaetze}</td></tr>
<tr><td style="padding:8px 32px 28px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:${f.knopf};">
<a href="${esc(link)}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:${knopfTextfarbe(f.knopf)};text-decoration:none;border-radius:8px;">Zur Befragung</a>
</td></tr></table>
<p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#8a8f98;">Falls der Knopf nicht funktioniert:<br><a href="${esc(link)}" style="color:#8a8f98;word-break:break-all;">${esc(link)}</a></p>
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#8a8f98;">${grund}${rechtliches ? `<br>${rechtliches}` : ""}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function mailNurText({ text, link }) {
  return `${text}\n\nZur Befragung: ${link}`;
}

function basisUrl(body) {
  const url = env("APP_URL") || String(body.basisUrl || "");
  return url.replace(/\/+$/, "");
}

function linkFuer(welle, basis, empfaenger) {
  const url = `${basis}/i/${welle.linkToken}`;
  return istPersoenlich(welle) && empfaenger?.token ? `${url}?e=${empfaenger.token}` : url;
}

// Werte, die ein Brevo-Layout als {{ params.NAME }} verwenden kann.
// TEXT_HTML enthält Absätze als HTML — im Layout so einsetzen:
// {% autoescape off %}{{ params.TEXT_HTML }}{% endautoescape %}
function layoutParams({ betreff, text, link, projekt, k, art }) {
  const f = farben(projekt);
  const absaetze = String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px 0;">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const firma = projekt?.kundenname || "";
  return {
    BETREFF: betreff,
    TEXT: text,
    TEXT_HTML: absaetze,
    LINK: link,
    KNOPF_TEXT: "Zur Befragung",
    FIRMA: firma,
    DAUER: String(k.dauer),
    FRIST: k.frist || "",
    LOGO_URL: projekt?.logoUrl || "",
    KNOPF_FARBE: f.knopf,
    KNOPF_TEXTFARBE: knopfTextfarbe(f.knopf),
    AKZENT_FARBE: f.akzent,
    DATENSCHUTZ_URL: projekt?.datenschutzUrl || "",
    IMPRESSUM_URL: projekt?.impressumUrl || "",
    ART: art === "reminder" ? "erinnerung" : "einladung",
    GRUND: k.sie
      ? `Sie erhalten diese Nachricht, weil ${firma || "Ihr Unternehmen"} Sie zu dieser Befragung eingeladen hat.`
      : `Du erhältst diese Nachricht, weil ${firma || "dein Unternehmen"} dich zu dieser Befragung eingeladen hat.`,
  };
}

async function mailBauen(db, welle, projekt, art, basis, empfaenger, entwurf, dauer) {
  const t = { ...texte(welle, projekt), ...(entwurf || {}) };
  const reminder = art === "reminder";
  const link = linkFuer(welle, basis, empfaenger);
  const k = {
    firma: projekt?.kundenname || "das Unternehmen",
    dauer,
    frist: fristText(welle),
    link,
    sie: projekt?.ansprache === "sie",
  };
  const betreff = platzhalter(reminder ? t.reminderBetreff : t.mailBetreff, k);
  const text = platzhalter(reminder ? t.reminderText : t.mailText, k);
  return {
    betreff,
    html: mailHtml({ betreff, text, link, projekt, sie: k.sie }),
    text: mailNurText({ text, link }),
    layoutId: layoutId(welle, reminder ? "reminder" : "einladung"),
    params: layoutParams({ betreff, text, link, projekt, k, art }),
  };
}

// --- Brevo-Layouts ----------------------------------------------------------
async function brevoAbruf(pfad: string) {
  const r = await fetch(`https://api.brevo.com/v3${pfad}`, {
    headers: { "api-key": env("BREVO_API_KEY"), "accept": "application/json" },
  });
  if (!r.ok) throw new Error(`Brevo antwortet mit ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return await r.json();
}

async function brevoLayouts() {
  if (!env("BREVO_API_KEY")) return { layouts: [], verfuegbar: false };
  const out = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const d = await brevoAbruf(`/smtp/templates?templateStatus=true&limit=100&offset=${offset}&sort=desc`);
    const teil = Array.isArray(d?.templates) ? d.templates : [];
    for (const t of teil) {
      out.push({ id: String(t.id), name: t.name || `Vorlage ${t.id}`, betreff: t.subject || "", geaendert: t.modifiedAt || "" });
    }
    if (teil.length < 100) break;
  }
  return { layouts: out, verfuegbar: true };
}

// Näherungsweise Darstellung eines Brevo-Layouts für die Vorschau: ersetzt
// {{ params.NAME }}; Bedingungen und Schleifen der Brevo-Vorlagensprache werden
// nicht ausgewertet. Verbindlich ist die Testmail.
function brevoVorschau(html: string, params: Record<string, string>) {
  const ersetze = (s: string, roh: boolean) =>
    s.replace(/\{\{\s*params\.([A-Za-z0-9_]+)\s*(\|[^}]*)?\}\}/g, (_m, name) => {
      const wert = String(params[name] ?? "");
      return roh ? wert : esc(wert);
    });
  const teile = String(html || "").split(/(\{%\s*autoescape\s+off\s*%\}[\s\S]*?\{%\s*endautoescape\s*%\})/i);
  return teile
    .map((t) => {
      const m = /^\{%\s*autoescape\s+off\s*%\}([\s\S]*?)\{%\s*endautoescape\s*%\}$/i.exec(t);
      return m ? ersetze(m[1], true) : ersetze(t, false);
    })
    .join("")
    .replace(/\{%[^%]*%\}/g, "");
}

// ---------------------------------------------------------------------------
// Aktionen
// ---------------------------------------------------------------------------
async function uebersicht(db, welle) {
  const projekt = await db.Projekt.get(welle.projektId);
  const empfaenger = await alle(db.Empfaenger, { wellenId: welle.id });
  const pers = istPersoenlich(welle);

  const zahlen = { gesamt: 0, neu: 0, eingeladen: 0, fehler: 0, gestartet: pers ? 0 : null, erinnerbar: 0 };
  const gruppen = {};
  for (const e of empfaenger) {
    const name = e.abteilung || "Ohne Abteilung";
    if (!gruppen[name]) gruppen[name] = { name, gesamt: 0, neu: 0, eingeladen: 0, fehler: 0, gestartet: 0 };
    const g = gruppen[name];
    const st = e.versandStatus || "neu";
    zahlen.gesamt++;
    g.gesamt++;
    zahlen[st]++;
    g[st]++;
    if (pers && e.gestartet) {
      zahlen.gestartet++;
      g.gestartet++;
    }
    if (st === "eingeladen" && !(pers && e.gestartet)) zahlen.erinnerbar++;
  }
  // Je Abteilung: "begonnen" nur bei persönlichem Link und nur ab KLEINGRUPPE Personen
  const abteilungen = Object.values(gruppen)
    .map((g: any) => ({ ...g, gestartet: pers && g.gesamt >= KLEINGRUPPE ? g.gestartet : null }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const log = await db.Versand.filter({ wellenId: welle.id }, "-created_date", 20);

  return {
    kanal: kanalInfo(),
    modus: pers ? "persoenlich" : "gemeinsam",
    wellenStatus: welle.status,
    texte: texte(welle, projekt),
    eigeneTexte: !!(welle.mailBetreff || welle.mailText || welle.reminderBetreff || welle.reminderText),
    layouts: { einladung: welle.layoutEinladung || "", reminder: welle.layoutReminder || "" },
    zahlen,
    abteilungen,
    kleingruppe: KLEINGRUPPE,
    // Bewusst ohne "gestartet" je Person
    empfaenger: empfaenger.map((e) => ({
      id: e.id,
      email: e.email,
      abteilung: e.abteilung || "",
      versandStatus: e.versandStatus || "neu",
      fehlerText: e.fehlerText || "",
      anzahlErinnerungen: e.anzahlErinnerungen || 0,
    })),
    versandlog: log.map((v) => ({
      id: v.id,
      art: v.art,
      kanal: v.kanal,
      abteilung: v.abteilung || "",
      anzahl: v.anzahl || 0,
      erfolgreich: v.erfolgreich || 0,
      fehlgeschlagen: v.fehlgeschlagen || 0,
      layout: v.layout || "",
      zeitpunkt: v.created_date,
    })),
  };
}

async function eingeladenAktualisieren(db, welle) {
  const anzahl = (await alle(db.Empfaenger, { wellenId: welle.id })).length;
  if (anzahl > 0) await db.Welle.update(welle.id, { eingeladen: anzahl });
  return anzahl;
}

async function importieren(db, welle, { eintraege, standardAbteilung }) {
  if (!Array.isArray(eintraege) || eintraege.length === 0) return { error: "Keine Adressen übergeben." };
  if (eintraege.length > 2000) return { error: "Höchstens 2000 Adressen je Import." };
  const vorhanden = new Set((await alle(db.Empfaenger, { wellenId: welle.id })).map((e) => String(e.email).toLowerCase()));
  const neu = [];
  const ungueltig: string[] = [];
  let doppelt = 0;
  for (const roh of eintraege) {
    const email = String(roh?.email || "").trim().toLowerCase();
    if (!email) continue;
    if (!MAIL_REGEX.test(email)) {
      ungueltig.push(email);
      continue;
    }
    if (vorhanden.has(email)) {
      doppelt++;
      continue;
    }
    vorhanden.add(email);
    neu.push({
      wellenId: welle.id,
      email,
      abteilung: String(roh?.abteilung || standardAbteilung || "").trim(),
      token: generiereToken(),
      versandStatus: "neu",
      anzahlErinnerungen: 0,
      gestartet: false,
    });
  }
  for (let i = 0; i < neu.length; i += 100) {
    await db.Empfaenger.bulkCreate(neu.slice(i, i + 100));
  }
  const gesamt = await eingeladenAktualisieren(db, welle);
  return { neu: neu.length, doppelt, ungueltig: ungueltig.slice(0, 50), ungueltigAnzahl: ungueltig.length, gesamt };
}

async function entfernen(db, welle, { ids, alleAdressen }) {
  if (alleAdressen) {
    await db.Empfaenger.deleteMany({ wellenId: welle.id });
    return { entfernt: "alle", gesamt: 0 };
  }
  if (!Array.isArray(ids) || !ids.length) return { error: "Nichts ausgewählt." };
  let entfernt = 0;
  for (const id of ids) {
    const e = await db.Empfaenger.get(id);
    // Nur Adressen dieser Welle
    if (e && e.wellenId === welle.id) {
      await db.Empfaenger.delete(id);
      entfernt++;
    }
  }
  const gesamt = await eingeladenAktualisieren(db, welle);
  return { entfernt, gesamt };
}

async function einstellungen(db, welle, body) {
  const daten: Record<string, string> = {};
  if (body.einladungsModus === "gemeinsam" || body.einladungsModus === "persoenlich") {
    daten.einladungsModus = body.einladungsModus;
  }
  for (const feld of ["mailBetreff", "mailText", "reminderBetreff", "reminderText"]) {
    if (typeof body[feld] === "string") daten[feld] = body[feld];
  }
  // Layout: leer = UmfrageHub-Standard, sonst die ID einer Brevo-Vorlage
  for (const feld of ["layoutEinladung", "layoutReminder"]) {
    if (typeof body[feld] === "string" && /^\d{0,10}$/.test(body[feld])) daten[feld] = body[feld];
  }
  if (Object.keys(daten).length) await db.Welle.update(welle.id, daten);
  return { ok: true };
}

async function vorschau(db, welle, body) {
  const projekt = await db.Projekt.get(welle.projektId);
  const dauer = await dauerMinuten(db, welle);
  const basis = basisUrl(body);
  const beispiel = istPersoenlich(welle) ? { token: "BEISPIEL" } : null;
  const mail = await mailBauen(db, welle, projekt, body.art === "reminder" ? "reminder" : "einladung", basis, beispiel, body.entwurf, dauer);
  if (mail.layoutId) {
    try {
      const vorlage = await brevoAbruf(`/smtp/templates/${mail.layoutId}`);
      return {
        betreff: mail.betreff,
        html: brevoVorschau(vorlage.htmlContent, mail.params),
        layout: vorlage.name || `Vorlage ${mail.layoutId}`,
        hinweis: "Brevo-Layout, näherungsweise dargestellt — verbindlich ist die Testmail.",
      };
    } catch (e) {
      return { betreff: mail.betreff, html: mail.html, hinweis: `Brevo-Layout nicht abrufbar (${e.message}) — gezeigt wird das Standardlayout.` };
    }
  }
  return { betreff: mail.betreff, html: mail.html, layout: "UmfrageHub-Standard" };
}

// --- Versandkanal Brevo -----------------------------------------------------
// Erwartet [{ an, betreff, html, text, layoutId, params }] und liefert je Mail
// { ok, fehler }. Einzelaufrufe (in kleinen Gruppen parallel), damit eine
// fehlerhafte Adresse die anderen nicht blockiert; das Ratenlimit des
// Versand-Endpunkts liegt weit darüber.
async function sendeMitBrevo(mails, absender, art) {
  const kopf = { "api-key": env("BREVO_API_KEY"), "Content-Type": "application/json", "accept": "application/json" };
  const sender = absenderTeilen(absender);
  const nutzlast = (m) => {
    const n: Record<string, unknown> = {
      sender,
      to: [{ email: m.an }],
      subject: m.betreff,
      tags: ["umfragehub", art],
    };
    if (m.layoutId) {
      n.templateId = m.layoutId;
      n.params = m.params;
    } else {
      n.htmlContent = m.html;
      n.textContent = m.text;
    }
    return n;
  };
  const einzeln = async (m) => {
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: kopf, body: JSON.stringify(nutzlast(m)) });
      if (r.ok) return { ok: true, fehler: "" };
      const t = await r.text();
      if (r.status === 401 || r.status === 403) {
        throw Object.assign(new Error(`Brevo lehnt die Anmeldung ab (${r.status}): ${t.slice(0, 200)}`), { abbruch: true });
      }
      return { ok: false, fehler: `${r.status}: ${t.slice(0, 160)}` };
    } catch (e) {
      if (e.abbruch) throw e;
      return { ok: false, fehler: String(e.message || e).slice(0, 160) };
    }
  };
  const ergebnis = [];
  for (let i = 0; i < mails.length; i += 5) {
    ergebnis.push(...await Promise.all(mails.slice(i, i + 5).map(einzeln)));
  }
  return ergebnis;
}

function sendeUeberKanal(kanal, mails, art) {
  if (kanal.kanal === "brevo") return sendeMitBrevo(mails, kanal.absender, art);
  return sendeMitResend(mails, kanal.absender);
}

// --- Versandkanal Resend ----------------------------------------------------
// Erwartet [{ an, betreff, html, text }] und liefert je Mail { ok, fehler }.
async function sendeMitResend(mails, absender) {
  const key = env("RESEND_API_KEY");
  const kopf = { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" };
  const nutzlast = (m) => ({ from: absender, to: [m.an], subject: m.betreff, html: m.html, text: m.text });

  // Erst als Stapel — das ist ein einziger Aufruf
  const stapel = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: kopf,
    body: JSON.stringify(mails.map(nutzlast)),
  });
  if (stapel.ok) return mails.map(() => ({ ok: true, fehler: "" }));
  if (stapel.status === 401 || stapel.status === 403) {
    const t = await stapel.text();
    throw new Error(`Versanddienst lehnt die Anmeldung ab (${stapel.status}): ${t.slice(0, 200)}`);
  }

  // Stapel abgelehnt (z. B. eine fehlerhafte Adresse) — einzeln senden, damit
  // eine schlechte Adresse nicht alle anderen blockiert
  const ergebnis = [];
  for (const m of mails) {
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: kopf, body: JSON.stringify(nutzlast(m)) });
      if (r.ok) {
        ergebnis.push({ ok: true, fehler: "" });
      } else {
        ergebnis.push({ ok: false, fehler: `${r.status}: ${(await r.text()).slice(0, 160)}` });
      }
    } catch (e) {
      ergebnis.push({ ok: false, fehler: String(e.message || e).slice(0, 160) });
    }
    await new Promise((res) => setTimeout(res, 550)); // Ratenlimit des Dienstes einhalten
  }
  return ergebnis;
}

async function senden(db, welle, body) {
  const art = body.art;
  if (!["einladung", "reminder", "test"].includes(art)) return { error: "Unbekannte Versandart." };
  const kanal = kanalInfo();
  const basis = basisUrl(body);
  if (!basis) return { error: "Adresse der App fehlt (APP_URL)." };
  const projekt = await db.Projekt.get(welle.projektId);
  const dauer = await dauerMinuten(db, welle);
  const pers = istPersoenlich(welle);

  // --- Testversand an eine einzelne Adresse ---------------------------------
  if (art === "test") {
    const an = String(body.testAdresse || "").trim().toLowerCase();
    if (!MAIL_REGEX.test(an)) return { error: "Bitte eine gültige Testadresse angeben." };
    const vorlage = body.vorlage === "reminder" ? "reminder" : "einladung";
    const mail = await mailBauen(db, welle, projekt, vorlage, basis, pers ? { token: "TEST" } : null, body.entwurf, dauer);
    if (!kanal.bereit) {
      await db.Versand.create({ wellenId: welle.id, art: "test", kanal: "probelauf", anzahl: 1, erfolgreich: 0, fehlgeschlagen: 0, betreff: mail.betreff, layout: mail.layoutId ? String(mail.layoutId) : "" });
      return { probelauf: true, wuerdeSenden: 1, beispiele: [an], kanal };
    }
    const [r] = await sendeUeberKanal(kanal, [{ an, ...mail }], "test");
    await db.Versand.create({ wellenId: welle.id, art: "test", kanal: kanal.kanal, anzahl: 1, erfolgreich: r.ok ? 1 : 0, fehlgeschlagen: r.ok ? 0 : 1, betreff: mail.betreff, layout: mail.layoutId ? String(mail.layoutId) : "" });
    return r.ok ? { gesendet: 1, fehler: 0, rest: 0, kanal } : { error: `Testversand fehlgeschlagen: ${r.fehler}` };
  }

  // --- Einladung / Erinnerung -----------------------------------------------
  if (welle.status !== "live") {
    return { error: "Die Welle ist nicht live — der Link in der Mail würde nicht funktionieren. Bitte zuerst freischalten." };
  }
  if (kanal.bereit && /preview-sandbox|localhost|127\.0\.0\.1/.test(basis)) {
    return { error: "Die Links würden auf die Vorschau-Umgebung zeigen. Bitte aus der veröffentlichten App senden oder APP_URL setzen." };
  }

  const laufStart = body.laufStart ? new Date(body.laufStart).getTime() : Date.now();
  const abteilung = typeof body.abteilung === "string" && body.abteilung !== "" ? body.abteilung : null;
  let kandidaten = await alle(db.Empfaenger, { wellenId: welle.id });
  if (abteilung !== null) kandidaten = kandidaten.filter((e) => (e.abteilung || "Ohne Abteilung") === abteilung);

  if (art === "einladung") {
    // Neue Adressen; fehlgeschlagene nur, wenn sie in diesem Lauf noch nicht versucht wurden
    kandidaten = kandidaten.filter((e) => {
      const st = e.versandStatus || "neu";
      if (st === "neu") return true;
      if (st === "fehler") return !e.erinnertAm || new Date(e.erinnertAm).getTime() < laufStart;
      return false;
    });
  } else {
    // Erinnerung: eingeladen, in diesem Lauf noch nicht erinnert — und bei
    // persönlichem Link nur, wer noch nicht begonnen hat
    kandidaten = kandidaten.filter((e) => {
      if ((e.versandStatus || "neu") !== "eingeladen") return false;
      if (pers && e.gestartet) return false;
      return !e.erinnertAm || new Date(e.erinnertAm).getTime() < laufStart;
    });
  }

  if (!kanal.bereit) {
    const beispielMail = await mailBauen(db, welle, projekt, art, basis, kandidaten[0], null, dauer);
    await db.Versand.create({
      wellenId: welle.id, art, kanal: "probelauf", abteilung: abteilung || "",
      anzahl: kandidaten.length, erfolgreich: 0, fehlgeschlagen: 0, betreff: beispielMail.betreff,
    });
    return { probelauf: true, wuerdeSenden: kandidaten.length, beispiele: kandidaten.slice(0, 3).map((e) => e.email), rest: 0, kanal };
  }

  const stapel = kandidaten.slice(0, STAPEL);
  if (stapel.length === 0) return { gesendet: 0, fehler: 0, rest: 0, kanal };

  const mails = [];
  for (const e of stapel) {
    const mail = await mailBauen(db, welle, projekt, art, basis, e, null, dauer);
    mails.push({ an: e.email, ...mail });
  }
  const ergebnis = await sendeUeberKanal(kanal, mails, art);

  const jetzt = new Date().toISOString();
  let gesendet = 0;
  let fehler = 0;
  for (let i = 0; i < stapel.length; i++) {
    const e = stapel[i];
    const r = ergebnis[i];
    if (r.ok) {
      gesendet++;
      if (art === "einladung") {
        await db.Empfaenger.update(e.id, { versandStatus: "eingeladen", eingeladenAm: jetzt, fehlerText: "" });
      } else {
        await db.Empfaenger.update(e.id, { erinnertAm: jetzt, anzahlErinnerungen: (e.anzahlErinnerungen || 0) + 1 });
      }
    } else {
      fehler++;
      if (art === "einladung") {
        // erinnertAm dient hier als "zuletzt versucht", damit derselbe Lauf die Adresse nicht erneut anfasst
        await db.Empfaenger.update(e.id, { versandStatus: "fehler", fehlerText: r.fehler, erinnertAm: jetzt });
      } else {
        await db.Empfaenger.update(e.id, { erinnertAm: jetzt, fehlerText: r.fehler });
      }
    }
  }
  await db.Versand.create({
    wellenId: welle.id, art, kanal: kanal.kanal, abteilung: abteilung || "",
    anzahl: stapel.length, erfolgreich: gesendet, fehlgeschlagen: fehler, betreff: mails[0].betreff,
    layout: mails[0].layoutId ? String(mails[0].layoutId) : "",
  });
  return { gesendet, fehler, rest: kandidaten.length - stapel.length, kanal };
}
