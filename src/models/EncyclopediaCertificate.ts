import mongoose, { Schema, Document } from 'mongoose';

export interface IEncyclopediaCertificate extends Document {
    _id: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId;
    sectionTitle: string;
    userId?: string;
    userName: string;
    userEmail?: string;
    completedAt: Date;
    certificateId: string;
    articlesCompleted: number;
    totalArticles: number;
    createdAt: Date;
}

const EncyclopediaCertificateSchema = new Schema<IEncyclopediaCertificate>(
    {
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'EncyclopediaSection',
            required: true,
            index: true,
        },
        sectionTitle: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            index: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
        certificateId: {
            type: String,
            unique: true,
            required: true,
        },
        articlesCompleted: {
            type: Number,
            required: true,
        },
        totalArticles: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

EncyclopediaCertificateSchema.index({ certificateId: 1 }, { unique: true });
EncyclopediaCertificateSchema.index({ userId: 1, sectionId: 1 });

const EncyclopediaCertificate = mongoose.models.EncyclopediaCertificate ||
    mongoose.model<IEncyclopediaCertificate>('EncyclopediaCertificate', EncyclopediaCertificateSchema);

export default EncyclopediaCertificate;
