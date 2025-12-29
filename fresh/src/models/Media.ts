import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    url: string;
    type: 'image' | 'video';
    size: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    altText: string;
    caption: string;
    folder: string;
    usedIn: { id: string; title: string; type: string }[];
    uploadedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
        },
        type: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        size: {
            type: String,
            default: '0 KB',
        },
        sizeBytes: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        altText: {
            type: String,
            default: '',
        },
        caption: {
            type: String,
            default: '',
        },
        folder: {
            type: String,
            default: 'all',
        },
        usedIn: [{
            id: String,
            title: String,
            type: String,
        }],
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Text index for search
MediaSchema.index({ name: 'text', altText: 'text', caption: 'text' });
MediaSchema.index({ folder: 1 });

const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
