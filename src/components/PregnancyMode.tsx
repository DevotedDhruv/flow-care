
import { Baby, Calendar, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const PregnancyMode = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  
  // Mock pregnancy data
  const pregnancyWeek = 12;
  const dueDate = '2024-12-15';
  const trimester = pregnancyWeek <= 12 ? 1 : pregnancyWeek <= 26 ? 2 : 3;
  const progressPercentage = (pregnancyWeek / 40) * 100;

  const pregnancySymptoms = [
    'Morning sickness', 'Fatigue', 'Breast tenderness', 'Food cravings',
    'Food aversions', 'Heartburn', 'Frequent urination', 'Back pain',
    'Constipation', 'Mood swings', 'Shortness of breath', 'Swelling'
  ];

  const trimesterInfo = {
    1: {
      title: 'First Trimester',
      description: 'Your baby is rapidly developing. Focus on taking prenatal vitamins and avoiding harmful substances.',
      color: 'from-pink-100 to-pink-200',
      textColor: 'text-pink-600'
    },
    2: {
      title: 'Second Trimester',
      description: 'Often called the "golden period." You may feel more energetic and experience fewer symptoms.',
      color: 'from-purple-100 to-purple-200',
      textColor: 'text-purple-600'
    },
    3: {
      title: 'Third Trimester',
      description: 'Final stretch! Your baby is preparing for birth. Focus on birth preparation and rest.',
      color: 'from-teal-100 to-teal-200',
      textColor: 'text-teal-600'
    }
  };

  const milestones = [
    { week: 4, title: 'Implantation', completed: true },
    { week: 8, title: 'First heartbeat', completed: true },
    { week: 12, title: 'End of first trimester', completed: pregnancyWeek >= 12 },
    { week: 16, title: 'Gender reveal possible', completed: pregnancyWeek >= 16 },
    { week: 20, title: 'Anatomy scan', completed: pregnancyWeek >= 20 },
    { week: 24, title: 'Viability milestone', completed: pregnancyWeek >= 24 },
    { week: 28, title: 'Third trimester begins', completed: pregnancyWeek >= 28 },
    { week: 36, title: 'Full term approaching', completed: pregnancyWeek >= 36 },
  ];

  const currentTrimester = trimesterInfo[trimester];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`bg-gradient-to-br ${currentTrimester.color} border-pink-200`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Baby className="w-5 h-5 mr-2 text-pink-600" />
              Pregnancy Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <p className="text-3xl font-bold text-pink-600">{pregnancyWeek}</p>
                <p className="text-sm text-muted-foreground">Weeks pregnant</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <Badge className={`${currentTrimester.textColor} bg-white`}>
                {currentTrimester.title}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Due Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {new Date(dueDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-muted-foreground">Expected due date</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-muted-foreground">Days remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Heart className="w-5 h-5 mr-2 text-teal-600" />
              Baby Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl">🫐</div>
              <div>
                <p className="font-medium text-teal-600">Size of a lime</p>
                <p className="text-sm text-muted-foreground">About 2.1 inches</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your baby's reflexes are developing and they can make a fist!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
              Log Pregnancy Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Symptoms</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select symptoms" />
                </SelectTrigger>
                <SelectContent>
                  {pregnancySymptoms.map((symptom) => (
                    <SelectItem key={symptom} value={symptom}>
                      {symptom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling today?"
                className="h-20"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Log Symptoms
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pregnancy Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg ${
                    milestone.completed
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    milestone.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {milestone.completed ? '✓' : milestone.week}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      milestone.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      Week {milestone.week}: {milestone.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
            This Week's Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h4 className="font-medium text-pink-800 mb-2">Baby's Development</h4>
                <p className="text-sm text-pink-600">
                  Your baby's reflexes are starting to develop. They can curl their fingers and toes, 
                  and may even suck their thumb. The kidneys are now producing urine.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Your Body</h4>
                <p className="text-sm text-purple-600">
                  You may notice your bump starting to show. Morning sickness might be improving, 
                  and you may feel more energetic as you enter the second trimester.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h4 className="font-medium text-teal-800 mb-2">Recommended Actions</h4>
                <ul className="text-sm text-teal-600 space-y-1">
                  <li>• Continue taking prenatal vitamins</li>
                  <li>• Schedule your 12-week scan if not done</li>
                  <li>• Consider telling family and friends</li>
                  <li>• Start thinking about maternity clothes</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Things to Avoid</h4>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• High-mercury fish</li>
                  <li>• Raw or undercooked meats</li>
                  <li>• Unpasteurized dairy products</li>
                  <li>• Alcohol and smoking</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PregnancyMode;
