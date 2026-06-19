import { describe, it, expect, vi, beforeEach } from 'vitest'
import mongoose from 'mongoose'

// Use vi.hoisted so these are available inside vi.mock factories (which are hoisted)
const {
    mockUserSave,
    mockComparePassword,
    mockUserFindOne,
    mockUserFindById,
    mockSessionCreate,
} = vi.hoisted(() => ({
    mockUserSave: vi.fn().mockResolvedValue(undefined),
    mockComparePassword: vi.fn().mockResolvedValue(true),
    mockUserFindOne: vi.fn(),
    mockUserFindById: vi.fn(),
    mockSessionCreate: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/db', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/jwt-config', () => ({
    signToken: vi.fn().mockReturnValue('mock-jwt-token'),
}))

vi.mock('@/lib/email', () => ({
    sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/activityTracker', () => ({
    trackSignup: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/totp', () => ({
    verifyTOTP: vi.fn().mockReturnValue(false),
}))

vi.mock('@/models/User', () => {
    function MockUser(this: Record<string, unknown>, data: Record<string, unknown>) {
        Object.assign(this, data)
        this._id = new mongoose.Types.ObjectId()
        this.createdAt = new Date()
        this.save = mockUserSave
    }

    MockUser.findOne = mockUserFindOne
    MockUser.findById = mockUserFindById

    return { default: MockUser }
})

vi.mock('@/models/Session', () => ({
    default: {
        create: mockSessionCreate,
    },
}))

// Import after mocks are defined
import { AuthService } from '@/services/auth.service'
import { verifyTOTP } from '@/lib/totp'
import { signToken } from '@/lib/jwt-config'
import { sendWelcomeEmail } from '@/lib/email'
import { trackSignup } from '@/lib/activityTracker'
import User from '@/models/User'

// ---- Helpers ----

function createMockUser(overrides: Record<string, unknown> = {}) {
    const userId = new mongoose.Types.ObjectId()
    return {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        fullName: 'Test User',
        avatar: undefined,
        role: 'viewer',
        badge: undefined,
        isBlocked: false,
        isEmailVerified: true,
        twoFactorEnabled: false,
        twoFactorSecret: undefined,
        lastLogin: undefined,
        createdAt: new Date('2024-01-01'),
        comparePassword: mockComparePassword,
        save: mockUserSave,
        ...overrides,
    }
}

const VALID_REGISTRATION_DATA = {
    username: 'newuser',
    email: 'new@example.com',
    password: 'securepassword123',
    fullName: 'New User',
}

const TEST_IP = '192.168.1.1'
const TEST_USER_AGENT = 'Mozilla/5.0 Chrome/120'

// ---- Tests ----

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Reset the in-memory rate limiting map between tests
        AuthService.clearAttempts(TEST_IP)
        AuthService.clearAttempts('10.0.0.1')
        AuthService.clearAttempts('10.0.0.2')

        // Default mock behaviors
        mockUserFindOne.mockReturnValue(null)
        mockComparePassword.mockResolvedValue(true)
        mockUserSave.mockResolvedValue(undefined)
        mockSessionCreate.mockResolvedValue(undefined)
    })

    // ================================================================
    // Rate Limiting
    // ================================================================
    describe('Rate Limiting', () => {
        describe('checkRateLimit', () => {
            it('should allow login when no previous attempts exist', () => {
                // Arrange — no prior attempts recorded

                // Act
                const result = AuthService.checkRateLimit(TEST_IP)

                // Assert
                expect(result.allowed).toBe(true)
                expect(result.remainingAttempts).toBe(5)
            })

            it('should track failed attempts and decrement remaining count', () => {
                // Arrange
                AuthService.recordFailedAttempt(TEST_IP)
                AuthService.recordFailedAttempt(TEST_IP)

                // Act
                const result = AuthService.checkRateLimit(TEST_IP)

                // Assert
                expect(result.allowed).toBe(true)
                expect(result.remainingAttempts).toBe(3)
            })

            it('should block after MAX_LOGIN_ATTEMPTS (5) failed attempts', () => {
                // Arrange
                for (let i = 0; i < 5; i++) {
                    AuthService.recordFailedAttempt(TEST_IP)
                }

                // Act
                const result = AuthService.checkRateLimit(TEST_IP)

                // Assert
                expect(result.allowed).toBe(false)
                expect(result.remainingAttempts).toBe(0)
            })

            it('should include lockout remaining time when blocked', () => {
                // Arrange
                for (let i = 0; i < 5; i++) {
                    AuthService.recordFailedAttempt(TEST_IP)
                }

                // Act
                const result = AuthService.checkRateLimit(TEST_IP)

                // Assert
                expect(result.allowed).toBe(false)
                expect(result.lockoutRemaining).toBeDefined()
                expect(typeof result.lockoutRemaining).toBe('number')
                expect(result.lockoutRemaining).toBeGreaterThan(0)
                // Lockout is 15 minutes = 900 seconds
                expect(result.lockoutRemaining).toBeLessThanOrEqual(900)
            })

            it('should reset after lockout duration expires', () => {
                // Arrange
                for (let i = 0; i < 5; i++) {
                    AuthService.recordFailedAttempt(TEST_IP)
                }

                // Simulate time passing beyond lockout duration (15 minutes)
                const now = Date.now()
                vi.spyOn(Date, 'now').mockReturnValue(now + 15 * 60 * 1000 + 1000)

                // Act — first call clears the expired lockout entry
                const result = AuthService.checkRateLimit(TEST_IP)

                // Assert — allowed is true after lockout expiry
                expect(result.allowed).toBe(true)

                // After the entry is cleared, a second call returns full remaining attempts
                const result2 = AuthService.checkRateLimit(TEST_IP)
                expect(result2.allowed).toBe(true)
                expect(result2.remainingAttempts).toBe(5)

                vi.restoreAllMocks()
            })

            it('should clear attempts on successful call to clearAttempts', () => {
                // Arrange
                AuthService.recordFailedAttempt(TEST_IP)
                AuthService.recordFailedAttempt(TEST_IP)
                AuthService.recordFailedAttempt(TEST_IP)

                // Act
                AuthService.clearAttempts(TEST_IP)

                // Assert
                const result = AuthService.checkRateLimit(TEST_IP)
                expect(result.allowed).toBe(true)
                expect(result.remainingAttempts).toBe(5)
            })

            it('should track attempts per IP independently', () => {
                // Arrange
                const ip1 = '10.0.0.1'
                const ip2 = '10.0.0.2'
                AuthService.recordFailedAttempt(ip1)
                AuthService.recordFailedAttempt(ip1)

                // Act
                const result1 = AuthService.checkRateLimit(ip1)
                const result2 = AuthService.checkRateLimit(ip2)

                // Assert
                expect(result1.remainingAttempts).toBe(3)
                expect(result2.remainingAttempts).toBe(5)
            })
        })
    })

    // ================================================================
    // Registration
    // ================================================================
    describe('register', () => {
        it('should throw when required fields are missing', async () => {
            // Arrange — only username provided; the rest empty so the
            // `!email || !password || !fullName` guard fires (matches the
            // Pick<IUser, ...> contract, no cast needed).
            const incompleteData = { username: 'test', email: '', password: '', fullName: '' }

            // Act & Assert
            await expect(
                AuthService.register(incompleteData, TEST_USER_AGENT)
            ).rejects.toThrow('ყველა ველის შევსება სავალდებულოა')
        })

        it('should throw when username is missing', async () => {
            // Arrange — empty username triggers the required-fields guard.
            const data = { username: '', email: 'a@b.com', password: 'password123', fullName: 'Name' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('ყველა ველის შევსება სავალდებულოა')
        })

        it('should throw when email is missing', async () => {
            // Arrange — empty email triggers the required-fields guard.
            const data = { username: 'testuser', email: '', password: 'password123', fullName: 'Name' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('ყველა ველის შევსება სავალდებულოა')
        })

        it('should throw when password is missing', async () => {
            // Arrange
            const data = { username: 'testuser', email: 'a@b.com', fullName: 'Name' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('ყველა ველის შევსება სავალდებულოა')
        })

        it('should throw on invalid email format', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, email: 'not-an-email' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('არასწორი ელფოსტის ფორმატი')
        })

        it('should throw on email without domain', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, email: 'user@' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('არასწორი ელფოსტის ფორმატი')
        })

        it('should throw when password is too short', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, password: 'short' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო')
        })

        it('should throw when password is exactly 7 characters', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, password: '1234567' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო')
        })

        it('should throw on invalid username characters', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, username: 'user name!' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('მომხმარებლის სახელი უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს, ციფრებს და _')
        })

        it('should throw on username with special characters', async () => {
            // Arrange
            const data = { ...VALID_REGISTRATION_DATA, username: 'user@name' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).rejects.toThrow('მომხმარებლის სახელი უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს, ციფრებს და _')
        })

        it('should accept username with letters, numbers, and underscores', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)
            const data = { ...VALID_REGISTRATION_DATA, username: 'valid_User_123' }

            // Act & Assert
            await expect(
                AuthService.register(data, TEST_USER_AGENT)
            ).resolves.toBeDefined()
        })

        it('should throw when email already exists', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue({
                email: VALID_REGISTRATION_DATA.email,
                username: 'otheruser',
            })

            // Act & Assert
            await expect(
                AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)
            ).rejects.toThrow('ეს ელფოსტა უკვე რეგისტრირებულია')
        })

        it('should throw when username already exists', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue({
                email: 'other@example.com',
                username: VALID_REGISTRATION_DATA.username,
            })

            // Act & Assert
            await expect(
                AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)
            ).rejects.toThrow('ეს მომხმარებლის სახელი უკვე დაკავებულია')
        })

        it('should create user with correct data when registration is valid', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            const result = await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert — verify user was saved and returned data matches input
            expect(mockUserSave).toHaveBeenCalled()
            expect(result.user.username).toBe(VALID_REGISTRATION_DATA.username)
            expect(result.user.email).toBe(VALID_REGISTRATION_DATA.email)
            expect(result.user.fullName).toBe(VALID_REGISTRATION_DATA.fullName)
            expect(result.user.role).toBe('viewer')
        })

        it('should return user data and token on success', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            const result = await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert
            expect(result).toHaveProperty('user')
            expect(result).toHaveProperty('token')
            expect(result.token).toBe('mock-jwt-token')
            expect(result.user).toHaveProperty('id')
            expect(result.user).toHaveProperty('username')
            expect(result.user).toHaveProperty('email')
            expect(result.user).toHaveProperty('fullName')
            expect(result.user).toHaveProperty('role')
        })

        it('should create a session on successful registration', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert
            expect(mockSessionCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: 'mock-jwt-token',
                    deviceInfo: expect.objectContaining({
                        browser: 'Chrome',
                        device: 'Desktop',
                    }),
                    expiresAt: expect.any(Date),
                })
            )
        })

        it('should call signToken with correct payload on success', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert
            expect(signToken).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: expect.any(mongoose.Types.ObjectId),
                    role: 'viewer',
                    sessionId: expect.any(String),
                })
            )
        })

        it('should send welcome email on successful registration', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert
            expect(sendWelcomeEmail).toHaveBeenCalledWith(
                VALID_REGISTRATION_DATA.fullName,
                VALID_REGISTRATION_DATA.email,
                expect.any(String)
            )
        })

        it('should track signup activity on successful registration', async () => {
            // Arrange
            mockUserFindOne.mockResolvedValue(null)

            // Act
            await AuthService.register(VALID_REGISTRATION_DATA, TEST_USER_AGENT)

            // Assert
            expect(trackSignup).toHaveBeenCalledWith(
                VALID_REGISTRATION_DATA.fullName,
                expect.any(String)
            )
        })
    })

    // ================================================================
    // Login
    // ================================================================
    describe('login', () => {
        it('should throw when credentials are missing', async () => {
            // Act & Assert
            await expect(
                AuthService.login('', 'password', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('ელფოსტა და პაროლი სავალდებულოა')

            await expect(
                AuthService.login('user@test.com', '', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('ელფოსტა და პაროლი სავალდებულოა')
        })

        it('should throw when both loginField and password are empty', async () => {
            // Act & Assert
            await expect(
                AuthService.login('', '', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('ელფოსტა და პაროლი სავალდებულოა')
        })

        it('should throw when user not found', async () => {
            // Arrange
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(null),
            })

            // Act & Assert
            // Generic credential-failure message (anti account-enumeration):
            // login() deliberately returns the same error for unknown-user and
            // wrong-password so an attacker can't probe which emails exist.
            await expect(
                AuthService.login('nonexistent@test.com', 'password123', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('ელფოსტა ან პაროლი არასწორია')
        })

        it('should throw when account is blocked', async () => {
            // Arrange
            const blockedUser = createMockUser({ isBlocked: true })
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(blockedUser),
            })

            // Act & Assert
            await expect(
                AuthService.login('blocked@test.com', 'password123', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('თქვენი ანგარიში დაბლოკილია')
        })

        it('should throw when password does not match', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(false)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act & Assert
            // Same generic message as the unknown-user case (anti enumeration).
            await expect(
                AuthService.login('test@example.com', 'wrongpassword', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow('ელფოსტა ან პაროლი არასწორია')
        })

        it('should record failed attempt on wrong password', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(false)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            try {
                await AuthService.login('test@example.com', 'wrongpassword', TEST_IP, TEST_USER_AGENT)
            } catch {
                // Expected to throw
            }

            // Assert
            const rateCheck = AuthService.checkRateLimit(TEST_IP)
            expect(rateCheck.remainingAttempts).toBe(4)
        })

        it('should clear attempts on successful login', async () => {
            // Arrange
            AuthService.recordFailedAttempt(TEST_IP)
            AuthService.recordFailedAttempt(TEST_IP)

            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            await AuthService.login('test@example.com', 'correctpassword', TEST_IP, TEST_USER_AGENT)

            // Assert
            const rateCheck = AuthService.checkRateLimit(TEST_IP)
            expect(rateCheck.remainingAttempts).toBe(5)
        })

        it('should throw rate limit error when IP is locked out', async () => {
            // Arrange
            for (let i = 0; i < 5; i++) {
                AuthService.recordFailedAttempt(TEST_IP)
            }

            // Act & Assert
            await expect(
                AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow(/^RateLimit:locked:\d+$/)
        })

        it('should throw 2FA_REQUIRED when 2FA is enabled but no code provided', async () => {
            // Arrange
            const userId = new mongoose.Types.ObjectId()
            const user = createMockUser({
                _id: userId,
                twoFactorEnabled: true,
            })
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act & Assert
            await expect(
                AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT)
            ).rejects.toThrow(`2FA_REQUIRED:${userId.toString()}`)
        })

        it('should throw on invalid 2FA code', async () => {
            // Arrange
            const user = createMockUser({
                twoFactorEnabled: true,
                twoFactorSecret: 'secret123',
            })
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })
            mockUserFindById.mockReturnValue({
                select: vi.fn().mockResolvedValue({
                    _id: user._id,
                    twoFactorSecret: 'secret123',
                }),
            })
            vi.mocked(verifyTOTP).mockReturnValue(false)

            // Act & Assert
            await expect(
                AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT, '000000')
            ).rejects.toThrow('არასწორი 2FA კოდი')
        })

        it('should record failed attempt on invalid 2FA code', async () => {
            // Arrange
            const user = createMockUser({
                twoFactorEnabled: true,
                twoFactorSecret: 'secret123',
            })
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })
            mockUserFindById.mockReturnValue({
                select: vi.fn().mockResolvedValue({
                    _id: user._id,
                    twoFactorSecret: 'secret123',
                }),
            })
            vi.mocked(verifyTOTP).mockReturnValue(false)

            // Act
            try {
                await AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT, '000000')
            } catch {
                // Expected to throw
            }

            // Assert
            const rateCheck = AuthService.checkRateLimit(TEST_IP)
            expect(rateCheck.remainingAttempts).toBe(4)
        })

        it('should succeed with valid 2FA code when 2FA is enabled', async () => {
            // Arrange
            const user = createMockUser({
                twoFactorEnabled: true,
                twoFactorSecret: 'secret123',
            })
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })
            mockUserFindById.mockReturnValue({
                select: vi.fn().mockResolvedValue({
                    _id: user._id,
                    twoFactorSecret: 'secret123',
                }),
            })
            vi.mocked(verifyTOTP).mockReturnValue(true)

            // Act
            const result = await AuthService.login(
                'test@example.com', 'password123', TEST_IP, TEST_USER_AGENT, '123456'
            )

            // Assert
            expect(result).toHaveProperty('user')
            expect(result).toHaveProperty('token')
            expect(verifyTOTP).toHaveBeenCalledWith('123456', 'secret123')
        })

        it('should update lastLogin on successful login', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            await AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT)

            // Assert
            expect(user.lastLogin).toBeInstanceOf(Date)
            expect(mockUserSave).toHaveBeenCalled()
        })

        it('should return user data and token on successful login', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            const result = await AuthService.login(
                'test@example.com', 'password123', TEST_IP, TEST_USER_AGENT
            )

            // Assert
            expect(result.user.id).toBe(user._id.toString())
            expect(result.user.username).toBe('testuser')
            expect(result.user.email).toBe('test@example.com')
            expect(result.user.fullName).toBe('Test User')
            expect(result.user.role).toBe('viewer')
            expect(result.token).toBe('mock-jwt-token')
        })

        it('should create a session on successful login', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            await AuthService.login('test@example.com', 'password123', TEST_IP, TEST_USER_AGENT)

            // Assert
            expect(mockSessionCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: user._id,
                    token: 'mock-jwt-token',
                    deviceInfo: expect.objectContaining({
                        browser: 'Chrome',
                    }),
                    expiresAt: expect.any(Date),
                })
            )
        })

        it('should detect browser from user agent on session creation', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            await AuthService.login('test@example.com', 'password123', TEST_IP, 'Mozilla/5.0 Firefox/120')

            // Assert
            expect(mockSessionCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    deviceInfo: expect.objectContaining({
                        browser: 'Firefox',
                    }),
                })
            )
        })

        it('should detect mobile device from user agent on session creation', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            await AuthService.login(
                'test@example.com', 'password123', TEST_IP, 'Mozilla/5.0 Mobile Safari/120'
            )

            // Assert
            expect(mockSessionCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    deviceInfo: expect.objectContaining({
                        browser: 'Safari',
                        device: 'Mobile',
                    }),
                })
            )
        })

        it('should accept login with username instead of email', async () => {
            // Arrange
            const user = createMockUser()
            mockComparePassword.mockResolvedValue(true)
            mockUserFindOne.mockReturnValue({
                select: vi.fn().mockResolvedValue(user),
            })

            // Act
            const result = await AuthService.login(
                'testuser', 'password123', TEST_IP, TEST_USER_AGENT
            )

            // Assert
            expect(result).toHaveProperty('user')
            expect(result).toHaveProperty('token')
            expect(mockUserFindOne).toHaveBeenCalledWith({
                $or: [
                    { email: 'testuser' },
                    { username: 'testuser' },
                ],
            })
        })
    })
})
