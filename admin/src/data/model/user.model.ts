import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      uppercase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', userSchema);
