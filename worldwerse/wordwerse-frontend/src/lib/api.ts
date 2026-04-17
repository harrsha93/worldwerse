import { supabase } from "@/integrations/supabase/client";

export async function logEvent(type: string, subject_id: string | null, metadata: Record<string, unknown> = {}) {
  try {
    await supabase.from("study_events").insert({ type, subject_id, metadata: metadata as never });
  } catch (e) {
    console.error("logEvent failed", e);
  }
}

export function fnUrl(name: string) {
  const base = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  return `${base}/functions/v1/${name}`;
}

export function fnHeaders(extra: Record<string, string> = {}) {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  return {
    "Content-Type": "application/json",
    ...(key ? { Authorization: `Bearer ${key}`, apikey: key } : {}),
    ...extra,
  };
}
