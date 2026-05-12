#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Grok Content Cluster — DB migration script.
 *
 * Plants 3-post topical cluster around the Georgian keyword `გროკი` (679 GSC impressions,
 * 0.15% CTR at pos ~8). Strategy: patch existing Pentagon/Grok post + insert 2 new posts
 * + wire all three via manual `relatedPosts` field (so PostService.getRelatedPosts shows
 * the cluster, not random recent posts).
 *
 * SAFE BY DEFAULT — runs dry-run; nothing is written until `--apply` is passed.
 *
 * Usage:
 *   npx tsx scripts/seo-grok-cluster.ts                  # dry-run preview (read-only)
 *   npx tsx scripts/seo-grok-cluster.ts --apply          # writes new posts as DRAFTS
 *   npx tsx scripts/seo-grok-cluster.ts --apply --publish  # writes new posts as PUBLISHED
 *
 * Notes:
 *   - Existing post body content is NEVER touched. Only title/seo/faq/relatedPosts.
 *   - New posts are upsert-by-slug (idempotent). Re-running same flags is safe.
 *   - Requires MONGODB_URI in .env.local.
 */

import { config as dotenvConfig } from 'dotenv';
import path from 'path';
// Next.js convention: secrets live in .env.local (not .env). Load it explicitly.
dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') });
dotenvConfig(); // fallback to .env if present
import mongoose from 'mongoose';
import Post from '../src/models/Post';

const EXISTING_SLUG = '-generali-groki-pentagonis-akhali-tvini';
const NEW_SLUG_PILLAR = 'grokis-akhali-shesadzleblobebi-2026';
const NEW_SLUG_COMPARE = 'grok-vs-claude-vs-chatgpt-shedareba';

const APPLY = process.argv.includes('--apply');
const PUBLISH = process.argv.includes('--publish');

function log(label: string, payload?: unknown) {
    if (payload === undefined) console.log(`[grok-cluster] ${label}`);
    else console.log(`[grok-cluster] ${label}`, payload);
}

const EXISTING_PATCH = {
    title: 'გენერალი გროკი: Pentagon-ის ახალი AI ტვინი — როგორ ცვლის ომის წესებს',
    seo: {
        metaTitle: 'გენერალი გროკი: Pentagon-ის AI ტვინი — ვის ემსახურება?',
        metaDescription:
            'გროკი ახლა Pentagon-ის ხელშია. xAI-ის მოდელი მართავს დაზვერვას, სამიზნე ანალიზს და ლოგისტიკას. ექსკლუზიური ანალიზი — როგორ ცვლის გენერალი გროკი ომის წესებს.',
        focusKeyword: 'გროკი',
    },
    faq: [
        {
            question: 'რა არის გროკი?',
            answer:
                'გროკი (Grok) — xAI-ის (ილონ მასკის კომპანია) ხელოვნური ინტელექტი, რომელიც Twitter/X-ის რეალურ დროში სიახლეებზე ეფუძნება. განსხვავდება ChatGPT-სა და Claude-სგან მისი დაუცენზურებელი ტონითა და სოციალურ მედიასთან პირდაპირი წვდომით.',
        },
        {
            question: 'რა შეუძლია გროკი 4-ს რაც ChatGPT-ს არ შეუძლია?',
            answer:
                'რეალურ დროში X-ის (Twitter) მონაცემები, აგრესიული გრძელვადიანი თვითირონია, ვიდეო და სურათების გენერაცია Aurora მოდელით, ნაკლები კონტენტ-ფილტრები. Pentagon-მა გროკი 4-ის სამხედრო ვერსია სწორედ რეალურ-დროიანი ანალიზის გამო შეარჩია.',
        },
        {
            question: 'შემიძლია გროკის გამოყენება ქართულად?',
            answer:
                'დიახ, გროკი 3-დან მოყოლებული მხარს უჭერს ქართულ ენას როგორც ჩაწერისთვის, ისე ხმოვან რეჟიმში. ხარისხი ChatGPT-ის დონეზე ჯერ ვერ მიდის, მაგრამ კონტენტის გენერაცია, ანალიზი და კოდის წერა მუშაობს.',
        },
        {
            question: 'რამდენი ღირს გროკი?',
            answer:
                'უფასო ვერსია ხელმისაწვდომია X-ის ანგარიშის მქონეთათვის. Premium ($8/თვე) — სრული წვდომა გროკი 4-ზე. SuperGrok ($30/თვე) — გაფართოებული მეხსიერება და Aurora გენერაცია. Pentagon-ის კონტრაქტი ცალკე — შეფასებით $200M+.',
        },
        {
            question: 'უსაფრთხოა გროკის გამოყენება ბიზნესისთვის?',
            answer:
                'xAI-ის Enterprise API-ს აქვს SOC 2 სერტიფიკაცია და მონაცემთა იზოლაცია. თუმცა Pentagon-ის ბოლო ინტეგრაცია მიუთითებს, რომ მოდელი მაღალი რისკის ოპერაციებზე გამოიყენება — საქმიანი დანერგვის წინ აუცილებელია მონაცემთა გადადინების ანალიზი.',
        },
    ],
    relatedPosts: [NEW_SLUG_PILLAR, NEW_SLUG_COMPARE],
};

