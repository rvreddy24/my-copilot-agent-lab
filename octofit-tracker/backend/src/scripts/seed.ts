import mongoose from 'mongoose';
import { Activity } from '../models/Activity';
import { LeaderboardEntry } from '../models/LeaderboardEntry';
import { Team } from '../models/Team';
import { Workout } from '../models/Workout';
import { User } from '../models/User';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/octofit_db';

async function main() {
  console.log('Seed the octofit_db database with test data');

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB at', MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const teamAlpha = await Team.create({
    name: 'Alpha Runners',
    description: 'A fast-paced endurance team focused on daily running and cycling challenges.',
    members: [],
    score: 1320,
  });

  const teamPulse = await Team.create({
    name: 'Pulse Crushers',
    description: 'High intensity interval training crew for athletes who love strength and speed.',
    members: [],
    score: 1185,
  });

  const users = await User.create([
    {
      name: 'Amara Johnson',
      email: 'amara.johnson@example.com',
      role: 'athlete',
      joinedAt: new Date('2026-03-14T08:15:00Z'),
      teamId: teamAlpha._id,
    },
    {
      name: 'Ravi Patel',
      email: 'ravi.patel@example.com',
      role: 'athlete',
      joinedAt: new Date('2026-04-02T09:30:00Z'),
      teamId: teamAlpha._id,
    },
    {
      name: 'Mina Lee',
      email: 'mina.lee@example.com',
      role: 'coach',
      joinedAt: new Date('2026-02-26T10:45:00Z'),
      teamId: teamPulse._id,
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      role: 'admin',
      joinedAt: new Date('2026-01-20T12:00:00Z'),
    },
  ]);

  teamAlpha.members = [users[0]._id, users[1]._id];
  teamPulse.members = [users[2]._id];
  await teamAlpha.save();
  await teamPulse.save();

  const activities = await Activity.create([
    {
      userId: users[0]._id,
      teamId: teamAlpha._id,
      type: 'Outdoor Run',
      durationMinutes: 42,
      distanceKm: 9.4,
      caloriesBurned: 650,
      occurredAt: new Date('2026-06-16T07:10:00Z'),
    },
    {
      userId: users[1]._id,
      teamId: teamAlpha._id,
      type: 'Spin Session',
      durationMinutes: 55,
      distanceKm: 20.2,
      caloriesBurned: 820,
      occurredAt: new Date('2026-06-15T18:40:00Z'),
    },
    {
      userId: users[2]._id,
      teamId: teamPulse._id,
      type: 'Circuit Training',
      durationMinutes: 38,
      caloriesBurned: 540,
      occurredAt: new Date('2026-06-16T06:30:00Z'),
    },
  ]);

  const workouts = await Workout.create([
    {
      userId: users[0]._id,
      title: 'Progressive Interval Run',
      description: 'Build speed with alternating fast and recovery intervals over 45 minutes.',
      durationMinutes: 45,
      intensity: 'high',
      exercises: ['Warm-up jog', '5x 3 min fast / 2 min recovery', 'Cool-down stretch'],
      scheduledAt: new Date('2026-06-17T06:00:00Z'),
    },
    {
      userId: users[2]._id,
      title: 'Strength and Mobility Flow',
      description: 'A strength-focused routine for core, legs, and shoulder stability.',
      durationMinutes: 40,
      intensity: 'medium',
      exercises: ['Goblet squats', 'Push-ups', 'Plank holds', 'Hip bridges'],
      scheduledAt: new Date('2026-06-18T17:30:00Z'),
    },
  ]);

  const leaderboardEntries = await LeaderboardEntry.create([
    {
      rank: 1,
      entityType: 'team',
      entityId: teamAlpha._id,
      score: 1320,
      metric: 'weekly points',
    },
    {
      rank: 2,
      entityType: 'team',
      entityId: teamPulse._id,
      score: 1185,
      metric: 'weekly points',
    },
    {
      rank: 1,
      entityType: 'user',
      entityId: users[0]._id,
      score: 430,
      metric: 'activity score',
    },
  ]);

  console.log('Seed data created:');
  console.log(' Users:', users.length);
  console.log(' Teams:', 2);
  console.log(' Activities:', activities.length);
  console.log(' Workouts:', workouts.length);
  console.log(' Leaderboard entries:', leaderboardEntries.length);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});
