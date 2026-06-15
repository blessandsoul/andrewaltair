import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { NextRequest } from 'next/server'
import { Resvg } from '@resvg/resvg-js'
import { WorkshopService } from '@/services/workshop.service'

// nodejs runtime: read fonts + the chosen photo off disk and rasterize an SVG with @resvg/resvg-js.
// (next/og is NOT used: its nodejs build crashes on Windows — `path.join(import.meta.url, …)`
//  mangles the bundled-font file:// URL → ERR_INVALID_URL at module load. resvg-js takes the fonts
//  as raw BUFFERS via `font.fontBuffers` — sharp/librsvg silently IGNORES SVG @font-face, which
//  rendered every Georgian glyph as tofu. resvg needs no system fonts → same on Windows dev + Linux prod.
//  resvg has NO flexbox and renders emoji as tofu → layout is manual x/y, badges are vector <path>.)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function publicB64(rel: string): string | null {
    try {
        return readFileSync(join(process.cwd(), 'public', rel)).toString('base64')
    } catch {
        return null
    }
}

/** Absolute paths of the fonts resvg should load (filtered to those present on disk). */
function fontFilePaths(): string[] {
    return [
        'fonts/NotoSansGeorgian-Regular.ttf',
        'fonts/NotoSansGeorgian-Bold.ttf',
        'fonts/NotoSans-Regular.ttf',
        'fonts/NotoSans-Bold.ttf',
    ]
        .map((rel) => join(process.cwd(), 'public', rel))
        .filter((p) => existsSync(p))
}

const esc = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Badge → Georgian label + brand color (emoji never rasterize in librsvg → drawn as vector icons).
const BADGE_VIS: Record<string, { ka: string; color: string }> = {
    lightning: { ka: 'ელვა', color: '#fbbf24' },
    streak: { ka: 'სერია', color: '#fb923c' },
    mindchange: { ka: 'აზრის ცვლა', color: '#a78bfa' },
    director: { ka: 'რეჟისორი', color: '#f472b6' },
    oracle: { ka: 'ორაკული', color: '#34d399' },
    onair: { ka: 'ეთერში', color: '#f0abfc' },
    champion: { ka: 'ჩემპიონი', color: '#ffd700' },
}

