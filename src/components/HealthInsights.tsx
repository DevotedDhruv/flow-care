import { useState } from 'react';
import { BookOpen, TrendingUp, AlertCircle, Heart, Info, ExternalLink, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const HealthInsights = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const insights = [
    {
      type: 'cycle',
      title: 'Cycle Regularity',
      description: 'Your cycles have been consistently 28-30 days over the past 6 months.',
      status: 'good',
      recommendation: 'Your cycle appears regular and healthy. Continue tracking to maintain this pattern.'
    },
    {
      type: 'symptoms',
      title: 'PMS Pattern',
      description: 'You typically experience moderate PMS symptoms 3-5 days before your period.',
      status: 'normal',
      recommendation: 'Consider gentle exercise and stress management during this time.'
    },
    {
      type: 'fertility',
      title: 'Ovulation Tracking',
      description: 'Your ovulation typically occurs around day 14 of your cycle.',
      status: 'good',
      recommendation: 'Your fertile window predictions appear accurate based on your data.'
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
    },
    {
      category: 'Fertility',
      title: 'Ovulation Signs and Symptoms',
      content: `Recognizing ovulation signs can help you understand your fertility and menstrual cycle better. Here are key indicators:

**Physical Signs:**
- **Cervical Mucus Changes**: Around ovulation, cervical mucus becomes clear, stretchy, and egg-white-like
- **Basal Body Temperature**: A slight rise (0.5-1°F) occurs after ovulation
- **Ovulation Pain**: Some women feel mild pain on one side of the abdomen (mittelschmerz)
- **Breast Tenderness**: Hormonal changes may cause breast sensitivity

**Other Indicators:**
- **Increased Libido**: Natural hormone fluctuations may increase sex drive
- **Heightened Senses**: Some women report enhanced taste or smell
- **Mood Changes**: You might feel more energetic or confident

**Tracking Methods:**
- Use ovulation predictor kits (OPKs) to detect LH surges
- Track basal body temperature daily
- Monitor cervical mucus consistency
- Use fertility tracking apps for pattern recognition

Remember, ovulation typically occurs 12-16 days before your next period, regardless of cycle length.`,
      readTime: '7 min read',
      sources: [
        'American Pregnancy Association',
        'Cleveland Clinic',
        'Planned Parenthood'
      ]
    },
    {
      category: 'Wellness',
      title: 'Managing PMS Naturally',
      content: `Premenstrual Syndrome (PMS) affects up to 75% of women. Natural remedies can significantly reduce symptoms:

**Dietary Approaches:**
- **Reduce Sodium**: Lower salt intake to minimize bloating and water retention
- **Limit Caffeine**: Reduces breast tenderness and anxiety
- **Increase Calcium**: 1,200mg daily may reduce PMS symptoms by 48%
- **Add Magnesium**: 200-400mg daily can help with cramps and mood
- **Complex Carbohydrates**: Help stabilize blood sugar and mood

**Lifestyle Changes:**
- **Regular Exercise**: 30 minutes of aerobic activity 3-4 times weekly
- **Stress Management**: Practice yoga, meditation, or deep breathing
- **Adequate Sleep**: 7-9 hours nightly supports hormone balance
- **Limit Alcohol**: Can worsen PMS symptoms and mood swings

**Herbal Remedies:**
- **Chasteberry (Vitex)**: May help balance hormones
- **Evening Primrose Oil**: Rich in GLA, may reduce breast pain
- **Turmeric**: Anti-inflammatory properties may reduce cramping

**When to Seek Help:**
If symptoms severely impact daily life, consult a healthcare provider about additional treatment options.`,
      readTime: '6 min read',
      sources: [
        'National Institute of Mental Health',
        'Journal of Women\'s Health',
        'International Journal of Women\'s Health'
      ]
    },
    {
      category: 'Nutrition',
      title: 'Eating for Your Cycle',
      content: `Your nutritional needs change throughout your menstrual cycle. Here's how to eat in sync with your hormones:

**Menstrual Phase (Days 1-5):**
- **Iron-Rich Foods**: Replenish iron lost through bleeding (lean meats, spinach, lentils)
- **Vitamin C**: Enhances iron absorption (citrus fruits, bell peppers, strawberries)
- **Anti-inflammatory Foods**: Reduce cramping (fatty fish, turmeric, ginger)
- **Comfort Foods**: Dark chocolate (in moderation) can boost mood

**Follicular Phase (Days 1-13):**
- **Lean Proteins**: Support egg development (chicken, fish, tofu)
- **Fresh Vegetables**: Provide energy as metabolism increases (broccoli, asparagus, zucchini)
- **Fermented Foods**: Support gut health (yogurt, kimchi, sauerkraut)

**Ovulatory Phase (Around Day 14):**
- **Antioxidant-Rich Foods**: Protect the egg (berries, leafy greens, nuts)
- **Healthy Fats**: Support hormone production (avocados, olive oil, seeds)
- **Fiber**: Help process estrogen (whole grains, beans, vegetables)

**Luteal Phase (Days 15-28):**
- **Complex Carbs**: Stabilize mood and energy (sweet potatoes, quinoa, oats)
- **Magnesium**: Reduce PMS symptoms (dark chocolate, nuts, seeds)
- **B Vitamins**: Support nervous system (eggs, leafy greens, legumes)

**Hydration:** Drink 8-10 glasses of water daily, increasing during menstruation.`,
      readTime: '8 min read',
      sources: [
        'Academy of Nutrition and Dietetics',
        'International Food Information Council',
        'Journal of Nutritional Science'
      ]
    }
  ];

  const youtubeVideos = [
    {
      title: "Understanding Your Menstrual Cycle",
      channel: "Planned Parenthood",
      duration: "4:32",
      thumbnail: "/placeholder.svg",
      url: "https://www.youtube.com/watch?v=example1"
    },
    {
      title: "Period Pain Relief - Natural Remedies",
      channel: "Healthcare Channel",
      duration: "6:15",
      thumbnail: "/placeholder.svg",
      url: "https://www.youtube.com/watch?v=example2"
    },
    {
      title: "Nutrition for Women's Health",
      channel: "Nutrition Experts",
      duration: "8:45",
      thumbnail: "/placeholder.svg",
      url: "https://www.youtube.com/watch?v=example3"
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2 text-red-600" />
                Recommended Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {youtubeVideos.map((video, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-200 relative group cursor-pointer">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-muted-foreground">{video.channel}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Watch
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <h4 className="font-medium text-pink-800">For Your Current Cycle Phase</h4>
                  <p className="text-sm text-pink-600 mt-1">
                    You're in your follicular phase. This is a great time to start new projects and engage in more intense workouts.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800">Upcoming Period Preparation</h4>
                  <p className="text-sm text-purple-600 mt-1">
                    Your period is expected in 16 days. Consider stocking up on supplies and planning for self-care.
                  </p>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <h4 className="font-medium text-teal-800">Data Tracking Reminder</h4>
                  <p className="text-sm text-teal-600 mt-1">
                    You haven't logged symptoms for 2 days. Regular tracking helps improve prediction accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsights;
