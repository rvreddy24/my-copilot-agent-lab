import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  rank: number;
  entityType: 'team' | 'user';
  entityId: mongoose.Types.ObjectId;
  score: number;
  metric: string;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>({
  rank: { type: Number, required: true },
  entityType: { type: String, required: true, enum: ['team', 'user'] },
  entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityType' },
  score: { type: Number, required: true },
  metric: { type: String, required: true },
});

export const LeaderboardEntry: Model<ILeaderboardEntry> = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
