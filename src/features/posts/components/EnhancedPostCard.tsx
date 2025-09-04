import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag } from 'lucide-react';
import { Post } from '@/hooks/usePosts';
import UserBadge from '@/components/UserBadge';
import { formatTimeAgo, sanitizeHtml, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onReport?: (postId: string) => void;
}

const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onReport,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      await copyToClipboard(url);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
    onShare?.(post.id);
  };

  const handleReport = () => {
    onReport?.(post.id);
    toast({
      title: "Post reported",
      description: "Thank you for helping keep our community safe",
    });
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
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
              <p className="text-sm text-muted-foreground">
                <time dateTime={post.created_at}>
                  {formatTimeAgo(post.created_at)}
                </time>
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Post options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReport} className="text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="text-foreground whitespace-pre-wrap mb-4"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHtml(post.content) 
          }}
        />
        
        {post.image_url && (
          <div className="mb-4">
            <img
              src={post.image_url}
              alt="Post image"
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(post.image_url, '_blank')}
            />
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            onClick={handleLike}
            aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-primary"
            onClick={() => onComment?.(post.id)}
            aria-label="Comment on this post"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-primary"
            onClick={handleShare}
            aria-label="Share this post"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPostCard;
