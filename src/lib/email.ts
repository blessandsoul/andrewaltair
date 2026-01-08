import nodemailer from 'nodemailer'

// Create reusable transporter
// For production, use real SMTP credentials from environment variables
// For development/testing, using Ethereal test accounts
const createTransporter = async () => {
    // Check if we have real SMTP config
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    }

    // For development - create test account (emails viewable at ethereal.email)
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    })
}

// Email templates
export const emailTemplates = {
    welcome: (name: string, email: string, verificationUrl?: string) => ({
        subject: 'მოგესალმებით Andrew Altair-ზე! 🎉',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6366f1;">გამარჯობა, ${name}! 👋</h1>
                <p>მადლობა რომ დარეგისტრირდით Andrew Altair პლატფორმაზე.</p>
                <p>თქვენი ელ-ფოსტა: <strong>${email}</strong></p>
                ${verificationUrl ? `
                    <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 8px;">
                        <p style="margin: 0 0 15px 0; color: #92400e;"><strong>⚠️ გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა</strong></p>
                        <p style="margin: 0 0 15px 0;">ანგარიშის გასააქტიურებლად დააჭირეთ ქვემოთ მოცემულ ღილაკს:</p>
                        <a href="${verificationUrl}" 
                           style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                            ელ-ფოსტის დადასტურება
                        </a>
                        <p style="margin: 15px 0 0 0; color: #666; font-size: 12px;">ბმული მოქმედებს 24 საათის განმავლობაში.</p>
                    </div>
                ` : `
                    <div style="margin: 30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://andrewaltair.ge'}" 
                           style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                            გადავიდეთ პლატფორმაზე
                        </a>
                    </div>
                `}
                <p style="color: #666; font-size: 12px;">Andrew Altair Team</p>
            </div>
        `,
    }),

    passwordReset: (name: string, resetLink: string) => ({
        subject: 'პაროლის აღდგენა - Fresh',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6366f1;">პაროლის აღდგენა</h1>
                <p>გამარჯობა, ${name}!</p>
                <p>თქვენ მოითხოვეთ პაროლის აღდგენა. დააჭირეთ ქვემოთ მოცემულ ღილაკს:</p>
                <div style="margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        პაროლის აღდგენა
                    </a>
                </div>
                <p style="color: #666; font-size: 12px;">თუ თქვენ არ მოითხოვეთ ეს ქმედება, უგულებელყავით ეს წერილი.</p>
                <p style="color: #666; font-size: 12px;">ბმული მოქმედებს 1 საათის განმავლობაში.</p>
            </div>
        `,
    }),

    newComment: (postTitle: string, commenterName: string, commentText: string) => ({
        subject: `ახალი კომენტარი: ${postTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6366f1;">ახალი კომენტარი</h2>
                <p><strong>${commenterName}</strong> დატოვა კომენტარი თქვენს პოსტზე:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p style="margin: 0;">"${commentText}"</p>
                </div>
                <p>პოსტი: <strong>${postTitle}</strong></p>
            </div>
        `,
    }),

    notification: (title: string, message: string, actionUrl?: string, actionText?: string) => ({
        subject: title,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6366f1;">${title}</h2>
                <p>${message}</p>
                ${actionUrl ? `
                    <div style="margin: 30px 0;">
                        <a href="${actionUrl}" 
                           style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                            ${actionText || 'გადასვლა'}
                        </a>
                    </div>
                ` : ''}
                <p style="color: #666; font-size: 12px;">Fresh Team</p>
            </div>
        `,
    }),
}

// Send email function
export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string | string[]
    subject: string
    html: string
    text?: string
}): Promise<{ success: boolean; messageId?: string; previewUrl?: string; error?: string }> {
    try {
        const transporter = await createTransporter()

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Fresh Platform" <noreply@fresh.ge>',
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            text: text || subject,
            html,
        })

        // For test accounts, get preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info)

        return {
            success: true,
            messageId: info.messageId,
            previewUrl: previewUrl || undefined,
        }
    } catch (error) {
        console.error('Email send error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email send failed',
        }
    }
}

// Convenience functions
export async function sendWelcomeEmail(name: string, email: string, verificationUrl?: string) {
    const template = emailTemplates.welcome(name, email, verificationUrl)
    return sendEmail({ to: email, ...template })
}

export async function sendPasswordResetEmail(name: string, email: string, resetLink: string) {
    const template = emailTemplates.passwordReset(name, resetLink)
    return sendEmail({ to: email, ...template })
}

export async function sendNotificationEmail(
    to: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
) {
    const template = emailTemplates.notification(title, message, actionUrl, actionText)
    return sendEmail({ to, ...template })
}
