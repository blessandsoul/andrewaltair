import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names', () => {
            expect(cn('foo', 'bar')).toBe('foo bar')
        })

        it('should handle conditional classes', () => {
            expect(cn('base', true && 'active')).toBe('base active')
            expect(cn('base', false && 'hidden')).toBe('base')
        })

        it('should merge Tailwind classes correctly', () => {
            // Later classes should override earlier conflicting ones
            expect(cn('px-2', 'px-4')).toBe('px-4')
            expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
        })

        it('should handle arrays', () => {
            expect(cn(['foo', 'bar'])).toBe('foo bar')
        })

        it('should handle objects', () => {
            expect(cn({ active: true, disabled: false })).toBe('active')
        })

        it('should handle undefined and null', () => {
            expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
        })

        it('should handle empty string', () => {
            expect(cn('')).toBe('')
        })

        it('should handle complex combinations', () => {
            const result = cn(
                'base-class',
                true && 'conditional',
                false && 'hidden',
                { active: true },
                ['array-class'],
                undefined
            )
            expect(result).toContain('base-class')
            expect(result).toContain('conditional')
            expect(result).toContain('active')
            expect(result).toContain('array-class')
            expect(result).not.toContain('hidden')
        })
    })
})
