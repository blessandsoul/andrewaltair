import Link from 'next/link';
import Image from 'next/image';

interface RelatedPost {
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    coverImages?: { horizontal?: string };
    categories: string[];
}

interface InsightRelatedPostsProps {
    posts: RelatedPost[];
}

export function InsightRelatedPosts({ posts }: InsightRelatedPostsProps) {
    if (posts.length === 0) return null;

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
                დაწვრილებით ამ თემაზე
            </h2>
            <div className="grid gap-3">
                {posts.map((post) => {
                    const image = post.coverImages?.horizontal || post.coverImage;
                    return (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="flex gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                        >
                            {image && (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <h4 className="font-medium text-sm text-foreground line-clamp-2">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
