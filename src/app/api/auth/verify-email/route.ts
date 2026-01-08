import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'ვერიფიკაციის ტოკენი აუცილებელია' },
                { status: 400 }
            );
        }

        // Find user with this verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        }).select('+emailVerificationToken +emailVerificationExpires');

        if (!user) {
            return NextResponse.json(
                { error: 'ვერიფიკაციის ტოკენი არასწორია ან ვადაგასულია' },
                { status: 400 }
            );
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Now issue JWT token
        const jwtToken = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Return user data
        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            role: user.role,
            badge: user.badge,
            createdAt: user.createdAt.toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: 'ელ-ფოსტა წარმატებით დადასტურდა!',
            user: userData,
            token: jwtToken,
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'ვერიფიკაცია ვერ მოხერხდა' },
            { status: 500 }
        );
    }
}
