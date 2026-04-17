import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { Map as MapIcon, Sparkles, Loader2, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sfx } from "@/components/sound";

export const Route = createFileRoute("/roadmap")({
  component: RoadmapPage,
  head: () => ({ meta: [{ title: "Learning Roadmap · WordWerse" }, { name: "description", content: "Generate a personalized AI learning roadmap for any subject." }] }),
});

type Subject = { id: string; name: string; slug: string };
type Step = { title: string; description: string; duration: string; resources?: string[] };

function RoadmapPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [level, setLevel] = useState("beginner");
  const [steps, setSteps] = useState<Step[]>([]);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("subjects").select("id, name, slug").order("name").then(({ data }) => {
      setSubjects((data || []) as Subject[]);
      if (data && data.length && !subjectId) setSubjectId(data[0].id);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async () => {
    if (!subjectId) return;
    setBusy(true); setSteps([]);
    try {
      const subjectName = subjects.find((s) => s.id === subjectId)?.name;
      // Pull a sample of extracted text from this subject's files for context
      const { data: ctxFiles } = await supabase.from("files").select("extracted_text").eq("subject_id", subjectId).not("extracted_text", "is", null).limit(3);
      const ctx = (ctxFiles || []).map((f) => f.extracted_text).join("\n\n").slice(0, 8000);

      const r = await fetch(fnUrl("ai-generate"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ mode: "roadmap", content: ctx, options: { subject_name: subjectName, level } }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || "Failed");
      const data = json.data as { title: string; steps: Step[] };
      setTitle(data.title); setSteps(data.steps);
      await supabase.from("roadmaps").insert({ subject_id: subjectId, level, steps: data.steps as never });
      await logEvent("roadmap", subjectId, { level, count: data.steps.length });
      sfx.success();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight"><span className="text-gradient">Learning</span> roadmap</h1>
        <p className="text-muted-foreground mt-1">Generate a personalized step-by-step plan to master any subject.</p>

        <div className="glass-strong rounded-2xl p-5 mt-6 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="mt-1 block w-full bg-background/50 border border-glass-border rounded-lg px-3 py-2 text-sm">
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="mt-1 block w-full bg-background/50 border border-glass-border rounded-lg px-3 py-2 text-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button onClick={generate} disabled={busy || !subjectId} className="px-5 py-2.5 rounded-lg bg-cosmic text-primary-foreground font-semibold flex items-center gap-2 disabled:opacity-50 glow-sm">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </button>
        </div>

        {title && <h2 className="text-2xl font-bold mt-8 flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary" /> {title}</h2>}

        <div className="mt-6 space-y-3">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 relative">
              <div className="absolute -left-3 top-5 h-8 w-8 rounded-full bg-cosmic text-primary-foreground font-bold text-sm flex items-center justify-center glow-sm hidden sm:flex">{i + 1}</div>
              <div className="sm:pl-7">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {s.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">{s.description}</p>
                {s.resources && s.resources.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {s.resources.map((r, j) => (
                      <li key={j} className="text-xs px-2 py-1 rounded-md glass flex items-center gap-1"><BookOpen className="h-3 w-3" /> {r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {!busy && steps.length === 0 && (
          <div className="glass rounded-2xl p-8 mt-8 text-center text-sm text-muted-foreground">
            Pick a subject and level, then click <strong className="text-foreground">Generate</strong>.
          </div>
        )}
      </div>
    </AppShell>
  );
}
