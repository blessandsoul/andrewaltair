import mongoose, { Schema, Document } from 'mongoose'

export interface ILinkGroup extends Document {
    _id: mongoose.Types.ObjectId
    name: string
    description?: string
    color: string
    createdAt: Date
    updatedAt: Date
}

const LinkGroupSchema = new Schema<ILinkGroup>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            default: '#6366f1',
        },
    },
    {
        timestamps: true,
    }
)

const LinkGroup = mongoose.models.LinkGroup || mongoose.model<ILinkGroup>('LinkGroup', LinkGroupSchema)

export default LinkGroup
