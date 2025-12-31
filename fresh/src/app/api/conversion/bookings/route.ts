import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';

// GET: Get user's bookings
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookings = await Booking.find({ userId })
            .sort({ date: -1 })
            .limit(10);

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Bookings Error:', error);
        return NextResponse.json({ error: 'Failed to get bookings' }, { status: 500 });
    }
}

// POST: Create a booking
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expertId, expertName, date, time, notes } = await req.json();

        if (!expertId || !expertName || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check for existing booking at same time
        const existing = await Booking.findOne({
            expertId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existing) {
            return NextResponse.json({ error: 'Time slot already booked' }, { status: 400 });
        }

        const booking = await Booking.create({
            userId,
            expertId,
            expertName,
            date: new Date(date),
            time,
            notes,
            status: 'pending',
        });

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking created successfully'
        });
    } catch (error) {
        console.error('Create Booking Error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
