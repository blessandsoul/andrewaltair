export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { sendEmail, sendWelcomeEmail, sendNotificationEmail } from '@/lib/email'

// POST - Send email
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { type, to, ...params } = data

        if (!to) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Recipient email is required', 400)
        }

        let result

        switch (type) {
            case 'welcome':
                if (!params.name) {
                    return apiError(ERROR_CODES.VALIDATION_FAILED, 'Name is required for welcome email', 400)
                }
                result = await sendWelcomeEmail(params.name, to)
                break

            case 'notification':
                if (!params.title || !params.message) {
                    return apiError(ERROR_CODES.VALIDATION_FAILED, 'Title and message are required', 400)
                }
                result = await sendNotificationEmail(to, params.title, params.message, params.actionUrl, params.actionText)
                break

            case 'custom':
                if (!params.subject || !params.html) {
                    return apiError(ERROR_CODES.VALIDATION_FAILED, 'Subject and html are required', 400)
                }
                result = await sendEmail({ to, subject: params.subject, html: params.html, text: params.text })
                break

            default:
                return apiError(ERROR_CODES.BAD_REQUEST, 'Unknown email type', 400)
        }

        if (result.success) {
            return apiSuccess({
                messageId: result.messageId,
                previewUrl: result.previewUrl,
            }, 'Email sent successfully')
        } else {
            return apiError(ERROR_CODES.EMAIL_SEND_FAILED, result.error || 'Failed to send email', 500)
        }
    } catch (error) {
        console.error('Email API error:', error)
        return apiError(ERROR_CODES.EMAIL_SEND_FAILED, 'Failed to send email', 500)
    }
}

