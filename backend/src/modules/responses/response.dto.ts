import { z } from 'zod'

export const CreateResponseDto = z.object({
    rulesetId: z.string().min(1),
    tenantId: z.string().min(1),
    branchId: z.string().optional().nullable(),
    data: z.record(z.unknown()),
    submittedBy: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
})

export const UpdateResponseDto = z.object({
    status: z.enum(['submitted', 'reviewed', 'archived']).optional(),
    reviewedBy: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
})

export const ListResponsesDto = z.object({
    rulesetId: z.string().optional(),
    tenantId: z.string().optional(),
    status: z.enum(['submitted', 'reviewed', 'archived']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
})

export type CreateResponseInput = z.infer<typeof CreateResponseDto>
export type UpdateResponseInput = z.infer<typeof UpdateResponseDto>
export type ListResponsesInput = z.infer<typeof ListResponsesDto>

