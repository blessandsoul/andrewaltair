import mongoose, { Schema, Document } from 'mongoose';

/**
 * A logged-in user's follow of the forum (scope:'forum') or a single persona
 * (scope:'persona' + personaId). Foundation for delivering "new debate" alerts.
 * (Per-user push/email delivery is a separate follow-up — there's no user-facing
 * notification center yet; publishing currently emits an admin announcement.)
 */
export interface IForumSubscription extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    scope: 'forum' | 'persona';
    personaId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const ForumSubscriptionSchema = new Schema<IForumSubscription>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        scope: { type: String, enum: ['forum', 'persona'], required: true },
        personaId: { type: String, default: null },
    },
    { timestamps: true }
);

ForumSubscriptionSchema.index({ userId: 1, scope: 1, personaId: 1 }, { unique: true });

const ForumSubscription =
    mongoose.models.ForumSubscription ||
    mongoose.model<IForumSubscription>('ForumSubscription', ForumSubscriptionSchema);

export default ForumSubscription;
