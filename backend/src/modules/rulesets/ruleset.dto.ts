import { z } from 'zod';

const DefinitionsSchema = z.object({
    fields: z.array(z.any()).nonempty(),
    layout: z.object({}).passthrough(),
    expressions: z.array(z.any()).optional(),
    dataSources: z.array(z.any()).optional(),
    widgets: z.array(z.any()).optional(),
}).passthrough();

export const CreateRulesetSchema = z.object({
    tenantId: z.string().min(1),
    scope: z.enum(['global', 'branch']),
    branchId: z.string().min(1).optional().nullable(),
    name: z.string().min(1),
    notes: z.string().optional().nullable(),
    definitions: DefinitionsSchema,
    createdBy: z.string().optional().nullable(),
});

export type CreateRulesetDTO = z.infer<typeof CreateRulesetSchema>;

export const ListRulesetsQuerySchema = z.object({
    tenantId: z.string().min(1).optional(),
    scope: z.enum(['global', 'branch']).optional(),
    branchId: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    page: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    limit: z.preprocess((v) => (typeof v === 'string' ? Number(v) : v), z.number().int().positive().optional()),
    search: z.string().optional(),
});

export type ListRulesetsQueryDTO = z.infer<typeof ListRulesetsQuerySchema>;


