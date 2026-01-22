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
 * With fallback: if Markdown parsing fails, retry without parse_mode
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

        // Format message for Telegram - plain text link for safety
        const linkText = buttonText || 'სრულად წაკითხვა';
        // Use plain text URL instead of Markdown link to avoid parsing issues
        const message = `${telegramContent}\n\n🔗 ${linkText}: ${postUrl}`;

        let imageUrl = coverImages?.horizontal || coverImage;

        // Ensure absolute URL for image
        if (imageUrl && !imageUrl.startsWith('http')) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
            imageUrl = `${baseUrl}${imageUrl}`;
        }

        // 🛡️ TELEGRAM LOCALHOST PROTECTION
        if (imageUrl && (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1'))) {
            console.warn('[Telegram Lib] Skipping image because URL is localhost');
            imageUrl = undefined;
        }

        console.log('[Telegram Lib] Sending payload to:', TELEGRAM_CHANNEL_ID);

        let endpoint = 'sendMessage';
        const body: any = {
            chat_id: TELEGRAM_CHANNEL_ID,
            disable_web_page_preview: false
            // NOTE: No parse_mode - send as plain text to avoid Markdown parsing issues
        };

        if (imageUrl && imageUrl.startsWith('http')) {
            endpoint = 'sendPhoto';
            body.photo = imageUrl;
            body.caption = message;
            console.log('[Telegram Lib] Type: Photo');
        } else {
            body.text = message;
            console.log('[Telegram Lib] Type: Text');
        }

        console.log('[Telegram Lib] Body preview:', message.substring(0, 200) + '...');

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
