import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRuleset } from '../../api/rulesets.api'
import type { Definitions, FieldDef, Scope } from '../../types/rules'
import { FORM_TEMPLATES } from '../../utils/formTemplates'
import SimpleFieldBuilder from '../../components/SimpleFieldBuilder/SimpleFieldBuilder'
import FormRenderer from '../../components/FormRenderer/FormRenderer'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import SaveIcon from '@mui/icons-material/Save'
import PreviewIcon from '@mui/icons-material/Visibility'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TemplateIcon from '@mui/icons-material/LibraryBooks'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Grid from '@mui/material/Grid'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ComputerIcon from '@mui/icons-material/Computer'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import Chip from '@mui/material/Chip'

export default function RulesetCreate() {
  const navigate = useNavigate()

  // Step 1: Basic Info
  const [name, setName] = useState('My Form')
  const [notes, setNotes] = useState('')
  const [tenantId, setTenantId] = useState('demo-tenant')
  const [scope, setScope] = useState<Scope>('global')
  const [branchId, setBranchId] = useState('')

  // Step 2: Questions (Fields)
  const [fields, setFields] = useState<FieldDef[]>([])
  const [dataSources, setDataSources] = useState<any[]>([])
  const [sections, setSections] = useState<string[]>(['Main Questions'])

  // UI State
  const [activeStep, setActiveStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  // Auto-generate layout from fields (grouped by sections)
  const layout = useMemo(() => {
    if (fields.length === 0) {
      return { sections: [] }
    }

    // Group fields by their _section metadata
    const sectionMap = new Map<string, FieldDef[]>()
    fields.forEach(f => {
      const section = (f as any)._section || sections[0]
      if (!sectionMap.has(section)) sectionMap.set(section, [])
      sectionMap.get(section)!.push(f)
    })

    // Build layout sections
    const layoutSections = Array.from(sectionMap.entries()).map(([sectionName, sectionFields], sIdx) => {
      const rows = []
      for (let i = 0; i < sectionFields.length; i += 2) {
        const cols = []
        const field1 = sectionFields[i]
        cols.push({ fieldId: field1.id, span: field1.widget.key === 'textarea' ? 12 : 6 })

        if (i + 1 < sectionFields.length) {
          const field2 = sectionFields[i + 1]
          if (field2.widget.key !== 'textarea') {
            cols.push({ fieldId: field2.id, span: 6 })
          } else {
            rows.push({ cols })
            rows.push({ cols: [{ fieldId: field2.id, span: 12 }] })
            i++
            continue
          }
        }
        rows.push({ cols })
      }

      return {
        id: `section_${sIdx}`,
        title: sectionName,
        rows,
      }
    })

    return { sections: layoutSections }
  }, [fields, sections])

  const definitions: Definitions = useMemo(() => ({
    fields,
    layout,
    dataSources,
    expressions: [],
    widgets: [],
  }), [fields, layout, dataSources])

  function loadTemplate(templateId: string) {
    const template = FORM_TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    setFields(template.fields.map(f => ({ ...f, id: f.id + '_' + Date.now() })))
    setDataSources(template.dataSources)
    setSections(template.sections)
    setName(template.name)
    setNotes(template.description)
    setTemplateDialogOpen(false)
    setActiveStep(1)
  }

  async function handleSave() {
    setError(null)

    if (!name.trim()) {
      setError('Please enter a form name')
      return
    }
    if (fields.length === 0) {
      setError('Please add at least one question')
      return
    }

    setBusy(true)
    try {
      const payload = {
        tenantId,
        scope,
        branchId: scope === 'branch' ? branchId : undefined,
        name,
        notes,
        definitions,
      }
      const created = await createRuleset(payload as any)
      navigate(`/rulesets/${created._id}`)
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Failed to save form')
    } finally {
      setBusy(false)
    }
  }

  const steps = [
    {
      label: 'Form Details',
      description: 'Give your form a name',
    },
    {
      label: 'Add Questions',
      description: `${fields.length} question${fields.length !== 1 ? 's' : ''} added`,
    },
    {
      label: 'Preview & Save',
      description: 'See how it looks',
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Form
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Follow the steps below to build your custom form
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* STEP 1: Basic Info */}
          <Step>
            <StepLabel>
              <Typography variant="h6">{steps[0].label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {steps[0].description}
              </Typography>

              <Stack spacing={2} sx={{ maxWidth: 600 }}>
                <TextField
                  label="Form Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  placeholder="e.g., Customer Registration Form"
                  required
                />
                <TextField
                  label="Description (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="What is this form for?"
                />
              </Stack>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(1)}
                  disabled={!name.trim()}
                  endIcon={<ArrowForwardIcon />}
                >
                  Next: Add Questions
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TemplateIcon />}
                  onClick={() => setTemplateDialogOpen(true)}
                >
                  Choose Template
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* STEP 2: Questions */}
          <Step>
            <StepLabel>
              <Typography variant="h6">{steps[1].label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {steps[1].description}
              </Typography>

              <SimpleFieldBuilder
                fields={fields}
                onChange={setFields}
                dataSources={dataSources}
                onDataSourcesChange={setDataSources}
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button onClick={() => setActiveStep(0)} startIcon={<ArrowBackIcon />}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  disabled={fields.length === 0}
                  endIcon={<PreviewIcon />}
                >
                  Preview Form
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* STEP 3: Preview */}
          <Step>
            <StepLabel>
              <Typography variant="h6">{steps[2].label}</Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography color="text.secondary">
                  {steps[2].description}
                </Typography>
                <ToggleButtonGroup
                  value={previewMode}
                  exclusive
                  onChange={(_, val) => val && setPreviewMode(val)}
                  size="small"
                >
                  <ToggleButton value="desktop">
                    <ComputerIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Desktop
                  </ToggleButton>
                  <ToggleButton value="mobile">
                    <PhoneAndroidIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Mobile
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {fields.length === 0 ? (
                <Alert severity="warning">No questions added yet</Alert>
              ) : (
                <Box
                  sx={{
                    maxWidth: previewMode === 'mobile' ? 375 : '100%',
                    mx: previewMode === 'mobile' ? 'auto' : 0,
                    transition: 'all 0.3s',
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      bgcolor: 'background.default',
                      border: previewMode === 'mobile' ? 2 : 1,
                      borderColor: previewMode === 'mobile' ? 'primary.main' : 'divider',
                      boxShadow: previewMode === 'mobile' ? 4 : 0,
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Preview: {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      This is how users will see your form
                    </Typography>
                    <FormRenderer
                      definitions={definitions}
                      onSubmit={values => alert('Form submitted!\n\n' + JSON.stringify(values, null, 2))}
                    />
                  </Paper>
                  {previewMode === 'mobile' && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                      Mobile Preview (375px width)
                    </Typography>
                  )}
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button onClick={() => setActiveStep(1)} startIcon={<ArrowBackIcon />}>
                  Back to Questions
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                  disabled={busy || fields.length === 0}
                  startIcon={<SaveIcon />}
                >
                  {busy ? 'Saving...' : 'Save Form'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Template Picker Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TemplateIcon />
            <Typography variant="h6">Choose a Template</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start with a pre-built form and customize it to your needs
          </Typography>
          <Grid container spacing={2}>
            {FORM_TEMPLATES.map(template => (
              <Grid item xs={12} sm={6} key={template.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => loadTemplate(template.id)} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h3">{template.icon}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Chip label={`${template.fields.length} questions`} size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Settings (collapsed by default) */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Tenant:</strong> {tenantId} | <strong>Scope:</strong> {scope}
          {scope === 'branch' && ` | Branch: ${branchId}`}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            label="Tenant ID"
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            sx={{ width: 200 }}
          />
          <TextField
            size="small"
            select
            label="Scope"
            value={scope}
            onChange={e => setScope(e.target.value as Scope)}
            sx={{ width: 150 }}
          >
            <MenuItem value="global">Global</MenuItem>
            <MenuItem value="branch">Branch</MenuItem>
          </TextField>
          {scope === 'branch' && (
            <TextField
              size="small"
              label="Branch ID"
              value={branchId}
              onChange={e => setBranchId(e.target.value)}
              sx={{ width: 200 }}
            />
          )}
        </Box>
      </Box>
    </Container>
  )
}