const NEW_PILLAR_HTML = `
<p>2026-ის თებერვალში xAI-მ გამოუშვა <strong>გროკი 4</strong> — მოდელი, რომელიც ერთბაშად შევიდა Pentagon-ის სამხედრო კონტრაქტებში, Aurora ვიდეო გენერაციაში და მილიონ-ტოკენიან კონტექსტ-ფანჯარაში. ეს გზამკვლევი ხსნის ყველაფერს ქართულად.</p>

<h2>გროკი 4-ის ძირითადი შესაძლებლობები</h2>
<ul>
  <li><strong>რეალურ-დროიანი X-ის ძიება</strong> — სხვა მოდელები ვერ აკეთებენ</li>
  <li><strong>Aurora ვიდეო და სურათები</strong> — DALL-E + Sora-ის კონკურენტი</li>
  <li><strong>ხმოვანი რეჟიმი</strong> — 50+ ენაზე, ქართულის ჩათვლით</li>
  <li><strong>გრძელვადიანი მეხსიერება (SuperGrok)</strong> — 1M ტოკენი context window</li>
  <li><strong>კოდის გენერაცია</strong> — Cursor-ისა და GitHub Copilot-ის ალტერნატივა</li>
</ul>
<p>დაკავშირებული AI ხელსაწყოები: <a href="/tools">AI ინსტრუმენტები</a>.</p>

<h2>ფასები 2026-ში</h2>
<table>
  <thead><tr><th>გეგმა</th><th>ფასი</th><th>რა შედის</th></tr></thead>
  <tbody>
    <tr><td>უფასო</td><td>$0</td><td>X-ის ანგარიში, ლიმიტირებული გროკი 4</td></tr>
    <tr><td>Premium</td><td>$8/თვე</td><td>სრული გროკი 4, Aurora, X Premium</td></tr>
    <tr><td>SuperGrok</td><td>$30/თვე</td><td>1M context, Aurora ვიდეო, ხმოვანი ლიდერი</td></tr>
    <tr><td>Enterprise</td><td>კონტრაქტული</td><td>SOC 2, მონაცემთა იზოლაცია</td></tr>
  </tbody>
</table>

<h2>როგორ გამოვიყენოთ გროკი ქართულად</h2>
<ol>
  <li>X-ის ანგარიში → <a href="https://grok.com" rel="nofollow">grok.com</a></li>
  <li>ან მობილური აპლიკაცია (iOS/Android)</li>
  <li>პრომპტი ქართულად რთეთ — სიჩქარე ChatGPT-ის დონეზე</li>
  <li>ხმოვან რეჟიმში — დააჭირეთ მიკროფონს</li>
</ol>
<p>გროკისთვის უკეთესი პრომპტი ააწყვეთ <a href="/prompt-builder">პრომპტ ბილდერით</a>.</p>

<h2>Pentagon-ის კონტრაქტი — რას ნიშნავს მომხმარებლისთვის</h2>
<p>სამხედრო ვერსია იზოლირებულია მოქალაქე ვერსიისგან. მონაცემთა იზოლაცია გარანტირებულია xAI-ის მიერ. სრული ანალიზი: <a href="/blog/-generali-groki-pentagonis-akhali-tvini">გენერალი გროკი: Pentagon-ის AI ტვინი</a>.</p>

<h2>გროკი vs ChatGPT vs Claude</h2>
<p>გროკი — საუკეთესო real-time ნიუსისთვის და ვიდეო გენერაციისთვის. Claude — საუკეთესო კოდის და გრძელვადიანი მსჯელობისთვის. ChatGPT — ფართო ეკოსისტემა და GPT Store. სრული შედარება: <a href="/blog/grok-vs-claude-vs-chatgpt-shedareba">გროკი vs Claude vs ChatGPT</a>.</p>

<h2>შეცდომები, რომელთა თავიდან არიდება ღირს</h2>
<ol>
  <li>დაიმედება Aurora-ზე პროდუქცია გრაფიკისთვის (ჯერ არასაკმარისად ზუსტი)</li>
  <li>ფინანსურ რჩევებზე გროკის სრული ნდობა (real-time X = ხმაური)</li>
  <li>PII (პერსონალური მონაცემები) გროკისთვის გადაცემა Premium ვერსიაში</li>
</ol>

<h2>დასკვნა</h2>
<p>გროკი 4 — ერთ-ერთი ყველაზე სწრაფი მოდელი 2026-ში. საუკეთესოა real-time სიახლეებისთვის და ვიდეო გენერაციისთვის. ChatGPT და Claude უკეთესია გრძელვადიანი მსჯელობისთვის. ბიზნეს გადაწყვეტილებებში დახმარებისთვის → <a href="/services">AI კონსულტაცია</a>.</p>
`.trim();

