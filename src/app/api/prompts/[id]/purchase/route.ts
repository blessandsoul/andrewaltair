import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes';
import dbConnect from '@/lib/db';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import PromptPurchase from '@/models/PromptPurchase';
import { nanoid } from 'nanoid';

interface Params {
    params: Promise<{ id: string }>;
}

// Telegram notification helper
async function sendTelegramNotification(purchase: {
    promptTitle: string;
    promptSlug: string;
    price: number;
    currency: string;
    userName?: string;
    userEmail: string;
    userPhone?: string;
    accessToken: string;
}) {
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
        console.warn('Telegram credentials not configured');
        return null;
    }

    const accessLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://andrewaltair.ge'}/prompts/${purchase.promptSlug}?access=${purchase.accessToken}`;

    const message = `
🛒 *Новая покупка промпта!*

📝 *Промпт:* ${purchase.promptTitle}
💰 *Цена:* ${purchase.price} ${purchase.currency}

👤 *Покупатель:*
• Имя: ${purchase.userName || 'Не указано'}
• Email: ${purchase.userEmail}
• Телефон: ${purchase.userPhone || 'Не указан'}

🔑 *Access Token:* \`${purchase.accessToken}\`
🔗 [Ссылка для доступа](${accessLink})

_Подтвердите оплату, чтобы открыть доступ_
    `.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                }),
            }
        );

        const data = await response.json();
        return data.ok ? data.result.message_id?.toString() : null;
    } catch (error) {
        console.error('Telegram notification error:', error);
        return null;
    }
}

// POST - Initiate purchase
export async function POST(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;

        // Find prompt
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query);

        if (!prompt || prompt.status !== 'published') {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404);
        }

        const body = await request.json();
        const { email, name, phone } = body;

        if (!email) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Email is required', 400);
        }

        // For free prompts, create completed purchase immediately
        const accessToken = nanoid(16);
        const isFreePrompt = prompt.isFree || prompt.price === 0;

        const purchase = await PromptPurchase.create({
            promptId: prompt._id,
            promptTitle: prompt.title,
            promptSlug: prompt.slug,
            userEmail: email,
            userName: name,
            userPhone: phone,
            price: prompt.price,
            currency: prompt.currency,
            status: isFreePrompt ? 'completed' : 'pending',
            accessToken,
            telegramNotified: false,
        });

        // Update prompt stats
        if (isFreePrompt) {
            await MarketplacePrompt.updateOne(
                { _id: prompt._id },
                { $inc: { downloads: 1 } }
            );
        }

        // Send Telegram notification for paid prompts
        if (!isFreePrompt) {
            const messageId = await sendTelegramNotification({
                promptTitle: prompt.title,
                promptSlug: prompt.slug,
                price: prompt.price,
                currency: prompt.currency,
                userName: name,
                userEmail: email,
                userPhone: phone,
                accessToken,
            });

            if (messageId) {
                await PromptPurchase.updateOne(
                    { _id: purchase._id },
                    { telegramNotified: true, telegramMessageId: messageId }
                );
            }
        }

        return apiSuccess({
            purchaseId: purchase._id.toString(),
            accessToken: isFreePrompt ? accessToken : undefined,
            status: purchase.status,
            isFree: isFreePrompt,
        }, isFreePrompt
            ? 'Download ready!'
            : 'Purchase initiated. You will receive access after payment confirmation.', 201);
    } catch (error) {
        console.error('Purchase prompt error:', error);
        return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'Failed to process purchase', 500);
    }
}

// GET - Check purchase status by access token
export async function GET(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;

        const { searchParams } = new URL(request.url);
        const accessToken = searchParams.get('access');

        if (!accessToken) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Access token required', 400);
        }

        // Find prompt
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query);

        if (!prompt) {
            return apiError(ERROR_CODES.PROMPT_NOT_FOUND, 'Prompt not found', 404);
        }

        // Find purchase
        const purchase = await PromptPurchase.findOne({
            promptId: prompt._id,
            accessToken,
        });

        if (!purchase) {
            return apiError(ERROR_CODES.FORBIDDEN, 'Invalid access token', 403);
        }

        if (purchase.status !== 'completed') {
            return apiSuccess({
                hasAccess: false,
                status: purchase.status,
            }, 'Payment pending confirmation');
        }

        // Update access time if first access
        if (!purchase.accessedAt) {
            await PromptPurchase.updateOne(
                { _id: purchase._id },
                { accessedAt: new Date() }
            );

            // Increment purchases count
            await MarketplacePrompt.updateOne(
                { _id: prompt._id },
                { $inc: { purchases: 1 } }
            );
        }

        // Return full prompt content
        return apiSuccess({
            hasAccess: true,
            status: 'completed',
            prompt: {
                title: prompt.title,
                promptTemplate: prompt.promptTemplate,
                variables: prompt.variables,
                instructions: prompt.instructions,
            },
        });
    } catch (error) {
        console.error('Check purchase access error:', error);
        return apiError(ERROR_CODES.PROMPT_FETCH_FAILED, 'Failed to verify access', 500);
    }
}
