import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import Folder from '@/models/Folder';

export class TaxonomyService {
    // --- Categories ---
    static async getAllCategories() {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return categories.map((cat: any) => ({
            ...cat,
            id: cat._id.toString(),
            parentId: cat.parentId?.toString() || null,
            _id: undefined,
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createCategory(data: any) {
        await dbConnect();
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const category = new Category(data);
        await category.save();
        return { ...category.toObject(), id: category._id.toString() };
    }

    // --- Tags ---
    static async getAllTags() {
        await dbConnect();
        const tags = await Tag.find().sort({ name: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return tags.map((tag: any) => ({
            ...tag,
            id: tag._id.toString(),
            _id: undefined
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createTag(data: any) {
        await dbConnect();
        if (!data.slug) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9\u10A0-\u10FF]+/g, '-').replace(/(^-|-$)/g, '');
        }
        const tag = new Tag(data);
        await tag.save();
        return { ...tag.toObject(), id: tag._id.toString() };
    }

    // --- Folders ---
    static async getAllFolders() {
        await dbConnect();
        const folders = await Folder.find().sort({ order: 1, name: 1 }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return folders.map((f: any) => ({
            ...f,
            id: f._id.toString(),
            parentId: f.parentId?.toString() || null,
            _id: undefined,
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async createFolder(data: any) {
        await dbConnect();
        const folder = new Folder(data);
        await folder.save();
        return { ...folder.toObject(), id: folder._id.toString() };
    }
}
