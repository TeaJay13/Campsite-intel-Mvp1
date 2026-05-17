import "dotenv/config";

import app from "./app.js";
import { connectToDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await connectToDatabase();
    if (process.env.MONGODB_URI) {
      console.log("Database connected.");
    } else {
      console.log("Database connection skipped (MONGODB_URI not set).");
    }
  } catch (error) {
    console.error("Database connection failed.", error.message);
  }

  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

startServer();
