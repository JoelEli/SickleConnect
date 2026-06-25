import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ results: [] });
    }

    const escaped = escapeRegex(q.trim());
    const searchRegex = new RegExp(escaped, 'i');
    const results = [];

    if (type === 'all' || type === 'posts') {
      const posts = await Post.find({ content: searchRegex })
        .populate('userId', 'fullName role genotype avatarUrl')
        .sort({ createdAt: -1 })
        .limit(20);

      posts.forEach(post => {
        if (!post.userId) return;
        results.push({
          id: post._id,
          type: 'post',
          content: post.content,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          createdAt: post.createdAt,
          user: {
            fullName: post.userId.fullName,
            role: post.userId.role,
            genotype: post.userId.genotype,
          }
        });
      });
    }

    if (type === 'all' || type === 'users') {
      const users = await User.find({ fullName: searchRegex })
        .select('fullName role genotype bio avatarUrl')
        .limit(20);

      users.forEach(user => {
        results.push({
          id: user._id,
          type: 'user',
          fullName: user.fullName,
          role: user.role,
          genotype: user.genotype,
          bio: user.bio,
        });
      });
    }

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
});

export default router;
