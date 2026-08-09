"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { logoutAction } from "./actions";

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountFooter({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="px-3 py-4 border-t border-border">
      {userEmail && (
        <p className="px-3 text-xs text-muted-foreground truncate mb-2">{userEmail}</p>
      )}
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Esci
        </button>
      </form>
    </div>
  );
}

export function Sidebar({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Chiude il menu ad ogni cambio pagina e blocca lo scroll dello sfondo mentre è aperto.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Apri il menu"
          className="flex items-center justify-center rounded-lg p-2 -ml-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <p className="font-semibold text-sm">Omnia Marketing</p>
        <div className="size-9" aria-hidden="true" />
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Chiudi il menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-card border-r border-border flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-border">
              <div>
                <p className="font-semibold">Omnia Marketing</p>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi il menu"
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <AccountFooter userEmail={userEmail} />
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-card flex-col h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-border">
          <p className="font-semibold">Omnia Marketing</p>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
        <NavLinks pathname={pathname} />
        <AccountFooter userEmail={userEmail} />
      </aside>
    </>
  );
}
