import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fnUrl, fnHeaders, logEvent } from "@/lib/api";
import { Send, Loader2, MessageSquare, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { sfx } from "@/components/sound";
import { Translator } from "@/components/Translator";

type Subject = { id: string; name: string };
type Msg = { role: "user" | "assistant"; content: string };

export function ChatTab({ subject }: { subject: Subject }) {
  const conversationId = `subject-${subject.id}`;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("chat_messages").select("role, content").eq("conversation_id", conversationId).order("created_at").then(({ data }) => {
      setMessages((data || []).map((m) => ({ role: m.role as Msg["role"], content: m.content })));
    });
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setBusy(true);
    await supabase.from("chat_messages").insert({ conversation_id: conversationId, subject_id: subject.id, role: "user", content: text });

    try {
      // Pull a sample of context from this subject's files
      const { data: files } = await supabase.from("files").select("extracted_text").eq("subject_id", subject.id).not("extracted_text", "is", null).limit(2);
      const ctx = (files || []).map((f) => f.extracted_text).join("\n\n").slice(0, 20000);

      const resp = await fetch(fnUrl("ai-chat"), {
        method: "POST", headers: fnHeaders(),
        body: JSON.stringify({ messages: next, context_text: ctx, subject_name: subject.name }),
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || "AI chat failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl); buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: assistantText }; return c; });
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
      if (assistantText) {
        await supabase.from("chat_messages").insert({ conversation_id: conversationId, subject_id: subject.id, role: "assistant", content: assistantText });
        await logEvent("chat", subject.id, { length: assistantText.length });
        sfx.notify();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally { setBusy(false); }
  };

  const clear = async () => {
    if (!confirm("Clear chat history for this subject?")) return;
    await supabase.from("chat_messages").delete().eq("conversation_id", conversationId);
    setMessages([]);
  };

  return (
    <div className="glass-strong rounded-2xl flex flex-col h-[70vh]">
      <div className="px-5 py-3 border-b border-glass-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">AI tutor · {subject.name}</span>
        </div>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"><Trash2 className="h-3 w-3" /> Clear</button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-20">
            Ask any doubt about <strong className="text-foreground">{subject.name}</strong>.<br />
            Your uploaded files give the AI context.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-cosmic text-primary-foreground" : "glass border border-glass-border"
              }`}>
                {m.role === "assistant" ? (
                  <article className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2 prose-pre:my-2 prose-code:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || "…"}</ReactMarkdown>
                  </article>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
              {m.role === "assistant" && m.content && <Translator text={m.content} />}
            </div>
          </div>
        ))}
        {busy && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start"><div className="glass rounded-2xl px-4 py-2.5 text-sm flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</div></div>
        )}
      </div>
      <div className="border-t border-glass-border p-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          placeholder={`Ask about ${subject.name}…`}
          className="flex-1 bg-background/50 border border-glass-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
        />
        <button onClick={send} disabled={busy || !input.trim()} className="h-10 w-10 rounded-xl bg-cosmic text-primary-foreground flex items-center justify-center disabled:opacity-50 glow-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
