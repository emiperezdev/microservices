import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = model<INotification>('Notification', notificationSchema);
