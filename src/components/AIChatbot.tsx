import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant for menstrual health. I can help you with questions about periods, cycle tracking, symptoms, nutrition, and general reproductive health. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const menstrualKnowledge = {
    'period pain': "Period pain (dysmenorrhea) is common and can be managed with heat therapy, gentle exercise, over-the-counter pain relievers, and relaxation techniques. If pain is severe, consult a healthcare provider.",
    'cycle length': "A normal menstrual cycle ranges from 21-35 days, with an average of 28 days. Your cycle is counted from the first day of one period to the first day of the next.",
    'irregular periods': "Irregular periods can be caused by stress, weight changes, hormones, or medical conditions. Track your cycle for a few months and consult a doctor if irregularities persist.",
    'pms symptoms': "PMS symptoms include mood changes, bloating, breast tenderness, and fatigue. Regular exercise, a balanced diet, and stress management can help reduce symptoms.",
    'flow changes': "Changes in menstrual flow can be normal due to age, stress, or lifestyle factors. However, sudden significant changes should be discussed with a healthcare provider.",
    'ovulation': "Ovulation typically occurs around day 14 of a 28-day cycle. Signs include cervical mucus changes, mild pelvic pain, and slight temperature increase.",
    'nutrition': "During menstruation, focus on iron-rich foods, stay hydrated, and eat anti-inflammatory foods like leafy greens, berries, and omega-3 rich fish.",
    'exercise': "Light to moderate exercise during periods can help reduce cramps and improve mood. Activities like yoga, walking, and swimming are excellent choices.",
  };

  const generateResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Find matching knowledge
    for (const [key, response] of Object.entries(menstrualKnowledge)) {
      if (lowercaseMessage.includes(key)) {
        return response;
      }
    }

    // Default responses for common greetings
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello! I'm here to help with any menstrual health questions you have. Feel free to ask about periods, symptoms, nutrition, or anything related to reproductive health.";
    }

    if (lowercaseMessage.includes('thank')) {
      return "You're welcome! I'm here whenever you need information about menstrual health. Take care!";
    }

    // General response
    return "I'd be happy to help with that! For specific medical concerns, I always recommend consulting with a healthcare provider. In the meantime, I can provide general information about menstrual health topics like cycle tracking, nutrition, exercise, and symptom management. Could you be more specific about what you'd like to know?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          AI Menstrual Health Assistant
        </h2>
        <p className="text-muted-foreground mt-2">
          Get personalized guidance and answers to your menstrual health questions
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Chat with AI Assistant</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3",
                    message.isBot ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    message.isBot 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                      : "bg-gray-500"
                  )}>
                    {message.isBot ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.isBot
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  )}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about periods, symptoms, nutrition..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold text-pink-600 mb-2">Quick Topics</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("Tell me about period pain relief")}
            >
              Period Pain Relief
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("What's a normal cycle length?")}
            >
              Normal Cycle Length
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("PMS symptoms management")}
            >
              PMS Management
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-purple-600 mb-2">Health Tips</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("Best foods during menstruation")}
            >
              Nutrition Tips
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("Exercise during periods")}
            >
              Exercise Guidelines
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => setInput("Irregular periods causes")}
            >
              Irregular Periods
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIChatbot;
