import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import campRoutes from './routes/campRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

import User from './models/User.js';
import Chat from './models/Chat.js';
import { seedData } from './utils/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Socket.io Realtime Chat Handlers
io.on('connection', (socket) => {
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send_message', async (data) => {
    const { conversationId, sender, senderName, senderRole, recipient, recipientName, recipientRole, message } = data;
    try {
      const newMsg = await Chat.create({
        sender,
        senderName,
        senderRole,
        recipient,
        recipientName,
        recipientRole,
        message,
        conversationId,
      });
      io.to(conversationId).emit('receive_message', newMsg);
    } catch (err) {
      console.error('Socket message error:', err);
    }
  });

  socket.on('disconnect', () => {});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/bloodbanks', bloodBankRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/chats', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HealthTech API running smoothly', timestamp: new Date() });
});

// Serve frontend static build if available (e.g. Render single deployment)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & start server
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] Database is empty. Seeding realistic sample dataset now...');
      await seedData(false);
    }
  } catch (e) {
    console.error('Check user count / seed error:', e);
  }

  server.listen(PORT, () => {
    console.log(`[HealthTech Server] Running on port ${PORT}`);
  });
});
