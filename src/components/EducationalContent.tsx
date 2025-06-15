
import { useState } from 'react';
import { Book, Clock, Heart, Brain, Utensils, Activity, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: number;
  category: string;
  tags: string[];
  author: string;
  date: string;
}

const EducationalContent = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding Your Menstrual Cycle: A Complete Guide',
      excerpt: 'Learn about the four phases of your menstrual cycle and what happens in your body during each phase.',
      content: `Your menstrual cycle is a natural process that prepares your body for potential pregnancy each month. Understanding these phases can help you better track your health and recognize patterns.

**Menstrual Phase (Days 1-5):**
This is when you have your period. The lining of your uterus (endometrium) sheds, causing bleeding. You might experience cramps, fatigue, and mood changes.

**Follicular Phase (Days 1-13):**
Overlapping with menstruation, this phase involves the pituitary gland releasing hormones that stimulate your ovaries to prepare an egg for release.

**Ovulation Phase (Around Day 14):**
An egg is released from the ovary. This is your most fertile time. You might notice changes in cervical mucus and a slight increase in body temperature.

**Luteal Phase (Days 15-28):**
If the egg isn't fertilized, hormone levels drop, leading to PMS symptoms like bloating, mood swings, and breast tenderness.

Understanding these phases helps you:
- Plan activities around your energy levels
- Recognize when symptoms are normal
- Track fertility if trying to conceive
- Know when to expect your next period`,
      readTime: 8,
      category: 'basics',
      tags: ['menstrual cycle', 'phases', 'hormones'],
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Nutrition for Menstrual Health: Foods That Help',
      excerpt: 'Discover which foods can help reduce period symptoms and support overall reproductive health.',
      content: `What you eat can significantly impact your menstrual health. The right nutrition can help reduce cramping, boost energy, and stabilize mood.

**Iron-Rich Foods:**
- Lean red meat, spinach, lentils
- Important for replacing iron lost during menstruation
- Pair with vitamin C foods for better absorption

**Anti-Inflammatory Foods:**
- Fatty fish (salmon, mackerel)
- Leafy greens, berries
- Turmeric and ginger
- Help reduce cramping and inflammation

**Complex Carbohydrates:**
- Whole grains, quinoa, sweet potatoes
- Provide steady energy and help stabilize mood
- Reduce sugar cravings

**Calcium and Magnesium:**
- Dairy products, almonds, dark chocolate
- Help reduce PMS symptoms and cramping
- Support bone health

**Foods to Limit:**
- Excessive caffeine and alcohol
- High-sodium processed foods
- Refined sugars
- These can worsen bloating and mood swings

**Hydration Tips:**
- Drink plenty of water
- Herbal teas like chamomile and peppermint
- Warm beverages can help with cramping`,
      readTime: 6,
      category: 'nutrition',
      tags: ['nutrition', 'diet', 'PMS', 'cramps'],
      author: 'Nutritionist Emma Davis',
      date: '2024-01-20'
    },
    {
      id: '3',
      title: 'Managing Period Pain: Natural and Medical Options',
      excerpt: 'Explore effective ways to manage menstrual cramps and when to seek medical help.',
      content: `Period pain affects up to 90% of women. While some discomfort is normal, severe pain shouldn't be ignored.

**Natural Pain Relief:**

*Heat Therapy:*
- Heating pads or warm baths
- Increases blood flow and relaxes muscles
- Apply for 15-20 minutes at a time

*Gentle Exercise:*
- Walking, yoga, swimming
- Releases endorphins (natural painkillers)
- Improves circulation

*Massage:*
- Abdominal and lower back massage
- Use circular motions with light pressure
- Essential oils like lavender can enhance relaxation

*Relaxation Techniques:*
- Deep breathing exercises
- Meditation and mindfulness
- Progressive muscle relaxation

**Medical Options:**

*Over-the-Counter Medications:*
- NSAIDs (ibuprofen, naproxen)
- Take before pain becomes severe
- Follow dosage instructions

*Hormonal Birth Control:*
- Can reduce or eliminate periods
- Discuss options with your healthcare provider

**When to Seek Help:**
- Pain that interferes with daily activities
- Heavy bleeding (changing pad/tampon every hour)
- Periods lasting longer than 7 days
- Severe pain that doesn't respond to treatment
- Sudden changes in your cycle

Remember, you don't have to suffer in silence. There are many effective treatments available.`,
      readTime: 7,
      category: 'health',
      tags: ['pain relief', 'cramps', 'treatment', 'natural remedies'],
      author: 'Dr. Maria Rodriguez',
      date: '2024-01-25'
    },
    {
      id: '4',
      title: 'Exercise and Your Cycle: Working Out During Periods',
      excerpt: 'Learn how to adapt your fitness routine to your menstrual cycle for optimal results.',
      content: `Your menstrual cycle affects your energy, strength, and recovery. Understanding these changes can help you optimize your workouts.

**During Menstruation (Days 1-5):**
- Energy levels are typically lower
- Focus on gentle activities: walking, yoga, light stretching
- Listen to your body - rest if needed
- Exercise can actually help reduce cramps

**Follicular Phase (Days 1-13):**
- Energy begins to increase
- Good time for building new habits
- Gradually increase intensity
- Try new activities or classes

**Ovulation Phase (Around Day 14):**
- Peak energy and strength
- Ideal time for high-intensity workouts
- Your body can handle more stress
- Great for challenging yourself

**Luteal Phase (Days 15-28):**
- Energy may fluctuate
- Focus on strength training
- Be consistent but not overly intense
- PMS symptoms may affect motivation

**Best Exercises During Periods:**

*Yoga:*
- Child's pose, cat-cow stretch
- Reduces cramping and stress
- Improves flexibility

*Walking:*
- Low-impact and accessible
- Boosts endorphins
- Can be done anywhere

*Swimming:*
- Water pressure may reduce bloating
- Full-body, low-impact exercise
- Warm water can relax muscles

*Light Strength Training:*
- Use lighter weights
- Focus on form over intensity
- Can help maintain routine

**Tips for Success:**
- Track your cycle and energy levels
- Adjust intensity based on how you feel
- Stay hydrated
- Don't skip workouts entirely - movement helps
- Use exercise as a mood booster`,
      readTime: 5,
      category: 'fitness',
      tags: ['exercise', 'fitness', 'cycle tracking', 'energy'],
      author: 'Fitness Coach Lisa Chen',
      date: '2024-02-01'
    },
    {
      id: '5',
      title: 'Mental Health and Menstruation: Coping with Mood Changes',
      excerpt: 'Understanding the connection between hormones and mood, plus strategies for emotional wellness.',
      content: `Hormonal fluctuations during your cycle can significantly impact your mood and mental health. Understanding this connection helps you prepare and cope better.

**How Hormones Affect Mood:**

*Estrogen:*
- Higher levels boost serotonin (happiness hormone)
- Drops before menstruation can cause mood dips
- Affects energy and motivation

*Progesterone:*
- Has calming effects when balanced
- Drops can cause anxiety and irritability
- Affects sleep quality

**Common Emotional Changes:**

*PMS Symptoms:*
- Irritability, anxiety, depression
- Mood swings and emotional sensitivity
- Usually occur 1-2 weeks before period

*During Menstruation:*
- Fatigue and low mood
- Increased emotional sensitivity
- May feel overwhelmed more easily

**Coping Strategies:**

*Mindfulness and Meditation:*
- Daily 10-minute practice
- Helps manage anxiety and stress
- Apps like Headspace or Calm can guide you

*Journaling:*
- Track mood patterns with your cycle
- Express emotions safely
- Identify triggers and patterns

*Social Support:*
- Talk to friends and family
- Join support groups
- Don't isolate yourself

*Professional Help:*
- Consider therapy if symptoms are severe
- PMDD (severe PMS) may need medical treatment
- Don't hesitate to seek help

**Self-Care Practices:**
- Prioritize sleep (7-9 hours)
- Regular exercise releases endorphins
- Healthy nutrition supports mood stability
- Limit caffeine and alcohol
- Practice saying no to extra commitments

**When to Seek Professional Help:**
- Symptoms interfere with daily life
- Thoughts of self-harm
- Severe depression or anxiety
- Relationships are suffering

Remember, mood changes during your cycle are normal, but you don't have to suffer through them alone.`,
      readTime: 9,
      category: 'mental-health',
      tags: ['mental health', 'mood', 'PMS', 'hormones', 'coping'],
      author: 'Dr. Rachel Thompson',
      date: '2024-02-05'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Articles', icon: Book },
    { id: 'basics', label: 'Cycle Basics', icon: Heart },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'health', label: 'Health & Pain', icon: Heart },
    { id: 'fitness', label: 'Fitness', icon: Activity },
    { id: 'mental-health', label: 'Mental Health', icon: Brain },
  ];

  const filteredArticles = (category: string) => {
    if (category === 'all') return articles;
    return articles.filter(article => article.category === category);
  };

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => setSelectedArticle(null)}
          className="mb-4"
        >
          ← Back to Articles
        </Button>
        
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{selectedArticle.readTime} min read</span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
              </div>
              <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-pink max-w-none">
              {selectedArticle.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-pink-600 mt-6 mb-3">
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                  return (
                    <h4 key={index} className="text-md font-medium text-purple-600 mt-4 mb-2">
                      {paragraph.slice(1, -1)}
                    </h4>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="ml-4">
                      {paragraph.slice(2)}
                    </li>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Educational Content
        </h2>
        <p className="text-muted-foreground mt-2">
          Evidence-based articles to help you understand your menstrual health
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles(category.id).map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min read</span>
                      </div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                    <CardTitle className="text-lg hover:text-pink-600 transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedArticle(article)}
                        className="text-pink-600 hover:text-pink-700"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EducationalContent;
