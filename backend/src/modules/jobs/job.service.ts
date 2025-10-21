import { FilterQuery } from 'mongoose';
import { JobModel, type Job } from './job.model';
import { RulesetModel, type Ruleset } from '../rulesets/ruleset.model';
import { type CreateJobDTO, type ListJobsQueryDTO, type ValidateJobDTO } from './job.dto';
import { normalizePayload, getByPath, setByPath } from '../../utils/dot-path';
import { applyComputeExpressions } from '../../utils/expression-evaluator';
import {
    compileFormSchema,
    extractDefaults,
    validatePayload,
    sanitizePayload,
    type FieldDefinition,
    type FormSchema,
    type ValidationError,
    type RulesetDefinitions,
} from '../../utils/schema-compiler';

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}

export interface CreateJobResult {
    job: Job;
    validationSchemaVersion: string;
    warnings?: string[];
}

export interface ValidateJobResult {
    valid: boolean;
    errors: ValidationError[];
    computed?: Record<string, unknown>;
}

/**
 * Load published ruleset for branch + serviceType
 * Falls back to global ruleset if branch-specific not found
 */
async function loadRuleset(branchId: string, serviceType: string): Promise<Ruleset | null> {
    // Try branch-specific first
    let ruleset = await RulesetModel.findOne({
        scope: 'branch',
        branchId,
        status: 'published',
        'definitions.serviceType': serviceType,
    }).lean().exec();

    if (!ruleset) {
        // Fallback to global
        ruleset = await RulesetModel.findOne({
            scope: 'global',
            status: 'published',
            'definitions.serviceType': serviceType,
        }).lean().exec();
    }

    return ruleset as Ruleset | null;
}

/**
 * Get form schema for a branch + serviceType
 * Compiles ruleset into client-consumable form schema
 */
export async function getFormSchema(branchId: string, serviceType: string): Promise<FormSchema | null> {
    const ruleset = await loadRuleset(branchId, serviceType);
    if (!ruleset) return null;

    const formSchema = compileFormSchema(ruleset.definitions as RulesetDefinitions, String(ruleset._id));

    return {
        ...formSchema,
        defaults: extractDefaults(formSchema.fields),
    } as FormSchema & { defaults: Record<string, unknown> };
}

/**
 * Validate job payload against ruleset
 */
export async function validateJob(input: ValidateJobDTO): Promise<ValidateJobResult> {
    const ruleset = await loadRuleset(input.branchId, input.serviceType);
    if (!ruleset) {
        return {
            valid: false,
            errors: [{ path: 'serviceType', message: 'No published ruleset found for this branch/serviceType' }],
        };
    }

    const fields = (ruleset.definitions as RulesetDefinitions).fields || [];

    // Normalize and sanitize payload
    let payload = normalizePayload(input.payload);
    payload = sanitizePayload(payload);

    // Apply defaults
    const defaults = extractDefaults(fields);
    for (const [key, value] of Object.entries(defaults)) {
        if (getByPath(payload, key) === undefined) {
            setByPath(payload, key, value);
        }
    }

    // Apply compute expressions
    applyComputeExpressions(fields, payload);

    // Validate
    const errors = validatePayload(fields, payload);

    return {
        valid: errors.length === 0,
        errors,
        computed: payload,
    };
}

/**
 * Create a new job
 */
