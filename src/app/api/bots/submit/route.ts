import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromptSubmission from '@/models/PromptSubmission';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const data = await request.json();
        const { name, email, promptName, category, description, masterPrompt } = data;

        // Validation
        if (!name || !email || !promptName || !description || !masterPrompt) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create submission
        const submission = await PromptSubmission.create({
            name,
            email,
            promptName,
            category,
            description,
            masterPrompt,
            status: 'pending',
            submittedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Prompt submitted successfully',
            id: submission._id
        });
    } catch (error) {
        console.error('Error submitting prompt:', error);
        return NextResponse.json(
            { error: 'Failed to submit prompt' },
            { status: 500 }
        );
    }
}

