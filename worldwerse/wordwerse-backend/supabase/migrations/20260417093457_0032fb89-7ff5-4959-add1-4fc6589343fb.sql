-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects public read" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "subjects public write" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "subjects public update" ON public.subjects FOR UPDATE USING (true);
CREATE POLICY "subjects public delete" ON public.subjects FOR DELETE USING (true);

-- Files (uploaded study materials)
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  storage_path TEXT NOT NULL,
  extracted_text TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "files public read" ON public.files FOR SELECT USING (true);
CREATE POLICY "files public write" ON public.files FOR INSERT WITH CHECK (true);
CREATE POLICY "files public update" ON public.files FOR UPDATE USING (true);
CREATE POLICY "files public delete" ON public.files FOR DELETE USING (true);
CREATE INDEX idx_files_subject ON public.files(subject_id);

-- Notes
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes public read" ON public.notes FOR SELECT USING (true);
CREATE POLICY "notes public write" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "notes public update" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "notes public delete" ON public.notes FOR DELETE USING (true);
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_notes_subject ON public.notes(subject_id);

-- Flashcards
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  source_file_id UUID REFERENCES public.files(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcards public read" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "flashcards public write" ON public.flashcards FOR INSERT WITH CHECK (true);
CREATE POLICY "flashcards public update" ON public.flashcards FOR UPDATE USING (true);
CREATE POLICY "flashcards public delete" ON public.flashcards FOR DELETE USING (true);
CREATE INDEX idx_flashcards_subject ON public.flashcards(subject_id);

-- Quizzes
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'beginner',
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes public read" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "quizzes public write" ON public.quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "quizzes public update" ON public.quizzes FOR UPDATE USING (true);
CREATE POLICY "quizzes public delete" ON public.quizzes FOR DELETE USING (true);
CREATE INDEX idx_quizzes_subject ON public.quizzes(subject_id);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qa public read" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "qa public write" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "qa public update" ON public.quiz_attempts FOR UPDATE USING (true);
CREATE POLICY "qa public delete" ON public.quiz_attempts FOR DELETE USING (true);

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat public read" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "chat public write" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "chat public update" ON public.chat_messages FOR UPDATE USING (true);
CREATE POLICY "chat public delete" ON public.chat_messages FOR DELETE USING (true);
CREATE INDEX idx_chat_conv ON public.chat_messages(conversation_id, created_at);

-- Roadmaps
CREATE TABLE public.roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  level TEXT NOT NULL DEFAULT 'beginner',
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmaps public read" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "roadmaps public write" ON public.roadmaps FOR INSERT WITH CHECK (true);
CREATE POLICY "roadmaps public update" ON public.roadmaps FOR UPDATE USING (true);
CREATE POLICY "roadmaps public delete" ON public.roadmaps FOR DELETE USING (true);

-- Study events (activity log)
CREATE TABLE public.study_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.study_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.study_events FOR SELECT USING (true);
CREATE POLICY "events public write" ON public.study_events FOR INSERT WITH CHECK (true);
CREATE POLICY "events public update" ON public.study_events FOR UPDATE USING (true);
CREATE POLICY "events public delete" ON public.study_events FOR DELETE USING (true);

-- Storage bucket for uploads (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', true);

CREATE POLICY "study materials public read" ON storage.objects FOR SELECT USING (bucket_id = 'study-materials');
CREATE POLICY "study materials public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'study-materials');
CREATE POLICY "study materials public update" ON storage.objects FOR UPDATE USING (bucket_id = 'study-materials');
CREATE POLICY "study materials public delete" ON storage.objects FOR DELETE USING (bucket_id = 'study-materials');

-- Seed default subjects
INSERT INTO public.subjects (name, slug, icon, color) VALUES
  ('Mathematics', 'mathematics', 'sigma', '180 90% 60%'),
  ('Data Structures', 'data-structures', 'network', '270 90% 65%'),
  ('Operating Systems', 'operating-systems', 'cpu', '200 95% 60%'),
  ('Physics', 'physics', 'atom', '320 90% 65%'),
  ('Chemistry', 'chemistry', 'flask-conical', '160 80% 55%'),
  ('Computer Networks', 'computer-networks', 'globe', '220 90% 65%');