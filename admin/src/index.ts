import 'express-async-errors';
import dotenv from 'dotenv';
import app from './start/app';
import { connectToDatabase } from './data/initDatabase';

dotenv.config();

const start = async () => {
  try {
    await connectToDatabase();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`>>> [ADMIN SERVICE] Listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error('>>> [ADMIN SERVICE] Failed to start the service:', error);
    process.exit(1);
  }
};

start();
