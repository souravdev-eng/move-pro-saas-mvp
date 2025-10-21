/**
 * Jobs API Client
 * Follows the same pattern as rulesets.api.ts and responses.api.ts
 */

import http from './http'
import type {
    FormSchema,
    Job,
    CreateJobPayload,
    CreateJobResponse,
    Paginated,
    ListJobsParams,
    ValidateJobPayload,
    ValidateJobResponse,
} from '../types/jobs'

export async function getFormSchema(branchId: string, serviceType: string): Promise<FormSchema> {
    const res = await http.get(`/api/form/${branchId}/${serviceType}`)
    return res.data
}

export async function createJob(payload: CreateJobPayload): Promise<CreateJobResponse> {
    const res = await http.post('/api/jobs', payload)
    return res.data
}

export async function listJobs(params: ListJobsParams): Promise<Paginated<Job>> {
    const res = await http.get('/api/jobs', { params })
    return res.data
}

export async function getJob(id: string): Promise<Job> {
    const res = await http.get(`/api/jobs/${id}`)
    return res.data.job || res.data
}

export async function validateJob(payload: ValidateJobPayload): Promise<ValidateJobResponse> {
    const res = await http.post('/api/jobs/validate', payload)
    return res.data
}

