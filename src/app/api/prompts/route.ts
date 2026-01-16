export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import { generateUniqueId } from '@/lib/id-system';
import { verifyAdmin } from '@/lib/admin-auth';

// GET - List prompts with filters and pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category');
        const aiModel = searchParams.get('aiModel');
        const isFree = searchParams.get('isFree');
        const status = searchParams.get('status') || 'published';
        const sort = searchParams.get('sort') || 'createdAt';
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');

        // Build query
        const query: Record<string, unknown> = {};

        // Status filter (admin can see all, public only sees published)
        const isAdmin = verifyAdmin(request);
        if (!isAdmin) {
            query.status = 'published';
        } else if (status && status !== 'all') {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (aiModel) {
            query.aiModel = aiModel;
        }

        const generationType = searchParams.get('generationType');
        if (generationType) {
            // Support partial matching if needed, or specific types
            if (generationType === 'video') {
                query.generationType = { $in: ['text-to-video', 'image-to-video', 'video-to-video'] };
            } else if (generationType === 'image') {
                query.generationType = { $in: ['text-to-image', 'image-to-image'] };
            } else {
                query.generationType = generationType;
            }
        }

        if (isFree !== null && isFree !== undefined) {
            query.isFree = isFree === 'true';
        }

        if (featured === 'true') {
            query.featuredOrder = { $exists: true, $ne: null };
        }

        if (search) {
            // Check if search query is likely a numeric ID (6 digits)
            if (/^\d{6}$/.test(search)) {
                query.numericId = search;
            } else {
                query.$text = { $search: search };
            }
        }

        // Build sort
        let sortOrder: Record<string, 1 | -1> = {};
        switch (sort) {
            case 'price-asc':
                sortOrder = { price: 1 };
                break;
            case 'price-desc':
                sortOrder = { price: -1 };
                break;
            case 'popular':
                sortOrder = { purchases: -1 };
                break;
            case 'rating':
                sortOrder = { rating: -1 };
                break;
            case 'featured':
                sortOrder = { featuredOrder: 1, createdAt: -1 };
                break;
            case 'oldest':
                sortOrder = { createdAt: 1 };
                break;
            default:
                sortOrder = { createdAt: -1 };
        }

        const prompts = await MarketplacePrompt.find(query)
            .sort(sortOrder)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-promptTemplate -instructions -variables -negativePrompt') // Hide sensitive content in list
            .lean();

        const total = await MarketplacePrompt.countDocuments(query);

        // Get unique categories for filters
        const categories = await MarketplacePrompt.distinct('category', { status: 'published' });
        const aiModels = await MarketplacePrompt.distinct('aiModel', { status: 'published' });

        return NextResponse.json({
            prompts: prompts.map(p => ({
                ...p,
                id: p._id.toString(),
                _id: undefined,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            filters: {
                categories,
                aiModels,
            },
        });
    } catch (error) {
        console.error('Get marketplace prompts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        );
    }
}

// POST - Create new prompt (admin only)
export async function POST(request: NextRequest) {
    try {
        // Verify admin
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const {
            title,
            slug,
            description,
            excerpt,
            price,
            currency,
            originalPrice,
            promptTemplate,
            negativePrompt,
            variables,
            instructions,
            aiModel,
            aiModelVersion,
            generationType,
            aspectRatio,
            coverImage,
            exampleImages,
            category,
            tags,
            status,
            featuredOrder,
            metaTitle,
            metaDescription,
            relatedPrompts,
            bundles,
            versions,
            abTests,
        } = body;

        // Validate required fields
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!slug) missingFields.push('slug');
        if (!description) missingFields.push('description');
        if (!promptTemplate) missingFields.push('promptTemplate');
        if (!aiModel) missingFields.push('aiModel');
        if (!category || (Array.isArray(category) && category.length === 0)) missingFields.push('category');
        if (!coverImage) missingFields.push('coverImage');

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Check if slug is unique
        const existingPrompt = await MarketplacePrompt.findOne({ slug });
        if (existingPrompt) {
            return NextResponse.json(
                { error: 'A prompt with this slug already exists' },
                { status: 400 }
            );
        }

        // Generate numericId
        const numericId = await generateUniqueId();

        const prompt = await MarketplacePrompt.create({
            title,
            slug,
            description,
            excerpt: excerpt || description.substring(0, 150) + '...',
            price: price || 0,
            currency: currency || 'GEL',
            originalPrice,
            isFree: !price || price === 0,
            promptTemplate,
            negativePrompt,
            variables: variables || [],
            instructions: instructions || '',
            aiModel,
            aiModelVersion,
            generationType: generationType || 'text-to-image',
            aspectRatio,
            coverImage,
            exampleImages: exampleImages || [],
            category,
            tags: tags || [],
            authorName: 'Andrew Altair',
            status: status || 'draft',
            featuredOrder,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || description.substring(0, 160),
            relatedPrompts: relatedPrompts || [],
            bundles: bundles || [],
            versions: versions || [],
            abTests: abTests || [],
            numericId,
        });

        return NextResponse.json({
            success: true,
            id: prompt._id.toString(),
            slug: prompt.slug,
        });
    } catch (error) {
        console.error('Create marketplace prompt error:', error);
        return NextResponse.json(
            { error: 'Failed to create prompt' },
            { status: 500 }
        );
    }
}

