import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock DB connection globally
vi.mock('@/lib/db', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}))
