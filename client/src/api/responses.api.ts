import http from './http'

export interface Response {
    _id: string
    rulesetId: string
    tenantId: string
    branchId?: string
    status: 'submitted' | 'reviewed' | 'archived'
    data: Record<string, unknown>
    submittedBy?: string
    submittedAt: string
    reviewedBy?: string
    reviewedAt?: string
    notes?: string
    metadata?: Record<string, unknown>
    createdAt: string
    updatedAt: string
}

export interface Paginated<T> {
    data: T[]
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface ResponseStats {
    total: number
    byStatus: Record<string, number>
}

export async function createResponse(payload: {
    rulesetId: string
    tenantId: string
    branchId?: string
    data: Record<string, unknown>
    submittedBy?: string
    notes?: string
}): Promise<Response> {
    const res = await http.post('/api/responses', payload)
    return res.data
}

export async function listResponses(params: {
    rulesetId?: string
    tenantId?: string
    status?: string
    page?: number
    limit?: number
}): Promise<Paginated<Response>> {
    const res = await http.get('/api/responses', { params })
    return res.data
}

export async function getResponse(id: string): Promise<Response> {
    const res = await http.get(`/api/responses/${id}`)
    return res.data
}

export async function updateResponse(
    id: string,
    updates: {
        status?: 'submitted' | 'reviewed' | 'archived'
        reviewedBy?: string
        notes?: string
    }
): Promise<Response> {
    const res = await http.patch(`/api/responses/${id}`, updates)
    return res.data
}

export async function deleteResponse(id: string): Promise<void> {
    await http.delete(`/api/responses/${id}`)
}

export async function getResponseStats(rulesetId: string): Promise<ResponseStats> {
    const res = await http.get(`/api/responses/stats/${rulesetId}`)
    return res.data
}