export async function createJob(input: CreateJobDTO): Promise<CreateJobResult> {
    // Load and validate against ruleset
    const ruleset = await loadRuleset(input.branchId, input.serviceType);
    if (!ruleset) {
        const err = new Error('No published ruleset found for this branch/serviceType');
        (err as any).status = 400;
        throw err;
    }

    const fields = (ruleset.definitions as RulesetDefinitions).fields || [];

    // Normalize and sanitize payload
    let payload = normalizePayload(input.payload);
    payload = sanitizePayload(payload);

    // Apply defaults
    const defaults = extractDefaults(fields);
    const appliedDefaults: string[] = [];
    for (const [key, value] of Object.entries(defaults)) {
        if (getByPath(payload, key) === undefined) {
            setByPath(payload, key, value);
            appliedDefaults.push(key);
        }
    }

    // Apply compute expressions
    const computedFields = fields.filter(f => f.compute).map(f => f.id);
    applyComputeExpressions(fields, payload);

    // Validate
    const errors = validatePayload(fields, payload);
    if (errors.length > 0) {
        const err = new Error('Validation failed');
        (err as any).status = 400;
        (err as any).details = errors;
        throw err;
    }

    // Extract structured data from payload
    const customer = extractCustomerData(payload);
    const move = extractMoveData(payload);
    const pricing = extractPricingData(payload);

    // Create job
    const validationSchemaVersion = `v1:${String(ruleset._id)}`;
    const job = await JobModel.create({
        tenantId: input.tenantId || ruleset.tenantId,
        branchId: input.branchId,
        serviceType: input.serviceType,
        status: 'created',
        payload,
        customer,
        move,
        pricing,
        meta: {
            validationSchemaVersion,
            computedFields,
            warnings: appliedDefaults.length > 0 ? [`Applied defaults: ${appliedDefaults.join(', ')}`] : undefined,
        },
        createdBy: input.createdBy ?? null,
    });

    const warnings: string[] = [];
    if (appliedDefaults.length > 0) {
        warnings.push(`Applied default values for: ${appliedDefaults.join(', ')}`);
    }

    return {
        job: job.toObject() as Job,
        validationSchemaVersion,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}

/**
 * List jobs with pagination
 */
export async function listJobs(query: ListJobsQueryDTO, page: number, limit: number): Promise<PaginatedResult<Job>> {
    const filter: FilterQuery<Job> = {};
    if (query.tenantId) filter.tenantId = query.tenantId;
    if (query.branchId) filter.branchId = query.branchId;
    if (query.serviceType) filter.serviceType = query.serviceType;
    if (query.status) filter.status = query.status;
    if (query.search && query.search.trim().length > 0) {
        const regex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
            { 'customer.name': regex },
            { 'customer.email': regex },
            { 'customer.phone': regex },
        ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        JobModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
        JobModel.countDocuments(filter).exec(),
    ]);

    return { data: data as unknown as Job[], page, limit, total };
}

/**
 * Get job by ID
 */
export async function getJobById(id: string): Promise<Job | null> {
    return await JobModel.findById(id).lean().exec() as Job | null;
}

/**
 * Helper: Extract customer data from payload
 */
function extractCustomerData(payload: Record<string, unknown>): Record<string, unknown> {
    const customer: Record<string, unknown> = {};
    const customerFields = ['name', 'email', 'phone', 'address', 'company'];

    for (const field of customerFields) {
        const value = getByPath(payload, `customer.${field}`) || getByPath(payload, field);
        if (value !== undefined) {
            customer[field] = value;
        }
    }

    return customer;
}

/**
 * Helper: Extract move data from payload
 */
function extractMoveData(payload: Record<string, unknown>): Record<string, unknown> {
    const move: Record<string, unknown> = {};
    const moveFields = ['origin', 'destination', 'moveDate', 'moveType', 'rooms', 'volume'];

    for (const field of moveFields) {
        const value = getByPath(payload, `move.${field}`) || getByPath(payload, field);
        if (value !== undefined) {
            move[field] = value;
        }
    }

    return move;
}

/**
 * Helper: Extract pricing data from payload
 */
function extractPricingData(payload: Record<string, unknown>): Record<string, unknown> {
    const pricing: Record<string, unknown> = {};
    const pricingFields = ['estimatedCost', 'finalCost', 'currency', 'discount', 'tax'];

    for (const field of pricingFields) {
        const value = getByPath(payload, `pricing.${field}`) || getByPath(payload, field);
        if (value !== undefined) {
            pricing[field] = value;
        }
    }

    return pricing;
}

