import type { Request, Response } from 'express';
import { z } from 'zod';
import { CreateBranchSchema, UpdateBranchSchema, ListBranchesQuerySchema } from './branch.dto';
import { createBranch, getBranchById, updateBranch, listBranches } from './branch.service';
import { getPagination } from '../../utils/pagination';

/**
 * POST /api/branches
 * Create a new branch
 */
export async function createBranchHandler(req: Request, res: Response): Promise<void> {
    try {
        const parsed = CreateBranchSchema.parse(req.body);
        const branch = await createBranch(parsed);
        res.status(201).json({ branch });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * GET /api/branches/:branchId
 * Get branch by ID
 */
export async function getBranchByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { branchId } = req.params;
        const { tenantId } = req.query;

        if (!branchId) {
            res.status(400).json({ error: { message: 'branchId param is required' } });
            return;
        }

        const branch = await getBranchById(branchId, tenantId as string);
        if (!branch) {
            res.status(404).json({ error: { message: 'Branch not found' } });
            return;
        }
        res.json({ branch });
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * PUT /api/branches/:branchId
 * Update branch
 */
export async function updateBranchHandler(req: Request, res: Response): Promise<void> {
    try {
        const { branchId } = req.params;
        const { tenantId } = req.query;

        if (!branchId) {
            res.status(400).json({ error: { message: 'branchId param is required' } });
            return;
        }
        if (!tenantId) {
            res.status(400).json({ error: { message: 'tenantId query param is required' } });
            return;
        }

        const parsed = UpdateBranchSchema.parse(req.body);
        const branch = await updateBranch(branchId, tenantId as string, parsed);
        if (!branch) {
            res.status(404).json({ error: { message: 'Branch not found' } });
            return;
        }
        res.json({ branch });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * GET /api/branches
 * List branches with pagination
 */
export async function listBranchesHandler(req: Request, res: Response): Promise<void> {
    try {
        const queryParsed = ListBranchesQuerySchema.parse(req.query);
        const { page, limit } = getPagination({ page: queryParsed.page, limit: queryParsed.limit, maxLimit: 100 });
        const result = await listBranches(queryParsed, page, limit);
        res.json(result);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