const NEW_COMPARE_HTML = `
<p>2026-ის სამი მთავარი AI მოდელი: <strong>გროკი 4</strong> (xAI), <strong>Claude Opus 4.7</strong> (Anthropic) და <strong>ChatGPT 5</strong> (OpenAI). ეს არ არის "რომელი ჯობია" — ეს არის "რომელი თქვენი ამოცანისთვის".</p>

<h2>სიჩქარე და კონტექსტი</h2>
<table>
  <thead><tr><th>მოდელი</th><th>Context</th><th>სიჩქარე</th><th>ფასი/1M ტოკენი</th></tr></thead>
  <tbody>
    <tr><td>გროკი 4</td><td>256K (1M SuperGrok)</td><td>სწრაფი</td><td>$3 / $15</td></tr>
    <tr><td>Claude Opus 4.7</td><td>1M</td><td>საშუალო</td><td>$15 / $75</td></tr>
    <tr><td>ChatGPT 5</td><td>400K</td><td>სწრაფი</td><td>$5 / $20</td></tr>
  </tbody>
</table>

<h2>ქართული ენა</h2>
<ul>
  <li>გროკი — კარგი (B2-C1), ხანდახან არასწორი დიალექტი</li>
  <li>Claude — საუკეთესო (C1-C2), ლიტერატურული ქართული</li>
  <li>ChatGPT — საუკეთესო, განსაკუთრებით სასაუბრო რეგისტრში</li>
</ul>

<h2>კოდის გენერაცია</h2>
<ul>
  <li>Claude Opus 4.7 — Claude Code CLI, SOTA SWE-bench, რეფაქტორინგი</li>
  <li>ChatGPT 5 — Codex CLI, Agents SDK, ფართო პლაგინ ეკოსისტემა</li>
  <li>გროკი 4 — Cursor-ში პოპულარული</li>
</ul>

<h2>ვიდეო და სურათები</h2>
<ul>
  <li>გროკი 4 — Aurora native, ვიდეო 8 წამამდე</li>
  <li>Claude — სურათების მხოლოდ ანალიზი, არ აგენერირებს</li>
  <li>ChatGPT 5 — DALL-E 4, GPT Image 1</li>
</ul>

<h2>Real-time ინფორმაცია</h2>
<p>გროკი — Twitter/X პირდაპირი წვდომა, საათ-საათობრივი. სხვა მოდელები — ვებ ძიება მხოლოდ. დასკვნა: გროკი &gt; ყველა X/Twitter ნიუსისთვის.</p>

<h2>ეთიკა და ცენზურა</h2>
<p>გროკი — მინიმალური ფილტრები (Pentagon-ის სამიზნე ანალიზის გამო, იხილეთ <a href="/blog/-generali-groki-pentagonis-akhali-tvini">Pentagon-ის გროკი</a>). Claude — Constitutional AI, ყველაზე ფრთხილი. ChatGPT — საშუალო ფილტრები.</p>

<h2>რომელი თქვენთვის?</h2>
<table>
  <thead><tr><th>ამოცანა</th><th>რეკომენდაცია</th></tr></thead>
  <tbody>
    <tr><td>ქართული კონტენტი</td><td>Claude ან ChatGPT</td></tr>
    <tr><td>Twitter ანალიზი</td><td>გროკი</td></tr>
    <tr><td>კოდი დიდი პროექტისთვის</td><td>Claude Opus 4.7</td></tr>
    <tr><td>სურათები</td><td>ChatGPT (DALL-E)</td></tr>
    <tr><td>ვიდეო</td><td>გროკი (Aurora)</td></tr>
    <tr><td>აკადემიური წერა</td><td>Claude</td></tr>
    <tr><td>ცხელ-ცხელი ანალიზი</td><td>გროკი</td></tr>
  </tbody>
</table>

<h2>დასკვნა</h2>
<p>სამივე ფასობს $20-30 თვეში, თუ პროფესიონალურად მუშაობთ — სამივეს გამოწერა გონივრულია. გროკი მარტო — საუკეთესო real-time + სასკავა ფასი. სრული გროკის გზამკვლევი: <a href="/blog/grokis-akhali-shesadzleblobebi-2026">გროკის ახალი შესაძლებლობები 2026</a>. დახმარების სჭირდებათ AI სტრატეგიაში? <a href="/services">დაგვიკავშირდით</a>.</p>
`.trim();

