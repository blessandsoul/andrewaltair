import type { Metadata } from 'next';
import Link from 'next/link';
import { TbArrowRight, TbBook2, TbNotebook, TbHeart, TbBrandGithub, TbUsers, TbRoute, TbListCheck } from 'react-icons/tb';
import manifestJson from '@/data/courses/ai-for-beginners/manifest.json';
import type { CourseManifest } from '@/types/course';
import ModuleIcon from '@/components/courses/ai-for-beginners/ModuleIcon';

const manifest = manifestJson as CourseManifest;
const SITE = 'https://andrewaltair.ge';
const BASE = `${SITE}/encyclopedia/ai-for-beginners`;
const DESCRIPTION = 'ხელოვნური ინტელექტის უფასო კურსი ქართულად: ნეირონული ქსელები, კომპიუტერული ხედვა, ბუნებრივი ენის დამუშავება და მეტი. Microsoft-ის ღია კურსის თარგმანი, თეორია და პრაქტიკული Python ნოუთბუქები.';
const OG_IMAGE = `${SITE}/api/og?title=${encodeURIComponent('AI დამწყებთათვის')}&description=${encodeURIComponent('ხელოვნური ინტელექტის უფასო კურსი ქართულად')}&type=default`;

export const metadata: Metadata = {
    title: 'AI დამწყებთათვის — ხელოვნური ინტელექტის უფასო კურსი ქართულად',
    description: DESCRIPTION,
    keywords: ['AI', 'ხელოვნური ინტელექტი', 'კურსი', 'ნეირონული ქსელები', 'machine learning', 'ქართულად', 'უფასო'],
    alternates: { canonical: BASE },
    openGraph: { title: 'AI დამწყებთათვის — უფასო კურსი ქართულად', description: DESCRIPTION, type: 'website', url: BASE, images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AI დამწყებთათვის' }] },
    twitter: { card: 'summary_large_image', title: 'AI დამწყებთათვის — უფასო კურსი ქართულად', description: DESCRIPTION, images: [OG_IMAGE] },
};

const TEACHES = [
    'ხელოვნური ინტელექტის საფუძვლები', 'სიმბოლური AI და საექსპერტო სისტემები',
    'ნეირონული ქსელები', 'კომპიუტერული ხედვა', 'ბუნებრივი ენის დამუშავება', 'პასუხისმგებლიანი AI',
];

export default function AIForBeginnersLanding() {
    const start = manifest.modules.find((m) => m.slug === 'intro')?.lessons[0]?.slug
        ?? manifest.modules[0]?.lessons[0]?.slug ?? 'intro';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'AI დამწყებთათვის',
        description: DESCRIPTION,
        inLanguage: 'ka',
        url: BASE,
        isAccessibleForFree: true,
        educationalLevel: 'Beginner',
        teaches: TEACHES,
        numberOfLessons: manifest.totals.lessons,
        provider: { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Andrew Altair', url: SITE },
        author: { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Andrew Altair' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', inLanguage: 'ka' },
        isBasedOn: { '@type': 'CreativeWork', name: 'Microsoft AI for Beginners', url: manifest.attribution.url, license: 'https://opensource.org/licenses/MIT' },
    };

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'მთავარი', item: SITE },
            { '@type': 'ListItem', position: 2, name: 'ენციკლოპედია', item: `${SITE}/encyclopedia` },
            { '@type': 'ListItem', position: 3, name: 'AI დამწყებთათვის', item: BASE },
        ],
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute -top-32 -right-24 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />
                <div className="relative max-w-5xl mx-auto px-4 lg:px-8 pt-20 pb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                        <TbHeartFree /> უფასო და ღია კურსი
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-5">
                        AI <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">დამწყებთათვის</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        ხელოვნური ინტელექტის სრული კურსი ქართულად. თეორია გასაგებ ენაზე და პრაქტიკული Python ნოუთბუქები, ნულიდან ექსპერტამდე.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                        <Link href={`/encyclopedia/ai-for-beginners/${start}`}
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all">
                            დაიწყე სწავლა <TbArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/encyclopedia/ai-for-beginners/library"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-800 rounded-xl font-semibold border border-gray-200 hover:border-emerald-300 transition-all">
                            ყველა გაკვეთილი
                        </Link>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5"><TbBook2 className="w-4 h-4 text-emerald-600" /> {manifest.totals.lessons} გაკვეთილი</span>
                        <span className="inline-flex items-center gap-1.5"><TbNotebook className="w-4 h-4 text-emerald-600" /> {manifest.totals.notebooks} პრაქტიკული ნოუთბუქი</span>
                        <span className="inline-flex items-center gap-1.5"><TbHeartFree /> 100% უფასო</span>
                    </div>
                </div>
            </section>

            {/* What you'll learn */}
            <section className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">რას ისწავლი</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TEACHES.map((t) => (
                        <div key={t} className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> {t}
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works / who for / prerequisites */}
            <section className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">როგორ მუშაობს კურსი</h2>
                <p className="text-gray-500 text-center max-w-2xl mx-auto mb-8">
                    ეს არის Microsoft-ის ღია კურსის „AI for Beginners“ სრული ქართული თარგმანი. ისწავლე საკუთარი ტემპით, უფასოდ.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4">
                            <TbUsers size={22} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">ვისთვის არის</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">დამწყებთათვის, სტუდენტებისთვის და დეველოპერებისთვის. ნებისმიერი, ვისაც სურს AI გაიგოს ნულიდან. წინასწარი ცოდნა საჭირო არ არის.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4">
                            <TbRoute size={22} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">როგორ ისწავლი</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">თეორია გასაგებ ქართულ ენაზე, შემდეგ პრაქტიკა Python-ის ნოუთბუქებში. გაკვეთილები თანმიმდევრულია, გადადი მოდულიდან მოდულზე.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4">
                            <TbListCheck size={22} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">რა გჭირდება</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">თეორიისთვის — მხოლოდ ბრაუზერი. პრაქტიკული ნოუთბუქებისთვის — Python-ის საბაზისო ცოდნა და უფასო Google Colab ან Jupyter.</p>
                    </div>
                </div>
            </section>

            {/* Modules overview */}
            <section className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">კურსის მოდულები</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {manifest.modules.map((m) => (
                        <Link key={m.id} href="/encyclopedia/ai-for-beginners/library"
                            className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                                <ModuleIcon name={m.icon} size={24} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{m.title}</h3>
                                {m.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.description}</p>}
                                <p className="text-xs text-emerald-600/80 mt-2 font-medium">{m.lessons.length} გაკვეთილი</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Final CTA + attribution */}
            <section className="max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">მზად ხარ დასაწყებად?</h2>
                    <p className="text-emerald-50 mb-6 max-w-xl mx-auto">ყველა გაკვეთილი უფასოა. დაიწყე პირველი მოდულით და იარე საკუთარი ტემპით.</p>
                    <Link href={`/encyclopedia/ai-for-beginners/${start}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-700 rounded-xl font-bold hover:-translate-y-0.5 transition-all">
                        პირველი გაკვეთილი <TbArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                <p className="mt-8 text-xs text-gray-400 leading-relaxed inline-flex items-center gap-1.5 flex-wrap justify-center">
                    <TbBrandGithub className="w-4 h-4" />
                    ეს კურსი არის{' '}
                    <a href={manifest.attribution.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Microsoft “AI for Beginners”</a>{' '}
                    -ის ქართული თარგმანი, გავრცელებული {manifest.attribution.license} ლიცენზიით.
                </p>
            </section>
        </div>
    );
}

function TbHeartFree() {
    return <TbHeart className="w-4 h-4 text-emerald-600" />;
}
