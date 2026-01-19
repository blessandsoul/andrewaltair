import { headers, cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function getUserFromRequest(req: Request) {
    const authHeader = req.headers.get('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        return await verifyToken(token);
    }

    // Fallback to checking cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth_token')?.value;

    if (cookieToken) {
        return await verifyToken(cookieToken);
    }

    return null;
}

// Helper to verify token and return user
async function verifyToken(token: string) {


    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string; role: string };

        await dbConnect();

        // Verify session exists and is active
        const session = await Session.findOne({
            token,
            userId: decoded.userId,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return null;
        }

        // Update session activity
        await Session.findByIdAndUpdate(session._id, {
            lastActivity: new Date()
        });

        const user = await User.findById(decoded.userId);

        if (user?.isBlocked) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}

// Helper for Server Components
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return null;
    }

    return await verifyToken(token);
}
