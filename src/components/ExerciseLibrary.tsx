
import { useState } from 'react';
import { Play, Clock, Target, Heart, Zap, Flower2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExerciseLibrary = () => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const exercises = {
    menstrual: [
      {
        title: "Gentle Yoga Flow",
        duration: "15 min",
        difficulty: "Beginner",
        description: "Restorative poses to ease cramps and reduce tension",
        benefits: ["Reduces cramps", "Improves circulation", "Relieves stress"],
        icon: Flower2,
        videoId: "abc123"
      },
      {
        title: "Light Walking",
        duration: "20 min",
        difficulty: "Beginner",
        description: "Low-impact cardio to boost mood and energy",
        benefits: ["Boosts endorphins", "Reduces bloating", "Improves mood"],
        icon: User,
        videoId: "def456"
      }
    ],
    follicular: [
      {
        title: "HIIT Cardio",
        duration: "25 min",
        difficulty: "Intermediate",
        description: "High-intensity interval training for energy boost",
        benefits: ["Builds endurance", "Burns calories", "Increases energy"],
        icon: Zap,
        videoId: "ghi789"
      },
      {
        title: "Strength Training",
        duration: "30 min",
        difficulty: "Intermediate",
        description: "Full-body workout with weights",
        benefits: ["Builds muscle", "Improves bone density", "Boosts metabolism"],
        icon: Target,
        videoId: "jkl012"
      }
    ],
    ovulation: [
      {
        title: "Dance Cardio",
        duration: "30 min",
        difficulty: "Intermediate",
        description: "Fun, energetic dance workout",
        benefits: ["Improves coordination", "Burns calories", "Boosts mood"],
        icon: Heart,
        videoId: "mno345"
      },
      {
        title: "Power Yoga",
        duration: "45 min",
        difficulty: "Advanced",
        description: "Dynamic yoga flow for peak energy phase",
        benefits: ["Builds strength", "Improves flexibility", "Enhances focus"],
        icon: Flower2,
        videoId: "pqr678"
      }
    ],
    luteal: [
      {
        title: "Pilates Core",
        duration: "20 min",
        difficulty: "Beginner",
        description: "Gentle core strengthening and stretching",
        benefits: ["Strengthens core", "Reduces PMS symptoms", "Improves posture"],
        icon: Target,
        videoId: "stu901"
      },
      {
        title: "Restorative Yoga",
        duration: "25 min",
        difficulty: "Beginner",
        description: "Calming poses to prepare for menstruation",
        benefits: ["Reduces stress", "Improves sleep", "Balances hormones"],
        icon: Flower2,
        videoId: "vwx234"
      }
    ]
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
                  {phaseExercises.map((exercise, index) => {
                    const Icon = exercise.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                            <span>{exercise.duration}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
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

      {/* Workout Player Modal would go here */}
      {selectedExercise && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Now Playing: {selectedExercise.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-600">Video player would be here</p>
                <p className="text-sm text-gray-500">Duration: {selectedExercise.duration}</p>
              </div>
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
