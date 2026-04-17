import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { Brain, Loader2, Sparkles, RefreshCw, Trash2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { sfx } from "@/components/sound";

type Subject = { id: string; name: string };
type Card = {
  id: string;
  question: string;
  answer: string;
  due_at: string;
  interval_days: number;
  ease: number;
  reps: number;
  lapses: number;
};

type Grade = "again" | "hard" | "good" | "easy";

// Simple SM-2 inspired scheduler
function schedule(card: Card, grade: Grade): Partial<Card> {
  let { ease, interval_days, reps, lapses } = card;
  ease = ease || 2.5;

  if (grade === "again") {
    lapses += 1;
    reps = 0;
    interval_days = 0; // 10 min ~ same day; we treat as <1 day
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    if (grade === "hard") ease = Math.max(1.3, ease - 0.15);
    if (grade === "easy") ease = ease + 0.15;

    if (reps === 1) interval_days = grade === "easy" ? 3 : 1;
    else if (reps === 2) interval_days = grade === "easy" ? 6 : grade === "hard" ? 3 : 4;
    else {
      const factor = grade === "hard" ? 1.2 : grade === "easy" ? ease * 1.3 : ease;
      interval_days = Math.round(interval_days * factor);
    }
  }

  const due = new Date();
  if (interval_days < 1) due.setMinutes(due.getMinutes() + 10);
  else due.setDate(due.getDate() + interval_days);

  return {
    ease,
    interval_days,
    reps,
    lapses,
    due_at: due.toISOString(),
  };
}

export function FlashcardsTab({ subject }: { subject: Subject }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(10);
  const [mode, setMode] = useState<"browse" | "study">("browse");

  const refresh = async () => {
    const { data } = await supabase
      .from("flashcards")
      .select("id, question, answer, due_at, interval_days, ease, reps, lapses")
      .eq("subject_id", subject.id)
      .order("created_at", { ascending: false });
    setCards((data || []) as Card[]);
    setIdx(0); setFlipped(false);
  };
  useEffect(() => { refresh(); }, [subject.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dueCards = useMemo(() => {
    const now = Date.now();
    return cards.filter((c) => new Date(c.due_at).getTime() <= now);
  }, [cards]);

  const studyCards = mode === "study" ? dueCards : cards;
  const current = studyCards[idx];

  const generate = async () => {
    setBusy(true);
    try {
      const { data: ctxFiles } = await supabase.from("files").select("extracted_text").eq("subject_id", subject.id).not("extracted_text", "is", null).limit(3);
      const ctxFromFiles = (ctxFiles || []).map((f) => f.extracted_text).join("\n\n");
      const { data: ctxNotes } = await supabase.from("notes").select("content").eq("subject_id", subject.id).limit(5);
      const ctxFromNotes = (ctxNotes || []).map((n) => n.content).join("\n\n");
      const content = (ctxFromFiles + "\n\n" + ctxFromNotes).slice(0, 30000);
      if (!content.trim()) return toast.error("Add notes or upload files for this subject first.");

      const r = await fetch(fnUrl("ai-generate"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ mode: "flashcards", content, options: { subject_name: subject.name, count } }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || "Failed");
      const fc = (json.data.flashcards as { question: string; answer: string }[]).map((c) => ({ ...c, subject_id: subject.id }));
      const { error } = await supabase.from("flashcards").insert(fc);
      if (error) throw error;
      await logEvent("flashcards", subject.id, { count: fc.length });
      sfx.success();
      toast.success(`Generated ${fc.length} flashcards`);
      refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  };

  const remove = async (c: Card) => {
    await supabase.from("flashcards").delete().eq("id", c.id);
    refresh();
  };

  const grade = async (g: Grade) => {
    if (!current) return;
    sfx.flip();
    const update = { ...schedule(current, g), last_reviewed_at: new Date().toISOString() };
    await supabase.from("flashcards").update(update).eq("id", current.id);
    await logEvent("review", subject.id, { grade, card_id: current.id });
    // Move to next due card; remove current from local list if no longer due
    const remaining = studyCards.filter((c) => c.id !== current.id);
    if (remaining.length === 0) {
      toast.success("🎉 Review complete!");
      sfx.success();
      await refresh();
      setMode("browse");
    } else {
      setFlipped(false);
      setIdx(0);
      // Reload to update due_at
      const { data } = await supabase
        .from("flashcards")
        .select("id, question, answer, due_at, interval_days, ease, reps, lapses")
        .eq("subject_id", subject.id);
      setCards((data || []) as Card[]);
    }
  };

  const next = () => { setFlipped(false); sfx.flip(); setIdx((i) => (i + 1) % Math.max(studyCards.length, 1)); };
  const prev = () => { setFlipped(false); sfx.flip(); setIdx((i) => (i - 1 + studyCards.length) % Math.max(studyCards.length, 1)); };

  return (
    <div>
      <div className="glass-strong rounded-2xl p-4 mb-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 glass rounded-lg p-1">
          <button
            onClick={() => { setMode("browse"); setIdx(0); setFlipped(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold ${mode === "browse" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
          >Browse</button>
          <button
            onClick={() => { setMode("study"); setIdx(0); setFlipped(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${mode === "study" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
          >
            <Zap className="h-3 w-3" /> Review
            {dueCards.length > 0 && <span className="bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 text-[10px] ml-1">{dueCards.length}</span>}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Count</label>
          <input type="number" min={4} max={40} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-16 bg-background/50 border border-glass-border rounded-md px-2 py-1 text-sm" />
        </div>
        <button onClick={generate} disabled={busy} className="px-4 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
        </button>
        <button onClick={refresh} className="px-3 py-2 rounded-lg glass text-sm flex items-center gap-1.5"><RefreshCw className="h-4 w-4" /></button>
        <span className="ml-auto text-xs text-muted-foreground">{cards.length} total · {dueCards.length} due</span>
      </div>

      {studyCards.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-sm text-muted-foreground">
          <Brain className="h-8 w-8 mx-auto mb-3 text-primary opacity-60" />
          {mode === "study" ? (
            <>🎉 No cards due for review right now! Come back later or switch to Browse.</>
          ) : (
            <>No flashcards yet. Generate some from your notes or files.</>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
          <div className="relative">
            <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
              <span>{mode === "study" ? "Review" : "Card"} {idx + 1} of {studyCards.length}</span>
              {current && <span>Reps: {current.reps} · Ease: {current.ease.toFixed(2)}</span>}
            </div>
            {current && (
              <div onClick={() => { setFlipped((f) => !f); sfx.flip(); }} className="cursor-pointer perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${current.id}-${flipped}`}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`glass-strong rounded-3xl min-h-[260px] sm:min-h-[320px] p-8 flex items-center justify-center text-center text-xl sm:text-2xl font-semibold ${flipped ? "border-2 border-accent/50 glow" : "border border-glass-border"}`}
                  >
                    <div>
                      <div className="text-xs uppercase tracking-widest mb-3 text-muted-foreground">{flipped ? "Answer" : "Question"}</div>
                      <div className="leading-snug">{flipped ? current.answer : current.question}</div>
                      <div className="text-xs text-muted-foreground mt-6">Click to flip</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {mode === "study" ? (
              <div className="grid grid-cols-4 gap-2 mt-4">
                <button onClick={() => grade("again")} disabled={!flipped} className="px-2 py-3 rounded-lg bg-destructive/80 text-destructive-foreground text-sm font-semibold disabled:opacity-40">
                  Again<div className="text-[10px] opacity-80 font-normal">&lt;10m</div>
                </button>
                <button onClick={() => grade("hard")} disabled={!flipped} className="px-2 py-3 rounded-lg glass-strong text-sm font-semibold disabled:opacity-40">
                  Hard<div className="text-[10px] opacity-70 font-normal">~3d</div>
                </button>
                <button onClick={() => grade("good")} disabled={!flipped} className="px-2 py-3 rounded-lg bg-primary/80 text-primary-foreground text-sm font-semibold disabled:opacity-40">
                  Good<div className="text-[10px] opacity-80 font-normal">~4d</div>
                </button>
                <button onClick={() => grade("easy")} disabled={!flipped} className="px-2 py-3 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold disabled:opacity-40">
                  Easy<div className="text-[10px] opacity-80 font-normal">~6d</div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-4 gap-2">
                <button onClick={prev} className="px-4 py-2 rounded-lg glass-strong text-sm font-semibold">← Previous</button>
                {current && (
                  <button onClick={() => remove(current)} className="px-3 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-destructive flex items-center gap-1.5"><Trash2 className="h-4 w-4" /></button>
                )}
                <button onClick={next} className="px-4 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold">Next →</button>
              </div>
            )}
            {mode === "study" && !flipped && (
              <p className="text-xs text-center text-muted-foreground mt-2">Flip the card to grade your recall.</p>
            )}
          </div>

          <aside className="glass rounded-2xl p-3 max-h-[60vh] overflow-y-auto">
            <p className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">{mode === "study" ? "Due queue" : "All cards"}</p>
            <ul className="space-y-1">
              {studyCards.map((c, i) => (
                <li key={c.id}>
                  <button onClick={() => { setIdx(i); setFlipped(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs ${i === idx ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}>
                    {i + 1}. {c.question.slice(0, 60)}{c.question.length > 60 ? "…" : ""}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
