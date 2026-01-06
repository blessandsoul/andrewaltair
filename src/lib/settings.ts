// Analytics setting keys used throughout the system
export const SETTING_KEYS = {
    TELEGRAM_BOT_TOKEN: 'telegram_bot_token',
    TELEGRAM_CHAT_ID: 'telegram_chat_id',
    ALERT_THRESHOLD: 'alert_threshold',
    DATA_RETENTION_DAYS: 'data_retention_days',
} as const

export type SettingKey = typeof SETTING_KEYS[keyof typeof SETTING_KEYS]

export const VALID_SETTING_KEYS = Object.values(SETTING_KEYS)
