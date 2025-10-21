import { z } from 'zod';

/**
 * DTO schemas for Branch endpoints
 */

export const CreateBranchSchema = z.object({
    branchId: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/, 'Branch ID must be lowercase alphanumeric with dashes/underscores'),
    tenantId: z.string().min(1),
    name: z.string().min(1).max(200),
    displayName: z.string().min(1).max(200).optional(),
    address: z.object({
        street: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        zipCode: z.string().optional(),
        country: z.string().optional(),
    }),
    contact: z.object({
        phone: z.string().optional(),
        email: z.string().email().optional(),
        managerName: z.string().optional(),
    }).optional(),
    timezone: z.string().optional(),
    settings: z.record(z.unknown()).optional(),
});

export type CreateBranchDTO = z.infer<typeof CreateBranchSchema>;

export const UpdateBranchSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    displayName: z.string().min(1).max(200).optional().nullable(),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
    contact: z.object({
        phone: z.string().optional(),
        email: z.string().email().optional(),
        managerName: z.string().optional(),
    }).optional(),
    timezone: z.string().optional(),
    settings: z.record(z.unknown()).optional(),
});

export type UpdateBranchDTO = z.infer<typeof UpdateBranchSchema>;

export const ListBranchesQuerySchema = z.object({
    tenantId: z.string().min(1),
    status: z.enum(['active', 'inactive', 'archived']).optional(),
    page: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    limit: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    search: z.string().optional(),
});

export type ListBranchesQueryDTO = z.infer<typeof ListBranchesQuerySchema>;

