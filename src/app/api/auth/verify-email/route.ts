export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { token } = await request.json();

        if (!token) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'ვერიფიკაციის ტოკენი აუცილებელია', 400);
        }

        // Find user with this verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        }).select('+emailVerificationToken +emailVerificationExpires');

        if (!user) {
            return apiError(ERROR_CODES.AUTH_TOKEN_INVALID, 'ვერიფიკაციის ტოკენი არასწორია ან ვადაგასულია', 400);
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

        return apiSuccess({ user: userData, token: jwtToken }, 'ელ-ფოსტა წარმატებით დადასტურდა!');
    } catch (error) {
        console.error('Email verification error:', error);
        return apiError(ERROR_CODES.INTERNAL_ERROR, 'ვერიფიკაცია ვერ მოხერხდა', 500);
    }
}

