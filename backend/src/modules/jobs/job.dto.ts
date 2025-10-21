import { z } from 'zod';

/**
 * DTO schemas for Job endpoints
 * Follow existing Zod validation patterns from rulesets module
 */

export const CreateJobSchema = z.object({
    tenantId: z.string().min(1).optional(), // Can be inferred from auth context
    branchId: z.string().min(1),
    serviceType: z.string().min(1),
    payload: z.record(z.unknown()),
    createdBy: z.string().optional().nullable(),
});

export type CreateJobDTO = z.infer<typeof CreateJobSchema>;

export const ListJobsQuerySchema = z.object({
    tenantId: z.string().min(1).optional(),
    branchId: z.string().optional(),
    serviceType: z.string().optional(),
    status: z.enum(['draft', 'created', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
    page: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    limit: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    search: z.string().optional(),
});

export type ListJobsQueryDTO = z.infer<typeof ListJobsQuerySchema>;

export const ValidateJobSchema = z.object({
    branchId: z.string().min(1),
    serviceType: z.string().min(1),
    payload: z.record(z.unknown()),
});

export type ValidateJobDTO = z.infer<typeof ValidateJobSchema>;

export const GetFormSchemaParamsSchema = z.object({
    branchId: z.string().min(1),
    serviceType: z.string().min(1),
});

export type GetFormSchemaParamsDTO = z.infer<typeof GetFormSchemaParamsSchema>;

