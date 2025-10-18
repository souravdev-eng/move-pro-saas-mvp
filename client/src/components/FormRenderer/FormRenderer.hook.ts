import { useMemo } from 'react'
import type { Definitions, FieldDef } from '../../types/rules'

export function useFormRenderer(definitions: Definitions) {
    const fieldsById: Record<string, FieldDef> = useMemo(
        () => Object.fromEntries(definitions.fields.map(f => [f.id, f])),
        [definitions.fields]
    )

    const dataSourcesById = useMemo(() => {
        const map: Record<string, any> = {}
        for (const ds of definitions.dataSources ?? []) map[ds.id] = ds
        return map
    }, [definitions.dataSources])

    function getSelectItems(field: FieldDef) {
        const dsId = field.options?.dataSourceId
        if (!dsId) return []
        const ds = dataSourcesById[dsId]
        if (!ds || ds.type !== 'static') return []
        return ds.config.items
    }

    return { fieldsById, getSelectItems }
}

export default useFormRenderer


