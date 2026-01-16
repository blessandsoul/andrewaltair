export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (в production использовать базу данных)
const accessCodes = new Map<string, {
    type: 'full' | 'single-article';
    expiresAt: number;
    usedAt?: number;
    articleId?: string;
    usageCount: number;
    maxUsage: number;
    createdAt: number;
}>();

// Генерация случайного кода
function generateCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// POST /api/vibe-codes - создание нового кода (для админ панели)
export async function POST(request: NextRequest) {
    // 🛡️ ADMIN ONLY
    const { verifyAdmin, unauthorizedResponse } = await import('@/lib/admin-auth');
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const { type, duration, maxUsage = 1 } = await request.json();

        const code = generateCode();
        const now = Date.now();
        const expiresAt = now + (duration || 3600000); // default 1 час

        accessCodes.set(code, {
            type: type || 'full',
            expiresAt,
            usageCount: 0,
            maxUsage,
            createdAt: now
        });

        return NextResponse.json({
            success: true,
            code,
            expiresAt,
            type,
            maxUsage
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate code' },
            { status: 500 }
        );
    }
}

// GET /api/vibe-codes?code=XXX - проверка кода
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json(
            { success: false, error: 'Code is required' },
            { status: 400 }
        );
    }

    const codeData = accessCodes.get(code);

    if (!codeData) {
        return NextResponse.json({
            success: false,
            error: 'Неверный код'
        });
    }

    const now = Date.now();

    // Проверка истечения срока
    if (now > codeData.expiresAt) {
        accessCodes.delete(code);
        return NextResponse.json({
            success: false,
            error: 'Код истек'
        });
    }

    // Проверка лимита использований
    if (codeData.usageCount >= codeData.maxUsage) {
        return NextResponse.json({
            success: false,
            error: 'Код уже использован'
        });
    }

    // Увеличиваем счетчик использований
    codeData.usageCount++;
    codeData.usedAt = now;

    return NextResponse.json({
        success: true,
        type: codeData.type,
        expiresAt: codeData.expiresAt,
        articleId: codeData.articleId,
        remainingTime: codeData.expiresAt - now
    });
}

// DELETE /api/vibe-codes?code=XXX - удаление кода (для админа)
export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json(
            { success: false, error: 'Code is required' },
            { status: 400 }
        );
    }

    const deleted = accessCodes.delete(code);

    return NextResponse.json({
        success: deleted,
        message: deleted ? 'Code deleted' : 'Code not found'
    });
}

// PATCH /api/vibe-codes - получить статистику всех кодов (для админа)
export async function PATCH() {
    const stats = Array.from(accessCodes.entries()).map(([code, data]) => ({
        code,
        type: data.type,
        usageCount: data.usageCount,
        maxUsage: data.maxUsage,
        createdAt: new Date(data.createdAt).toISOString(),
        expiresAt: new Date(data.expiresAt).toISOString(),
        isExpired: Date.now() > data.expiresAt,
        isUsedUp: data.usageCount >= data.maxUsage
    }));

    return NextResponse.json({
        success: true,
        totalCodes: accessCodes.size,
        codes: stats
    });
}


