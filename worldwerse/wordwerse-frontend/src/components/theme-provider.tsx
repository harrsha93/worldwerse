import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "royal" | "forest" | "desert" | "sky" | "cartoon";

export const THEMES: { id: Theme; name: string; emoji: string }[] = [
  { id: "dark", name: "Cosmic Dark", emoji: "🌌" },
  { id: "light", name: "Crystal Light", emoji: "✨" },
  { id: "royal", name: "Royal", emoji: "👑" },
  { id: "forest", name: "Forest", emoji: "🌲" },
  { id: "desert", name: "Desert", emoji: "🏜️" },
  { id: "sky", name: "Sky", emoji: "☁️" },
  { id: "cartoon", name: "Cartoon School", emoji: "🎨" },
];

const DARK_THEMES: Theme[] = ["dark", "royal", "forest"];

type ThemeCtx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("ww-theme")) as Theme | null;
    if (stored && THEMES.some((t) => t.id === stored)) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // Remove all theme classes
    THEMES.forEach((t) => root.classList.remove(`theme-${t.id}`));
    root.classList.remove("dark", "light");
    // Apply selected theme class
    root.classList.add(`theme-${theme}`);
    // Toggle dark variant for shadcn
    if (DARK_THEMES.includes(theme)) root.classList.add("dark");
    else root.classList.add("light");
    try { localStorage.setItem("ww-theme", theme); } catch {}
  }, [theme]);

  const toggle = () =>
    setTheme((t) => {
      const idx = THEMES.findIndex((x) => x.id === t);
      return THEMES[(idx + 1) % THEMES.length].id;
    });

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be inside ThemeProvider");
  return c;
}
