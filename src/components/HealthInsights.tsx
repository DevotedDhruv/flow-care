
import { BookOpen, TrendingUp, AlertCircle, Heart, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HealthInsights = () => {
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
      content: 'Learn about the four phases of your menstrual cycle and what to expect during each phase.',
      readTime: '5 min read'
    },
    {
      category: 'Fertility',
      title: 'Ovulation Signs and Symptoms',
      content: 'Discover the key signs that indicate ovulation and how to track them effectively.',
      readTime: '7 min read'
    },
    {
      category: 'Wellness',
      title: 'Managing PMS Naturally',
      content: 'Natural remedies and lifestyle changes that can help reduce PMS symptoms.',
      readTime: '6 min read'
    },
    {
      category: 'Nutrition',
      title: 'Eating for Your Cycle',
      content: 'How to adjust your nutrition throughout your cycle for optimal health and energy.',
      readTime: '8 min read'
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

  const getStatusColor = (status) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-sm text-muted-foreground mb-4">{content.content}</p>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
