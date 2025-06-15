
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyDashboardProps {
  onStartTracking: () => void;
}

const EmptyDashboard = ({ onStartTracking }: EmptyDashboardProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader className="text-center">
          <Calendar className="w-16 h-16 mx-auto text-pink-400 mb-4" />
          <CardTitle className="text-xl text-pink-800">
            Welcome to FlowCare!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Start tracking your menstrual cycle to get personalized insights, 
            predictions, and health recommendations.
          </p>
          <Button 
            onClick={onStartTracking}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Start Tracking Your Period
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-pink-800">Track Your Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-pink-700">
              Log your periods, flow intensity, and symptoms to understand your unique cycle patterns.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-800">Get Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700">
              Receive accurate predictions for your next period and fertile window based on your data.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-teal-800">Health Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-teal-700">
              Discover personalized health insights and tips based on your menstrual cycle phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyDashboard;
