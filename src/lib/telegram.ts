export const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

export interface TelegramPostData {
    title: string;
    telegramContent: string; // The formatted text for Telegram
    postUrl: string;
    coverImage?: string;
    coverImages?: {
        horizontal?: string;
        vertical?: string;
    };
    parse_mode?: 'Markdown' | 'HTML';
    buttonText?: string; // Optional custom button text
}

/**
 * Sends a post notification to the configured Telegram channel
 */
export async function sendTelegramPost(data: TelegramPostData) {
    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@andr3waltairchannel';

        if (!TELEGRAM_BOT_TOKEN) {
            console.error('TELEGRAM_BOT_TOKEN not configured');
            return { success: false, error: 'TELEGRAM_BOT_TOKEN not configured' };
        }

        const { telegramContent, postUrl, coverImage, coverImages, buttonText } = data;

        if (!telegramContent) {
            return { success: false, error: 'telegramContent is required' };
        }

        // Format message for Telegram
        const linkText = buttonText || 'სრულად წაკითხვა';
        const message = `${telegramContent}\n\n🔗 [${linkText}](${postUrl})`;

        let imageUrl = coverImages?.horizontal || coverImage;

        // Ensure absolute URL for image
        if (imageUrl && !imageUrl.startsWith('http')) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
            imageUrl = `${baseUrl}${imageUrl}`;
        }

        // 🛡️ TELEGRAM LOCALHOST PROTECTION
        // Telegram cannot fetch images from localhost. If we are on localhost, ignore the image and send text only.
        if (imageUrl && (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1'))) {
            console.warn('[Telegram Lib] Skipping image because URL is localhost (Telegram cannot reach it):', imageUrl);
            imageUrl = undefined;
        }

        console.log('[Telegram Lib] Sending payload to:', TELEGRAM_CHANNEL_ID);

        let endpoint = 'sendMessage';
        const body: any = {
            chat_id: TELEGRAM_CHANNEL_ID,
            parse_mode: data.parse_mode || 'Markdown',
            disable_web_page_preview: false
        };

        if (imageUrl && imageUrl.startsWith('http')) {
            endpoint = 'sendPhoto';
            body.photo = imageUrl;
            body.caption = message; // Logic change: sendPhoto uses caption
            console.log('[Telegram Lib] Type: Photo');
        } else {
            body.text = message; // sendMessage uses text
            console.log('[Telegram Lib] Type: Text');
        }

        console.log('[Telegram Lib] Body:', JSON.stringify(body, null, 2));

        const response = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (!result.ok) {
            console.error('Telegram API error:', result);
            return { success: false, error: result.description, details: result };
        }

        return { success: true, messageId: result.result?.message_id };

    } catch (error) {
        console.error('Telegram post error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
