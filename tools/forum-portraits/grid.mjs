// Assemble the 20 persona portraits into one 4x5 presentation grid (Instagram 4:5).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'forum-personas');
const order = [
    'vakhtang', 'david', 'tamar', 'erekle', 'rustaveli', 'ilia', 'akaki', 'vazha', 'nikoladze', 'noe',
    'takaishvili', 'javakhishvili', 'galaktion', 'k_gamsakhurdia', 'zviad', 'mamardashvili', 'cholokashvili',
    'stalin', 'beria', 'bagration',
];
const cols = 4, rows = 5, tile = 340, gap = 10, pad = 22;
const W = pad * 2 + cols * tile + (cols - 1) * gap;
const H = pad * 2 + rows * tile + (rows - 1) * gap;

const composites = [];
for (let i = 0; i < order.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const buf = await sharp(path.join(dir, `${order[i]}.png`)).resize(tile, tile, { fit: 'cover', position: 'top' }).toBuffer();
    composites.push({ input: buf, left: pad + c * (tile + gap), top: pad + r * (tile + gap) });
}
const out = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 17, g: 15, b: 19 } } })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();
fs.writeFileSync(path.join(dir, '_grid.png'), out);
console.log(`grid ${W}x${H} ${Math.round(out.length / 1024)}KB -> public/forum-personas/_grid.png`);
