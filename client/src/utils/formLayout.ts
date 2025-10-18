import type { FieldDef, Layout } from '../types/rules'

export function buildLayoutFromFields(fields: FieldDef[], columns: number = 2): Layout {
    const rows = []
    for (let i = 0; i < fields.length; i += columns) {
        const cols = fields.slice(i, i + columns).map(f => ({
            fieldId: f.id,
            span: 12 / columns,
        }))
        rows.push({ cols })
    }
    return {
        sections: [
            {
                id: 'main',
                title: 'Main',
                rows,
            },
        ],
    }
}

export function validateRulesetSchema(definitions: any): string[] {
    const errors: string[] = []
    if (!definitions.fields || definitions.fields.length === 0) {
        errors.push('At least one field is required')
    }
    const fieldIds = new Set<string>()
    for (const f of definitions.fields || []) {
        if (fieldIds.has(f.id)) errors.push(`Duplicate field id: ${f.id}`)
        fieldIds.add(f.id)
    }
    for (const section of definitions.layout?.sections || []) {
        for (const row of section.rows || []) {
            for (const col of row.cols || []) {
                if (!fieldIds.has(col.fieldId)) {
                    errors.push(`Layout references missing field: ${col.fieldId}`)
                }
            }
        }
    }
    return errors
}

