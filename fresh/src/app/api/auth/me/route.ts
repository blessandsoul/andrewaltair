import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'არ ხართ ავტორიზებული' },
                { status: 401 }
            );
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
                return NextResponse.json(
                    { error: 'სესია ვადაგასულია ან არ არსებობს' },
                    { status: 401 }
                );
            }

            // Update session activity
            await Session.findByIdAndUpdate(session._id, {
                lastActivity: new Date()
            });

            const user = await User.findById(decoded.userId);

            if (!user) {
                return NextResponse.json(
                    { error: 'მომხმარებელი ვერ მოიძებნა' },
                    { status: 404 }
                );
            }

            if (user.isBlocked) {
                return NextResponse.json(
                    { error: 'თქვენი ანგარიში დაბლოკილია' },
                    { status: 403 }
                );
            }

            const userData = {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                coverImage: user.coverImage,
                coverOffsetY: user.coverOffsetY,
                role: user.role,
                badge: user.badge,
                createdAt: user.createdAt.toISOString(),
            };

            return NextResponse.json({ user: userData });
        } catch {
            return NextResponse.json(
                { error: 'არასწორი ტოკენი' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}
