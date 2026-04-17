import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, useTheme } from "./theme-provider";
import { sfx } from "./sound";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { sfx.click(); setOpen((o) => !o); }}
        aria-label="Pick theme"
        className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 text-muted-foreground hover:text-foreground transition"
      >
        <Palette className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl p-2 z-50 shadow-2xl">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1">Themes</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { sfx.click(); setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-left ${theme === t.id ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}
            >
              <span className="text-base">{t.emoji}</span>
              <span className="flex-1">{t.name}</span>
              {theme === t.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
