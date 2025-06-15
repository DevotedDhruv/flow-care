
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CycleData {
  cycleDay: number | null;
  nextPeriod: number | null;
  avgCycleLength: number;
  avgPeriodLength: number;
  hasData: boolean;
  isLoading: boolean;
}

export const useCycleData = () => {
  const { user } = useAuth();
  const [cycleData, setCycleData] = useState<CycleData>({
    cycleDay: null,
    nextPeriod: null,
    avgCycleLength: 28,
    avgPeriodLength: 5,
    hasData: false,
    isLoading: true,
  });

  const fetchCycleData = async () => {
    if (!user) {
      setCycleData(prev => ({ ...prev, isLoading: false, hasData: false }));
      return;
    }

    try {
      const { data: entries, error } = await supabase
        .from('period_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!entries || entries.length === 0) {
        setCycleData(prev => ({ ...prev, isLoading: false, hasData: false }));
        return;
      }

      // Get period start dates
      const periodStarts = entries
        .filter(entry => entry.period_start_date)
        .map(entry => new Date(entry.period_start_date!))
        .sort((a, b) => b.getTime() - a.getTime());

      if (periodStarts.length === 0) {
        setCycleData(prev => ({ ...prev, isLoading: false, hasData: false }));
        return;
      }

      const lastPeriod = periodStarts[0];
      const today = new Date();
      const daysSinceLastPeriod = Math.ceil((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));

      let avgCycleLength = 28;
      let cycleDay = daysSinceLastPeriod;
      let nextPeriod = 28 - daysSinceLastPeriod;

      // Calculate average cycle length if we have multiple periods
      if (periodStarts.length >= 2) {
        const cycleLengths: number[] = [];
        for (let i = 0; i < periodStarts.length - 1; i++) {
          const diffTime = periodStarts[i].getTime() - periodStarts[i + 1].getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          cycleLengths.push(diffDays);
        }
        avgCycleLength = Math.round(
          cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
        );
        
        cycleDay = daysSinceLastPeriod;
        nextPeriod = avgCycleLength - daysSinceLastPeriod;
      }

      // Calculate average period length
      const periodLengths = entries
        .filter(entry => entry.period_start_date && entry.period_end_date)
        .map(entry => {
          const start = new Date(entry.period_start_date!);
          const end = new Date(entry.period_end_date!);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        });

      const avgPeriodLength = periodLengths.length > 0 
        ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
        : 5;

      setCycleData({
        cycleDay: Math.max(1, cycleDay),
        nextPeriod: Math.max(0, nextPeriod),
        avgCycleLength,
        avgPeriodLength,
        hasData: true,
        isLoading: false,
      });

    } catch (error) {
      console.error('Error fetching cycle data:', error);
      setCycleData(prev => ({ ...prev, isLoading: false, hasData: false }));
    }
  };

  useEffect(() => {
    fetchCycleData();
  }, [user]);

  return { ...cycleData, refreshData: fetchCycleData };
};
