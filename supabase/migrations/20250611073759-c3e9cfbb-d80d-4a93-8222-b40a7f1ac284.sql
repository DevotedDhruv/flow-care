
-- Add columns to period_entries for start/end dates and symptoms
ALTER TABLE public.period_entries 
ADD COLUMN IF NOT EXISTS period_start_date DATE,
ADD COLUMN IF NOT EXISTS period_end_date DATE,
ADD COLUMN IF NOT EXISTS symptoms JSONB DEFAULT '{}';

-- Remove the unique constraint on user_id and date since we'll have multiple entries per cycle
ALTER TABLE public.period_entries DROP CONSTRAINT IF EXISTS period_entries_user_id_date_key;

-- Create a new table for cycle tracking
CREATE TABLE IF NOT EXISTS public.menstrual_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE,
  cycle_length INTEGER,
  period_length INTEGER,
  predicted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for cycles table
ALTER TABLE public.menstrual_cycles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cycles
CREATE POLICY "Users can view their own cycles" 
  ON public.menstrual_cycles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cycles" 
  ON public.menstrual_cycles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycles" 
  ON public.menstrual_cycles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycles" 
  ON public.menstrual_cycles 
  FOR DELETE 
  USING (auth.uid() = user_id);
