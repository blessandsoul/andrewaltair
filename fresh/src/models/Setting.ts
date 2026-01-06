import mongoose, { Schema, Document } from 'mongoose'

export interface ISetting extends Document {
    key: string
    value: string
    description?: string
    updatedAt: Date
}

const SettingSchema = new Schema<ISetting>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        value: {
            type: String,
            required: true,
        },
        description: String,
    },
    {
        timestamps: true,
    }
)

// Helper to get a setting by key
SettingSchema.statics.getValue = async function (key: string, defaultValue: string = ''): Promise<string> {
    const setting = await this.findOne({ key })
    return setting?.value || defaultValue
}

// Helper to set a value
SettingSchema.statics.setValue = async function (key: string, value: string, description?: string): Promise<ISetting> {
    return this.findOneAndUpdate(
        { key },
        { value, description },
        { upsert: true, new: true }
    )
}

const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)

export default Setting
