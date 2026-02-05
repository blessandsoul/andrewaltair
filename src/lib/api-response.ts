import { NextResponse } from 'next/server';

interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiPaginatedResponse<T> {
  success: true;
  message?: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

export function apiSuccess<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true as const, message, data }, { status });
}

export function apiError(
  code: string,
  message: string,
  status = 500
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false as const, error: { code, message } },
    { status }
  );
}

export function apiPaginated<T>(
  items: T[],
  pagination: { page: number; limit: number; total: number },
  message?: string
): NextResponse<ApiPaginatedResponse<T>> {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);
  return NextResponse.json(
    {
      success: true as const,
      message,
      data: {
        items,
        pagination: {
          page,
          limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    },
    { status: 200 }
  );
}
