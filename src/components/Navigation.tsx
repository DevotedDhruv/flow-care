
import { Calendar, TrendingUp, Heart, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'period', label: 'Period Tracker', icon: Calendar },
    { id: 'insights', label: 'Health Insights', icon: Heart },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" 
                  : "hover:bg-pink-50"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
