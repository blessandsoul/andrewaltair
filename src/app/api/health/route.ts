export const dynamic = 'force-dynamic'
import { apiSuccess, apiError } from '@/lib/api-response';
import { ERROR_CODES } from '@/lib/error-codes';

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

        return apiSuccess(healthCheck, 'Health check passed');
    } catch (error) {
        return apiError(
            ERROR_CODES.HEALTH_CHECK_FAILED,
            error instanceof Error ? error.message : 'Unknown error',
            503
        );
    }
}

