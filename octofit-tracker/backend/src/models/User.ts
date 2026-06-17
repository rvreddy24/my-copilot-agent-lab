import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin';
  joinedAt: Date;
  teamId?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['athlete', 'coach', 'admin'], default: 'athlete' },
  joinedAt: { type: Date, default: () => new Date() },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
