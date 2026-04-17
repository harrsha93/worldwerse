import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { FileText, Loader2, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { sfx } from "@/components/sound";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Subject = { id: string; name: string };
type FileRow = { id: string; name: string; created_at: string; extracted_text: string | null };

export function FilesTab({ subject }: { subject: Subject }) {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [active, setActive] = useState<FileRow | null>(null);
  const [busy, setBusy] = useState<"summary" | "simplify" | null>(null);
  const [output, setOutput] = useState<string>("");

  const refresh = async () => {
    const { data } = await supabase.from("files").select("id, name, created_at, extracted_text").eq("subject_id", subject.id).order("created_at", { ascending: false });
    setFiles((data || []) as FileRow[]);
  };
  useEffect(() => { refresh(); }, [subject.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async (mode: "summary" | "simplify") => {
    if (!active?.extracted_text) return toast.error("This file has no extracted text yet.");
    setBusy(mode); setOutput("");
    try {
      const r = await fetch(fnUrl("ai-generate"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ mode, content: active.extracted_text, options: { subject_name: subject.name } }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || "Failed");
      setOutput(json.data.summary_markdown);
      await logEvent("summarize", subject.id, { file: active.name, mode });
      sfx.success();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <aside className="glass-strong rounded-2xl p-3 max-h-[70vh] overflow-y-auto">
        <p className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">Files in this subject</p>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center p-6">No files yet. <a href="/upload" className="text-primary hover:underline">Upload</a></p>
        ) : (
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.id}>
                <button onClick={() => { setActive(f); setOutput(""); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${active?.id === f.id ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}>
                  <FileText className="h-4 w-4 flex-shrink-0" /> <span className="truncate">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="glass-strong rounded-2xl p-5 min-h-[60vh]">
        {!active ? (
          <div className="text-center text-sm text-muted-foreground py-20">Select a file to view its content and run AI tools.</div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {active.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{active.extracted_text?.length.toLocaleString() || 0} characters extracted</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => generate("summary")} disabled={!!busy} className="px-3 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50">
                  {busy === "summary" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Summarize
                </button>
                <button onClick={() => generate("simplify")} disabled={!!busy} className="px-3 py-2 rounded-lg glass-strong text-sm font-semibold flex items-center gap-1.5 hover:bg-white/10 disabled:opacity-50">
                  {busy === "simplify" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />} Simplify
                </button>
              </div>
            </div>
            {output ? (
              <article className="prose prose-invert max-w-none prose-sm prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              </article>
            ) : (
              <pre className="whitespace-pre-wrap text-xs text-muted-foreground max-h-[55vh] overflow-y-auto leading-relaxed">{active.extracted_text?.slice(0, 8000) || "(empty)"}</pre>
            )}
          </>
        )}
      </section>
    </div>
  );
}
