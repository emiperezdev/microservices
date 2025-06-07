import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('>>>[DATABASE SERVICE] MongoDB connected successfully');
  } catch (error) {
    console.error('>>>[DATABASE SERVICE] Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

start();
