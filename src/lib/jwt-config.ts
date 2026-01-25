import jwt from 'jsonwebtoken';

// Validate JWT_SECRET at startup
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET environment variable is required');
}

if (JWT_SECRET.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters for security');
}

// Check for common weak secrets
const WEAK_SECRETS = [
    'secret', 'password', 'test', 'dev', 'development',
    '12345678', 'qwerty', 'admin', 'changeme'
];

const lowerSecret = JWT_SECRET.toLowerCase();
if (WEAK_SECRETS.some(weak => lowerSecret.includes(weak))) {
    throw new Error('❌ JWT_SECRET appears to be weak. Use: openssl rand -base64 32');
}

// Validate it's not the example from .env.example
if (JWT_SECRET === 'your_nextauth_secret_here' || JWT_SECRET === 'your_jwt_secret_here') {
    throw new Error('❌ JWT_SECRET is still set to example value. Generate a real secret.');
}

export const JWT_CONFIG = {
    secret: JWT_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256' as const,
    issuer: 'andrewaltair.ge',
    audience: 'andrewaltair-users'
} as const;

/**
 * Sign a JWT token with secure defaults
 */
export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn,
        algorithm: JWT_CONFIG.algorithm,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
    });
}

/**
 * Verify a JWT token with secure defaults
 */
export function verifyToken(token: string): jwt.JwtPayload | string {
    try {
        return jwt.verify(token, JWT_CONFIG.secret, {
            algorithms: [JWT_CONFIG.algorithm],
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
}
