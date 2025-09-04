import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.js';
import postRoutes, { setWebSocketClients } from './routes/posts.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 5000;

// Store connected clients
const clients = new Map();

// Pass WebSocket clients reference to posts routes
setWebSocketClients(clients);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
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
    'http://localhost:8080',
    'http://localhost:8081', 
    'http://localhost:8082',
    'https://sickle-connect.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sickleconnect';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 WebSocket server enabled on ws://localhost:${PORT}/ws`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
