
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, TrendingUp, Users, Shield, Smartphone, Star, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Calendar,
      title: "Smart Period Tracking",
      description: "Track your cycle with precision using our intuitive calendar interface",
      image: "📅"
    },
    {
      icon: TrendingUp,
      title: "Health Insights",
      description: "Get personalized insights about your cycle patterns and health trends",
      image: "📊"
    },
    {
      icon: Heart,
      title: "Wellness & Exercise",
      description: "Access guided workouts and meditation specifically designed for your cycle",
      image: "🧘‍♀️"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with other women and share experiences in a safe space",
      image: "👥"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "FlowCare has completely changed how I understand my body. The insights are incredibly helpful!"
    },
    {
      name: "Maria Garcia",
      rating: 5,
      text: "The meditation features help me manage PMS symptoms so much better. Highly recommend!"
    },
    {
      name: "Emily Chen",
      rating: 5,
      text: "Finally, a period app that actually understands women's needs. Love the community aspect!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              FlowCare
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 text-pink-600 border-pink-200">
            Trusted by 10,000+ women worldwide
          </Badge>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Take Control of Your
            <br />
            Menstrual Health
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            FlowCare is your comprehensive companion for period tracking, health insights, and wellness support. 
            Understand your body better with personalized analytics and guided wellness programs.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              Start Tracking for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Everything You Need in One App</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From cycle tracking to wellness support, FlowCare provides comprehensive tools for your menstrual health journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveFeature(index)}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.image}</div>
                  <Icon className="w-8 h-8 mx-auto mb-4 text-pink-600" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Why Choose FlowCare?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Privacy First</h4>
                  <p className="text-muted-foreground">Your data is encrypted and never shared. Complete control over your information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personalized Insights</h4>
                  <p className="text-muted-foreground">AI-powered analytics provide unique insights tailored to your body.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Smartphone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Easy to Use</h4>
                  <p className="text-muted-foreground">Intuitive interface designed with women's needs in mind.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-8 rounded-2xl">
            <div className="text-center">
              <Calendar className="w-24 h-24 mx-auto mb-6 text-pink-600" />
              <h4 className="text-xl font-semibold mb-4">Start Your Journey Today</h4>
              <p className="text-muted-foreground mb-6">Join thousands of women who have transformed their menstrual health experience.</p>
              <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">What Our Users Say</h3>
          <p className="text-lg text-muted-foreground">Real experiences from real women</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-3xl p-12">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Health Journey?</h3>
          <p className="text-xl mb-8 opacity-90">Join FlowCare today and take the first step towards better menstrual health.</p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')} className="bg-white text-pink-600 hover:bg-gray-100">
            Start Your Free Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-pink-600" />
            <span className="font-semibold">FlowCare</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FlowCare. Made with ❤️ for women everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
