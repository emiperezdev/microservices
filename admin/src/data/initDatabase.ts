import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('>>> [ADMIN SERVICE] MONGO_URI is not defined in the .env file');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[ADMIN SERVICE] Successfully connected to MongoDB');
  } catch (error) {
    console.error('>>> [ADMIN SERVICE] Failed to connect to MongoDB:', error);
    throw error;
  }
};
