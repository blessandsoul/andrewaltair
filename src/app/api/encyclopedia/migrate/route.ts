export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import EncyclopediaSection from '@/models/EncyclopediaSection';
import EncyclopediaCategory from '@/models/EncyclopediaCategory';
import EncyclopediaArticle from '@/models/EncyclopediaArticle';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

// Import static data
import { PROMPT_ENGINEERING_DATA } from '@/data/promptEngineeringContent';
import { AI_MONETIZATION_DATA } from '@/data/aiMonetizationContent';
import { AI_AUTOMATION_DATA } from '@/data/aiAutomationContent';
import { AI_TOOLS_DATA } from '@/data/aiToolsContent';
import { AI_CAREER_DATA } from '@/data/aiCareerContent';
import { AI_ETHICS_DATA } from '@/data/aiEthicsContent';
import { VIBE_CODING_DATA } from '@/data/vibeCodingContent';

// Section definitions
const SECTIONS = [
    {
        slug: 'prompt-engineering',
        title: 'Prompt Engineering',
        description: 'AI-თან ეფექტური კომუნიკაციის ხელოვნება',
        icon: '✨',
        gradientFrom: '#8B5CF6',
        gradientTo: '#6366F1',
        data: PROMPT_ENGINEERING_DATA,
    },
    {
        slug: 'ai-monetization',
        title: 'AI მონეტიზაცია',
        description: 'AI-ით შემოსავლის მიღება და ბიზნესი',
        icon: '💰',
        gradientFrom: '#10B981',
        gradientTo: '#059669',
        data: AI_MONETIZATION_DATA,
    },
    {
        slug: 'ai-automation',
        title: 'AI ავტომატიზაცია',
        description: 'პროცესების ავტომატიზაცია AI-ით',
        icon: '⚙️',
        gradientFrom: '#F59E0B',
        gradientTo: '#D97706',
        data: AI_AUTOMATION_DATA,
    },
    {
        slug: 'ai-tools',
        title: 'AI ინსტრუმენტები',
        description: 'საუკეთესო AI ინსტრუმენტების გაიდი',
        icon: '🛠️',
        gradientFrom: '#EC4899',
        gradientTo: '#DB2777',
        data: AI_TOOLS_DATA,
    },
    {
        slug: 'ai-career',
        title: 'AI კარიერა',
        description: 'კარიერული განვითარება AI სფეროში',
        icon: '🎯',
        gradientFrom: '#3B82F6',
        gradientTo: '#2563EB',
        data: AI_CAREER_DATA,
    },
    {
        slug: 'ai-ethics',
        title: 'AI ეთიკა',
        description: 'AI გამოყენების ეთიკური საკითხები',
        icon: '⚖️',
        gradientFrom: '#EF4444',
        gradientTo: '#DC2626',
        data: AI_ETHICS_DATA,
    },
    {
        slug: 'vibe-coding',
        title: 'Vibe Coding',
        description: 'AI-ასისტირებული პროგრამირება',
        icon: '💜',
        gradientFrom: '#8B5CF6',
        gradientTo: '#A855F7',
        data: VIBE_CODING_DATA,
    },
];

// Helper: calculate reading time
function calculateReadingTime(content: string): number {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
}

// Helper: generate excerpt
function generateExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim();
    return plainText.length > maxLength
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
}

// POST - Run migration
export async function POST(request: NextRequest) {
    try {
        // Check for admin auth (simple secret check)
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');
        if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }

        await dbConnect();

        const results = {
            sections: 0,
            categories: 0,
            articles: 0,
            errors: [] as string[],
        };

        for (const sectionDef of SECTIONS) {
            try {
                // Create or update section
                const section = await EncyclopediaSection.findOneAndUpdate(
                    { slug: sectionDef.slug },
                    {
                        title: sectionDef.title,
                        description: sectionDef.description,
                        slug: sectionDef.slug,
                        icon: sectionDef.icon,
                        gradientFrom: sectionDef.gradientFrom,
                        gradientTo: sectionDef.gradientTo,
                        isPublished: true,
                    },
                    { upsert: true, new: true }
                );
                results.sections++;

                // Migrate categories and articles
                let articleOrder = 0;
                for (const cat of sectionDef.data.categories) {
                    try {
                        // Create or update category
                        const category = await EncyclopediaCategory.findOneAndUpdate(
                            { sectionId: section._id, slug: cat.id },
                            {
                                title: cat.title,
                                slug: cat.id,
                                icon: cat.icon,
                                sectionId: section._id,
                            },
                            { upsert: true, new: true }
                        );
                        results.categories++;

                        // Migrate articles
                        for (const art of cat.articles) {
                            try {
                                await EncyclopediaArticle.findOneAndUpdate(
                                    { slug: art.id, sectionId: section._id },
                                    {
                                        title: art.title,
                                        slug: art.id,
                                        content: art.content,
                                        excerpt: generateExcerpt(art.content),
                                        sectionId: section._id,
                                        categoryId: category._id,
                                        author: {
                                            name: 'Andrew Altair',
                                            avatar: '/images/author.jpg',
                                            role: 'AI Expert',
                                        },
                                        isPublished: true,
                                        isFree: art.isFree,
                                        difficulty: 'beginner',
                                        estimatedMinutes: calculateReadingTime(art.content),
                                        order: articleOrder++,
                                        version: 1,
                                    },
                                    { upsert: true, new: true }
                                );
                                results.articles++;
                            } catch (artErr) {
                                results.errors.push(`Article ${art.id}: ${String(artErr)}`);
                            }
                        }
                    } catch (catErr) {
                        results.errors.push(`Category ${cat.id}: ${String(catErr)}`);
                    }
                }

                // Update section article count
                await EncyclopediaSection.findByIdAndUpdate(section._id, {
                    articleCount: await EncyclopediaArticle.countDocuments({ sectionId: section._id }),
                });

            } catch (secErr) {
                results.errors.push(`Section ${sectionDef.slug}: ${String(secErr)}`);
            }
        }

        return apiSuccess(results, 'Migration completed');

    } catch (error) {
        console.error('Migration error:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_MIGRATE_FAILED, 'Migration failed', 500);
    }
}

// GET - Check migration status
export async function GET() {
    try {
        await dbConnect();

        const sections = await EncyclopediaSection.countDocuments();
        const categories = await EncyclopediaCategory.countDocuments();
        const articles = await EncyclopediaArticle.countDocuments();

        return apiSuccess(
            {
                status: 'ready',
                counts: { sections, categories, articles },
            },
            sections > 0 ? 'Data already migrated' : 'No data - run POST to migrate'
        );
    } catch (error) {
        console.error('Database check error:', error);
        return apiError(ERROR_CODES.ENCYCLOPEDIA_FETCH_FAILED, 'Database check failed', 500);
    }
}
