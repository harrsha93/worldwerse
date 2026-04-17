// Extract text from uploaded file by storage_path. Supports PDF, DOCX, TXT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function extractPdf(bytes: Uint8Array): Promise<string> {
  // unpdf = serverless-friendly PDF text extraction (no canvas / no worker)
  const { extractText, getDocumentProxy } = await import("https://esm.sh/unpdf@0.12.1");
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n\n") : (text || "");
}

async function extractDocx(bytes: Uint8Array): Promise<string> {
  const mammoth = await import("https://esm.sh/mammoth@1.8.0");
  // @ts-ignore – mammoth in deno expects ArrayBuffer
  const result = await mammoth.extractRawText({ arrayBuffer: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
  return result.value || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { file_id, storage_path, mime_type, name } = await req.json();
    if (!storage_path || !file_id) {
      return new Response(JSON.stringify({ error: "file_id and storage_path required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: blob, error: dlErr } = await supabase.storage.from("study-materials").download(storage_path);
    if (dlErr || !blob) throw new Error(`Download failed: ${dlErr?.message}`);
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const lowerName = (name || storage_path).toLowerCase();
    const isPdf = mime_type?.includes("pdf") || lowerName.endsWith(".pdf");
    const isDocx = mime_type?.includes("officedocument") || lowerName.endsWith(".docx");
    const isTxt = mime_type?.startsWith("text/") || lowerName.endsWith(".txt") || lowerName.endsWith(".md");

    let text = "";
    try {
      if (isPdf) text = await extractPdf(bytes);
      else if (isDocx) text = await extractDocx(bytes);
      else if (isTxt) text = new TextDecoder().decode(bytes);
      else text = new TextDecoder().decode(bytes); // best effort
    } catch (e) {
      console.error("extraction error", e);
      text = "";
    }

    text = text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length > 200000) text = text.slice(0, 200000);

    await supabase.from("files").update({ extracted_text: text }).eq("id", file_id);

    return new Response(JSON.stringify({ ok: true, length: text.length, preview: text.slice(0, 400) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-text error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
