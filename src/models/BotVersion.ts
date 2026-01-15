import mongoose, { Schema, Document } from 'mongoose';

export interface IBotVersion extends Document {
    botId: mongoose.Types.ObjectId;
    version: string;
    description: string;
    changelog: string[];
    masterPromptSnapshot: string;
    fileOutputs?: string[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const BotVersionSchema = new Schema<IBotVersion>(
    {
        botId: {
            type: Schema.Types.ObjectId,
            ref: 'Bot',
            required: true,
            index: true
        },
        version: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        changelog: [{
            type: String,
            trim: true
        }],
        masterPromptSnapshot: {
            type: String,
            required: true,
            select: false // Protected field
        },
        fileOutputs: [{
            type: String
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Unique compound index: One version per bot
BotVersionSchema.index({ botId: 1, version: 1 }, { unique: true });

const BotVersion = mongoose.models.BotVersion || mongoose.model<IBotVersion>('BotVersion', BotVersionSchema);

export default BotVersion;
