
import { useState } from 'react';
import { Calendar, Droplets, Clock, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [flowIntensity, setFlowIntensity] = useState('');
  const [notes, setNotes] = useState('');
  const [periodHistory, setPeriodHistory] = useState([
    { date: '2024-12-01', flow: 'heavy', duration: 5 },
    { date: '2024-11-03', flow: 'medium', duration: 4 },
    { date: '2024-10-06', flow: 'light', duration: 3 },
  ]);

  const flowColors = {
    light: 'bg-pink-200 text-pink-800',
    medium: 'bg-pink-400 text-pink-900',
    heavy: 'bg-pink-600 text-white',
    spotting: 'bg-pink-100 text-pink-700'
  };

  const handleLogPeriod = () => {
    if (selectedDate && flowIntensity) {
      const newEntry = {
        date: selectedDate,
        flow: flowIntensity,
        duration: 1, // This would be calculated based on consecutive days
        notes
      };
      setPeriodHistory([newEntry, ...periodHistory]);
      setFlowIntensity('');
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-pink-600" />
              Log Period Day
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
              <label className="block text-sm font-medium mb-2">Flow Intensity</label>
              <Select value={flowIntensity} onValueChange={setFlowIntensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select flow intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spotting">Spotting</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about your period..."
                className="h-20"
              />
            </div>

            <Button 
              onClick={handleLogPeriod}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={!selectedDate || !flowIntensity}
            >
              Log Period Day
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Period Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-600">28</p>
                <p className="text-sm text-muted-foreground">Average Cycle</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">4</p>
                <p className="text-sm text-muted-foreground">Average Duration</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Flow Pattern</h4>
              <div className="flex space-x-2">
                <div className="flex-1 h-6 bg-pink-200 rounded flex items-center justify-center text-xs">Day 1</div>
                <div className="flex-1 h-6 bg-pink-400 rounded flex items-center justify-center text-xs text-white">Day 2</div>
                <div className="flex-1 h-6 bg-pink-600 rounded flex items-center justify-center text-xs text-white">Day 3</div>
                <div className="flex-1 h-6 bg-pink-400 rounded flex items-center justify-center text-xs text-white">Day 4</div>
                <div className="flex-1 h-6 bg-pink-200 rounded flex items-center justify-center text-xs">Day 5</div>
              </div>
              <p className="text-sm text-muted-foreground">Typical flow pattern for your cycle</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Period History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {periodHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                  <Badge className={flowColors[entry.flow]}>
                    {entry.flow.charAt(0).toUpperCase() + entry.flow.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{entry.duration} days</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodTracker;
