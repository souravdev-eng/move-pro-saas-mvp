import { ResponseModel } from './response.model'
import type { CreateResponseInput, UpdateResponseInput, ListResponsesInput } from './response.dto'

export class ResponseService {
    async create(input: CreateResponseInput) {
        const response = await ResponseModel.create({
            ...input,
            submittedAt: new Date(),
            status: 'submitted',
        })
        return response
    }

    async list(query: ListResponsesInput) {
        const { rulesetId, tenantId, status, page, limit } = query
        const filter: any = {}

        if (rulesetId) filter.rulesetId = rulesetId
        if (tenantId) filter.tenantId = tenantId
        if (status) filter.status = status

        const skip = (page - 1) * limit
        const [data, total] = await Promise.all([
            ResponseModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            ResponseModel.countDocuments(filter),
        ])

        return {
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }

    async findById(id: string) {
        const response = await ResponseModel.findById(id).lean()
        if (!response) throw new Error('Response not found')
        return response
    }

    async update(id: string, input: UpdateResponseInput) {
        const updates: any = { ...input }
        if (input.status === 'reviewed' && !updates.reviewedAt) {
            updates.reviewedAt = new Date()
        }

        const response = await ResponseModel.findByIdAndUpdate(id, updates, { new: true }).lean()
        if (!response) throw new Error('Response not found')
        return response
    }

    async delete(id: string) {
        const response = await ResponseModel.findByIdAndDelete(id).lean()
        if (!response) throw new Error('Response not found')
        return response
    }

    async getStats(rulesetId: string) {
        const total = await ResponseModel.countDocuments({ rulesetId })
        const byStatus = await ResponseModel.aggregate([
            { $match: { rulesetId } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ])

        return {
            total,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item._id] = item.count
                return acc
            }, {} as Record<string, number>),
        }
    }
}

export const responseService = new ResponseService()

