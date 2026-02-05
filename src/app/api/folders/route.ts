export const dynamic = 'force-dynamic'
import { TaxonomyService } from '@/services/taxonomy.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// GET - List all folders
export async function GET() {
    try {
        const folders = await TaxonomyService.getAllFolders();
        return apiSuccess(folders, 'Folders retrieved');
    } catch (error) {
        console.error('Get folders error:', error);
        return apiError(ERROR_CODES.FOLDER_FETCH_FAILED, 'Failed to fetch folders', 500);
    }
}

// POST - Create new folder
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const folder = await TaxonomyService.createFolder(data);
        return apiSuccess(folder, 'Folder created', 201);
    } catch (error) {
        console.error('Create folder error:', error);
        return apiError(ERROR_CODES.FOLDER_CREATE_FAILED, 'Failed to create folder', 500);
    }
}
