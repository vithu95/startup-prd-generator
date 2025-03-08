-- Create the PRDs table
CREATE TABLE IF NOT EXISTS public.prds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  markdown TEXT NOT NULL,
  json_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own PRDs"
  ON public.prds
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PRDs"
  ON public.prds
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PRDs"
  ON public.prds
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PRDs"
  ON public.prds
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS prds_user_id_idx ON public.prds (user_id);

