export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

// GET - Aggregated analytics data
export async function GET(request: Request) {
    if (!verifyAdmin(request)) {
        return unauthorizedResponse('Admin access required');
    }

    try {
        const result = await AnalyticsService.getDashboardStats();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Analytics aggregation error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
