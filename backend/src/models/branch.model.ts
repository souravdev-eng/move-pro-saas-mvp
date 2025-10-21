import { Schema, model, type Document } from 'mongoose';

export type BranchStatus = 'active' | 'inactive' | 'archived';

export interface BranchAddress {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
}

export interface BranchContact {
    phone?: string;
    email?: string;
    managerName?: string;
}

export interface Branch extends Document {
    branchId: string; // Unique branch identifier
    tenantId: string;
    name: string;
    displayName?: string;
    status: BranchStatus;
    address: BranchAddress;
    contact?: BranchContact;
    timezone?: string;
    settings?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const BranchSchema = new Schema<Branch>({
    branchId: { type: String, required: true, unique: true, index: true },
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    displayName: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active', index: true },
    address: {
        street: { type: String, default: null },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, default: null },
        country: { type: String, default: 'USA' },
    },
    contact: {
        phone: { type: String, default: null },
        email: { type: String, default: null },
        managerName: { type: String, default: null },
    },
    timezone: { type: String, default: 'America/Chicago' },
    settings: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true, collection: 'branches' });

// Indexes
BranchSchema.index({ tenantId: 1, status: 1 });
BranchSchema.index({ branchId: 1, tenantId: 1 }, { unique: true });

export const BranchModel = model<Branch>('Branch', BranchSchema);

