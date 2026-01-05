'use client';

import React, { useState, useEffect } from 'react';
import { TbBookmark } from "react-icons/tb";
import { Button } from '@/components/ui/button';

interface BookmarkButtonProps {
    id?: string;
    postId?: string;
    slug?: string;
    title?: string;
    excerpt?: string;
    className?: string;
    showLabel?: boolean;
}

export function BookmarkButton({ 
    id, 
    postId, 
    slug, 
    title, 
    excerpt, 
    className = '', 
    showLabel = false 
}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const itemId = id || postId || slug || '';

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(itemId));
    }, [itemId]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        
        if (isBookmarked) {
            const filtered = bookmarks.filter((id: string) => id !== itemId);
            localStorage.setItem('bookmarks', JSON.stringify(filtered));
            setIsBookmarked(false);
        } else {
            bookmarks.push(itemId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            setIsBookmarked(true);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className={className}
        >
            <TbBookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
            />
            {showLabel && <span className="ml-2">Bookmark</span>}
        </Button>
    );
}
