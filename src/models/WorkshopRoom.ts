import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkshopRound {
    key: string;
    type: 'text' | 'choice' | 'choice_revote' | 'number' | 'quiz';
    prompt: string;
    options: { id: string; label: string }[];
    correctOptionId?: string;
    phase: 'closed' | 'open' | 'discuss' | 'revote' | 'revealed';
    phaseStartedAt?: Date;
    durationSec?: number;
    hostNotes?: string;
    pinnedResponseId?: string;
    config: {
        minNumber?: number;
        maxNumber?: number;
        fields?: string[];
    };
}

export interface IWorkshopRoom extends Document {
    _id: mongoose.Types.ObjectId;
    code: string;
    hostKey: string;
    title: string;
    templateId: string;
    status: 'lobby' | 'live' | 'ended';
    rounds: IWorkshopRound[];
    currentRoundIndex: number;
    createdAt: Date;
    updatedAt: Date;
}

const WorkshopRoundSchema = new Schema<IWorkshopRound>(
    {
        key: { type: String, required: true },
        type: {
            type: String,
            enum: ['text', 'choice', 'choice_revote', 'number', 'quiz'],
            required: true,
        },
        prompt: { type: String, required: true },
        options: [
            {
                id: { type: String, required: true },
                label: { type: String, required: true },
                _id: false,
            },
        ],
        correctOptionId: { type: String },
        phase: {
            type: String,
            enum: ['closed', 'open', 'discuss', 'revote', 'revealed'],
            default: 'closed',
        },
        phaseStartedAt: { type: Date },
        durationSec: { type: Number },
        hostNotes: { type: String },
        pinnedResponseId: { type: String },
        config: {
            minNumber: { type: Number },
            maxNumber: { type: Number },
            fields: [{ type: String }],
        },
    },
    { _id: false }
);

const WorkshopRoomSchema = new Schema<IWorkshopRoom>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            index: true,
            uppercase: true,
            trim: true,
        },
        hostKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        templateId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['lobby', 'live', 'ended'],
            default: 'lobby',
        },
        rounds: [WorkshopRoundSchema],
        currentRoundIndex: {
            type: Number,
            default: -1,
        },
    },
    { timestamps: true }
);

export default mongoose.models.WorkshopRoom ||
    mongoose.model<IWorkshopRoom>('WorkshopRoom', WorkshopRoomSchema);
