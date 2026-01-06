import mongoose, { Schema, Document } from 'mongoose';

export interface IRedirect extends Document {
    _id: mongoose.Types.ObjectId;
    from: string;
    to: string;
    type: 301 | 302;
    hits: number;
    createdAt: Date;
    updatedAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
    {
        from: {
            type: String,
            required: [true, 'From path is required'],
        },
        to: {
            type: String,
            required: [true, 'To path is required'],
        },
        type: {
            type: Number,
            enum: [301, 302],
            default: 301,
        },
        hits: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

RedirectSchema.index({ from: 1 }, { unique: true });

const Redirect = mongoose.models.Redirect || mongoose.model<IRedirect>('Redirect', RedirectSchema);

export default Redirect;
