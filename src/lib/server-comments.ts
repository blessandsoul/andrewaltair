import { CommunicationService } from '@/services/communication.service';

/**
 * Server-side comment loaders for SEO. Comments used to be client-fetched (invisible to
 * crawlers); these let a server page (a) seed <Comments initialComments={...}/> so the
 * text is in the SSR HTML, and (b) emit schema.org Comment / commentCount JSON-LD.
 */

export interface SeedComment {
    id: string;
    author: { name: string; avatar?: string } | string;
    content: string;
    createdAt?: string;
    isAI?: boolean;
    persona?: string;
    parentId?: string | null;
    likedBy?: { personaId: string; name: string }[];
    likes?: number;
}

/** Fetch approved comments for a content id, fully serialized for a client component. */
export async function getInitialComments(postId: string): Promise<SeedComment[]> {
    try {
        const { comments } = await CommunicationService.getComments({
            postId,
            status: 'approved',
            limit: 100,
        });
        return JSON.parse(JSON.stringify(comments)) as SeedComment[];
    } catch {
        return [];
    }
}

function authorName(a: SeedComment['author']): string {
    return (typeof a === 'string' ? a : a?.name) || 'მკითხველი';
}

/**
 * schema.org `comment` + `commentCount` to spread into an Article/NewsArticle/VideoObject
 * JSON-LD object. AI comments are honestly tagged (the page also shows a 🤖 label).
 */
export function commentJsonLd(comments: SeedComment[]): { commentCount: number; comment: object[] } {
    return {
        commentCount: comments.length,
        comment: comments.slice(0, 50).map((c) => ({
            '@type': 'Comment',
            author: { '@type': 'Person', name: authorName(c.author) },
            text: c.content,
            ...(c.createdAt ? { datePublished: new Date(c.createdAt).toISOString() } : {}),
            ...(c.isAI ? { disambiguatingDescription: 'AI persona (fiction)' } : {}),
        })),
    };
}
