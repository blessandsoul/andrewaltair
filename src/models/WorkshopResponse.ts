import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkshopResponse extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    roundKey: string;
    phase: 'open' | 'revote' | 'discuss' | 'predict'; // discuss = Mazur "why"; predict = gamified outcome bet
    clientId: string;
    name: string;
    textValue?: string;
    optionId?: string;
    numberValue?: number;
    createdAt: Date;
}

const WorkshopResponseSchema = new Schema<IWorkshopResponse>(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'WorkshopRoom',
            required: true,
            index: true,
        },
        roundKey: {
            type: String,
            required: true,
        },
        phase: {
            type: String,
            enum: ['open', 'revote', 'discuss', 'predict'],
            default: 'open',
        },
        clientId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 24,
        },
        textValue: {
            type: String,
            maxlength: 2000,
        },
        optionId: {
            type: String,
        },
        numberValue: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

WorkshopResponseSchema.index({ roomId: 1, roundKey: 1, phase: 1 });
WorkshopResponseSchema.index(
    { roomId: 1, roundKey: 1, phase: 1, clientId: 1 },
    { unique: true }
);

export default mongoose.models.WorkshopResponse ||
    mongoose.model<IWorkshopResponse>('WorkshopResponse', WorkshopResponseSchema);
