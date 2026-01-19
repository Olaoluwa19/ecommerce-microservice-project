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
    const rawPassword = process.env.MONGODB_PASSWORD;

    if (!rawPassword) {
      throw new Error(
        "Missing required environment variable: MONGODB_PASSWORD"
      );
    }
    const encodedPassword = encodeURIComponent(rawPassword);

    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodedPassword}@cluster0.s8ilwab.mongodb.net/product_service_db?retryWrites=true&w=majority&authSource=admin&appName=Cluster0`;
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
