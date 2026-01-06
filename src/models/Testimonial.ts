import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    company: string;
    avatar?: string;
    metric: string;
    improvement: string;
    testimonial: string;
    rating: number;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company is required'],
        },
        avatar: String,
        metric: {
            type: String,
            required: true,
        },
        improvement: {
            type: String,
            required: true,
        },
        testimonial: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
export default Testimonial;
