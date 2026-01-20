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
        // We append the link logic. If buttonText is provided in the JSON from user, it might be part of the text,
        // but typically Telegram buttons are inline keyboards.
        // However, the existing implementation used a text link: [სრულად წაკითხვა](postUrl)
        // The user request shows: "button_text": "📖 სრული ანალიზი", "button_url": "..."
        // So we should try to use Inline Keyboard if possible, or fallback to the previous markdown link style if we want to keep it simple.
        // Let's stick to the previous style for now but strictly use the parsed data.

        // Actually, the user JSON has "button_text" and "button_url". 
        // Let's support Inline Keyboard for a cleaner look if possible, but the original code used markdown link.
        // Let's use the markdown link method as it was in the original code, but upgraded with the custom text.

        const linkText = buttonText || 'სრულად წაკითხვა';
        const message = `${telegramContent}\n\n🔗 [${linkText}](${postUrl})`;

        let imageUrl = coverImages?.horizontal || coverImage;

        // Ensure absolute URL for image
        if (imageUrl && !imageUrl.startsWith('http')) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge';
            imageUrl = `${baseUrl}${imageUrl}`;
        }

        let endpoint = 'sendMessage';
        const body: any = {
            chat_id: TELEGRAM_CHANNEL_ID,
            parse_mode: data.parse_mode || 'Markdown',
            disable_web_page_preview: false
        };

        if (imageUrl && imageUrl.startsWith('http')) {
            endpoint = 'sendPhoto';
            body.photo = imageUrl;
            body.caption = message;
        } else {
            body.text = message;
        }

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
