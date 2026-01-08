import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Session from '@/models/Session';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
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
            const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

            await dbConnect();

            // 🛡️ Invalidate the session
            await Session.updateOne(
                { token, userId: decoded.userId },
                { isActive: false }
            );

            return NextResponse.json({
                success: true,
                message: 'წარმატებით გახვედით სისტემიდან'
            });
        } catch {
            return NextResponse.json(
                { error: 'არასწორი ტოკენი' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}
