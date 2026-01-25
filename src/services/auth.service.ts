import dbConnect from '@/lib/db';
import User from '@/models/User';
import Session from '@/models/Session';
import crypto from 'crypto';
import { signToken } from '@/lib/jwt-config';
import { sendWelcomeEmail } from '@/lib/email';
import { trackSignup } from '@/lib/activityTracker';
import { verifyTOTP } from '@/lib/totp';

// In-memory rate limiting (move to Redis in production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

export class AuthService {
    /**
     * Rate Limiting Helper
     */
    static checkRateLimit(ip: string) {
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

    static recordFailedAttempt(ip: string) {
        const now = Date.now();
        const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
        attempts.count++;
        attempts.lastAttempt = now;
        loginAttempts.set(ip, attempts);
    }

    static clearAttempts(ip: string) {
        loginAttempts.delete(ip);
    }

    /**
     * Register User
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async register(data: any, userAgent: string = '') {
        await dbConnect();

        const { username, email, password, fullName } = data;

        // Validation
        if (!username || !email || !password || !fullName) {
            throw new Error('ყველა ველის შევსება სავალდებულოა');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error('არასწორი ელფოსტის ფორმატი');
        if (password.length < 8) throw new Error('პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო');

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) throw new Error('მომხმარებლის სახელი უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს, ციფრებს და _');

        // Check duplicates
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) throw new Error('ეს ელფოსტა უკვე რეგისტრირებულია');
            throw new Error('ეს მომხმარებლის სახელი უკვე დაკავებულია');
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: 'viewer',
            isEmailVerified: true
        });

        await user.save();

        // Track & Email (Async)
        trackSignup(fullName, user._id.toString()).catch(() => { });
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
        sendWelcomeEmail(fullName, email, appUrl).catch(console.error);

        // Auto Login
        return this.createSession(user, userAgent);
    }

    /**
     * Login User
     */
    static async login(loginField: string, password: string, ip: string, userAgent: string = '', twoFactorCode?: string) {
        await dbConnect();

        if (!loginField || !password) throw new Error('ელფოსტა და პაროლი სავალდებულოა');

        const rateCheck = this.checkRateLimit(ip);
        if (!rateCheck.allowed) {
            throw new Error(`RateLimit:locked:${rateCheck.lockoutRemaining}`);
        }

        const user = await User.findOne({
            $or: [
                { email: loginField.toLowerCase() },
                { username: loginField.toLowerCase() }
            ]
        }).select('+password');

        if (!user) throw new Error('მომხმარებელი ვერ მოიძებნა');
        if (user.isBlocked) throw new Error('თქვენი ანგარიში დაბლოკილია');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            this.recordFailedAttempt(ip);
            throw new Error('არასწორი პაროლი');
        }

        // 2FA Check
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                // Special error to trigger 2FA UI
                throw new Error(`2FA_REQUIRED:${user._id.toString()}`);
            }

            const userWithSecret = await User.findById(user._id).select('+twoFactorSecret');
            const isValid = verifyTOTP(twoFactorCode, userWithSecret?.twoFactorSecret || '');

            if (!isValid) {
                this.recordFailedAttempt(ip);
                throw new Error('არასწორი 2FA კოდი');
            }
        }

        this.clearAttempts(ip);

        user.lastLogin = new Date();
        await user.save();

        return this.createSession(user, userAgent);
    }

    /**
     * Create Session Helper
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async createSession(user: any, userAgent: string) {
        const token = signToken({
            userId: user._id,
            role: user.role,
            sessionId: crypto.randomBytes(16).toString('hex')
        });

        await Session.create({
            userId: user._id,
            token,
            deviceInfo: {
                browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other',
                os: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Linux') ? 'Linux' : 'Other',
                device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return {
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                role: user.role,
                badge: user.badge,
                createdAt: user.createdAt.toISOString(),
            },
            token
        };
    }
}
