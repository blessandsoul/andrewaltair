export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';

// GET: List active testimonials
export async function GET() {
    try {
        await dbConnect();

        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(10);

        return NextResponse.json({ testimonials });
    } catch (error) {
        console.error('Testimonials Error:', error);
        return NextResponse.json({ error: 'Failed to get testimonials' }, { status: 500 });
    }
}

