
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Activity, TrendingUp, BookOpen } from 'lucide-react';
import EducationalContent from './EducationalContent';

const HealthInsights = () => {
  const [selectedTab, setSelectedTab] = useState('insights');

  const healthMetrics = [
    {
      title: 'Sleep Quality',
      value: 85,
      status: 'Good',
      color: 'bg-blue-500',
      recommendation: 'Maintain your current sleep schedule of 7-8 hours per night.',
    },
    {
      title: 'Energy Level',
      value: 72,
      status: 'Moderate',
      color: 'bg-green-500',
      recommendation: 'Consider light exercise during your luteal phase to boost energy.',
    },
    {
      title: 'Mood Stability',
      value: 68,
      status: 'Fair',
      color: 'bg-yellow-500',
      recommendation: 'Try meditation or journaling to help manage mood fluctuations.',
    },
    {
      title: 'Stress Level',
      value: 45,
      status: 'Low',
      color: 'bg-purple-500',
      recommendation: 'Great job managing stress! Continue with your current practices.',
    },
  ];

  const cycleInsights = [
    {
      phase: 'Menstrual Phase',
      day: 'Day 2',
      description: 'Focus on rest and gentle movement. Iron-rich foods can help combat fatigue.',
      tips: ['Stay hydrated', 'Use heat therapy for cramps', 'Get adequate rest'],
    },
    {
      phase: 'Follicular Phase',
      day: 'Days 6-13',
      description: 'Energy is building. Great time to start new projects and increase activity.',
      tips: ['Try new exercises', 'Plan important meetings', 'Focus on goals'],
    },
  ];

  const symptoms = [
    { name: 'Cramps', severity: 'Mild', frequency: '3 days', trend: 'decreasing' },
    { name: 'Bloating', severity: 'Moderate', frequency: '2 days', trend: 'stable' },
    { name: 'Mood Changes', severity: 'Mild', frequency: '4 days', trend: 'improving' },
    { name: 'Fatigue', severity: 'Low', frequency: '1 day', trend: 'decreasing' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Health Insights
        </h2>
        <p className="text-muted-foreground mt-2">
          Personalized insights based on your cycle and symptoms
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Health Insights</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Education</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{metric.title}</span>
                    <Badge variant={metric.status === 'Good' ? 'default' : 'secondary'}>
                      {metric.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Score</span>
                        <span className="text-sm text-muted-foreground">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cycle Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" />
                Cycle Phase Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cycleInsights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-pink-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-pink-600">{insight.phase}</h3>
                      <Badge variant="outline">{insight.day}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.tips.map((tip, tipIndex) => (
                        <Badge key={tipIndex} variant="secondary" className="text-xs">
                          {tip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Symptom Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">{symptom.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {symptom.severity} severity • {symptom.frequency}
                      </p>
                    </div>
                    <Badge 
                      variant={symptom.trend === 'decreasing' ? 'default' : 
                              symptom.trend === 'improving' ? 'default' : 'secondary'}
                      className={symptom.trend === 'decreasing' || symptom.trend === 'improving' ? 
                                'bg-green-100 text-green-800' : ''}
                    >
                      {symptom.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-teal-600" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                  <h4 className="font-medium text-pink-800 dark:text-pink-200 mb-2">Nutrition Focus</h4>
                  <p className="text-sm text-pink-600 dark:text-pink-300">
                    During your menstrual phase, increase iron-rich foods like spinach, lentils, and lean meats to combat fatigue.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Exercise Suggestion</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300">
                    Try gentle yoga or walking for the next few days. Your energy will naturally increase as you move into the follicular phase.
                  </p>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <h4 className="font-medium text-teal-800 dark:text-teal-200 mb-2">Wellness Tip</h4>
                  <p className="text-sm text-teal-600 dark:text-teal-300">
                    Consider tracking your sleep quality more closely. Good sleep can significantly improve your menstrual symptoms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <EducationalContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthInsights;
