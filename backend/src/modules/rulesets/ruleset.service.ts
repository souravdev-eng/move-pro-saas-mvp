import { FilterQuery } from 'mongoose';
import { RulesetModel, type Ruleset } from './ruleset.model';
import { type CreateRulesetDTO, type ListRulesetsQueryDTO } from './ruleset.dto';

export async function createRuleset(input: CreateRulesetDTO): Promise<Ruleset> {
    if (input.scope === 'branch' && !input.branchId) {
        const err = new Error('branchId is required when scope is "branch"');
        (err as any).status = 400;
        throw err;
    }
    const doc = await RulesetModel.create({
        tenantId: input.tenantId,
        scope: input.scope,
        branchId: input.scope === 'branch' ? input.branchId ?? null : null,
        name: input.name,
        notes: input.notes ?? null,
        definitions: input.definitions,
        createdBy: input.createdBy ?? null,
    });
    return doc.toObject() as Ruleset;
}

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}

export async function listRulesets(query: ListRulesetsQueryDTO, page: number, limit: number): Promise<PaginatedResult<Ruleset>> {
    const filter: FilterQuery<Ruleset> = {};
    if (query.tenantId) filter.tenantId = query.tenantId;
    if (query.scope) filter.scope = query.scope;
    if (query.branchId) filter.branchId = query.branchId;
    if (query.status) filter.status = query.status;
    if (query.search && query.search.trim().length > 0) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [{ name: regex }, { notes: regex }];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        RulesetModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        RulesetModel.countDocuments(filter).exec(),
    ]);

    return { data: data as unknown as Ruleset[], page, limit, total };
}

export async function getRulesetById(id: string): Promise<Ruleset | null> {
    return await RulesetModel.findById(id).lean().exec() as Ruleset | null;
}


export async function deleteRulesetById(id: string): Promise<void> {
    await RulesetModel.findByIdAndDelete(id).exec();
}