// Vector badge glyphs, drawn in a 24×24 box, colored inline (placed via <g transform>).
const ICON: Record<string, (c: string) => string> = {
    lightning: (c) => `<path d="M13 2 4 14h6l-2 8 10-13h-6l3-7z" fill="${c}"/>`,
    streak: (c) =>
        `<path d="M12 23c-4 0-7-3-7-7 0-3.2 2.2-5 3.2-7.2.3 1.7 1.1 2.6 2 2.9 1.1-1.3 1.1-3.4-.2-6.7 4 2 6 5 6 9 0 4-3 9-4 9z" fill="${c}"/>`,
    mindchange: (c) =>
        `<path d="M5 12a7 7 0 0 1 12-5" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M17 3v4h-4" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12a7 7 0 0 1-12 5" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M7 21v-4h4" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    director: (c) =>
        `<rect x="3" y="9" width="18" height="12" rx="2" fill="${c}"/><path d="M3.4 9 6 5l3.6 1L7 9zM10 6l3.6 1L11 11 7.4 10z" fill="${c}"/>`,
    oracle: (c) =>
        `<circle cx="12" cy="12" r="9" fill="none" stroke="${c}" stroke-width="2.2"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="${c}" stroke-width="2.2"/><circle cx="12" cy="12" r="1.7" fill="${c}"/>`,
    onair: (c) =>
        `<path d="M12 2.5l2.9 6 6.6.7-4.9 4.4 1.4 6.5L12 16.8 6 20.1l1.4-6.5L2.5 9.2l6.6-.7z" fill="${c}"/>`,
    champion: (c) =>
        `<path d="M7 4h10v3.5c0 3-2.2 5.2-5 5.2s-5-2.2-5-5.2z" fill="${c}"/><path d="M5 5H3v1.6c0 2 1.4 3.4 3.2 3.6M19 5h2v1.6c0 2-1.4 3.4-3.2 3.6" fill="none" stroke="${c}" stroke-width="2"/><rect x="10.4" y="12.4" width="3.2" height="4" fill="${c}"/><rect x="7" y="18" width="10" height="3" rx="1.2" fill="${c}"/>`,
}

const W = 1080
const PAD = 64

/** ka-GE long date ("14 ივნისი 2026"), with a safe numeric fallback. */
function fmtDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
        const d = new Date(iso)
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }
}

/** GET /api/workshop/rooms/<code>/diploma/<clientId> → 1080×1080 shareable "trophy" diploma PNG. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string; clientId: string }> }) {
    try {
        const { code, clientId } = await params
        const room = await WorkshopService.getRoomByCode(code)
        if (!room) return new Response('room not found', { status: 404 })
        const d = await WorkshopService.getDiplomaData(room, clientId)
        if (!d) return new Response('no participation', { status: 404 })

        // resvg loads the Georgian+Latin fonts from disk (SVG @font-face base64 is ignored by rasterizers → tofu)
        const fontFiles = fontFilePaths()

        let photoData = ''
        if (d.photo) {
            const pb = publicB64(d.photo.replace(/^\//, ''))
            if (pb) photoData = `data:image/${d.photo.endsWith('.png') ? 'png' : 'jpeg'};base64,${pb}`
        }

        const isChamp = d.rank === 1
        const date = fmtDate(d.dateISO)
        const cx = W / 2

        // 1:1 feed card (default) vs 9:16 story (fills IG/TikTok stories). Width stays 1080 so
        // cx / chip-wrap / helper math are identical — only the vertical rhythm (Y) + height change.
        const story = new URL(request.url).searchParams.get('format') === 'story'
        const H = story ? 1920 : 1080
        const Y = story
            ? { eyebrow: 156, subtitle: 202, heroCy: 560, heroR: 172, badgeDx: 122, badgeDy: 122, badgeR: 76, heroMr: 154, pill: 838, name: 1028, dream: 1104, stats: 1294, chips: 1488, footer: 1858 }
            : { eyebrow: 78, subtitle: 116, heroCy: 300, heroR: 132, badgeDx: 96, badgeDy: 92, badgeR: 60, heroMr: 116, pill: 474, name: 612, dream: 678, stats: 728, chips: 866, footer: 1024 }

        // ---- header (eyebrow + workshop · date) ----
        const title = esc((d.title || '').slice(0, 30))
        const subtitle = title ? `${title} · ${date}` : date
        const header = `
<text x="${cx}" y="${Y.eyebrow}" text-anchor="middle" font-family="NS,NG" font-weight="700" font-size="25" fill="#e040fb" letter-spacing="4">AI VIDEO WORKSHOP</text>
<text x="${cx}" y="${Y.subtitle}" text-anchor="middle" font-family="NG,NS" font-size="23" fill="#b9b6c6">${esc(subtitle)}</text>`

        // ---- hero: photo avatar + rank medallion badge (or centered medallion if no photo) ----
        const accent = isChamp ? 'url(#gold)' : 'url(#med)'
        const rankTxtFill = isChamp ? '#2a1d00' : '#ffffff'
        let hero = ''
        if (photoData) {
            const ax = cx
            const ay = Y.heroCy
            const ar = Y.heroR
            const bx = cx + Y.badgeDx
            const by = Y.heroCy + Y.badgeDy
            const br = Y.badgeR
            const rankFs = story ? 56 : 46
            const spokes = isChamp ? champSpokes(bx, by, br + 16) : ''
            hero = `
<circle cx="${ax}" cy="${ay}" r="${ar + 20}" fill="#a855f7" opacity="0.16" filter="url(#soft)"/>
<clipPath id="ava"><circle cx="${ax}" cy="${ay}" r="${ar}"/></clipPath>
<image href="${photoData}" x="${ax - ar}" y="${ay - ar}" width="${ar * 2}" height="${ar * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ava)"/>
<circle cx="${ax}" cy="${ay}" r="${ar}" fill="none" stroke="url(#ring)" stroke-width="7"/>
${spokes}
<circle cx="${bx}" cy="${by}" r="${br + 6}" fill="#0b0a0f"/>
<circle cx="${bx}" cy="${by}" r="${br}" fill="${accent}" filter="url(#soft)"/>
<circle cx="${bx}" cy="${by}" r="${br}" fill="${accent}"/>
<text x="${bx}" y="${by + Math.round(rankFs * 0.37)}" text-anchor="middle" font-family="NS,NG" font-weight="700" font-size="${rankFs}" fill="${rankTxtFill}">#${d.rank}</text>`
        } else {
            const my = Y.heroCy
            const mr = Y.heroMr
            const rankFs = story ? 120 : 96
            const spokes = isChamp ? champSpokes(cx, my, mr + 22) : ''
            hero = `
${spokes}
<circle cx="${cx}" cy="${my}" r="${mr + 10}" fill="${isChamp ? '#fbbf24' : '#7c3aed'}" opacity="0.20" filter="url(#soft)"/>
<circle cx="${cx}" cy="${my}" r="${mr}" fill="${accent}"/>
<circle cx="${cx}" cy="${my}" r="${mr}" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="3"/>
<text x="${cx}" y="${my + Math.round(rankFs * 0.35)}" text-anchor="middle" font-family="NS,NG" font-weight="700" font-size="${rankFs}" fill="${rankTxtFill}">#${d.rank}</text>`
        }

        // ---- percentile pill ----
        const plabel = isChamp ? 'ჩემპიონი' : `TOP ${d.percentile}%`
        const pmeta = `#${d.rank} / ${d.total}`
        const ptext = `${plabel}  ·  ${pmeta}`
        const pillW = Math.ceil(ptext.length * 17) + 56
        const pillX = cx - pillW / 2
        const pillFill = isChamp ? '#ffd700' : '#7c3aed'
        const pill = `
<rect x="${pillX}" y="${Y.pill}" width="${pillW}" height="56" rx="28" fill="${pillFill}" fill-opacity="0.16" stroke="${pillFill}" stroke-opacity="0.9"/>
<text x="${cx}" y="${Y.pill + 36}" text-anchor="middle" font-family="NS,NG" font-weight="700" font-size="27" fill="${isChamp ? '#ffd700' : '#d8b4fe'}">${esc(ptext)}</text>`

        // ---- name (gradient + glow) ----
        const name = esc((d.name || '').slice(0, 18))
        const nameFs = name.length > 13 ? 76 : name.length > 9 ? 86 : 96
        const nameY = Y.name
        const nameBlock = `
<text x="${cx}" y="${nameY}" text-anchor="middle" font-family="NG,NS" font-weight="700" font-size="${nameFs}" fill="#db2777" opacity="0.45" filter="url(#soft)">${name}</text>
<text x="${cx}" y="${nameY}" text-anchor="middle" font-family="NG,NS" font-weight="700" font-size="${nameFs}" fill="url(#name)">${name}</text>`

        // ---- dream ---- (single line; cap + font tiers keep it inside the 952px safe width)
        const dreamFull = (d.dream || '').trim()
        const dreamRaw = dreamFull.length > 52 ? dreamFull.slice(0, 51).trimEnd() + '…' : dreamFull
        const dreamFs = dreamRaw.length > 40 ? 30 : dreamRaw.length > 28 ? 36 : 42
        const dream = dreamRaw
            ? `<text x="${cx}" y="${Y.dream}" text-anchor="middle" font-family="NG,NS" font-size="${dreamFs}" fill="#e6e4ee">„${esc(dreamRaw)}“</text>`
            : ''

        // ---- stats row (hairline-separated columns) ----
        const stats: { v: string; l: string; c: string }[] = [{ v: String(d.points), l: 'ქულა', c: '#a78bfa' }]
        if (d.answeredCount > 0) stats.push({ v: `${d.answeredCount}/${d.roundsTotal}`, l: 'რაუნდი', c: '#f0abfc' })
        if (d.accuracyPct > 0) stats.push({ v: `${d.accuracyPct}%`, l: 'სიზუსტე', c: '#34d399' })
        if (d.streak >= 2) stats.push({ v: String(d.streak), l: 'სერია', c: '#fb923c' })
        const colW = 196
        const rowW = stats.length * colW
        const rowX = cx - rowW / 2
        const statY = Y.stats
        const statsSvg = stats
            .map((s, i) => {
                const ccx = rowX + i * colW + colW / 2
                const hair =
                    i > 0
                        ? `<line x1="${rowX + i * colW}" y1="${statY + 6}" x2="${rowX + i * colW}" y2="${statY + 78}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>`
                        : ''
                return `${hair}
<text x="${ccx}" y="${statY + 50}" text-anchor="middle" font-family="NS,NG" font-weight="700" font-size="50" fill="${s.c}">${esc(s.v)}</text>
<text x="${ccx}" y="${statY + 86}" text-anchor="middle" font-family="NG,NS" font-size="22" fill="#8a8796" letter-spacing="1">${s.l}</text>`
            })
            .join('\n')

        // ---- badge chips (vector icon + ka label), centered, wrap to 2 rows ----
        const chipsSvg = layoutChips(d.badges, cx, Y.chips)

        // ---- footer ----
        const verify = `#${d.code}`
        const footer = `
<text x="${PAD}" y="${Y.footer}" font-family="NS,NG" font-weight="700" font-size="28" fill="#e040fb" letter-spacing="2">ANDREWALTAIR.GE</text>
<text x="${W - PAD}" y="${Y.footer}" text-anchor="end" font-family="NS,NG" font-size="20" fill="#8a8796">${esc(date)} · ${esc(verify)}</text>`

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="g1" cx="22%" cy="12%" r="60%"><stop offset="0%" stop-color="#7c3aed" stop-opacity="0.40"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="86%" cy="90%" r="60%"><stop offset="0%" stop-color="#db2777" stop-opacity="0.34"/><stop offset="100%" stop-color="#db2777" stop-opacity="0"/></radialGradient>
<linearGradient id="med" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#db2777"/></linearGradient>
<linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ec4899"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fde68a"/><stop offset="55%" stop-color="#ffd700"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient>
<linearGradient id="name" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="50%" stop-color="#f0abfc"/><stop offset="100%" stop-color="#f9a8d4"/></linearGradient>
<filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="#0b0a0f"/>
<rect width="${W}" height="${H}" fill="url(#g1)"/>
<rect width="${W}" height="${H}" fill="url(#g2)"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.04"/>
<rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="40" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
${header}
${hero}
${pill}
${nameBlock}
${dream}
<line x1="${cx - 170}" y1="${Y.stats - 8}" x2="${cx + 170}" y2="${Y.stats - 8}" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1.5"/>
${statsSvg}
${chipsSvg}
${footer}
</svg>`

        // map the SVG's short family names to the loaded fonts' REAL family names so resvg resolves them
        const finalSvg = svg
            .replace(/font-family="NS,NG"/g, 'font-family="Noto Sans, Noto Sans Georgian"')
            .replace(/font-family="NG,NS"/g, 'font-family="Noto Sans Georgian, Noto Sans"')
        const resvg = new Resvg(finalSvg, {
            font: { fontFiles, defaultFontFamily: 'Noto Sans Georgian', loadSystemFonts: false },
        })
        const png = resvg.render().asPng()
        return new Response(new Uint8Array(png), {
            headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
        })
    } catch (e) {
        return new Response('diploma error: ' + (e instanceof Error ? e.message : 'unknown'), { status: 500 })
    }
}

/** Champion-only radiating glow spokes around a center. */
function champSpokes(cx: number, cy: number, r: number): string {
    const spokes: string[] = []
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const x1 = cx + Math.cos(a) * (r + 6)
        const y1 = cy + Math.sin(a) * (r + 6)
        const x2 = cx + Math.cos(a) * (r + 34)
        const y2 = cy + Math.sin(a) * (r + 34)
        spokes.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ffd700" stroke-opacity="0.5" stroke-width="4" stroke-linecap="round"/>`)
    }
    return spokes.join('')
}

