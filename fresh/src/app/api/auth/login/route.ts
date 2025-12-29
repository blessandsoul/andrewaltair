import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { email, password, username } = await request.json();

        // Allow login with email or username
        const loginField = email || username;

        if (!loginField || !password) {
            return NextResponse.json(
                { error: 'ელფოსტა და პაროლი სავალდებულოა' },
                { status: 400 }
            );
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: loginField.toLowerCase() },
                { username: loginField.toLowerCase() }
            ]
        }).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'მომხმარებელი ვერ მოიძებნა' },
                { status: 401 }
            );
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return NextResponse.json(
                { error: 'თქვენი ანგარიში დაბლოკილია' },
                { status: 403 }
            );
        }

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { error: 'არასწორი პაროლი' },
                { status: 401 }
            );
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create session record for tracking
        const userAgent = request.headers.get('user-agent') || ''
        await Session.create({
            userId: user._id,
            token,
            deviceInfo: {
                browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other',
                os: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Linux') ? 'Linux' : 'Other',
                device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })

        // Return user data (without password)
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
            user: userData,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        // Return more details in development
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'სერვერის შეცდომა', details: errorMessage },
            { status: 500 }
        );
    }
}
