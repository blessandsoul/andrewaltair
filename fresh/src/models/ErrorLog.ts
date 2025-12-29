import mongoose, { Schema, Document } from 'mongoose';

export interface IErrorLog extends Document {
    _id: mongoose.Types.ObjectId;
    level: 'error' | 'warning' | 'info';
    message: string;
    source: string;
    createdAt: Date;
}

const ErrorLogSchema = new Schema<IErrorLog>(
    {
        level: {
            type: String,
            enum: ['error', 'warning', 'info'],
            default: 'info',
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        source: {
            type: String,
            default: 'system',
        },
    },
    {
        timestamps: true,
    }
);

const ErrorLog = mongoose.models.ErrorLog || mongoose.model<IErrorLog>('ErrorLog', ErrorLogSchema);

export default ErrorLog;
