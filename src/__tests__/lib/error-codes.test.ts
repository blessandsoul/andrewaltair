import { describe, it, expect } from 'vitest';

import { ERROR_CODES } from '@/lib/error-codes';

describe('error-codes', () => {
    it('should have all error codes as non-empty strings', () => {
        // Arrange
        const entries = Object.entries(ERROR_CODES);

        // Act & Assert
        expect(entries.length).toBeGreaterThan(0);
        for (const [key, value] of entries) {
            expect(typeof value).toBe('string');
            expect(value.length).toBeGreaterThan(0);
        }
    });

    it('should have unique error code values', () => {
        // Arrange
        const values = Object.values(ERROR_CODES);

        // Act
        const uniqueValues = new Set(values);

        // Assert
        expect(uniqueValues.size).toBe(values.length);
    });

    it('should match key name to value for every entry', () => {
        // Arrange
        const entries = Object.entries(ERROR_CODES);

        // Act & Assert
        for (const [key, value] of entries) {
            expect(value).toBe(key);
        }
    });
});
