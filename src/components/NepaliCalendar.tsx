
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PeriodEntry {
  id: string;
  date: string;
  flow_intensity?: number;
  symptoms?: Record<string, any>;
}

interface CalendarComponentProps {
  periodEntries?: PeriodEntry[];
  onDateClick?: (date: any) => void;
  showPhases?: boolean;
}

const CalendarComponent = ({ periodEntries = [], onDateClick, showPhases = true }: CalendarComponentProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date, day: number) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const isPeriodDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return periodEntries.some(entry => entry.date === dateStr && entry.flow_intensity && entry.flow_intensity > 0);
  };

  const isFertileDay = (day: number) => {
    // Mock fertile days for demonstration - in real app this would be calculated
    const fertileDays = [12, 13, 14, 15, 16];
    return fertileDays.includes(day) && showPhases;
  };

  const isOvulationDay = (day: number) => {
    // Mock ovulation day for demonstration - in real app this would be calculated
    return day === 14 && showPhases;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    if (onDateClick) {
      onDateClick(clickedDate);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Cycle Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(day => (
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
                  aspect-square p-1 text-center text-sm cursor-pointer rounded-lg
                  hover:bg-muted transition-colors relative
                  ${day ? 'hover:bg-muted' : ''}
                  ${day && isToday(currentDate, day) ? 'bg-primary text-primary-foreground' : ''}
                  ${day && selectedDate && day === selectedDate.getDate() ? 'ring-2 ring-primary' : ''}
                `}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <>
                    <span className="relative z-10">{day}</span>
                    {isPeriodDay(day) && (
                      <div className="absolute inset-0 bg-red-200 rounded-lg opacity-50" />
                    )}
                    {isFertileDay(day) && !isPeriodDay(day) && (
                      <div className="absolute inset-0 bg-green-200 rounded-lg opacity-50" />
                    )}
                    {isOvulationDay(day) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          {showPhases && (
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded" />
                <span>Period</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded" />
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span>Ovulation</span>
              </div>
            </div>
          )}

          {/* Selected date info */}
          {selectedDate && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <div className="space-y-2">
                  {isPeriodDay(selectedDate.getDate()) && (
                    <Badge variant="destructive">Period Day</Badge>
                  )}
                  {isFertileDay(selectedDate.getDate()) && (
                    <Badge variant="secondary">Fertile Window</Badge>
                  )}
                  {isOvulationDay(selectedDate.getDate()) && (
                    <Badge className="bg-green-600">Ovulation Day</Badge>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Tap to log symptoms, mood, or notes for this day.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;
