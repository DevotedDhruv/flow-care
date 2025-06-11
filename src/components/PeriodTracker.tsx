
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SymptomsChart from './SymptomsChart';
import CyclePrediction from './CyclePrediction';

interface PeriodEntry {
  id: string;
  date: string;
  flow_intensity: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  period_start_date?: string | null;
  period_end_date?: string | null;
  symptoms?: any;
}

interface MenstrualCycle {
  id: string;
  cycle_start_date: string;
  cycle_end_date?: string | null;
  cycle_length?: number | null;
  period_length?: number | null;
  predicted?: boolean | null;
}

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');
  const [flowIntensity, setFlowIntensity] = useState('');
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState({
    cramps: 0,
    mood: 0,
    energy: 0,
    headache: 0,
    bloating: 0
  });
  const [periodHistory, setPeriodHistory] = useState<PeriodEntry[]>([]);
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const flowColors = {
    light: 'bg-pink-200 text-pink-800',
    medium: 'bg-pink-400 text-pink-900',
    heavy: 'bg-pink-600 text-white',
    spotting: 'bg-pink-100 text-pink-700'
  };

  useEffect(() => {
    if (user) {
      fetchPeriodHistory();
      fetchCycles();
    }
  }, [user]);

  const fetchPeriodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('period_entries')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setPeriodHistory(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch period history',
        variant: 'destructive',
      });
    } finally {
      setFetchingHistory(false);
    }
  };

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .order('cycle_start_date', { ascending: false })
        .limit(12);

      if (error) throw error;
      setCycles(data || []);
    } catch (error: any) {
      console.error('Failed to fetch cycles:', error);
    }
  };

  const handleLogPeriod = async () => {
    if (!selectedDate || !flowIntensity || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('period_entries')
        .insert({
          user_id: user.id,
          date: selectedDate,
          flow_intensity: flowIntensity,
          notes: notes || null,
          period_start_date: periodStartDate || null,
          period_end_date: periodEndDate || null,
          symptoms: symptoms,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-create or update cycle if start date is provided
      if (periodStartDate) {
        await handleCycleUpdate(periodStartDate, periodEndDate);
      }

      toast({
        title: 'Success',
        description: 'Period day logged successfully!',
      });

      setFlowIntensity('');
      setNotes('');
      setPeriodStartDate('');
      setPeriodEndDate('');
      setSymptoms({ cramps: 0, mood: 0, energy: 0, headache: 0, bloating: 0 });
      fetchPeriodHistory();
      fetchCycles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log period day',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCycleUpdate = async (startDate: string, endDate?: string) => {
    try {
      const cycleData: any = {
        user_id: user!.id,
        cycle_start_date: startDate,
      };

      if (endDate) {
        cycleData.cycle_end_date = endDate;
        const start = new Date(startDate);
        const end = new Date(endDate);
        cycleData.period_length = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }

      await supabase
        .from('menstrual_cycles')
        .upsert(cycleData, { onConflict: 'cycle_start_date,user_id' });
    } catch (error) {
      console.error('Failed to update cycle:', error);
    }
  };

  const symptomsData = periodHistory
    .filter(entry => entry.symptoms && Object.keys(entry.symptoms).length > 0)
    .slice(0, 10)
    .reverse();

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium mb-2">Period Start</label>
                <input
                  type="date"
                  value={periodStartDate}
                  onChange={(e) => setPeriodStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Period End</label>
                <input
                  type="date"
                  value={periodEndDate}
                  onChange={(e) => setPeriodEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
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

            <div className="space-y-3">
              <label className="block text-sm font-medium">Symptoms (1-5 scale)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(symptoms).map(([symptom, value]) => (
                  <div key={symptom} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{symptom}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => setSymptoms(prev => ({ ...prev, [symptom]: newValue[0] }))}
                      max={5}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
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
              disabled={!selectedDate || !flowIntensity || loading}
            >
              {loading ? 'Logging...' : 'Log Period Day'}
            </Button>
          </CardContent>
        </Card>

        <CyclePrediction cycles={cycles} />
      </div>

      {symptomsData.length > 0 && (
        <SymptomsChart data={symptomsData} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Period History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingHistory ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading period history...</p>
            </div>
          ) : periodHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No period entries yet. Start logging your period days!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {periodHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <Badge className={flowColors[entry.flow_intensity as keyof typeof flowColors] || 'bg-gray-200'}>
                      {entry.flow_intensity.charAt(0).toUpperCase() + entry.flow_intensity.slice(1)}
                    </Badge>
                    {entry.period_start_date && (
                      <Badge variant="outline">
                        Start: {new Date(entry.period_start_date).toLocaleDateString()}
                      </Badge>
                    )}
                    {entry.period_end_date && (
                      <Badge variant="outline">
                        End: {new Date(entry.period_end_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                  {entry.notes && (
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodTracker;
