import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { useSickleConnectWebSocket } from '@/shared/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Send } from 'lucide-react';
import { WEBSOCKET_EVENTS } from '@/lib/constants';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePosts();
  const { toast } = useToast();
  const { user } = useAuth();
  const { sendMessage } = useSickleConnectWebSocket(user?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something to share with the community",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await createPost(content.trim());

    if (error) {
      toast({
        title: "Failed to Create Post",
        description: error,
        variant: "destructive"
      });
    } else {
      // Send WebSocket notification to all connected users
      try {
        sendMessage({
          type: WEBSOCKET_EVENTS.NEW_POST,
          data: {
            authorName: user?.fullName || 'Anonymous',
            authorId: user?._id,
            content: content.trim(),
            timestamp: new Date().toISOString(),
          }
        });
      } catch (wsError) {
        console.log('WebSocket notification failed, but post was created successfully');
      }

      toast({
        title: "Post Shared!",
        description: "Your post has been shared with the community"
      });
      setContent('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Share Your Story</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share your experiences, ask questions, or offer support..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {content.length}/500 characters
            </span>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Share Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;