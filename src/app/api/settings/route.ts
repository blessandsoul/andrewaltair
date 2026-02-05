export const dynamic = 'force-dynamic'
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - Get all settings or by category
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const key = searchParams.get('key');

        if (key) {
            const setting = await Settings.findOne({ key }).lean();
            return apiSuccess({ setting }, 'Setting fetched');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};
        if (category) query.category = category;

        const settings = await Settings.find(query).lean();
        const transformedSettings = settings.map(s => ({
            ...s,
            id: s._id.toString(),
            _id: undefined,
        }));

        return apiSuccess({ settings: transformedSettings }, 'Settings fetched');
    } catch (error) {
        console.error('Get settings error:', error);
        return apiError(ERROR_CODES.SETTINGS_FETCH_FAILED, 'Failed to fetch settings', 500);
    }
}

// POST - Create/Update setting
export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();

        // Upsert - update if exists, create if not
        const setting = await Settings.findOneAndUpdate(
            { key: data.key },
            { $set: { value: data.value, category: data.category || 'general' } },
            { new: true, upsert: true, runValidators: true }
        );

        return apiSuccess({
            setting: {
                ...setting.toObject(),
                id: setting._id.toString(),
            },
        }, 'Setting updated');
    } catch (error) {
        console.error('Update settings error:', error);
        return apiError(ERROR_CODES.SETTINGS_UPDATE_FAILED, 'Failed to update settings', 500);
    }
}

