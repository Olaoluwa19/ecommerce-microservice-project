import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = "mongodb://host.docker.internal:27017/product_service_db";
    if (!uri) {
      throw new Error("MONGODB_URI is not set");
    }

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10, // Good for Lambda
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      .then((mongoose) => {
        console.log("New MongoDB connection created");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null; // Reset on failure
    throw e;
  }
}
