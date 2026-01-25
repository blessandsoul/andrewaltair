
// In-memory storage (Should migrate to DB later)
interface VibeCodeData {
    type: 'full' | 'single-article';
    expiresAt: number;
    usedAt?: number;
    articleId?: string;
    usageCount: number;
    maxUsage: number;
    createdAt: number;
}

const accessCodes = new Map<string, VibeCodeData>();

export class VibeCodeService {
    static generateCode(length: number = 6): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createCode(data: any) {
        const { type, duration, maxUsage = 1 } = data;
        const code = this.generateCode();
        const now = Date.now();
        const expiresAt = now + (duration || 3600000);

        accessCodes.set(code, {
            type: type || 'full',
            expiresAt,
            usageCount: 0,
            maxUsage,
            createdAt: now
        });

        return {
            code,
            expiresAt,
            type,
            maxUsage
        };
    }

    static validateCode(code: string) {
        const codeData = accessCodes.get(code);
        if (!codeData) throw new Error('Неверный код');

        const now = Date.now();
        if (now > codeData.expiresAt) {
            accessCodes.delete(code);
            throw new Error('Код истек');
        }

        if (codeData.usageCount >= codeData.maxUsage) {
            throw new Error('Код уже использован');
        }

        // Increment generic usage (commit happens here for in-memory)
        codeData.usageCount++;
        codeData.usedAt = now;

        return {
            type: codeData.type,
            expiresAt: codeData.expiresAt,
            articleId: codeData.articleId,
            remainingTime: codeData.expiresAt - now
        };
    }

    static deleteCode(code: string) {
        return accessCodes.delete(code);
    }

    static getAllCodes() {
        return Array.from(accessCodes.entries()).map(([code, data]) => ({
            code,
            type: data.type,
            usageCount: data.usageCount,
            maxUsage: data.maxUsage,
            createdAt: new Date(data.createdAt).toISOString(),
            expiresAt: new Date(data.expiresAt).toISOString(),
            isExpired: Date.now() > data.expiresAt,
            isUsedUp: data.usageCount >= data.maxUsage
        }));
    }
}
