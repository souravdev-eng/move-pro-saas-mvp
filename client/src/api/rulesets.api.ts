import http from './http'
import type { Paginated, Ruleset } from '../types/rules'

export async function createRuleset(payload: Partial<Ruleset>): Promise<Ruleset> {
    const res = await http.post('/api/rulesets', payload)
    return res.data
}

export async function listRulesets(params: { tenantId?: string; page?: number; limit?: number }): Promise<Paginated<Ruleset>> {
    const res = await http.get('/api/rulesets', { params })
    return res.data
}

export async function getRuleset(id: string): Promise<Ruleset> {
    const res = await http.get(`/api/rulesets/${id}`)
    return res.data
}

export async function deleteRulesetById(id: string): Promise<void> {
    await http.delete(`/api/rulesets/${id}`)
}
