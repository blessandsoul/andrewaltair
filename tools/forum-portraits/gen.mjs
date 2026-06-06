// Generate forum-persona portraits via OpenRouter image generation (Nano Banana 2 =
// google/gemini-3.1-flash-image-preview, free preview). Writes PNGs to
// public/forum-personas/<id>.png. Usage:
//   node tools/forum-portraits/gen.mjs            # all personas (skips existing)
//   node tools/forum-portraits/gen.mjs ilia stalin   # only these ids
//   FORCE=1 node tools/forum-portraits/gen.mjs    # re-generate even if file exists
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'forum-personas');
fs.mkdirSync(OUT, { recursive: true });

// --- read OPENROUTER_API_KEY from .env.local ---
function readEnv(name) {
    for (const f of ['.env.local', '.env']) {
        try {
            const txt = fs.readFileSync(path.join(ROOT, f), 'utf8');
            const m = txt.match(new RegExp('^' + name + '=(.*)$', 'm'));
            if (m) return m[1].trim().replace(/^["']|["']$/g, '');
        } catch { /* next */ }
    }
    return process.env[name] || '';
}
const KEY = readEnv('OPENROUTER_API_KEY');
if (!KEY) { console.error('NO OPENROUTER_API_KEY'); process.exit(1); }

const MODELS = ['google/gemini-3.1-flash-image-preview', 'google/gemini-2.5-flash-image'];

const STYLE =
    'Dignified head-and-shoulders portrait, classical oil painting and fresco style, painterly brushwork, ' +
    'soft dramatic Rembrandt chiaroscuro, dark muted museum background, serious noble expression, three-quarter ' +
    'view looking slightly off-camera, rich earthy historical palette, fine museum art, square 1:1 centered ' +
    'composition. No text, no words, no caption, no signature, no border, no frame.';

const PERSONAS = {
    vakhtang: 'Vakhtang Gorgasali, 5th-century Georgian warrior-king, iron helmet shaped like a wolf head, chainmail, fierce weathered bearded face.',
    david: 'David IV the Builder, medieval Georgian king (11th-12th c.), golden crown, royal Byzantine-patterned robe, dignified bearded face, Georgian church fresco look.',
    tamar: 'Queen Tamar of Georgia, 12th century, young regal woman, golden domed crown, jewelled royal Byzantine robes, serene noble face, Georgian medieval fresco look.',
    erekle: 'King Erekle II of Georgia, 18th century, older bearded king, fur-trimmed royal robe, weary wise eyes, ceremonial cap.',
    rustaveli: 'Shota Rustaveli, 12th-century Georgian poet, medieval scholar in a robe holding a manuscript, contemplative, Georgian fresco look.',
    ilia: 'Ilia Chavchavadze, 19th-century Georgian writer, long grey beard, formal 19th-century black suit, wise piercing eyes.',
    akaki: 'Akaki Tsereteli, 19th-century Georgian poet, white moustache and goatee, formal old-fashioned suit, warm lyrical expression.',
    vazha: 'Vazha-Pshavela, 19th-century Georgian mountain poet, rugged highlander in a traditional Georgian chokha coat, weathered honest face, dark mountains hinted behind.',
    nikoladze: 'Niko Nikoladze, 19th-century Georgian engineer and publicist, pince-nez glasses, neat beard, formal Victorian suit, pragmatic intelligent look.',
    noe: 'Noe Zhordania, early 20th-century Georgian statesman, full grey beard, round glasses, formal suit, parliamentary dignity.',
    takaishvili: 'Ekvtime Takaishvili, early 20th-century Georgian scholar, modest, round glasses, simple suit, humble devout ascetic expression.',
    javakhishvili: 'Ivane Javakhishvili, early 20th-century Georgian historian, neat beard, round glasses, scholarly suit, intellectual look.',
    galaktion: 'Galaktion Tabidze, 20th-century Georgian poet, clean-shaven, intense melancholic eyes, 1930s suit, tormented romantic genius.',
    k_gamsakhurdia: 'Konstantine Gamsakhurdia, 20th-century Georgian novelist, dignified older writer, swept-back hair, formal suit, proud literary presence.',
    zviad: 'Zviad Gamsakhurdia, late 20th-century Georgian dissident and first president, glasses, greying hair, intense passionate expression, 1990s suit.',
    mamardashvili: 'Merab Mamardashvili, 20th-century Georgian philosopher, balding with grey hair, holding a smoking pipe, thoughtful Socratic calm, 1970s style.',
    cholokashvili: 'Kakutsa Cholokashvili, early 20th-century Georgian rebel commander, traditional chokha coat with cartridge belts, proud defiant moustached face.',
    stalin: 'Joseph Stalin, early-to-mid 20th-century Soviet leader, thick moustache, plain military-style tunic, stern cold neutral expression. Neutral historical museum portrait, not glorified.',
    beria: 'Lavrentiy Beria, mid 20th-century Soviet functionary, round pince-nez glasses, balding, plain grey suit, cold calculating expression. Neutral historical museum portrait, not glorified.',
    bagration: 'Pyotr Bagration, early 19th-century Georgian-Russian general, military uniform with epaulettes and medals, sideburns, noble soldierly bearing.',
};

function extractBase64(json) {
    const msg = json?.choices?.[0]?.message;
    if (!msg) return null;
    // shape A: message.images[].image_url.url = data:image/...;base64,XXXX
    const imgs = msg.images || [];
    for (const im of imgs) {
        const url = im?.image_url?.url || im?.url || (typeof im === 'string' ? im : '');
        const m = /^data:image\/\w+;base64,(.+)$/s.exec(url || '');
        if (m) return m[1];
    }
    // shape B: content parts
    if (Array.isArray(msg.content)) {
        for (const c of msg.content) {
            const url = c?.image_url?.url || c?.url || '';
            const m = /^data:image\/\w+;base64,(.+)$/s.exec(url || '');
            if (m) return m[1];
        }
    }
    return null;
}

async function genOne(id, desc) {
    const prompt = `${desc} ${STYLE}`;
    for (const model of MODELS) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://andrewaltair.ge',
                    'X-Title': 'AndrewAltair Forum Portraits',
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    modalities: ['image', 'text'],
                }),
            });
            if (!res.ok) {
                const t = await res.text();
                console.error(`  ${id} ${model} HTTP ${res.status}: ${t.slice(0, 200)}`);
                continue;
            }
            const json = await res.json();
            const b64 = extractBase64(json);
            if (!b64) {
                console.error(`  ${id} ${model}: no image in response (${JSON.stringify(json).slice(0, 200)})`);
                continue;
            }
            fs.writeFileSync(path.join(OUT, `${id}.png`), Buffer.from(b64, 'base64'));
            const kb = Math.round(fs.statSync(path.join(OUT, `${id}.png`)).size / 1024);
            console.log(`  OK ${id} <- ${model} (${kb} KB)`);
            return true;
        } catch (e) {
            console.error(`  ${id} ${model} ERR ${e.message}`);
        }
    }
    return false;
}

const want = process.argv.slice(2);
const ids = want.length ? want : Object.keys(PERSONAS);
const force = process.env.FORCE === '1';
let ok = 0, fail = 0, skip = 0;

for (const id of ids) {
    const desc = PERSONAS[id];
    if (!desc) { console.error(`unknown persona: ${id}`); fail++; continue; }
    const file = path.join(OUT, `${id}.png`);
    if (!force && fs.existsSync(file) && fs.statSync(file).size > 5000) { console.log(`  skip ${id} (exists)`); skip++; continue; }
    const r = await genOne(id, desc);
    if (r) ok++; else fail++;
    await new Promise((r) => setTimeout(r, 1500)); // gentle rate limit
}

console.log(`\nDONE: ${ok} ok · ${fail} fail · ${skip} skipped · out=${OUT}`);
