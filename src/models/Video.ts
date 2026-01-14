import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail?: string;
    category: string;
    publishedAt: Date;
    views: number;
    duration?: string;
    type: 'long' | 'short';
    authorName?: string;
    authorAvatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        youtubeId: {
            type: String,
            required: [true, 'YouTube ID is required'],
            trim: true,
        },
        thumbnail: {
            type: String,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            index: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
        },
        duration: {
            type: String,
        },
        type: {
            type: String,
            enum: ['long', 'short'],
            default: 'long',
        },
        authorName: {
            type: String,
            default: 'Andrew Altair',
        },
        authorAvatar: {
            type: String,
            default: '/images/avatar.jpg',
        },
    },
    {
        timestamps: true,
    }
);

const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;

