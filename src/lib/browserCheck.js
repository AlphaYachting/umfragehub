// Prüft NUR LOKAL im Browser, ob die Spracheingabe voraussichtlich funktioniert,
// und welcher Browser auf diesem Gerät zu empfehlen ist.
// Es wird nichts davon gespeichert oder übertragen.
//
// Grundlage (Stand Oktober 2026, caniuse „Speech Recognition API“):
//   funktioniert:        Chrome (Computer + Android), Safari (Mac + iPhone/iPad), Samsung Internet
//   funktioniert nicht:  Firefox, Opera am Computer, Brave
//   unsicher:            Edge, Opera am Handy, Chrome am iPhone, in Apps eingebettete Browser
// Sobald eine eigene Aufnahme mit Server-Transkription eingebaut ist, wird dieser Hinweis
// weitgehend überflüssig.

// Beispiel-Kennungen für die Vorschau: ?test=1&browser=firefox (nur im Vorschau-Modus)
const TEST_FAELLE = {
  firefox: {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
    hatErkennung: false,
    touchPunkte: 0,
  },
  "firefox-handy": {
    ua: "Mozilla/5.0 (Android 15; Mobile; rv:143.0) Gecko/143.0 Firefox/143.0",
    hatErkennung: false,
    touchPunkte: 5,
  },
  edge: {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
    hatErkennung: true,
    touchPunkte: 0,
  },
  opera: {
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 OPR/122.0.0.0",
    hatErkennung: true,
    touchPunkte: 0,
  },
  "chrome-iphone": {
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1",
    hatErkennung: true,
    touchPunkte: 5,
  },
  "app-iphone": {
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    hatErkennung: false,
    touchPunkte: 5,
  },
  "app-android": {
    ua: "Mozilla/5.0 (Linux; Android 15; SM-S921B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0.0.0 Mobile Safari/537.36",
    hatErkennung: false,
    touchPunkte: 5,
  },
};

export function browserTestFall(name) {
  return TEST_FAELLE[String(name || "").toLowerCase()] || null;
}

const ANZEIGE_NAMEN = {
  firefox: "Firefox",
  edge: "Edge",
  opera: "Opera",
  brave: "Brave",
  "chrome-ios": "Chrome am iPhone",
};

// Ergebnis: { status: "ok" | "unsicher" | "fehlt", browser, browserName, inApp, empfehlung }
export function spracheingabeCheck(vorgabe) {
  const v = vorgabe || {};
  const hatFenster = typeof window !== "undefined";
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const u = String(v.ua ?? nav.userAgent ?? "");
  const hatErkennung =
    v.hatErkennung ?? (hatFenster && !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const touchPunkte = v.touchPunkte ?? (nav.maxTouchPoints || 0);
  const istBrave = v.ua ? false : !!nav.brave;

  // iPads melden sich als „Macintosh“ — erkennbar am Touchscreen
  const istIOS = /iPhone|iPad|iPod/.test(u) || (/Macintosh/.test(u) && touchPunkte > 1);
  const istAndroid = /Android/i.test(u);
  const istMac = /Macintosh/.test(u) && !istIOS;

  // In Apps eingebettete Browser (Facebook, Instagram, LinkedIn, Google-App, Android-WebView …).
  // Am iPhone fehlt eingebetteten Browsern das „Safari/“ in der Kennung.
  const inApp =
    /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|LinkedInApp|Snapchat|TikTok|musical_ly|GSA\/|; wv\)/.test(u) ||
    (istIOS && !/Safari\//.test(u));

  let browser = "unbekannt";
  if (inApp) browser = "inapp";
  else if (istBrave) browser = "brave";
  else if (/Firefox\/|FxiOS\//.test(u)) browser = "firefox";
  else if (/Edg\/|EdgA\/|EdgiOS\//.test(u)) browser = "edge";
  else if (/OPR\/|OPT\/|Opera/.test(u)) browser = "opera";
  else if (/SamsungBrowser\//.test(u)) browser = "samsung";
  else if (/CriOS\//.test(u)) browser = "chrome-ios";
  else if (/Chrome\/|Chromium\//.test(u)) browser = "chrome";
  else if (/Safari\//.test(u)) browser = "safari";

  let status = "ok";
  if (!hatErkennung) status = "fehlt";
  else if (browser === "firefox" || browser === "brave" || (browser === "opera" && !istAndroid && !istIOS)) status = "fehlt";
  else if (["inapp", "edge", "opera", "chrome-ios"].includes(browser)) status = "unsicher";

  let empfehlung = "Chrome";
  if (istIOS) empfehlung = "Safari";
  else if (istAndroid) empfehlung = "Chrome";
  else if (istMac) empfehlung = "Chrome oder Safari";

  return {
    status,
    // Betriebssystem — entscheidet, ob sich der empfohlene Browser direkt öffnen lässt
    system: istIOS ? "ios" : istAndroid ? "android" : istMac ? "mac" : "computer",
    browser,
    browserName: ANZEIGE_NAMEN[browser] || null,
    inApp,
    empfehlung,
  };
}
