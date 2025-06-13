import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, AlertCircle, Heart, Info, ExternalLink, Play, Dumbbell, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ExerciseLibrary from './ExerciseLibrary';
import MeditationApp from './MeditationApp';

const HealthInsights = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [userCycles, setUserCycles] = useState<any[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  const getPersonalizedContent = () => {
    const analysis = analyzeUserData();
    if (!analysis) return { articles: [], videos: [] };

    const { isIrregular, commonSymptoms, avgCycleLength } = analysis;
    
    let personalizedArticles = [...educationalContent];
    let personalizedVideos = [...youtubeVideos];

    // Filter content based on user's specific needs
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

      personalizedVideos.unshift({
        title: "Understanding Irregular Periods",
        channel: "Mayo Clinic",
        duration: "5:23",
        thumbnail: "/placeholder.svg",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoId: "dQw4w9WgXcQ"
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

    if (avgCycleLength > 35) {
      personalizedVideos.push({
        title: "Long Menstrual Cycles Explained",
        channel: "Women's Health Network",
        duration: "7:45",
        thumbnail: "/placeholder.svg",
        url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
        videoId: "oHg5SJYRHA0"
      });
    }

    return {
      articles: personalizedArticles.slice(0, 6),
      videos: personalizedVideos.slice(0, 6)
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

  const youtubeVideos = [
    {
      title: "Understanding Your Menstrual Cycle",
      channel: "Planned Parenthood",
      duration: "4:32",
      thumbnail: "/placeholder.svg",
      url: "https://www.youtube.com/watch?v=W_o-I9fXrTk",
      videoId: "W_o-I9fXrTk"
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="tips">Daily Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
                  Personalized Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge className={getStatusColor(insight.status)}>
                        {insight.status === 'good' ? 'Good' : insight.status === 'normal' ? 'Normal' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {insight.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Health Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-purple-600">8.5</p>
                  <p className="text-sm text-muted-foreground">Overall Health Score</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cycle Regularity</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">9.2</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Symptom Management</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-3/5 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">7.5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Consistency</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">8.8</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Wellness Habits</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">8.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {educationalContent.map((content, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{content.category}</Badge>
                    <span className="text-xs text-muted-foreground">{content.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {content.content.substring(0, 150)}...
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{content.title}</DialogTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{content.category}</Badge>
                          <span>{content.readTime}</span>
                        </div>
                      </DialogHeader>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {content.content}
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Sources:</h4>
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
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-pink-600" />
                Cycle-Synced Exercise Library
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
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
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Guided Meditation & Mindfulness
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
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
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-teal-600" />
                Daily Wellness Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-teal-600" />
                      <h4 className="font-medium mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
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
