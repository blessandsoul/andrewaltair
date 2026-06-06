// Downscale generated portraits to 512x512 (avatars never need more) to keep the repo lean.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'forum-personas');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
let before = 0, after = 0;
for (const f of files) {
    const p = path.join(dir, f);
    const inBuf = fs.readFileSync(p);
    before += inBuf.length;
    const out = await sharp(inBuf).resize(512, 512, { fit: 'cover', position: 'top' }).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(p, out);
    after += out.length;
    console.log(`${f}: ${Math.round(inBuf.length / 1024)}KB -> ${Math.round(out.length / 1024)}KB`);
}
console.log(`\nTOTAL: ${Math.round(before / 1024 / 1024)}MB -> ${Math.round(after / 1024 / 1024)}MB (${files.length} files)`);
