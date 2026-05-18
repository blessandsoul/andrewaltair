import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Detect Docker build-time placeholder to fail fast instead of hanging on connection timeout
const isBuildTimePlaceholder = !MONGODB_URI || MONGODB_URI.includes('placeholder');

if (!MONGODB_URI && !isBuildTimePlaceholder) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;

    // When the MongoDB server restarts the cached connection goes dead.
    // Drop the cache on disconnect so the next dbConnect() reconnects fresh
    // instead of handing out a stale connection that times out on every query.
    mongoose.connection.on('disconnected', () => {
        cached.conn = null;
        cached.promise = null;
    });
}

async function dbConnect(): Promise<typeof mongoose> {
    // During Docker build, MONGODB_URI is a placeholder — fail fast so pages return empty data
    if (isBuildTimePlaceholder) {
        throw new Error('MongoDB unavailable during build (placeholder URI)');
    }

    // readyState: 1 = connected. Only reuse the cache if the socket is actually alive.
    // Without this, a MongoDB restart leaves cached.conn truthy-but-dead → every query 500s.
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Stale (post-restart) or mid-connect failure — discard and force a fresh connect.
    if (mongoose.connection.readyState !== 1) {
        cached.conn = null;
        if (mongoose.connection.readyState === 0) {
            cached.promise = null;
        }
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Optimization for local development to avoid IPv6 delays
            family: 4,
            serverSelectionTimeoutMS: 5000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB Connection Error:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
