import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents multiple connections being established.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with caching for serverless environments
 */
export default async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "arshivLegal", // optional but good for clarity
        maxPoolSize: 10, // 🚀 performance boost under load
        serverSelectionTimeoutMS: 5000, // avoid hanging connections
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }

  console.log("✅ MongoDB Connected:", cached.conn.connection.host);
  return cached.conn;
}
