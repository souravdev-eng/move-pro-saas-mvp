import { Schema, model, type Document } from 'mongoose';

export type TenantStatus = 'active' | 'suspended' | 'inactive';
export type TenantPlan = 'trial' | 'basic' | 'professional' | 'enterprise';

export interface TenantSubscription {
    plan: TenantPlan;
    startDate: Date;
    endDate?: Date;
    maxBranches?: number;
    maxUsers?: number;
}

export interface TenantBilling {
    companyName?: string;
    taxId?: string;
    billingEmail?: string;
    billingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

export interface TenantSettings {
    timezone?: string;
    currency?: string;
    dateFormat?: string;
    features?: {
        jobCreation?: boolean;
        rulesEngine?: boolean;
        analytics?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface Tenant extends Document {
    tenantId: string; // Unique tenant identifier
    name: string;
    displayName?: string;
    status: TenantStatus;
    subscription: TenantSubscription;
    billing?: TenantBilling;
    settings?: TenantSettings;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const TenantSchema = new Schema<Tenant>({
    tenantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    displayName: { type: String, default: null },
    status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
    subscription: {
        plan: { type: String, enum: ['trial', 'basic', 'professional', 'enterprise'], required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, default: null },
        maxBranches: { type: Number, default: 10 },
        maxUsers: { type: Number, default: 50 },
    },
    billing: {
        companyName: { type: String, default: null },
        taxId: { type: String, default: null },
        billingEmail: { type: String, default: null },
        billingAddress: {
            street: { type: String, default: null },
            city: { type: String, default: null },
            state: { type: String, default: null },
            zipCode: { type: String, default: null },
            country: { type: String, default: null },
        },
    },
    settings: {
        timezone: { type: String, default: 'America/Chicago' },
        currency: { type: String, default: 'USD' },
        dateFormat: { type: String, default: 'MM/DD/YYYY' },
        features: {
            jobCreation: { type: Boolean, default: true },
            rulesEngine: { type: Boolean, default: true },
            analytics: { type: Boolean, default: false },
        },
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true, collection: 'tenants' });

// Indexes
TenantSchema.index({ tenantId: 1 }, { unique: true });
TenantSchema.index({ status: 1 });
TenantSchema.index({ 'subscription.plan': 1 });

export const TenantModel = model<Tenant>('Tenant', TenantSchema);

