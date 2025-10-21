/**
 * Date validation and constraint helpers for rules engine
 * Supports constraints like gte: "today", lte: "today+30d"
 */

export function parseDate(value: unknown): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (typeof value === 'number') {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

export function getToday(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

export function parseDateConstraint(constraint: string): Date | null {
    const trimmed = constraint.trim().toLowerCase();

    if (trimmed === 'today' || trimmed === 'now') {
        return getToday();
    }

    // Parse relative dates like "today+7d" or "today-30d"
    const match = trimmed.match(/^(today|now)\s*([+-])\s*(\d+)\s*(d|day|days|m|month|months|y|year|years)$/);
    if (match) {
        const [, base, operator, amountStr, unit] = match;
        const amount = parseInt(amountStr, 10);
        const date = getToday();

        const multiplier = operator === '+' ? 1 : -1;

        if (unit === 'd' || unit === 'day' || unit === 'days') {
            date.setDate(date.getDate() + (amount * multiplier));
        } else if (unit === 'm' || unit === 'month' || unit === 'months') {
            date.setMonth(date.getMonth() + (amount * multiplier));
        } else if (unit === 'y' || unit === 'year' || unit === 'years') {
            date.setFullYear(date.getFullYear() + (amount * multiplier));
        }

        return date;
    }

    // Try parsing as ISO date
    return parseDate(constraint);
}

export function validateDateConstraint(value: unknown, operator: 'gte' | 'lte' | 'gt' | 'lt', constraint: string): boolean {
    const valueDate = parseDate(value);
    if (!valueDate) return false;

    const constraintDate = parseDateConstraint(constraint);
    if (!constraintDate) return false;

    const valueTime = valueDate.getTime();
    const constraintTime = constraintDate.getTime();

    switch (operator) {
        case 'gte': return valueTime >= constraintTime;
        case 'lte': return valueTime <= constraintTime;
        case 'gt': return valueTime > constraintTime;
        case 'lt': return valueTime < constraintTime;
        default: return false;
    }
}

