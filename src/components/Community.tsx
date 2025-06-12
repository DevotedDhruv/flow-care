
import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, Plus, Users, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  is_anonymous: boolean;
}

interface Reply {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  is_anonymous: boolean;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', isAnonymous: false });
  const [newReply, setNewReply] = useState({ content: '', isAnonymous: false });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  // Mock data for demonstration since we don't have the community tables set up yet
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Irregular periods after stopping birth control?',
      content: 'Has anyone experienced irregular cycles after stopping hormonal birth control? Its been 3 months and my periods are all over the place. Looking for advice and similar experiences.',
      category: 'cycle-health',
      author_name: 'Sarah M.',
      created_at: '2024-01-10T10:30:00Z',
      likes_count: 12,
      replies_count: 8,
      is_anonymous: false
    },
    {
      id: '2',
      title: 'Natural remedies for severe cramps?',
      content: 'My cramps have been getting worse lately. Ive tried heat pads and ibuprofen, but Im looking for more natural alternatives. What works for you?',
      category: 'pain-management',
      author_name: 'Anonymous',
      created_at: '2024-01-09T15:45:00Z',
      likes_count: 24,
      replies_count: 15,
      is_anonymous: true
    },
    {
      id: '3',
      title: 'PCOS diagnosis - feeling overwhelmed',
      content: 'Just got diagnosed with PCOS and feeling scared and confused. Would love to connect with others who have been through this journey.',
      category: 'support',
      author_name: 'Anonymous',
      created_at: '2024-01-08T09:20:00Z',
      likes_count: 18,
      replies_count: 22,
      is_anonymous: true
    },
    {
      id: '4',
      title: 'Best period tracking apps?',
      content: 'Im new to period tracking and looking for app recommendations. What features do you find most helpful?',
      category: 'tools-tips',
      author_name: 'Emma K.',
      created_at: '2024-01-07T14:15:00Z',
      likes_count: 7,
      replies_count: 12,
      is_anonymous: false
    },
    {
      id: '5',
      title: 'Exercise during your period - yes or no?',
      content: 'Do you exercise during your period? I feel so tired and crampy but wondering if light exercise might actually help.',
      category: 'lifestyle',
      author_name: 'FitnessLover23',
      created_at: '2024-01-06T11:30:00Z',
      likes_count: 15,
      replies_count: 19,
      is_anonymous: false
    }
  ];

  const mockReplies: Reply[] = [
    {
      id: '1',
      content: 'It took about 6 months for my cycles to regulate after stopping the pill. Be patient with your body - its readjusting to its natural hormones!',
      author_name: 'HealthyLiving',
      created_at: '2024-01-10T12:00:00Z',
      is_anonymous: false
    },
    {
      id: '2',
      content: 'I experienced the same thing! My doctor said it can take up to a year for some people. Track everything and consider seeing a gynecologist if youre concerned.',
      author_name: 'Anonymous',
      created_at: '2024-01-10T13:15:00Z',
      is_anonymous: true
    }
  ];

  const fetchPosts = async () => {
    // For now, using mock data. In a real app, this would fetch from Supabase
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let filteredPosts = mockPosts;
      
      if (activeTab !== 'all') {
        filteredPosts = mockPosts.filter(post => post.category === activeTab);
      }
      
      setPosts(filteredPosts);
      setLoading(false);
    }, 500);
  };

  const fetchReplies = async (postId: string) => {
    // For now, using mock data
    setReplies(mockReplies);
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would create a post in Supabase
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author_name: newPost.isAnonymous ? 'Anonymous' : (user?.user_metadata?.full_name || 'User'),
      created_at: new Date().toISOString(),
      likes_count: 0,
      replies_count: 0,
      is_anonymous: newPost.isAnonymous
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'general', isAnonymous: false });
    
    toast({
      title: "Success",
      description: "Your post has been created!"
    });
  };

  const handleReply = async () => {
    if (!newReply.content.trim()) {
      toast({
        title: "Error",
        description: "Please write a reply.",
        variant: "destructive"
      });
      return;
    }

    const reply: Reply = {
      id: Date.now().toString(),
      content: newReply.content,
      author_name: newReply.isAnonymous ? 'Anonymous' : (user?.user_metadata?.full_name || 'User'),
      created_at: new Date().toISOString(),
      is_anonymous: newReply.isAnonymous
    };

    setReplies([...replies, reply]);
    setNewReply({ content: '', isAnonymous: false });
    
    toast({
      title: "Success",
      description: "Your reply has been posted!"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'cycle-health': 'bg-pink-100 text-pink-800',
      'pain-management': 'bg-red-100 text-red-800',
      'support': 'bg-purple-100 text-purple-800',
      'tools-tips': 'bg-blue-100 text-blue-800',
      'lifestyle': 'bg-green-100 text-green-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'cycle-health': 'Cycle Health',
      'pain-management': 'Pain Management',
      'support': 'Support',
      'tools-tips': 'Tools & Tips',
      'lifestyle': 'Lifestyle',
      'general': 'General'
    };
    return labels[category] || 'General';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community</h2>
          <p className="text-muted-foreground">Connect with others and share experiences</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What's on your mind?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="cycle-health">Cycle Health</option>
                  <option value="pain-management">Pain Management</option>
                  <option value="support">Support</option>
                  <option value="tools-tips">Tools & Tips</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                />
                <Label htmlFor="anonymous">Post anonymously</Label>
              </div>
              <Button onClick={handleCreatePost} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="cycle-health">Cycle Health</TabsTrigger>
          <TabsTrigger value="pain-management">Pain</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="tools-tips">Tips</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Users className="w-8 h-8 text-pink-600 animate-pulse" />
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          by {post.author_name}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.replies_count}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            fetchReplies(post.id);
                          }}
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          View Discussion
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getCategoryColor(post.category)}>
                              {getCategoryLabel(post.category)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              by {post.author_name} • {formatDate(post.created_at)}
                            </span>
                          </div>
                          <DialogTitle className="text-xl">{post.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="whitespace-pre-wrap">{post.content}</p>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-medium">Replies ({replies.length})</h4>
                            
                            {replies.map((reply) => (
                              <div key={reply.id} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">
                                    {reply.author_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-medium">Add Reply</h4>
                            <Textarea
                              placeholder="Share your thoughts or advice..."
                              value={newReply.content}
                              onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                              rows={3}
                            />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="reply-anonymous"
                                  checked={newReply.isAnonymous}
                                  onChange={(e) => setNewReply({ ...newReply, isAnonymous: e.target.checked })}
                                />
                                <Label htmlFor="reply-anonymous">Reply anonymously</Label>
                              </div>
                              <Button onClick={handleReply}>
                                Post Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
            Community Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Be respectful and supportive of others</p>
            <p>• Share experiences and advice, not medical diagnoses</p>
            <p>• Use content warnings for sensitive topics</p>
            <p>• Respect privacy - avoid sharing personal medical details</p>
            <p>• Report inappropriate content to moderators</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;
