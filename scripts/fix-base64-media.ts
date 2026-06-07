#!/usr/bin/env node

/**
 * One-off migration: strip oversized base64 `data:` URIs out of User.avatar / User.coverImage.
 *
 * Root cause of the slow /admin/users (10MB payload): one user's avatar was stored as a
 * 10MB base64 data-URI inline in Mongo. This unsets every base64 avatar/coverImage so the
 * field falls back to initials in the UI; affected users re-upload (now stored as a file URL).
 *
 * Usage:
 *   cd andrewaltair.ge_project
 *   npx tsx scripts/fix-base64-media.ts
 *
 * Reads MONGODB_URI from .env.local (Next convention), falling back to .env.
 */

import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) dotenv.config() // fallback to .env

async function main(): Promise<void> {
    const uri = process.env.MONGODB_URI
    if (!uri) {
        console.error('❌ MONGODB_URI not set (.env.local / .env)')
        process.exit(1)
    }

    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 10000 })
    const users = mongoose.connection.collection('users')
    const comments = mongoose.connection.collection('comments')

    const base64 = { $regex: '^data:' }

    // Audit first
    const avatarBad = await users.countDocuments({ avatar: base64 })
    const coverBad = await users.countDocuments({ coverImage: base64 })
    const commentBad = await comments.countDocuments({ 'author.avatar': base64 })
    console.log(`Found base64 → users.avatar: ${avatarBad}, users.coverImage: ${coverBad}, comments.author.avatar: ${commentBad}`)

    if (process.env.DRY === '1') {
        console.log('🟡 DRY run — nothing changed. Re-run without DRY=1 to apply.')
        await mongoose.disconnect()
        return
    }

    const a = await users.updateMany({ avatar: base64 }, { $unset: { avatar: 1 } })
    const c = await users.updateMany({ coverImage: base64 }, { $unset: { coverImage: 1 } })
    const cm = await comments.updateMany({ 'author.avatar': base64 }, { $unset: { 'author.avatar': 1 } })
    console.log(`Cleared  → users.avatar: ${a.modifiedCount}, users.coverImage: ${c.modifiedCount}, comments.author.avatar: ${cm.modifiedCount}`)

    await mongoose.disconnect()
    console.log('✅ Done')
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
