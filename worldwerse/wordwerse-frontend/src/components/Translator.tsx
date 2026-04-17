import { useState } from "react";
import { Languages, Loader2, X } from "lucide-react";
import { fnUrl, fnHeaders } from "@/lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sfx } from "./sound";

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German", "Japanese",
  "Chinese (Simplified)", "Arabic", "Portuguese", "Bengali", "Tamil", "Telugu",
];

export function Translator({ text, label = "Translate" }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("Hindi");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");

  const run = async () => {
    if (!text?.trim()) return toast.error("Nothing to translate");
    setBusy(true); setOut("");
    try {
      const r = await fetch(fnUrl("ai-generate"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ mode: "translate", content: text, options: { target_language: lang } }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Translation failed");
      setOut(j.data.translation);
      sfx.success();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setOut(""); }}
        className="text-xs px-2 py-1 rounded-md glass hover:bg-white/10 flex items-center gap-1 text-muted-foreground hover:text-foreground"
        title={label}
      >
        <Languages className="h-3 w-3" /> {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3 border-b border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Languages className="h-4 w-4 text-primary" /> Translate
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="px-5 py-3 border-b border-glass-border flex items-center gap-2 flex-wrap">
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-background/80 border border-glass-border rounded-lg px-3 py-1.5 text-sm outline-none">
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={run} disabled={busy} className="px-3 py-1.5 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />} Translate
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {!out && !busy && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Original</p>
                  <pre className="whitespace-pre-wrap text-sm text-foreground/80 leading-relaxed">{text.slice(0, 4000)}{text.length > 4000 ? "…" : ""}</pre>
                </div>
              )}
              {busy && <div className="text-center text-sm text-muted-foreground py-12 flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Translating…</div>}
              {out && (
                <article className="prose prose-invert max-w-none prose-sm prose-headings:text-foreground prose-p:text-foreground/90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{out}</ReactMarkdown>
                </article>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
