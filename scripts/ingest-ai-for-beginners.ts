/**
 * Ingest the Georgian translation of Microsoft "AI for Beginners" into the
 * file-based course system read by /encyclopedia/ai-for-beginners.
 *
 * Run:  npx tsx scripts/ingest-ai-for-beginners.ts --modules 0,1,2
 *       npx tsx scripts/ingest-ai-for-beginners.ts            (all modules)
 *
 * Source root is ../AI-For-Beginners-ka (override with COURSE_SRC env).
 * It is re-runnable and incremental: it overwrites the selected modules'
 * lesson JSON + images, then rebuilds manifest.json + prev/next from EVERY
 * lesson file on disk, so prior modules are preserved.
 *
 * This file is excluded from the Next build (tsconfig "exclude": ["scripts"]).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
    CourseManifest, CourseModule, CourseLessonRef, CourseLesson,
    CourseHeading, NotebookCell, NotebookOutput, NotebookFramework,
} from '../src/types/course';

// ---------------------------------------------------------------- config

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = process.env.COURSE_SRC
    ? path.resolve(process.env.COURSE_SRC)
    : path.resolve(PROJECT_ROOT, '..', 'AI-For-Beginners-ka');
const LESSONS_ROOT = path.join(SRC_ROOT, 'lessons');

const COURSE_SLUG = 'ai-for-beginners';
const COURSE_TITLE = 'AI დამწყებთათვის';
const UPSTREAM_URL = 'https://github.com/microsoft/AI-For-Beginners';
const ATTRIBUTION = { source: 'Microsoft AI for Beginners', license: 'MIT', url: UPSTREAM_URL };

const DATA_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'courses', COURSE_SLUG);
const LESSONS_OUT = path.join(DATA_DIR, 'lessons');
const GLOSSARY_PATH = path.join(DATA_DIR, 'glossary.json');
const PUBLIC_BASE_REL = `courses/${COURSE_SLUG}`;
const PUBLIC_OUT = path.join(PROJECT_ROOT, 'public', PUBLIC_BASE_REL);
const NB_IMG_DIR = path.join(PUBLIC_OUT, '_nb');

const SKIP_DIRS = new Set(['translations', '.ipynb_checkpoints', '.git', 'node_modules']);
// assignment.md = the standalone "homework" pages the user asked to drop entirely.
const SKIP_FILES = new Set(['LICENSE.md', 'CODE_OF_CONDUCT.md', 'tmp.ipynb', 'notebook.ipynb', 'assignment.md']);
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp']);

// Per-module display metadata. Modules absent here fall back to derived values.
// `icon` = Tabler icon name resolved by src/components/courses/ai-for-beginners/ModuleIcon.tsx (NO emoji).
const MODULE_META: Record<string, { order: number; slug: string; title: string; icon: string; description: string }> = {
    '0-course-setup': { order: 0, slug: 'course-setup', title: 'კურსის მომზადება', icon: 'settings', description: 'გარემოს მომზადება, ნოუთბუქების გაშვება და კურსის სტრუქტურა.' },
    '1-Intro': { order: 1, slug: 'intro', title: 'შესავალი AI-ში', icon: 'brain', description: 'რა არის ხელოვნური ინტელექტი, მისი ისტორია და ძირითადი მიდგომები.' },
    '2-Symbolic': { order: 2, slug: 'symbolic', title: 'სიმბოლური AI', icon: 'sitemap', description: 'ცოდნის წარმოდგენა, საექსპერტო სისტემები და ონტოლოგიები.' },
    '3-NeuralNetworks': { order: 3, slug: 'neural-networks', title: 'ნეირონული ქსელები', icon: 'network', description: 'პერცეპტრონი, მრავალშრიანი ქსელები და ფრეიმვორკები.' },
    '4-ComputerVision': { order: 4, slug: 'computer-vision', title: 'კომპიუტერული ხედვა', icon: 'eye', description: 'კონვოლუციური ქსელები, ტრანსფერული სწავლება და გენერაცია.' },
    '5-NLP': { order: 5, slug: 'nlp', title: 'ბუნებრივი ენის დამუშავება', icon: 'messages', description: 'ტექსტის წარმოდგენა, ემბედინგები, რეკურენტული ქსელები და ტრანსფორმერები.' },
    '6-Other': { order: 6, slug: 'other', title: 'სხვა AI ტექნიკები', icon: 'puzzle', description: 'გენეტიკური ალგორითმები, განმტკიცებითი სწავლება და მულტი-აგენტური სისტემები.' },
    '7-Ethics': { order: 7, slug: 'ethics', title: 'პასუხისმგებლიანი AI', icon: 'scale', description: 'AI-ის ეთიკა და პასუხისმგებლიანი გამოყენების პრინციპები.' },
    'X-Extras': { order: 8, slug: 'extras', title: 'დამატებები', icon: 'sparkles', description: 'დამატებითი თემები: მულტიმოდალური ქსელები და სხვა.' },
};

// File-name ordering hints (lower = earlier) within a module's direct files.
const FILE_ORDER_HINT: Record<string, number> = { 'setup': 1, 'how-to-run': 2, 'for-teachers': 3 };

// ---------------------------------------------------------------- glossary

type GlossaryTerm = { find: string; replace: string; regex?: boolean; flags?: string };
type Glossary = { terminology?: GlossaryTerm[]; altText?: Record<string, string> };
let GLOSSARY: Glossary = {};
function loadGlossary() {
    try {
        if (fs.existsSync(GLOSSARY_PATH)) GLOSSARY = JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf-8'));
    } catch (e) { console.warn('glossary.json parse failed, skipping:', (e as Error).message); }
}
function applyGlossary(text: string): string {
    for (const t of GLOSSARY.terminology || []) {
        if (!t || !t.find) continue;
        if (t.regex) text = text.replace(new RegExp(t.find, t.flags || 'g'), t.replace ?? '');
        else text = text.split(t.find).join(t.replace ?? '');
    }
    return text;
}
function gAlt(alt: string): string {
    return (GLOSSARY.altText && GLOSSARY.altText[alt.trim()]) || alt;
}

// ---------------------------------------------------------------- helpers

const copiedImages = new Set<string>();
const missingImages = new Set<string>();

function kebab(s: string): string {
    return s
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'item';
}
function numericPrefix(name: string): number | null {
    const m = name.match(/^(\d+)/);
    return m ? parseInt(m[1], 10) : null;
}
function stripNumPrefix(name: string): string {
    return name.replace(/^\d+[-_.]?/, '').replace(/^[Xx]-/, '');
}
function stripExt(name: string): string {
    return name.replace(/\.(md|ipynb)$/i, '');
}
function prettify(name: string): string {
    const s = stripNumPrefix(stripExt(name)).replace(/[-_]+/g, ' ').trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : name;
}
function joinSource(s: unknown): string {
    if (Array.isArray(s)) return s.join('');
    return typeof s === 'string' ? s : '';
}
function stripAnsi(s: string): string {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\[[0-9;]*[A-Za-z]/g, '');
}
function clip(s: string, max = 4000): string {
    return s.length > max ? s.slice(0, max) + '\n… (გამოტანა შემოკლებულია)' : s;
}
// MUST stay byte-identical to CourseMarkdown's heading slugger + CourseTableOfContents.
function slugifyHeading(text: string): string {
    return text.toLowerCase().replace(/[^a-zა-ჰ0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50);
}
function headingVisibleText(raw: string): string {
    return raw
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](url) -> text
        .replace(/[*_`~]/g, '')                  // emphasis / code marks
        .trim();
}

// Protect fenced + inline code from the text transforms below, then restore.
function protectCode(md: string): { text: string; blocks: string[] } {
    const blocks: string[] = [];
    let t = md.replace(/```[\s\S]*?```/g, (m) => { blocks.push(m); return ` C${blocks.length - 1} `; });
    t = t.replace(/`[^`\n]+`/g, (m) => { blocks.push(m); return ` C${blocks.length - 1} `; });
    return { text: t, blocks };
}
function restoreCode(t: string, blocks: string[]): string {
    return t.replace(/ C(\d+) /g, (_m, i) => blocks[Number(i)] ?? '');
}
// Drop links to text — the lessons are riddled with inline wikipedia/arxiv/github/quiz
// links the user does not want. Keeps markdown images (negative lookbehind for `!`).
function stripLinks(md: string): string {
    return md.replace(/(?<!\!)\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, '$1');
}
// Remove any remaining raw HTML tags (e.g. <br>, <sub>) so none render as literal text.
function stripStrayHtml(md: string): string {
    return md.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?>/g, '');
}
// Strip markdown emphasis (**bold** / *italic*) to plain text. The source's
// emphasis is often malformed (spaces inside / unclosed markers) and shows as
// literal asterisks in our renderer, so we drop it entirely. List bullets ("* ")
// are preserved (opening `*` of an emphasis is never followed by a space).
function stripEmphasis(md: string): string {
    md = md.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '$1'); // **bold** / ** bold ** -> bold (inner spaces trimmed)
    md = md.replace(/\*\*/g, '');                      // any orphan ** removed (** is never a list bullet)
    md = md.replace(/\*(?!\s)([^*\n]+?)(?<!\s)\*/g, '$1'); // *italic* -> italic (keeps "* " bullets)
    return md;
}
// Remove assignment content from a lesson body: whole "## დავალება ..." sections
// (heading + body up to the next heading / EOF) and any standalone footer line.
function stripAssignmentFooter(md: string): string {
    // Whole "## ... დავალება ..." section (heading containing დავალება + its body up to
    // the next heading or EOF). Tolerates a missing trailing newline at EOF.
    md = md.replace(/^#{1,6}[ \t]+[^\n]*დავალება[^\n]*(?:\n(?!#{1,6}[ \t])[^\n]*)*\n?/gm, '');
    // Any standalone "დავალება: ..." footer line.
    md = md.replace(/^[ \t]*დავალება[ \t]*[:：].*$/gm, '');
    return md;
}
// Drop the word "დავალება" from a lesson title (kept practical notebooks sometimes
// carry it), e.g. "დავალება: დიოფანტინის განტოლებები" -> "დიოფანტინის განტოლებები".
function cleanTitle(t: string): string {
    let s = t.replace(/^\s*დავალება\s*[:：]\s*/u, '');
    s = s.replace(/\s*[-—:：]?\s*დავალება\s*$/u, '');
    return s.trim() || t;
}
// Full content clean for markdown bodies + notebook markdown cells.
function cleanContent(md: string, fileDir: string): string {
    const { text, blocks } = protectCode(md);
    let t = applyGlossary(text);   // emoji-strip + terminology
    t = processImages(t, fileDir); // rewrite md images + convert <img> HTML to markdown
    t = stripLinks(t);             // [text](url) -> text (images preserved)
    t = stripStrayHtml(t);         // drop leftover raw HTML tags
    t = stripEmphasis(t);          // drop **bold** / *italic* markers (often malformed in source)
    t = stripAssignmentFooter(t);  // drop dangling "დავალება: ..." footer (assignment pages removed)
    return restoreCode(t, blocks);
}

function walk(dir: string, acc: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue;
            walk(path.join(dir, entry.name), acc);
        } else if (entry.isFile()) {
            if (SKIP_FILES.has(entry.name)) continue;
            if (/\.(md|ipynb)$/i.test(entry.name)) acc.push(path.join(dir, entry.name));
        }
    }
    return acc;
}

