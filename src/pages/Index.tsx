
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Plus, BookOpen, LogOut, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import PeriodTracker from '@/components/PeriodTracker';
import HealthInsights from '@/components/HealthInsights';
import SymptomsChart from '@/components/SymptomsChart';
import Settings from '@/components/Settings';
import Community from '@/components/Community';
import Navigation from '@/components/Navigation';
import NepaliCalendar from '@/components/NepaliCalendar';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cycleDay, setCycleDay] = useState(12);
  const [nextPeriod, setNextPeriod] = useState(16);
  const [language, setLanguage] = useState('en');
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // In a real app, you would implement actual translation logic here
    console.log('Language changed to:', newLanguage);
  };

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: 'FlowCare',
        subtitle: 'Your personal period tracking companion',
        welcome: 'Welcome',
        signOut: 'Sign Out',
        loading: 'Loading...'
      },
      ne: {
        title: 'फ्लोकेयर',
        subtitle: 'तपाईंको व्यक्तिगत मासिक धर्म ट्र्याकिंग साथी',
        welcome: 'स्वागतम्',
        signOut: 'बाहिर निस्कनुहोस्',
        loading: 'लोड भइरहेको छ...'
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          cycleDay={cycleDay}
          nextPeriod={nextPeriod}
          onTabChange={setActiveTab}
          language={language}
        />;
      case 'period':
        return <PeriodTracker />;
      case 'insights':
        return <HealthInsights />;
      case 'symptoms':
        return <SymptomsChart data={[]} />;
      case 'community':
        return <Community />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard 
          cycleDay={cycleDay}
          nextPeriod={nextPeriod}
          onTabChange={setActiveTab}
          language={language}
        />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-pink-600 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{getLocalizedText('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {getLocalizedText('title')}
                </h1>
                <p className="text-muted-foreground mt-1">{getLocalizedText('subtitle')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ne">नेपाली</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {getLocalizedText('welcome')}, {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{getLocalizedText('signOut')}</span>
              </Button>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const Dashboard = ({ cycleDay, nextPeriod, onTabChange, language }: {
  cycleDay: number;
  nextPeriod: number;
  onTabChange: (tab: string) => void;
  language: string;
}) => {
  const progressPercentage = (cycleDay / 28) * 100;

  const getLocalizedText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        cycleOverview: 'Cycle Overview',
        healthScore: 'Health Score',
        thisMonth: 'This Month',
        dayOfCycle: 'Day {day} of cycle',
        daysUntilPeriod: 'Days until period',
        avgCycleLength: 'Avg cycle length',
        outOf10: 'Out of 10',
        sleepQuality: 'Sleep Quality',
        energyLevel: 'Energy Level',
        mood: 'Mood',
        good: 'Good',
        high: 'High',
        stable: 'Stable',
        daysLogged: 'Days logged',
        regularFlow: 'Regular Flow',
        quickActions: 'Quick Actions',
        logPeriod: 'Log Period',
        viewHistory: 'View History',
        trackSymptoms: 'Track Symptoms',
        healthInsights: 'Health Insights',
        recentInsights: 'Recent Insights',
        cyclePattern: 'Cycle Pattern',
        cyclePatternDesc: 'Your cycles have been consistently 28 days for the past 3 months.',
        flowTracking: 'Flow Tracking',
        flowTrackingDesc: "You've been consistently tracking your flow intensity. Great job!",
        healthTip: 'Health Tip',
        healthTipDesc: 'Consider increasing iron-rich foods during your period to combat fatigue.'
      },
      ne: {
        cycleOverview: 'चक्र सिंहावलोकन',
        healthScore: 'स्वास्थ्य स्कोर',
        thisMonth: 'यो महिना',
        dayOfCycle: 'चक्रको {day} दिन',
        daysUntilPeriod: 'पिरियड सम्म दिनहरू',
        avgCycleLength: 'औसत चक्र लम्बाइ',
        outOf10: '१० मध्ये',
        sleepQuality: 'निद्राको गुणस्तर',
        energyLevel: 'ऊर्जा स्तर',
        mood: 'मूड',
        good: 'राम्रो',
        high: 'उच्च',
        stable: 'स्थिर',
        daysLogged: 'दिनहरू लग गरिएको',
        regularFlow: 'नियमित प्रवाह',
        quickActions: 'द्रुत कार्यहरू',
        logPeriod: 'पिरियड लग गर्नुहोस्',
        viewHistory: 'इतिहास हेर्नुहोस्',
        trackSymptoms: 'लक्षणहरू ट्र्याक गर्नुहोस्',
        healthInsights: 'स्वास्थ्य अन्तर्दृष्टि',
        recentInsights: 'हालैका अन्तर्दृष्टिहरू',
        cyclePattern: 'चक्र ढाँचा',
        cyclePatternDesc: 'तपाईंका चक्रहरू विगत ३ महिनाका लागि लगातार २८ दिनका छन्।',
        flowTracking: 'प्रवाह ट्र्याकिंग',
        flowTrackingDesc: 'तपाईंले लगातार आफ्नो प्रवाहको तीव्रता ट्र्याक गरिरहनुभएको छ। राम्रो काम!',
        healthTip: 'स्वास्थ्य सुझाव',
        healthTipDesc: 'थकान कम गर्न आफ्नो पिरियडको समयमा फलामयुक्त खानाहरू बढाउने बारे सोच्नुहोस्।'
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <div className="space-y-6">
      {/* Nepali Calendar - positioned first */}
      <div className="mb-6">
        <NepaliCalendar 
          onDateClick={(date) => {
            console.log('Selected date:', date);
            onTabChange('period');
          }}
          showPhases={true}
          language={language}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              {getLocalizedText('cycleOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{getLocalizedText('dayOfCycle').replace('{day}', cycleDay.toString())}</span>
                  <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-pink-600">{nextPeriod}</p>
                  <p className="text-xs text-muted-foreground">{getLocalizedText('daysUntilPeriod')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">28</p>
                  <p className="text-xs text-muted-foreground">{getLocalizedText('avgCycleLength')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
              {getLocalizedText('healthScore')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-teal-600">8.5</p>
                <p className="text-sm text-muted-foreground">{getLocalizedText('outOf10')}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{getLocalizedText('sleepQuality')}</span>
                  <span className="font-medium">{getLocalizedText('good')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{getLocalizedText('energyLevel')}</span>
                  <span className="font-medium">{getLocalizedText('high')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{getLocalizedText('mood')}</span>
                  <span className="font-medium">{getLocalizedText('stable')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              {getLocalizedText('thisMonth')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-muted-foreground">{getLocalizedText('daysLogged')}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                  {getLocalizedText('regularFlow')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {getLocalizedText('quickActions')}
                <Plus className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('period')}
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  {getLocalizedText('logPeriod')}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('period')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  {getLocalizedText('viewHistory')}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('symptoms')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  {getLocalizedText('trackSymptoms')}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('insights')}
                >
                  <BookOpen className="w-6 h-6 mb-2" />
                  {getLocalizedText('healthInsights')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedText('recentInsights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium text-pink-800">{getLocalizedText('cyclePattern')}</h4>
                  <p className="text-sm text-pink-600 mt-1">{getLocalizedText('cyclePatternDesc')}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800">{getLocalizedText('flowTracking')}</h4>
                  <p className="text-sm text-purple-600 mt-1">{getLocalizedText('flowTrackingDesc')}</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-medium text-teal-800">{getLocalizedText('healthTip')}</h4>
                  <p className="text-sm text-teal-600 mt-1">{getLocalizedText('healthTipDesc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
