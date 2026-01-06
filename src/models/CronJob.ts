import mongoose, { Schema, Document } from 'mongoose';

export interface ICronJob extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    schedule: string;
    lastRun?: Date;
    status: 'active' | 'paused' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const CronJobSchema = new Schema<ICronJob>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        schedule: {
            type: String,
            required: [true, 'Schedule is required'],
        },
        lastRun: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'failed'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const CronJob = mongoose.models.CronJob || mongoose.model<ICronJob>('CronJob', CronJobSchema);

export default CronJob;