// ---------------------------------------------------------------- images

function copyAndRewriteImage(src: string, fileDir: string): string {
    if (/^(https?:)?\/\//i.test(src) || /^data:/i.test(src) || src.startsWith('/')) return src;
    const clean = src.split('#')[0].split('?')[0];
    let abs: string;
    try { abs = path.resolve(fileDir, decodeURI(clean)); } catch { abs = path.resolve(fileDir, clean); }
    const rel = path.relative(LESSONS_ROOT, abs);
    if (rel.startsWith('..') || path.isAbsolute(rel)) return src;
    if (!IMAGE_EXT.has(path.extname(abs).toLowerCase())) return src;
    const relPosix = rel.split(path.sep).join('/');
    if (!fs.existsSync(abs)) { missingImages.add(relPosix); return src; }
    const dest = path.join(PUBLIC_OUT, relPosix);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    copiedImages.add(relPosix);
    return `/${PUBLIC_BASE_REL}/${relPosix}`;
}

function processImages(md: string, fileDir: string): string {
    md = md.replace(/!\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
        (_full, alt: string, src: string, title: string) =>
            `![${gAlt(alt)}](${copyAndRewriteImage(src, fileDir)}${title})`);
    // Convert raw <img> HTML to a markdown image so react-markdown renders it
    // (it does not render raw HTML — the tag would otherwise show as literal text).
    md = md.replace(/<img\b[^>]*>/gi, (tag: string) => {
        const srcM = tag.match(/\bsrc=(["'])([\s\S]*?)\1/i);
        const altM = tag.match(/\balt=(["'])([\s\S]*?)\1/i);
        const src = srcM ? srcM[2] : '';
        if (!src) return '';
        const alt = altM ? gAlt(altM[2]) : '';
        return `![${alt}](${copyAndRewriteImage(src, fileDir)})`;
    });
    return md;
}

// ---------------------------------------------------------------- notebook outputs

function mapNotebookOutputs(outputs: unknown[]): NotebookOutput[] {
    const result: NotebookOutput[] = [];
    if (!Array.isArray(outputs)) return result;
    for (const o of outputs) {
        if (result.length >= 8) break;
        const out = o as Record<string, unknown>;
        const type = out.output_type as string;
        if (type === 'stream') {
            const text = stripAnsi(joinSource(out.text));
            if (text.trim()) result.push({ kind: 'text', text: clip(text), stream: out.name as string });
        } else if (type === 'execute_result' || type === 'display_data') {
            const data = (out.data || {}) as Record<string, unknown>;
            const png = data['image/png'];
            if (typeof png === 'string' || Array.isArray(png)) {
                const b64 = (Array.isArray(png) ? png.join('') : png).replace(/\s/g, '');
                const bytes = Buffer.from(b64, 'base64');
                if (bytes.length <= 200_000) {
                    const hash = crypto.createHash('sha1').update(b64).digest('hex').slice(0, 16);
                    fs.mkdirSync(NB_IMG_DIR, { recursive: true });
                    fs.writeFileSync(path.join(NB_IMG_DIR, `${hash}.png`), bytes);
                    result.push({ kind: 'image', src: `/${PUBLIC_BASE_REL}/_nb/${hash}.png` });
                    continue;
                }
            }
            const plain = data['text/plain'];
            if (plain) { const t = joinSource(plain); if (t.trim()) result.push({ kind: 'text', text: clip(t) }); }
        } else if (type === 'error') {
            const tb = stripAnsi(joinSource((out.traceback as string[])?.join('\n')))
                || `${out.ename}: ${out.evalue}`;
            if (tb.trim()) result.push({ kind: 'text', text: clip(tb), stream: 'stderr' });
        }
    }
    return result;
}

function detectFramework(fileBase: string): NotebookFramework {
    const n = fileBase.toLowerCase();
    if (n.includes('pytorch')) return 'pytorch';
    if (n.includes('tf') || n.includes('keras') || n.includes('tensorflow')) return 'tensorflow';
    return 'generic';
}

// ---------------------------------------------------------------- per-file processing

interface ProcessedLesson { lesson: CourseLesson; }

function deriveSegments(moduleSlug: string, relWithinModule: string): { segments: string[]; isOverview: boolean } {
    const parts = relWithinModule.split('/');
    const last = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1);
    if (dirParts.length === 0 && /^readme\.md$/i.test(last)) return { segments: [moduleSlug], isOverview: true };
    const subSlugs = dirParts.map((d) => kebab(stripNumPrefix(d)));
    if (/^readme\.md$/i.test(last)) return { segments: [moduleSlug, ...subSlugs], isOverview: false };
    return { segments: [moduleSlug, ...subSlugs, kebab(stripExt(last))], isOverview: false };
}

function orderInModule(relWithinModule: string): number {
    const parts = relWithinModule.split('/');
    const last = parts[parts.length - 1];
    const base = kebab(stripExt(last));
    const fileRank = /^readme\.md$/i.test(last) ? 0
        : base === 'assignment' ? 90
            : /\.ipynb$/i.test(last) ? 40
                : (FILE_ORDER_HINT[base] ?? 20);
    if (parts.length === 1) {
        // direct module file: overview first (0), else 100 + rank
        return /^readme\.md$/i.test(last) ? 0 : 100 + fileRank;
    }
    const sub = numericPrefix(parts[0]);
    return 1000 + (sub ?? 500) * 10 + (fileRank / 100);
}

function processMarkdownFile(absFile: string, moduleId: string, moduleSlug: string, moduleTitle: string, moduleIcon: string): CourseLesson {
    const relWithinModule = path.relative(path.join(LESSONS_ROOT, moduleId), absFile).split(path.sep).join('/');
    const { segments } = deriveSegments(moduleSlug, relWithinModule);
    const fileDir = path.dirname(absFile);
    let body = fs.readFileSync(absFile, 'utf-8').replace(/\r\n/g, '\n');

    // title = first H1; strip that line from the body to avoid a duplicate header.
    let title = '';
    const h1 = body.match(/^#[ \t]+(.+?)[ \t]*#*$/m);
    if (h1) {
        title = headingVisibleText(h1[1]);
        body = body.slice(0, h1.index!) + body.slice(h1.index! + h1[0].length);
    } else {
        const anyH = body.match(/^#{1,6}[ \t]+(.+?)[ \t]*#*$/m);
        title = anyH ? headingVisibleText(anyH[1]) : prettify(path.basename(absFile));
    }
    title = cleanTitle(applyGlossary(title));
    body = cleanContent(body, fileDir);
    body = body.replace(/^\n+/, '').trimEnd() + '\n';

    const headings: CourseHeading[] = [];
    const hre = /^(#{1,3})[ \t]+(.+?)[ \t]*#*$/gm;
    let m: RegExpExecArray | null;
    while ((m = hre.exec(body)) !== null) {
        const text = headingVisibleText(m[2]);
        headings.push({ id: slugifyHeading(text), text, level: m[1].length });
    }
    const words = body.split(/\s+/).filter(Boolean).length;
    const relFromLessons = path.relative(LESSONS_ROOT, absFile).split(path.sep).join('/');

    return {
        kind: 'markdown',
        courseSlug: COURSE_SLUG,
        slug: segments.join('/'),
        segments,
        title,
        module: { id: moduleId, slug: moduleSlug, title: moduleTitle, icon: moduleIcon },
        lessonNumber: numericPrefix(relWithinModule.split('/')[0]) ?? null,
        orderInModule: orderInModule(relWithinModule),
        attribution: { ...ATTRIBUTION, sourcePath: `lessons/${relFromLessons}` },
        prev: null, next: null,
        markdown: body,
        headings,
        readingMinutes: Math.max(1, Math.ceil(words / 200)),
    };
}

function processNotebookFile(absFile: string, moduleId: string, moduleSlug: string, moduleTitle: string, moduleIcon: string): CourseLesson {
    const relWithinModule = path.relative(path.join(LESSONS_ROOT, moduleId), absFile).split(path.sep).join('/');
    const { segments } = deriveSegments(moduleSlug, relWithinModule);
    const fileDir = path.dirname(absFile);
    const fileBase = stripExt(path.basename(absFile));
    const nb = JSON.parse(fs.readFileSync(absFile, 'utf-8')) as Record<string, unknown>;
    const rawCells = (nb.cells as Record<string, unknown>[]) || [];

    const cells: NotebookCell[] = [];
    let title = '';
    for (const c of rawCells) {
        if (c.cell_type === 'markdown') {
            let source = joinSource(c.source).replace(/\r\n/g, '\n');
            if (!title) {
                const h = source.match(/^#{1,6}[ \t]+(.+?)[ \t]*#*$/m);
                if (h) {
                    title = headingVisibleText(h[1]);
                    // Strip the title heading so it does not duplicate the page header.
                    source = (source.slice(0, h.index!) + source.slice(h.index! + h[0].length)).replace(/^\n+/, '');
                }
            }
            source = cleanContent(source, fileDir);
            if (source.trim()) cells.push({ type: 'markdown', source });
        } else if (c.cell_type === 'code') {
            const source = joinSource(c.source).replace(/\r\n/g, '\n');
            if (!source.trim()) continue;
            cells.push({
                type: 'code',
                language: 'python',
                source,
                executionCount: (c.execution_count as number) ?? null,
                outputs: mapNotebookOutputs(c.outputs as unknown[]),
            });
        }
    }
    if (!title) title = prettify(path.basename(absFile));
    title = cleanTitle(applyGlossary(title));
    const relFromLessons = path.relative(LESSONS_ROOT, absFile).split(path.sep).join('/');

    return {
        kind: 'notebook',
        courseSlug: COURSE_SLUG,
        slug: segments.join('/'),
        segments,
        title,
        module: { id: moduleId, slug: moduleSlug, title: moduleTitle, icon: moduleIcon },
        lessonNumber: numericPrefix(relWithinModule.split('/')[0]) ?? null,
        orderInModule: orderInModule(relWithinModule),
        attribution: { ...ATTRIBUTION, sourcePath: `lessons/${relFromLessons}` },
        prev: null, next: null,
        framework: detectFramework(fileBase),
        cells,
        sourceNotebookUrl: `${UPSTREAM_URL}/blob/main/lessons/${relFromLessons}`,
    };
}

// ---------------------------------------------------------------- manifest rebuild

const flatName = (segments: string[]) => segments.join('__');

function moduleOrderOf(id: string): number {
    return MODULE_META[id]?.order ?? numericPrefix(id) ?? 99;
}

function rebuildManifest(): void {
    const files = fs.existsSync(LESSONS_OUT)
        ? fs.readdirSync(LESSONS_OUT).filter((f) => f.endsWith('.json'))
        : [];
    const lessons: CourseLesson[] = files.map((f) =>
        JSON.parse(fs.readFileSync(path.join(LESSONS_OUT, f), 'utf-8')));

    // Global order: module order, then orderInModule, then title.
    lessons.sort((a, b) => {
        const mo = moduleOrderOf(a.module.id) - moduleOrderOf(b.module.id);
        if (mo) return mo;
        if (a.orderInModule !== b.orderInModule) return a.orderInModule - b.orderInModule;
        return a.title.localeCompare(b.title);
    });

    // prev/next across the whole flattened course; rewrite each lesson file.
    lessons.forEach((lesson, i) => {
        const prev = i > 0 ? lessons[i - 1] : null;
        const next = i < lessons.length - 1 ? lessons[i + 1] : null;
        lesson.prev = prev ? { slug: prev.slug, title: prev.title } : null;
        lesson.next = next ? { slug: next.slug, title: next.title } : null;
        fs.writeFileSync(path.join(LESSONS_OUT, `${flatName(lesson.segments)}.json`), JSON.stringify(lesson, null, 1));
    });

    // Group into modules.
    const byModule = new Map<string, CourseLesson[]>();
    for (const l of lessons) {
        if (!byModule.has(l.module.id)) byModule.set(l.module.id, []);
        byModule.get(l.module.id)!.push(l);
    }
    const modules: CourseModule[] = [...byModule.keys()].sort((a, b) => moduleOrderOf(a) - moduleOrderOf(b)).map((id) => {
        const meta = MODULE_META[id];
        const group = byModule.get(id)!;
        const refs: CourseLessonRef[] = group.map((l) => ({
            slug: l.slug, segments: l.segments, title: l.title,
            lessonNumber: l.lessonNumber, kind: l.kind,
            framework: l.kind === 'notebook' ? l.framework : undefined,
            readingMinutes: l.kind === 'markdown' ? l.readingMinutes : undefined,
        }));
        return {
            id, order: moduleOrderOf(id),
            slug: meta?.slug ?? kebab(stripNumPrefix(id)),
            title: meta?.title ?? prettify(id),
            description: meta?.description,
            icon: meta?.icon,
            lessons: refs,
        };
    });

    const manifest: CourseManifest = {
        slug: COURSE_SLUG, title: COURSE_TITLE, language: 'ka', attribution: ATTRIBUTION,
        modules,
        totals: {
            modules: modules.length,
            lessons: lessons.length,
            notebooks: lessons.filter((l) => l.kind === 'notebook').length,
        },
        generatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(path.join(DATA_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`\nManifest: ${modules.length} modules, ${lessons.length} lessons (${manifest.totals.notebooks} notebooks).`);
}

// ---------------------------------------------------------------- main

function main(): void {
    if (!fs.existsSync(LESSONS_ROOT)) {
        console.error(`Source not found: ${LESSONS_ROOT}\nSet COURSE_SRC to the AI-For-Beginners-ka path.`);
        process.exit(1);
    }
    const arg = process.argv.find((a) => a.startsWith('--modules'));
    let filter: Set<string> | null = null;
    if (arg) {
        const val = arg.includes('=') ? arg.split('=')[1] : process.argv[process.argv.indexOf(arg) + 1];
        if (val) filter = new Set(val.split(',').map((s) => s.trim()).filter(Boolean));
    }

    fs.mkdirSync(LESSONS_OUT, { recursive: true });
    fs.mkdirSync(PUBLIC_OUT, { recursive: true });
    // A full run (no --modules) is authoritative: wipe stale lesson JSON so removed
    // sources (e.g. assignment pages) don't linger in the manifest.
    if (!filter) {
        for (const f of fs.readdirSync(LESSONS_OUT)) {
            if (f.endsWith('.json')) fs.unlinkSync(path.join(LESSONS_OUT, f));
        }
    }
    loadGlossary();

    const moduleDirs = fs.readdirSync(LESSONS_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
        .map((d) => d.name)
        .filter((name) => numericPrefix(name) !== null || name === 'X-Extras');

    const selected = moduleDirs.filter((id) => {
        if (!filter) return true;
        const order = String(moduleOrderOf(id));
        return filter.has(order) || filter.has(id) || filter.has(id.split('-')[0]);
    }).sort((a, b) => moduleOrderOf(a) - moduleOrderOf(b));

    if (selected.length === 0) {
        console.error('No modules matched the filter. Available:', moduleDirs.join(', '));
        process.exit(1);
    }
    console.log(`Ingesting modules: ${selected.join(', ')}`);

    let count = 0;
    for (const moduleId of selected) {
        const meta = MODULE_META[moduleId];
        const moduleSlug = meta?.slug ?? kebab(stripNumPrefix(moduleId));
        const moduleTitle = meta?.title ?? prettify(moduleId);
        const moduleIcon = meta?.icon ?? "book";
        const files = walk(path.join(LESSONS_ROOT, moduleId));
        for (const absFile of files) {
            const lesson = /\.ipynb$/i.test(absFile)
                ? processNotebookFile(absFile, moduleId, moduleSlug, moduleTitle, moduleIcon)
                : processMarkdownFile(absFile, moduleId, moduleSlug, moduleTitle, moduleIcon);
            fs.writeFileSync(path.join(LESSONS_OUT, `${flatName(lesson.segments)}.json`), JSON.stringify(lesson, null, 1));
            count++;
            console.log(`  ${lesson.kind === 'notebook' ? '📓' : '📄'} ${lesson.slug}  ←  ${lesson.attribution.sourcePath}`);
        }
    }

    rebuildManifest();
    console.log(`\nLessons written: ${count}. Images copied: ${copiedImages.size}.`);
    if (missingImages.size) console.warn(`Missing image refs (left as-is): ${[...missingImages].slice(0, 10).join(', ')}${missingImages.size > 10 ? ' …' : ''}`);
}

main();
