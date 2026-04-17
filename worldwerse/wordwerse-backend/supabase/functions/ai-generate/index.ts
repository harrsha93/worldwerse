// Generates structured study assets via tool calling: summary | flashcards | quiz | roadmap | translate | simplify
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Mode = "summary" | "flashcards" | "quiz" | "roadmap" | "translate" | "simplify";

function toolFor(mode: Mode, opts: Record<string, unknown>) {
  if (mode === "summary" || mode === "simplify") {
    return {
      name: "produce_summary",
      description: "Return a concise, well-structured study summary in markdown.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          summary_markdown: { type: "string", description: "Markdown summary with headings, bullets, key terms in bold." },
          key_points: { type: "array", items: { type: "string" } },
        },
        required: ["title", "summary_markdown", "key_points"],
      },
    };
  }
  if (mode === "flashcards") {
    const count = Number(opts.count || 12);
    return {
      name: "produce_flashcards",
      description: "Generate study flashcards.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          flashcards: {
            type: "array",
            minItems: 4,
            maxItems: Math.max(4, Math.min(40, count)),
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
              },
              required: ["question", "answer"],
            },
          },
        },
        required: ["flashcards"],
      },
    };
  }
  if (mode === "quiz") {
    const count = Number(opts.count || 8);
    return {
      name: "produce_quiz",
      description: "Generate a study quiz with MCQs and short answer questions.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          questions: {
            type: "array",
            minItems: 4,
            maxItems: Math.max(4, Math.min(20, count)),
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                type: { type: "string", enum: ["mcq", "short"] },
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                answer: { type: "string", description: "For MCQ: the exact correct option text. For short: the expected concise answer." },
                explanation: { type: "string" },
              },
              required: ["type", "question", "answer", "explanation"],
            },
          },
        },
        required: ["title", "questions"],
      },
    };
  }
  if (mode === "roadmap") {
    return {
      name: "produce_roadmap",
      description: "Personalized step-by-step learning roadmap.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          steps: {
            type: "array",
            minItems: 4,
            maxItems: 12,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                duration: { type: "string", description: "Estimated duration like '2-3 hours' or '1 week'" },
                resources: { type: "array", items: { type: "string" } },
              },
              required: ["title", "description", "duration"],
            },
          },
        },
        required: ["title", "steps"],
      },
    };
  }
  // translate
  return {
    name: "produce_translation",
    description: "Translate text into target language preserving meaning and structure.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        translation: { type: "string" },
      },
      required: ["translation"],
    },
  };
}

function promptFor(mode: Mode, opts: Record<string, unknown>, content: string) {
  const subject = opts.subject_name ? `Subject: ${opts.subject_name}.` : "";
  const level = opts.level ? `Target difficulty: ${opts.level}.` : "";
  const lang = opts.target_language ? `Target language: ${opts.target_language}.` : "";
  if (mode === "summary") return `${subject} Create a thorough, well-organized study summary of the following material. Include key terms, examples, and a section of bullet key points.\n\nMATERIAL:\n${content}`;
  if (mode === "simplify") return `${subject} Rewrite the following material in simple, easy-to-understand language for a student. Use analogies and short sentences.\n\nMATERIAL:\n${content}`;
  if (mode === "flashcards") return `${subject} Create study flashcards from this material. Make questions that test understanding, not just recall. Keep answers concise but complete.\n\nMATERIAL:\n${content}`;
  if (mode === "quiz") return `${subject} ${level} Create a quiz that tests understanding. Mix MCQ (4 options each) and short answer. For MCQs, the 'answer' field MUST exactly match one of the options.\n\nMATERIAL:\n${content}`;
  if (mode === "roadmap") return `${subject} ${level} Build a personalized learning roadmap to master this subject. Each step should build on the last and include estimated duration and recommended resources/topics to study.\n\nCONTEXT:\n${content || "No specific material — design a strong general roadmap for this subject."}`;
  return `${lang} Translate the following text faithfully:\n\n${content}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const mode = body.mode as Mode;
    const content = (body.content || "").slice(0, 60000);
    const opts = body.options || {};
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const tool = toolFor(mode, opts);
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are WordWerse, an expert AI study assistant. Always call the requested tool with high-quality, pedagogically-sound output." },
          { role: "user", content: promptFor(mode, opts, content) },
        ],
        tools: [{ type: "function", function: tool }],
        tool_choice: { type: "function", function: { name: tool.name } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const json = await resp.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) throw new Error("No tool call returned");
    const data = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-generate error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
