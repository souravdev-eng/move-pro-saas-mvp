/**
 * Safe expression evaluator for compute fields
 * Supports basic math operations and date functions
 * Uses allowlist approach for security
 */

import { getByPath } from './dot-path';

export interface EvaluationContext {
    [key: string]: unknown;
}

/**
 * Safe math functions allowlist
 */
const SAFE_MATH_FUNCTIONS: Record<string, (...args: number[]) => number> = {
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    abs: Math.abs,
    min: Math.min,
    max: Math.max,
    sqrt: Math.sqrt,
    pow: Math.pow,
};

/**
 * Parse and evaluate a simple expression
 * Supports: numbers, basic operators (+, -, *, /, %), field references, math functions
 * 
 * Examples:
 * - "field1 + field2"
 * - "field1 * 1.15"
 * - "ceil(field1 / field2)"
 * - "max(field1, field2, 100)"
 */
export function evaluateExpression(expression: string, context: EvaluationContext): number | null {
    try {
        // Trim and sanitize
        let expr = expression.trim();

        // Replace field references with their values
        // Match patterns like: fieldName, field.nested.path
        const fieldPattern = /\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g;
        expr = expr.replace(fieldPattern, (match) => {
            // Check if it's a math function
            if (match in SAFE_MATH_FUNCTIONS) {
                return match;
            }

            // Get value from context
            const value = getByPath(context as Record<string, unknown>, match);

            // Convert to number
            if (typeof value === 'number') return String(value);
            if (typeof value === 'string') {
                const num = parseFloat(value);
                return isNaN(num) ? '0' : String(num);
            }
            return '0';
        });

        // Replace math functions with safe implementations
        Object.keys(SAFE_MATH_FUNCTIONS).forEach(funcName => {
            const funcPattern = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
            expr = expr.replace(funcPattern, `__MATH__.${funcName}(`);
        });

        // Create safe evaluation context
        const __MATH__ = SAFE_MATH_FUNCTIONS;

        // Evaluate using Function constructor with strict allowlist
        // Only allow: numbers, operators, parentheses, and __MATH__
        if (!/^[\d\s+\-*/%().,__MATH__.a-z]+$/i.test(expr)) {
            throw new Error('Invalid expression: contains disallowed characters');
        }

        const func = new Function('__MATH__', `"use strict"; return (${expr});`);
        const result = func(__MATH__);

        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            return result;
        }

        return null;
    } catch (error) {
        // Log error but don't expose details
        console.error('Expression evaluation failed:', expression, error);
        return null;
    }
}

/**
 * Evaluate all compute expressions in field definitions
 * Mutates the payload with computed values
 */
export function applyComputeExpressions(
    fields: Array<{ id: string; compute?: string }>,
    payload: Record<string, unknown>
): void {
    const computeFields = fields.filter(f => f.compute);

    // Multiple passes to handle dependencies
    const maxPasses = 3;
    for (let pass = 0; pass < maxPasses; pass++) {
        let anyComputed = false;

        for (const field of computeFields) {
            if (!field.compute) continue;

            // Skip if already has a value (user provided)
            const currentValue = getByPath(payload, field.id);
            if (currentValue !== undefined && currentValue !== null) continue;

            // Evaluate expression
            const result = evaluateExpression(field.compute, payload);
            if (result !== null) {
                payload[field.id] = result;
                anyComputed = true;
            }
        }

        if (!anyComputed) break;
    }
}

