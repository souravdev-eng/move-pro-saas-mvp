import { useState } from 'react'
import type { FieldDef } from '../../types/rules'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import FolderIcon from '@mui/icons-material/Folder'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { getLibraryByCategory, LIBRARY_DATA_SOURCES } from '../../utils/questionLibrary'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Icons for question types
import TextFieldsIcon from '@mui/icons-material/TextFields'
import NotesIcon from '@mui/icons-material/Notes'
import NumbersIcon from '@mui/icons-material/Numbers'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle'

export interface SimpleFieldBuilderProps {
    fields: FieldDef[]
    onChange: (fields: FieldDef[]) => void
    dataSources: { id: string; name: string; items: { id: string; name: string }[] }[]
    onDataSourcesChange: (ds: any[]) => void
}

type SimpleFieldType = 'text' | 'number' | 'email' | 'phone' | 'date' | 'longtext' | 'dropdown'

// Quick question templates
const QUICK_QUESTIONS = [
    { icon: '👤', label: 'Full Name', question: 'What is your full name?', type: 'text' as const, required: true },
    { icon: '📧', label: 'Email', question: 'What is your email address?', type: 'email' as const, required: true },
    { icon: '📞', label: 'Phone', question: 'What is your phone number?', type: 'phone' as const, required: true },
    { icon: '📍', label: 'Address', question: 'What is your address?', type: 'text' as const, required: false },
    { icon: '📅', label: 'Date', question: 'Select a date', type: 'date' as const, required: false },
    { icon: '💬', label: 'Comments', question: 'Additional comments or notes', type: 'longtext' as const, required: false },
]

const QUESTION_TYPES = [
    {
        value: 'text',
        icon: <TextFieldsIcon />,
        label: 'Short Text',
        description: 'One line answer',
        example: 'John Doe',
    },
    {
        value: 'longtext',
        icon: <NotesIcon />,
        label: 'Long Text',
        description: 'Paragraph or multiple lines',
        example: 'This is a longer answer with multiple sentences...',
    },
    {
        value: 'number',
        icon: <NumbersIcon />,
        label: 'Number',
        description: 'Numbers only',
        example: '42',
    },
    {
        value: 'email',
        icon: <EmailIcon />,
        label: 'Email Address',
        description: 'Validates email automatically',
        example: 'john@example.com',
    },
    {
        value: 'phone',
        icon: <PhoneIcon />,
        label: 'Phone Number',
        description: 'Validates phone automatically',
        example: '+1-555-0100',
    },
    {
        value: 'date',
        icon: <CalendarMonthIcon />,
        label: 'Date',
        description: 'Calendar picker',
        example: '2024-06-15',
    },
    {
        value: 'dropdown',
        icon: <ArrowDropDownCircleIcon />,
        label: 'Dropdown List',
        description: 'Choose from options',
        example: 'Option 1, Option 2, Option 3',
    },
]

