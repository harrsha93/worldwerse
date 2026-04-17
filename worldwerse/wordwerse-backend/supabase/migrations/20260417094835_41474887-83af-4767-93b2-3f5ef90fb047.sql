-- Spaced repetition fields for flashcards
ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS due_at timestamp with time zone NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS interval_days numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ease numeric NOT NULL DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS reps integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lapses integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_reviewed_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS idx_flashcards_due ON public.flashcards (subject_id, due_at);
