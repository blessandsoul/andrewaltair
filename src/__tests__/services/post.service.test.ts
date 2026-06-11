import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostService } from '@/services/post.service';

// --- Mocks ---

vi.mock('@/lib/db', () => ({
    default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/id-system', () => ({
    generateUniqueId: vi.fn().mockResolvedValue('123456'),
}));

vi.mock('@/lib/indexnow', () => ({
    indexBlogPost: vi.fn().mockResolvedValue({ success: true }),
}));

// Chainable query builder used by Post.find / Post.findOne
function createChainableQuery(resolvedValue: unknown) {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};
    chain.sort = vi.fn().mockReturnValue(chain);
    chain.skip = vi.fn().mockReturnValue(chain);
    chain.limit = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.lean = vi.fn().mockResolvedValue(resolvedValue);
    return chain;
}

// Constructor mock for `new Post(data)` + `post.save()`
let constructedPostData: Record<string, unknown> = {};
const mockSave = vi.fn();

vi.mock('@/models/Post', () => {
    // Use a real function so `new Post(data)` works
    function PostConstructor(this: Record<string, unknown>, data: Record<string, unknown>) {
        constructedPostData = { ...data };
        Object.assign(this, data);
        this._id = { toString: () => 'new-post-id' };
        this.slug = data.slug;
        this.status = data.status || 'published';
        this.save = mockSave;
        this.toObject = () => ({
            ...data,
            _id: { toString: () => 'new-post-id' },
        });
    }

    // Attach static methods
    PostConstructor.find = vi.fn();
    PostConstructor.findOne = vi.fn();
    PostConstructor.findByIdAndUpdate = vi.fn();
    PostConstructor.countDocuments = vi.fn();

    return { default: PostConstructor };
});

// Re-import Post after mock is set up so we can reference the mock methods
import Post from '@/models/Post';
import { generateUniqueId } from '@/lib/id-system';
import { indexBlogPost } from '@/lib/indexnow';

// --- Helpers ---

function makePost(overrides: Record<string, unknown> = {}) {
    return {
        _id: { toString: () => 'post-id-1' },
        slug: 'test-post',
        title: 'Test Post',
        excerpt: 'A test post',
        status: 'published',
        categories: ['ai'],
        tags: ['test'],
        publishedAt: new Date('2025-01-15'),
        createdAt: new Date('2025-01-15'),
        order: 1,
        views: 10,
        ...overrides,
    };
}

// --- Tests ---

