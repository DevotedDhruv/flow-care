
import { useState, useEffect } from 'react';
import { Calendar, Plus, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SymptomsChart from './SymptomsChart';
import CyclePrediction from './CyclePrediction';

type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

interface PeriodEntry {
  id: string;
  user_id: string;
  date: string;
  flow_intensity: FlowIntensity;
  notes?: string;
  period_start_date?: string;
  period_end_date?: string;
  symptoms?: {
    cramps?: number;
    mood?: number;
    energy?: number;
    headache?: number;
    bloating?: number;
  };
  created_at: string;
  updated_at: string;
}

interface MenstrualCycle {
  id: string;
  user_id: string;
  cycle_start_date: string;
  cycle_end_date?: string;
  cycle_length?: number;
  period_length?: number;
  predicted: boolean;
  created_at: string;
  updated_at: string;
}

const PeriodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<PeriodEntry[]>([]);
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('log');

  // Form states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('medium');
  const [notes, setNotes] = useState('');
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');
  const [symptoms, setSymptoms] = useState({
    cramps: 1,
    mood: 3,
    energy: 3,
    headache: 1,
    bloating: 1
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchCycles();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('period_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Type assertion with proper handling of symptoms
      const typedData = (data || []).map(entry => ({
        ...entry,
        flow_intensity: entry.flow_intensity as FlowIntensity,
        symptoms: entry.symptoms || {}
      }));
      
      setEntries(typedData);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch period entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', user?.id)
        .order('cycle_start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error) {
      console.error('Error fetching cycles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const entryData = {
        user_id: user.id,
        date: selectedDate,
        flow_intensity: flowIntensity,
        notes: notes.trim() || null,
        period_start_date: periodStartDate || null,
        period_end_date: periodEndDate || null,
        symptoms: symptoms
      };

      const { error } = await supabase
        .from('period_entries')
        .insert([entryData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Period entry logged successfully",
      });

      // Reset form
      setNotes('');
      setPeriodStartDate('');
      setPeriodEndDate('');
      setSymptoms({
        cramps: 1,
        mood: 3,
        energy: 3,
        headache: 1,
        bloating: 1
      });

      // Refresh data
      fetchEntries();
      fetchCycles();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save period entry",
        variant: "destructive",
      });
    }
  };

  const getFlowColor = (intensity: FlowIntensity) => {
    switch (intensity) {
      case 'spotting': return 'bg-pink-200 text-pink-800';
      case 'light': return 'bg-pink-300 text-pink-900';
      case 'medium': return 'bg-pink-500 text-white';
      case 'heavy': return 'bg-red-600 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatSymptoms = (symptoms: any) => {
    if (!symptoms || typeof symptoms !== 'object') return [];
    
    return Object.entries(symptoms)
      .filter(([_, value]) => typeof value === 'number' && value > 2)
      .map(([key, value]) => `${key}: ${value}/5`);
  };

  // Format entries for symptoms chart
  const symptomsData = entries
    .filter(entry => entry.symptoms && Object.keys(entry.symptoms).length > 0)
    .map(entry => ({
      date: entry.date,
      symptoms: entry.symptoms || {}
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Calendar className="w-8 h-8 animate-pulse text-pink-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="log">Log Period</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-pink-600" />
                Log Your Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="flow">Flow Intensity</Label>
                    <Select value={flowIntensity} onValueChange={(value: FlowIntensity) => setFlowIntensity(value)}>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="period-start">Period Start Date (if applicable)</Label>
                    <Input
                      id="period-start"
                      type="date"
                      value={periodStartDate}
                      onChange={(e) => setPeriodStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="period-end">Period End Date (if applicable)</Label>
                    <Input
                      id="period-end"
                      type="date"
                      value={periodEndDate}
                      onChange={(e) => setPeriodEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Symptoms (Rate 1-5)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(symptoms).map(([symptom, value]) => (
                      <div key={symptom} className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="capitalize">{symptom}</Label>
                          <span className="text-sm text-muted-foreground">{value}/5</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(newValue) => 
                            setSymptoms(prev => ({ ...prev, [symptom]: newValue[0] }))
                          }
                          max={5}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes about your period or symptoms..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-pink-600" />
                Period History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No period entries found. Start by logging your first entry!
                  </p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{new Date(entry.date).toLocaleDateString()}</h4>
                        <Badge className={getFlowColor(entry.flow_intensity)}>
                          {entry.flow_intensity}
                        </Badge>
                      </div>
                      
                      {(entry.period_start_date || entry.period_end_date) && (
                        <div className="text-sm text-muted-foreground">
                          {entry.period_start_date && `Start: ${new Date(entry.period_start_date).toLocaleDateString()}`}
                          {entry.period_start_date && entry.period_end_date && ' • '}
                          {entry.period_end_date && `End: ${new Date(entry.period_end_date).toLocaleDateString()}`}
                        </div>
                      )}
                      
                      {entry.symptoms && Object.keys(entry.symptoms).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formatSymptoms(entry.symptoms).map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <SymptomsChart data={symptomsData} />
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <CyclePrediction entries={entries} cycles={cycles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeriodTracker;
