import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  exercises: string[];
  scheduledAt: Date;
}

const workoutSchema = new Schema<IWorkout>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  intensity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  exercises: [{ type: String, required: true }],
  scheduledAt: { type: Date, required: true },
});

export const Workout: Model<IWorkout> = mongoose.model<IWorkout>('Workout', workoutSchema);