describe('PostService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        constructedPostData = {};
        mockSave.mockResolvedValue(undefined);
    });

    // =====================
    // getAllPosts
    // =====================
    describe('getAllPosts', () => {
        it('should return paginated posts with default options', async () => {
            // Arrange
            const posts = [makePost(), makePost({ _id: { toString: () => 'post-id-2' }, slug: 'post-2' })];
            const findChain = createChainableQuery(posts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(2);

            // Act
            const result = await PostService.getAllPosts({});

            // Assert
            expect(Post.find).toHaveBeenCalledWith({});
            expect(findChain.sort).toHaveBeenCalledWith({ publishedAt: -1 });
            expect(findChain.skip).toHaveBeenCalledWith(0); // (1-1)*10 = 0
            expect(findChain.limit).toHaveBeenCalledWith(10);
            expect(result.posts).toHaveLength(2);
            expect(result.posts[0].id).toBe('post-id-1');
            expect(result.pagination).toEqual({
                total: 2,
                pages: 1,
                page: 1,
                limit: 10,
            });
        });

        it('should filter by status when provided', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ status: 'published' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'published' })
            );
        });

        it('should filter by category when provided', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ category: 'ai' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ categories: 'ai' })
            );
        });

        it('should apply text search when search string provided', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ search: 'machine learning' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ $text: { $search: 'machine learning' } })
            );
        });

        it('should search by numericId when search is a 6-digit number', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ search: '123456' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ numericId: '123456' })
            );
        });

        it('should use cursor pagination when afterSlug provided', async () => {
            // Arrange
            const refDate = new Date('2025-01-10');
            const refPostChain = createChainableQuery({ publishedAt: refDate });
            (Post.findOne as ReturnType<typeof vi.fn>).mockReturnValue(refPostChain);

            const posts = [makePost()];
            const findChain = createChainableQuery(posts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(1);

            // Act
            const result = await PostService.getAllPosts({ afterSlug: 'reference-post', limit: 5 });

            // Assert
            expect(Post.findOne).toHaveBeenCalledWith({ slug: 'reference-post' });
            expect(findChain.skip).toHaveBeenCalledWith(0); // cursor pagination uses skip=0
            expect(findChain.limit).toHaveBeenCalledWith(5);
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    publishedAt: { $lt: refDate },
                    slug: { $ne: 'reference-post' },
                })
            );
            expect(result.posts).toHaveLength(1);
        });

        it('should handle featured filter', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ featured: true });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ featured: true })
            );
        });

        it('should handle trending filter', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ trending: true });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ trending: true })
            );
        });

        it('should calculate correct pagination for page 3 with limit 5', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(25);

            // Act
            const result = await PostService.getAllPosts({ page: 3, limit: 5 });

            // Assert
            expect(findChain.skip).toHaveBeenCalledWith(10); // (3-1)*5
            expect(findChain.limit).toHaveBeenCalledWith(5);
            expect(result.pagination).toEqual({
                total: 25,
                pages: 5,
                page: 3,
                limit: 5,
            });
        });

        it('should filter by type repository when provided', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ type: 'repository' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ repository: { $exists: true, $ne: null } })
            );
        });

        it('should filter by type article when provided', async () => {
            // Arrange
            const findChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(0);

            // Act
            await PostService.getAllPosts({ type: 'article' });

            // Assert
            expect(Post.find).toHaveBeenCalledWith(
                expect.objectContaining({ repository: { $exists: false } })
            );
        });

        it('should stringify post ids in returned data', async () => {
            // Arrange
            const posts = [makePost({ _id: { toString: () => 'abc-123' } })];
            const findChain = createChainableQuery(posts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);
            (Post.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValue(1);

            // Act
            const result = await PostService.getAllPosts({});

            // Assert
            expect(result.posts[0].id).toBe('abc-123');
        });
    });

    // =====================
    // getPostBySlug
    // =====================
    describe('getPostBySlug', () => {
        it('should return post with stringified id when found', async () => {
            // Arrange
            const post = makePost();
            const findOneChain = createChainableQuery(post);
            (Post.findOne as ReturnType<typeof vi.fn>).mockReturnValue(findOneChain);

            // Act
            const result = await PostService.getPostBySlug('test-post');

            // Assert
            expect(Post.findOne).toHaveBeenCalledWith({ slug: 'test-post' });
            expect(result).not.toBeNull();
            expect(result!.id).toBe('post-id-1');
            expect(result!._id).toBe('post-id-1');
            expect(result!.title).toBe('Test Post');
        });

        it('should return null when post not found', async () => {
            // Arrange
            const findOneChain = createChainableQuery(null);
            (Post.findOne as ReturnType<typeof vi.fn>).mockReturnValue(findOneChain);

            // Act
            const result = await PostService.getPostBySlug('nonexistent-post');

            // Assert
            expect(result).toBeNull();
        });
    });

    // =====================
    // getRelatedPosts
    // =====================
    describe('getRelatedPosts', () => {
        it('should find posts in same categories', async () => {
            // Arrange
            const relatedPosts = [
                makePost({ slug: 'related-1' }),
                makePost({ slug: 'related-2', _id: { toString: () => 'post-id-2' } }),
            ];
            const findChain = createChainableQuery(relatedPosts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);

            // Act
            const result = await PostService.getRelatedPosts('current-post', ['ai', 'tech'], 2);

            // Assert
            expect(Post.find).toHaveBeenCalledWith({
                status: 'published',
                slug: { $ne: 'current-post' },
                categories: { $in: ['ai', 'tech'] },
            });
            expect(result).toHaveLength(2);
        });

        it('should fill with recent posts when not enough category matches', async () => {
            // Arrange
            const categoryPost = makePost({ slug: 'category-match' });
            const recentPost = makePost({ slug: 'recent-post', _id: { toString: () => 'post-id-3' } });

            // First call: category match returns 1 post (need 2)
            const categoryChain = createChainableQuery([categoryPost]);
            // Second call: fill with recent posts returns 1 more
            const recentChain = createChainableQuery([recentPost]);

            (Post.find as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(categoryChain)
                .mockReturnValueOnce(recentChain);

            // Act
            const result = await PostService.getRelatedPosts('current-post', ['ai'], 2);

            // Assert
            expect(Post.find).toHaveBeenCalledTimes(2);
            expect(result).toHaveLength(2);
            expect(result[0].slug).toBe('category-match');
            expect(result[1].slug).toBe('recent-post');
        });

        it('should return posts with stringified ids', async () => {
            // Arrange
            const posts = [makePost({ _id: { toString: () => 'stringified-id' } })];
            const findChain = createChainableQuery(posts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(findChain);

            // Act
            const result = await PostService.getRelatedPosts('current', ['ai'], 1);

            // Assert
            expect(result[0].id).toBe('stringified-id');
            expect(result[0]._id).toBe('stringified-id');
        });

        it('should fetch only recent posts when no categories provided', async () => {
            // Arrange
            const recentPosts = [makePost({ slug: 'recent-1' })];
            const recentChain = createChainableQuery(recentPosts);
            (Post.find as ReturnType<typeof vi.fn>).mockReturnValue(recentChain);

            // Act
            const result = await PostService.getRelatedPosts('current-post', [], 2);

            // Assert
            // categories.length === 0, so first find is skipped; second find fills with recents
            expect(Post.find).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(1);
        });

        it('should exclude already matched posts from recent fill query', async () => {
            // Arrange
            const categoryPost = makePost({ slug: 'matched-post' });
            const categoryChain = createChainableQuery([categoryPost]);
            const recentChain = createChainableQuery([]);
            (Post.find as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(categoryChain)
                .mockReturnValueOnce(recentChain);

            // Act
            await PostService.getRelatedPosts('current-post', ['ai'], 2);

            // Assert
            const secondCallArgs = (Post.find as ReturnType<typeof vi.fn>).mock.calls[1][0];
            expect(secondCallArgs.slug.$nin).toContain('matched-post');
            expect(secondCallArgs.slug.$ne).toBe('current-post');
        });
    });

    // =====================
    // incrementViews
    // =====================
    describe('incrementViews', () => {
        it('should call findByIdAndUpdate with $inc', async () => {
            // Arrange
            (Post.findByIdAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

            // Act
            await PostService.incrementViews('post-id-1');

            // Assert
            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('post-id-1', { $inc: { views: 1 } });
        });
    });

    // =====================
    // getAdjacentPosts
    // =====================
    describe('getAdjacentPosts', () => {
        it('should return prev and next posts', async () => {
            // Arrange
            const currentPost = { order: 5, createdAt: new Date('2025-01-15') };
            const prevPost = { slug: 'prev-post', title: 'Previous Post' };
            const nextPost = { slug: 'next-post', title: 'Next Post' };

            const prevChain = createChainableQuery(prevPost);
            const nextChain = createChainableQuery(nextPost);

            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(prevChain)
                .mockReturnValueOnce(nextChain);

            // Act
            const result = await PostService.getAdjacentPosts(currentPost);

            // Assert
            expect(result.prevPost).toEqual({ slug: 'prev-post', title: 'Previous Post' });
            expect(result.nextPost).toEqual({ slug: 'next-post', title: 'Next Post' });
        });

        it('should return null for prev when none exist', async () => {
            // Arrange
            const currentPost = { order: 1, createdAt: new Date('2025-01-01') };

            const prevChain = createChainableQuery(null);
            const nextChain = createChainableQuery({ slug: 'next-post', title: 'Next' });

            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(prevChain)
                .mockReturnValueOnce(nextChain);

            // Act
            const result = await PostService.getAdjacentPosts(currentPost);

            // Assert
            expect(result.prevPost).toBeNull();
            expect(result.nextPost).toEqual({ slug: 'next-post', title: 'Next' });
        });

        it('should return null for next when none exist', async () => {
            // Arrange
            const currentPost = { order: 100, createdAt: new Date('2025-12-31') };

            const prevChain = createChainableQuery({ slug: 'prev-post', title: 'Prev' });
            const nextChain = createChainableQuery(null);

            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(prevChain)
                .mockReturnValueOnce(nextChain);

            // Act
            const result = await PostService.getAdjacentPosts(currentPost);

            // Assert
            expect(result.prevPost).toEqual({ slug: 'prev-post', title: 'Prev' });
            expect(result.nextPost).toBeNull();
        });

        it('should return null for both when no adjacent posts exist', async () => {
            // Arrange
            const currentPost = { order: 1, createdAt: new Date() };

            const prevChain = createChainableQuery(null);
            const nextChain = createChainableQuery(null);

            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(prevChain)
                .mockReturnValueOnce(nextChain);

            // Act
            const result = await PostService.getAdjacentPosts(currentPost);

            // Assert
            expect(result.prevPost).toBeNull();
            expect(result.nextPost).toBeNull();
        });

        it('should query using order and createdAt for correct sorting', async () => {
            // Arrange
            const currentPost = { order: 5, createdAt: new Date('2025-06-15') };
            const prevChain = createChainableQuery(null);
            const nextChain = createChainableQuery(null);

            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockReturnValueOnce(prevChain)
                .mockReturnValueOnce(nextChain);

            // Act
            await PostService.getAdjacentPosts(currentPost);

            // Assert - check prev query
            const prevQuery = (Post.findOne as ReturnType<typeof vi.fn>).mock.calls[0][0];
            expect(prevQuery.status).toBe('published');
            expect(prevQuery.$or).toEqual([
                { order: { $lt: 5 } },
                { order: 5, createdAt: { $gt: currentPost.createdAt } },
            ]);

            // Assert - check next query
            const nextQuery = (Post.findOne as ReturnType<typeof vi.fn>).mock.calls[1][0];
            expect(nextQuery.status).toBe('published');
            expect(nextQuery.$or).toEqual([
                { order: { $gt: 5 } },
                { order: 5, createdAt: { $lt: currentPost.createdAt } },
            ]);
        });
    });

    // =====================
    // createPost
    // =====================
    describe('createPost', () => {
        it('should generate slug from title when not provided', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'My Great Post' });

            // Assert
            expect(constructedPostData.slug).toBe('my-great-post');
        });

        it('should make slug unique by appending counter on duplicate', async () => {
            // Arrange
            // Call order: title idempotency guard → slug 'my-post' exists → 'my-post-2' free
            // mockReset purges once-queue leftovers from earlier (failing) tests
            (Post.findOne as ReturnType<typeof vi.fn>).mockReset();
            (Post.findOne as ReturnType<typeof vi.fn>)
                .mockResolvedValueOnce(null)                  // title guard: no existing post
                .mockResolvedValueOnce({ slug: 'my-post' })  // 'my-post' taken
                .mockResolvedValueOnce(null)                  // 'my-post-2' available
                .mockResolvedValueOnce(null);                 // numericId check

            // Act
            await PostService.createPost({ title: 'My Post' });

            // Assert
            expect(constructedPostData.slug).toBe('my-post-2');
        });

        it('should return the existing post instead of minting a duplicate on same title', async () => {
            // Arrange — idempotency guard (SEO audit 2026-06-12): a retried
            // publish of an already-existing title must NOT create a "-2" copy
            const existing = { _id: 'existing-id', title: 'My Post', slug: 'my-post' };
            (Post.findOne as ReturnType<typeof vi.fn>).mockReset();
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existing);

            // Act
            const result = await PostService.createPost({ title: 'My Post' });

            // Assert — existing doc returned, no new Post constructed
            // (constructedPostData stays at its beforeEach reset value)
            expect(result.slug).toBe('my-post');
            expect(constructedPostData).toEqual({});
        });

        it('should generate numericId using generateUniqueId', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (generateUniqueId as ReturnType<typeof vi.fn>).mockResolvedValue('654321');

            // Act
            await PostService.createPost({ title: 'Test Post' });

            // Assert
            expect(generateUniqueId).toHaveBeenCalled();
            expect(constructedPostData.numericId).toBe('654321');
        });

        it('should handle meta-based (new JSON) format', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (generateUniqueId as ReturnType<typeof vi.fn>).mockResolvedValue('111111');

            const newFormatData = {
                meta: {
                    title: 'New Format Post',
                    slug: 'new-format-post',
                    category: 'AI',
                    tags: ['ai', 'ml'],
                    author: { name: 'Andrew Altair', role: 'AI Innovator' },
                },
                content: [
                    { type: 'intro', content: 'Introduction text' },
                    { type: 'section', title: 'Details', content: 'Section content' },
                ],
                seo: {
                    excerpt: 'SEO excerpt text',
                    key_points: ['Point 1', 'Point 2'],
                    faq: [{ q: 'What?', a: 'This.' }],
                },
            };

            // Act
            await PostService.createPost(newFormatData);

            // Assert
            expect(constructedPostData.title).toBe('New Format Post');
            expect(constructedPostData.slug).toBe('new-format-post');
            expect(constructedPostData.categories).toEqual(['AI']);
            expect(constructedPostData.tags).toEqual(['ai', 'ml']);
            expect(constructedPostData.excerpt).toBe('SEO excerpt text');
            expect(constructedPostData.keyPoints).toEqual(['Point 1', 'Point 2']);
            expect(constructedPostData.status).toBe('published');
            expect(constructedPostData.sections).toBe(newFormatData.content);
        });

        it('should handle standard (old) format', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (generateUniqueId as ReturnType<typeof vi.fn>).mockResolvedValue('222222');

            const oldFormatData = {
                title: 'Old Format Post',
                slug: 'old-format-post',
                excerpt: 'Custom excerpt',
                content: 'Post body content',
                categories: ['tech'],
                author: { name: 'Author', avatar: '/avatar.jpg', role: 'Writer' },
                status: 'draft',
                readingTime: 10,
            };

            // Act
            await PostService.createPost(oldFormatData);

            // Assert
            expect(constructedPostData.title).toBe('Old Format Post');
            expect(constructedPostData.slug).toBe('old-format-post');
            expect(constructedPostData.excerpt).toBe('Custom excerpt');
            expect(constructedPostData.categories).toEqual(['tech']);
            expect(constructedPostData.status).toBe('draft');
            expect(constructedPostData.readingTime).toBe(10);
        });

        it('should normalize FAQ fields from q/a to question/answer', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            const dataWithShortFaq = {
                title: 'FAQ Test',
                faq: [
                    { q: 'What is AI?', a: 'Artificial Intelligence' },
                    { question: 'How?', answer: 'Like this.' },
                ],
            };

            // Act
            await PostService.createPost(dataWithShortFaq);

            // Assert
            const faq = constructedPostData.faq as Array<{ question: string; answer: string }>;
            expect(faq).toHaveLength(2);
            expect(faq[0]).toEqual({ question: 'What is AI?', answer: 'Artificial Intelligence' });
            expect(faq[1]).toEqual({ question: 'How?', answer: 'Like this.' });
        });

        it('should normalize FAQ fields from q/a in meta-based format', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            const data = {
                meta: {
                    title: 'FAQ Meta Test',
                    faq: [
                        { q: 'Question 1?', a: 'Answer 1' },
                    ],
                },
                content: [],
            };

            // Act
            await PostService.createPost(data);

            // Assert
            const faq = constructedPostData.faq as Array<{ question: string; answer: string }>;
            expect(faq).toHaveLength(1);
            expect(faq[0]).toEqual({ question: 'Question 1?', answer: 'Answer 1' });
        });

        it('should use provided numericId when available', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            (generateUniqueId as ReturnType<typeof vi.fn>).mockResolvedValue('999999');

            // Act
            await PostService.createPost({ title: 'With ID', numericId: '555555' });

            // Assert
            expect(constructedPostData.numericId).toBe('555555');
        });

        it('should use meta.id as numericId in new format', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            const data = {
                meta: {
                    title: 'Meta ID Post',
                    id: 'CASE-260120-01',
                },
                content: [],
            };

            // Act
            await PostService.createPost(data);

            // Assert
            expect(constructedPostData.numericId).toBe('CASE-260120-01');
        });

        it('should call indexBlogPost when post status is published', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'Published Post', status: 'published' });

            // Assert
            expect(indexBlogPost).toHaveBeenCalledWith(expect.any(String));
        });

        it('should return post object with stringified id', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            const result = await PostService.createPost({ title: 'Return Test' });

            // Assert
            expect(result.id).toBe('new-post-id');
        });

        it('should call post.save()', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'Save Test' });

            // Assert
            expect(mockSave).toHaveBeenCalled();
        });

        it('should set default categories and author in old format when not provided', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'Defaults Test' });

            // Assert
            expect(constructedPostData.categories).toEqual(['ai', 'articles']);
            expect(constructedPostData.author).toEqual({
                name: 'Andrew Altair',
                avatar: '/images/avatar.jpg',
                role: 'AI ინოვატორი',
            });
        });

        it('should set default excerpt from title in old format when not provided', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'Excerpt Fallback' });

            // Assert
            expect(constructedPostData.excerpt).toBe('Excerpt Fallback');
        });

        it('should handle Georgian characters in slug generation', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'ტესტი Post' });

            // Assert
            // Georgian chars are preserved, spaces become hyphens
            expect(constructedPostData.slug).toBe('ტესტი-post');
        });

        it('should set empty faq array when none provided in old format', async () => {
            // Arrange
            (Post.findOne as ReturnType<typeof vi.fn>).mockResolvedValue(null);

            // Act
            await PostService.createPost({ title: 'No FAQ' });

            // Assert
            expect(constructedPostData.faq).toEqual([]);
        });
    });
});
