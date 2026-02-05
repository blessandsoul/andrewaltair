export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// In-memory storage для share codes
const shareCodes = new Map<string, {
    articleId: string;
    expiresAt: number;
    used: boolean;
    createdAt: number;
    sharedBy?: string;
}>();

// Генерация короткого кода для share
function generateShareCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// POST /api/vibe-codes/share-unlock - создание share кода после шера
export async function POST(request: NextRequest) {
    try {
        const { articleId, userId } = await request.json();

        if (!articleId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Article ID is required', 400);
        }

        const code = generateShareCode();
        const now = Date.now();
        const expiresAt = now + (15 * 60 * 1000); // 15 минут

        shareCodes.set(code, {
            articleId,
            expiresAt,
            used: false,
            createdAt: now,
            sharedBy: userId
        });

        // Очистка истекших кодов
        cleanupExpiredCodes();

        return apiSuccess({ code, articleId, expiresAt, expiresIn: 15 * 60 * 1000 }, 'Share code generated successfully');
    } catch (error) {
        return apiError(ERROR_CODES.VIBE_CODE_CREATE_FAILED, 'Failed to generate share code', 500);
    }
}

// GET /api/vibe-codes/share-unlock?code=XXX - проверка и использование share кода
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return apiError(ERROR_CODES.VALIDATION_FAILED, 'Code is required', 400);
    }

    const codeData = shareCodes.get(code);

    if (!codeData) {
        return apiError(ERROR_CODES.VIBE_CODE_NOT_FOUND, 'Invalid code or code already used', 404);
    }

    const now = Date.now();

    // Проверка истечения срока
    if (now > codeData.expiresAt) {
        shareCodes.delete(code);
        return apiError(ERROR_CODES.VIBE_CODE_NOT_FOUND, 'Code expired (15 minutes passed)', 410);
    }

    // Проверка использования
    if (codeData.used) {
        return apiError(ERROR_CODES.VIBE_CODE_NOT_FOUND, 'This code has already been used', 409);
    }

    // Помечаем как использованный
    codeData.used = true;

    // Возвращаем доступ на 15 минут к одной статье
    const accessExpiresAt = now + (15 * 60 * 1000);

    return apiSuccess({
        articleId: codeData.articleId,
        expiresAt: accessExpiresAt,
        remainingTime: 15 * 60 * 1000,
    }, 'You have 15 minutes of access to this article');
}

// Очистка истекших кодов
function cleanupExpiredCodes() {
    const now = Date.now();
    for (const [code, data] of shareCodes.entries()) {
        if (now > data.expiresAt || data.used) {
            shareCodes.delete(code);
        }
    }
}

// Запускаем очистку каждые 5 минут
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);


