
import { useState } from 'react';
import { Heart, Thermometer, Droplets, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const FertilityTracker = () => {
  const [temperature, setTemperature] = useState('');
  const [cervicalMucus, setCervicalMucus] = useState('');
  const [ovulationTest, setOvulationTest] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fertileWindow = { start: 10, end: 16, current: 12 };
  const cycleDay = 12;
  const ovulationDay = 14;
  const daysToOvulation = ovulationDay - cycleDay;

  const getFertilityStatus = () => {
    if (cycleDay >= fertileWindow.start && cycleDay <= fertileWindow.end) {
      if (Math.abs(cycleDay - ovulationDay) <= 1) {
        return { status: 'Peak', color: 'bg-pink-600', textColor: 'text-white' };
      }
      return { status: 'High', color: 'bg-pink-400', textColor: 'text-white' };
    }
    return { status: 'Low', color: 'bg-gray-200', textColor: 'text-gray-700' };
  };

  const fertilityStatus = getFertilityStatus();
  const fertileProgress = ((cycleDay - fertileWindow.start) / (fertileWindow.end - fertileWindow.start)) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Fertility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <Badge className={`${fertilityStatus.color} ${fertilityStatus.textColor} text-lg px-4 py-2`}>
                {fertilityStatus.status} Fertility
              </Badge>
              <div>
                <p className="text-2xl font-bold text-pink-600">
                  {daysToOvulation > 0 ? daysToOvulation : Math.abs(daysToOvulation)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {daysToOvulation > 0 ? 'Days to ovulation' : 'Days since ovulation'}
                </p>
              </div>
              {cycleDay >= fertileWindow.start && cycleDay <= fertileWindow.end && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fertile window progress</span>
                    <span>{Math.round(fertileProgress)}%</span>
                  </div>
                  <Progress value={fertileProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="w-5 h-5 mr-2 text-purple-600" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">98.4°F</p>
                <p className="text-sm text-muted-foreground">Today's reading</p>
              </div>
              <div className="h-20 bg-purple-50 rounded-lg flex items-center justify-center">
                <p className="text-sm text-purple-600">Temperature chart would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-teal-600" />
              Cervical Mucus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                  Egg White
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Most fertile type</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-teal-50 rounded text-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mb-1"></div>
                  <span>Dry</span>
                </div>
                <div className="p-2 bg-teal-100 rounded text-center border-2 border-teal-400">
                  <div className="w-3 h-3 bg-teal-400 rounded-full mx-auto mb-1"></div>
                  <span>Egg White</span>
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
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              Log Fertility Data
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
              <label className="block text-sm font-medium mb-2">Basal Body Temperature (°F)</label>
              <Input
                type="number"
                step="0.1"
                min="96"
                max="100"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="98.6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cervical Mucus</label>
              <Select value={cervicalMucus} onValueChange={setCervicalMucus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mucus type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                  <SelectItem value="creamy">Creamy</SelectItem>
                  <SelectItem value="watery">Watery</SelectItem>
                  <SelectItem value="egg-white">Egg White</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ovulation Test</label>
              <Select value={ovulationTest} onValueChange={setOvulationTest}>
                <SelectTrigger>
                  <SelectValue placeholder="Test result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="peak">Peak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Log Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fertility Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="p-2 font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 5; // Adjust for calendar layout
                const isToday = day === cycleDay;
                const isFertile = day >= fertileWindow.start && day <= fertileWindow.end;
                const isOvulation = day === ovulationDay;
                
                if (day < 1 || day > 28) {
                  return <div key={i} className="p-2"></div>;
                }
                
                return (
                  <div
                    key={i}
                    className={`
                      p-2 rounded-lg text-xs
                      ${isToday ? 'bg-pink-600 text-white font-bold' : ''}
                      ${isOvulation && !isToday ? 'bg-red-500 text-white' : ''}
                      ${isFertile && !isToday && !isOvulation ? 'bg-pink-200 text-pink-800' : ''}
                      ${!isToday && !isFertile && !isOvulation ? 'text-gray-600' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-600 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-200 rounded"></div>
                <span>Fertile window</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FertilityTracker;
