export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import crypto from 'crypto';
import User from '@/models/User';
import Session from '@/models/Session';

// 🛡️ SECURITY: Require JWT_SECRET - no fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

// 🛡️ Rate limiting for brute-force protection
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; lockoutRemaining?: number } {
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts) {
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            const timeSinceLast = now - attempts.lastAttempt;
            if (timeSinceLast < LOCKOUT_DURATION) {
                return {
                    allowed: false,
                    remainingAttempts: 0,
                    lockoutRemaining: Math.ceil((LOCKOUT_DURATION - timeSinceLast) / 1000)
                };
            }
            loginAttempts.delete(ip);
        }
    }
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - (attempts?.count || 0) };
}

function recordFailedAttempt(ip: string) {
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(ip, attempts);
}

function clearAttempts(ip: string) {
    loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
    // Note: CSRF protection removed for login endpoint
    // Login is a public endpoint for unauthenticated users,
    // CSRF attacks target authenticated user sessions

    // 🛡️ Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') || 'unknown';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
        return NextResponse.json({
            error: 'ძალიან ბევრი მცდელობა. გთხოვთ სცადოთ მოგვიანებით.',
            locked: true,
            lockoutRemaining: rateCheck.lockoutRemaining
        }, { status: 429 });
    }

    try {
        await dbConnect();

        const { email, password, username, twoFactorCode } = await request.json();

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

        // Email verification check - REMOVED
        /*
        if (!user.isEmailVerified) {
            return NextResponse.json({
                error: 'გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა',
                requiresVerification: true,
                email: user.email
            }, { status: 403 });
        }
        */

        // Verify password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            recordFailedAttempt(ip);
            return NextResponse.json(
                { error: 'არასწორი პაროლი' },
                { status: 401 }
            );
        }

        // 🛡️ 2FA CHECK: If user has 2FA enabled, require verification
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return NextResponse.json({
                    requires2FA: true,
                    message: 'გთხოვთ შეიყვანოთ 2FA კოდი',
                    userId: user._id.toString() // Temporary identifier for 2FA flow
                }, { status: 403 });
            }

            // Verify 2FA code
            const { verifyTOTP } = await import('@/lib/totp');
            const userWithSecret = await User.findById(user._id).select('+twoFactorSecret');

            if (!userWithSecret?.twoFactorSecret) {
                return NextResponse.json(
                    { error: '2FA კონფიგურაცია არასწორია' },
                    { status: 500 }
                );
            }

            const isValid = verifyTOTP(twoFactorCode, userWithSecret.twoFactorSecret);

            if (!isValid) {
                recordFailedAttempt(ip);
                return NextResponse.json(
                    { error: 'არასწორი 2FA კოდი' },
                    { status: 401 }
                );
            }
        }

        // Clear failed attempts on successful login
        clearAttempts(ip);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token using secure config
        const { signToken } = await import('@/lib/jwt-config');
        const token = signToken({
            userId: user._id,
            role: user.role,
            sessionId: crypto.randomBytes(16).toString('hex')
        });

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

        const response = NextResponse.json({
            success: true,
            user: userData
        });

        // ✅ Set httpOnly cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/'
        });

        return response;
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

