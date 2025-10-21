import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import type { FieldDef } from '../../types/rules'

export interface FieldInputProps {
    field: FieldDef
    value: unknown
    onChange: (value: unknown) => void
    error?: string
    items?: { id: string; name: string }[]
}

export default function FieldInput({ field, value, onChange, error, items }: FieldInputProps) {
    const common = {
        label: field.label + (field.required ? ' *' : ''),
        fullWidth: true,
        size: 'small' as const,
        error: Boolean(error),
        helperText: error ?? '',
    }

    // Get widget key - fallback to field.type if widget not defined
    const widgetKey = field.widget?.key || field.type

    switch (widgetKey) {
        case 'number':
            return (
                <TextField
                    {...common}
                    type="number"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                />
            )
        case 'email':
            return (
                <TextField
                    {...common}
                    type="email"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                />
            )
        case 'phone':
            return (
                <TextField
                    {...common}
                    type="tel"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                />
            )
        case 'date':
            return (
                <TextField
                    {...common}
                    type="date"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            )
        case 'textarea':
            return (
                <TextField
                    {...common}
                    multiline
                    minRows={3}
                    maxRows={6}
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                />
            )
        case 'select':
            return (
                <TextField
                    {...common}
                    select
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                >
                    <MenuItem value="">Select...</MenuItem>
                    {(items ?? []).map(it => (
                        <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>
                    ))}
                </TextField>
            )
        case 'text':
        default:
            return (
                <TextField
                    {...common}
                    value={value ?? ''}
                    onChange={e => onChange(e.target.value)}
                />
            )
    }
}


