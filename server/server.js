import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'ChatWave API is running 🌊' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌊 Server running on port ${PORT}`);
});
