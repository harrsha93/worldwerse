import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen } from "lucide-react";
import { NotesTab } from "@/components/subject/NotesTab";
import { FilesTab } from "@/components/subject/FilesTab";
import { FlashcardsTab } from "@/components/subject/FlashcardsTab";
import { QuizzesTab } from "@/components/subject/QuizzesTab";
import { ChatTab } from "@/components/subject/ChatTab";
import { HistoryTab } from "@/components/subject/HistoryTab";

export const Route = createFileRoute("/subjects/$slug")({
  component: SubjectPage,
  head: ({ params }) => ({
    meta: [
      { title: `${formatSlug(params.slug)} · WordWerse` },
      { name: "description", content: `Notes, flashcards, quizzes and AI tutor for ${formatSlug(params.slug)} on WordWerse.` },
    ],
  }),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Could not load subject</h1>
        <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
        <Link to="/subjects" className="inline-flex mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Back</Link>
      </div>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Subject not found</h1>
        <Link to="/subjects" className="inline-flex mt-6 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Back</Link>
      </div>
    </AppShell>
  ),
});

function formatSlug(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Subject = { id: string; name: string; slug: string; color: string | null };

function SubjectPage() {
  const { slug } = useParams({ from: "/subjects/$slug" });
  const [subject, setSubject] = useState<Subject | null>(null);
  const [tab, setTab] = useState("notes");
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("subjects").select("id, name, slug, color").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    setSubject(data as Subject);
    setLoaded(true);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (!loaded || !subject) {
    return <AppShell><div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">Loading subject…</div></AppShell>;
  }

  const accent = `oklch(${subject.color || "0.7 0.2 280"})`;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All subjects
        </Link>
        <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30 blur-3xl" style={{ background: accent }} />
          <BookOpen className="h-7 w-7 mb-2" style={{ color: accent }} />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">All your study tools in one place.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="glass rounded-xl p-1 grid grid-cols-3 sm:grid-cols-6 gap-1 h-auto">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="chat">AI Chat</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-6"><NotesTab subject={subject} /></TabsContent>
          <TabsContent value="files" className="mt-6"><FilesTab subject={subject} /></TabsContent>
          <TabsContent value="flashcards" className="mt-6"><FlashcardsTab subject={subject} /></TabsContent>
          <TabsContent value="quizzes" className="mt-6"><QuizzesTab subject={subject} /></TabsContent>
          <TabsContent value="chat" className="mt-6"><ChatTab subject={subject} /></TabsContent>
          <TabsContent value="history" className="mt-6"><HistoryTab subject={subject} /></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
