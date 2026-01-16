export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

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
            return NextResponse.json(
                { success: false, error: 'Article ID is required' },
                { status: 400 }
            );
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

        return NextResponse.json({
            success: true,
            code,
            articleId,
            expiresAt,
            expiresIn: 15 * 60 * 1000 // 15 минут в миллисекундах
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate share code' },
            { status: 500 }
        );
    }
}

// GET /api/vibe-codes/share-unlock?code=XXX - проверка и использование share кода
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json(
            { success: false, error: 'Code is required' },
            { status: 400 }
        );
    }

    const codeData = shareCodes.get(code);

    if (!codeData) {
        return NextResponse.json({
            success: false,
            error: 'Неверный код или код уже использован'
        });
    }

    const now = Date.now();

    // Проверка истечения срока
    if (now > codeData.expiresAt) {
        shareCodes.delete(code);
        return NextResponse.json({
            success: false,
            error: 'Код истек (15 минут прошло)'
        });
    }

    // Проверка использования
    if (codeData.used) {
        return NextResponse.json({
            success: false,
            error: 'Этот код уже был использован'
        });
    }

    // Помечаем как использованный
    codeData.used = true;

    // Возвращаем доступ на 15 минут к одной статье
    const accessExpiresAt = now + (15 * 60 * 1000);

    return NextResponse.json({
        success: true,
        articleId: codeData.articleId,
        expiresAt: accessExpiresAt,
        remainingTime: 15 * 60 * 1000,
        message: 'У вас есть 15 минут доступа к этой статье'
    });
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


