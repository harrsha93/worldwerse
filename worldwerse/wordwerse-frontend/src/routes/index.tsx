import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Upload, MessageSquare, Brain, Zap, BookOpen, ArrowRight, FileText, Map, Trophy } from "lucide-react";
import hero from "@/assets/hero-cosmos.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "WordWerse — AI Knowledge Universe for Students" },
      { name: "description", content: "Upload notes, chat with AI tutors, generate quizzes & flashcards, and master any subject in your futuristic learning dashboard." },
      { property: "og:title", content: "WordWerse — AI Knowledge Universe" },
      { property: "og:description", content: "Your futuristic AI-powered study companion." },
    ],
  }),
});

type Stats = { files: number; notes: number; flashcards: number; quizzes: number };
type Subject = { id: string; name: string; slug: string; color: string | null };
type Recent = { id: string; name: string; created_at: string };
type Event = { id: string; type: string; created_at: string; metadata: Record<string, unknown> };

function Index() {
  const [stats, setStats] = useState<Stats>({ files: 0, notes: 0, flashcards: 0, quizzes: 0 });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const [filesRes, notesRes, fcRes, qzRes, subRes, recRes, evRes] = await Promise.all([
        supabase.from("files").select("*", { count: "exact", head: true }),
        supabase.from("notes").select("*", { count: "exact", head: true }),
        supabase.from("flashcards").select("*", { count: "exact", head: true }),
        supabase.from("quizzes").select("*", { count: "exact", head: true }),
        supabase.from("subjects").select("id, name, slug, color").order("name"),
        supabase.from("files").select("id, name, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("study_events").select("id, type, created_at, metadata").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({
        files: filesRes.count || 0,
        notes: notesRes.count || 0,
        flashcards: fcRes.count || 0,
        quizzes: qzRes.count || 0,
      });
      setSubjects((subRes.data || []) as Subject[]);
      setRecent((recRes.data || []) as Recent[]);
      setEvents((evRes.data || []) as Event[]);
    })();
  }, []);

  const statCards = [
    { label: "Files", value: stats.files, icon: FileText, hue: "var(--neon-cyan)" },
    { label: "Notes", value: stats.notes, icon: BookOpen, hue: "var(--neon-violet)" },
    { label: "Flashcards", value: stats.flashcards, icon: Brain, hue: "var(--neon-magenta)" },
    { label: "Quizzes", value: stats.quizzes, icon: Trophy, hue: "var(--primary)" },
  ];

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={hero} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-50" width={1920} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-5">
              <Sparkles className="h-3 w-3 text-primary" />
              Powered by Gemini AI · Free for students
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              Your <span className="text-gradient">AI knowledge universe</span><br className="hidden sm:block" /> for any subject.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Upload notes & PDFs, chat with an AI tutor, auto-generate flashcards and quizzes, and follow a personalized roadmap to mastery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cosmic text-primary-foreground font-semibold animate-pulse-glow hover:scale-[1.02] transition">
                <Upload className="h-4 w-4" /> Upload material
              </Link>
              <Link to="/subjects" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-strong font-semibold hover:bg-white/10 transition">
                <BookOpen className="h-4 w-4" /> Explore subjects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-strong rounded-2xl p-4 sm:p-5 relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: s.hue }} />
                <Icon className="h-5 w-5 mb-2" style={{ color: s.hue }} />
                <div className="text-3xl font-bold tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Subjects + activity */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Your subjects</h2>
            <Link to="/subjects" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {subjects.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                to="/subjects/$slug"
                params={{ slug: s.slug }}
                className="group glass rounded-2xl p-5 hover:bg-white/8 hover:scale-[1.01] transition relative overflow-hidden"
              >
                <div
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-25 blur-3xl group-hover:opacity-40 transition"
                  style={{ background: `oklch(${s.color || "0.7 0.2 280"})` }}
                />
                <div className="font-semibold text-base">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Open dashboard <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent uploads</h3>
            {recent.length === 0 ? (
              <div className="glass rounded-xl p-6 text-sm text-muted-foreground text-center">
                No uploads yet. <Link to="/upload" className="text-primary hover:underline">Upload your first file</Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {recent.map((r) => (
                  <li key={r.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 truncate"><FileText className="h-4 w-4 text-primary flex-shrink-0" /> <span className="truncate">{r.name}</span></span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-accent" /> AI suggestions</h2>
          <div className="glass-strong rounded-2xl p-5 space-y-3">
            <Suggestion icon={Upload} title="Upload a PDF" desc="Then ask the AI to summarize it instantly." to="/upload" />
            <Suggestion icon={Brain} title="Generate flashcards" desc="Auto-create flashcards from your notes." to="/subjects" />
            <Suggestion icon={Map} title="Build a roadmap" desc="Personalized learning path for any subject." to="/roadmap" />
          </div>

          <h3 className="text-sm font-semibold text-muted-foreground mt-6 mb-3">Activity</h3>
          <ul className="space-y-2">
            {events.length === 0 && (<li className="text-xs text-muted-foreground">No activity yet.</li>)}
            {events.map((e) => (
              <li key={e.id} className="text-xs text-muted-foreground glass rounded-lg px-3 py-2">
                <span className="text-foreground font-medium">{labelEvent(e.type)}</span>
                <span className="ml-2 opacity-70">{timeAgo(e.created_at)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </AppShell>
  );
}

function Suggestion({ icon: Icon, title, desc, to }: { icon: typeof Upload; title: string; desc: string; to: string }) {
  return (
    <Link to={to} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition">
      <div className="h-9 w-9 rounded-lg bg-cosmic flex items-center justify-center flex-shrink-0 glow-sm">
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}

function labelEvent(t: string) {
  const map: Record<string, string> = {
    upload: "📄 Uploaded a file",
    summarize: "✨ Summarized material",
    flashcards: "🧠 Generated flashcards",
    quiz: "🎯 Generated a quiz",
    quiz_attempt: "🏆 Completed a quiz",
    chat: "💬 AI chat session",
    note: "📝 Saved a note",
    roadmap: "🗺️ Built a roadmap",
  };
  return map[t] || t;
}
function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}
