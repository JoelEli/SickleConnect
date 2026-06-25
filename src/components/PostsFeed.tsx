import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '@/hooks/usePosts';
import { useSickleConnectWebSocket, useWebSocketMessageHandler } from '@/shared/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { WEBSOCKET_EVENTS } from '@/lib/constants';
import { staggerContainer, staggerItem } from '@/lib/animations';

const PostsFeed = () => {
  const {
    posts,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    likePost,
    deletePost,
    updatePostLike,
    updatePostCommentCount,
    addNewPost,
    removePost
  } = usePosts();
  const { user } = useAuth();
  const { toast } = useToast();

  const { isConnected } = useSickleConnectWebSocket(user?._id);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case WEBSOCKET_EVENTS.NEW_POST:
        addNewPost(message.data.post);
        toast({ title: "New Post", description: `${message.data.authorName} shared a new post` });
        break;
      case WEBSOCKET_EVENTS.POST_LIKED:
        const { postId, likesCount, isLiked } = message.data;
        updatePostLike(postId, likesCount, isLiked);
        break;
      case WEBSOCKET_EVENTS.NEW_COMMENT:
        const { postId: commentPostId } = message.data;
        updatePostCommentCount(commentPostId);
        break;
      case WEBSOCKET_EVENTS.POST_DELETED:
        const { postId: deletedPostId } = message.data;
        removePost(deletedPostId);
        break;
    }
  }, [addNewPost, updatePostLike, updatePostCommentCount, removePost, toast]);

  useWebSocketMessageHandler(handleWebSocketMessage);

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
        <p className="text-white/30 text-sm">Loading community posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-amber-300/70"
        >
          Real-time updates are currently offline. Posts will update when you refresh.
        </motion.div>
      )}

      <CreatePost />

      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20"
        >
          <Heart className="h-14 w-14 text-white/10 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/50 mb-1">No posts yet</h3>
          <p className="text-white/25 text-sm">
            Be the first to share your story with the SickleConnect community!
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                >
                  <PostCard post={post} onDelete={deletePost} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {hasMore && (
            <div className="text-center py-6">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
                className="gap-2 bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]"
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsFeed;
