import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/email';
import { trackSignup } from '@/lib/activityTracker';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

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

        // 🛡️ Generate email verification token
        const crypto = await import('crypto');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user (NOT verified yet)
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: 'viewer',
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
        });

        await user.save();

        // 🎯 TRACK SIGNUP ACTIVITY
        trackSignup(fullName, user._id.toString()).catch(() => { })

        // Send verification email (non-blocking)
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge'}/verify-email?token=${verificationToken}`;
        sendWelcomeEmail(fullName, email, verificationUrl).catch(err => console.error('Verification email error:', err))

        // 🛡️ DO NOT issue JWT until email is verified
        return NextResponse.json({
            success: true,
            message: 'რეგისტრაცია წარმატებულია! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა ანგარიშის გასააქტიურებლად.',
            email: user.email,
            requiresVerification: true,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}
