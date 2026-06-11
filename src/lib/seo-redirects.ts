/**
 * Dynamic 301 helpers for [slug] pages.
 *
 * lookupRedirect(): reads the `Redirect` collection (admin CRUD existed, but
 * nothing ever consumed it) — now the channel for migration-generated renames
 * (timestamp-slug + leading-hyphen reslugs write old→new pairs here).
 * Checked only on the not-found path, so the happy path costs nothing.
 *
 * legacySlugById(): GSC drilldown 2026-06-12 shows old ObjectId URLs indexed
 * (`/prompts/<id>` = 9 of 15 official soft-404s, plus `/blog/<id>` dupes) —
 * resolves them to the canonical slug for a permanentRedirect.
 *
 * Both swallow errors: a redirect lookup must never break a page render.
 */
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Redirect from '@/models/Redirect';

export async function lookupRedirect(from: string): Promise<string | null> {
    try {
        await dbConnect();
        const doc = await Redirect.findOneAndUpdate(
            { from },
            { $inc: { hits: 1 } },
            { projection: { to: 1 } }
        ).lean();
        return (doc as { to?: string } | null)?.to ?? null;
    } catch {
        return null;
    }
}

const LEGACY_COLLECTIONS = {
    post: 'posts',
    prompt: 'marketplaceprompts',
} as const;

export async function legacySlugById(model: keyof typeof LEGACY_COLLECTIONS, id: string): Promise<string | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    try {
        await dbConnect();
        const doc = await mongoose.connection.db
            ?.collection(LEGACY_COLLECTIONS[model])
            .findOne(
                { _id: new mongoose.Types.ObjectId(id), status: 'published' },
                { projection: { slug: 1 } }
            );
        return (doc as { slug?: string } | null)?.slug ?? null;
    } catch {
        return null;
    }
}
