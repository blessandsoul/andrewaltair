export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import dbConnect from '@/lib/db'
import Setting from '@/models/Setting'
import { VALID_SETTING_KEYS } from '@/lib/settings'
import { verifyAdmin } from '@/lib/admin-auth'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

// GET - Retrieve all settings (masked values for sensitive data)
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

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

        return apiSuccess(masked, 'Settings retrieved')
    } catch (error) {
        return apiError(ERROR_CODES.SETTINGS_FETCH_FAILED, 'Failed to fetch settings', 500)
    }
}

// POST - Create or update a setting
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return apiError(ERROR_CODES.ADMIN_UNAUTHORIZED, 'Admin access required', 401);
    }

    try {
        await dbConnect()

        const { key, value, description } = await request.json()

        if (!key || value === undefined) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Key and value required', 400)
        }

        // Validate known keys
        if (!VALID_SETTING_KEYS.includes(key)) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Invalid setting key', 400)
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, description },
            { upsert: true, new: true }
        )

        return apiSuccess({ key: setting.key, hasValue: !!setting.value }, 'Setting saved')
    } catch (error) {
        return apiError(ERROR_CODES.SETTINGS_UPDATE_FAILED, 'Failed to save setting', 500)
    }
}
