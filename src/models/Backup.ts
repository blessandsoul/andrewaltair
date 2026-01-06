import mongoose, { Schema, Document } from 'mongoose';

export interface IBackup extends Document {
    _id: mongoose.Types.ObjectId;
    date: Date;
    size: string;
    sizeBytes: number;
    type: 'auto' | 'manual';
    status: 'success' | 'failed' | 'pending';
    createdAt: Date;
    updatedAt: Date;
}

const BackupSchema = new Schema<IBackup>(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        size: {
            type: String,
            default: '0 MB',
        },
        sizeBytes: {
            type: Number,
            default: 0,
        },
        type: {
            type: String,
            enum: ['auto', 'manual'],
            default: 'manual',
        },
        status: {
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Backup = mongoose.models.Backup || mongoose.model<IBackup>('Backup', BackupSchema);

export default Backup;
