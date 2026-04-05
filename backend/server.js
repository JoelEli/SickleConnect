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

// Store connected clientsb
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

// MongoDB connection with fallback to local MongoDB on DNS/ENOTFOUND errors
const envMongoUri = process.env.MONGODB_URI;
const localMongoUri = 'mongodb://localhost:27017/sickleconnect';

async function startServer() {
  const tryUri = envMongoUri || localMongoUri;

  try {
    await mongoose.connect(tryUri);
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      const wsUrl = 'wss://sickleconnect.onrender.com/ws';
      console.log(`🔌 WebSocket server enabled on ${wsUrl}`);
    });
    return;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error && error.message ? error.message : error);

    // If we attempted an environment URI and it failed due to DNS / SRV lookup, try local fallback
    const isDnsError = envMongoUri && (/ENOTFOUND/.test(error && error.message) || /querySrv/.test(error && error.message));

    if (isDnsError) {
      console.warn('⚠️  Environment MongoDB URI failed DNS lookup. Falling back to local MongoDB at', localMongoUri);
      try {
        await mongoose.connect(localMongoUri);
        console.log('✅ Connected to local MongoDB');
        server.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
          const wsUrl = 'wss://sickleconnect.onrender.com/ws';
          console.log(`🔌 WebSocket server enabled on ${wsUrl}`);
        });
        return;
      } catch (err2) {
        console.error('❌ Local MongoDB connection error:', err2);

        // Last-resort: start an in-memory MongoDB for development (no install required)
        console.warn('⚠️  Attempting to start an in-memory MongoDB for development (mongodb-memory-server)');
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          const memUri = mongod.getUri();
          await mongoose.connect(memUri);
          console.log('✅ Connected to in-memory MongoDB');
          server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            const wsUrl = 'wss://sickleconnect.onrender.com/ws';
            console.log(`🔌 WebSocket server enabled on ${wsUrl}`);
          });
          return;
        } catch (memErr) {
          console.error('❌ In-memory MongoDB error:', memErr);
          process.exit(1);
        }
      }
    }

    // For other errors, exit so the operator can fix connection details
    process.exit(1);
  }
}

startServer();

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
