import mongoose, { Schema, Document } from 'mongoose';

export interface IChallenge extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    xpReward: number;
    type: 'daily' | 'weekly' | 'special';
    startsAt: Date;
    endsAt: Date;
    participants: {
        userId: mongoose.Types.ObjectId;
        joinedAt: Date;
        completedAt?: Date;
    }[];
    maxParticipants?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        xpReward: {
            type: Number,
            required: true,
            min: 1,
        },
        type: {
            type: String,
            enum: ['daily', 'weekly', 'special'],
            default: 'daily',
        },
        startsAt: {
            type: Date,
            default: Date.now,
        },
        endsAt: {
            type: Date,
            required: true,
        },
        participants: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            joinedAt: { type: Date, default: Date.now },
            completedAt: { type: Date },
        }],
        maxParticipants: Number,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

ChallengeSchema.index({ isActive: 1, endsAt: 1 });

const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
export default Challenge;