const NEW_PILLAR_DOC = {
    slug: NEW_SLUG_PILLAR,
    title: 'გროკის ახალი შესაძლებლობები 2026-ში: სრული გზამკვლევი',
    excerpt:
        'xAI-ის გროკი 4 ცვლის წესებს — Pentagon-ის კონტრაქტიდან Aurora-ს ვიდეო გენერაციამდე. რა შეუძლია, რა არ შეუძლია, და როგორ გამოვიყენოთ ქართულად.',
    content: NEW_PILLAR_HTML,
    categories: ['articles', 'ai'],
    tags: ['გროკი', 'Grok', 'xAI', 'AI 2026', 'ხელოვნური ინტელექტი'],
    author: { name: 'Andrew Altair', avatar: '/andrewaltair.png', role: 'god' },
    readingTime: 8,
    seo: {
        metaTitle: 'გროკის ახალი შესაძლებლობები 2026 — სრული გზამკვლევი',
        metaDescription:
            'გროკი 4-ის სრული გზამკვლევი: ფასები, შესაძლებლობები, Aurora გენერაცია, X-სთან ინტეგრაცია და როგორ შევადაროთ ChatGPT-სა და Claude-ს. ქართულად 2026.',
        focusKeyword: 'გროკი',
    },
    keyPoints: [
        'გროკი 4 — xAI-ის უახლესი მოდელი 2026-ის თებერვლიდან',
        'რეალურ-დროიანი X/Twitter წვდომა და Aurora ვიდეო — გროკის უპირატესობა',
        'Pentagon-ის $200M+ კონტრაქტი ცვლის xAI-ის როლს',
        'Premium $8/თვე | SuperGrok $30/თვე — საუკეთესო ფასი ერთეულ მოდელზე',
        'ქართული ენის მხარდაჭერა B2-C1, Claude/ChatGPT-ზე ოდნავ სუსტი',
    ],
    faq: [
        { question: 'გროკი მუშაობს ქართულად?', answer: 'დიახ, გროკი 3-დან მოყოლებული — ჩაწერით და ხმოვან რეჟიმში.' },
        { question: 'რა განასხვავებს გროკის ChatGPT-სგან?', answer: 'რეალურ-დროიანი X-ის წვდომა, ნაკლები ცენზურა, Aurora ვიდეო.' },
        { question: 'რამდენი ღირს გროკი?', answer: 'უფასო → Premium $8 → SuperGrok $30 → Enterprise კონტრაქტული.' },
        { question: 'Pentagon-მა მართლა იყიდა გროკი?', answer: 'დიახ, $200M+-ის კონტრაქტი 2026 თებერვალში.' },
        { question: 'უსაფრთხოა გროკი ბიზნესისთვის?', answer: 'Enterprise API — SOC 2 + მონაცემთა იზოლაცია. Premium — შენახულია xAI-ის სერვერებზე.' },
    ],
    entities: ['xAI', 'Grok', 'Elon Musk', 'Aurora', 'Pentagon', 'OpenAI', 'Anthropic'],
    relatedPosts: [EXISTING_SLUG, NEW_SLUG_COMPARE],
};

