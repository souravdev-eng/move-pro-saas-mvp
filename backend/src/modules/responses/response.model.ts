import { Schema, model, type Document } from 'mongoose'

export type ResponseStatus = 'submitted' | 'reviewed' | 'archived'

export interface Response extends Document {
    rulesetId: string
    tenantId: string
    branchId?: string | null
    status: ResponseStatus
    data: Record<string, unknown>
    submittedBy?: string | null
    submittedAt: Date
    reviewedBy?: string | null
    reviewedAt?: Date | null
    notes?: string | null
    metadata?: Record<string, unknown>
    createdAt: Date
    updatedAt: Date
}

const ResponseSchema = new Schema<Response>(
    {
        rulesetId: { type: String, required: true, index: true },
        tenantId: { type: String, required: true, index: true },
        branchId: { type: String, default: null },
        status: { type: String, enum: ['submitted', 'reviewed', 'archived'], default: 'submitted', index: true },
        data: { type: Schema.Types.Mixed, required: true },
        submittedBy: { type: String, default: null },
        submittedAt: { type: Date, default: () => new Date() },
        reviewedBy: { type: String, default: null },
        reviewedAt: { type: Date, default: null },
        notes: { type: String, default: null },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true, collection: 'responses' }
)

// Indexes
ResponseSchema.index({ rulesetId: 1, createdAt: -1 })
ResponseSchema.index({ tenantId: 1, status: 1 })
ResponseSchema.index({ submittedAt: -1 })

export const ResponseModel = model<Response>('Response', ResponseSchema)

