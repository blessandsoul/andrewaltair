import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint for Docker/Kubernetes
 * Used by container orchestration for liveness/readiness probes
 */
export async function GET() {
    try {
        // Basic health check - can be extended to check DB connection
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version || '1.0.0',
        };

        return NextResponse.json(healthCheck, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}
