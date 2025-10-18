import type { NextFunction, Request, Response } from 'express';

type ErrorWithStatus = Error & { status?: number; details?: unknown };

export function errorHandler(err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction): void {
    const status = err.status ?? 500;
    const message = err.message || 'Internal Server Error';
    const body: Record<string, unknown> = { error: { message } };
    if (err.details != null) body.error = { message, details: err.details };
    res.status(status).json(body);
}



export function asyncHandler(fn: (req: Request, res: Response) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res);
        } catch (err) {
            next(err);
        }
    }
}