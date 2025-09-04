import React, { useCallback } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useSickleConnectWebSocket, useWebSocketMessageHandler } from '@/shared/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WEBSOCKET_EVENTS } from '@/lib/constants';

const PostsFeed = () => {
  const { 
    posts, 
    loading, 
    refetch, 
    likePost, 
    deletePost,
    updatePostLike, 
    updatePostCommentCount, 
    addNewPost,
    removePost
  } = usePosts();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize WebSocket connection for real-time updates
  const { isConnected } = useSickleConnectWebSocket(user?._id);

  // Handle real-time events
  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case WEBSOCKET_EVENTS.NEW_POST:
        // Add new post to the beginning of the feed
        addNewPost(message.data.post);
        toast({
          title: "New Post",
          description: `${message.data.authorName} shared a new post`,
        });
        break;
      case WEBSOCKET_EVENTS.POST_LIKED:
        // Update like count in real-time
        const { postId, likesCount, isLiked } = message.data;
        updatePostLike(postId, likesCount, isLiked);
        break;
      case WEBSOCKET_EVENTS.NEW_COMMENT:
        // Update comment count in real-time
        const { postId: commentPostId } = message.data;
        updatePostCommentCount(commentPostId);
        break;
      case WEBSOCKET_EVENTS.POST_DELETED:
        // Remove deleted post from feed
        const { postId: deletedPostId } = message.data;
        removePost(deletedPostId);
        toast({
          title: "Post Deleted",
          description: `A post was deleted by ${message.data.deletedBy}`,
        });
        break;
    }
  }, [addNewPost, updatePostLike, updatePostCommentCount, removePost, toast]);

  // Register message handler
  useWebSocketMessageHandler(handleWebSocketMessage);

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading community posts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* WebSocket Status Indicator */}
      {!isConnected && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          ⚠️ Real-time updates are currently offline. Posts will update when you refresh the page.
        </div>
      )}
      
      <CreatePost />
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your story with the SickleConnect community!
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={deletePost} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsFeed;