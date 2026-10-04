// Statusfarbe entsteht nur hier — nie in einer Seite.
export const TON_TEXT = {
  neutral: 'text-foreground',
  info: 'text-status-info',
  attention: 'text-status-attention',
  critical: 'text-status-critical',
  done: 'text-status-done-text',
};

export const TON_STREIFEN = {
  attention: 'shadow-[inset_3px_0_0_hsl(var(--status-attention))]',
  critical: 'shadow-[inset_3px_0_0_hsl(var(--status-critical))]',
  primary: 'shadow-[inset_3px_0_0_hsl(var(--primary))]',
};

export const schweregradZuTon = (s) =>
  s === 'kritisch' ? 'critical' : s === 'warnung' ? 'attention' : 'neutral';

// Fachliche Statuslisten der Befragungssoftware → Ton
export const WELLE_STATUS_TON = { entwurf: 'neutral', live: 'info', geschlossen: 'done' };
export const PROJEKT_STATUS_TON = { entwurf: 'neutral', aktiv: 'info', archiviert: 'neutral' };

// Hinweis einer Welle (gut / warnung / neutral) → Ton
export const HINWEIS_TON = { gut: 'done', warnung: 'attention', neutral: 'neutral' };

// Zielgruppen als Typ-Pille — feste Tonpaare aus dem Agency Manager (Abschnitt 1.6)
export const ZIELGRUPPE_PILLE = {
  geschaeftsfuehrung: { pillBg: '#EEEDFE', pillText: '#3C3489', short: 'Führung' },
  mitarbeiter: { pillBg: '#E6F1FB', pillText: '#0C447C', short: 'Team' },
  kunden: { pillBg: '#E1F5EE', pillText: '#085041', short: 'Kunden' },
  partner: { pillBg: '#FAEEDA', pillText: '#633806', short: 'Partner' },
};
