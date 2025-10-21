import type { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTenantSchema, UpdateTenantSchema, ListTenantsQuerySchema } from './tenant.dto';
import { createTenant, getTenantById, updateTenant, listTenants } from './tenant.service';
import { getPagination } from '../../utils/pagination';

/**
 * POST /api/tenants
 * Create a new tenant
 */
export async function createTenantHandler(req: Request, res: Response): Promise<void> {
    try {
        const parsed = CreateTenantSchema.parse(req.body);
        const tenant = await createTenant(parsed);
        res.status(201).json({ tenant });
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
 * GET /api/tenants/:tenantId
 * Get tenant by ID
 */
export async function getTenantByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { tenantId } = req.params;
        if (!tenantId) {
            res.status(400).json({ error: { message: 'tenantId param is required' } });
            return;
        }
        const tenant = await getTenantById(tenantId);
        if (!tenant) {
            res.status(404).json({ error: { message: 'Tenant not found' } });
            return;
        }
        res.json({ tenant });
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * PUT /api/tenants/:tenantId
 * Update tenant
 */
export async function updateTenantHandler(req: Request, res: Response): Promise<void> {
    try {
        const { tenantId } = req.params;
        if (!tenantId) {
            res.status(400).json({ error: { message: 'tenantId param is required' } });
            return;
        }
        const parsed = UpdateTenantSchema.parse(req.body);
        const tenant = await updateTenant(tenantId, parsed);
        if (!tenant) {
            res.status(404).json({ error: { message: 'Tenant not found' } });
            return;
        }
        res.json({ tenant });
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
 * GET /api/tenants
 * List tenants with pagination
 */
export async function listTenantsHandler(req: Request, res: Response): Promise<void> {
    try {
        const queryParsed = ListTenantsQuerySchema.parse(req.query);
        const { page, limit } = getPagination({ page: queryParsed.page, limit: queryParsed.limit, maxLimit: 100 });
        const result = await listTenants(queryParsed, page, limit);
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

