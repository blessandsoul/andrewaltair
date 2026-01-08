import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EncyclopediaCertificate from '@/models/EncyclopediaCertificate';
import EncyclopediaSection from '@/models/EncyclopediaSection';
import EncyclopediaProgress from '@/models/EncyclopediaProgress';

// Generate unique ID
function generateCertId(): string {
    return crypto.randomUUID().slice(0, 8).toUpperCase();
}

// GET all certificates for a user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get('visitorId');
        const userId = searchParams.get('userId');

        const query: Record<string, unknown> = {};
        if (userId) query.userId = userId;
        else if (visitorId) query.visitorId = visitorId;
        else return NextResponse.json({ error: 'visitorId or userId required' }, { status: 400 });

        const certificates = await EncyclopediaCertificate.find(query)
            .sort({ completedAt: -1 })
            .lean();

        return NextResponse.json({ certificates });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
    }
}

// POST generate new certificate
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        const { sectionId, visitorId, userId, userName, userEmail } = body;

        if (!sectionId || !userName) {
            return NextResponse.json({ error: 'sectionId and userName required' }, { status: 400 });
        }

        // Get section info
        const section = await EncyclopediaSection.findById(sectionId);
        if (!section) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        // Check if user has completed the section
        const progressQuery: Record<string, unknown> = { sectionId, completed: true };
        if (userId) progressQuery.userId = userId;
        else if (visitorId) progressQuery.visitorId = visitorId;

        const completedArticles = await EncyclopediaProgress.countDocuments(progressQuery);

        // Check if certificate already exists
        const existingCert = await EncyclopediaCertificate.findOne({
            sectionId,
            userId: userId || undefined,
        });

        if (existingCert) {
            return NextResponse.json({
                certificate: existingCert,
                message: 'Certificate already exists'
            });
        }

        // Generate unique certificate ID
        const certificateId = `CERT-${section.slug.toUpperCase()}-${generateCertId()}`;

        // Create certificate
        const certificate = await EncyclopediaCertificate.create({
            sectionId,
            sectionTitle: section.title,
            userId,
            userName,
            userEmail,
            certificateId,
            articlesCompleted: completedArticles,
            totalArticles: section.articleCount || completedArticles,
            completedAt: new Date(),
        });

        return NextResponse.json({ certificate }, { status: 201 });
    } catch (error) {
        console.error('Error creating certificate:', error);
        return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
    }
}
