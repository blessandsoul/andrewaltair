export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';
import { z } from 'zod';
import User from '@/models/User';

const profileUpdateSchema = z.object({
    fullName: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    bio: z.string().optional(),
    newsletterSubscribed: z.boolean().optional(),
    // Add other fields as needed
});

export async function PUT(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parseResult = profileUpdateSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parseResult.error.flatten() },
                { status: 400 }
            );
        }

        const data = parseResult.data;

        // Check for username/email uniqueness if changing
        if (data.username && data.username !== user.username) {
            const exists = await User.findOne({ username: data.username, _id: { $ne: user._id } });
            if (exists) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
            user.username = data.username;
        }

        if (data.email && data.email !== user.email) {
            const exists = await User.findOne({ email: data.email, _id: { $ne: user._id } });
            if (exists) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
            user.email = data.email;
        }

        if (data.fullName) user.fullName = data.fullName;
        if (data.bio !== undefined) user.bio = data.bio;
        if (data.newsletterSubscribed !== undefined) {
            user.newsletterSubscribed = data.newsletterSubscribed;
            if (data.newsletterSubscribed) user.newsletterSubscribedAt = new Date();
        }

        await user.save();

        // Return sanitized user object
        const userData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            newsletterSubscribed: user.newsletterSubscribed
        };

        return NextResponse.json({ success: true, user: userData });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

