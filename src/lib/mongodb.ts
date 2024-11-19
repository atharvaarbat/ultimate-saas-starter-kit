// lib/mongodb.ts
import mongoose, { Connection } from 'mongoose';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

interface ConnectionConfig {
  isConnected?: number;
}

const config: ConnectionConfig = {};

export async function connectToDatabase() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    try {
      cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongoose) => {
        console.log('New MongoDB connection established');
        return mongoose.connection;
      });
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  // Handle connection events
  cached.conn.on('connected', () => {
    console.log('MongoDB connected successfully');
    config.isConnected = 1;
  });

  cached.conn.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    if (config.isConnected) {
      config.isConnected = 0;
    }
  });

  cached.conn.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    config.isConnected = 0;
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    await cached.conn?.close();
    process.exit(0);
  });

  return cached.conn;
}

// Utility function to check connection status
export function isConnected(): boolean {
  return config.isConnected === 1;
}

// Utility function to close connection (useful for testing)
export async function closeConnection(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
    config.isConnected = 0;
  }
}