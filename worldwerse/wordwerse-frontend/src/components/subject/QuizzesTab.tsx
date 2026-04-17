import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { Trophy, Sparkles, Loader2, CheckCircle2, XCircle, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { sfx } from "@/components/sound";
import type { Json } from "@/integrations/supabase/types";

type Subject = { id: string; name: string };
type Question = { type: "mcq" | "short"; question: string; options?: string[]; answer: string; explanation: string };
type Quiz = { id: string; title: string; level: string; questions: Question[]; created_at: string };

export function QuizzesTab({ subject }: { subject: Subject }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [active, setActive] = useState<Quiz | null>(null);
  const [busy, setBusy] = useState(false);
  const [level, setLevel] = useState("beginner");
  const [count, setCount] = useState(8);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("quizzes").select("id, title, level, questions, created_at").eq("subject_id", subject.id).order("created_at", { ascending: false });
    setQuizzes((data || []).map((q) => ({ ...q, questions: q.questions as unknown as Question[] })));
  };
  useEffect(() => { refresh(); }, [subject.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const generate = async () => {
    setBusy(true);
    try {
      const { data: ctxFiles } = await supabase.from("files").select("extracted_text").eq("subject_id", subject.id).not("extracted_text", "is", null).limit(3);
      const ctxFromFiles = (ctxFiles || []).map((f) => f.extracted_text).join("\n\n");
      const { data: ctxNotes } = await supabase.from("notes").select("content").eq("subject_id", subject.id).limit(5);
      const ctxFromNotes = (ctxNotes || []).map((n) => n.content).join("\n\n");
      const content = (ctxFromFiles + "\n\n" + ctxFromNotes).slice(0, 30000);
      if (!content.trim()) return toast.error("Add notes or upload files first.");

      const r = await fetch(fnUrl("ai-generate"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ mode: "quiz", content, options: { subject_name: subject.name, level, count } }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || "Failed");
      const { data: created, error } = await supabase.from("quizzes").insert({
        subject_id: subject.id, level, title: json.data.title, questions: json.data.questions as unknown as Json,
      }).select().single();
      if (error) throw error;
      await logEvent("quiz", subject.id, { level, count: json.data.questions.length });
      sfx.success();
      const newQuiz = { ...created, questions: created.questions as unknown as Question[] };
      setActive(newQuiz);
      setAnswers(new Array(newQuiz.questions.length).fill(""));
      setSubmitted(false);
      refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); }
  };

  const startQuiz = (q: Quiz) => {
    setActive(q);
    setAnswers(new Array(q.questions.length).fill(""));
    setSubmitted(false);
  };

  const submit = async () => {
    if (!active) return;
    let score = 0;
    active.questions.forEach((q, i) => {
      if ((answers[i] || "").trim().toLowerCase() === q.answer.trim().toLowerCase()) score++;
    });
    setSubmitted(true);
    sfx.success();
    await supabase.from("quiz_attempts").insert({ quiz_id: active.id, score, total: active.questions.length, answers: answers as unknown as Json });
    await logEvent("quiz_attempt", subject.id, { score, total: active.questions.length, title: active.title });
    toast.success(`Score: ${score} / ${active.questions.length}`);
  };

  const remove = async (q: Quiz) => {
    if (!confirm(`Delete "${q.title}"?`)) return;
    await supabase.from("quizzes").delete().eq("id", q.id);
    if (active?.id === q.id) setActive(null);
    refresh();
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <aside className="glass-strong rounded-2xl p-3 max-h-[70vh] overflow-y-auto">
        <div className="space-y-2 mb-3 px-1">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-background/50 border border-glass-border rounded-md px-2 py-1.5 text-xs">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input type="number" min={4} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full bg-background/50 border border-glass-border rounded-md px-2 py-1.5 text-xs" />
          <button onClick={generate} disabled={busy} className="w-full px-3 py-2 rounded-lg bg-cosmic text-primary-foreground text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate quiz
          </button>
        </div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">Saved quizzes</p>
        {quizzes.length === 0 && <p className="text-xs text-muted-foreground text-center p-4">None yet</p>}
        <ul className="space-y-1">
          {quizzes.map((q) => (
            <li key={q.id} className="group">
              <button onClick={() => startQuiz(q)} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${active?.id === q.id ? "bg-primary/15 text-primary" : "hover:bg-white/5"}`}>
                <div className="font-medium truncate">{q.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="capitalize">{q.level}</span> · {q.questions.length} Qs
                  <span onClick={(e) => { e.stopPropagation(); remove(q); }} className="ml-auto text-muted-foreground hover:text-destructive cursor-pointer">×</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="glass-strong rounded-2xl p-5 min-h-[60vh]">
        {!active ? (
          <div className="text-center text-sm text-muted-foreground py-20">
            <Trophy className="h-8 w-8 mx-auto mb-3 text-primary opacity-60" />
            Generate a quiz or pick one to start.
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">{active.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-accent/20 text-accent ml-auto capitalize">{active.level}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5">{active.questions.length} questions</p>

            <div className="space-y-5">
              {active.questions.map((q, i) => {
                const userA = answers[i] || "";
                const correct = userA.trim().toLowerCase() === q.answer.trim().toLowerCase();
                return (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="font-semibold text-sm mb-3">{i + 1}. {q.question}</div>
                    {q.type === "mcq" && q.options ? (
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => {
                          const selected = userA === opt;
                          const isCorrect = submitted && opt === q.answer;
                          const isWrong = submitted && selected && !correct;
                          return (
                            <button
                              key={oi}
                              disabled={submitted}
                              onClick={() => { const a = [...answers]; a[i] = opt; setAnswers(a); sfx.click(); }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition border ${
                                isCorrect ? "border-green-500/60 bg-green-500/10 text-green-300" :
                                isWrong ? "border-destructive/60 bg-destructive/10" :
                                selected ? "border-primary bg-primary/10" :
                                "border-glass-border hover:bg-white/5"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        disabled={submitted}
                        value={userA}
                        onChange={(e) => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }}
                        placeholder="Your answer…"
                        className={`w-full bg-background/50 border rounded-lg px-3 py-2 text-sm ${
                          submitted ? (correct ? "border-green-500/60" : "border-destructive/60") : "border-glass-border"
                        }`}
                      />
                    )}
                    {submitted && (
                      <div className="mt-3 text-xs glass rounded-lg p-3">
                        <div className="flex items-center gap-1.5 font-semibold">
                          {correct ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-destructive" />}
                          {correct ? "Correct" : `Answer: ${q.answer}`}
                        </div>
                        <p className="text-muted-foreground mt-1">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {submitted ? (
                <button onClick={() => { setSubmitted(false); setAnswers(new Array(active.questions.length).fill("")); }} className="px-4 py-2 rounded-lg glass-strong text-sm font-semibold flex items-center gap-1.5"><RefreshCw className="h-4 w-4" /> Retake</button>
              ) : (
                <button onClick={submit} className="px-5 py-2.5 rounded-lg bg-cosmic text-primary-foreground font-semibold flex items-center gap-1.5">Submit <ArrowRight className="h-4 w-4" /></button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
