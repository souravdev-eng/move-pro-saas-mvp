/**
 * Job types extending existing Rules types
 * Reuses Definitions and FieldDef from types/rules.ts
 */

import type { Definitions } from './rules'

export type JobStatus = 'draft' | 'created' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'

export interface Job {
    _id: string
    tenantId: string
    branchId: string
    serviceType: string
    status: JobStatus
    payload: Record<string, unknown>
    customer?: Record<string, unknown>
    move?: Record<string, unknown>
    pricing?: Record<string, unknown>
    meta?: {
        validationSchemaVersion: string
        computedFields?: string[]
        warnings?: string[]
    }
    createdBy?: string
    createdAt: string
    updatedAt: string
}

export interface FormSchema {
    fields: Definitions['fields']
    layout: Definitions['layout']
    expressions?: Definitions['expressions']
    dataSources?: Definitions['dataSources']
    validationSchemaVersion: string
    defaults?: Record<string, unknown>
}

export interface CreateJobPayload {
    branchId: string
    serviceType: string
    payload: Record<string, unknown>
    createdBy?: string
}

export interface CreateJobResponse {
    job: Job
    validationSchemaVersion: string
    warnings?: string[]
}

export interface Paginated<T> {
    data: T[]
    page: number
    limit: number
    total: number
}

export interface ListJobsParams {
    tenantId?: string
    branchId?: string
    serviceType?: string
    status?: JobStatus
    page?: number
    limit?: number
    search?: string
}

export interface ValidateJobPayload {
    branchId: string
    serviceType: string
    payload: Record<string, unknown>
}

export interface ValidateJobResponse {
    valid: boolean
    errors: Array<{ path: string; message: string }>
    computed: Record<string, unknown>
}

