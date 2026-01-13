import mongoose, { Schema, Document, Model } from 'mongoose';

// Reusing interfaces from Post where applicable or defining similar ones
export interface ITutorialModule {
    title: string;
    quote: string;      // The "Source Material" or "Code Snippet"
    explanation: string; // The ELI5 explanation
}

export interface ITutorial extends Document {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;

    // Core Content
    intro: string;      // Analogy / Intro
    tools: string;      // "What you need" section
    modules: ITutorialModule[];
    conclusion: string; // Viral sign-off
    metaAdvice: string; // "Off-record" advice

    // Metadata
    tags: string[];
    themeColor?: string;
    character?: string; // e.g. "Wile E. Coyote"
    songTrack?: string;

    // Visuals
    coverImage?: string;       // Horizontal 16:9
    mobileCoverImage?: string; // Vertical 9:16

    // Standard fields
    author: {
        name: string;
        avatar?: string;
        role?: string;
    };
    status: 'draft' | 'published' | 'archived';
    views: number;
    likes: number; // Simple like counter for now

    createdAt: Date;
    updatedAt: Date;
}

const TutorialModuleSchema = new Schema<ITutorialModule>({
    title: { type: String, required: true },
    quote: { type: String, default: '' },
    explanation: { type: String, required: true }
}, { _id: false });

const TutorialSchema = new Schema<ITutorial>(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        title: { type: String, required: true },

        intro: { type: String, required: true },
        tools: { type: String, default: '' },
        modules: { type: [TutorialModuleSchema], default: [] },
        conclusion: { type: String, default: '' },
        metaAdvice: { type: String, default: '' },

        tags: { type: [String], default: [], index: true },
        themeColor: { type: String },
        character: { type: String },
        songTrack: { type: String },

        coverImage: { type: String },
        mobileCoverImage: { type: String },

        author: {
            name: { type: String, default: 'Andrew Altair' },
            avatar: { type: String },
            role: { type: String }
        },

        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
            index: true
        },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
);

// Indexes
TutorialSchema.index({ title: 'text', intro: 'text', names: 'text' });
TutorialSchema.index({ createdAt: -1 });

const Tutorial: Model<ITutorial> = mongoose.models.Tutorial || mongoose.model<ITutorial>('Tutorial', TutorialSchema);

export default Tutorial;
