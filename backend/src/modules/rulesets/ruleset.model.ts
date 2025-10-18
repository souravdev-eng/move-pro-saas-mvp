import { Schema, model, type Document } from 'mongoose';

export type RulesetScope = 'global' | 'branch';
export type RulesetStatus = 'draft' | 'published' | 'archived';

export interface RulesetDefinitions {
    // Minimal shape; stored as mixed object
    fields: unknown[];
    layout: Record<string, unknown>;
    expressions?: unknown[];
    dataSources?: unknown[];
    widgets?: unknown[];
    // Allow any other keys
    [key: string]: unknown;
}

export interface Ruleset extends Document {
    tenantId: string;
    scope: RulesetScope;
    branchId?: string | null;
    status: RulesetStatus;
    name: string;
    notes?: string | null;
    definitions: RulesetDefinitions;
    apiVersion: string;
    modelVersion: number;
    createdBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const RulesetSchema = new Schema<Ruleset>({
    tenantId: { type: String, required: true, index: true },
    scope: { type: String, enum: ['global', 'branch'], required: true },
    branchId: { type: String, default: null },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    name: { type: String, required: true },
    notes: { type: String, default: null },
    definitions: { type: Schema.Types.Mixed, required: true },
    apiVersion: { type: String, default: 'v1' },
    modelVersion: { type: Number, default: 1 },
    createdBy: { type: String, default: null },
}, { timestamps: true, collection: 'rulesets' });

// Indexes
RulesetSchema.index({ tenantId: 1, scope: 1, branchId: 1, createdAt: -1 });
RulesetSchema.index({ tenantId: 1, status: 1 });

export const RulesetModel = model<Ruleset>('Ruleset', RulesetSchema);


