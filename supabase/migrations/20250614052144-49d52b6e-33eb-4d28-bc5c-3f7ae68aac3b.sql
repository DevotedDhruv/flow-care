
-- Create table for exercise content
CREATE TABLE public.exercise_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- duration in seconds
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL CHECK (category IN ('menstrual', 'follicular', 'ovulation', 'luteal')),
  benefits TEXT[] DEFAULT '{}',
  instructor TEXT,
  video_url TEXT, -- YouTube URL or external video
  audio_url TEXT, -- Audio instructions URL
  voice_instructions TEXT[], -- Array of voice instruction text
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for meditation content
CREATE TABLE public.meditation_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- duration in seconds
  category TEXT NOT NULL CHECK (category IN ('cramps', 'pms', 'sleep', 'energy')),
  benefits TEXT[] DEFAULT '{}',
  instructor TEXT,
  audio_url TEXT, -- Main meditation audio URL
  voice_script TEXT[], -- Array of voice guidance text
  background_sounds TEXT[] DEFAULT '{}', -- Available background sounds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample exercise data with working YouTube URLs
INSERT INTO public.exercise_content (title, description, duration, difficulty, category, benefits, instructor, video_url, voice_instructions) VALUES
('Gentle Yoga Flow', 'Restorative poses to ease cramps and reduce tension', 900, 'Beginner', 'menstrual', 
 ARRAY['Reduces cramps', 'Improves circulation', 'Relieves stress'], 'Sarah Wilson',
 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
 ARRAY['Welcome to gentle yoga flow. Let''s start in child''s pose.', 'Breathe deeply and feel your body relax.', 'Now move into cat-cow pose slowly.', 'Hold this position and breathe.']),

('HIIT Cardio', 'High-intensity interval training for energy boost', 1500, 'Intermediate', 'follicular',
 ARRAY['Builds endurance', 'Burns calories', 'Increases energy'], 'Mike Johnson',
 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
 ARRAY['Time for high-intensity training! Let''s start with jumping jacks.', 'Push yourself for 30 seconds, then rest for 10.', 'Great energy! Keep that intensity up.', 'Final round - give it everything you''ve got!']),

('Dance Cardio', 'Fun, energetic dance workout', 1800, 'Intermediate', 'ovulation',
 ARRAY['Improves coordination', 'Burns calories', 'Boosts mood'], 'Lisa Garcia',
 'https://www.youtube.com/watch?v=gBmNukz_4Hw',
 ARRAY['Let''s dance! Feel the rhythm and move your body.', 'Don''t worry about perfect moves - just have fun!', 'You''re glowing with energy! Keep dancing.', 'Amazing energy! Cool down with gentle swaying.']),

('Pilates Core', 'Gentle core strengthening and stretching', 1200, 'Beginner', 'luteal',
 ARRAY['Strengthens core', 'Reduces PMS symptoms', 'Improves posture'], 'Emma Davis',
 'https://www.youtube.com/watch?v=7L0VoEHy6-M',
 ARRAY['Let''s focus on gentle core strengthening.', 'Engage your core muscles slowly and controlled.', 'Breathe steadily through each movement.', 'Perfect! Your core is getting stronger.']);

-- Insert sample meditation data with working YouTube URLs
INSERT INTO public.meditation_content (title, description, duration, category, benefits, instructor, audio_url, voice_script, background_sounds) VALUES
('Period Pain Relief', 'Guided meditation to help ease menstrual cramps through breathing and visualization', 600, 'cramps',
 ARRAY['Reduces pain perception', 'Promotes relaxation', 'Improves circulation'], 'Dr. Sarah Jones',
 'https://www.youtube.com/watch?v=LhYtcadR9nw',
 ARRAY['Welcome to this healing meditation for period pain relief.', 'Find a comfortable position and close your eyes.', 'Take a deep breath in through your nose...', 'And slowly exhale through your mouth, releasing any tension.', 'Imagine warm, healing light flowing to your lower abdomen.', 'With each breath, feel the pain gently melting away.'],
 ARRAY['rain', 'ocean', 'forest']),

('Emotional Balance', 'Mindfulness practice to navigate PMS emotions with grace and self-compassion', 720, 'pms',
 ARRAY['Balances emotions', 'Reduces irritability', 'Increases self-awareness'], 'Dr. Amanda Lee',
 'https://www.youtube.com/watch?v=ZToicYcHIOU',
 ARRAY['This meditation will help you find emotional balance and peace.', 'Acknowledge any difficult emotions without judgment.', 'You are not your emotions - you are the observer of them.', 'Breathe compassion into your heart.', 'Feel yourself returning to a state of calm equilibrium.'],
 ARRAY['birds', 'bells', 'white-noise']),

('Cycle Sleep Support', 'Gentle meditation to improve sleep quality during hormonal changes', 1200, 'sleep',
 ARRAY['Improves sleep quality', 'Regulates circadian rhythm', 'Balances hormones'], 'Dr. Rachel Green',
 'https://www.youtube.com/watch?v=jkjmNEVHa6w',
 ARRAY['This meditation will guide you into peaceful, restorative sleep.', 'Let your body sink deeply into your bed.', 'Release the day''s worries with each gentle breath.', 'Feel yourself drifting into a state of deep relaxation.', 'Allow sleep to come naturally and peacefully.'],
 ARRAY['rain', 'ocean', 'forest', 'white-noise']),

('Morning Energy Boost', 'Energizing meditation to start your day with vitality', 300, 'energy',
 ARRAY['Increases energy', 'Improves focus', 'Boosts motivation'], 'Alex Rivera',
 'https://www.youtube.com/watch?v=inpok4MKVLM',
 ARRAY['Good morning! Let''s awaken your inner energy and vitality.', 'Feel the life force energy flowing through every cell.', 'Imagine bright, golden light filling your entire being.', 'You are energized, focused, and ready for the day ahead.', 'Carry this vibrant energy with you.'],
 ARRAY['birds', 'forest', 'bells']);

-- Enable RLS on both tables
ALTER TABLE public.exercise_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_content ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is educational content)
CREATE POLICY "Allow public read access to exercise content" 
  ON public.exercise_content 
  FOR SELECT 
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public read access to meditation content" 
  ON public.meditation_content 
  FOR SELECT 
  TO PUBLIC
  USING (true);
