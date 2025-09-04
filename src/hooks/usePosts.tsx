import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@/lib/api';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    role: 'patient' | 'doctor';
    genotype?: string;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const data = await apiClient.posts.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      await apiClient.posts.create({ content, imageUrl });
      fetchPosts(); // Refresh posts
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const updatedPost = await apiClient.posts.like(postId);
      
      // Update the post in the local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: updatedPost.likes_count, is_liked: updatedPost.is_liked }
            : post
        )
      );
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Function to update post like status from WebSocket
  const updatePostLike = useCallback((postId: string, likesCount: number, isLiked: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: likesCount, is_liked: isLiked }
          : post
      )
    );
  }, []);

  // Function to update post comment count from WebSocket
  const updatePostCommentCount = useCallback((postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      )
    );
  }, []);

  // Function to add new post from WebSocket
  const addNewPost = useCallback((newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    likePost,
    updatePostLike,
    updatePostCommentCount,
    addNewPost,
    refetch: fetchPosts
  };
}