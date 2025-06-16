
import { useState } from 'react';
import { MessageSquare, Users, Plus, Heart, MessageCircle, ThumbsUp, ThumbsDown, Send, Hash, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  likes: number;
  dislikes: number;
  replies: number;
  createdAt: string;
  userVote?: 'like' | 'dislike' | null;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  userVote?: 'like' | 'dislike' | null;
}

const Community = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // New post form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  
  // Edit post form state
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostTags, setEditPostTags] = useState('');
  
  // Reply form state
  const [replyContent, setReplyContent] = useState('');

  // Start with empty posts array - no default posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'symptoms', name: 'Symptoms & Pain', count: posts.filter(p => p.tags.some(tag => ['cramps', 'pain-relief', 'symptoms'].includes(tag))).length },
    { id: 'cycles', name: 'Cycle Questions', count: posts.filter(p => p.tags.some(tag => ['irregular-cycles', 'tracking'].includes(tag))).length },
    { id: 'lifestyle', name: 'Lifestyle & Tips', count: posts.filter(p => p.tags.some(tag => ['natural-remedies', 'apps', 'recommendations'].includes(tag))).length },
    { id: 'support', name: 'Support & Encouragement', count: posts.filter(p => p.tags.some(tag => ['support', 'encouragement', 'mental-health'].includes(tag))).length }
  ];

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: user?.user_metadata?.full_name || user?.email || 'Anonymous',
      tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      dislikes: 0,
      replies: 0,
      createdAt: new Date().toISOString(),
      userVote: null
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setIsCreatePostOpen(false);
  };

  const handleEditPost = () => {
    if (!editingPost || !editPostTitle.trim() || !editPostContent.trim()) return;

    setPosts(posts.map(post => 
      post.id === editingPost.id 
        ? {
            ...post,
            title: editPostTitle,
            content: editPostContent,
            tags: editPostTags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : post
    ));

    setEditingPost(null);
    setEditPostTitle('');
    setEditPostContent('');
    setEditPostTags('');
    setIsEditPostOpen(false);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    setReplies(replies.filter(reply => reply.postId !== postId));
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setEditPostTags(post.tags.join(', '));
    setIsEditPostOpen(true);
  };

  const canEditOrDelete = (postAuthor: string) => {
    const currentUserName = user?.user_metadata?.full_name || user?.email || 'Anonymous';
    return postAuthor === currentUserName;
  };

  const handleVotePost = (postId: string, voteType: 'like' | 'dislike') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newLikes = post.likes;
        let newDislikes = post.dislikes;
        let newUserVote: 'like' | 'dislike' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'like') newLikes--;
        if (currentVote === 'dislike') newDislikes--;

        // If clicking the same vote, remove it
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          // Add new vote
          if (voteType === 'like') newLikes++;
          if (voteType === 'dislike') newDislikes++;
        }

        return { ...post, likes: newLikes, dislikes: newDislikes, userVote: newUserVote };
      }
      return post;
    }));
  };

  const handleVoteReply = (replyId: string, voteType: 'like' | 'dislike') => {
    setReplies(replies.map(reply => {
      if (reply.id === replyId) {
        const currentVote = reply.userVote;
        let newLikes = reply.likes;
        let newDislikes = reply.dislikes;
        let newUserVote: 'like' | 'dislike' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'like') newLikes--;
        if (currentVote === 'dislike') newDislikes--;

        // If clicking the same vote, remove it
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          // Add new vote
          if (voteType === 'like') newLikes++;
          if (voteType === 'dislike') newDislikes++;
        }

        return { ...reply, likes: newLikes, dislikes: newDislikes, userVote: newUserVote };
      }
      return reply;
    }));
  };

  const handleAddReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      postId,
      content: replyContent,
      author: user?.user_metadata?.full_name || user?.email || 'Anonymous',
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      userVote: null
    };

    setReplies([...replies, newReply]);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, replies: post.replies + 1 }
        : post
    ));
    setReplyContent('');
  };

  const getFilteredPosts = () => {
    if (activeCategory === 'all') return posts;
    
    const categoryTagMap: Record<string, string[]> = {
      symptoms: ['cramps', 'pain-relief', 'symptoms', 'headache', 'bloating'],
      cycles: ['irregular-cycles', 'tracking', 'hormones'],
      lifestyle: ['natural-remedies', 'apps', 'recommendations', 'nutrition'],
      support: ['support', 'encouragement', 'mental-health']
    };

    return posts.filter(post => 
      post.tags.some(tag => categoryTagMap[activeCategory]?.includes(tag))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPostReplies = (postId: string) => {
    return replies.filter(reply => reply.postId === postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2 text-pink-600" />
            Community
          </h2>
          <p className="text-muted-foreground">Connect, share experiences, and support each other</p>
        </div>
        
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              New Post
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
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or experiences..."
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="e.g., cramps, irregular-cycles, natural-remedies"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or experiences..."
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={editPostTags}
                  onChange={(e) => setEditPostTags(e.target.value)}
                  placeholder="e.g., cramps, irregular-cycles, natural-remedies"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditPostOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditPost}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-4 mt-6">
          {getFilteredPosts().map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      {canEditOrDelete(post.author) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(post)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>By {post.author}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVotePost(post.id, 'like')}
                        className={`p-1 h-auto ${post.userVote === 'like' ? 'text-green-600' : ''}`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVotePost(post.id, 'dislike')}
                        className={`p-1 h-auto ${post.userVote === 'dislike' ? 'text-red-600' : ''}`}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {post.dislikes}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.replies}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{post.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm">{post.content}</p>
                              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                <span>By {post.author} • {formatDate(post.createdAt)}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="flex items-center">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {post.likes}
                                  </span>
                                  <span className="flex items-center">
                                    <ThumbsDown className="w-3 h-3 mr-1" />
                                    {post.dislikes}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-medium">Replies ({getPostReplies(post.id).length})</h4>
                              {getPostReplies(post.id).map((reply) => (
                                <div key={reply.id} className="p-3 border rounded-lg">
                                  <p className="text-sm mb-2">{reply.content}</p>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>By {reply.author} • {formatDate(reply.createdAt)}</span>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleVoteReply(reply.id, 'like')}
                                        className={`p-1 h-auto text-xs ${reply.userVote === 'like' ? 'text-green-600' : ''}`}
                                      >
                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                        {reply.likes}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleVoteReply(reply.id, 'dislike')}
                                        className={`p-1 h-auto text-xs ${reply.userVote === 'dislike' ? 'text-red-600' : ''}`}
                                      >
                                        <ThumbsDown className="w-3 h-3 mr-1" />
                                        {reply.dislikes}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-3">Add a Reply</h4>
                              <div className="flex space-x-2">
                                <Textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Share your thoughts or advice..."
                                  rows={3}
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => handleAddReply(post.id)}
                                  className="self-end"
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredPosts().length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No posts in this category yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to start a conversation in this category!
                </p>
                <Button onClick={() => setIsCreatePostOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
