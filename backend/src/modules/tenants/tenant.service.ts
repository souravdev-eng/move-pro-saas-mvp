import { FilterQuery } from 'mongoose';
import { TenantModel, type Tenant } from '../../models/tenant.model';
import { type CreateTenantDTO, type UpdateTenantDTO, type ListTenantsQueryDTO } from './tenant.dto';

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}

/**
 * Create a new tenant
 */
export async function createTenant(input: CreateTenantDTO): Promise<Tenant> {
    // Check if tenantId already exists
    const existing = await TenantModel.findOne({ tenantId: input.tenantId }).lean().exec();
    if (existing) {
        const err = new Error('Tenant ID already exists');
        (err as any).status = 409;
        throw err;
    }

    const tenant = await TenantModel.create({
        tenantId: input.tenantId,
        name: input.name,
        displayName: input.displayName || input.name,
        status: 'active',
        subscription: {
            plan: input.subscription.plan,
            startDate: new Date(),
            maxBranches: input.subscription.maxBranches || getDefaultMaxBranches(input.subscription.plan),
            maxUsers: input.subscription.maxUsers || getDefaultMaxUsers(input.subscription.plan),
        },
        billing: input.billing || {},
        settings: {
            timezone: input.settings?.timezone || 'America/Chicago',
            currency: input.settings?.currency || 'USD',
            dateFormat: input.settings?.dateFormat || 'MM/DD/YYYY',
            features: {
                jobCreation: input.settings?.features?.jobCreation ?? true,
                rulesEngine: input.settings?.features?.rulesEngine ?? true,
                analytics: input.settings?.features?.analytics ?? false,
            },
        },
    });

    return tenant.toObject() as Tenant;
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
    return await TenantModel.findOne({ tenantId }).lean().exec() as Tenant | null;
}

/**
 * Update tenant
 */
export async function updateTenant(tenantId: string, input: UpdateTenantDTO): Promise<Tenant | null> {
    const updates: any = {};

    if (input.name !== undefined) updates.name = input.name;
    if (input.displayName !== undefined) updates.displayName = input.displayName;
    if (input.status !== undefined) updates.status = input.status;

    if (input.subscription) {
        if (input.subscription.plan !== undefined) updates['subscription.plan'] = input.subscription.plan;
        if (input.subscription.endDate !== undefined) updates['subscription.endDate'] = input.subscription.endDate;
        if (input.subscription.maxBranches !== undefined) updates['subscription.maxBranches'] = input.subscription.maxBranches;
        if (input.subscription.maxUsers !== undefined) updates['subscription.maxUsers'] = input.subscription.maxUsers;
    }

    if (input.billing) {
        if (input.billing.companyName !== undefined) updates['billing.companyName'] = input.billing.companyName;
        if (input.billing.taxId !== undefined) updates['billing.taxId'] = input.billing.taxId;
        if (input.billing.billingEmail !== undefined) updates['billing.billingEmail'] = input.billing.billingEmail;
        if (input.billing.billingAddress) {
            Object.keys(input.billing.billingAddress).forEach((key) => {
                updates[`billing.billingAddress.${key}`] = (input.billing!.billingAddress as any)[key];
            });
        }
    }

    if (input.settings) {
        if (input.settings.timezone !== undefined) updates['settings.timezone'] = input.settings.timezone;
        if (input.settings.currency !== undefined) updates['settings.currency'] = input.settings.currency;
        if (input.settings.dateFormat !== undefined) updates['settings.dateFormat'] = input.settings.dateFormat;
        if (input.settings.features) {
            Object.keys(input.settings.features).forEach((key) => {
                updates[`settings.features.${key}`] = (input.settings!.features as any)[key];
            });
        }
    }

    const tenant = await TenantModel.findOneAndUpdate(
        { tenantId },
        { $set: updates },
        { new: true }
    ).lean().exec();

    return tenant as Tenant | null;
}

/**
 * List tenants with pagination
 */
export async function listTenants(query: ListTenantsQueryDTO, page: number, limit: number): Promise<PaginatedResult<Tenant>> {
    const filter: FilterQuery<Tenant> = {};

    if (query.status) filter.status = query.status;
    if (query.plan) filter['subscription.plan'] = query.plan;
    if (query.search && query.search.trim().length > 0) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
            { name: regex },
            { displayName: regex },
            { tenantId: regex },
        ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        TenantModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        TenantModel.countDocuments(filter).exec(),
    ]);

    return { data: data as unknown as Tenant[], page, limit, total };
}

/**
 * Helper: Get default max branches based on plan
 */
function getDefaultMaxBranches(plan: string): number {
    switch (plan) {
        case 'trial': return 1;
        case 'basic': return 3;
        case 'professional': return 10;
        case 'enterprise': return 100;
        default: return 1;
    }
}

/**
 * Helper: Get default max users based on plan
 */
function getDefaultMaxUsers(plan: string): number {
    switch (plan) {
        case 'trial': return 5;
        case 'basic': return 20;
        case 'professional': return 100;
        case 'enterprise': return 1000;
        default: return 5;
    }
}

