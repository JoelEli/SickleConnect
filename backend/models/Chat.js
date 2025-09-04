import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 1000 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    content: String,
    timestamp: Date,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Index for efficient querying
chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });
chatSchema.index({ createdAt: 1 });

// Update the updatedAt field before saving
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find or create a chat between two users
chatSchema.statics.findOrCreateChat = async function(user1Id, user2Id) {
  // Try to find existing chat
  let chat = await this.findOne({
    participants: { $all: [user1Id, user2Id] }
  }).populate('participants', 'fullName role genotype avatarUrl')
    .populate('messages.senderId', 'fullName role genotype avatarUrl')
    .populate('lastMessage.senderId', 'fullName role genotype avatarUrl');

  // If no chat exists, create a new one
  if (!chat) {
    chat = new this({
      participants: [user1Id, user2Id],
      messages: []
    });
    await chat.save();
    
    // Populate the new chat
    chat = await this.findById(chat._id)
      .populate('participants', 'fullName role genotype avatarUrl')
      .populate('messages.senderId', 'fullName role genotype avatarUrl')
      .populate('lastMessage.senderId', 'fullName role genotype avatarUrl');
  }

  return chat;
};

// Method to add a message to the chat
chatSchema.methods.addMessage = async function(senderId, content) {
  const message = {
    senderId,
    content,
    timestamp: new Date()
  };

  this.messages.push(message);
  this.lastMessage = {
    content,
    timestamp: message.timestamp,
    senderId
  };

  await this.save();
  return this.populate('messages.senderId', 'fullName role genotype avatarUrl');
};

// Method to get recent messages (last 50)
chatSchema.methods.getRecentMessages = function() {
  return this.messages
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50)
    .reverse();
};

export default mongoose.model('Chat', chatSchema);
