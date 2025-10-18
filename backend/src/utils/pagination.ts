export interface PaginationParams {
    page?: unknown;
    limit?: unknown;
    maxLimit?: number;
}

export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}

export function getPagination({ page, limit, maxLimit = 100 }: PaginationParams): PaginationResult {
    const pageNum = Math.max(1, Number.isFinite(Number(page)) ? Math.trunc(Number(page)) : 1);
    const limitNumRaw = Number.isFinite(Number(limit)) ? Math.trunc(Number(limit)) : 20;
    const limitNum = Math.max(1, Math.min(limitNumRaw, maxLimit));
    const skip = (pageNum - 1) * limitNum;
    return { page: pageNum, limit: limitNum, skip };
}


