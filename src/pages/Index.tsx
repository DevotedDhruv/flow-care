import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Plus, BookOpen, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          cycleDay={cycleDay}
          nextPeriod={nextPeriod}
          onTabChange={setActiveTab}
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
        />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-pink-600 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FlowCare
              </h1>
              <p className="text-muted-foreground mt-1">Your personal period tracking companion</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
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

const Dashboard = ({ cycleDay, nextPeriod, onTabChange }: {
  cycleDay: number;
  nextPeriod: number;
  onTabChange: (tab: string) => void;
}) => {
  const progressPercentage = (cycleDay / 28) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              Cycle Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Day {cycleDay} of cycle</span>
                  <span className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-pink-600">{nextPeriod}</p>
                  <p className="text-xs text-muted-foreground">Days until period</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">28</p>
                  <p className="text-xs text-muted-foreground">Avg cycle length</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-teal-600">8.5</p>
                <p className="text-sm text-muted-foreground">Out of 10</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sleep Quality</span>
                  <span className="font-medium">Good</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Energy Level</span>
                  <span className="font-medium">High</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mood</span>
                  <span className="font-medium">Stable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-muted-foreground">Days logged</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                  Regular Flow
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NepaliCalendar 
          onDateClick={(date) => {
            console.log('Selected date:', date);
            onTabChange('period');
          }}
          showPhases={true}
        />
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Quick Actions
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
                  Log Period
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('period')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  View History
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('symptoms')}
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Track Symptoms
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => onTabChange('insights')}
                >
                  <BookOpen className="w-6 h-6 mb-2" />
                  Health Insights
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium text-pink-800">Cycle Pattern</h4>
                  <p className="text-sm text-pink-600 mt-1">Your cycles have been consistently 28 days for the past 3 months.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800">Flow Tracking</h4>
                  <p className="text-sm text-purple-600 mt-1">You've been consistently tracking your flow intensity. Great job!</p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-medium text-teal-800">Health Tip</h4>
                  <p className="text-sm text-teal-600 mt-1">Consider increasing iron-rich foods during your period to combat fatigue.</p>
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
