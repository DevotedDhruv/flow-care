
-- Update exercise content with working YouTube URLs
UPDATE public.exercise_content SET
  video_url = 'https://www.youtube.com/watch?v=v7AYKMP6rOE'
WHERE title = 'Gentle Yoga Flow';

UPDATE public.exercise_content SET
  video_url = 'https://www.youtube.com/watch?v=ml6cT4AZdqI'
WHERE title = 'HIIT Cardio';

UPDATE public.exercise_content SET
  video_url = 'https://www.youtube.com/watch?v=gBmNukz_4Hw'
WHERE title = 'Dance Cardio';

UPDATE public.exercise_content SET
  video_url = 'https://www.youtube.com/watch?v=7L0VoEHy6-M'
WHERE title = 'Pilates Core';

-- Update meditation content with working YouTube URLs
UPDATE public.meditation_content SET
  audio_url = 'https://www.youtube.com/watch?v=LhYtcadR9nw'
WHERE title = 'Period Pain Relief';

UPDATE public.meditation_content SET
  audio_url = 'https://www.youtube.com/watch?v=ZToicYcHIOU'
WHERE title = 'Emotional Balance';

UPDATE public.meditation_content SET
  audio_url = 'https://www.youtube.com/watch?v=jkjmNEVHa6w'
WHERE title = 'Cycle Sleep Support';

UPDATE public.meditation_content SET
  audio_url = 'https://www.youtube.com/watch?v=inpok4MKVLM'
WHERE title = 'Morning Energy Boost';
