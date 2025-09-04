import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.js';
import postRoutes, { setWebSocketClients } from './routes/posts.js';
import chatRoutes, { setWebSocketClients as setChatWebSocketClients } from './routes/chat.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5000;

// Store connected clients
const clients = new Map();

// Pass WebSocket clients reference to routes
setWebSocketClients(clients);
setChatWebSocketClients(clients);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'https://sickleconnect.onrender.com');
  const userId = url.searchParams.get('userId');
  
  console.log(`WebSocket client connected: ${userId || 'anonymous'}`);
  
  // Store client connection
  if (userId) {
    clients.set(userId, ws);
  }
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection_established',
    data: { message: 'Connected to SickleConnect WebSocket' }
  }));
  
  ws.on('close', () => {
    if (userId) {
      clients.delete(userId);
      console.log(`WebSocket client disconnected: ${userId}`);
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (userId) {
      clients.delete(userId);
    }
  });
});

// Middleware
app.use(cors({
  origin: [
    'https://sickle-connect.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sickleconnect';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Display production WebSocket URL
      const wsUrl = 'wss://sickleconnect.onrender.com/ws';
      
      console.log(`🔌 WebSocket server enabled on ${wsUrl}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Chat cleanup job - runs every hour to delete messages older than 24 hours
setInterval(async () => {
  try {
    const Chat = (await import('./models/Chat.js')).default;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const result = await Chat.updateMany(
      {},
      {
        $pull: {
          messages: {
            timestamp: { $lt: twentyFourHoursAgo }
          }
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Cleaned up old messages from ${result.modifiedCount} chats`);
    }
  } catch (error) {
    console.error('Chat cleanup error:', error);
  }
}, 60 * 60 * 1000); // Run every hour

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
