
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PeriodEntry {
  id: string;
  user_id: string;
  date: string;
  flow_intensity: string;
  period_start_date?: string;
  period_end_date?: string;
  created_at: string;
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
}

const CyclePrediction = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PeriodEntry[]>([]);
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState({
    nextPeriod: null as Date | null,
    cycleLength: 28,
    periodLength: 5,
    regularity: 'regular' as 'regular' | 'irregular' | 'unknown'
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [entriesResponse, cyclesResponse] = await Promise.all([
        supabase
          .from('period_entries')
          .select('*')
          .eq('user_id', user?.id)
          .order('date', { ascending: false }),
        supabase
          .from('menstrual_cycles')
          .select('*')
          .eq('user_id', user?.id)
          .order('cycle_start_date', { ascending: false })
      ]);

      if (entriesResponse.error) throw entriesResponse.error;
      if (cyclesResponse.error) throw cyclesResponse.error;

      setEntries(entriesResponse.data || []);
      setCycles(cyclesResponse.data || []);
      
      calculatePredictions(entriesResponse.data || [], cyclesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePredictions = (periodEntries: PeriodEntry[], menstrualCycles: MenstrualCycle[]) => {
    if (periodEntries.length === 0) {
      setPredictions({
        nextPeriod: null,
        cycleLength: 28,
        periodLength: 5,
        regularity: 'unknown'
      });
      return;
    }

    // Get period start dates
    const periodStarts = periodEntries
      .filter(entry => entry.period_start_date)
      .map(entry => new Date(entry.period_start_date!))
      .sort((a, b) => b.getTime() - a.getTime());

    if (periodStarts.length < 2) {
      // Not enough data for prediction
      const lastPeriod = periodStarts[0];
      const nextPeriod = new Date(lastPeriod);
      nextPeriod.setDate(nextPeriod.getDate() + 28);

      setPredictions({
        nextPeriod,
        cycleLength: 28,
        periodLength: 5,
        regularity: 'unknown'
      });
      return;
    }

    // Calculate cycle lengths
    const cycleLengths: number[] = [];
    for (let i = 0; i < periodStarts.length - 1; i++) {
      const diffTime = periodStarts[i].getTime() - periodStarts[i + 1].getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }

    // Calculate average cycle length
    const avgCycleLength = Math.round(
      cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
    );

    // Determine regularity
    const variance = cycleLengths.reduce((sum, length) => sum + Math.pow(length - avgCycleLength, 2), 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);
    const regularity = stdDev <= 2 ? 'regular' : 'irregular';

    // Predict next period
    const lastPeriod = periodStarts[0];
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);

    // Calculate average period length
    const periodLengths = periodEntries
      .filter(entry => entry.period_start_date && entry.period_end_date)
      .map(entry => {
        const start = new Date(entry.period_start_date!);
        const end = new Date(entry.period_end_date!);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      });

    const avgPeriodLength = periodLengths.length > 0 
      ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
      : 5;

    setPredictions({
      nextPeriod,
      cycleLength: avgCycleLength,
      periodLength: avgPeriodLength,
      regularity
    });
  };

  const getRegularityColor = (regularity: string) => {
    switch (regularity) {
      case 'regular': return 'bg-green-100 text-green-800';
      case 'irregular': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilPeriod = () => {
    if (!predictions.nextPeriod) return null;
    const today = new Date();
    const diffTime = predictions.nextPeriod.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Calendar className="w-8 h-8 animate-pulse text-pink-600" />
        <span className="ml-2">Loading predictions...</span>
      </div>
    );
  }

  const daysUntilPeriod = getDaysUntilPeriod();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Cycle Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <h3 className="font-medium text-pink-800">Next Period</h3>
              <p className="text-2xl font-bold text-pink-600">
                {daysUntilPeriod !== null ? `${daysUntilPeriod} days` : 'Unknown'}
              </p>
              <p className="text-xs text-muted-foreground">
                {predictions.nextPeriod?.toLocaleDateString() || 'Not enough data'}
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800">Cycle Length</h3>
              <p className="text-2xl font-bold text-purple-600">{predictions.cycleLength} days</p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>

            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <h3 className="font-medium text-teal-800">Period Length</h3>
              <p className="text-2xl font-bold text-teal-600">{predictions.periodLength} days</p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Regularity</h3>
              <Badge className={getRegularityColor(predictions.regularity)}>
                {predictions.regularity}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-pink-600" />
            Recent Cycles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cycles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No cycle data available. Keep logging your periods to see cycle history.
            </p>
          ) : (
            <div className="space-y-4">
              {cycles.slice(0, 5).map((cycle) => (
                <div key={cycle.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(cycle.cycle_start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cycle.cycle_end_date 
                        ? `Ended ${new Date(cycle.cycle_end_date).toLocaleDateString()}`
                        : 'Ongoing'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    {cycle.cycle_length && (
                      <p className="text-sm font-medium">{cycle.cycle_length} days</p>
                    )}
                    {cycle.predicted && (
                      <Badge variant="outline" className="text-xs">Predicted</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {predictions.regularity === 'irregular' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Irregular Cycle Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Your cycles show some irregularity. This is normal for many people, but if you're concerned, 
              consider tracking additional symptoms and consulting with a healthcare provider.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CyclePrediction;
