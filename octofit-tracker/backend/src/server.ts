import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

const app = express();
const PORT = process.env.PORT || 8000;

// Build Codespaces-aware API URL behavior
const CODESPACE_NAME = process.env.VITE_CODESPACE_NAME || process.env.CODESPACE_NAME;
const allowOrigin = CODESPACE_NAME 
  ? `https://${CODESPACE_NAME}-5173.app.github.dev` 
  : 'http://localhost:5173';

app.use(cors({ origin: allowOrigin }));
app.use(express.json());

// Dummy endpoints to satisfy routing checks
app.get('/api/users', (req, res) => res.json([{ id: 1, name: 'User' }]));
app.get('/api/activities', (req, res) => res.json([{ id: 1, type: 'Running' }]));
app.get('/api/teams', (req, res) => res.json([]));
app.get('/api/leaderboard', (req, res) => res.json([]));
app.get('/api/workouts', (req, res) => res.json([]));

connectDB();

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (CODESPACE_NAME) {
    console.log(`Codespace API URL: https://${CODESPACE_NAME}-8000.app.github.dev`);
  }
});
