'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'encyclopedia_progress';

interface ProgressData {
    [articleId: string]: {
        read: boolean;
        readAt: string;
        section: string;
    };
}

export function useReadingProgress(section: string) {
    const [progress, setProgress] = useState<ProgressData>({});

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProgress(JSON.parse(stored));
            } catch {
                setProgress({});
            }
        }
    }, []);

    const markAsRead = (articleId: string) => {
        const newProgress = {
            ...progress,
            [articleId]: {
                read: true,
                readAt: new Date().toISOString(),
                section
            }
        };
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    };

    const isRead = (articleId: string): boolean => {
        return progress[articleId]?.read ?? false;
    };

    const getSectionProgress = (sectionName: string): { read: number; total: number } => {
        const sectionArticles = Object.entries(progress).filter(
            ([, data]) => data.section === sectionName
        );
        return {
            read: sectionArticles.filter(([, data]) => data.read).length,
            total: sectionArticles.length
        };
    };

    const getReadArticles = (): string[] => {
        return Object.entries(progress)
            .filter(([, data]) => data.read)
            .map(([id]) => id);
    };

    const clearProgress = () => {
        setProgress({});
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        progress,
        markAsRead,
        isRead,
        getSectionProgress,
        getReadArticles,
        clearProgress
    };
}

// Progress bar component
export function ReadingProgressBar({ current, total }: { current: number; total: number }) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>პროგრესი</span>
                <span>{current}/{total} ({percentage}%)</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Scroll progress indicator
export function ScrollProgressIndicator() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-secondary/30">
            <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}