const NEW_COMPARE_DOC = {
    slug: NEW_SLUG_COMPARE,
    title: 'გროკი vs Claude vs ChatGPT 2026: სრული შედარება ქართულად',
    excerpt:
        '2026-ის სამი მთავარი AI მოდელი: გროკი 4, Claude Opus 4.7 და ChatGPT 5. რომელი რა ამოცანებზე ჯობია — ბენჩმარკები, ფასები, ქართული ენა.',
    content: NEW_COMPARE_HTML,
    categories: ['articles', 'ai'],
    tags: ['გროკი', 'Claude', 'ChatGPT', 'AI შედარება', 'LLM 2026'],
    author: { name: 'Andrew Altair', avatar: '/andrewaltair.png', role: 'god' },
    readingTime: 10,
    seo: {
        metaTitle: 'გროკი vs Claude vs ChatGPT 2026 — სრული შედარება',
        metaDescription:
            'გროკი 4 vs Claude Opus 4.7 vs ChatGPT 5 — სრული შედარება 2026 წელს. ბენჩმარკები, ფასები, ქართული ენა, კოდის გენერაცია, ვიდეო. რომელი მოდელი თქვენთვის?',
        focusKeyword: 'გროკი vs claude',
    },
    keyPoints: [
        'სამივე მოდელი ფასობს $20-30/თვე Pro დონეზე',
        'Claude — საუკეთესო კოდისთვის და ქართული აკადემიური წერისთვის',
        'გროკი — საუკეთესო real-time ნიუსისთვის და ვიდეო გენერაციისთვის',
        'ChatGPT — ფართო ეკოსისტემა, DALL-E სურათები, GPT Store',
        'პროფესიონალებისთვის — სამივეს გამოწერა (~$60/თვე) ოპტიმალურია',
    ],
    faq: [
        { question: 'რომელია ყველაზე იაფი?', answer: 'უფასო ვერსიები — ყველაფერია. ფასიანი — გროკი Premium $8.' },
        { question: 'რომელია ყველაზე ჭკვიანი?', answer: 'ბენჩმარკებზე Claude Opus 4.7 ლიდერი, მაგრამ ეს დამოკიდებულია ამოცანაზე.' },
        { question: 'შეიძლება სამივეს გამოწერა?', answer: 'დიახ — სრული PRO სტეკი ~$60/თვე. ბევრი პროფესიონალი ასე იქცევა.' },
        { question: 'რომელი ჯობია ქართულისთვის?', answer: 'Claude ან ChatGPT. გროკი — დამხმარე ინსტრუმენტი.' },
        { question: 'უსაფრთხოა ისინი ბიზნესისთვის?', answer: 'სამივეს აქვს Enterprise API. Claude — ყველაზე მკაცრი privacy ფილოსოფია.' },
    ],
    entities: ['Grok', 'Claude', 'ChatGPT', 'OpenAI', 'Anthropic', 'xAI'],
    relatedPosts: [EXISTING_SLUG, NEW_SLUG_PILLAR],
};

