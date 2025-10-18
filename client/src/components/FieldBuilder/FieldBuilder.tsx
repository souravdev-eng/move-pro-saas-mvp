import { useState } from 'react'
import type { FieldDef } from '../../types/rules'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

export interface FieldBuilderProps {
    fields: FieldDef[]
    onChange: (fields: FieldDef[]) => void
}

type FieldFormData = {
    id: string
    label: string
    type: string
    required: boolean
    widgetKey: string
    validatorType?: string
    validatorPattern?: string
    dataSourceId?: string
    showWhenRef?: string
}

export default function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [formData, setFormData] = useState<FieldFormData>({
        id: '',
        label: '',
        type: 'string',
        required: false,
        widgetKey: 'text',
    })

    function openNewDialog() {
        setFormData({
            id: `field_${fields.length + 1}`,
            label: '',
            type: 'string',
            required: false,
            widgetKey: 'text',
        })
        setEditingIndex(null)
        setDialogOpen(true)
    }

    function openEditDialog(index: number) {
        const field = fields[index]
        setFormData({
            id: field.id,
            label: field.label,
            type: field.type,
            required: field.required || false,
            widgetKey: field.widget.key,
            validatorType: field.validators?.[0]?.kind,
            validatorPattern: field.validators?.[0]?.pattern,
            dataSourceId: field.options?.dataSourceId,
            showWhenRef: field.showWhen?.ref,
        })
        setEditingIndex(index)
        setDialogOpen(true)
    }

    function handleSave() {
        const newField: FieldDef = {
            id: formData.id,
            label: formData.label,
            type: formData.type as any,
            required: formData.required,
            widget: { type: 'builtIn', key: formData.widgetKey as any },
            options: formData.dataSourceId ? { dataSourceId: formData.dataSourceId } : null,
            showWhen: formData.showWhenRef ? { ref: formData.showWhenRef } : null,
            validators: formData.validatorType
                ? [
                    {
                        kind: formData.validatorType as any,
                        pattern: formData.validatorPattern,
                    },
                ]
                : undefined,
        }

        if (editingIndex !== null) {
            const updated = [...fields]
            updated[editingIndex] = newField
            onChange(updated)
        } else {
            onChange([...fields, newField])
        }
        setDialogOpen(false)
    }

    function handleDelete(index: number) {
        if (confirm('Delete this field?')) {
            onChange(fields.filter((_, i) => i !== index))
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Fields</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={openNewDialog}>
                    Add Field
                </Button>
            </Box>

            {fields.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No fields yet. Click "Add Field" to start.</Typography>
                </Paper>
            ) : (
                <Paper>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Label</strong></TableCell>
                                <TableCell><strong>Type</strong></TableCell>
                                <TableCell><strong>Widget</strong></TableCell>
                                <TableCell><strong>Required</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((field, idx) => (
                                <TableRow key={field.id} hover>
                                    <TableCell><code>{field.id}</code></TableCell>
                                    <TableCell>{field.label}</TableCell>
                                    <TableCell>{field.type}</TableCell>
                                    <TableCell>{field.widget.key}</TableCell>
                                    <TableCell>{field.required ? '✓' : ''}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => openEditDialog(idx)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(idx)} color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingIndex !== null ? 'Edit Field' : 'Add Field'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            label="Field ID"
                            value={formData.id}
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                            fullWidth
                            size="small"
                            required
                            helperText="Unique identifier (e.g., contact.firstName)"
                        />
                        <TextField
                            label="Label"
                            value={formData.label}
                            onChange={e => setFormData({ ...formData, label: e.target.value })}
                            fullWidth
                            size="small"
                            required
                            helperText="Display label shown to users"
                        />
                        <TextField
                            label="Type"
                            select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="string">String</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                        </TextField>
                        <TextField
                            label="Widget"
                            select
                            value={formData.widgetKey}
                            onChange={e => setFormData({ ...formData, widgetKey: e.target.value })}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="textarea">Textarea</MenuItem>
                            <MenuItem value="select">Select</MenuItem>
                        </TextField>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.required}
                                    onChange={e => setFormData({ ...formData, required: e.target.checked })}
                                />
                            }
                            label="Required"
                        />
                        <TextField
                            label="Validator Type (Optional)"
                            select
                            value={formData.validatorType || ''}
                            onChange={e => setFormData({ ...formData, validatorType: e.target.value || undefined })}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="regex">Regex</MenuItem>
                        </TextField>
                        {formData.validatorType === 'regex' ? (
                            <TextField
                                label="Regex Pattern"
                                value={formData.validatorPattern || ''}
                                onChange={e => setFormData({ ...formData, validatorPattern: e.target.value })}
                                fullWidth
                                size="small"
                                helperText="e.g., ^\d{5}$ for 5-digit ZIP"
                            />
                        ) : null}
                        {formData.widgetKey === 'select' ? (
                            <TextField
                                label="Data Source ID"
                                value={formData.dataSourceId || ''}
                                onChange={e => setFormData({ ...formData, dataSourceId: e.target.value })}
                                fullWidth
                                size="small"
                                helperText="e.g., ds:moveTypes (define in Data Sources tab)"
                            />
                        ) : null}
                        <TextField
                            label="Show When (Expression Ref)"
                            value={formData.showWhenRef || ''}
                            onChange={e => setFormData({ ...formData, showWhenRef: e.target.value })}
                            fullWidth
                            size="small"
                            helperText="e.g., expr:isResidential (define in Expressions tab)"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!formData.id || !formData.label}>
                        {editingIndex !== null ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

