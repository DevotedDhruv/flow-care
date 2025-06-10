
import { useState } from 'react';
import { Baby, Calendar, Heart, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const PregnancyMode = () => {
  const [currentWeek, setCurrentWeek] = useState(20);
  const [dueDate, setDueDate] = useState('2024-07-15');
  const [symptoms, setSymptoms] = useState('');
  const [appointments, setAppointments] = useState([
    { date: '2024-01-15', type: 'Ultrasound', notes: 'Everything looks great!' },
    { date: '2024-01-01', type: 'Regular Checkup', notes: 'Blood pressure normal' },
  ]);

  const progressPercentage = (currentWeek / 40) * 100;
  const weeksRemaining = Math.max(0, 40 - currentWeek);
  const daysRemaining = Math.max(0, weeksRemaining * 7);

  const handleLogSymptom = () => {
    if (symptoms.trim()) {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        symptom: symptoms,
        week: currentWeek
      };
      setSymptoms('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Baby className="w-5 h-5 mr-2 text-pink-600" />
              Pregnancy Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Week {currentWeek} of 40</span>
                  <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-pink-600">{weeksRemaining}</p>
                  <p className="text-xs text-muted-foreground">Weeks remaining</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{daysRemaining}</p>
                  <p className="text-xs text-muted-foreground">Days remaining</p>
                </div>
              </div>
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
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{new Date(dueDate).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Expected delivery</p>
              </div>
              <div className="grid grid-cols-1 gap-4 text-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium">Trimester</p>
                  <p className="text-lg font-bold text-purple-600">
                    {currentWeek <= 12 ? 'First' : currentWeek <= 27 ? 'Second' : 'Third'}
                  </p>
                </div>
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
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium">Size this week</p>
                <p className="text-lg font-bold text-teal-600">
                  {currentWeek < 20 ? 'Banana' : currentWeek < 30 ? 'Cauliflower' : 'Cabbage'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Length</span>
                  <span className="font-medium">~{Math.floor(currentWeek * 1.2)}cm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weight</span>
                  <span className="font-medium">~{Math.floor(currentWeek * 15)}g</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-pink-600" />
              Log Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Today's Symptoms</label>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="How are you feeling today? Any new symptoms?"
                className="h-20"
              />
            </div>

            <Button 
              onClick={handleLogSymptom}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={!symptoms.trim()}
            >
              Log Symptoms
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h4 className="font-medium text-pink-800">This Week</h4>
                <p className="text-sm text-pink-600 mt-1">
                  Your baby's organs are developing rapidly. You might notice increased appetite.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800">Health Tip</h4>
                <p className="text-sm text-purple-600 mt-1">
                  Stay hydrated and consider prenatal yoga for better sleep and reduced stress.
                </p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h4 className="font-medium text-teal-800">Next Appointment</h4>
                <p className="text-sm text-teal-600 mt-1">
                  Remember to schedule your next ultrasound if you haven't already.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Appointment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <Badge className="bg-purple-200 text-purple-800">
                    {appointment.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PregnancyMode;
