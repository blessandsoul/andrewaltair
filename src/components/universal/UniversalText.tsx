'use client';
import { motion } from 'framer-motion';
import { HeroModern, TextColumns, HighlightBox, QuoteMinimal, AuthorBioInline } from '@/types/universalSections';
import { TbBulb, TbAlertTriangle, TbQuote } from 'react-icons/tb';

// 1. Hero Modern
export function HeroModernComponent({ data }: { data: HeroModern }) {
    return (
        <div className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden rounded-3xl my-8">
            {data.video_url ? (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src={data.video_url} />
                </video>
            ) : (
                <img src={data.image_url} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black" style={{ opacity: data.overlay_opacity || 0.4 }} />
            <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                {data.subtitle && <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4">{data.subtitle}</span>}
                <h1 className="text-4xl md:text-6xl font-bold mb-0 tracking-tight">{data.title}</h1>
            </div>
        </div>
    );
}

// 2. Text Columns
export function TextColumnsComponent({ data }: { data: TextColumns }) {
    return (
        <div className={`grid gap-8 my-8 md:grid-cols-${data.cols_count || 2}`}>
            {data.columns.map((col, idx) => (
                <div key={idx} className="prose prose-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: col }} /> // Ideally parse markdown
            ))}
        </div>
    );
}

// 3. Highlight Box
export function HighlightBoxComponent({ data }: { data: HighlightBox }) {
    const styles = {
        tip: { bg: 'bg-green-50', border: 'border-green-200', icon: TbBulb, color: 'text-green-700' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: TbAlertTriangle, color: 'text-amber-700' },
        idea: { bg: 'bg-blue-50', border: 'border-blue-200', icon: TbBulb, color: 'text-blue-700' },
        quote: { bg: 'bg-purple-50', border: 'border-purple-200', icon: TbQuote, color: 'text-purple-700' },
    }[data.variant];

    const Icon = styles.icon;

    return (
        <div className={`p-6 rounded-xl border-l-4 ${styles.bg} ${styles.border} my-8`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full bg-white/50 ${styles.color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    {data.title && <h4 className={`font-bold mb-2 ${styles.color}`}>{data.title}</h4>}
                    <div className="text-gray-800">{data.content}</div>
                </div>
            </div>
        </div>
    );
}

// 4. Quote Minimal
export function QuoteMinimalComponent({ data }: { data: QuoteMinimal }) {
    return (
        <div className="text-center my-12 md:px-12">
            <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 leading-tight mb-6">
                "{data.text}"
            </h3>
            {data.author && (
                <div className="text-lg text-gray-500 font-medium">
                    — {data.author} {data.role && <span className="opacity-60 text-sm">| {data.role}</span>}
                </div>
            )}
        </div>
    );
}

// 5. Author Bio Inline
export function AuthorBioInlineComponent({ data }: { data: AuthorBioInline }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 my-8">
            <img src={data.avatar_url} alt={data.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
            <div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                    {data.name} <span className="px-2 py-0.5 rounded text-[10px] bg-gray-200 text-gray-600 uppercase tracking-wide">{data.role}</span>
                </div>
                <p className="text-sm text-gray-600 text-balance m-0">{data.bio}</p>
            </div>
        </div>
    );
}
