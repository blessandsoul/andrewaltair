import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestStep {
    id: string;
    title: string;
    description: string;
    xpReward: number;
}

export interface IQuest extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    steps: IQuestStep[];
    totalXp: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
    category: 'learning' | 'engagement' | 'social' | 'achievement';
    participants: {
        userId: mongoose.Types.ObjectId;
        completedSteps: string[];
        startedAt: Date;
        completedAt?: Date;
    }[];
    isActive: boolean;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const QuestStepSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpReward: { type: Number, default: 10 },
});

const QuestSchema = new Schema<IQuest>(
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
        steps: [QuestStepSchema],
        totalXp: {
            type: Number,
            default: 0,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard', 'legendary'],
            default: 'easy',
        },
        category: {
            type: String,
            enum: ['learning', 'engagement', 'social', 'achievement'],
            default: 'learning',
        },
        participants: [{
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            completedSteps: [String],
            startedAt: { type: Date, default: Date.now },
            completedAt: Date,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

QuestSchema.index({ isActive: 1 });
QuestSchema.index({ 'participants.userId': 1 });

const Quest = mongoose.models.Quest || mongoose.model<IQuest>('Quest', QuestSchema);

export default Quest;
