import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let wsClients = new Map();

export const setWebSocketClients = (clients) => {
  wsClients = clients;
};

const broadcastToAll = (message) => {
  const messageStr = JSON.stringify(message);
  wsClients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(messageStr);
    }
  });
};

// Get all posts (paginated)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate('userId', 'fullName role genotype avatarUrl')
        .populate('comments.userId', 'fullName role genotype avatarUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments()
    ]);

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

    res.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts. Please try again.' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

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
      is_liked: false,
      created_at: populatedPost.createdAt,
      profiles: {
        full_name: populatedPost.userId.fullName,
        role: populatedPost.userId.role,
        genotype: populatedPost.userId.genotype
      }
    };

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

    const isLiked = post.likes && post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      if (!post.likes) post.likes = [];
      post.likes.push(userId);
      post.likesCount = post.likesCount + 1;
    }

    await post.save();

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
      is_liked: !isLiked,
      profiles: {
        full_name: updatedPost.userId.fullName,
        role: updatedPost.userId.role,
        genotype: updatedPost.userId.genotype
      }
    };

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
router.get('/:postId/comments', authenticateToken, async (req, res) => {
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

    const newComment = {
      userId: userId,
      content: content.trim(),
      createdAt: new Date()
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount = post.commentsCount + 1;

    await post.save();

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

// Delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(postId);

    broadcastToAll({
      type: 'post_deleted',
      data: {
        postId: postId,
        deletedBy: req.user.fullName
      }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post. Please try again.' });
  }
});

export default router;
