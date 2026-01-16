export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session'; // Import Session model
import { sendWelcomeEmail } from '@/lib/email';
import { trackSignup } from '@/lib/activityTracker';
import crypto from 'crypto'; // Import crypto

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    try {
        // Note: CSRF protection removed for register endpoint
        // Registration is a public endpoint for unauthenticated users,
        // CSRF attacks target authenticated user sessions

        await dbConnect();

        const { username, email, password, fullName } = await request.json();

        // Validate required fields
        if (!username || !email || !password || !fullName) {
            return NextResponse.json(
                { error: 'ყველა ველის შევსება სავალდებულოა' },
                { status: 400 }
            );
        }

        // 🛡️ Input Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'არასწორი ელფოსტის ფორმატი' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო' }, { status: 400 });
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ error: 'მომხმარებლის სახელი უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს, ციფრებს და _' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: 'ეს ელფოსტა უკვე რეგისტრირებულია' },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: 'ეს მომხმარებლის სახელი უკვე დაკავებულია' },
                { status: 400 }
            );
        }

        // Create new user (Auto-Verified)
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: 'viewer',
            isEmailVerified: true, // ✅ Immediately verified
            // No verification token needed
        });

        await user.save();

        // 🎯 TRACK SIGNUP ACTIVITY
        trackSignup(fullName, user._id.toString()).catch(() => { })

        // Send welcome email (just welcome, no verification link)
        // Passing empty string or null for verificationUrl if the function supports it,
        // otherwise we might need to adjust sendWelcomeEmail or just send a generic welcome.
        // Assuming sendWelcomeEmail might expect a URL, we'll pass the home URL.
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
        sendWelcomeEmail(fullName, email, appUrl).catch(err => console.error('Welcome email error:', err))

        // ✅ AUTO LOGIN LOGIC

        // Generate JWT token
        const { signToken } = await import('@/lib/jwt-config');
        const token = signToken({
            userId: user._id,
            role: user.role,
            sessionId: crypto.randomBytes(16).toString('hex')
        });

        // Create session record
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

        const response = NextResponse.json({
            success: true,
            message: 'რეგისტრაცია წარმატებულია!',
            user: userData,
            requiresVerification: false,
        });

        // ✅ Set httpOnly cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}


