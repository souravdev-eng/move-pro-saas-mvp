import { Schema, model, type Document } from 'mongoose';

export type JobStatus = 'draft' | 'created' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface JobCustomer {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: unknown;
}

export interface JobMove {
    origin?: string;
    destination?: string;
    moveDate?: Date | string;
    [key: string]: unknown;
}

export interface JobPricing {
    estimatedCost?: number;
    finalCost?: number;
    currency?: string;
    [key: string]: unknown;
}

export interface JobMeta {
    validationSchemaVersion: string;
    computedFields?: string[];
    warnings?: string[];
    [key: string]: unknown;
}

export interface Job extends Document {
    tenantId: string;
    branchId: string;
    serviceType: string;
    status: JobStatus;

    // Core data
    payload: Record<string, unknown>;
    customer?: JobCustomer;
    move?: JobMove;
    pricing?: JobPricing;

    // Metadata
    meta: JobMeta;

    // Audit fields
    createdBy?: string | null;
    assignedTo?: string | null;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<Job>({
    tenantId: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    serviceType: { type: String, required: true, index: true },
    status: {
        type: String,
        enum: ['draft', 'created', 'assigned', 'in_progress', 'completed', 'cancelled'],
        default: 'created',
        index: true,
    },

    payload: { type: Schema.Types.Mixed, required: true },
    customer: { type: Schema.Types.Mixed, default: {} },
    move: { type: Schema.Types.Mixed, default: {} },
    pricing: { type: Schema.Types.Mixed, default: {} },

    meta: {
        type: Schema.Types.Mixed,
        required: true,
        default: {},
    },

    createdBy: { type: String, default: null },
    assignedTo: { type: String, default: null },
}, { timestamps: true, collection: 'jobs' });

// Indexes for common queries
JobSchema.index({ tenantId: 1, branchId: 1, serviceType: 1, createdAt: -1 });
JobSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
JobSchema.index({ 'meta.validationSchemaVersion': 1 });
JobSchema.index({ createdAt: -1 });

export const JobModel = model<Job>('Job', JobSchema);

