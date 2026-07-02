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
    tags?: string[];
    likedBy?: { personaId: string; name: string }[]; // AI personas who liked this video
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
            default: '',
            trim: true,
        },
        youtubeId: {
            type: String,
            required: [true, 'YouTube ID is required'],
            trim: true,
            index: true,
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
        tags: {
            type: [String],
            default: [],
        },
        likedBy: {
            type: [{ _id: false, personaId: String, name: String }],
            default: [],
        },
        authorName: {
            type: String,
            default: 'Andrew Altair',
        },
        authorAvatar: {
            type: String,
            default: '/andrewaltair.png',
        },
    },
    {
        timestamps: true,
    }
);

// Query indexes for home sort + analytics (see audit Q042)
VideoSchema.index({ publishedAt: -1 });
VideoSchema.index({ views: -1 });

const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;

