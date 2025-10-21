import { FilterQuery } from 'mongoose';
import { BranchModel, type Branch } from '../../models/branch.model';
import { TenantModel } from '../../models/tenant.model';
import { type CreateBranchDTO, type UpdateBranchDTO, type ListBranchesQueryDTO } from './branch.dto';

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}

/**
 * Create a new branch
 */
export async function createBranch(input: CreateBranchDTO): Promise<Branch> {
    // Verify tenant exists
    const tenant = await TenantModel.findOne({ tenantId: input.tenantId }).lean().exec();
    if (!tenant) {
        const err = new Error('Tenant not found');
        (err as any).status = 404;
        throw err;
    }

    // Check if branchId already exists
    const existing = await BranchModel.findOne({ branchId: input.branchId }).lean().exec();
    if (existing) {
        const err = new Error('Branch ID already exists');
        (err as any).status = 409;
        throw err;
    }

    // Check if tenant has reached max branches
    const branchCount = await BranchModel.countDocuments({ tenantId: input.tenantId }).exec();
    if (branchCount >= (tenant.subscription?.maxBranches || 10)) {
        const err = new Error(`Maximum number of branches (${tenant.subscription?.maxBranches}) reached for this tenant`);
        (err as any).status = 403;
        throw err;
    }

    const branch = await BranchModel.create({
        branchId: input.branchId,
        tenantId: input.tenantId,
        name: input.name,
        displayName: input.displayName || input.name,
        status: 'active',
        address: input.address,
        contact: input.contact || {},
        timezone: input.timezone || 'America/Chicago',
        settings: input.settings || {},
    });

    return branch.toObject() as Branch;
}

/**
 * Get branch by ID
 */
export async function getBranchById(branchId: string, tenantId?: string): Promise<Branch | null> {
    const filter: FilterQuery<Branch> = { branchId };
    if (tenantId) filter.tenantId = tenantId;

    return await BranchModel.findOne(filter).lean().exec() as Branch | null;
}

/**
 * Update branch
 */
export async function updateBranch(branchId: string, tenantId: string, input: UpdateBranchDTO): Promise<Branch | null> {
    const updates: any = {};

    if (input.name !== undefined) updates.name = input.name;
    if (input.displayName !== undefined) updates.displayName = input.displayName;
    if (input.status !== undefined) updates.status = input.status;
    if (input.timezone !== undefined) updates.timezone = input.timezone;

    if (input.address) {
        Object.keys(input.address).forEach((key) => {
            updates[`address.${key}`] = (input.address as any)[key];
        });
    }

    if (input.contact) {
        Object.keys(input.contact).forEach((key) => {
            updates[`contact.${key}`] = (input.contact as any)[key];
        });
    }

    if (input.settings) {
        updates.settings = input.settings;
    }

    const branch = await BranchModel.findOneAndUpdate(
        { branchId, tenantId },
        { $set: updates },
        { new: true }
    ).lean().exec();

    return branch as Branch | null;
}

/**
 * List branches with pagination
 */
export async function listBranches(query: ListBranchesQueryDTO, page: number, limit: number): Promise<PaginatedResult<Branch>> {
    const filter: FilterQuery<Branch> = { tenantId: query.tenantId };

    if (query.status) filter.status = query.status;
    if (query.search && query.search.trim().length > 0) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
            { name: regex },
            { displayName: regex },
            { 'address.city': regex },
        ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        BranchModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        BranchModel.countDocuments(filter).exec(),
    ]);

    return { data: data as unknown as Branch[], page, limit, total };
}

