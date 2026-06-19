import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { CourseLesson } from '@/types/course';
import CourseLessonView from '@/components/courses/ai-for-beginners/CourseLessonView';

const DATA_DIR = path.join(process.cwd(), 'src/data/courses/ai-for-beginners/lessons');
const SITE = 'https://andrewaltair.ge';
const BASE = `${SITE}/encyclopedia/ai-for-beginners`;

// Dynamic on-demand rendering — NO generateStaticParams (avoids a ~120-page
// build fan-out / OOM on the 1-CPU VPS; mirrors the ai-2026 lesson route).
function getLesson(segments: string[]): CourseLesson | null {
    const flat = segments.join('__');
    // Guard against path traversal from the catch-all params.
    if (!/^[a-z0-9_-]+$/i.test(flat)) return null;
    const file = path.join(DATA_DIR, `${flat}.json`);
    try {
        if (!fs.existsSync(file)) return null;
        return JSON.parse(fs.readFileSync(file, 'utf-8')) as CourseLesson;
    } catch {
        return null;
    }
}

interface PageProps { params: { slug: string[] } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const lesson = getLesson(params.slug);
    if (!lesson) notFound();
    const url = `${BASE}/${params.slug.join('/')}`;
    const description = `${lesson.title} — ${lesson.module.title}. AI დამწყებთათვის: Microsoft-ის ღია კურსის ქართული თარგმანი.`;
    // Georgian-font-aware OG card (nodejs /api/og route) so shared links show a proper title image.
    const ogImage = `${SITE}/api/og?title=${encodeURIComponent(lesson.title)}&description=${encodeURIComponent(lesson.module.title)}&type=post`;
    return {
        title: `${lesson.title} | AI დამწყებთათვის`,
        description,
        openGraph: { title: lesson.title, description, type: 'article', url, images: [{ url: ogImage, width: 1200, height: 630, alt: lesson.title }] },
        twitter: { card: 'summary_large_image', title: lesson.title, description, images: [ogImage] },
        alternates: { canonical: url },
    };
}

export default function CourseLessonPage({ params }: PageProps) {
    const lesson = getLesson(params.slug);
    if (!lesson) notFound();

    const url = `${BASE}/${params.slug.join('/')}`;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: lesson.title,
        inLanguage: 'ka-GE',
        isPartOf: { '@type': 'Course', name: 'AI დამწყებთათვის', url: BASE },
        author: { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Andrew Altair', url: `${SITE}/about` },
        publisher: { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Andrew Altair' },
        isBasedOn: { '@type': 'CreativeWork', name: 'Microsoft AI for Beginners', url: lesson.attribution.url, license: 'https://opensource.org/licenses/MIT' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    };

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'მთავარი', item: SITE },
            { '@type': 'ListItem', position: 2, name: 'AI დამწყებთათვის', item: BASE },
            { '@type': 'ListItem', position: 3, name: lesson.title, item: url },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
            <CourseLessonView lesson={lesson} />
        </>
    );
}
