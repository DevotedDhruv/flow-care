
import { useState, useEffect } from 'react';
import { Play, Clock, Target, Heart, Zap, Flower2, User, Volume2, Music, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExerciseContent {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  difficulty: string;
  category: string;
  benefits: string[] | null;
  instructor: string | null;
  video_url: string | null;
  audio_url: string | null;
  voice_instructions: string[] | null;
}

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState<Record<string, ExerciseContent[]>>({});
  const [selectedExercise, setSelectedExercise] = useState<ExerciseContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState('nature');
  const [musicVolume, setMusicVolume] = useState([50]);
  const [voiceVolume, setVoiceVolume] = useState([75]);
  const { toast } = useToast();

  const musicOptions = [
    { value: 'nature', label: 'Nature Sounds' },
    { value: 'upbeat', label: 'Upbeat Music' },
    { value: 'ambient', label: 'Ambient Music' },
    { value: 'classical', label: 'Classical' },
    { value: 'none', label: 'No Music' }
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_content')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      // Group exercises by category
      const groupedExercises = data.reduce((acc: Record<string, ExerciseContent[]>, exercise) => {
        if (!acc[exercise.category]) {
          acc[exercise.category] = [];
        }
        acc[exercise.category].push(exercise);
        return acc;
      }, {});

      setExercises(groupedExercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Error",
        description: "Failed to load exercise content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'Gentle exercises to ease discomfort and maintain movement';
      case 'follicular': return 'Build momentum with energizing workouts';
      case 'ovulation': return 'Peak energy - perfect for challenging workouts';
      case 'luteal': return 'Wind down with calming, restorative exercises';
      default: return '';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getPhaseIcon = (category: string) => {
    switch (category) {
      case 'menstrual': return Heart;
      case 'follicular': return Zap;
      case 'ovulation': return Target;
      case 'luteal': return Flower2;
      default: return User;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-pink-600">Loading exercises...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="menstrual" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="menstrual">Menstrual</TabsTrigger>
          <TabsTrigger value="follicular">Follicular</TabsTrigger>
          <TabsTrigger value="ovulation">Ovulation</TabsTrigger>
          <TabsTrigger value="luteal">Luteal</TabsTrigger>
        </TabsList>

        {Object.entries(exercises).map(([phase, phaseExercises]) => (
          <TabsContent key={phase} value={phase} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{phase} Phase Exercises</span>
                  <Badge variant="outline">{phaseExercises.length} workouts</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{getPhaseDescription(phase)}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phaseExercises.map((exercise) => {
                    const Icon = getPhaseIcon(exercise.category);
                    return (
                      <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Icon className="w-6 h-6 text-pink-600" />
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{exercise.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(exercise.duration)}</span>
                          </div>
                          {exercise.instructor && (
                            <p className="text-sm text-muted-foreground">by {exercise.instructor}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                          {exercise.benefits && exercise.benefits.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <h4 className="text-sm font-medium">Benefits:</h4>
                              <div className="flex flex-wrap gap-1">
                                {exercise.benefits.map((benefit, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Workout
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Enhanced Workout Player with Voice & Music */}
      {selectedExercise && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Now Playing: {selectedExercise.title}</CardTitle>
            {selectedExercise.instructor && (
              <p className="text-sm text-muted-foreground">by {selectedExercise.instructor}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audio Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Guidance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm font-medium">Voice Guidance</span>
                  </div>
                  <Button
                    variant={isVoiceEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  >
                    {isVoiceEnabled ? "On" : "Off"}
                  </Button>
                </div>

                {/* Voice Volume */}
                {isVoiceEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voice Volume</span>
                      <span className="text-sm text-muted-foreground">{voiceVolume[0]}%</span>
                    </div>
                    <Slider
                      value={voiceVolume}
                      onValueChange={setVoiceVolume}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

                {/* Background Music */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Music</label>
                  <Select value={backgroundMusic} onValueChange={setBackgroundMusic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select music" />
                    </SelectTrigger>
                    <SelectContent>
                      {musicOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Music Volume */}
                {backgroundMusic !== 'none' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="w-4 h-4" />
                        <span className="text-sm">Music Volume</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{musicVolume[0]}%</span>
                    </div>
                    <Slider
                      value={musicVolume}
                      onValueChange={setMusicVolume}
                      max={100}
                      step={1}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Player */}
            {selectedExercise.video_url && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exercise Video</h3>
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(selectedExercise.video_url)}
                    title={selectedExercise.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Voice Instructions Preview */}
            {isVoiceEnabled && selectedExercise.voice_instructions && selectedExercise.voice_instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Voice Instructions Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedExercise.voice_instructions.map((instruction, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-sm">
                        <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                        <span className="text-muted-foreground">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Settings Display */}
            <div className="flex flex-wrap gap-2 justify-center">
              {isVoiceEnabled && (
                <Badge variant="outline">🎤 Voice guidance</Badge>
              )}
              {backgroundMusic !== 'none' && (
                <Badge variant="outline">🎵 {musicOptions.find(m => m.value === backgroundMusic)?.label}</Badge>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setSelectedExercise(null)}
              className="w-full"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseLibrary;
