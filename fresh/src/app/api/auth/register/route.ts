import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: Request) {
    try {
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

        // Create new user
        const user = new User({
            username,
            email,
            password,
            fullName,
            role: 'viewer', // Default role for new users
        });

        await user.save();

        // Send welcome email (non-blocking)
        sendWelcomeEmail(fullName, email).catch(err => console.error('Welcome email error:', err))

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET!,
            { expiresIn: '7d' }
        );

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
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'სერვერის შეცდომა' },
            { status: 500 }
        );
    }
}
