import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import roomRoutes from './routes/room.routes.js';
import { initSocket } from './socket/socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://chatwave-kishore.vercel.app',
  ],
  credentials: true,
}));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ChatWave API is running 🌊' });
});

// Initialize Socket.io
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🌊 Server running on port ${PORT}`);
});