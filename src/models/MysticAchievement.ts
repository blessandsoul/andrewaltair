import mongoose, { Schema, Document } from 'mongoose';
import { BadgeId } from '@/lib/badges';

// Re-export for convenience
export type { BadgeId } from '@/lib/badges';
export { BADGE_DEFINITIONS } from '@/lib/badges';

export interface IBadge {
    id: BadgeId;
    earnedAt: Date;
}

export interface IMysticAchievement extends Document {
    _id: mongoose.Types.ObjectId;
    sessionId: string;
    userId?: mongoose.Types.ObjectId;
    badges: IBadge[];
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date;
    totalPredictions: number;
    predictionsByType: {
        fortune: number;
        love: number;
        dream: number;
        horoscope: number;
        tarot: number;
        numerology: number;
        moonphase: number;
        palmreading: number;
        chat: number;
    };
    zodiacsExplored: string[];
    totalShares: number;
    totalGiftsSent: number;
    createdAt: Date;
    updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
    id: {
        type: String,
        required: true,
    },
    earnedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const MysticAchievementSchema = new Schema<IMysticAchievement>(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            sparse: true,
        },
        badges: {
            type: [BadgeSchema],
            default: [],
        },
        currentStreak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        lastActiveDate: {
            type: Date,
            default: Date.now,
        },
        totalPredictions: {
            type: Number,
            default: 0,
        },
        predictionsByType: {
            fortune: { type: Number, default: 0 },
            love: { type: Number, default: 0 },
            dream: { type: Number, default: 0 },
            horoscope: { type: Number, default: 0 },
            tarot: { type: Number, default: 0 },
            numerology: { type: Number, default: 0 },
            moonphase: { type: Number, default: 0 },
            palmreading: { type: Number, default: 0 },
            chat: { type: Number, default: 0 },
        },
        zodiacsExplored: {
            type: [String],
            default: [],
        },
        totalShares: {
            type: Number,
            default: 0,
        },
        totalGiftsSent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for leaderboard queries
MysticAchievementSchema.index({ totalPredictions: -1 });
MysticAchievementSchema.index({ currentStreak: -1 });
MysticAchievementSchema.index({ longestStreak: -1 });

const MysticAchievement = mongoose.models.MysticAchievement || mongoose.model<IMysticAchievement>('MysticAchievement', MysticAchievementSchema);

export default MysticAchievement;
