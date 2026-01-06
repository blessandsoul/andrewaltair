import { describe, it, expect } from 'vitest'
import {
    parsePostContent,
    extractHashtags,
    extractTitle,
    extractExcerpt,
    calculateReadingTime,
} from '@/lib/PostContentParser'

describe('PostContentParser', () => {
    describe('parsePostContent', () => {
        it('should return empty array for empty content', () => {
            expect(parsePostContent('')).toEqual([])
            expect(parsePostContent('   ')).toEqual([])
        })

        it('should parse intro content', () => {
            const content = 'This is an introduction paragraph.'
            const result = parsePostContent(content)

            expect(result).toHaveLength(1)
            expect(result[0].type).toBe('intro')
            expect(result[0].content).toBe('This is an introduction paragraph.')
        })

        it('should parse emoji-prefixed sections', () => {
            const content = `Introduction here.

🔥 **Hot Topic:** This is a hot section.`

            const result = parsePostContent(content)

            expect(result.length).toBeGreaterThanOrEqual(2)
            const hotSection = result.find(s => s.content.includes('hot section'))
            expect(hotSection).toBeDefined()
            expect(hotSection?.icon).toBe('Flame')
        })

        it('should parse hashtag lines', () => {
            const content = `Some content here.

#AI #Technology #Future`

            const result = parsePostContent(content)
            const hashtagSection = result.find(s => s.type === 'hashtags')

            expect(hashtagSection).toBeDefined()
            expect(hashtagSection?.content).toContain('#AI')
        })

        it('should clean ** markers from content', () => {
            const content = '**Bold text** here'
            const result = parsePostContent(content)

            expect(result[0].content).toBe('Bold text here')
        })

        it('should parse warning sections with 🔴 emoji', () => {
            const content = '🔴 This is a warning!'
            const result = parsePostContent(content)

            expect(result[0].type).toBe('warning')
            expect(result[0].icon).toBe('AlertTriangle')
        })

        it('should parse tip sections with 🟢 emoji', () => {
            const content = '🟢 This is a helpful tip.'
            const result = parsePostContent(content)

            expect(result[0].type).toBe('tip')
            expect(result[0].icon).toBe('Lightbulb')
        })
    })

    describe('extractHashtags', () => {
        it('should extract hashtags from content', () => {
            const content = 'Check out #AI and #MachineLearning topics.'
            const hashtags = extractHashtags(content)

            expect(hashtags).toContain('#AI')
            expect(hashtags).toContain('#MachineLearning')
        })

        it('should return empty array when no hashtags', () => {
            expect(extractHashtags('No hashtags here')).toEqual([])
        })

        it('should return unique hashtags only', () => {
            const content = '#AI #AI #ML #AI'
            const hashtags = extractHashtags(content)

            expect(hashtags).toEqual(['#AI', '#ML'])
        })

        it('should handle Georgian hashtags', () => {
            const content = '#ტექნოლოგია #AI'
            const hashtags = extractHashtags(content)

            expect(hashtags).toHaveLength(2)
            expect(hashtags).toContain('#ტექნოლოგია')
        })
    })

    describe('extractTitle', () => {
        it('should extract title from first line', () => {
            const content = 'This is the title\nThis is the body.'
            expect(extractTitle(content)).toBe('This is the title')
        })

        it('should remove trailing emoji from title', () => {
            const content = 'Amazing Title 🚀\nBody content here.'
            expect(extractTitle(content)).toBe('Amazing Title')
        })

        it('should handle single line content', () => {
            expect(extractTitle('Just a title')).toBe('Just a title')
        })
    })

    describe('extractExcerpt', () => {
        it('should extract excerpt from content', () => {
            const content = `Title Here

This is the excerpt paragraph that should be extracted.

🔥 Some other section.`

            const excerpt = extractExcerpt(content)
            expect(excerpt).toBe('This is the excerpt paragraph that should be extracted.')
        })

        it('should respect maxLength parameter', () => {
            const content = `Title

This is a very long paragraph that exceeds the maximum length limit we set.`

            const excerpt = extractExcerpt(content, 20)
            expect(excerpt.length).toBeLessThanOrEqual(23) // 20 + '...'
            expect(excerpt).toContain('...')
        })

        it('should skip emoji-prefixed lines', () => {
            const content = `Title
🔥 Emoji line
Regular content here.`

            const excerpt = extractExcerpt(content)
            expect(excerpt).toBe('Regular content here.')
        })

        it('should return empty string for content with only title', () => {
            expect(extractExcerpt('Just a title')).toBe('')
        })
    })

    describe('calculateReadingTime', () => {
        it('should return at least 1 minute', () => {
            expect(calculateReadingTime('Short')).toBe(1)
        })

        it('should calculate based on 200 words per minute', () => {
            // 400 words should be 2 minutes
            const words400 = Array(400).fill('word').join(' ')
            expect(calculateReadingTime(words400)).toBe(2)
        })

        it('should round up reading time', () => {
            // 250 words should be 2 minutes (rounded up from 1.25)
            const words250 = Array(250).fill('word').join(' ')
            expect(calculateReadingTime(words250)).toBe(2)
        })
    })
})
