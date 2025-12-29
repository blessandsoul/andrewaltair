import mongoose, { Schema, Document } from 'mongoose'

export interface IPostVersion extends Document {
    _id: mongoose.Types.ObjectId
    postId: mongoose.Types.ObjectId
    version: number
    title: string
    content: string
    excerpt?: string
    coverImage?: string
    category?: string
    tags?: string[]
    author: {
        id: mongoose.Types.ObjectId
        name: string
    }
    changedBy: {
        id: mongoose.Types.ObjectId
        name: string
    }
    changeReason?: string
    createdAt: Date
}

const PostVersionSchema = new Schema<IPostVersion>(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            index: true,
        },
        version: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        excerpt: String,
        coverImage: String,
        category: String,
        tags: [String],
        author: {
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            name: String,
        },
        changedBy: {
            id: { type: Schema.Types.ObjectId, ref: 'User' },
            name: String,
        },
        changeReason: String,
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
)

// Compound index for efficient queries
PostVersionSchema.index({ postId: 1, version: -1 })

const PostVersion = mongoose.models.PostVersion || mongoose.model<IPostVersion>('PostVersion', PostVersionSchema)

export default PostVersion
