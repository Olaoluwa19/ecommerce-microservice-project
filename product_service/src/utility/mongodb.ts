// import mongoose from "mongoose";

// let conn: typeof mongoose | null = null;

// export const connectDB = async (): Promise<typeof mongoose> => {
//   if (conn != null) {
//     console.log("Using existing MongoDB connection");
//     return conn;
//   }

//   const uri = process.env.MONGODB_URI;
//   if (!uri) {
//     throw new Error("MONGODB_URI is not set in environment variables");
//   }

//   console.log("Creating new MongoDB connection...");
//   conn = await mongoose.connect(uri, {
//     bufferCommands: false,
//   });

//   return conn;
// };

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
    const uri = process.env.MONGODB_URI;
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
