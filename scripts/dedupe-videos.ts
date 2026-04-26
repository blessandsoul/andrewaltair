import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const URI = process.env.MONGODB_URI;
if (!URI) {
    console.error('MONGODB_URI missing');
    process.exit(1);
}

const VideoSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema, 'videos');

async function run() {
    const dryRun = !process.argv.includes('--apply');
    await mongoose.connect(URI!);
    console.log('Connected. Mode:', dryRun ? 'DRY-RUN (use --apply to delete)' : 'APPLY');

    const all = await Video.find({}).sort({ createdAt: 1 }).lean();
    console.log('Total videos:', all.length);

    const seen = new Map<string, mongoose.Types.ObjectId>();
    const dupesToDelete: mongoose.Types.ObjectId[] = [];

    for (const v of all as Array<{ _id: mongoose.Types.ObjectId; youtubeId: string }>) {
        if (!v.youtubeId) continue;
        if (seen.has(v.youtubeId)) {
            dupesToDelete.push(v._id);
        } else {
            seen.set(v.youtubeId, v._id);
        }
    }

    console.log('Unique youtubeIds:', seen.size);
    console.log('Duplicates to delete:', dupesToDelete.length);

    if (dupesToDelete.length > 0 && !dryRun) {
        const result = await Video.deleteMany({ _id: { $in: dupesToDelete } });
        console.log('Deleted:', result.deletedCount);
    } else if (dupesToDelete.length > 0) {
        console.log('Sample dupe _ids:', dupesToDelete.slice(0, 5).map(String));
    }

    await mongoose.disconnect();
    console.log('Done.');
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
