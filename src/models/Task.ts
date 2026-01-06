import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    completed: boolean;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        dueDate: {
            type: Date,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
