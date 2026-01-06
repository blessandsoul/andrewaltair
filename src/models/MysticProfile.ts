import mongoose, { Schema, Document } from 'mongoose';

export type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface IMysticProfile extends Document {
    _id: mongoose.Types.ObjectId;
    sessionId: string; // For anonymous users
    userId?: mongoose.Types.ObjectId; // For logged-in users
    fullName?: string;
    birthDate?: Date;
    zodiacSign?: ZodiacSign;
    preferredLanguage: 'ka' | 'en' | 'ru';
    emailSubscribed: boolean;
    email?: string;
    notificationsEnabled: boolean;
    isPremium: boolean;
    premiumUntil?: Date;
    subscriptionType?: 'monthly' | 'yearly';
    createdAt: Date;
    updatedAt: Date;
}

const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

const MysticProfileSchema = new Schema<IMysticProfile>(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            sparse: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        birthDate: {
            type: Date,
        },
        zodiacSign: {
            type: String,
            enum: ZODIAC_SIGNS,
        },
        preferredLanguage: {
            type: String,
            enum: ['ka', 'en', 'ru'],
            default: 'ka',
        },
        emailSubscribed: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        notificationsEnabled: {
            type: Boolean,
            default: true,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        premiumUntil: {
            type: Date,
        },
        subscriptionType: {
            type: String,
            enum: ['monthly', 'yearly'],
        },
    },
    {
        timestamps: true,
    }
);

// Auto-calculate zodiac sign from birth date
MysticProfileSchema.pre('save', function () {
    if (this.isModified('birthDate') && this.birthDate && !this.zodiacSign) {
        const month = this.birthDate.getMonth() + 1;
        const day = this.birthDate.getDate();

        const signs: { sign: ZodiacSign; start: [number, number]; end: [number, number] }[] = [
            { sign: 'capricorn', start: [12, 22], end: [1, 19] },
            { sign: 'aquarius', start: [1, 20], end: [2, 18] },
            { sign: 'pisces', start: [2, 19], end: [3, 20] },
            { sign: 'aries', start: [3, 21], end: [4, 19] },
            { sign: 'taurus', start: [4, 20], end: [5, 20] },
            { sign: 'gemini', start: [5, 21], end: [6, 20] },
            { sign: 'cancer', start: [6, 21], end: [7, 22] },
            { sign: 'leo', start: [7, 23], end: [8, 22] },
            { sign: 'virgo', start: [8, 23], end: [9, 22] },
            { sign: 'libra', start: [9, 23], end: [10, 22] },
            { sign: 'scorpio', start: [10, 23], end: [11, 21] },
            { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
        ];

        for (const { sign, start, end } of signs) {
            if (sign === 'capricorn') {
                if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
                    this.zodiacSign = sign;
                    return;
                }
            } else if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
                this.zodiacSign = sign;
                return;
            }
        }
    }
});

const MysticProfile = mongoose.models.MysticProfile || mongoose.model<IMysticProfile>('MysticProfile', MysticProfileSchema);

export default MysticProfile;
