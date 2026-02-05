export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';
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

        return apiSuccess({ quests: questsWithProgress }, 'Quests fetched successfully');
    } catch (error) {
        console.error('Quests GET Error:', error);
        return apiError(ERROR_CODES.CONVERSION_FETCH_FAILED, 'Internal Server Error', 500);
    }
}

// POST: Start or complete quest step
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(req);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'Unauthorized', 401);
        }
        const userId = user._id.toString();

        const { questId, stepId, action } = await req.json();

        if (!questId) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'questId required', 400);
        }

        const quest = await Quest.findById(questId);
        if (!quest) {
            return apiError(ERROR_CODES.NOT_FOUND, 'Quest not found', 404);
        }

        let participant = quest.participants.find(
            (p: any) => p.userId?.toString() === userId
        );

        // Start quest
        if (action === 'start') {
            if (participant) {
                return apiSuccess(null, 'Already started');
            }

            quest.participants.push({
                userId,
                completedSteps: [],
                startedAt: new Date(),
            });
            await quest.save();

            return apiSuccess(null, 'Quest started');
        }

        // Complete step
        if (action === 'complete_step' && stepId) {
            if (!participant) {
                return apiError(ERROR_CODES.BAD_REQUEST, 'Quest not started', 400);
            }

            if (participant.completedSteps.includes(stepId)) {
                return apiSuccess({ alreadyCompleted: true }, 'Step already completed');
            }

            const step = quest.steps.find((s: any) => s.id === stepId);
            if (!step) {
                return apiError(ERROR_CODES.NOT_FOUND, 'Step not found', 404);
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

            return apiSuccess({
                xpEarned: step.xpReward,
                questCompleted: allStepsCompleted,
            }, 'Step completed');
        }

        return apiError(ERROR_CODES.BAD_REQUEST, 'Invalid action', 400);

    } catch (error) {
        console.error('Quests POST Error:', error);
        return apiError(ERROR_CODES.CONVERSION_ACTION_FAILED, 'Internal Server Error', 500);
    }
}

