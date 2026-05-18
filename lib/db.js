import mongoose from "mongoose";
import { configureDns } from "@/lib/configureDns";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set. Add it to .env.local.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  configureDns();

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export async function getDatabaseStatus() {
  try {
    const conn = await connectDb();
    return {
      ok: true,
      name: conn.connection?.name || "MongoDB",
      host: conn.connection?.host || "connected",
      storage: "mongodb"
    };
  } catch (error) {
    return {
      ok: false,
      name: "Local fallback",
      host: "MongoDB unavailable",
      storage: "local",
      message: error?.message || "Unable to connect to MongoDB"
    };
  }
}
