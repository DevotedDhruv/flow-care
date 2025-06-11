
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SymptomsChartProps {
  data: Array<{
    date: string;
    symptoms: {
      cramps?: number;
      mood?: number;
      energy?: number;
      headache?: number;
      bloating?: number;
    };
  }>;
}

const SymptomsChart = ({ data }: SymptomsChartProps) => {
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cramps: entry.symptoms.cramps || 0,
    mood: entry.symptoms.mood || 0,
    energy: entry.symptoms.energy || 0,
    headache: entry.symptoms.headache || 0,
    bloating: entry.symptoms.bloating || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Symptoms Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cramps" stroke="#ef4444" strokeWidth={2} name="Cramps" />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy" />
                <Line type="monotone" dataKey="headache" stroke="#f59e0b" strokeWidth={2} name="Headache" />
                <Line type="monotone" dataKey="bloating" stroke="#3b82f6" strokeWidth={2} name="Bloating" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Cramps
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Mood
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Energy
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Headache
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Bloating
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomsChart;
