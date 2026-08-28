import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dbConnect from '../src/lib/db';
import Insight from '../src/models/Insight';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    await dbConnect();
    console.log("Connected to MongoDB for cover image update...");

    const insights = await Insight.find({});
    console.log(`Found ${insights.length} insight documents in DB.`);

    const coversDir = path.resolve(process.cwd(), '..', 'ainow.ge_project', 'website', 'public', 'images', 'blog-covers');

    let updatedCount = 0;
    for (const insight of insights) {
        const slug = insight.slug;
        const coverFileName = `${slug}.jpg`;
        const localCoverPath = path.join(coversDir, coverFileName);

        if (fs.existsSync(localCoverPath)) {
            const coverUrl = `https://ainow.ge/images/blog-covers/${coverFileName}`;
            if (insight.sourceImage !== coverUrl) {
                insight.sourceImage = coverUrl;
                if (insight.seo) {
                    insight.seo.ogImage = coverUrl;
                }
                await insight.save();
                updatedCount++;
                console.log(`Updated cover for [${slug}] -> ${coverUrl}`);
            }
        }
    }

    console.log(`\nFinished updating cover images. Updated ${updatedCount} insight(s).`);
    process.exit(0);
}

main().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
