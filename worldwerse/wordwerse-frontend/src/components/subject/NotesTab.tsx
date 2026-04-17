import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/api";
import { Plus, Trash2, Save } from "lucide-react";
import { sfx } from "@/components/sound";
import { toast } from "sonner";
import { Translator } from "@/components/Translator";

type Subject = { id: string; name: string };
type Note = { id: string; title: string; content: string; updated_at: string };

export function NotesTab({ subject }: { subject: Subject }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [active, setActive] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const refresh = async () => {
    const { data } = await supabase.from("notes").select("id, title, content, updated_at").eq("subject_id", subject.id).order("updated_at", { ascending: false });
    setNotes((data || []) as Note[]);
  };
  useEffect(() => { refresh(); }, [subject.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const newNote = () => { setActive(null); setTitle(""); setContent(""); };

  const select = (n: Note) => { setActive(n); setTitle(n.title); setContent(n.content); };

  const save = async () => {
    if (!title.trim()) return toast.error("Title required");
    if (active) {
      const { error } = await supabase.from("notes").update({ title, content }).eq("id", active.id);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    } else {
      const { data, error } = await supabase.from("notes").insert({ title, content, subject_id: subject.id }).select().single();
      if (error) return toast.error(error.message);
      setActive(data as Note);
      await logEvent("note", subject.id, { title });
      toast.success("Note created");
    }
    sfx.click();
    refresh();
  };

  const remove = async (n: Note) => {
    if (!confirm(`Delete "${n.title}"?`)) return;
    await supabase.from("notes").delete().eq("id", n.id);
    if (active?.id === n.id) newNote();
    refresh();
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <aside className="glass-strong rounded-2xl p-3 max-h-[70vh] overflow-y-auto">
        <button onClick={newNote} className="w-full px-3 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center justify-center gap-1 mb-3"><Plus className="h-4 w-4" /> New note</button>
        {notes.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No notes yet</p>}
        <ul className="space-y-1">
          {notes.map((n) => (
            <li key={n.id}>
              <button onClick={() => select(n)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-2 ${active?.id === n.id ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}>
                <span className="truncate">{n.title}</span>
                <Trash2 onClick={(e) => { e.stopPropagation(); remove(n); }} className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 hover:text-destructive flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="glass-strong rounded-2xl p-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title…" className="w-full bg-transparent text-xl font-semibold outline-none border-b border-glass-border pb-2 mb-3" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your notes here… (markdown supported when displayed)" className="w-full bg-transparent outline-none text-sm leading-relaxed resize-none min-h-[50vh]" />
        <div className="flex justify-end items-center gap-2 mt-3">
          {content.trim() && <Translator text={`${title}\n\n${content}`} />}
          <button onClick={save} className="px-4 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center gap-1.5"><Save className="h-4 w-4" /> Save</button>
        </div>
      </section>
    </div>
  );
}