async function main() {
    log('===================================');
    log(`MODE: ${APPLY ? (PUBLISH ? 'APPLY + PUBLISH (live)' : 'APPLY (drafts)') : 'DRY-RUN (no writes)'}`);
    log('===================================');

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI not set. Add it to .env.local. Exiting.');
        process.exit(1);
    }

    if (APPLY) {
        await mongoose.connect(process.env.MONGODB_URI, { family: 4, serverSelectionTimeoutMS: 5000 });
        log('Connected to MongoDB.');
    }

    // ── (1) Existing post — patch metadata only ─────────────────────────
    log('\n[1/3] Existing post:', EXISTING_SLUG);
    if (APPLY) {
        const existing = await Post.findOne({ slug: EXISTING_SLUG });
        if (!existing) {
            log('  ⚠️  NOT FOUND. Aborting before writing new posts to avoid cluster orphans.');
            await mongoose.disconnect();
            process.exit(2);
        }
        log('  found _id:', existing._id.toString());
        log('  old title:', existing.title);

        existing.title = EXISTING_PATCH.title;
        existing.seo = { ...(existing.seo || {}), ...EXISTING_PATCH.seo };

        // Merge FAQ — append only entries whose question is not already present.
        const existingQuestions = new Set((existing.faq || []).map((f: any) => f.question.trim()));
        const newFaqs = EXISTING_PATCH.faq.filter((f) => !existingQuestions.has(f.question.trim()));
        existing.faq = [...(existing.faq || []), ...newFaqs];
        log(`  FAQ: ${(existing.faq || []).length - newFaqs.length} existing + ${newFaqs.length} appended`);

        // Merge relatedPosts — dedupe.
        const relatedSet = new Set([...(existing.relatedPosts || []), ...EXISTING_PATCH.relatedPosts]);
        existing.relatedPosts = Array.from(relatedSet).filter((s) => s !== EXISTING_SLUG);
        log('  relatedPosts:', existing.relatedPosts);

        await existing.save();
        log('  ✅ saved.');
    } else {
        log('  would patch title →', EXISTING_PATCH.title);
        log('  would patch seo.metaDescription →', EXISTING_PATCH.seo.metaDescription);
        log(`  would append ${EXISTING_PATCH.faq.length} FAQ items (skip dupes by question)`);
        log('  would add relatedPosts:', EXISTING_PATCH.relatedPosts);
    }

    // ── (2) New pillar post ─────────────────────────────────────────────
    log('\n[2/3] New pillar post:', NEW_SLUG_PILLAR);
    const pillarDoc = { ...NEW_PILLAR_DOC, status: PUBLISH ? 'published' : 'draft', publishedAt: new Date() };
    if (APPLY) {
        const result = await Post.findOneAndUpdate(
            { slug: NEW_SLUG_PILLAR },
            { $setOnInsert: pillarDoc },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        log(`  ${result?.createdAt?.getTime() === result?.updatedAt?.getTime() ? '✅ inserted' : '↺ already existed (skipped — slug uniqueness)'}, _id=`, result?._id.toString());
        log('  status:', result?.status);
    } else {
        log('  would upsert with status=', pillarDoc.status);
        log('  title:', pillarDoc.title);
        log('  tags:', pillarDoc.tags.join(', '));
        log('  relatedPosts:', pillarDoc.relatedPosts);
    }

    // ── (3) New comparison post ─────────────────────────────────────────
    log('\n[3/3] New comparison post:', NEW_SLUG_COMPARE);
    const compareDoc = { ...NEW_COMPARE_DOC, status: PUBLISH ? 'published' : 'draft', publishedAt: new Date() };
    if (APPLY) {
        const result = await Post.findOneAndUpdate(
            { slug: NEW_SLUG_COMPARE },
            { $setOnInsert: compareDoc },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        log(`  ${result?.createdAt?.getTime() === result?.updatedAt?.getTime() ? '✅ inserted' : '↺ already existed (skipped — slug uniqueness)'}, _id=`, result?._id.toString());
        log('  status:', result?.status);
    } else {
        log('  would upsert with status=', compareDoc.status);
        log('  title:', compareDoc.title);
        log('  tags:', compareDoc.tags.join(', '));
        log('  relatedPosts:', compareDoc.relatedPosts);
    }

    if (APPLY) {
        await mongoose.disconnect();
        log('\nDisconnected. Cluster wired.');
        log('Next step: GSC → URL Inspection → Request Indexing on all three URLs.');
    } else {
        log('\n[DRY-RUN COMPLETE] Re-run with --apply to write drafts, --apply --publish to go live.');
    }
}

main().catch((err) => {
    console.error('FATAL', err);
    process.exit(1);
});
