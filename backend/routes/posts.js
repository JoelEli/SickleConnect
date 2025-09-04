import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Global WebSocket clients reference (will be set by server.js)
let wsClients = new Map();

// Function to set WebSocket clients reference
export const setWebSocketClients = (clients) => {
  wsClients = clients;
};

// Function to broadcast to all connected clients
const broadcastToAll = (message) => {
  const messageStr = JSON.stringify(message);
  wsClients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(messageStr);
    }
  });
};

// Get all posts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const posts = await Post.find()
      .populate('userId', 'fullName role genotype avatarUrl')
      .populate('comments.userId', 'fullName role genotype avatarUrl')
      .sort({ createdAt: -1 });
    
    const formattedPosts = posts.map(post => {
      const isLiked = post.likes && post.likes.some(likeId => likeId.toString() === userId.toString());
      
      return {
        id: post._id,
        user_id: post.userId._id,
        content: post.content,
        image_url: post.imageUrl,
        likes_count: post.likesCount,
        comments_count: post.commentsCount,
        is_liked: isLiked,
        created_at: post.createdAt,
        profiles: {
          full_name: post.userId.fullName,
          role: post.userId.role,
          genotype: post.userId.genotype
        }
      };
    });
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts. Please try again.' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    
    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ message: 'Post content must be less than 1000 characters' });
    }
    
    const post = await Post.create({
      userId: req.user._id,
      content: content.trim(),
      imageUrl
    });
    
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'fullName role genotype avatarUrl');
    
    const formattedPost = {
      id: populatedPost._id,
      user_id: populatedPost.userId._id,
      content: populatedPost.content,
      image_url: populatedPost.imageUrl,
      likes_count: populatedPost.likesCount,
      comments_count: populatedPost.commentsCount,
      created_at: populatedPost.createdAt,
      profiles: {
        full_name: populatedPost.userId.fullName,
        role: populatedPost.userId.role,
        genotype: populatedPost.userId.genotype
      }
    };

    // Broadcast new post to all clients
    broadcastToAll({
      type: 'new_post',
      data: {
        post: formattedPost,
        authorName: req.user.fullName
      }
    });
    
    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post. Please try again.' });
  }
});

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const isLiked = post.likes && post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Like: add user to likes array
      if (!post.likes) post.likes = [];
      post.likes.push(userId);
      post.likesCount = post.likesCount + 1;
    }

    await post.save();

    // Get updated post with user info
    const updatedPost = await Post.findById(postId)
      .populate('userId', 'fullName role genotype avatarUrl');

    const formattedPost = {
      id: updatedPost._id,
      user_id: updatedPost.userId._id,
      content: updatedPost.content,
      image_url: updatedPost.imageUrl,
      likes_count: updatedPost.likesCount,
      comments_count: updatedPost.commentsCount,
      created_at: updatedPost.createdAt,
      is_liked: !isLiked, // Return the new like status
      profiles: {
        full_name: updatedPost.userId.fullName,
        role: updatedPost.userId.role,
        genotype: updatedPost.userId.genotype
      }
    };

    // Broadcast like event to all clients
    broadcastToAll({
      type: 'post_liked',
      data: {
        postId: postId,
        userId: userId,
        userName: req.user.fullName,
        likesCount: formattedPost.likes_count,
        isLiked: formattedPost.is_liked
      }
    });

    res.json(formattedPost);
  } catch (error) {
    console.error('Like/Unlike post error:', error);
    res.status(500).json({ message: 'Failed to update like. Please try again.' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('comments.userId', 'fullName role genotype avatarUrl');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = post.comments || [];
    const formattedComments = comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      created_at: comment.createdAt,
      user: {
        id: comment.userId._id,
        full_name: comment.userId.fullName,
        role: comment.userId.role,
        genotype: comment.userId.genotype
      }
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Failed to fetch comments. Please try again.' });
  }
});

// Add comment to post
router.post('/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Validate comment content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add comment
    const newComment = {
      userId: userId,
      content: content.trim(),
      createdAt: new Date()
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount = post.commentsCount + 1;

    await post.save();

    // Get updated post with user info
    const updatedPost = await Post.findById(postId)
      .populate('userId', 'fullName role genotype avatarUrl')
      .populate('comments.userId', 'fullName role genotype avatarUrl');

    const latestComment = updatedPost.comments[updatedPost.comments.length - 1];

    const formattedComment = {
      id: latestComment._id,
      content: latestComment.content,
      created_at: latestComment.createdAt,
      user: {
        id: latestComment.userId._id,
        full_name: latestComment.userId.fullName,
        role: latestComment.userId.role,
        genotype: latestComment.userId.genotype
      }
    };

    // Broadcast comment event to all clients
    broadcastToAll({
      type: 'new_comment',
      data: {
        postId: postId,
        commentId: formattedComment.id,
        userId: userId,
        userName: req.user.fullName,
        content: formattedComment.content,
        createdAt: formattedComment.created_at
      }
    });

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment. Please try again.' });
  }
});

export default router;
