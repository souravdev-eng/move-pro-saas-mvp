/**
 * Schema compiler: transforms ruleset definitions into formSchema and validation schema
 * Reuses rules engine definitions to generate client-side forms and server-side validation
 */

import { z } from 'zod';
import { getByPath } from './dot-path';
import { validateDateConstraint } from './date-helpers';

export interface FieldDefinition {
    id: string;
    type: string;
    label?: string;
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        gte?: string;
        lte?: string;
        gt?: string;
        lt?: string;
    };
    default?: unknown;
    compute?: string;
    options?: Array<{ value: string; label: string }>;
    visibleIf?: unknown; // Client-side only, not validated on BE
    [key: string]: unknown;
}

export interface LayoutDefinition {
    sections?: Array<{
        title?: string;
        fields: string[];
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
}

export interface RulesetDefinitions {
    fields: FieldDefinition[];
    layout: LayoutDefinition;
    expressions?: unknown[];
    dataSources?: unknown[];
    widgets?: unknown[];
    [key: string]: unknown;
}

export interface FormSchema {
    fields: FieldDefinition[];
    layout: LayoutDefinition;
    validationSchemaVersion: string;
}

export interface ValidationError {
    path: string;
    message: string;
}

/**
 * Compile ruleset definitions into form schema
 */
export function compileFormSchema(definitions: RulesetDefinitions, rulesetId: string): FormSchema {
    return {
        fields: definitions.fields || [],
        layout: definitions.layout || {},
        validationSchemaVersion: `v1:${rulesetId}`,
    };
}

/**
 * Extract default values from field definitions
 */
export function extractDefaults(fields: FieldDefinition[]): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};
    for (const field of fields) {
        if (field.default !== undefined) {
            defaults[field.id] = field.default;
        }
    }
    return defaults;
}

/**
 * Validate payload against field definitions
 * Returns array of validation errors
 */
export function validatePayload(
    fields: FieldDefinition[],
    payload: Record<string, unknown>
): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field of fields) {
        const value = getByPath(payload, field.id);
        const isEmpty = value === undefined || value === null || value === '';

        // Required validation
        if (field.required && isEmpty) {
            errors.push({
                path: field.id,
                message: `${field.label || field.id} is required`,
            });
            continue;
        }

        // Skip validation if empty and not required
        if (isEmpty) continue;

        // Type validation
        const typeError = validateType(field, value);
        if (typeError) {
            errors.push({ path: field.id, message: typeError });
            continue;
        }

        // Field-specific validation
        if (field.validation) {
            const validationErrors = validateConstraints(field, value);
            errors.push(...validationErrors);
        }
    }

    return errors;
}

function validateType(field: FieldDefinition, value: unknown): string | null {
    const type = field.type;

    switch (type) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'phone':
        case 'select':
            if (typeof value !== 'string') {
                return `${field.label || field.id} must be a string`;
            }
            break;

        case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
                return `${field.label || field.id} must be a number`;
            }
            break;

        case 'date':
            if (!(value instanceof Date) && typeof value !== 'string') {
                return `${field.label || field.id} must be a date`;
            }
            break;

        case 'checkbox':
            if (typeof value !== 'boolean') {
                return `${field.label || field.id} must be a boolean`;
            }
            break;

        case 'array':
        case 'checkboxGroup':
            if (!Array.isArray(value)) {
                return `${field.label || field.id} must be an array`;
            }
            break;
    }

    return null;
}

function validateConstraints(field: FieldDefinition, value: unknown): ValidationError[] {
    const errors: ValidationError[] = [];
    const validation = field.validation!;
    const label = field.label || field.id;

    // String validations
    if (typeof value === 'string') {
        if (validation.minLength !== undefined && value.length < validation.minLength) {
            errors.push({
                path: field.id,
                message: `${label} must be at least ${validation.minLength} characters`,
            });
        }
        if (validation.maxLength !== undefined && value.length > validation.maxLength) {
            errors.push({
                path: field.id,
                message: `${label} must be at most ${validation.maxLength} characters`,
            });
        }
        if (validation.pattern) {
            try {
                const regex = new RegExp(validation.pattern);
                if (!regex.test(value)) {
                    errors.push({
                        path: field.id,
                        message: `${label} format is invalid`,
                    });
                }
            } catch (e) {
                // Invalid regex in definition, skip
            }
        }
    }

    // Number validations
    if (typeof value === 'number') {
        if (validation.min !== undefined && value < validation.min) {
            errors.push({
                path: field.id,
                message: `${label} must be at least ${validation.min}`,
            });
        }
        if (validation.max !== undefined && value > validation.max) {
            errors.push({
                path: field.id,
                message: `${label} must be at most ${validation.max}`,
            });
        }
    }

    // Date validations
    if (field.type === 'date') {
        if (validation.gte && !validateDateConstraint(value, 'gte', validation.gte)) {
            errors.push({
                path: field.id,
                message: `${label} must be on or after ${validation.gte}`,
            });
        }
        if (validation.lte && !validateDateConstraint(value, 'lte', validation.lte)) {
            errors.push({
                path: field.id,
                message: `${label} must be on or before ${validation.lte}`,
            });
        }
        if (validation.gt && !validateDateConstraint(value, 'gt', validation.gt)) {
            errors.push({
                path: field.id,
                message: `${label} must be after ${validation.gt}`,
            });
        }
        if (validation.lt && !validateDateConstraint(value, 'lt', validation.lt)) {
            errors.push({
                path: field.id,
                message: `${label} must be before ${validation.lt}`,
            });
        }
    }

    // Array validations
    if (Array.isArray(value)) {
        if (validation.min !== undefined && value.length < validation.min) {
            errors.push({
                path: field.id,
                message: `${label} must have at least ${validation.min} items`,
            });
        }
        if (validation.max !== undefined && value.length > validation.max) {
            errors.push({
                path: field.id,
                message: `${label} must have at most ${validation.max} items`,
            });
        }
    }

    return errors;
}

/**
 * Sanitize payload: trim strings, remove undefined/null values
 */
export function sanitizePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;

        if (typeof value === 'string') {
            sanitized[key] = value.trim();
        } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            sanitized[key] = sanitizePayload(value as Record<string, unknown>);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

