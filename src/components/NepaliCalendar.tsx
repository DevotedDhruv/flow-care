
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Circle, Sun, Moon, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  cycleDay?: number;
  phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  flowIntensity?: 'spotting' | 'light' | 'medium' | 'heavy';
  hasEntry?: boolean;
  isWeekend?: boolean;
  event?: string;
}

interface CalendarProps {
  periodEntries?: any[];
  onDateClick?: (date: Date) => void;
  showPhases?: boolean;
}

const Calendar = ({ periodEntries = [], onDateClick, showPhases = true }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample events for demonstration
  const events: Record<string, string> = {
    '2024-12-25': 'Christmas Day',
    '2024-01-01': 'New Year',
    '2024-07-04': 'Independence Day',
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

    // Simulate cycle data
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

      const dateKey = date.toISOString().split('T')[0];
      const event = events[dateKey];

      days.push({
        date,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        cycleDay,
        phase: getCyclePhase(cycleDay),
        flowIntensity: entry?.flow_intensity,
        hasEntry,
        event
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
    setSelectedDate(day.date);
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Period Calendar
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              <Sun className="w-4 h-4 mr-1" />
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
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
            {dayNames.map((day, index) => (
              <div key={day} className={`text-center text-sm font-medium p-2 ${
                index === 0 || index === 6 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
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
                  relative p-3 text-center cursor-pointer rounded-lg border transition-all duration-200 min-h-[80px]
                  ${day.isCurrentMonth ? 'text-foreground bg-white' : 'text-muted-foreground bg-gray-50'}
                  ${day.isToday ? 'bg-pink-100 border-pink-300 ring-2 ring-pink-200' : 'border-gray-200'}
                  ${selectedDate && selectedDate.toDateString() === day.date.toDateString() ? 'bg-purple-100 border-purple-300' : ''}
                  ${day.isWeekend && day.isCurrentMonth ? 'bg-red-50' : ''}
                  hover:bg-gray-100 hover:shadow-md
                `}
                onClick={() => handleDateClick(day)}
              >
                {/* Date number */}
                <div className="text-sm font-medium">{day.date.getDate()}</div>
                
                {/* Event indicator */}
                {day.event && (
                  <div className="absolute top-1 left-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                )}

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
                  <div className="text-xs text-muted-foreground absolute bottom-1 left-1">
                    {day.cycleDay}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected date info */}
          {selectedDate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Date</h4>
              <div className="text-sm space-y-1">
                <p>Date: {selectedDate.toLocaleDateString()}</p>
                {calendarDays.find(d => d.date.toDateString() === selectedDate.toDateString())?.event ? (
                  <p className="text-yellow-600 font-medium">
                    Event: {calendarDays.find(d => d.date.toDateString() === selectedDate.toDateString())?.event}
                  </p>
                ) : (
                  <p className="text-muted-foreground">No events for this date</p>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          {showPhases && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Cycle Phases:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Menstrual</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span>Follicular</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Ovulation</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Luteal</span>
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
