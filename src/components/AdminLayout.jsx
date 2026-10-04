import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Library } from "lucide-react";
import { Toaster as Meldungen } from "sonner";

export default function AdminLayout() {
  const location = useLocation();
  const pfad = location.pathname;
  // Projekt- und Wellenseiten gehören zum Bereich "Übersicht"
  const istAktiv = (to) =>
    to === "/" ? pfad === "/" || pfad.startsWith("/projekt") || pfad.startsWith("/welle") : pfad.startsWith(to);

  const navItem = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
        istAktiv(to)
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex-col p-4 shrink-0 hidden md:flex md:sticky md:top-0 md:h-screen">
        <Link to="/" className="block px-2 py-4 mb-2">
          <div className="text-lg font-bold tracking-tight text-slate-900">Interview-Plattform</div>
          <div className="text-xs text-slate-500">Verwaltung</div>
        </Link>
        <nav className="flex flex-col gap-1">
          {navItem("/", "Übersicht", LayoutDashboard)}
          {navItem("/bibliothek", "Fragenbibliothek", Library)}
        </nav>
      </aside>

      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex gap-4 sticky top-0 z-10">
        <Link to="/" className={`text-sm font-medium ${istAktiv("/") ? "text-slate-900" : "text-slate-500"}`}>Übersicht</Link>
        <Link to="/bibliothek" className={`text-sm font-medium ${istAktiv("/bibliothek") ? "text-slate-900" : "text-slate-500"}`}>Bibliothek</Link>
      </div>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      {/* Rückmeldungen ("Gespeichert.", "Link kopiert.") — nur in der Verwaltung, nicht bei Befragten */}
      <Meldungen position="bottom-right" closeButton />
    </div>
  );
}
