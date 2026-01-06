import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function getUserFromRequest(req: Request) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

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
