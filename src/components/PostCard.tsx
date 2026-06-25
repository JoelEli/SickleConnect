import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageSquare, Share2, Loader2, MoreHorizontal } from 'lucide-react';
import { Post } from '@/hooks/usePosts';
import CommentSection from './CommentSection';
import { formatDistanceToNow, isValid } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => Promise<{ error: string | null }>;
}

const roleBadge = (role: string) => {
  if (role === 'doctor') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-400 border border-teal-500/20">
        Doctor
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
      Patient
    </span>
  );
};

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { likePost } = usePosts();
  const { toast } = useToast();

  const createdDate = new Date(post.created_at);
  const timeAgo = isValid(createdDate) ? formatDistanceToNow(createdDate, { addSuffix: true }) : '';

  const handleLike = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to like posts", variant: "destructive" });
      return;
    }
    setIsLiking(true);
    try {
      const result = await likePost(post.id);
      if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    } catch {
      toast({ title: "Error", description: "Failed to like post", variant: "destructive" });
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to comment", variant: "destructive" });
      return;
    }
    setShowComments(true);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${post.profiles.full_name}'s Post`, text: post.content, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${post.profiles.full_name}: ${post.content}\n\n${window.location.href}`);
        toast({ title: "Link Copied!", description: "Post link copied to clipboard" });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({ title: "Error", description: "Failed to share post", variant: "destructive" });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      const result = await onDelete(post.id);
      if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
      else toast({ title: "Post Deleted", description: "Your post has been deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const isDoctor = post.profiles.role === 'doctor';
  const avatarGradient = isDoctor
    ? 'from-teal-500 to-cyan-600'
    : 'from-violet-500 to-purple-600';

  return (
    <>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-4 hover:border-white/[0.1] transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-white/10">
              <AvatarFallback className={`bg-gradient-to-br ${avatarGradient} text-white text-sm font-semibold`}>
                {post.profiles.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-white">{post.profiles.full_name}</h4>
                {roleBadge(post.profiles.role)}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {post.profiles.genotype && (
                  <span className="text-xs text-teal-400 font-medium">Genotype {post.profiles.genotype}</span>
                )}
                {post.profiles.genotype && <span className="text-white/15">·</span>}
                <span className="text-xs text-white/30">{timeAgo}</span>
              </div>
            </div>
          </div>

          {user && user._id === post.user_id && onDelete ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-white/20 hover:text-rose-400 hover:bg-white/5 h-8 w-8 p-0"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
            </Button>
          ) : (
            <button className="text-white/15 hover:text-white/30 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        {isDoctor ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-4">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        ) : (
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>
        )}

        {post.image_url && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.06]">
            <img src={post.image_url} alt="Post image" className="w-full h-auto" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-white/[0.04]">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              post.is_liked
                ? 'text-rose-400 hover:bg-rose-500/10'
                : 'text-white/30 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <motion.div whileTap={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 500 }}>
                <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
              </motion.div>
            )}
            <span>{post.likes_count} {post.likes_count === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/50 hover:bg-white/5 transition-all"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments_count} {post.comments_count === 1 ? 'Comment' : 'Comments'}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/50 hover:bg-white/5 transition-all"
          >
            {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            <span>Share</span>
          </button>
        </div>
      </div>

      <CommentSection
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </>
  );
};

export default PostCard;
