import { z } from 'zod';

/**
 * DTO schemas for Tenant endpoints
 */

export const CreateTenantSchema = z.object({
    tenantId: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/, 'Tenant ID must be lowercase alphanumeric with dashes/underscores'),
    name: z.string().min(1).max(200),
    displayName: z.string().min(1).max(200).optional(),
    subscription: z.object({
        plan: z.enum(['trial', 'basic', 'professional', 'enterprise']),
        maxBranches: z.number().int().positive().optional(),
        maxUsers: z.number().int().positive().optional(),
    }),
    billing: z.object({
        companyName: z.string().optional(),
        taxId: z.string().optional(),
        billingEmail: z.string().email().optional(),
        billingAddress: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional(),
        }).optional(),
    }).optional(),
    settings: z.object({
        timezone: z.string().optional(),
        currency: z.string().optional(),
        dateFormat: z.string().optional(),
        features: z.object({
            jobCreation: z.boolean().optional(),
            rulesEngine: z.boolean().optional(),
            analytics: z.boolean().optional(),
        }).optional(),
    }).optional(),
});

export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;

export const UpdateTenantSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    displayName: z.string().min(1).max(200).optional().nullable(),
    status: z.enum(['active', 'suspended', 'inactive']).optional(),
    subscription: z.object({
        plan: z.enum(['trial', 'basic', 'professional', 'enterprise']).optional(),
        endDate: z.string().datetime().optional().nullable(),
        maxBranches: z.number().int().positive().optional(),
        maxUsers: z.number().int().positive().optional(),
    }).optional(),
    billing: z.object({
        companyName: z.string().optional(),
        taxId: z.string().optional(),
        billingEmail: z.string().email().optional(),
        billingAddress: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zipCode: z.string().optional(),
            country: z.string().optional(),
        }).optional(),
    }).optional(),
    settings: z.object({
        timezone: z.string().optional(),
        currency: z.string().optional(),
        dateFormat: z.string().optional(),
        features: z.object({
            jobCreation: z.boolean().optional(),
            rulesEngine: z.boolean().optional(),
            analytics: z.boolean().optional(),
        }).optional(),
    }).optional(),
});

export type UpdateTenantDTO = z.infer<typeof UpdateTenantSchema>;

export const ListTenantsQuerySchema = z.object({
    status: z.enum(['active', 'suspended', 'inactive']).optional(),
    plan: z.enum(['trial', 'basic', 'professional', 'enterprise']).optional(),
    page: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    limit: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    search: z.string().optional(),
});

export type ListTenantsQueryDTO = z.infer<typeof ListTenantsQuerySchema>;

