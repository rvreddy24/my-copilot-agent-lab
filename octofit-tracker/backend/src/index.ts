import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Activity } from './models/Activity';
import { LeaderboardEntry } from './models/LeaderboardEntry';
import { Team } from './models/Team';
import { Workout } from './models/Workout';
import { User } from './models/User';

const app = express();
const PORT = Number(process.env.PORT ?? 8000);
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/octofit_db';
const CODESPACE_NAME = process.env.CODESPACE_NAME;
const API_BASE_URL = CODESPACE_NAME
  ? `https://${CODESPACE_NAME}-8000.githubpreview.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

const usersRouter = express.Router();
usersRouter.get('/', async (_req: Request, res: Response) => {
  const users = await User.find().lean();
  res.json({ users, apiUrl: API_BASE_URL });
});
usersRouter.post('/', async (req: Request, res: Response) => {
  const created = await User.create(req.body);
  res.status(201).json({ message: 'Create user', user: created });
});

const teamsRouter = express.Router();
teamsRouter.get('/', async (_req: Request, res: Response) => {
  const teams = await Team.find().populate('members').lean();
  res.json({ teams });
});
teamsRouter.post('/', async (req: Request, res: Response) => {
  const created = await Team.create(req.body);
  res.status(201).json({ message: 'Create team', team: created });
});

const activitiesRouter = express.Router();
activitiesRouter.get('/', async (_req: Request, res: Response) => {
  const activities = await Activity.find().populate('userId teamId').lean();
  res.json({ activities });
});
activitiesRouter.post('/', async (req: Request, res: Response) => {
  const created = await Activity.create(req.body);
  res.status(201).json({ message: 'Log activity', activity: created });
});

const leaderboardRouter = express.Router();
leaderboardRouter.get('/', async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find().sort({ rank: 1 }).lean();
  res.json({ leaderboard });
});

const workoutsRouter = express.Router();
workoutsRouter.get('/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find().populate('userId').lean();
  res.json({ workouts });
});
workoutsRouter.post('/', async (req: Request, res: Response) => {
  const created = await Workout.create(req.body);
  res.status(201).json({ message: 'Create workout', workout: created });
});

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    backend: 'OctoFit Tracker',
    port: PORT,
    mongo: MONGO_URI,
    apiBaseUrl: API_BASE_URL,
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB on', MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Backend server listening on ${API_BASE_URL}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
