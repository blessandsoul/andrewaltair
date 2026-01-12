import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
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
}

async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        // console.log('Using cached MongoDB connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Optimization for local development to avoid IPv6 delays
            family: 4,
            serverSelectionTimeoutMS: 5000,
        };

        console.log('Creating new MongoDB connection...');
        console.time('MongooseConnect');
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.timeEnd('MongooseConnect');
            console.log('MongoDB Connected successfully');
            return mongoose;
        });
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
