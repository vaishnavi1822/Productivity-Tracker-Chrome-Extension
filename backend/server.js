import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import trackingRoutes from './routes/tracking.js';
import reportRoutes from './routes/reports.js';
import analyticsRoutes from './routes/analytics.js';
import { handleTaskUpdate, handleFocusSessionUpdate } from './utils/websocketHandlers.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = Date.now();
  clients.set(ws, clientId);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Broadcast to all other clients
      clients.forEach((id, client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
        }
      });

      // Handle different message types
      switch (data.type) {
        case 'TASK_UPDATE':
          await handleTaskUpdate(data.payload);
          break;
        case 'FOCUS_SESSION_UPDATE':
          await handleFocusSessionUpdate(data.payload);
          break;
        // Add more cases as needed
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 