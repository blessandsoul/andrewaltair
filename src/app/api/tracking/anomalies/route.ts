export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Alert from '@/models/Alert'
import Visitor from '@/models/Visitor'
import Setting from '@/models/Setting'

// Helper: Send Telegram notification
async function sendTelegramAlert(message: string): Promise<boolean> {
    try {
        const tokenSetting = await Setting.findOne({ key: 'telegram_bot_token' })
        const chatIdSetting = await Setting.findOne({ key: 'telegram_chat_id' })

        const token = tokenSetting?.value
        const chatId = chatIdSetting?.value

        if (!token || !chatId) {
            return false
        }

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            }
        )

        const result = await response.json()
        return result.ok === true
    } catch (error) {
        console.error('Telegram send error:', error)
        return false
    }
}

// GET - Check for anomalies and return alerts
export async function GET() {
    try {
        await dbConnect()

        // 1. Run Anomaly Check (Simple Traffic Spike Detection)
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

        // Count visitors in last hour
        const currentTraffic = await Visitor.countDocuments({
            updatedAt: { $gte: oneHourAgo }
        })

        // Calculate baseline: Average traffic for this hour over last 7 days
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const yesterdayHourAgo = new Date(yesterday.getTime() - 60 * 60 * 1000)

        const baselineTraffic = await Visitor.countDocuments({
            updatedAt: { $gte: yesterdayHourAgo, $lte: yesterday }
        })

        // Get threshold setting (default 200%)
        const thresholdSetting = await Setting.findOne({ key: 'alert_threshold' })
        const threshold = parseFloat(thresholdSetting?.value || '200') / 100

        // Threshold check and at least 10 visitors (to avoid noise)
        if (currentTraffic > 10 && currentTraffic > baselineTraffic * threshold) {
            // Check if we already alerted recently (last 24h)
            const recentAlert = await Alert.findOne({
                type: 'anomaly',
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })

            if (!recentAlert) {
                // Create alert
                const alert = await Alert.create({
                    type: 'anomaly',
                    severity: 'warning',
                    message: `🚨 Traffic spike detected! ${currentTraffic} visitors/hr (baseline: ${baselineTraffic})`,
                    metadata: { current: currentTraffic, baseline: baselineTraffic }
                })

                // Send Telegram notification
                const telegramMessage = `🚨 *ANOMALY DETECTED*

📊 *Traffic Spike Alert*

Current: *${currentTraffic}* visitors/hour
Baseline: *${baselineTraffic}* visitors/hour
Increase: *${Math.round((currentTraffic / Math.max(baselineTraffic, 1)) * 100)}%*

⏰ ${now.toLocaleString()}

[View Dashboard](${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/analytics)`

                await sendTelegramAlert(telegramMessage)
            }
        }

        // 2. Fetch Unread Alerts
        const alerts = await Alert.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(5)

        return NextResponse.json({
            success: true,
            alerts,
            status: {
                trafficStatus: currentTraffic > baselineTraffic * 1.5 ? 'high' : 'normal',
                currentLoad: currentTraffic,
                baseline: baselineTraffic
            }
        })

    } catch (error) {
        console.error('Anomaly check error:', error)
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
    }
}

// POST - Mark alert as read
export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const { id } = await request.json()

        await Alert.findByIdAndUpdate(id, { isRead: true })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
    }
}

