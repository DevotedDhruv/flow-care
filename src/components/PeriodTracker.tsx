
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PeriodEntry {
  id: string;
  date: string;
  flow_intensity: 'spotting' | 'light' | 'medium' | 'heavy';
  notes?: string;
}

const PeriodTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [flowIntensity, setFlowIntensity] = useState('');
  const [notes, setNotes] = useState('');
  const [periodHistory, setPeriodHistory] = useState<PeriodEntry[]>([]);
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
    }
  }, [user]);

  const fetchPeriodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('period_entries')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

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

  const handleLogPeriod = async () => {
    if (!selectedDate || !flowIntensity || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('period_entries')
        .upsert({
          user_id: user.id,
          date: selectedDate,
          flow_intensity: flowIntensity as 'spotting' | 'light' | 'medium' | 'heavy',
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Period day logged successfully!',
      });

      setFlowIntensity('');
      setNotes('');
      fetchPeriodHistory();
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
              disabled={!selectedDate || !flowIntensity || loading}
            >
              {loading ? 'Logging...' : 'Log Period Day'}
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
                <p className="text-2xl font-bold text-purple-600">{periodHistory.length}</p>
                <p className="text-sm text-muted-foreground">Days Logged</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Recent Flow Pattern</h4>
              <div className="flex space-x-1">
                {periodHistory.slice(0, 5).map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`flex-1 h-6 rounded flex items-center justify-center text-xs ${
                      flowColors[entry.flow_intensity] || 'bg-gray-200'
                    }`}
                  >
                    {entry.flow_intensity.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Most recent period days</p>
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
                    <Badge className={flowColors[entry.flow_intensity]}>
                      {entry.flow_intensity.charAt(0).toUpperCase() + entry.flow_intensity.slice(1)}
                    </Badge>
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
