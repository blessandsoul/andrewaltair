/**
 * Sanitize user input before sending to AI
 * Prevents prompt injection attacks
 */

interface SanitizeOptions {
    maxLength?: number;
    allowNewlines?: boolean;
    allowSpecialChars?: boolean;
}

export function sanitizeAIInput(
    input: string,
    options: SanitizeOptions = {}
): string {
    const {
        maxLength = 200,
        allowNewlines = true,
        allowSpecialChars = true
    } = options;

    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove control characters (except newlines if allowed)
    let sanitized = allowNewlines
        ? input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '')
        : input.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');

    // Remove potential prompt injection patterns
    const dangerousPatterns = [
        // Instruction override attempts
        /ignore\s+(previous|above|all|prior)\s+(instructions?|prompts?|commands?)/gi,
        /disregard\s+(previous|above|all)\s+/gi,
        /forget\s+(everything|all|previous)/gi,

        // System/role manipulation
        /system\s*:/gi,
        /assistant\s*:/gi,
        /user\s*:/gi,
        /<\|.*?\|>/gi,
        /\[INST\]/gi,
        /\[\/INST\]/gi,
        /\[SYS\]/gi,
        /\[\/SYS\]/gi,

        // Code execution attempts
        /```[\s\S]*?```/g,
        /<script[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /data:text\/html/gi,

        // Prompt leaking attempts
        /show\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?)/gi,
        /what\s+(is|are)\s+your\s+(instructions?|rules?|guidelines?)/gi,
        /repeat\s+(your|the)\s+(prompt|instructions?)/gi
    ];

    dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    // Limit length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength);
    }

    // Escape quotes if not allowing special chars
    if (!allowSpecialChars) {
        sanitized = sanitized.replace(/["'`]/g, '');
    }

    return sanitized;
}

/**
 * Validate AI input meets requirements
 */
export function validateAIInput(
    input: string,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = 500
): { valid: boolean; error?: string } {
    if (!input || input.trim().length === 0) {
        return {
            valid: false,
            error: `${fieldName} არ შეიძლება იყოს ცარიელი`
        };
    }

    const trimmed = input.trim();

    if (trimmed.length < minLength) {
        return {
            valid: false,
            error: `${fieldName} უნდა იყოს მინიმუმ ${minLength} სიმბოლო`
        };
    }

    if (trimmed.length > maxLength) {
        return {
            valid: false,
            error: `${fieldName} არ უნდა აღემატებოდეს ${maxLength} სიმბოლოს`
        };
    }

    return { valid: true };
}

/**
 * Sanitize AI response before sending to client
 * Prevents response injection
 */
export function sanitizeAIResponse(response: string): string {
    if (!response || typeof response !== 'string') {
        return '';
    }

    // Remove any potential script tags
    let sanitized = response.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Remove data URIs
    sanitized = sanitized.replace(/data:text\/html[^"'\s]*/gi, '');

    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
}
