import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js'; // ✅ Make sure model exists

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// ✅ User ↔ socket mapping
const usersMap = new Map(); // email => socket.id

// ✅ Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('register', (email) => {
    const normalizedEmail = email.toLowerCase();
    usersMap.set(normalizedEmail, socket.id);
    console.log(`📍 Registered: ${normalizedEmail} → ${socket.id}`);
  });

  socket.on('send-message', async ({ sender, receiver, text }) => {
    const normalizedReceiver = receiver.toLowerCase();
    const receiverSocket = usersMap.get(normalizedReceiver);

    console.log(`💬 Message from ${sender} → ${receiver}`);
    console.log('📡 Receiver socket ID:', receiverSocket);

    if (receiverSocket) {
      io.to(receiverSocket).emit('receive-message', {
        sender,
        receiver,
        text,
        timestamp: new Date()
      });
      console.log(`✅ Emitted to ${receiver}`);
    } else {
      console.log(`❌ Receiver ${receiver} not connected`);
    }
  });

  socket.on('disconnect', () => {
    for (const [email, id] of usersMap.entries()) {
      if (id === socket.id) {
        usersMap.delete(email);
        console.log(`❌ Disconnected: ${email}`);
        break;
      }
    }
  });
});


// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { dbName: 'secureChat' })
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(5000, () => {
      console.log('🚀 Server running at http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
  });
