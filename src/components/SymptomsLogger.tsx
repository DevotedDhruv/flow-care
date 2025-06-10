
import { useState } from 'react';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const SymptomsLogger = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [emotionalSymptoms, setEmotionalSymptoms] = useState([]);
  const [painLevel, setPainLevel] = useState([0]);
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [notes, setNotes] = useState('');

  const physicalSymptomsOptions = [
    'Cramps', 'Headache', 'Bloating', 'Breast tenderness', 'Fatigue',
    'Nausea', 'Back pain', 'Diarrhea', 'Constipation', 'Hot flashes',
    'Acne', 'Food cravings', 'Sleep issues', 'Dizziness'
  ];

  const emotionalSymptomsOptions = [
    'Mood swings', 'Irritability', 'Anxiety', 'Depression', 'Stress',
    'Crying spells', 'Feeling overwhelmed', 'Low motivation', 'Restlessness',
    'Brain fog', 'Difficulty concentrating'
  ];

  const recentSymptoms = [
    { date: '2024-06-09', symptoms: ['Cramps', 'Fatigue'], painLevel: 6 },
    { date: '2024-06-08', symptoms: ['Headache', 'Irritability'], painLevel: 4 },
    { date: '2024-06-07', symptoms: ['Bloating', 'Food cravings'], painLevel: 3 },
  ];

  const toggleSymptom = (symptom, type) => {
    if (type === 'physical') {
      setPhysicalSymptoms(prev => 
        prev.includes(symptom) 
          ? prev.filter(s => s !== symptom)
          : [...prev, symptom]
      );
    } else {
      setEmotionalSymptoms(prev => 
        prev.includes(symptom) 
          ? prev.filter(s => s !== symptom)
          : [...prev, symptom]
      );
    }
  };

  const getPainColor = (level) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEnergyColor = (level) => {
    if (level >= 7) return 'text-green-600';
    if (level >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-pink-600" />
              Log Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <label className="block text-sm font-medium mb-3">Physical Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {physicalSymptomsOptions.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={`physical-${symptom}`}
                      checked={physicalSymptoms.includes(symptom)}
                      onCheckedChange={() => toggleSymptom(symptom, 'physical')}
                    />
                    <label
                      htmlFor={`physical-${symptom}`}
                      className="text-sm cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Emotional Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {emotionalSymptomsOptions.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={`emotional-${symptom}`}
                      checked={emotionalSymptoms.includes(symptom)}
                      onCheckedChange={() => toggleSymptom(symptom, 'emotional')}
                    />
                    <label
                      htmlFor={`emotional-${symptom}`}
                      className="text-sm cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Pain Level: <span className={`font-bold ${getPainColor(painLevel[0])}`}>{painLevel[0]}/10</span>
              </label>
              <Slider
                value={painLevel}
                onValueChange={setPainLevel}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No pain</span>
                <span>Severe pain</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Energy Level: <span className={`font-bold ${getEnergyColor(energyLevel[0])}`}>{energyLevel[0]}/10</span>
              </label>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Exhausted</span>
                <span>Very energetic</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional observations..."
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
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Symptom Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-600">3</p>
                <p className="text-sm text-muted-foreground">Most common symptoms</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">5.2</p>
                <p className="text-sm text-muted-foreground">Avg pain level</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Most Frequent Symptoms</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cramps</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fatigue</span>
                  <Badge variant="secondary">70%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mood swings</span>
                  <Badge variant="secondary">65%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bloating</span>
                  <Badge variant="secondary">60%</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Cycle Phase Trends</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-pink-600" />
                    <span className="font-medium">Pre-menstrual phase</span>
                  </div>
                  <p className="text-pink-600 mt-1">Higher mood symptoms and food cravings</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Menstrual phase</span>
                  </div>
                  <p className="text-red-600 mt-1">Peak pain levels and fatigue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Symptom History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSymptoms.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                  <div className="flex flex-wrap gap-1">
                    {entry.symptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${getPainColor(entry.painLevel)}`}>
                    Pain: {entry.painLevel}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomsLogger;
