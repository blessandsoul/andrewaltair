'use client';

import { useState, useEffect } from 'react';
import { TbThumbUp, TbThumbUpFilled, TbBookmark, TbBookmarkFilled } from 'react-icons/tb';

interface ArticleActionsProps {
    articleId: string;
    sectionSlug: string;
}

const LIKES_KEY = 'encyclopedia_likes';
const BOOKMARKS_KEY = 'encyclopedia_bookmarks';

export default function ArticleActions({ articleId, sectionSlug }: ArticleActionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // Load likes
        const likes = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
        setIsLiked(!!likes[articleId]);

        // Simulate like count (base + random)
        const baseCount = articleId.length * 17 + sectionSlug.length * 23;
        setLikeCount(baseCount % 150 + 50 + (likes[articleId] ? 1 : 0));

        // Load bookmarks
        const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
        setIsBookmarked(!!bookmarks[articleId]);
    }, [articleId, sectionSlug]);

    const toggleLike = () => {
        const likes = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
        if (isLiked) {
            delete likes[articleId];
            setLikeCount(prev => prev - 1);
        } else {
            likes[articleId] = { likedAt: new Date().toISOString(), sectionSlug };
            setLikeCount(prev => prev + 1);
        }
        localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
        setIsLiked(!isLiked);
    };

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
        if (isBookmarked) {
            delete bookmarks[articleId];
        } else {
            bookmarks[articleId] = { savedAt: new Date().toISOString(), sectionSlug };
        }
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${isLiked
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                    }`}
            >
                {isLiked ? <TbThumbUpFilled size={18} /> : <TbThumbUp size={18} />}
                <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${isBookmarked
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
                    }`}
                title={isBookmarked ? 'წაშალე შენახულებიდან' : 'შეინახე'}
            >
                {isBookmarked ? <TbBookmarkFilled size={18} /> : <TbBookmark size={18} />}
                <span className="text-sm font-medium">{isBookmarked ? 'შენახულია' : 'შენახვა'}</span>
            </button>
        </div>
    );
}
