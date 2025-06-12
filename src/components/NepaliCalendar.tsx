
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarDay {
  date: Date;
  nepaliDate: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  cycleDay?: number;
  phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  flowIntensity?: 'spotting' | 'light' | 'medium' | 'heavy';
  hasEntry?: boolean;
}

interface NepaliCalendarProps {
  periodEntries?: any[];
  onDateClick?: (date: Date) => void;
  showPhases?: boolean;
}

const NepaliCalendar = ({ periodEntries = [], onDateClick, showPhases = true }: NepaliCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const nepaliMonths = [
    'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];

  const nepaliDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

  // Simple Nepali date conversion (basic implementation)
  const convertToNepali = (date: Date): string => {
    const nepaliYear = date.getFullYear() + 57; // Approximate BS year
    const nepaliMonth = nepaliMonths[date.getMonth()];
    const nepaliDay = date.getDate();
    return `${nepaliYear} ${nepaliMonth} ${nepaliDay}`;
  };

  const getCyclePhase = (cycleDay: number): 'menstrual' | 'follicular' | 'ovulation' | 'luteal' => {
    if (cycleDay <= 5) return 'menstrual';
    if (cycleDay <= 13) return 'follicular';
    if (cycleDay <= 15) return 'ovulation';
    return 'luteal';
  };

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'menstrual': return 'bg-red-500';
      case 'follicular': return 'bg-pink-400';
      case 'ovulation': return 'bg-purple-500';
      case 'luteal': return 'bg-blue-400';
      default: return 'bg-gray-300';
    }
  };

  const getFlowColor = (intensity: string): string => {
    switch (intensity) {
      case 'spotting': return 'bg-pink-200';
      case 'light': return 'bg-pink-300';
      case 'medium': return 'bg-red-400';
      case 'heavy': return 'bg-red-600';
      default: return 'bg-gray-200';
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    // Simulate cycle data (in real app, this would come from user data)
    const lastPeriodStart = new Date(today);
    lastPeriodStart.setDate(today.getDate() - 12);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = ((daysSinceLastPeriod % 28) + 28) % 28 + 1;

      const hasEntry = periodEntries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString();
      });

      const entry = periodEntries.find(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString();
      });

      days.push({
        date,
        nepaliDate: convertToNepali(date),
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month,
        cycleDay,
        phase: getCyclePhase(cycleDay),
        flowIntensity: entry?.flow_intensity,
        hasEntry
      });
    }

    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, periodEntries]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: CalendarDay) => {
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            नेपाली क्यालेन्डर
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium">
              {nepaliMonths[currentDate.getMonth()]} {currentDate.getFullYear() + 57}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {nepaliDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  relative p-2 text-center cursor-pointer rounded-lg border transition-colors
                  ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                  ${day.isToday ? 'bg-pink-100 border-pink-300' : 'border-gray-200'}
                  hover:bg-gray-50
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className="text-sm font-medium">{day.date.getDate()}</div>
                
                {/* Cycle phase indicator */}
                {showPhases && day.isCurrentMonth && day.phase && (
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${getPhaseColor(day.phase)}`} />
                )}

                {/* Flow intensity indicator */}
                {day.hasEntry && day.flowIntensity && (
                  <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${getFlowColor(day.flowIntensity)}`} />
                )}

                {/* Cycle day number */}
                {day.isCurrentMonth && day.cycleDay && showPhases && (
                  <div className="text-xs text-muted-foreground">{day.cycleDay}</div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">चक्र चरणहरू:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Circle className="w-2 h-2 bg-red-500 rounded-full" />
                <span>महिनावारी</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Circle className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>फोलिक्युलर</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Circle className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>ओभुलेशन</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Circle className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>लुटेल</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NepaliCalendar;
