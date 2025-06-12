
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, PieChartIcon, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['cramps', 'mood', 'energy']);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: entry.date,
    cramps: entry.symptoms.cramps || 0,
    mood: entry.symptoms.mood || 0,
    energy: entry.symptoms.energy || 0,
    headache: entry.symptoms.headache || 0,
    bloating: entry.symptoms.bloating || 0,
  })).slice(-14); // Show last 14 days

  const symptomColors = {
    cramps: '#ef4444',
    mood: '#8b5cf6',
    energy: '#10b981',
    headache: '#f59e0b',
    bloating: '#3b82f6'
  };

  const symptomLabels = {
    cramps: 'Cramps',
    mood: 'Mood',
    energy: 'Energy',
    headache: 'Headache',
    bloating: 'Bloating'
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Calculate averages for pie chart
  const averageData = Object.keys(symptomColors).map(symptom => {
    const values = chartData.map(d => d[symptom as keyof typeof d] as number).filter(v => v > 0);
    const average = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    return {
      name: symptomLabels[symptom as keyof typeof symptomLabels],
      value: Math.round(average * 10) / 10,
      color: symptomColors[symptom as keyof typeof symptomColors]
    };
  }).filter(item => item.value > 0);

  // Symptom trends analysis
  const getSymptomTrend = (symptom: string) => {
    const recentData = chartData.slice(-7);
    const olderData = chartData.slice(-14, -7);
    
    if (recentData.length === 0 || olderData.length === 0) return 'stable';
    
    const recentAvg = recentData.reduce((sum, d) => sum + (d[symptom as keyof typeof d] as number), 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, d) => sum + (d[symptom as keyof typeof d] as number), 0) / olderData.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'increasing';
    if (difference < -0.5) return 'decreasing';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}/5
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Symptoms Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Symptoms Data</h3>
            <p className="text-sm text-muted-foreground">
              Start logging your symptoms in the Period Tracker to see charts and trends here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Symptoms Tracking
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Bar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(symptomLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={selectedSymptoms.includes(key) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSymptom(key)}
                    className="text-xs"
                    style={{
                      backgroundColor: selectedSymptoms.includes(key) ? symptomColors[key as keyof typeof symptomColors] : undefined,
                      borderColor: symptomColors[key as keyof typeof symptomColors]
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {selectedSymptoms.map(symptom => (
                        <Line
                          key={symptom}
                          type="monotone"
                          dataKey={symptom}
                          stroke={symptomColors[symptom as keyof typeof symptomColors]}
                          strokeWidth={2}
                          name={symptomLabels[symptom as keyof typeof symptomLabels]}
                        />
                      ))}
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {selectedSymptoms.map(symptom => (
                        <Bar
                          key={symptom}
                          dataKey={symptom}
                          fill={symptomColors[symptom as keyof typeof symptomColors]}
                          name={symptomLabels[symptom as keyof typeof symptomLabels]}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Symptom Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(symptomLabels).map(([key, label]) => {
                        const trend = getSymptomTrend(key);
                        return (
                          <div key={key} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: symptomColors[key as keyof typeof symptomColors] }}
                              />
                              <span className="text-sm font-medium">{label}</span>
                            </div>
                            <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
                              <span>{getTrendIcon(trend)}</span>
                              <span className="capitalize">{trend}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={averageData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {averageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(symptomLabels).map(([key, label]) => {
                  const recentValues = chartData.slice(-7).map(d => d[key as keyof typeof d] as number);
                  const average = recentValues.length > 0 
                    ? recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length 
                    : 0;
                  
                  return (
                    <Card key={key}>
                      <CardContent className="p-4 text-center">
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2" 
                          style={{ backgroundColor: symptomColors[key as keyof typeof symptomColors] }}
                        />
                        <h4 className="font-medium text-sm">{label}</h4>
                        <p className="text-lg font-bold">{average.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">7-day average</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>📊 You've tracked symptoms for {chartData.length} days</p>
                    {averageData.length > 0 && (
                      <p>🔍 Your most common symptom is <strong>{averageData[0].name}</strong> with an average severity of {averageData[0].value}/5</p>
                    )}
                    <p>📈 Track consistently for better insights and predictions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomsChart;