/** Center-laid badge chips (icon + ka label), wrapping to a second row when needed. */
function layoutChips(badges: { id: string; label: string }[], cx: number, topY: number): string {
    if (!badges.length) return ''
    const list = badges.slice(0, 6)
    const H = 56
    const ICON_S = 28
    const measure = (ka: string) => 22 + ICON_S + 10 + Math.ceil(ka.length * 16) + 24 // padL + icon + gap + text + padR
    const items = list.map((b) => {
        const v = BADGE_VIS[b.id] ?? { ka: b.label, color: '#a78bfa' }
        return { ...v, id: b.id, w: measure(BADGE_VIS[b.id]?.ka ?? b.label) }
    })
    const maxRowW = W - PAD * 2
    const rows: (typeof items)[] = [[]]
    let rw = 0
    for (const it of items) {
        const add = it.w + (rows[rows.length - 1].length ? 12 : 0)
        if (rw + add > maxRowW && rows[rows.length - 1].length) {
            rows.push([it])
            rw = it.w
        } else {
            rows[rows.length - 1].push(it)
            rw += add
        }
    }
    const out: string[] = []
    rows.forEach((row, ri) => {
        const total = row.reduce((s, it) => s + it.w, 0) + (row.length - 1) * 12
        let x = cx - total / 2
        const y = topY + ri * (H + 14)
        for (const it of row) {
            const iconFn = ICON[it.id] ?? ICON.onair
            out.push(
                `<rect x="${x}" y="${y}" width="${it.w}" height="${H}" rx="28" fill="${it.color}" fill-opacity="0.14" stroke="${it.color}" stroke-opacity="0.85"/>` +
                    `<g transform="translate(${x + 22},${y + (H - 28) / 2}) scale(${28 / 24})">${iconFn(it.color)}</g>` +
                    `<text x="${x + 22 + 28 + 10}" y="${y + H / 2 + 9}" font-family="NG,NS" font-size="26" fill="#ffffff">${esc(it.ka)}</text>`,
            )
            x += it.w + 12
        }
    })
    return out.join('\n')
}
