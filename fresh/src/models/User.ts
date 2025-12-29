import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    fullName: string;
    avatar?: string;
    role: 'god' | 'admin' | 'editor' | 'viewer';
    badge?: string;
    isBlocked: boolean;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    backupCodes?: string[];
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string): Promise<IUser>;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username must be less than 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password by default in queries
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        avatar: {
            type: String,
            default: undefined,
        },
        role: {
            type: String,
            enum: ['god', 'admin', 'editor', 'viewer'],
            default: 'viewer',
        },
        badge: {
            type: String,
            default: undefined,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        twoFactorSecret: {
            type: String,
            select: false, // Don't include by default
        },
        backupCodes: {
            type: [String],
            select: false, // Don't include by default
        },
        lastLogin: {
            type: Date,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function (
    email: string,
    password: string
): Promise<IUser> {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};

// Prevent model compilation error in development
const User: IUserModel = mongoose.models.User || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
