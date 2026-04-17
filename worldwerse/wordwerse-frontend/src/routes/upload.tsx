import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Upload as UploadIcon, FileText, Loader2, Sparkles, ArrowRight, Trash2 } from "lucide-react";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { sfx } from "@/components/sound";
import { toast } from "sonner";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload · WordWerse" }, { name: "description", content: "Upload PDFs, DOCX or text notes to your AI study universe." }] }),
});

type Subject = { id: string; name: string; slug: string };
type FileRow = { id: string; name: string; size: number | null; created_at: string; subject_id: string | null; storage_path: string };

function UploadPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState<string>("");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [{ data: subs }, { data: fs }] = await Promise.all([
      supabase.from("subjects").select("id, name, slug").order("name"),
      supabase.from("files").select("id, name, size, created_at, subject_id, storage_path").order("created_at", { ascending: false }).limit(50),
    ]);
    setSubjects((subs || []) as Subject[]);
    setFiles((fs || []) as FileRow[]);
    if (!subjectId && subs && subs.length) setSubjectId(subs[0].id);
  }, [subjectId]);

  useEffect(() => { refresh(); }, [refresh]);

  const onFiles = async (list: FileList | null) => {
    if (!list || !list.length) return;
    setBusy(true);
    for (const file of Array.from(list)) {
      try {
        setProgress(`Uploading ${file.name}…`);
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("study-materials").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { data: row, error: insErr } = await supabase.from("files").insert({
          name: file.name,
          mime_type: file.type,
          size: file.size,
          storage_path: path,
          subject_id: subjectId || null,
        }).select().single();
        if (insErr) throw insErr;

        setProgress(`Extracting text from ${file.name}…`);
        const r = await fetch(fnUrl("extract-text"), {
          method: "POST",
          headers: fnHeaders(),
          body: JSON.stringify({ file_id: row.id, storage_path: path, mime_type: file.type, name: file.name }),
        });
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Extraction failed");
        await logEvent("upload", subjectId || null, { name: file.name, length: json.length });
        sfx.success();
        toast.success(`${file.name} ready · ${json.length.toLocaleString()} chars`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        toast.error(msg);
      }
    }
    setProgress(null);
    setBusy(false);
    refresh();
  };

  const remove = async (f: FileRow) => {
    if (!confirm(`Delete ${f.name}?`)) return;
    await supabase.storage.from("study-materials").remove([f.storage_path]);
    await supabase.from("files").delete().eq("id", f.id);
    sfx.click();
    refresh();
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight"><span className="text-gradient">Upload</span> study materials</h1>
          <p className="text-muted-foreground mt-1">PDF, DOCX, TXT — text is extracted automatically and ready for AI tools.</p>
        </div>

        <div className="glass-strong rounded-2xl p-5 mb-6">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Assign to subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="mt-1 block w-full sm:w-72 bg-background/50 border border-glass-border rounded-lg px-3 py-2 text-sm"
          >
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
          className={`block glass-strong rounded-2xl border-2 border-dashed border-glass-border p-12 text-center cursor-pointer hover:bg-white/5 transition ${busy ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input type="file" multiple accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" onChange={(e) => onFiles(e.target.files)} />
          <div className="mx-auto h-14 w-14 rounded-2xl bg-cosmic flex items-center justify-center mb-3 animate-float glow">
            {busy ? <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" /> : <UploadIcon className="h-6 w-6 text-primary-foreground" />}
          </div>
          <div className="text-lg font-semibold">Drop files here or click to browse</div>
          <div className="text-sm text-muted-foreground mt-1">Unlimited uploads · processed by Gemini AI</div>
          {progress && <div className="text-xs text-primary mt-3 flex items-center justify-center gap-2"><Sparkles className="h-3 w-3" /> {progress}</div>}
        </label>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Recent files</h2>
          {files.length === 0 ? (
            <div className="text-sm text-muted-foreground glass rounded-xl p-6 text-center">Nothing uploaded yet.</div>
          ) : (
            <ul className="space-y-2">
              {files.map((f) => {
                const sub = subjects.find((s) => s.id === f.subject_id);
                return (
                  <li key={f.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.size ? `${Math.round(f.size / 1024)} KB · ` : ""}{new Date(f.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub && (
                        <Link to="/subjects/$slug" params={{ slug: sub.slug }} className="text-xs px-2 py-1 rounded-md glass hover:bg-white/10 flex items-center gap-1">
                          {sub.name} <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                      <button onClick={() => remove(f)} className="h-8 w-8 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
