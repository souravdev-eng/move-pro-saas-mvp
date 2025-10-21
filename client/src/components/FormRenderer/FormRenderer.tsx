import { useMemo, useState } from 'react'
import FieldInput from '../FieldInput/FieldInput'
import type { Definitions, FieldDef } from '../../types/rules'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { evaluateByRef } from '../../utils/jsonLogic'
import { runFieldValidators } from '../../utils/validators'
import { useFormRenderer } from './FormRenderer.hook'

export interface FormRendererProps {
    definitions: Definitions
    initialValues?: Record<string, any>
    onSubmit: (values: Record<string, any>) => void
}

export default function FormRenderer({ definitions, initialValues, onSubmit }: FormRendererProps) {
    const [formState, setFormState] = useState<Record<string, any>>(initialValues ?? {})
    const [errors, setErrors] = useState<Record<string, string | undefined>>({})

    const fieldsById: Record<string, FieldDef> = useMemo(() => Object.fromEntries(definitions.fields.map(f => [f.id, f])), [definitions.fields])
    const { getSelectItems } = useFormRenderer(definitions)

    function isHidden(field: FieldDef) {
        if (!field.showWhen?.ref) return false
        return !evaluateByRef(definitions, field.showWhen.ref, formState)
    }

    function handleSubmit() {
        const nextErrors: Record<string, string | undefined> = {}
        for (const field of definitions.fields) {
            if (isHidden(field)) continue
            const value = (formState as any)[field.id]
            const msgs = runFieldValidators(field, value)
            nextErrors[field.id] = msgs[0]
        }
        setErrors(nextErrors)
        const hasError = Object.values(nextErrors).some(Boolean)
        if (!hasError) onSubmit(formState)
    }

    const sections = definitions.layout?.sections || []

    return (
        <Box>
            {sections.map((section, sIdx) => {
                const rows = section.rows || []
                return (
                    <Box key={section.id || sIdx} sx={{ mb: 3 }}>
                        {section.title ? (
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                {section.title}
                            </Typography>
                        ) : null}
                        <Grid container spacing={2}>
                            {rows.map((row, rIdx) => {
                                const cols = row.cols || []
                                return cols.map((col, cIdx) => {
                                    const field = fieldsById[col.fieldId]
                                    if (!field) return null
                                    if (isHidden(field)) return null
                                    const items = getSelectItems(field)
                                    return (
                                        <Grid item xs={12} sm={col.span || 12} key={`${rIdx}-${cIdx}`}>
                                            <FieldInput
                                                field={field}
                                                value={(formState as any)[field.id]}
                                                onChange={(v) => setFormState((s: any) => ({ ...s, [field.id]: v }))}
                                                error={errors[field.id]}
                                                items={items}
                                            />
                                        </Grid>
                                    )
                                })
                            })}
                        </Grid>
                        {sIdx < sections.length - 1 ? <Divider sx={{ mt: 3 }} /> : null}
                    </Box>
                )
            })}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="large" onClick={handleSubmit}>
                    Validate & Submit
                </Button>
            </Box>
        </Box>
    )
}


