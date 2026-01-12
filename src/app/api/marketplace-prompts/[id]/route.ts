import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MarketplacePrompt from '@/models/MarketplacePrompt';
import { verifyAdmin } from '@/lib/admin-auth';

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Get single prompt by ID or slug
export async function GET(request: NextRequest, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;

        // Find by ID or slug
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query).lean();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt not found' },
                { status: 404 }
            );
        }

        // Check if admin or if prompt is published
        const isAdmin = verifyAdmin(request);

        if (prompt.status !== 'published' && !isAdmin) {
            return NextResponse.json(
                { error: 'Prompt not found' },
                { status: 404 }
            );
        }

        // Increment views
        await MarketplacePrompt.updateOne(query, { $inc: { views: 1 } });

        // For non-admin and paid prompts, hide the full template
        const result = { ...prompt, id: prompt._id.toString(), _id: undefined };

        if (!isAdmin && !prompt.isFree) {
            // Show only a preview of the template
            result.promptTemplate = result.promptTemplate.substring(0, 100) + '...[Preview - Purchase to see full prompt]';
            result.instructions = result.instructions ? result.instructions.substring(0, 100) + '...' : '';
            result.negativePrompt = result.negativePrompt ? result.negativePrompt.substring(0, 50) + '...' : '';
        }

        // Backfill numericId if missing
        if (!prompt.numericId) {
            let numericId: string | undefined;
            let attempts = 0;
            while (!numericId && attempts < 5) {
                const potentialId = Math.floor(100000 + Math.random() * 900000).toString();
                const existing = await MarketplacePrompt.findOne({ numericId: potentialId });
                if (!existing) {
                    numericId = potentialId;
                }
                attempts++;
            }
            if (numericId) {
                await MarketplacePrompt.updateOne({ _id: prompt._id }, { numericId });
                // @ts-ignore
                result.numericId = numericId;
            }
        }

        return NextResponse.json({ prompt: result });
    } catch (error) {
        console.error('Get marketplace prompt error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompt' },
            { status: 500 }
        );
    }
}

// PUT - Update prompt (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const body = await request.json();

        // Find by ID or slug
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const prompt = await MarketplacePrompt.findOne(query);

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt not found' },
                { status: 404 }
            );
        }

        // If slug is being changed, check for uniqueness
        if (body.slug && body.slug !== prompt.slug) {
            const existingSlug = await MarketplacePrompt.findOne({ slug: body.slug });
            if (existingSlug) {
                return NextResponse.json(
                    { error: 'A prompt with this slug already exists' },
                    { status: 400 }
                );
            }
        }

        // Update fields
        const updateFields = [
            'title', 'slug', 'description', 'excerpt', 'price', 'currency',
            'originalPrice', 'promptTemplate', 'negativePrompt', 'variables', 'instructions',
            'aiModel', 'aiModelVersion', 'generationType', 'aspectRatio', 'coverImage',
            'exampleImages', 'category', 'tags', 'status', 'featuredOrder',
            'metaTitle', 'metaDescription', 'relatedPrompts', 'bundles', 'versions', 'abTests'
        ];

        for (const field of updateFields) {
            if (body[field] !== undefined) {
                (prompt as any)[field] = body[field];
            }
        }

        // Auto-set isFree based on price
        prompt.isFree = prompt.price === 0;

        await prompt.save();

        return NextResponse.json({
            success: true,
            id: prompt._id.toString(),
            slug: prompt.slug,
        });
    } catch (error) {
        console.error('Update marketplace prompt error:', error);
        return NextResponse.json(
            { error: 'Failed to update prompt' },
            { status: 500 }
        );
    }
}

// DELETE - Delete prompt (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        // Find by ID or slug
        const query = id.match(/^[0-9a-fA-F]{24}$/)
            ? { _id: id }
            : { slug: id };

        const result = await MarketplacePrompt.deleteOne(query);

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Prompt not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete marketplace prompt error:', error);
        return NextResponse.json(
            { error: 'Failed to delete prompt' },
            { status: 500 }
        );
    }
}
