import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptFormData {
    role: string;
    customRole?: string;
    tone?: string;
    context?: string;
    customContext?: string;
    task: string;
    outputFormat?: string;
    constraints?: string;
}

export interface IPromptTranslations {
    en?: string;
    ge?: string;
    ru?: string;
}

export interface IPromptVersion {
    content: string;
    formData: IPromptFormData;
    createdAt: Date;
    changeNote?: string;
}

export interface IPrompt extends Document {
    _id: mongoose.Types.ObjectId;
    content: string;
    formData: IPromptFormData;
    userId?: mongoose.Types.ObjectId;
    sessionId?: string; // For anonymous users

    // Version history
    versions: IPromptVersion[];

    // Features
    isFavorite: boolean;
    isTemplate: boolean;
    isPublic: boolean;

    // Template/Gallery data
    title?: string;
    description?: string;
    category?: string;
    tags: string[];
    icon?: string;

    // Share
    shareToken?: string;

    // AI Analysis
    qualityScore?: number;
    qualityFeedback?: string;
    tokenCount: number;
    translations?: IPromptTranslations;
    variations?: string[];

    // Analytics
    views: number;
    uses: number;
    copies: number;
    likes: number;

    // Test results
    lastTestResponse?: string;
    lastTestedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const PromptFormDataSchema = new Schema<IPromptFormData>(
    {
        role: { type: String, required: true },
        customRole: { type: String },
        tone: { type: String },
        context: { type: String },
        customContext: { type: String },
        task: { type: String, required: true },
        outputFormat: { type: String },
        constraints: { type: String },
    },
    { _id: false }
);

const PromptTranslationsSchema = new Schema<IPromptTranslations>(
    {
        en: { type: String },
        ge: { type: String },
        ru: { type: String },
    },
    { _id: false }
);

const PromptSchema = new Schema<IPrompt>(
    {
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        formData: {
            type: PromptFormDataSchema,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        sessionId: {
            type: String,
            index: true,
        },

        // Version history
        versions: [{
            content: { type: String, required: true },
            formData: { type: PromptFormDataSchema },
            createdAt: { type: Date, default: Date.now },
            changeNote: { type: String }
        }],

        // Features
        isFavorite: {
            type: Boolean,
            default: false,
            index: true,
        },
        isTemplate: {
            type: Boolean,
            default: false,
            index: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
            index: true,
        },

        // Template/Gallery data
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        icon: {
            type: String,
        },

        // Share
        shareToken: {
            type: String,
            unique: true,
            sparse: true,
        },

        // AI Analysis
        qualityScore: {
            type: Number,
            min: 1,
            max: 10,
        },
        qualityFeedback: {
            type: String,
        },
        tokenCount: {
            type: Number,
            default: 0,
        },
        translations: {
            type: PromptTranslationsSchema,
        },
        variations: {
            type: [String],
            default: [],
        },

        // Analytics
        views: {
            type: Number,
            default: 0,
        },
        uses: {
            type: Number,
            default: 0,
        },
        copies: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },

        // Test results
        lastTestResponse: {
            type: String,
        },
        lastTestedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
PromptSchema.index({ content: 'text', title: 'text', description: 'text' });
PromptSchema.index({ createdAt: -1 });
PromptSchema.index({ likes: -1 });
PromptSchema.index({ uses: -1 });

const Prompt = mongoose.models.Prompt || mongoose.model<IPrompt>('Prompt', PromptSchema);

export default Prompt;

