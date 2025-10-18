import { useState } from 'react'
import type { FieldDef, Layout } from '../../types/rules'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

export interface LayoutBuilderProps {
    layout: Layout
    fields: FieldDef[]
    onChange: (layout: Layout) => void
}

export default function LayoutBuilder({ layout, fields, onChange }: LayoutBuilderProps) {
    const [newSectionTitle, setNewSectionTitle] = useState('')

    function addSection() {
        const title = newSectionTitle.trim() || `Section ${layout.sections.length + 1}`
        onChange({
            sections: [
                ...layout.sections,
                {
                    id: `section_${layout.sections.length + 1}`,
                    title,
                    rows: [],
                },
            ],
        })
        setNewSectionTitle('')
    }

    function deleteSection(sectionIdx: number) {
        onChange({
            sections: layout.sections.filter((_, i) => i !== sectionIdx),
        })
    }

    function addRow(sectionIdx: number) {
        const updated = { ...layout }
        updated.sections[sectionIdx].rows.push({ cols: [] })
        onChange(updated)
    }

    function deleteRow(sectionIdx: number, rowIdx: number) {
        const updated = { ...layout }
        updated.sections[sectionIdx].rows = updated.sections[sectionIdx].rows.filter((_, i) => i !== rowIdx)
        onChange(updated)
    }

    function addCol(sectionIdx: number, rowIdx: number) {
        const updated = { ...layout }
        updated.sections[sectionIdx].rows[rowIdx].cols.push({
            fieldId: fields[0]?.id || '',
            span: 12,
        })
        onChange(updated)
    }

    function updateCol(sectionIdx: number, rowIdx: number, colIdx: number, fieldId: string, span: number) {
        const updated = { ...layout }
        updated.sections[sectionIdx].rows[rowIdx].cols[colIdx] = { fieldId, span }
        onChange(updated)
    }

    function deleteCol(sectionIdx: number, rowIdx: number, colIdx: number) {
        const updated = { ...layout }
        updated.sections[sectionIdx].rows[rowIdx].cols = updated.sections[sectionIdx].rows[rowIdx].cols.filter(
            (_, i) => i !== colIdx
        )
        onChange(updated)
    }

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                    label="Section Title"
                    value={newSectionTitle}
                    onChange={e => setNewSectionTitle(e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                />
                <Button startIcon={<AddIcon />} variant="contained" onClick={addSection}>
                    Add Section
                </Button>
            </Box>

            {layout.sections.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">No sections yet. Add one to start building your layout.</Typography>
                </Paper>
            ) : null}

            {layout.sections.map((section, sIdx) => (
                <Accordion key={section.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                            <Typography variant="h6">{section.title}</Typography>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={e => {
                                    e.stopPropagation()
                                    deleteSection(sIdx)
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            {section.rows.map((row, rIdx) => (
                                <Paper key={rIdx} variant="outlined" sx={{ p: 2 }}>
                                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2">Row {rIdx + 1}</Typography>
                                        <Box>
                                            <Button size="small" onClick={() => addCol(sIdx, rIdx)}>
                                                Add Column
                                            </Button>
                                            <IconButton size="small" onClick={() => deleteRow(sIdx, rIdx)} color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Stack spacing={1}>
                                        {row.cols.map((col, cIdx) => (
                                            <Box key={cIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <TextField
                                                    select
                                                    label="Field"
                                                    value={col.fieldId}
                                                    onChange={e => updateCol(sIdx, rIdx, cIdx, e.target.value, col.span || 12)}
                                                    size="small"
                                                    sx={{ flex: 2 }}
                                                >
                                                    {fields.map(f => (
                                                        <MenuItem key={f.id} value={f.id}>
                                                            {f.label} ({f.id})
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField
                                                    type="number"
                                                    label="Span (1-12)"
                                                    value={col.span || 12}
                                                    onChange={e =>
                                                        updateCol(sIdx, rIdx, cIdx, col.fieldId, Math.min(12, Math.max(1, Number(e.target.value))))
                                                    }
                                                    size="small"
                                                    inputProps={{ min: 1, max: 12 }}
                                                    sx={{ width: 120 }}
                                                />
                                                <IconButton size="small" onClick={() => deleteCol(sIdx, rIdx, cIdx)} color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            ))}
                            <Button variant="outlined" onClick={() => addRow(sIdx)} fullWidth>
                                + Add Row
                            </Button>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )
}

