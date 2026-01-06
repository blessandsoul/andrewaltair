import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    _id: mongoose.Types.ObjectId;
    key: string;
    value: Record<string, unknown>;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
    {
        key: {
            type: String,
            required: [true, 'Key is required'],
            unique: true,
        },
        value: {
            type: Schema.Types.Mixed,
            default: {},
        },
        category: {
            type: String,
            default: 'general',
        },
    },
    {
        timestamps: true,
    }
);

SettingsSchema.index({ category: 1 });

const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
