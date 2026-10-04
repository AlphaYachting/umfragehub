import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, LogOut } from "lucide-react";
import { Toaster as Meldungen } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { sichtbareNavigation } from "@/lib/navigation";
import Kopfsuche from "@/components/Kopfsuche";
import { BestaetigenHost } from "@/components/shared/Bestaetigen";

const MERKER = "umfragehub_leiste_schmal";

function merkerLesen() {
  try {
    return localStorage.getItem(MERKER) === "1";
  } catch (e) {
    return false;
  }
}

// App-Rahmen der Verwaltung: weiße Seitenleiste, Kopfleiste mit Suche, graue Arbeitsfläche.
export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [schmal, setSchmal] = useState(merkerLesen);
  const [mobilOffen, setMobilOffen] = useState(false);
  const gruppen = sichtbareNavigation(user);

  useEffect(() => {
    setMobilOffen(false);
  }, [pathname]);

  function umschalten() {
    const neu = !schmal;
    setSchmal(neu);
    try {
      localStorage.setItem(MERKER, neu ? "1" : "0");
    } catch (e) {
      // ohne Browser-Speicher wird die Wahl nicht gemerkt
    }
  }

  return (
    <div className="flex min-h-screen font-inter">
      {/* Handy: Menü-Taste und Abdunklung */}
      <button
        type="button"
        onClick={() => setMobilOffen(true)}
        className="md:hidden fixed top-3 left-3 z-50 h-9 w-9 inline-flex items-center justify-center rounded-lg bg-background border shadow-md"
        aria-label="Menü öffnen"
      >
        <Menu className="w-4 h-4" />
      </button>
      {mobilOffen && <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobilOffen(false)} />}

      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 h-screen transition-all duration-300",
          "fixed md:sticky top-0 left-0 z-50 md:z-auto",
          schmal ? "md:w-16" : "md:w-64",
          "w-64",
          mobilOffen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <Link to="/" className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm inline-flex items-center justify-center shrink-0">
            R
          </Link>
          {!schmal && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-sidebar-foreground truncate">Rittler &amp; Co</div>
              <div className="text-xs text-muted-foreground truncate">Befragung</div>
            </div>
          )}
          <button
            type="button"
            onClick={umschalten}
            className={cn("hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent shrink-0", schmal && "absolute left-12 top-4 bg-sidebar border border-sidebar-border h-6 w-6")}
            aria-label={schmal ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
            title={schmal ? "Ausklappen" : "Einklappen"}
          >
            {schmal ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {gruppen.map((g) => (
            <div key={g.key} className="space-y-1">
              {g.titel && !schmal && (
                <p className="pt-4 pb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{g.titel}</p>
              )}
              {g.items.map((item) => {
                const aktiv = item.aktivBei ? item.aktivBei(pathname) : pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={schmal ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      schmal && "md:justify-center md:px-0",
                      aktiv
                        ? "bg-sidebar-accent text-sidebar-foreground font-semibold shadow-[inset_3px_0_0_hsl(var(--primary))]"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", aktiv ? "text-sidebar-foreground" : "text-muted-foreground")} />
                    <span className={cn("truncate flex-1", schmal && "md:hidden")}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={cn("p-4 border-t border-sidebar-border flex items-center gap-2 text-xs text-muted-foreground", schmal && "md:justify-center md:px-0")}>
          <span className={cn("truncate flex-1", schmal && "md:hidden")} title={user?.email}>{user?.email || "Angemeldet"}</span>
          <button type="button" onClick={() => logout()} className="shrink-0 hover:text-foreground" title="Abmelden" aria-label="Abmelden">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-canvas">
        <div className="sticky top-0 z-30 bg-background border-b">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-2 flex justify-center pl-14 md:pl-6">
            <Kopfsuche />
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      <BestaetigenHost />
      {/* Kurzmeldung nach einer Aktion — nur in der Verwaltung, nicht bei Befragten */}
      <Meldungen
        position="bottom-right"
        toastOptions={{ classNames: { toast: "bg-background text-foreground border border-border shadow-lg rounded-lg font-inter text-sm" } }}
      />
    </div>
  );
}
