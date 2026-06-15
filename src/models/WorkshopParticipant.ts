import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkshopParticipant extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    name: string;
    clientId: string;
    team?: number; // 1..teamCount — assigned at first join when teamMode is on
    joinedAt: Date;
    lastSeenAt: Date;
}

const WorkshopParticipantSchema = new Schema<IWorkshopParticipant>(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'WorkshopRoom',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 24,
        },
        clientId: {
            type: String,
            required: true,
        },
        team: {
            type: Number,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
        lastSeenAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

WorkshopParticipantSchema.index({ roomId: 1, clientId: 1 }, { unique: true });

export default mongoose.models.WorkshopParticipant ||
    mongoose.model<IWorkshopParticipant>('WorkshopParticipant', WorkshopParticipantSchema);
