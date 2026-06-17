import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  score: number;
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  score: { type: Number, default: 0 },
});

export const Team: Model<ITeam> = mongoose.model<ITeam>('Team', teamSchema);