export default function SimpleFieldBuilder({ fields, onChange, dataSources, onDataSourcesChange }: SimpleFieldBuilderProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
    const [libraryDialogOpen, setLibraryDialogOpen] = useState(false)
    const [libraryTab, setLibraryTab] = useState(0)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [history, setHistory] = useState<FieldDef[][]>([fields])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [sections, setSections] = useState<string[]>(['Main Questions'])
    const [newSectionName, setNewSectionName] = useState('')

    // Field form data
    const [questionText, setQuestionText] = useState('')
    const [fieldType, setFieldType] = useState<SimpleFieldType>('text')
    const [isRequired, setIsRequired] = useState(false)
    const [needsEmail, setNeedsEmail] = useState(false)
    const [needsPhone, setNeedsPhone] = useState(false)
    const [dropdownOptions, setDropdownOptions] = useState('')
    const [fieldSection, setFieldSection] = useState('Main Questions')

    // Conditional logic
    const [hasCondition, setHasCondition] = useState(false)
    const [conditionField, setConditionField] = useState('')
    const [conditionValue, setConditionValue] = useState('')

    // Drag and drop
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

    // Undo/Redo
    function addToHistory(newFields: FieldDef[]) {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newFields)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
        onChange(newFields)
    }

    function undo() {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1
            setHistoryIndex(prevIndex)
            onChange(history[prevIndex])
        }
    }

    function redo() {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1
            setHistoryIndex(nextIndex)
            onChange(history[nextIndex])
        }
    }

    function openNewDialog(section?: string) {
        setQuestionText('')
        setFieldType('text')
        setIsRequired(false)
        setNeedsEmail(false)
        setNeedsPhone(false)
        setDropdownOptions('')
        setFieldSection(section || sections[0])
        setHasCondition(false)
        setConditionField('')
        setConditionValue('')
        setEditingIndex(null)
        setDialogOpen(true)
    }

    function openEditDialog(index: number) {
        const field = fields[index]
        setQuestionText(field.label)

        if (field.widget.key === 'select') setFieldType('dropdown')
        else if (field.widget.key === 'textarea') setFieldType('longtext')
        else setFieldType(field.widget.key as SimpleFieldType)

        setIsRequired(field.required || false)
        setNeedsEmail(field.validators?.some(v => v.kind === 'email') || false)
        setNeedsPhone(field.validators?.some(v => v.kind === 'phone') || false)

        if (field.options?.dataSourceId) {
            const ds = dataSources.find(d => d.id === field.options?.dataSourceId)
            if (ds) {
                setDropdownOptions(ds.items.map(i => i.name).join(', '))
            }
        }

        // Load section from field metadata
        setFieldSection((field as any)._section || sections[0])

        // Load condition
        if (field.showWhen?.ref) {
            setHasCondition(true)
            // Parse simple condition from ref (we'll store it as metadata)
            const metadata = (field as any)._condition
            if (metadata) {
                setConditionField(metadata.field)
                setConditionValue(metadata.value)
            }
        } else {
            setHasCondition(false)
            setConditionField('')
            setConditionValue('')
        }

        setEditingIndex(index)
        setDialogOpen(true)
    }

    function duplicateQuestion(index: number) {
        const original = fields[index]
        const duplicate = {
            ...original,
            id: original.id + '_copy_' + Date.now(),
            label: 'Copy of ' + original.label,
        }
        const newFields = [...fields]
        newFields.splice(index + 1, 0, duplicate)
        addToHistory(newFields)
    }

    function addQuickQuestion(template: typeof QUICK_QUESTIONS[0]) {
        setQuestionText(template.question)
        setFieldType(template.type)
        setIsRequired(template.required)
        setNeedsEmail(template.type === 'email')
        setNeedsPhone(template.type === 'phone')
        setDropdownOptions('')
        setHasCondition(false)
        setEditingIndex(null)
        setDialogOpen(true)
    }

    function handleSave() {
        if (!questionText.trim()) {
            alert('Please enter a question')
            return
        }

        const fieldId = questionText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            || `field_${Date.now()}`

        const validators: any[] = []
        if (needsEmail) validators.push({ kind: 'email' })
        if (needsPhone) validators.push({ kind: 'phone', pattern: '^\\+?\\d{10,15}$', message: 'Please enter a valid phone (10-15 digits)' })

        let dataSourceId: string | undefined
        if (fieldType === 'dropdown' && dropdownOptions.trim()) {
            const dsId = `ds_${fieldId}`
            const items = dropdownOptions.split(',').map((opt) => ({
                id: opt.trim().replace(/\s+/g, '_'),
                name: opt.trim(),
            }))

            const existingDs = dataSources.filter(d => d.id !== dsId)
            onDataSourcesChange([...existingDs, { id: dsId, type: 'static', config: { items } }])
            dataSourceId = dsId
        }

        // Handle simple conditional
        let showWhen = null
        const metadata: any = {}
        if (hasCondition && conditionField && conditionValue) {
            const exprId = `expr_${fieldId}_condition`
            showWhen = { ref: exprId }
            metadata._condition = { field: conditionField, value: conditionValue }
            // Note: We'll need to generate the actual JSONLogic expression later
        }

        const newField: FieldDef = {
            id: editingIndex !== null ? fields[editingIndex].id : fieldId,
            label: questionText,
            type: fieldType === 'number' ? 'number' : 'string',
            required: isRequired,
            widget: {
                type: 'builtIn',
                key: fieldType === 'longtext' ? 'textarea' : fieldType === 'dropdown' ? 'select' : fieldType,
            },
            options: dataSourceId ? { dataSourceId } : null,
            showWhen,
            validators: validators.length > 0 ? validators : undefined,
            ...metadata,
            _section: fieldSection,
        } as any

        if (editingIndex !== null) {
            const updated = [...fields]
            updated[editingIndex] = newField
            addToHistory(updated)
        } else {
            addToHistory([...fields, newField])
        }
        setDialogOpen(false)
    }

    function moveField(index: number, direction: 'up' | 'down') {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= fields.length) return

        const updated = [...fields]
        const temp = updated[index]
        updated[index] = updated[newIndex]
        updated[newIndex] = temp
        addToHistory(updated)
    }

    function deleteField(index: number) {
        addToHistory(fields.filter((_, i) => i !== index))
    }

    // Drag and drop handlers
    function handleDragStart(index: number) {
        setDraggedIndex(index)
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === index) return

        const updated = [...fields]
        const draggedItem = updated[draggedIndex]
        updated.splice(draggedIndex, 1)
        updated.splice(index, 0, draggedItem)

        onChange(updated)
        setDraggedIndex(index)
    }

    function handleDragEnd() {
        if (draggedIndex !== null) {
            addToHistory(fields)
        }
        setDraggedIndex(null)
    }

    function addSection() {
        if (!newSectionName.trim()) return
        setSections([...sections, newSectionName])
        setNewSectionName('')
        setSectionDialogOpen(false)
    }

    // Group fields by section
    const fieldsBySection = sections.map(section => ({
        name: section,
        fields: fields.map((f, idx) => ({ field: f, index: idx })).filter(({ field }) => (field as any)._section === section || (!((field as any)._section) && section === sections[0]))
    }))

    const getProgressMessage = () => {
        if (fields.length === 0) return 'Start by adding your first question'
        if (fields.length < 3) return 'Good start! Add a few more questions'
        if (fields.length < 5) return 'Looking good! Most forms have 5-10 questions'
        if (fields.length < 10) return 'Great! Your form is taking shape'
        if (fields.length < 15) return 'Excellent! This is a comprehensive form'
        return 'Wow! This is a detailed form'
    }

    // Get dropdown fields for conditional logic
    const dropdownFields = fields.filter(f => f.widget.key === 'select')

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5">
                            Your Questions {fields.length > 0 && `(${fields.length})`}
                        </Typography>
                        <Box>
                            <IconButton onClick={undo} disabled={historyIndex === 0} size="small" title="Undo">
                                <UndoIcon />
                            </IconButton>
                            <IconButton onClick={redo} disabled={historyIndex === history.length - 1} size="small" title="Redo">
                                <RedoIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {getProgressMessage()}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button startIcon={<LibraryBooksIcon />} variant="outlined" onClick={() => setLibraryDialogOpen(true)}>
                        Question Library
                    </Button>
                    <Button startIcon={<FolderIcon />} variant="outlined" onClick={() => setSectionDialogOpen(true)}>
                        Add Section
                    </Button>
                    <Button startIcon={<AddIcon />} variant="contained" size="large" onClick={() => openNewDialog()}>
                        Add Question
                    </Button>
                </Stack>
            </Box>

            {fields.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No questions yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Click "Add Question" or choose a quick start below
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Quick Add:</Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                        {QUICK_QUESTIONS.map((q, idx) => (
                            <Button
                                key={idx}
                                variant="outlined"
                                size="small"
                                onClick={() => addQuickQuestion(q)}
                                startIcon={<span>{q.icon}</span>}
                            >
                                {q.label}
                            </Button>
                        ))}
                    </Stack>
                </Card>
            ) : (
                <Stack spacing={3}>
                    {fieldsBySection.map(section => (
                        section.fields.length > 0 && (
                            <Accordion key={section.name} defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <FolderIcon color="primary" />
                                        <Typography variant="h6">{section.name}</Typography>
                                        <Chip label={section.fields.length} size="small" />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        {section.fields.map(({ field, index: idx }) => (
                                            <Card
                                                key={field.id}
                                                variant="outlined"
                                                draggable
                                                onDragStart={() => handleDragStart(idx)}
                                                onDragOver={(e) => handleDragOver(e, idx)}
                                                onDragEnd={handleDragEnd}
                                                sx={{
                                                    transition: 'all 0.2s',
                                                    cursor: 'grab',
                                                    '&:hover': { boxShadow: 2 },
                                                    '&:active': { cursor: 'grabbing' },
                                                    opacity: draggedIndex === idx ? 0.5 : 1,
                                                }}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', pt: 0.5 }}>
                                                            <IconButton size="small" sx={{ cursor: 'grab' }} title="Drag to reorder">
                                                                <DragIndicatorIcon />
                                                            </IconButton>
                                                        </Box>

                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="h6" gutterBottom>
                                                                {idx + 1}. {field.label}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
                                                                <Chip
                                                                    label={QUESTION_TYPES.find(t => {
                                                                        if (field.widget.key === 'textarea') return t.value === 'longtext'
                                                                        if (field.widget.key === 'select') return t.value === 'dropdown'
                                                                        return t.value === field.widget.key
                                                                    })?.label || field.widget.key}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                                {field.required && <Chip label="Required" size="small" color="error" />}
                                                                {field.validators?.some(v => v.kind === 'email') && <Chip label="Email validation" size="small" color="info" />}
                                                                {field.validators?.some(v => v.kind === 'phone') && <Chip label="Phone validation" size="small" color="info" />}
                                                                {field.showWhen && <Chip label="Conditional" size="small" color="warning" icon={<span>⚡</span>} />}
                                                            </Stack>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {field.id}
                                                            </Typography>
                                                        </Box>

                                                        <Box>
                                                            <IconButton onClick={() => duplicateQuestion(idx)} color="default" title="Duplicate" size="small">
                                                                <ContentCopyIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton onClick={() => openEditDialog(idx)} color="primary" title="Edit" size="small">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => {
                                                                    if (confirm(`Delete question "${field.label}"?`)) {
                                                                        deleteField(idx)
                                                                    }
                                                                }}
                                                                color="error"
                                                                title="Delete"
                                                                size="small"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => openNewDialog(section.name)}
                                            fullWidth
                                        >
                                            Add Question to {section.name}
                                        </Button>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        )
                    ))}
                </Stack>
            )}

            {/* Section Dialog */}
            <Dialog open={sectionDialogOpen} onClose={() => setSectionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Section</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Section Name"
                        value={newSectionName}
                        onChange={e => setNewSectionName(e.target.value)}
                        fullWidth
                        autoFocus
                        placeholder="e.g., Contact Information"
                        helperText="Group related questions together"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={addSection} variant="contained" disabled={!newSectionName.trim()}>
                        Add Section
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Question Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingIndex !== null ? 'Edit Question' : 'Add Question'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 2 }}>
                        {/* Quick Add Buttons */}
                        {editingIndex === null && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Quick Add:</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {QUICK_QUESTIONS.map((q, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setQuestionText(q.question)
                                                setFieldType(q.type)
                                                setIsRequired(q.required)
                                                setNeedsEmail(q.type === 'email')
                                                setNeedsPhone(q.type === 'phone')
                                            }}
                                            startIcon={<span>{q.icon}</span>}
                                        >
                                            {q.label}
                                        </Button>
                                    ))}
                                </Stack>
                                <Divider sx={{ my: 2 }}>OR</Divider>
                            </Box>
                        )}

                        <TextField
                            label="What question do you want to ask?"
                            value={questionText}
                            onChange={e => setQuestionText(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="e.g., What is your full name?"
                            helperText="This is what users will see"
                            autoFocus
                        />

                        {/* Live Preview */}
                        {questionText && (
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                    Preview:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {questionText} {isRequired && <span style={{ color: 'red' }}>*</span>}
                                </Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder={QUESTION_TYPES.find(t => t.value === fieldType)?.example}
                                    disabled
                                    type={fieldType === 'number' ? 'number' : fieldType === 'email' ? 'email' : fieldType === 'date' ? 'date' : 'text'}
                                    multiline={fieldType === 'longtext'}
                                    rows={fieldType === 'longtext' ? 3 : 1}
                                    select={fieldType === 'dropdown'}
                                />
                            </Paper>
                        )}

                        {/* Section Selection */}
                        {sections.length > 1 && (
                            <TextField
                                select
                                label="Section"
                                value={fieldSection}
                                onChange={e => setFieldSection(e.target.value)}
                                fullWidth
                                size="small"
                                helperText="Which section should this question go in?"
                            >
                                {sections.map(s => (
                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        <FormControl>
                            <Typography variant="subtitle2" gutterBottom>How should users answer?</Typography>
                            <RadioGroup value={fieldType} onChange={e => setFieldType(e.target.value as SimpleFieldType)}>
                                {QUESTION_TYPES.map(type => (
                                    <Paper
                                        key={type.value}
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            mb: 1,
                                            cursor: 'pointer',
                                            border: fieldType === type.value ? 2 : 1,
                                            borderColor: fieldType === type.value ? 'primary.main' : 'divider',
                                            '&:hover': { borderColor: 'primary.light' },
                                        }}
                                        onClick={() => setFieldType(type.value as SimpleFieldType)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Radio value={type.value} />
                                            <Box sx={{ color: 'primary.main' }}>{type.icon}</Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{type.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">{type.description}</Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 10 }}>
                                                {type.example}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </RadioGroup>
                        </FormControl>

                        {fieldType === 'dropdown' && (
                            <TextField
                                label="Dropdown Options"
                                value={dropdownOptions}
                                onChange={e => setDropdownOptions(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Option 1, Option 2, Option 3"
                                helperText="Separate options with commas. Example: Yes, No, Maybe"
                            />
                        )}

                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={isRequired} onChange={e => setIsRequired(e.target.checked)} />}
                                label="✓ Required (user must answer this question)"
                            />
                            {fieldType === 'text' && (
                                <>
                                    <FormControlLabel
                                        control={<Checkbox checked={needsEmail} onChange={e => setNeedsEmail(e.target.checked)} />}
                                        label="✓ Check if answer is a valid email address"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={needsPhone} onChange={e => setNeedsPhone(e.target.checked)} />}
                                        label="✓ Check if answer is a valid phone number"
                                    />
                                </>
                            )}
                        </FormGroup>

                        {/* Simple Conditional Logic */}
                        {dropdownFields.length > 0 && (
                            <Box>
                                <Divider sx={{ my: 2 }} />
                                <FormControlLabel
                                    control={<Checkbox checked={hasCondition} onChange={e => setHasCondition(e.target.checked)} />}
                                    label="⚡ Only show this question if..."
                                />
                                {hasCondition && (
                                    <Box sx={{ mt: 2, ml: 4, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: 1, borderColor: 'warning.light' }}>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            <TextField
                                                select
                                                label="Question"
                                                value={conditionField}
                                                onChange={e => setConditionField(e.target.value)}
                                                size="small"
                                                sx={{ minWidth: 200 }}
                                            >
                                                {dropdownFields.map(f => (
                                                    <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>
                                                ))}
                                            </TextField>
                                            <Typography>equals</Typography>
                                            <TextField
                                                label="Value"
                                                value={conditionValue}
                                                onChange={e => setConditionValue(e.target.value)}
                                                size="small"
                                                placeholder="e.g., Residential"
                                                sx={{ minWidth: 150 }}
                                            />
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            Example: Show "Number of stairs" only when "Move Type" equals "Residential"
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!questionText.trim()} size="large">
                        {editingIndex !== null ? 'Update Question' : 'Add Question'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Question Library Dialog */}
            <Dialog open={libraryDialogOpen} onClose={() => setLibraryDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LibraryBooksIcon />
                        <Typography variant="h6">Question Library</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Add pre-built questions to your form
                    </Typography>

                    <Tabs value={libraryTab} onChange={(_, v) => setLibraryTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        {Object.keys(getLibraryByCategory()).map((category, idx) => (
                            <Tab key={category} label={category} />
                        ))}
                    </Tabs>

                    <Box>
                        {Object.entries(getLibraryByCategory()).map(([category, questions], idx) => (
                            libraryTab === idx && (
                                <List key={category}>
                                    {questions.map((q: any) => (
                                        <ListItem key={q.id} disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    const newQuestion = {
                                                        ...q,
                                                        id: q.id.replace('lib_', '') + '_' + Date.now(),
                                                    }
                                                    // Merge library data sources if needed
                                                    if (q.options?.dataSourceId) {
                                                        const libDs = LIBRARY_DATA_SOURCES.find(ds => ds.id === q.options.dataSourceId)
                                                        if (libDs && !dataSources.find(ds => ds.id === libDs.id)) {
                                                            onDataSourcesChange([...dataSources, libDs])
                                                        }
                                                    }
                                                    addToHistory([...fields, newQuestion])
                                                    setLibraryDialogOpen(false)
                                                }}
                                            >
                                                <ListItemText
                                                    primary={q.label}
                                                    secondary={
                                                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                                                            <Chip
                                                                label={QUESTION_TYPES.find(t => t.value === q.widget.key)?.label || q.widget.key}
                                                                size="small"
                                                            />
                                                            {q.required && <Chip label="Required" size="small" color="error" />}
                                                        </Stack>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            )
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLibraryDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
