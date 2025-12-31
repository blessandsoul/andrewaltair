import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    content: string;
    duration: number; // in seconds (target: 120 for 2-min lessons)
    xpReward: number;
    category: 'prompt' | 'tool' | 'concept' | 'workflow';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    completedBy: mongoose.Types.ObjectId[];
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        duration: {
            type: Number,
            default: 120, // 2 minutes
        },
        xpReward: {
            type: Number,
            default: 25,
        },
        category: {
            type: String,
            enum: ['prompt', 'tool', 'concept', 'workflow'],
            default: 'concept',
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        completedBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

LessonSchema.index({ isActive: 1, order: 1 });

const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
