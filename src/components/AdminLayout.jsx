import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ClipboardList, Library, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const location = useLocation();
  const navItem = (to, label, icon) => {
    const aktiv = location.pathname === to;
    const Icon = icon;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
          aktiv
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 hidden md:flex">
        <div className="px-2 py-4 mb-2">
          <div className="text-lg font-bold tracking-tight text-slate-900">
            Interview-Plattform
          </div>
          <div className="text-xs text-slate-500">Verwaltung</div>
        </div>
        <nav className="flex flex-col gap-1">
          {navItem("/", "Projekte", ClipboardList)}
          {navItem("/bibliothek", "Fragenbibliothek", Library)}
        </nav>
        <div className="mt-auto pt-4">
          <Link to="/bibliothek">
            <Button variant="outline" className="w-full" size="sm">
              <Plus size={16} className="mr-2" /> Neue Bibliotheksfrage
            </Button>
          </Link>
        </div>
      </aside>

      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex gap-2">
        <Link to="/" className="text-sm font-medium text-slate-700">Projekte</Link>
        <span className="text-slate-300">·</span>
        <Link to="/bibliothek" className="text-sm font-medium text-slate-700">Bibliothek</Link>
      </div>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}