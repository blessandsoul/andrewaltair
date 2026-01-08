import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quest from '@/models/Quest';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/server-auth';

// GET: List quests with user progress (public list, but progress requires auth)
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get user if authenticated (optional for viewing progress)
        const user = await getUserFromRequest(req);
        const userId = user?._id?.toString();

        const quests = await Quest.find({ isActive: true }).lean();

        // Format quests with user progress
        const questsWithProgress = quests.map(quest => {
            const participant = quest.participants?.find(
                (p: any) => p.userId?.toString() === userId
            );

            return {
                ...quest,
                userProgress: participant ? {
                    started: true,
                    completedSteps: participant.completedSteps || [],
                    isComplete: participant.completedAt != null,
                } : {
                    started: false,
                    completedSteps: [],
                    isComplete: false,
                }
            };
        });

        return NextResponse.json({ quests: questsWithProgress });
    } catch (error) {
        console.error('Quests GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Start or complete quest step
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = user._id.toString();

        const { questId, stepId, action } = await req.json();

        if (!questId) {
            return NextResponse.json({ error: 'questId required' }, { status: 400 });
        }

        const quest = await Quest.findById(questId);
        if (!quest) {
            return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
        }

        let participant = quest.participants.find(
            (p: any) => p.userId?.toString() === userId
        );

        // Start quest
        if (action === 'start') {
            if (participant) {
                return NextResponse.json({ success: true, message: 'Already started' });
            }

            quest.participants.push({
                userId,
                completedSteps: [],
                startedAt: new Date(),
            });
            await quest.save();

            return NextResponse.json({ success: true, message: 'Quest started' });
        }

        // Complete step
        if (action === 'complete_step' && stepId) {
            if (!participant) {
                return NextResponse.json({ error: 'Quest not started' }, { status: 400 });
            }

            if (participant.completedSteps.includes(stepId)) {
                return NextResponse.json({ success: true, alreadyCompleted: true });
            }

            const step = quest.steps.find((s: any) => s.id === stepId);
            if (!step) {
                return NextResponse.json({ error: 'Step not found' }, { status: 404 });
            }

            // Update participant
            const participantIndex = quest.participants.findIndex(
                (p: any) => p.userId?.toString() === userId
            );
            quest.participants[participantIndex].completedSteps.push(stepId);

            // Check if all steps completed
            const allStepsCompleted = quest.steps.every((s: any) =>
                quest.participants[participantIndex].completedSteps.includes(s.id)
            );

            if (allStepsCompleted) {
                quest.participants[participantIndex].completedAt = new Date();
            }

            await quest.save();

            // Grant XP
            await User.findByIdAndUpdate(userId, {
                $inc: { 'gamification.xp': step.xpReward },
                $addToSet: { 'gamification.completedQuests': allStepsCompleted ? questId : undefined }
            });

            return NextResponse.json({
                success: true,
                xpEarned: step.xpReward,
                questCompleted: allStepsCompleted,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Quests POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
