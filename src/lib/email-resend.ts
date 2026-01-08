/**
 * Email service using Resend
 * Alternative to nodemailer for production
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailWithResend({
    to,
    subject,
    html,
}: {
    to: string | string[];
    subject: string;
    html: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.SMTP_FROM || 'Andrew Altair <noreply@andrewaltair.ge>',
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        return {
            success: true,
            messageId: data?.id,
        };
    } catch (error) {
        console.error('Resend send error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Email send failed',
        };
    }
}

// Email templates (same as in email.ts)
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
};

// Convenience function
export async function sendWelcomeEmailResend(name: string, email: string, verificationUrl?: string) {
    const template = emailTemplates.welcome(name, email, verificationUrl);
    return sendEmailWithResend({ to: email, ...template });
}
