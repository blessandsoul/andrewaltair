export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: Get user's bookings
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const bookings = await Booking.find({ userId })
            .sort({ date: -1 })
            .limit(10);

        return apiSuccess({ bookings }, 'Bookings fetched successfully');
    } catch (error) {
        console.error('Bookings Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Failed to get bookings', 500);
    }
}

// POST: Create a booking
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const { expertId, expertName, date, time, notes } = await req.json();

        if (!expertId || !expertName || !date || !time) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Missing required fields', 400);
        }

        // Check for existing booking at same time
        const existing = await Booking.findOne({
            expertId,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existing) {
            return apiError(ERROR_CODES.BAD_REQUEST, 'Time slot already booked', 400);
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

        return apiSuccess({ booking }, 'Booking created successfully', 201);
    } catch (error) {
        console.error('Create Booking Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Failed to create booking', 500);
    }
}

