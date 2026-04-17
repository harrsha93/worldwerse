import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Plus } from "lucide-react";
import { sfx } from "@/components/sound";
import { toast } from "sonner";

export const Route = createFileRoute("/subjects/")({
  component: SubjectsPage,
  head: () => ({ meta: [{ title: "Subjects · WordWerse" }, { name: "description", content: "Browse and manage your subject hubs in WordWerse." }] }),
});

type Subject = { id: string; name: string; slug: string; color: string | null };

function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("subjects").select("id, name, slug, color").order("name").then(({ data }) => {
      setSubjects((data || []) as Subject[]);
    });
  }, []);

  const create = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const colors = ["180 90% 60%", "270 90% 65%", "320 90% 65%", "200 95% 60%", "160 80% 55%", "230 90% 65%"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const { data, error } = await supabase.from("subjects").insert({ name: trimmed, slug, color, icon: "book-open" }).select().single();
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    sfx.success();
    setSubjects((s) => [...s, data as Subject].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    toast.success("Subject added");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight"><span className="text-gradient">Subjects</span></h1>
            <p className="text-muted-foreground mt-1">Each subject has notes, flashcards, quizzes, AI chat & history.</p>
          </div>
          <div className="flex gap-2 glass-strong rounded-xl p-1.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && create()}
              placeholder="Add a subject…"
              className="bg-transparent px-3 py-2 text-sm outline-none w-44 sm:w-56"
            />
            <button onClick={create} disabled={loading} className="px-3 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center gap-1 disabled:opacity-50">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link
                to="/subjects/$slug"
                params={{ slug: s.slug }}
                onClick={() => sfx.click()}
                className="group block glass-strong rounded-2xl p-6 hover:bg-white/8 hover:scale-[1.01] transition relative overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl group-hover:opacity-50 transition"
                  style={{ background: `oklch(${s.color || "0.7 0.2 280"})` }}
                />
                <BookOpen className="h-6 w-6 mb-3" style={{ color: `oklch(${s.color || "0.7 0.2 280"})` }} />
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Open hub <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
