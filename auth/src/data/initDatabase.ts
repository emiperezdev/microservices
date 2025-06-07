import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('>>> [AUTH SERVICE] MONGO_URI is not defined in the .env file');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[AUTH SERVICE] Successfully connected to MongoDB');
  } catch (error) {
    console.error('>>> [AUTH SERVICE] Failed to connect to MongoDB:', error);
    throw error;
  }
};
