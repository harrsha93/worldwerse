import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, BookOpen, Upload, Map, Youtube, Volume2, VolumeX, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/wordwerse-logo.png";
import { sfx } from "./sound";
import { ThemePicker } from "./ThemePicker";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/discover", label: "Discover", icon: Youtube },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    const s = typeof window !== "undefined" ? localStorage.getItem("ww-sound") : null;
    setSound(s !== "off");
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    try { localStorage.setItem("ww-sound", next ? "on" : "off"); } catch {}
    if (next) sfx.click();
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Cosmic background layer */}
      <div className="fixed inset-0 -z-10 stars opacity-40 dark:opacity-100 pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40 glass border-b border-glass-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => sfx.click()}>
            <img src={logo} alt="WordWerse logo" className="h-9 w-9 animate-float drop-shadow-[0_0_12px_rgba(120,180,255,0.6)]" width={36} height={36} />
            <span className="font-bold text-lg tracking-tight text-gradient">WordWerse</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = loc.pathname === n.to || (n.to !== "/" && loc.pathname.startsWith(n.to));
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => sfx.click()}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    active
                      ? "bg-primary/15 text-primary glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-muted-foreground hover:text-foreground transition"
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <ThemePicker />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
              className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-foreground transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-glass-border glass">
            <nav className="mx-auto max-w-7xl px-4 py-2 flex flex-col gap-1">
              {nav.map((n) => {
                const active = loc.pathname === n.to;
                const Icon = n.icon;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => { sfx.click(); setOpen(false); }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${
                      active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-glass-border mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> WordWerse — Your AI knowledge universe</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
