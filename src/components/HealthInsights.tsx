import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, AlertCircle, Heart, Info, ExternalLink, Play, Dumbbell, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCycleData } from '@/hooks/useCycleData';
import ExerciseLibrary from './ExerciseLibrary';
import MeditationApp from './MeditationApp';

const HealthInsights = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [userCycles, setUserCycles] = useState<any[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const cycleData = useCycleData();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user's cycle data
      const { data: cycles } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', user?.id)
        .order('cycle_start_date', { ascending: false })
        .limit(6);

      // Fetch user's recent symptoms
      const { data: symptoms } = await supabase
        .from('period_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(10);

      setUserCycles(cycles || []);
      setUserSymptoms(symptoms || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeUserData = () => {
    if (userCycles.length === 0) return null;

    const cycleLengths = userCycles.map(cycle => cycle.cycle_length).filter(Boolean);
    const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const isIrregular = cycleLengths.some(length => Math.abs(length - avgCycleLength) > 7);
    
    // Analyze symptoms
    const recentSymptoms = userSymptoms.slice(0, 5);
    const commonSymptoms = recentSymptoms.reduce((acc, entry) => {
      if (entry.symptoms && typeof entry.symptoms === 'object') {
        Object.entries(entry.symptoms).forEach(([symptom, severity]) => {
          if (typeof severity === 'number' && severity > 3) {
            acc[symptom] = (acc[symptom] || 0) + 1;
          }
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      avgCycleLength: Math.round(avgCycleLength),
      isIrregular,
      commonSymptoms: Object.keys(commonSymptoms).slice(0, 3),
      cycleLengths
    };
  };

  const getPersonalizedVideos = () => {
    const analysis = analyzeUserData();
    
    // Comprehensive video library with working YouTube videos organized by category
    const videoLibrary = {
      yoga: [
        {
          title: "Gentle Morning Yoga Flow",
          channel: "Yoga with Adriene",
          duration: "10:15",
          description: "Start your day with gentle energy-boosting yoga",
          videoId: "VaoV1P82Xio"
        },
        {
          title: "Yoga for Menstrual Cramps",
          channel: "Yoga with Adriene",
          duration: "18:22",
          description: "Gentle yoga poses to relieve menstrual pain",
          videoId: "C-zAXIzOzRU"
        },
        {
          title: "Restorative Yoga for Relaxation",
          channel: "Boho Beautiful",
          duration: "25:10",
          description: "Calming yoga for deep relaxation and stress relief",
          videoId: "GLy2rYHwUqY"
        },
        {
          title: "Yoga for Better Sleep",
          channel: "Yoga with Adriene",
          duration: "20:45",
          description: "Relaxing bedtime yoga sequence",
          videoId: "BiWDsfZ3jdI"
        },
        {
          title: "Hormone Balance Yoga",
          channel: "Yoga with Adriene",
          duration: "30:12",
          description: "Yoga sequence to support hormonal balance",
          videoId: "RT37QsKZOLw"
        }
      ],
      exercise: [
        {
          title: "Low Impact Cardio Workout",
          channel: "FitnessBlender",
          duration: "15:30",
          description: "Gentle cardio suitable for any time of the month",
          videoId: "gC_L9qAHVJ8"
        },
        {
          title: "Pilates Core Strengthening",
          channel: "Move with Nicole",
          duration: "12:45",
          description: "Core strengthening exercises for better posture",
          videoId: "7L0VoEHy6-M"
        },
        {
          title: "Walking Workout at Home",
          channel: "Walk at Home",
          duration: "20:00",
          description: "Indoor walking workout for when you can't go outside",
          videoId: "gBmNukz_4Hw"
        },
        {
          title: "Strength Training for Beginners",
          channel: "Calisthenic Movement",
          duration: "16:25",
          description: "Bodyweight exercises for building strength",
          videoId: "ml6cT4AZdqI"
        },
        {
          title: "Full Body Stretch Routine",
          channel: "MadFit",
          duration: "14:18",
          description: "Complete stretching routine for flexibility",
          videoId: "g_tea8ZNk5A"
        }
      ],
      meditation: [
        {
          title: "Guided Meditation for Period Pain",
          channel: "The Honest Guys",
          duration: "10:33",
          description: "Meditation to help with menstrual cramps",
          videoId: "ZToicYcHIOU"
        },
        {
          title: "Stress Relief Meditation",
          channel: "Headspace",
          duration: "6:20",
          description: "Quick meditation for stress management",
          videoId: "YRPh_GaiL8s"
        },
        {
          title: "Sleep Meditation",
          channel: "Jason Stephenson",
          duration: "12:15",
          description: "Guided meditation for better sleep",
          videoId: "jkjmNEVHa6w"
        },
        {
          title: "Morning Energy Meditation",
          channel: "Michael Sealey",
          duration: "8:45",
          description: "Energizing meditation to start your day",
          videoId: "inpok4MKVLM"
        },
        {
          title: "Emotional Balance Meditation",
          channel: "The Mindful Movement",
          duration: "15:30",
          description: "Meditation for emotional stability during cycle changes",
          videoId: "LhYtcadR9nw"
        }
      ]
    };

    let personalizedVideos: any[] = [];

    // Add videos based on user's specific needs
    if (analysis?.isIrregular) {
      personalizedVideos.push(...videoLibrary.yoga.filter(v => 
        v.title.includes('Hormone') || v.title.includes('Balance')
      ));
    }

    if (analysis?.commonSymptoms.includes('cramps')) {
      personalizedVideos.push(...videoLibrary.yoga.filter(v => 
        v.title.includes('Cramps') || v.title.includes('Pain')
      ));
      personalizedVideos.push(...videoLibrary.meditation.filter(v => 
        v.title.includes('Pain') || v.title.includes('Relief')
      ));
    }

    // Add variety from each category
    personalizedVideos.push(...videoLibrary.yoga.slice(0, 3));
    personalizedVideos.push(...videoLibrary.exercise.slice(0, 3));
    personalizedVideos.push(...videoLibrary.meditation.slice(0, 3));

    // Remove duplicates and add category info
    const uniqueVideos = personalizedVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.videoId === video.videoId)
    );

    // Add category info to each video
    return uniqueVideos.map(video => {
      let category = 'wellness';
      if (videoLibrary.yoga.some(v => v.videoId === video.videoId)) category = 'yoga';
      if (videoLibrary.exercise.some(v => v.videoId === video.videoId)) category = 'exercise';
      if (videoLibrary.meditation.some(v => v.videoId === video.videoId)) category = 'meditation';
      
      return { ...video, category };
    });
  };

  const getPersonalizedContent = () => {
    const analysis = analyzeUserData();
    if (!analysis) return { articles: [], videos: [] };

    const { isIrregular, commonSymptoms, avgCycleLength } = analysis;
    
    let personalizedArticles = [...educationalContent];

    if (isIrregular) {
      personalizedArticles.unshift({
        category: 'Cycle Health',
        title: 'Managing Irregular Cycles',
        content: `Based on your cycle data, you've experienced some irregularity in your menstrual cycles. Irregular periods can be caused by various factors including stress, weight changes, hormonal imbalances, or underlying health conditions.

**What Causes Irregular Cycles:**
- Stress and lifestyle changes
- Significant weight loss or gain
- Excessive exercise
- Hormonal disorders (PCOS, thyroid issues)
- Medications
- Approaching menopause

**When to See a Doctor:**
- Cycles shorter than 21 days or longer than 35 days
- Missing periods for 3+ months
- Extremely heavy or light bleeding
- Severe pain or other concerning symptoms

**Management Strategies:**
- Maintain a healthy weight
- Manage stress through relaxation techniques
- Regular, moderate exercise
- Consistent sleep schedule
- Balanced nutrition with adequate nutrients

**Track Your Patterns:**
Continue tracking your cycles to identify patterns and triggers. This information will be valuable for healthcare providers if you need medical consultation.`,
        readTime: '6 min read',
        sources: [
          'American College of Obstetricians and Gynecologists',
          'Mayo Clinic',
          'Cleveland Clinic'
        ]
      });
    }

    if (commonSymptoms.includes('cramps')) {
      personalizedArticles.push({
        category: 'Pain Management',
        title: 'Natural Cramp Relief Methods',
        content: `Your recent entries show frequent cramping. Here are evidence-based methods to help manage menstrual cramps naturally:

**Immediate Relief Methods:**
- **Heat Therapy**: Apply heating pads or take warm baths to relax uterine muscles
- **Gentle Exercise**: Light walking, yoga, or stretching can reduce pain
- **Massage**: Abdominal and lower back massage with essential oils
- **Hydration**: Drink plenty of water to reduce bloating

**Dietary Approaches:**
- **Anti-inflammatory Foods**: Leafy greens, berries, fatty fish, nuts
- **Magnesium-Rich Foods**: Dark chocolate, spinach, almonds, avocados
- **Limit**: Caffeine, alcohol, processed foods, and excess sugar
- **Herbal Teas**: Chamomile, ginger, or raspberry leaf tea

**Supplements That May Help:**
- Magnesium (200-400mg daily)
- Omega-3 fatty acids
- Vitamin D
- Turmeric (curcumin)

**Lifestyle Modifications:**
- Regular sleep schedule (7-9 hours)
- Stress management techniques
- Regular exercise throughout the month
- Proper posture and ergonomics

**When to Seek Medical Help:**
If cramps are severe enough to interfere with daily activities, last longer than usual, or are accompanied by heavy bleeding, consult a healthcare provider.`,
        readTime: '5 min read',
        sources: [
          'Journal of Pain Research',
          'American Family Physician',
          'Cochrane Reviews'
        ]
      });
    }

    return {
      articles: personalizedArticles.slice(0, 6),
      videos: getPersonalizedVideos()
    };
  };

  const insights = [
    {
      type: 'cycle',
      title: 'Cycle Regularity',
      description: userCycles.length > 0 
        ? `Your average cycle length is ${analyzeUserData()?.avgCycleLength || 28} days based on your recent data.`
        : 'Start tracking to get personalized cycle insights.',
      status: analyzeUserData()?.isIrregular ? 'attention' : 'good',
      recommendation: analyzeUserData()?.isIrregular 
        ? 'Your cycles show some irregularity. Consider consulting a healthcare provider if this continues.'
        : 'Your cycle appears regular and healthy. Continue tracking to maintain this pattern.'
    },
    {
      type: 'symptoms',
      title: 'Symptom Patterns',
      description: userSymptoms.length > 0
        ? `You've logged symptoms ${userSymptoms.length} times recently.`
        : 'Start logging symptoms to identify patterns.',
      status: 'normal',
      recommendation: 'Continue tracking symptoms to identify patterns and triggers.'
    },
    {
      type: 'data',
      title: 'Tracking Consistency',
      description: `You have ${userCycles.length} cycles and ${userSymptoms.length} symptom entries recorded.`,
      status: userCycles.length >= 3 ? 'good' : 'attention',
      recommendation: userCycles.length >= 3 
        ? 'Great job maintaining consistent tracking!'
        : 'Try to track consistently for at least 3 cycles to get better insights.'
    }
  ];

  const educationalContent = [
    {
      category: 'Menstrual Health',
      title: 'Understanding Your Cycle',
      content: `The menstrual cycle is a complex process that prepares your body for potential pregnancy each month. It typically lasts 21-35 days and consists of four main phases:

1. **Menstrual Phase (Days 1-5)**: This is when you have your period. The lining of your uterus (endometrium) sheds, causing bleeding that typically lasts 3-7 days.

2. **Follicular Phase (Days 1-13)**: Your brain releases hormones that signal your ovaries to prepare an egg for release. Estrogen levels begin to rise.

3. **Ovulation (Around Day 14)**: A mature egg is released from the ovary. This is your most fertile time.

4. **Luteal Phase (Days 15-28)**: The egg travels down the fallopian tube. If not fertilized, hormone levels drop, leading to the next menstrual phase.

Understanding these phases can help you better predict your periods, identify your fertile window, and recognize what's normal for your body.`,
      readTime: '5 min read',
      sources: [
        'American College of Obstetricians and Gynecologists',
        'Mayo Clinic',
        'Harvard Health Publishing'
      ]
    }
  ];

  const tips = [
    {
      icon: Heart,
      title: 'Stay Hydrated',
      description: 'Drinking plenty of water can help reduce bloating and improve energy levels during your cycle.'
    },
    {
      icon: TrendingUp,
      title: 'Regular Exercise',
      description: 'Light to moderate exercise can help reduce cramps and improve mood during menstruation.'
    },
    {
      icon: BookOpen,
      title: 'Track Sleep',
      description: 'Getting 7-9 hours of quality sleep is crucial for hormone regulation and overall health.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openYouTubeVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const personalizedContent = getPersonalizedContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading your health insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="insights" className="text-xs lg:text-sm px-1 lg:px-3">
            Insights
          </TabsTrigger>
          <TabsTrigger value="videos" className="text-xs lg:text-sm px-1 lg:px-3">
            Videos
          </TabsTrigger>
          <TabsTrigger value="education" className="text-xs lg:text-sm px-1 lg:px-3">
            Education
          </TabsTrigger>
          <TabsTrigger value="exercise" className="text-xs lg:text-sm px-1 lg:px-3">
            Exercise
          </TabsTrigger>
          <TabsTrigger value="meditation" className="text-xs lg:text-sm px-1 lg:px-3">
            Meditation
          </TabsTrigger>
          <TabsTrigger value="tips" className="text-xs lg:text-sm px-1 lg:px-3">
            Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base lg:text-lg">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-pink-600" />
                  Personalized Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-3 lg:p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm lg:text-base">{insight.title}</h4>
                      <Badge className={`${getStatusColor(insight.status)} text-xs`}>
                        {insight.status === 'good' ? 'Good' : insight.status === 'normal' ? 'Normal' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{insight.description}</p>
                    <p className="text-xs lg:text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {insight.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base lg:text-lg">
                  <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-purple-600" />
                  Health Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-2xl lg:text-3xl font-bold text-purple-600">8.5</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Overall Health Score</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm">Cycle Regularity</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 lg:w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs lg:text-sm font-medium">9.2</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm">Symptom Management</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 lg:w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/5 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-xs lg:text-sm font-medium">7.5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm">Data Consistency</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 lg:w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs lg:text-sm font-medium">8.8</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm">Wellness Habits</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 lg:w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-xs lg:text-sm font-medium">8.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-pink-600" />
                Personalized Video Library
              </CardTitle>
              <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                Videos recommended based on your cycle data and symptoms
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalizedContent.videos.map((video, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{video.category}</Badge>
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                      </div>
                      <CardTitle className="text-sm lg:text-lg">{video.title}</CardTitle>
                      <p className="text-xs lg:text-sm text-muted-foreground">by {video.channel}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-3">{video.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full text-xs lg:text-sm"
                        onClick={() => openYouTubeVideo(video.videoId)}
                      >
                        <Play className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {personalizedContent.articles.map((content, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{content.category}</Badge>
                    <span className="text-xs text-muted-foreground">{content.readTime}</span>
                  </div>
                  <CardTitle className="text-sm lg:text-lg">{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-4 line-clamp-3">
                    {content.content.substring(0, 150)}...
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-xs lg:text-sm">
                        <BookOpen className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-lg lg:text-xl">{content.title}</DialogTitle>
                        <div className="flex items-center space-x-4 text-xs lg:text-sm text-muted-foreground">
                          <Badge variant="outline">{content.category}</Badge>
                          <span>{content.readTime}</span>
                        </div>
                      </DialogHeader>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-xs lg:text-sm leading-relaxed">
                          {content.content}
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2 text-sm lg:text-base">Sources:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {content.sources.map((source, idx) => (
                              <li key={idx}>• {source}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Dumbbell className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-pink-600" />
                Cycle-Synced Exercise Library
              </CardTitle>
              <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                Workouts tailored to your menstrual cycle phases for optimal results and comfort
              </p>
            </CardHeader>
            <CardContent>
              <ExerciseLibrary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Brain className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-purple-600" />
                Guided Meditation & Mindfulness
              </CardTitle>
              <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                Meditation sessions designed to support your menstrual health and emotional well-being
              </p>
            </CardHeader>
            <CardContent>
              <MeditationApp />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base lg:text-lg">
                <Info className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-teal-600" />
                Daily Wellness Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="text-center p-4 lg:p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                      <Icon className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 text-teal-600" />
                      <h4 className="font-medium mb-2 text-sm lg:text-base">{tip.title}</h4>
                      <p className="text-xs lg:text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsights;
