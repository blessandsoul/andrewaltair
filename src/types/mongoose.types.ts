import type { FlattenMaps, Types } from 'mongoose';

/**
 * Helper type for Mongoose documents returned from `.lean()`.
 * Provides a plain object type with required `_id`.
 */
export type LeanDoc<T> = FlattenMaps<T> & { _id: Types.ObjectId };
