/**
 * Utility for accessing nested object properties using dot notation
 * Reusable across rules engine and job validation
 */

export function getByPath(obj: Record<string, unknown>, path: string): unknown {
    if (!path) return obj;
    const keys = path.split('.');
    let current: any = obj;
    for (const key of keys) {
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
}

export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
    if (!path) return;
    const keys = path.split('.');
    let current: any = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object' || current[key] == null) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

/**
 * Normalize dot-notated flat object to nested structure
 * Example: { "customer.name": "John" } -> { customer: { name: "John" } }
 */
export function normalizePayload(flat: Record<string, unknown>): Record<string, unknown> {
    const nested: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(flat)) {
        if (key.includes('.')) {
            setByPath(nested, key, value);
        } else {
            nested[key] = value;
        }
    }
    return nested;
}

/**
 * Flatten nested object to dot notation
 * Example: { customer: { name: "John" } } -> { "customer.name": "John" }
 */
export function flattenPayload(nested: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const flat: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(nested)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value != null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            Object.assign(flat, flattenPayload(value as Record<string, unknown>, fullKey));
        } else {
            flat[fullKey] = value;
        }
    }
    return flat;
}

