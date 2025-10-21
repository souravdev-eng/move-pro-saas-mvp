import type { Request, Response } from 'express';
import { z } from 'zod';
import {
    CreateJobSchema,
    ListJobsQuerySchema,
    ValidateJobSchema,
    GetFormSchemaParamsSchema,
} from './job.dto';
import { createJob, listJobs, getJobById, validateJob, getFormSchema } from './job.service';
import { getPagination } from '../../utils/pagination';

/**
 * GET /api/form/:branchId/:serviceType
 * Get form schema for a branch + serviceType
 */
export async function getFormSchemaHandler(req: Request, res: Response): Promise<void> {
    try {
        const { branchId, serviceType } = req.params;

        if (!branchId || !serviceType) {
            res.status(400).json({ error: { message: 'branchId and serviceType are required' } });
            return;
        }

        const formSchema = await getFormSchema(branchId, serviceType);
        if (!formSchema) {
            res.status(404).json({ error: { message: 'No published ruleset found for this branch/serviceType' } });
            return;
        }

        res.json(formSchema);
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * POST /api/jobs
 * Create a new job
 */
export async function createJobHandler(req: Request, res: Response): Promise<void> {
    try {
        const parsed = CreateJobSchema.parse(req.body);
        const result = await createJob(parsed);
        res.status(201).json(result);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        const body: any = { error: { message: anyErr?.message ?? 'Internal Server Error' } };
        if (anyErr?.details) {
            body.error.details = anyErr.details;
        }
        res.status(status).json(body);
    }
}

/**
 * GET /api/jobs
 * List jobs with pagination
 */
export async function listJobsHandler(req: Request, res: Response): Promise<void> {
    try {
        const queryParsed = ListJobsQuerySchema.parse(req.query);
        const { page, limit } = getPagination({ page: queryParsed.page, limit: queryParsed.limit, maxLimit: 100 });
        const result = await listJobs(queryParsed, page, limit);
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

/**
 * GET /api/jobs/:id
 * Get job by ID
 */
export async function getJobByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: { message: 'id param is required' } });
            return;
        }
        const job = await getJobById(id);
        if (!job) {
            res.status(404).json({ error: { message: 'Job not found' } });
            return;
        }
        res.json({ job });
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

/**
 * POST /api/jobs/validate
 * Validate job payload without creating
 */
export async function validateJobHandler(req: Request, res: Response): Promise<void> {
    try {
        const parsed = ValidateJobSchema.parse(req.body);
        const result = await validateJob(parsed);
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

