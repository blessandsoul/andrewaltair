import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

import dbConnect from '@/lib/db';
import Media from '@/models/Media';
import Video from '@/models/Video';
import { indexVideo } from '@/lib/indexnow';

export class MediaService {
    static ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    static MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private static generateSlug(text: string): string {
        const geo: Record<string, string> = {
            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
            'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
            'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p',
            'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz',
            'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
        };

        let slug = text.toLowerCase();
        for (const [char, lat] of Object.entries(geo)) {
            slug = slug.replace(new RegExp(char, 'g'), lat);
        }

        return slug.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 60);
    }

    /**
     * Upload File (Local FS)
     */
    static async uploadFile(file: File, title: string = 'untitled', type: string = 'horizontal') {
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            throw new Error('დაშვებულია მხოლოდ სურათები (JPEG, PNG, WEBP, GIF)');
        }
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error('ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს');
        }

        let slug = this.generateSlug(title);
        slug = slug.replace(/^-+|-+$/g, '');
        if (!slug || slug.length < 3) slug = `image-${Date.now().toString(36)}`;

        const ext = file.name.split('.').pop() || 'jpg';
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const filename = `${slug}-${type}-${Date.now()}.${ext}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(year), month);
        const filePath = path.join(uploadDir, filename);

        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        return {
            url: `/api/files/${year}/${month}/${filename}`,
            filename,
            type
        };
    }

    /**
     * Media (DB)
     */
    static async getAllMedia(query: Record<string, unknown> = {}) {
        await dbConnect();
        const media = await Media.find(query).sort({ uploadedAt: -1 }).lean();
        return media.map((m) => ({
            ...m,
            id: (m._id as mongoose.Types.ObjectId).toString(),
            uploadedAt: m.uploadedAt?.toISOString?.()?.split('T')[0] || m.uploadedAt,
            _id: undefined,
        }));
    }

    static async createMedia(data: { name: string; url: string; data?: string; mimeType?: string; type?: 'image' | 'video'; size?: string; sizeBytes?: number; width?: number; height?: number; altText?: string; caption?: string; folder?: string }) {
        await dbConnect();
        const media = new Media({
            ...data,
            uploadedAt: new Date(),
        });
        await media.save();
        return { ...media.toObject(), id: media._id.toString() };
    }

    /**
     * Videos
     */
    static async getAllVideos(query: Record<string, unknown> = {}, limit = 20) {
        await dbConnect();
        const videos = await Video.find(query).sort({ publishedAt: -1 }).limit(limit).lean();
        return videos.map((v) => ({ ...v, id: (v._id as mongoose.Types.ObjectId).toString(), _id: undefined }));
    }

    static async createVideo(data: { title: string; description?: string; youtubeId: string; thumbnail?: string; category: string; publishedAt?: Date; views?: number; duration?: string; type?: 'long' | 'short'; tags?: string[]; authorName?: string; authorAvatar?: string }) {
        await dbConnect();
        // Upsert by youtubeId to avoid duplicates and tolerate retries
        const { youtubeId, ...rest } = data;
        const video = await Video.findOneAndUpdate(
            { youtubeId },
            { $setOnInsert: { youtubeId, ...rest, description: rest.description ?? '' } },
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
        );
        // Background indexing
        indexVideo(video._id.toString()).catch(err => console.error('[IndexNow] Failed:', err));
        return { ...video.toObject(), id: video._id.toString() };
    }
}
