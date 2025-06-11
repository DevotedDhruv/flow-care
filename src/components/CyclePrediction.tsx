
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CyclePredictionProps {
  cycles: Array<{
    cycle_start_date: string;
    cycle_length?: number;
    period_length?: number;
    predicted?: boolean;
  }>;
}

const CyclePrediction = ({ cycles }: CyclePredictionProps) => {
  const calculateAverageCycleLength = () => {
    const completedCycles = cycles.filter(cycle => cycle.cycle_length);
    if (completedCycles.length === 0) return 28;
    
    const total = completedCycles.reduce((sum, cycle) => sum + (cycle.cycle_length || 0), 0);
    return Math.round(total / completedCycles.length);
  };

  const calculateAveragePeriodLength = () => {
    const completedCycles = cycles.filter(cycle => cycle.period_length);
    if (completedCycles.length === 0) return 5;
    
    const total = completedCycles.reduce((sum, cycle) => sum + (cycle.period_length || 0), 0);
    return Math.round(total / completedCycles.length);
  };

  const predictNextPeriod = () => {
    if (cycles.length === 0) return null;
    
    const lastCycle = cycles[0];
    const avgCycleLength = calculateAverageCycleLength();
    const lastStartDate = new Date(lastCycle.cycle_start_date);
    const nextPeriodDate = new Date(lastStartDate.getTime() + (avgCycleLength * 24 * 60 * 60 * 1000));
    
    return nextPeriodDate;
  };

  const getDaysUntilNextPeriod = () => {
    const nextPeriod = predictNextPeriod();
    if (!nextPeriod) return null;
    
    const today = new Date();
    const timeDiff = nextPeriod.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };

  const avgCycleLength = calculateAverageCycleLength();
  const avgPeriodLength = calculateAveragePeriodLength();
  const nextPeriod = predictNextPeriod();
  const daysUntilNext = getDaysUntilNextPeriod();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-pink-600" />
          Cycle Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <p className="text-2xl font-bold text-pink-600">{avgCycleLength}</p>
            <p className="text-sm text-muted-foreground">Avg Cycle Length</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{avgPeriodLength}</p>
            <p className="text-sm text-muted-foreground">Avg Period Length</p>
          </div>
        </div>

        {nextPeriod && (
          <div className="p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Next Period Prediction</p>
                <p className="text-sm text-muted-foreground">
                  {nextPeriod.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                {daysUntilNext !== null && (
                  <Badge variant={daysUntilNext <= 3 ? "destructive" : "secondary"}>
                    {daysUntilNext > 0 ? `${daysUntilNext} days` : "Today"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <Clock className="w-3 h-3 inline mr-1" />
          Predictions based on your last {cycles.length} cycles
        </div>
      </CardContent>
    </Card>
  );
};

export default CyclePrediction;
