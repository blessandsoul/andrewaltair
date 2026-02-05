import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import Folder from '@/models/Folder';

import type { IFolder } from '@/models/Folder';

export class TaxonomyService {
    // --- Categories ---
    static async getAllCategories() {
        await dbConnect();
        const categories = await Category.find().sort({ name: 1 }).lean();
        return categories.map((cat) => ({
            ...cat,
            id: (cat._id as mongoose.Types.ObjectId).toString(),
            parentId: cat.parentId?.toString() || null,
            _id: undefined,
        }));
    }

    static async createCategory(data: { name: string; slug?: string; description?: string; color?: string; icon?: string; parentId?: string }) {
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
        return tags.map((tag) => ({
            ...tag,
            id: (tag._id as mongoose.Types.ObjectId).toString(),
            _id: undefined
        }));
    }

    static async createTag(data: { name: string; slug?: string; description?: string; color?: string; icon?: string }) {
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
        return folders.map((f) => ({
            ...f,
            id: (f._id as mongoose.Types.ObjectId).toString(),
            parentId: (f as IFolder & { parentId?: mongoose.Types.ObjectId }).parentId?.toString() || null,
            _id: undefined,
        }));
    }

    static async createFolder(data: { name: string; color?: string; parentId?: string }) {
        await dbConnect();
        const folder = new Folder(data);
        await folder.save();
        return { ...folder.toObject(), id: folder._id.toString() };
    }
}
