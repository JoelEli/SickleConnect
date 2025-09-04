import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Global WebSocket clients reference (will be set by server.js)
let wsClients = new Map();

// Function to set WebSocket clients reference
export const setWebSocketClients = (clients) => {
  wsClients = clients;
};

// Function to broadcast to specific users
const broadcastToUsers = (userIds, message) => {
  const messageStr = JSON.stringify(message);
  userIds.forEach(userId => {
    const client = wsClients.get(userId.toString());
    if (client && client.readyState === 1) { // WebSocket.OPEN
      client.send(messageStr);
    }
  });
};

// Get all chats for a user
router.get('/chats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'fullName role genotype avatarUrl')
    .populate('lastMessage.senderId', 'fullName role genotype avatarUrl')
    .sort({ 'lastMessage.timestamp': -1 });

    // Format chats for frontend
    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(p => p._id.toString() !== userId.toString());
      return {
        id: chat._id,
        otherUser: {
          id: otherParticipant._id,
          fullName: otherParticipant.fullName,
          role: otherParticipant.role,
          genotype: otherParticipant.genotype
        },
        lastMessage: chat.lastMessage ? {
          content: chat.lastMessage.content,
          timestamp: chat.lastMessage.timestamp,
          senderName: chat.lastMessage.senderId?.fullName
        } : null,
        unreadCount: chat.messages.filter(msg => 
          msg.senderId.toString() !== userId.toString() && !msg.read
        ).length,
        updatedAt: chat.updatedAt
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Failed to fetch chats. Please try again.' });
  }
});

// Get or create a chat between two users
router.get('/chat/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create chat
    const chat = await Chat.findOrCreateChat(currentUserId, otherUserId);

    // Get recent messages
    const recentMessages = chat.getRecentMessages();

    // Format messages for frontend
    const formattedMessages = recentMessages.map(msg => ({
      id: msg._id,
      content: msg.content,
      timestamp: msg.timestamp,
      sender: {
        id: msg.senderId._id,
        fullName: msg.senderId.fullName,
        role: msg.senderId.role,
        genotype: msg.senderId.genotype
      },
      isOwn: msg.senderId._id.toString() === currentUserId.toString()
    }));

    res.json({
      chatId: chat._id,
      otherUser: {
        id: otherUser._id,
        fullName: otherUser.fullName,
        role: otherUser.role,
        genotype: otherUser.genotype
      },
      messages: formattedMessages
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ message: 'Failed to fetch chat. Please try again.' });
  }
});

// Send a message
router.post('/chat/:chatId/message', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: 'Message must be less than 1000 characters' });
    }

    // Find chat
    const chat = await Chat.findById(chatId)
      .populate('participants', 'fullName role genotype avatarUrl');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(p => p._id.toString() === senderId.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant in this chat' });
    }

    // Add message
    await chat.addMessage(senderId, content.trim());

    // Get the latest message
    const latestMessage = chat.messages[chat.messages.length - 1];

    // Format message for response
    const formattedMessage = {
      id: latestMessage._id,
      content: latestMessage.content,
      timestamp: latestMessage.timestamp,
      sender: {
        id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
        genotype: req.user.genotype
      },
      isOwn: true
    };

    // Broadcast message to all participants
    const participantIds = chat.participants.map(p => p._id.toString());
    broadcastToUsers(participantIds, {
      type: 'new_message',
      data: {
        chatId: chatId,
        message: formattedMessage,
        senderName: req.user.fullName
      }
    });

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

// Mark messages as read
router.put('/chat/:chatId/read', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(p => p.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant in this chat' });
    }

    // Mark all messages from other participants as read
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== userId.toString()) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read. Please try again.' });
  }
});

// Get online users (for chat)
router.get('/users/online', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Get all users except current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('fullName role genotype avatarUrl')
      .sort({ fullName: 1 });

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      role: user.role,
      genotype: user.genotype,
      isOnline: wsClients.has(user._id.toString()) // Check if user is connected via WebSocket
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ message: 'Failed to fetch users. Please try again.' });
  }
});

export default router;
