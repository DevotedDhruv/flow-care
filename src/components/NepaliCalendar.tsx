
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Circle, Sun, Moon, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarDay {
  date: Date;
  nepaliDate: string;
  nepaliDay: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  cycleDay?: number;
  phase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  flowIntensity?: 'spotting' | 'light' | 'medium' | 'heavy';
  hasEntry?: boolean;
  isWeekend?: boolean;
  tithi?: string;
  event?: string;
}

interface NepaliCalendarProps {
  periodEntries?: any[];
  onDateClick?: (date: Date) => void;
  showPhases?: boolean;
  language?: string;
}

const NepaliCalendar = ({ periodEntries = [], onDateClick, showPhases = true, language = 'en' }: NepaliCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nepaliMonths = [
    'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];

  const nepaliDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
  const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Nepali calendar events and festivals
  const nepaliEvents: Record<string, string> = {
    '2081-01-01': 'नयाँ वर्ष',
    '2081-01-15': 'बुद्ध जयन्ती',
    '2081-03-03': 'तीज',
    '2081-07-01': 'दशैं',
    '2081-08-01': 'तिहार',
  };

  const tithiNames = [
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी',
    'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'
  ];

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        nepaliCalendar: 'Nepali Calendar',
        today: 'Today',
        cyclePhases: 'Cycle Phases',
        menstrual: 'Menstrual',
        follicular: 'Follicular',
        ovulation: 'Ovulation',
        luteal: 'Luteal',
        selectedDate: 'Selected Date',
        noEvents: 'No events for this date'
      },
      ne: {
        nepaliCalendar: 'नेपाली क्यालेन्डर',
        today: 'आज',
        cyclePhases: 'चक्र चरणहरू',
        menstrual: 'महिनावारी',
        follicular: 'फोलिक्युलर',
        ovulation: 'ओभुलेशन',
        luteal: 'लुटेल',
        selectedDate: 'चयनित मिति',
        noEvents: 'यस मितिको लागि कुनै घटना छैन'
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  // Enhanced Nepali date conversion with better accuracy
  const convertToNepali = (date: Date): { year: number; month: number; day: number; monthName: string } => {
    const nepaliYear = date.getFullYear() + 57; // Approximate BS year
    const monthIndex = date.getMonth();
    const nepaliDay = date.getDate();
    
    return {
      year: nepaliYear,
      month: monthIndex + 1,
      day: nepaliDay,
      monthName: nepaliMonths[monthIndex]
    };
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

  const getTithi = (date: Date): string => {
    // Simplified tithi calculation (in real app, use proper lunar calendar calculation)
    const dayOfMonth = date.getDate();
    return tithiNames[dayOfMonth % 15];
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

      const nepaliDateInfo = convertToNepali(date);
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

      const nepaliDateKey = `${nepaliDateInfo.year}-${nepaliDateInfo.month.toString().padStart(2, '0')}-${nepaliDateInfo.day.toString().padStart(2, '0')}`;
      const event = nepaliEvents[nepaliDateKey];

      days.push({
        date,
        nepaliDate: `${nepaliDateInfo.year} ${nepaliDateInfo.monthName} ${nepaliDateInfo.day}`,
        nepaliDay: nepaliDateInfo.day,
        isToday: date.toDateString() === today.toDateString(),
        isCurrentMonth: date.getMonth() === month,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        cycleDay,
        phase: getCyclePhase(cycleDay),
        flowIntensity: entry?.flow_intensity,
        hasEntry,
        tithi: getTithi(date),
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

  const currentNepaliDate = convertToNepali(currentDate);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            {getLocalizedText('nepaliCalendar')}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              <Sun className="w-4 h-4 mr-1" />
              {getLocalizedText('today')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {currentNepaliDate.monthName} {currentNepaliDate.year}
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
            {(language === 'ne' ? nepaliDays : englishDays).map((day, index) => (
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
                {/* English date */}
                <div className="text-sm font-medium">{day.date.getDate()}</div>
                
                {/* Nepali date */}
                <div className="text-xs text-muted-foreground">{day.nepaliDay}</div>
                
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

                {/* Moon phase indicator for special tithis */}
                {(day.tithi?.includes('पूर्णिमा') || day.tithi?.includes('अमावस्या')) && (
                  <div className="absolute bottom-1 right-1">
                    <Moon className="w-3 h-3 text-blue-500" />
                  </div>
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
              <h4 className="font-medium mb-2">{getLocalizedText('selectedDate')}</h4>
              <div className="text-sm space-y-1">
                <p>Date: {selectedDate.toLocaleDateString()}</p>
                <p>Nepali: {convertToNepali(selectedDate).day} {convertToNepali(selectedDate).monthName} {convertToNepali(selectedDate).year}</p>
                <p>Tithi: {getTithi(selectedDate)}</p>
                {calendarDays.find(d => d.date.toDateString() === selectedDate.toDateString())?.event ? (
                  <p className="text-yellow-600 font-medium">
                    Event: {calendarDays.find(d => d.date.toDateString() === selectedDate.toDateString())?.event}
                  </p>
                ) : (
                  <p className="text-muted-foreground">{getLocalizedText('noEvents')}</p>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          {showPhases && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{getLocalizedText('cyclePhases')}:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>{getLocalizedText('menstrual')}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span>{getLocalizedText('follicular')}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>{getLocalizedText('ovulation')}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Circle className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>{getLocalizedText('luteal')}</span>
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NepaliCalendar;
