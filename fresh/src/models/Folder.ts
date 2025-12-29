import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    color: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        color: {
            type: String,
            default: 'blue',
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Folder = mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);

export default Folder;
