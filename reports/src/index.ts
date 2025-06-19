import "express-async-errors";
import dotenv from "dotenv";
import app from "./start/app";
import { connectToDatabase } from "./data/initDatabase";

dotenv.config();

const start = async () => {
  try {
    await connectToDatabase();

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`>>> [REPORTS SERVICE] Listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error(">>> [REPORTS SERVICE] Failed to start the service:", error);
    process.exit(1);
  }
};

start();
