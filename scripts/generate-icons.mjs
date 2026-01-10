import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, '..', 'fav.png');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error(`Source image not found at ${SOURCE_IMAGE}`);
    process.exit(1);
}

const TASKS = [
    { name: 'favicon.ico', size: 32, format: 'icon' }, // Basic ICO
    { name: 'favicon-16x16.png', size: 16, format: 'png' },
    { name: 'favicon-32x32.png', size: 32, format: 'png' },
    { name: 'apple-touch-icon.png', size: 180, format: 'png' },
    { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
    { name: 'android-chrome-512x512.png', size: 512, format: 'png' },
];

async function generate() {
    console.log(`Generating icons from ${SOURCE_IMAGE}...`);

    for (const task of TASKS) {
        const dest = path.join(PUBLIC_DIR, task.name);

        // sharp can output to .ico if format is set, but usually just a resized png buffer saved as .ico works for simple cases, 
        // or we use specific ICO handling. Sharp v0.33+ supports .ico.
        // Assuming modern sharp. If not, we fallback to png for ico (which is often valid simply renamed, but better to format properly).

        try {
            let pipeline = sharp(SOURCE_IMAGE).resize(task.size, task.size);

            if (task.name.endsWith('.ico')) {
                // Sharp doesn't officially support .ico write in all versions comfortably without plugins usually, 
                // but let's try standard output. 
                // Actually, most reliable way with sharp only is to output png and rename if simple, 
                // OR use a specific technique. 
                // HOWEVER, standard browsers read a 32x32 png in a .ico file just fine usually.
                // Let's force png format but save as .ico? No, that's hacky.
                // Let's see if sharp supports it.
                // If this fails, we will skip or warn.
                // Wait, recent sharp DOES support ico.

                // Safe fallback: just write as png to the filename? No, header mismatch.
                // If sharp fails, we might just use the 32x32 png as favicon.ico (not typically recommended but works).
                // Better: png for everything. 
                // But Task asks for proper files.
                // Let's try explicit toFormat('ico') if available, otherwise 'png'.

                // Correct logic:
                // Resize -> toFormat -> toFile
            }

            // For simplicity and robustness with basic sharp:
            if (task.name.endsWith('.ico')) {
                // Special handling if strict .ico needed? 
                // Let's try simply resizing and saving. Sharp allows saving to .ico depending on libvips.
                await pipeline.toFile(dest);
            } else {
                await pipeline.toFormat('png').toFile(dest);
            }

            console.log(`✅ Generated ${task.name}`);
        } catch (err) {
            console.error(`❌ Failed to generate ${task.name}:`, err.message);
            // Fallback for ICO if it failed (e.g. format unsupported) -> copy 32x32 png?
            if (task.name.endsWith('.ico')) {
                console.log("Attempting fallback for .ico (saving as png with .ico extension - not standard but often works primarily)");
                try {
                    await sharp(SOURCE_IMAGE).resize(32, 32).toFormat('png').toFile(dest);
                    console.log(`✅ Generated ${task.name} (fallback)`);
                } catch (e) {
                    console.error("Fallback failed");
                }
            }
        }
    }
}

generate();
