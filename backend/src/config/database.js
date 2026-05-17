import mongoose from "mongoose";

let hasTriedConnection = false;

export async function connectToDatabase(connectionString = process.env.MONGODB_URI) {
  if (!connectionString) {
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (hasTriedConnection && mongoose.connection.readyState === 2) {
    return mongoose.connection;
  }

  hasTriedConnection = true;
  await mongoose.connect(connectionString);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
