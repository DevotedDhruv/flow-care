
import { Calendar, TrendingUp, Heart, Settings, Users, MessageCircle, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'period', label: 'Period Tracker', icon: Calendar },
    { id: 'insights', label: 'Health Insights', icon: Heart },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'chatbot', label: 'AI Assistant', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl p-2 border border-white/20 dark:border-gray-700/20 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-gray-400" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 min-w-max pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center space-x-2 transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md" 
                    : "hover:bg-pink-50 dark:hover:bg-gray-800 dark:text-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
