import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptTestResult {
    promptId: mongoose.Types.ObjectId;
    uses: number;
    avgRating: number;
    conversions: number;
}

export interface IPromptTest extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    userId?: mongoose.Types.ObjectId;

    // Prompts being tested
    promptIds: mongoose.Types.ObjectId[];
    results: IPromptTestResult[];

    // Test status
    status: 'active' | 'completed' | 'paused';
    startedAt: Date;
    completedAt?: Date;

    // Winner
    winnerId?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const PromptTestResultSchema = new Schema<IPromptTestResult>(
    {
        promptId: {
            type: Schema.Types.ObjectId,
            ref: 'Prompt',
            required: true,
        },
        uses: {
            type: Number,
            default: 0,
        },
        avgRating: {
            type: Number,
            default: 0,
        },
        conversions: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const PromptTestSchema = new Schema<IPromptTest>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        promptIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Prompt',
        }],
        results: {
            type: [PromptTestResultSchema],
            default: [],
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'paused'],
            default: 'active',
            index: true,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        winnerId: {
            type: Schema.Types.ObjectId,
            ref: 'Prompt',
        },
    },
    {
        timestamps: true,
    }
);

const PromptTest = mongoose.models.PromptTest || mongoose.model<IPromptTest>('PromptTest', PromptTestSchema);

export default PromptTest;

