
import { useState, useEffect } from 'react';
import { Play, Moon, Sun, Heart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MeditationContent {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  category: string;
  benefits: string[] | null;
  instructor: string | null;
  audio_url: string | null;
  voice_script: string[] | null;
  background_sounds: string[] | null;
}

const MeditationApp = () => {
  const [meditations, setMeditations] = useState<Record<string, MeditationContent[]>>({});
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async () => {
    try {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      // Group meditations by category
      const groupedMeditations = data.reduce((acc: Record<string, MeditationContent[]>, meditation) => {
        if (!acc[meditation.category]) {
          acc[meditation.category] = [];
        }
        acc[meditation.category].push(meditation);
        return acc;
      }, {});

      setMeditations(groupedMeditations);
    } catch (error) {
      console.error('Error fetching meditations:', error);
      toast({
        title: "Error",
        description: "Failed to load meditation content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'cramps': return 'Meditations specifically designed to help with period pain and discomfort';
      case 'pms': return 'Emotional support and stress relief for PMS symptoms';
      case 'sleep': return 'Sleep-focused meditations to support your cycle';
      case 'energy': return 'Energizing practices to boost vitality and confidence';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cramps': return Heart;
      case 'pms': return Sun;
      case 'sleep': return Moon;
      case 'energy': return Zap;
      default: return Heart;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-pink-600">Loading meditations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cramps" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cramps">Cramps</TabsTrigger>
          <TabsTrigger value="pms">PMS</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>

        {Object.entries(meditations).map(([category, categoryMeditations]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category} Meditations</CardTitle>
                <p className="text-sm text-muted-foreground">{getTabDescription(category)}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryMeditations.map((meditation) => {
                    const Icon = getCategoryIcon(meditation.category);
                    return (
                      <Card 
                        key={meditation.id} 
                        className={`hover:shadow-lg transition-shadow cursor-pointer ${
                          selectedMeditation?.id === meditation.id ? 'ring-2 ring-pink-300' : ''
                        }`}
                        onClick={() => setSelectedMeditation(meditation)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Icon className="w-6 h-6 text-pink-600" />
                            <Badge variant="outline">
                              {formatTime(meditation.duration)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{meditation.title}</CardTitle>
                          {meditation.instructor && (
                            <p className="text-sm text-muted-foreground">by {meditation.instructor}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{meditation.description}</p>
                          {meditation.benefits && meditation.benefits.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Benefits:</h4>
                              <div className="flex flex-wrap gap-1">
                                {meditation.benefits.map((benefit, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
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

      {/* Audio/Video Player */}
      {selectedMeditation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Now Playing: {selectedMeditation.title}</span>
              <Badge>{formatTime(selectedMeditation.duration)}</Badge>
            </CardTitle>
            {selectedMeditation.instructor && (
              <p className="text-sm text-muted-foreground">by {selectedMeditation.instructor}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedMeditation.audio_url && (
              <div className="space-y-4">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(selectedMeditation.audio_url)}
                    title={selectedMeditation.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {selectedMeditation.voice_script && selectedMeditation.voice_script.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meditation Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedMeditation.voice_script.map((line, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground italic">
                        "{line}"
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{selectedMeditation.description}</p>
              {selectedMeditation.benefits && selectedMeditation.benefits.length > 0 && (
                <div className="flex justify-center space-x-2">
                  {selectedMeditation.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setSelectedMeditation(null)}
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

export default MeditationApp;
