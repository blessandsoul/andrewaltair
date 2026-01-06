import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, sendWelcomeEmail, sendNotificationEmail } from '@/lib/email'

// POST - Send email
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { type, to, ...params } = data

        if (!to) {
            return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
        }

        let result

        switch (type) {
            case 'welcome':
                if (!params.name) {
                    return NextResponse.json({ error: 'Name is required for welcome email' }, { status: 400 })
                }
                result = await sendWelcomeEmail(params.name, to)
                break

            case 'notification':
                if (!params.title || !params.message) {
                    return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
                }
                result = await sendNotificationEmail(to, params.title, params.message, params.actionUrl, params.actionText)
                break

            case 'custom':
                if (!params.subject || !params.html) {
                    return NextResponse.json({ error: 'Subject and html are required' }, { status: 400 })
                }
                result = await sendEmail({ to, subject: params.subject, html: params.html, text: params.text })
                break

            default:
                return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                messageId: result.messageId,
                previewUrl: result.previewUrl, // For test accounts only
            })
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }
    } catch (error) {
        console.error('Email API error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
