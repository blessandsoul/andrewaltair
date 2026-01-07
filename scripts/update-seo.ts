#!/usr/bin/env node

/**
 * SEO Content Update Script
 * 
 * This script updates SEO-related files based on current content.
 * Run daily via cron job or manually.
 * 
 * Usage:
 *   npx tsx scripts/update-seo.ts
 *   npm run seo:update
 * 
 * Environment:
 *   - MONGODB_URI: MongoDB connection string
 *   - NEXT_PUBLIC_BASE_URL: Site base URL (default: https://andrewaltair.ge)
 *   - CRON_SECRET: Secret for API authentication
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://andrewaltair.ge'
const CRON_SECRET = process.env.CRON_SECRET || 'your-cron-secret-key'

async function updateSEO() {
    console.log('🔄 Starting SEO Content Update...')
    console.log(`📅 Date: ${new Date().toISOString()}`)
    console.log(`🌐 Base URL: ${BASE_URL}`)

    try {
        // Call the API endpoint
        const response = await fetch(`${BASE_URL}/api/cron/seo-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CRON_SECRET}`
            }
        })

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${await response.text()}`)
        }

        const result = await response.json()

        console.log('\n✅ SEO Update Complete!')
        console.log('📊 Statistics:')
        console.log(`   - Total Posts: ${result.statistics?.total_posts || 'N/A'}`)
        console.log(`   - Library Articles: ${result.statistics?.library_articles || 'N/A'}`)
        console.log(`   - New Posts (24h): ${result.statistics?.new_posts_last_24h || 0}`)
        console.log(`   - URLs Submitted to IndexNow: ${result.statistics?.urls_submitted_to_indexnow || 0}`)

        if (result.indexnow) {
            console.log('\n🔔 IndexNow Results:')
            console.log(`   ${JSON.stringify(result.indexnow, null, 2)}`)
        }

        console.log('\n✨ Done!')
        return result
    } catch (error) {
        console.error('\n❌ SEO Update Failed:', error)
        throw error
    }
}

// Alternative: Direct database update (for local/Docker environments)
async function updateSEODirect() {
    console.log('🔄 Starting Direct SEO Content Update...')

    // This would be used for Docker/VPS environments where you can
    // directly access the database and filesystem

    // Dynamic imports for Node.js environment
    const mongoose = await import('mongoose')
    const fs = await import('fs/promises')
    const path = await import('path')

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is required')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get post count
    const Post = mongoose.connection.collection('posts')
    const totalPosts = await Post.countDocuments({ status: 'published' })

    // Get recent posts for IndexNow
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const newPosts = await Post.find({
        status: 'published',
        $or: [
            { createdAt: { $gte: yesterday } },
            { updatedAt: { $gte: yesterday } }
        ]
    }).project({ slug: 1 }).toArray()

    console.log(`📊 Total Published Posts: ${totalPosts}`)
    console.log(`📰 New Posts (24h): ${newPosts.length}`)

    // Update agents.json
    const agentsPath = path.join(process.cwd(), 'public', '.well-known', 'agents.json')
    try {
        const agentsContent = await fs.readFile(agentsPath, 'utf-8')
        const agents = JSON.parse(agentsContent)
        agents.last_updated = new Date().toISOString()
        agents.statistics = {
            total_blog_posts: totalPosts,
            last_updated: new Date().toISOString()
        }
        await fs.writeFile(agentsPath, JSON.stringify(agents, null, 2))
        console.log('✅ Updated agents.json')
    } catch (error) {
        console.error('⚠️ Could not update agents.json:', error)
    }

    // Submit to IndexNow if there are new posts
    if (newPosts.length > 0) {
        const urls = newPosts.map((post) => `${BASE_URL}/blog/${post.slug}`)
        console.log(`🔔 Submitting ${urls.length} URLs to IndexNow...`)

        try {
            const indexNowKey = process.env.INDEXNOW_KEY || 'indexnow-key-andrewaltair'
            const response = await fetch('https://api.indexnow.org/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    host: 'andrewaltair.ge',
                    key: indexNowKey,
                    urlList: urls
                })
            })
            console.log(`   IndexNow Response: ${response.status}`)
        } catch (error) {
            console.error('   IndexNow failed:', error)
        }
    }

    await mongoose.disconnect()
    console.log('\n✨ Direct SEO Update Complete!')
}

// Run based on environment
const args = process.argv.slice(2)
const useDirectMode = args.includes('--direct')

if (useDirectMode) {
    updateSEODirect().catch(console.error)
} else {
    updateSEO().catch(console.error)
}
