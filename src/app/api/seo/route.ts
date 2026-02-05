export const dynamic = 'force-dynamic'
import { SeoService } from '@/services/seo.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - Fetch SEO settings
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const key = searchParams.get('key');

        const settings = await SeoService.getSeoSettings({ type, key });

        return apiSuccess({ settings }, 'SEO settings fetched successfully');
    } catch (error) {
        console.error('Get SEO settings error:', error);
        return apiError(ERROR_CODES.SEO_FETCH_FAILED, 'Failed to fetch SEO settings', 500);
    }
}

// POST - Create or update SEO setting (upsert)
export async function POST(request: Request) {
    try {
        const data = await request.json();

        const setting = await SeoService.updateSeoSetting(data);

        return apiSuccess({ setting }, 'SEO setting saved successfully');
    } catch (error) {
        console.error('Save SEO setting error:', error);
        return apiError(ERROR_CODES.SEO_UPDATE_FAILED, 'Failed to save SEO setting', 500);
    }
}
