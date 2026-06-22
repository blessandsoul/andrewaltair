import mongoose, { Schema, Document } from 'mongoose';

// A workshop chat message or audience question. Mirrors WorkshopResponse but is
// INSERT-only (no per-client unique index), so a participant can post many.
// `status` is the single moderation lever: new (host-only) → live (on the
// projector) → done (answered question, kept in log) → hidden (moderated out).
export type WorkshopMessageKind = 'chat' | 'question';
export type WorkshopMessageStatus = 'new' | 'live' | 'done' | 'hidden';

export interface IWorkshopMessage extends Document {
    _id: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    clientId: string;
    name: string; // server-resolved from the participant (blank when anonymousNames)
    kind: WorkshopMessageKind;
    text: string;
    status: WorkshopMessageStatus;
    votes: number; // upvotes (questions) / likes (chat)
    voters: string[]; // clientIds who voted, to dedupe
    answer?: string; // host's on-screen answer to a question
    createdAt: Date;
}

const WorkshopMessageSchema = new Schema<IWorkshopMessage>(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'WorkshopRoom',
            required: true,
            index: true,
        },
        clientId: { type: String, required: true },
        name: { type: String, trim: true, maxlength: 24, default: '' },
        kind: { type: String, enum: ['chat', 'question'], required: true },
        text: { type: String, required: true, maxlength: 280 },
        status: {
            type: String,
            enum: ['new', 'live', 'done', 'hidden'],
            default: 'new',
        },
        votes: { type: Number, default: 0 },
        voters: { type: [String], default: [] },
        answer: { type: String, maxlength: 280 },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

WorkshopMessageSchema.index({ roomId: 1, createdAt: 1 });
WorkshopMessageSchema.index({ roomId: 1, kind: 1, status: 1 });
WorkshopMessageSchema.index({ roomId: 1, kind: 1, status: 1, votes: -1 });

export default mongoose.models.WorkshopMessage ||
    mongoose.model<IWorkshopMessage>('WorkshopMessage', WorkshopMessageSchema);
