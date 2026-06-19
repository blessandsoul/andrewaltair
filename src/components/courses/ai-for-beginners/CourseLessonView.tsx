'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TbClock, TbArrowLeft, TbArrowRight, TbBrandGithub, TbNotebook, TbChevronRight } from 'react-icons/tb';
import type { CourseLesson, NotebookFramework } from '@/types/course';
import { courseBase, accent } from './accent';
import CourseMarkdown from './CourseMarkdown';
import CourseTableOfContents from './CourseTableOfContents';
import NotebookViewer from './NotebookViewer';
import ModuleIcon from './ModuleIcon';

const FRAMEWORK_LABEL: Record<NotebookFramework, string> = {
    pytorch: 'PyTorch', tensorflow: 'TensorFlow', generic: 'Python',
};

export default function CourseLessonView({ lesson }: { lesson: CourseLesson }) {
    const isNotebook = lesson.kind === 'notebook';

    return (
        <div className="px-4 lg:px-8 py-10 lg:py-12 max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500 mb-6">
                <Link href="/encyclopedia" className={accent.hover}>ენციკლოპედია</Link>
                <TbChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <Link href={courseBase} className={accent.hover}>AI დამწყებთათვის</Link>
                <TbChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-gray-700 font-medium">{lesson.module.title}</span>
            </nav>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${accent.chipSoft}`}>
                        <ModuleIcon name={lesson.module.icon} size={14} /> {lesson.module.title}
                    </span>
                    {isNotebook ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <TbNotebook className="w-4 h-4" /> Jupyter ნოუთბუქი · {FRAMEWORK_LABEL[lesson.framework]}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <TbClock className="w-4 h-4" /> {lesson.readingMinutes} წთ კითხვა
                        </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{lesson.title}</h1>
            </motion.header>

            {/* Body + optional TOC */}
            <div className={isNotebook ? '' : 'xl:grid xl:grid-cols-[1fr_15rem] xl:gap-10 xl:items-start'}>
                <motion.article
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-5 md:p-10 shadow-sm border border-gray-100 min-w-0"
                >
                    {isNotebook
                        ? <NotebookViewer lesson={lesson} />
                        : <CourseMarkdown content={lesson.markdown} />}
                </motion.article>

                {!isNotebook && lesson.headings.length >= 3 && (
                    <aside className="hidden xl:block sticky top-24 mt-0">
                        <CourseTableOfContents headings={lesson.headings} />
                    </aside>
                )}
            </div>

            {/* Notebook source link (attribution + practice) */}
            {isNotebook && lesson.sourceNotebookUrl && (
                <div className="mt-4">
                    <a href={lesson.sourceNotebookUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
                        <TbBrandGithub className="w-4 h-4" /> ორიგინალი ნოუთბუქი GitHub-ზე
                    </a>
                </div>
            )}

            {/* Prev / Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                {lesson.prev ? (
                    <Link href={`${courseBase}/${lesson.prev.slug}`} className="group h-full p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 group-hover:text-emerald-600 transition-colors">
                            <TbArrowLeft className="w-3.5 h-3.5" /> წინა
                        </span>
                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">{lesson.prev.title}</h4>
                    </Link>
                ) : <div />}
                {lesson.next && (
                    <Link href={`${courseBase}/${lesson.next.slug}`} className="group h-full p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all md:text-right">
                        <span className="flex items-center gap-1.5 md:justify-end text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 group-hover:text-emerald-600 transition-colors">
                            შემდეგი <TbArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">{lesson.next.title}</h4>
                    </Link>
                )}
            </div>

            {/* Attribution (MIT) */}
            <p className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
                ეს გაკვეთილი არის{' '}
                <a href={lesson.attribution.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                    Microsoft “AI for Beginners”
                </a>{' '}
                კურსის ქართული თარგმანი, გავრცელებული {lesson.attribution.license} ლიცენზიით.
            </p>
        </div>
    );
}
