import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Moon, Sun, Heart, Zap, Music, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MeditationApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null);
  const [volume, setVolume] = useState([75]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [backgroundSound, setBackgroundSound] = useState('rain');
  const [soundVolume, setSoundVolume] = useState([30]);

  const backgroundSounds = [
    { value: 'rain', label: 'Rain' },
    { value: 'ocean', label: 'Ocean Waves' },
    { value: 'forest', label: 'Forest Sounds' },
    { value: 'birds', label: 'Bird Songs' },
    { value: 'white-noise', label: 'White Noise' },
    { value: 'bells', label: 'Tibetan Bells' },
    { value: 'none', label: 'Silence' }
  ];

  const meditations = {
    cramps: [
      {
        title: "Period Pain Relief",
        duration: 600, // 10 minutes in seconds
        description: "Guided meditation to help ease menstrual cramps through breathing and visualization",
        instructor: "Dr. Sarah Jones",
        benefits: ["Reduces pain perception", "Promotes relaxation", "Improves circulation"],
        icon: Heart,
        audioFile: "period-pain-relief.mp3",
        voiceScript: [
          "Welcome to this healing meditation for period pain relief.",
          "Find a comfortable position and close your eyes.",
          "Take a deep breath in through your nose...",
          "And slowly exhale through your mouth, releasing any tension.",
          "Imagine warm, healing light flowing to your lower abdomen.",
          "With each breath, feel the pain gently melting away."
        ]
      },
      {
        title: "Body Scan for Comfort",
        duration: 900, // 15 minutes
        description: "Progressive body scan to release tension and find comfort during your period",
        instructor: "Maya Chen",
        benefits: ["Releases muscle tension", "Increases body awareness", "Promotes healing"],
        icon: Moon,
        audioFile: "body-scan-comfort.mp3",
        voiceScript: [
          "Let's begin this gentle body scan meditation.",
          "Start by noticing your feet, allowing them to relax completely.",
          "Move your attention to your legs, releasing any tightness.",
          "Feel your hips and pelvis softening with each breath.",
          "Continue this journey of relaxation through your entire body."
        ]
      }
    ],
    pms: [
      {
        title: "Emotional Balance",
        duration: 720, // 12 minutes
        description: "Mindfulness practice to navigate PMS emotions with grace and self-compassion",
        instructor: "Dr. Amanda Lee",
        benefits: ["Balances emotions", "Reduces irritability", "Increases self-awareness"],
        icon: Sun,
        audioFile: "emotional-balance.mp3",
        voiceScript: [
          "This meditation will help you find emotional balance and peace.",
          "Acknowledge any difficult emotions without judgment.",
          "You are not your emotions - you are the observer of them.",
          "Breathe compassion into your heart.",
          "Feel yourself returning to a state of calm equilibrium."
        ]
      },
      {
        title: "Stress Release",
        duration: 480, // 8 minutes
        description: "Quick stress-busting meditation for overwhelming PMS days",
        instructor: "Jennifer Smith",
        benefits: ["Reduces stress hormones", "Calms nervous system", "Improves mood"],
        icon: Zap,
        audioFile: "stress-release.mp3",
        voiceScript: [
          "Let's quickly release stress and tension from your body and mind.",
          "Take three deep, cleansing breaths.",
          "Imagine stress leaving your body with each exhale.",
          "Feel lightness and peace filling the space where stress once was.",
          "You are calm, centered, and in control."
        ]
      }
    ],
    sleep: [
      {
        title: "Cycle Sleep Support",
        duration: 1200, // 20 minutes
        description: "Gentle meditation to improve sleep quality during hormonal changes",
        instructor: "Dr. Rachel Green",
        benefits: ["Improves sleep quality", "Regulates circadian rhythm", "Balances hormones"],
        icon: Moon,
        audioFile: "cycle-sleep-support.mp3",
        voiceScript: [
          "This meditation will guide you into peaceful, restorative sleep.",
          "Let your body sink deeply into your bed.",
          "Release the day's worries with each gentle breath.",
          "Feel yourself drifting into a state of deep relaxation.",
          "Allow sleep to come naturally and peacefully."
        ]
      },
      {
        title: "Deep Rest Restoration",
        duration: 1800, // 30 minutes
        description: "Extended meditation for deep rest and hormonal balance",
        instructor: "Lisa Park",
        benefits: ["Promotes deep rest", "Supports hormone regulation", "Enhances recovery"],
        icon: Moon,
        audioFile: "deep-rest.mp3",
        voiceScript: [
          "Welcome to this extended meditation for deep restoration.",
          "This is your time to completely let go and restore.",
          "Feel your nervous system calming with each moment.",
          "Your body knows how to heal and balance itself.",
          "Rest in this state of perfect peace and restoration."
        ]
      }
    ],
    energy: [
      {
        title: "Morning Energy Boost",
        duration: 300, // 5 minutes
        description: "Energizing meditation to start your day with vitality",
        instructor: "Alex Rivera",
        benefits: ["Increases energy", "Improves focus", "Boosts motivation"],
        icon: Sun,
        audioFile: "morning-energy.mp3",
        voiceScript: [
          "Good morning! Let's awaken your inner energy and vitality.",
          "Feel the life force energy flowing through every cell.",
          "Imagine bright, golden light filling your entire being.",
          "You are energized, focused, and ready for the day ahead.",
          "Carry this vibrant energy with you."
        ]
      },
      {
        title: "Cycle Empowerment",
        duration: 600, // 10 minutes
        description: "Meditation to embrace your cycle and feel empowered in your body",
        instructor: "Dr. Maria Santos",
        benefits: ["Builds self-confidence", "Embraces femininity", "Increases body positivity"],
        icon: Heart,
        audioFile: "cycle-empowerment.mp3",
        voiceScript: [
          "This meditation celebrates the power and wisdom of your feminine cycle.",
          "Your body is wise and knows exactly what it needs.",
          "Feel gratitude for this amazing vessel that carries you.",
          "You are powerful, beautiful, and perfectly designed.",
          "Embrace your cycle as a source of strength and wisdom."
        ]
      }
    ]
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && selectedMeditation && currentTime < selectedMeditation.duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else if (currentTime >= (selectedMeditation?.duration || 0)) {
      setIsPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, selectedMeditation]);

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'cramps': return 'Meditations specifically designed to help with period pain and discomfort';
      case 'pms': return 'Emotional support and stress relief for PMS symptoms';
      case 'sleep': return 'Sleep-focused meditations to support your cycle';
      case 'energy': return 'Energizing practices to boost vitality and confidence';
      default: return '';
    }
  };

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
                  {categoryMeditations.map((meditation, index) => {
                    const Icon = meditation.icon;
                    return (
                      <Card 
                        key={index} 
                        className={`hover:shadow-lg transition-shadow cursor-pointer ${
                          selectedMeditation?.title === meditation.title ? 'ring-2 ring-pink-300' : ''
                        }`}
                        onClick={() => {
                          setSelectedMeditation(meditation);
                          setCurrentTime(0);
                          setIsPlaying(false);
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Icon className="w-6 h-6 text-pink-600" />
                            <Badge variant="outline">
                              {formatTime(meditation.duration)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{meditation.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">by {meditation.instructor}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{meditation.description}</p>
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

      {/* Enhanced Meditation Player */}
      {selectedMeditation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Now Playing: {selectedMeditation.title}</span>
              <Badge>{formatTime(selectedMeditation.duration)}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">by {selectedMeditation.instructor}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audio Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Guidance Toggle */}
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

                {/* Background Sound Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Sound</label>
                  <Select value={backgroundSound} onValueChange={setBackgroundSound}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select background sound" />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundSounds.map((sound) => (
                        <SelectItem key={sound.value} value={sound.value}>
                          {sound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sound Volume */}
                {backgroundSound !== 'none' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="w-4 h-4" />
                        <span className="text-sm">Background Volume</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{soundVolume[0]}%</span>
                    </div>
                    <Slider
                      value={soundVolume}
                      onValueChange={setSoundVolume}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

                {/* Voice Volume */}
                {isVoiceEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voice Volume</span>
                      <span className="text-sm text-muted-foreground">{volume[0]}%</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(selectedMeditation.duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pink-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentTime / selectedMeditation.duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                onClick={handlePlayPause}
                className="rounded-full w-16 h-16"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Master</span>
              </div>
            </div>

            {/* Current Settings Display */}
            <div className="flex flex-wrap gap-2 justify-center">
              {isVoiceEnabled && (
                <Badge variant="outline">🎤 Voice guidance</Badge>
              )}
              {backgroundSound !== 'none' && (
                <Badge variant="outline">🎵 {backgroundSounds.find(s => s.value === backgroundSound)?.label}</Badge>
              )}
            </div>

            {/* Voice Script Preview */}
            {isVoiceEnabled && selectedMeditation.voiceScript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Meditation Script Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMeditation.voiceScript.map((line: string, idx: number) => (
                      <p key={idx} className="text-sm text-muted-foreground italic">
                        "{line}"
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{selectedMeditation.description}</p>
              <div className="flex justify-center space-x-2">
                {selectedMeditation.benefits.map((benefit, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeditationApp;
