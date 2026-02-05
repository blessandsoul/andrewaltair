import { describe, it, expect, vi } from 'vitest';

vi.mock('next/server', () => ({
    NextResponse: {
        json: vi.fn((body, options) => ({ body, status: options?.status || 200 })),
    },
}));

import { apiSuccess, apiError, apiPaginated } from '@/lib/api-response';

describe('api-response', () => {
    describe('apiSuccess', () => {
        it('should return { success: true, data } with status 200 by default', () => {
            // Arrange
            const data = { id: 1, name: 'Test' };

            // Act
            const response = apiSuccess(data) as unknown as {
                body: { success: boolean; data: typeof data; message?: string };
                status: number;
            };

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(data);
            expect(response.status).toBe(200);
        });

        it('should include message when provided', () => {
            // Arrange
            const data = { id: 1 };
            const message = 'Created successfully';

            // Act
            const response = apiSuccess(data, message) as unknown as {
                body: { success: boolean; data: typeof data; message?: string };
                status: number;
            };

            // Assert
            expect(response.body.message).toBe(message);
        });

        it('should use custom status code when provided', () => {
            // Arrange
            const data = { id: 1 };

            // Act
            const response = apiSuccess(data, 'Created', 201) as unknown as {
                body: { success: boolean; data: typeof data };
                status: number;
            };

            // Assert
            expect(response.status).toBe(201);
        });

        it('should preserve data types — objects', () => {
            // Arrange
            const data = { nested: { value: 42 }, list: [1, 2, 3] };

            // Act
            const response = apiSuccess(data) as unknown as {
                body: { data: typeof data };
            };

            // Assert
            expect(response.body.data).toEqual(data);
        });

        it('should preserve data types — arrays', () => {
            // Arrange
            const data = [1, 'two', { three: 3 }];

            // Act
            const response = apiSuccess(data) as unknown as {
                body: { data: typeof data };
            };

            // Assert
            expect(response.body.data).toEqual(data);
        });

        it('should preserve data types — null', () => {
            // Act
            const response = apiSuccess(null) as unknown as {
                body: { data: null };
            };

            // Assert
            expect(response.body.data).toBeNull();
        });
    });

    describe('apiError', () => {
        it('should return { success: false, error: { code, message } } with status 500 by default', () => {
            // Arrange
            const code = 'INTERNAL_ERROR';
            const message = 'Something went wrong';

            // Act
            const response = apiError(code, message) as unknown as {
                body: { success: boolean; error: { code: string; message: string } };
                status: number;
            };

            // Assert
            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe(code);
            expect(response.body.error.message).toBe(message);
            expect(response.status).toBe(500);
        });

        it('should use custom status code when provided', () => {
            // Act
            const response = apiError('NOT_FOUND', 'Not found', 404) as unknown as {
                status: number;
            };

            // Assert
            expect(response.status).toBe(404);
        });

        it('should include error code and message', () => {
            // Arrange
            const code = 'AUTH_TOKEN_EXPIRED';
            const message = 'Your session has expired';

            // Act
            const response = apiError(code, message, 401) as unknown as {
                body: { error: { code: string; message: string } };
            };

            // Assert
            expect(response.body.error.code).toBe(code);
            expect(response.body.error.message).toBe(message);
        });
    });

    describe('apiPaginated', () => {
        it('should return paginated response with correct pagination metadata', () => {
            // Arrange
            const items = [{ id: 1 }, { id: 2 }];
            const pagination = { page: 1, limit: 10, total: 25 };

            // Act
            const response = apiPaginated(items, pagination) as unknown as {
                body: {
                    success: boolean;
                    data: {
                        items: typeof items;
                        pagination: {
                            page: number;
                            limit: number;
                            totalItems: number;
                            totalPages: number;
                            hasNextPage: boolean;
                            hasPreviousPage: boolean;
                        };
                    };
                };
                status: number;
            };

            // Assert
            expect(response.body.success).toBe(true);
            expect(response.body.data.items).toEqual(items);
            expect(response.body.data.pagination.page).toBe(1);
            expect(response.body.data.pagination.limit).toBe(10);
            expect(response.body.data.pagination.totalItems).toBe(25);
            expect(response.status).toBe(200);
        });

        it('should calculate totalPages correctly', () => {
            // Arrange & Act
            const response = apiPaginated([], { page: 1, limit: 10, total: 25 }) as unknown as {
                body: { data: { pagination: { totalPages: number } } };
            };

            // Assert — ceil(25 / 10) = 3
            expect(response.body.data.pagination.totalPages).toBe(3);
        });

        it('should set hasNextPage to true when not on last page', () => {
            // Act
            const response = apiPaginated([], { page: 1, limit: 10, total: 25 }) as unknown as {
                body: { data: { pagination: { hasNextPage: boolean } } };
            };

            // Assert
            expect(response.body.data.pagination.hasNextPage).toBe(true);
        });

        it('should set hasNextPage to false when on last page', () => {
            // Act
            const response = apiPaginated([], { page: 3, limit: 10, total: 25 }) as unknown as {
                body: { data: { pagination: { hasNextPage: boolean } } };
            };

            // Assert
            expect(response.body.data.pagination.hasNextPage).toBe(false);
        });

        it('should set hasPreviousPage to true when not on first page', () => {
            // Act
            const response = apiPaginated([], { page: 2, limit: 10, total: 25 }) as unknown as {
                body: { data: { pagination: { hasPreviousPage: boolean } } };
            };

            // Assert
            expect(response.body.data.pagination.hasPreviousPage).toBe(true);
        });

        it('should set hasPreviousPage to false when on first page', () => {
            // Act
            const response = apiPaginated([], { page: 1, limit: 10, total: 25 }) as unknown as {
                body: { data: { pagination: { hasPreviousPage: boolean } } };
            };

            // Assert
            expect(response.body.data.pagination.hasPreviousPage).toBe(false);
        });

        it('should handle empty items array', () => {
            // Act
            const response = apiPaginated([], { page: 1, limit: 10, total: 0 }) as unknown as {
                body: {
                    data: {
                        items: unknown[];
                        pagination: {
                            totalItems: number;
                            totalPages: number;
                            hasNextPage: boolean;
                            hasPreviousPage: boolean;
                        };
                    };
                };
            };

            // Assert
            expect(response.body.data.items).toEqual([]);
            expect(response.body.data.pagination.totalItems).toBe(0);
            expect(response.body.data.pagination.totalPages).toBe(0);
            expect(response.body.data.pagination.hasNextPage).toBe(false);
            expect(response.body.data.pagination.hasPreviousPage).toBe(false);
        });

        it('should handle single page', () => {
            // Arrange
            const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

            // Act
            const response = apiPaginated(items, { page: 1, limit: 10, total: 3 }) as unknown as {
                body: {
                    data: {
                        items: typeof items;
                        pagination: {
                            totalPages: number;
                            hasNextPage: boolean;
                            hasPreviousPage: boolean;
                        };
                    };
                };
            };

            // Assert
            expect(response.body.data.items).toEqual(items);
            expect(response.body.data.pagination.totalPages).toBe(1);
            expect(response.body.data.pagination.hasNextPage).toBe(false);
            expect(response.body.data.pagination.hasPreviousPage).toBe(false);
        });

        it('should include message when provided', () => {
            // Act
            const response = apiPaginated([], { page: 1, limit: 10, total: 0 }, 'Fetched posts') as unknown as {
                body: { message: string };
            };

            // Assert
            expect(response.body.message).toBe('Fetched posts');
        });
    });
});
