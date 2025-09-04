import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Loader2, Trash2 } from 'lucide-react';
import { Post } from '@/hooks/usePosts';
import UserBadge from './UserBadge';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => Promise<{ error: string | null }>;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { likePost } = usePosts();
  const { toast } = useToast();
  
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    setIsLiking(true);
    try {
      const result = await likePost(post.id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    setShowComments(true);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: `${post.profiles.full_name}'s Post`,
        text: post.content,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Post shared successfully",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${post.profiles.full_name}: ${post.content}\n\n${window.location.href}`
        );
        toast({
          title: "Link Copied!",
          description: "Post link copied to clipboard",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share post",
          variant: "destructive",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await onDelete(post.id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Post Deleted",
          description: "Your post has been deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {post.profiles.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{post.profiles.full_name}</h4>
                  <UserBadge 
                    role={post.profiles.role} 
                    genotype={post.profiles.genotype} 
                    size="sm" 
                  />
                </div>
                <p className="text-sm text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-foreground whitespace-pre-wrap mb-4">{post.content}</p>
          
          {post.image_url && (
            <div className="mb-4">
              <img
                src={post.image_url}
                alt="Post image"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`gap-2 transition-colors ${
                post.is_liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
              onClick={handleLike}
              disabled={isLiking}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
              )}
              {post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-muted-foreground hover:text-primary"
              onClick={handleComment}
            >
              <MessageCircle className="h-4 w-4" />
              {post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-muted-foreground hover:text-primary"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Share
            </Button>

            {/* Delete button - only show for post author */}
            {user && user._id === post.user_id && onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-red-500"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CommentSection 
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

export default PostCard;