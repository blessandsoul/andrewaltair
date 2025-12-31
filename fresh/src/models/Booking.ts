import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    expertId: string;
    expertName: string;
    date: Date;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expertId: {
            type: String,
            required: true,
        },
        expertName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: String,
    },
    { timestamps: true }
);

BookingSchema.index({ userId: 1, date: 1 });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
