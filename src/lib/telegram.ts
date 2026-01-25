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
/**
 * Convert Markdown to Telegram HTML format
 * Supports: *bold*, _italic_, [link](url), and preserves line breaks
 */
function markdownToTelegramHTML(text: string): string {
    let html = text;

    // Escape HTML special characters first (except for ones we'll use)
    html = html.replace(/&/g, '&amp;');
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');

    // Convert Markdown links [text](url) to HTML <a> tags
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Convert **bold** or *bold* to <b>
    html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    html = html.replace(/\*([^*]+)\*/g, '<b>$1</b>');

    // Convert _italic_ to <i>
    html = html.replace(/_([^_]+)_/g, '<i>$1</i>');

    // Convert `code` to <code>
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    return html;
}

export async function sendTelegramPost(data: TelegramPostData) {
    try {
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@andr3waltairchannel';

        if (!TELEGRAM_BOT_TOKEN) {
            console.error('TELEGRAM_BOT_TOKEN not configured');
            return { success: false, error: 'TELEGRAM_BOT_TOKEN not configured' };
        }

        const { telegramContent, postUrl, coverImage, coverImages, buttonText, parse_mode } = data;

        if (!telegramContent) {
            return { success: false, error: 'telegramContent is required' };
        }

        // Format link with button text
        const linkText = buttonText || '📖 სრულად წაკითხვა';

        // Build message and convert to HTML for proper formatting
        const rawMessage = `${telegramContent}\n\n🔗 <a href="${postUrl}">${linkText}</a>`;
        const message = markdownToTelegramHTML(telegramContent) + `\n\n🔗 <a href="${postUrl}">${linkText}</a>`;

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

        // console.log('[Telegram Lib] Sending payload to:', TELEGRAM_CHANNEL_ID);

        interface TelegramPayload {
            chat_id: string;
            disable_web_page_preview: boolean;
            parse_mode: 'HTML';
            photo?: string;
            caption?: string;
            text?: string;
        }

        let endpoint = 'sendMessage';
        const body: TelegramPayload = {
            chat_id: TELEGRAM_CHANNEL_ID,
            disable_web_page_preview: false,
            parse_mode: 'HTML' // Use HTML for reliable formatting
        };

        if (imageUrl && imageUrl.startsWith('http')) {
            endpoint = 'sendPhoto';
            body.photo = imageUrl;
            body.caption = message;
            console.log('[Telegram Lib] Type: Photo with HTML formatting');
        } else {
            body.text = message;
            // console.log('[Telegram Lib] Type: Text with HTML formatting');
        }

        // console.log('[Telegram Lib] Body preview:', message.substring(0, 200) + '...');

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
