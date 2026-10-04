import { LayoutDashboard, Library } from "lucide-react";

// Die Navigationspunkte der Verwaltung stehen an genau einer Stelle.
// regel: welche Rolle den Punkt sieht (fehlt sie, sehen ihn alle Angemeldeten).
export const NAVIGATION = [
  {
    key: "arbeit",
    titel: null, // erste Gruppe ohne Titel
    einklappbar: false,
    items: [
      {
        path: "/",
        label: "Übersicht",
        icon: LayoutDashboard,
        // Projekt- und Wellenseiten gehören zur Übersicht
        aktivBei: (pfad) => pfad === "/" || pfad.startsWith("/projekt") || pfad.startsWith("/welle"),
      },
    ],
  },
  {
    key: "werkzeug",
    titel: "Fragen",
    einklappbar: false,
    items: [
      {
        path: "/bibliothek",
        label: "Fragenbibliothek",
        icon: Library,
        aktivBei: (pfad) => pfad.startsWith("/bibliothek"),
      },
    ],
  },
];

export function sichtbareNavigation(user) {
  return NAVIGATION
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.regel || i.regel(user)) }))
    .filter((g) => g.items.length > 0);
}
