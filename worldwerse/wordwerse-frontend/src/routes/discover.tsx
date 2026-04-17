import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Youtube, Search } from "lucide-react";

export const Route = createFileRoute("/discover")({
  component: Discover,
  head: () => ({ meta: [{ title: "Discover videos · WordWerse" }, { name: "description", content: "Find YouTube videos to learn any topic." }] }),
});

function Discover() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    setTopic(q.trim());
  };

  const embedUrl = topic ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(topic + " tutorial explained")}` : "";

  const suggestions = ["Quantum Mechanics", "Binary Search Tree", "Linear Algebra", "Operating System Scheduling", "Organic Chemistry Basics", "Newton's Laws"];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight"><span className="text-gradient">Discover</span> learning videos</h1>
        <p className="text-muted-foreground mt-1">Search YouTube for any topic — tutorials, explainers, lectures.</p>

        <form onSubmit={search} className="glass-strong rounded-2xl p-2 mt-6 flex gap-2">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Photosynthesis, Recursion, Calculus integrals" className="flex-1 bg-transparent outline-none text-sm py-2.5" />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-lg bg-cosmic text-primary-foreground font-semibold flex items-center gap-2"><Youtube className="h-4 w-4" /> Search</button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {suggestions.map((s) => (
            <button key={s} onClick={() => { setQ(s); setTopic(s); }} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-white/10">{s}</button>
          ))}
        </div>

        {topic ? (
          <div className="mt-8 glass-strong rounded-2xl overflow-hidden aspect-video">
            <iframe
              src={embedUrl}
              title={`YouTube results for ${topic}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mt-8 glass rounded-2xl p-12 text-center text-sm text-muted-foreground">Type a topic above to start exploring.</div>
        )}
      </div>
    </AppShell>
  );
}
