import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "lucide-react";

type Subject = { id: string; name: string };
type Event = { id: string; type: string; created_at: string; metadata: Record<string, unknown> };

const labels: Record<string, string> = {
  upload: "📄 Uploaded a file",
  summarize: "✨ Summarized material",
  flashcards: "🧠 Generated flashcards",
  quiz: "🎯 Generated a quiz",
  quiz_attempt: "🏆 Completed a quiz",
  chat: "💬 AI chat session",
  note: "📝 Saved a note",
  roadmap: "🗺️ Built a roadmap",
};

export function HistoryTab({ subject }: { subject: Subject }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("study_events").select("id, type, created_at, metadata").eq("subject_id", subject.id).order("created_at", { ascending: false }).limit(100).then(({ data }) => {
      setEvents(((data || []) as unknown as Event[]));
    });
  }, [subject.id]);

  return (
    <div className="glass-strong rounded-2xl p-5">
      <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Study history</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No activity yet for this subject.</p>
      ) : (
        <ol className="relative border-l border-glass-border ml-2 space-y-4 pt-2">
          {events.map((e) => (
            <li key={e.id} className="ml-4">
              <div className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary glow-sm" style={{ marginTop: 6 }} />
              <div className="text-sm font-medium">{labels[e.type] || e.type}</div>
              <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
              {e.metadata && Object.keys(e.metadata).length > 0 && (
                <pre className="text-xs text-muted-foreground/80 mt-1 glass rounded-md p-2 overflow-x-auto">{JSON.stringify(e.metadata, null, 0)}</pre>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
