import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Setting from '@/models/Setting'
import { VALID_SETTING_KEYS } from '@/lib/settings'

// GET - Retrieve all settings (masked values for sensitive data)
export async function GET() {
    try {
        await dbConnect()

        const settings = await Setting.find({}).lean()

        // Mask sensitive values
        const masked = settings.map(s => ({
            key: s.key,
            value: s.key.includes('token') ? (s.value ? '••••••••' : '') : s.value,
            hasValue: !!s.value,
            description: s.description,
            updatedAt: s.updatedAt
        }))

        return NextResponse.json({ success: true, settings: masked })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

// POST - Create or update a setting
export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const { key, value, description } = await request.json()

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and value required' }, { status: 400 })
        }

        // Validate known keys
        if (!VALID_SETTING_KEYS.includes(key)) {
            return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, description },
            { upsert: true, new: true }
        )

        return NextResponse.json({ success: true, setting: { key: setting.key, hasValue: !!setting.value } })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
    }
}
