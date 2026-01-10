
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, 'favicon-source.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

const TARGETS = [
    { name: 'favicon.ico', size: 32, format: 'png' }, // saving as png, many browsers handle this, but for true ico we might need different handling. However, sharp can't save directly to .ico easily without plugins. Standard practice often allows png renamed or just distinct files. Next.js often uses .ico for legacy found in root. Let's try to just save as png for now, or use a specific setting if needed. Actually, modern browsers support png favicons. The user specific complaint was "Resource size is not correct".
    // Note: simply renaming .png to .ico isn't a valid ico file, but many browsers tolerate it. 
    // BETTER APPROACH: generate a png and let the user know, OR just generate standard png sizes and update manifest. 
    // The layout.tsx links /favicon.ico.

    { name: 'favicon-16x16.png', size: 16, format: 'png' },
    { name: 'favicon-32x32.png', size: 32, format: 'png' },
    { name: 'apple-touch-icon.png', size: 180, format: 'png' },
    { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
    { name: 'android-chrome-512x512.png', size: 512, format: 'png' }
];

async function generate() {
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error(`Source image not found at ${SOURCE_IMAGE}`);
        process.exit(1);
    }

    console.log('Generating favicons...');

    for (const target of TARGETS) {
        const outputPath = path.join(PUBLIC_DIR, target.name);

        // specialized handling for .ico if we want to try to be as compliant as possible without plugins:
        // we will just save it as png and hope for the best, or rely on the pngs in the manifest.
        // The previous error was about manifest icons.

        await sharp(SOURCE_IMAGE)
            .resize(target.size, target.size)
            .toFormat(target.format)
            .toFile(outputPath);

        console.log(`Generated ${target.name} (${target.size}x${target.size})`);
    }

    console.log('Done!');
}

generate().catch(console.error);
