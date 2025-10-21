/**
 * JobCreate Page
 * Reuses FormRenderer component and follows existing page patterns
 * Fetches dynamic form schema from backend and renders with existing primitives
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFormSchema, createJob } from '../../api/jobs.api'
import { branchesApi } from '../../api/branches.api'
import { listRulesets } from '../../api/rulesets.api'
import { useToast } from '../../components/ToastProvider/ToastProvider.hook'
import FormRenderer from '../../components/FormRenderer/FormRenderer'
import type { Definitions } from '../../types/rules'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { Branch } from '../../api/branches.api'

const TENANT_ID = 'ams123' // Hardcoded tenant ID

/**
 * Convert simple layout format (fields array) to complex format (rows/cols)
 * Backend returns: { sections: [{ fields: ['field1', 'field2'] }] }
 * FormRenderer needs: { sections: [{ rows: [{ cols: [{ fieldId: 'field1' }] }] }] }
 */
function convertLayoutToRowsAndCols(layout: any): any {
    if (!layout || !layout.sections) {
        return { sections: [] }
    }

    return {
        ...layout,
        sections: layout.sections.map((section: any) => {
            // If already has rows structure, return as-is
            if (section.rows) {
                return section
            }

            // Convert simple fields array to rows/cols structure
            const fields = section.fields || []
            const rows = fields.map((fieldId: string) => ({
                cols: [{ fieldId, span: 12 }]
            }))

            return {
                ...section,
                rows,
            }
        }),
    }
}

export default function JobCreate() {
    const navigate = useNavigate()
    const toast = useToast()

    // Dropdown data
    const [branches, setBranches] = useState<Branch[]>([])
    const [serviceTypes, setServiceTypes] = useState<string[]>([])
    const [loadingDropdowns, setLoadingDropdowns] = useState(true)

    // Form inputs
    const [branchId, setBranchId] = useState('')
    const [serviceType, setServiceType] = useState('')

    // Schema state
    const [schema, setSchema] = useState<Definitions | null>(null)
    const [defaults, setDefaults] = useState<Record<string, unknown>>({})
    const [schemaVersion, setSchemaVersion] = useState<string>('')
    const [loadingSchema, setLoadingSchema] = useState(false)
    const [schemaError, setSchemaError] = useState<string | null>(null)

    // Submission state
    const [submitError, setSubmitError] = useState<string | null>(null)

    // Form values (initialize with defaults when schema loads)
    const [formValues, setFormValues] = useState<Record<string, unknown>>({})

    // Load branches and service types on mount
    useEffect(() => {
        async function loadDropdownData() {
            setLoadingDropdowns(true)
            try {
                // Load branches for tenant
                const branchesResult = await branchesApi.list({ tenantId: TENANT_ID })
                setBranches(branchesResult.data)

                // Load available service types from published rulesets
                const rulesetsResult = await listRulesets({
                    tenantId: TENANT_ID,
                    limit: 100
                })

                // Filter to published rulesets only
                const publishedRulesets = rulesetsResult.data.filter(r => r.status === 'published')

                const uniqueServiceTypes = new Set<string>()
                publishedRulesets.forEach((ruleset) => {
                    const st = (ruleset.definitions as Record<string, unknown>)?.serviceType
                    if (typeof st === 'string') {
                        uniqueServiceTypes.add(st)
                    }
                })

                setServiceTypes(Array.from(uniqueServiceTypes).sort())

                // Auto-select first branch and service type if available
                if (branchesResult.data.length > 0) {
                    setBranchId(branchesResult.data[0].branchId)
                }
                if (uniqueServiceTypes.size > 0) {
                    setServiceType(Array.from(uniqueServiceTypes).sort()[0])
                }
            } catch (e: unknown) {
                const error = e as { response?: { data?: { error?: { message?: string } } }; message?: string }
                const errorMsg = error.response?.data?.error?.message ?? error.message ?? 'Failed to load dropdown data'
                toast.error(errorMsg)
            } finally {
                setLoadingDropdowns(false)
            }
        }

        loadDropdownData()
    }, [toast])

    // Initialize form with defaults when schema loads
    useEffect(() => {
        if (defaults && Object.keys(defaults).length > 0) {
            setFormValues(defaults)
        }
    }, [defaults])

    // Auto-load schema when both branch and service type are selected
    useEffect(() => {
        if (branchId && serviceType && !loadingDropdowns && !schema) {
            loadSchema()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId, serviceType, loadingDropdowns])

    async function loadSchema() {
        if (!branchId.trim() || !serviceType.trim()) {
            setSchemaError('Please enter both Branch ID and Service Type')
            return
        }

        setLoadingSchema(true)
        setSchemaError(null)
        setSchema(null)

        try {
            const result = await getFormSchema(branchId, serviceType)

            // Convert simple layout (fields array) to complex layout (rows/cols structure)
            const convertedLayout = convertLayoutToRowsAndCols(result.layout)

            // Convert FormSchema to Definitions format that FormRenderer expects
            const definitions: Definitions = {
                fields: result.fields || [],
                layout: convertedLayout,
                expressions: result.expressions || [],
                dataSources: result.dataSources || [],
                widgets: [],
            }

            setSchema(definitions)
            setDefaults(result.defaults || {})
            setSchemaVersion(result.validationSchemaVersion || '')
            toast.success('Form schema loaded successfully')
        } catch (e: unknown) {
            const error = e as { response?: { data?: { message?: string } }; message?: string }
            const errorMsg = error.response?.data?.message ?? error.message ?? 'Failed to load form schema'
            setSchemaError(errorMsg)
            toast.error(errorMsg)
        } finally {
            setLoadingSchema(false)
        }
    }

    async function handleSubmit(values: Record<string, unknown>) {
        setSubmitError(null)

        try {
            const payload = {
                branchId,
                serviceType,
                payload: values,
                createdBy: 'current-user', // TODO: Replace with actual user context
            }

            const result = await createJob(payload)

            // Show warnings if any
            if (result.warnings && result.warnings.length > 0) {
                toast.warning(`Job created with warnings: ${result.warnings.join(', ')}`)
            } else {
                toast.success('Job created successfully!')
            }

            // Navigate to job detail page
            navigate(`/jobs/${result.job._id}`)
        } catch (e: unknown) {
            const error = e as { response?: { data?: { message?: string; error?: { details?: Array<{ path: string; message: string }> } } }; message?: string }
            const errorMsg = error.response?.data?.message ?? error.message ?? 'Failed to create job'
            setSubmitError(errorMsg)
            toast.error(errorMsg)

            // Check for field-level errors
            const details = error.response?.data?.error?.details
            if (details && Array.isArray(details)) {
                const fieldErrors = details.map((d) => `${d.path}: ${d.message}`).join('\n')
                setSubmitError(`Validation failed:\n${fieldErrors}`)
            }
        }
    }

    const hasSchema = schema !== null

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/jobs')}
                    variant="outlined"
                    size="small"
                >
                    Back to Jobs
                </Button>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" component="h1">
                        Create New Job
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter branch and service type to load the dynamic form
                    </Typography>
                </Box>
            </Box>

            {/* Step 1: Select Branch & Service Type */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Step 1: Load Form Schema
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Select branch and service type to load the appropriate form
                </Typography>

                {loadingDropdowns ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading branches and service types...</Typography>
                    </Box>
                ) : (
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <TextField
                            select
                            label="Branch"
                            value={branchId}
                            onChange={(e) => {
                                setBranchId(e.target.value)
                                setSchema(null) // Reset schema when branch changes
                            }}
                            size="small"
                            sx={{ minWidth: 300 }}
                            disabled={loadingSchema || branches.length === 0}
                            required
                        >
                            {branches.length === 0 ? (
                                <MenuItem value="" disabled>No branches available</MenuItem>
                            ) : (
                                branches?.map((branch) => (
                                    <MenuItem key={branch?.branchId} value={branch.branchId}>
                                        {branch.displayName || branch.name} ({branch.address.city}, {branch.address.state})
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        <TextField
                            select
                            label="Service Type"
                            value={serviceType}
                            onChange={(e) => {
                                setServiceType(e.target.value)
                                setSchema(null) // Reset schema when service type changes
                            }}
                            size="small"
                            sx={{ minWidth: 300 }}
                            disabled={loadingSchema || serviceTypes.length === 0}
                            required
                        >
                            {serviceTypes.length === 0 ? (
                                <MenuItem value="" disabled>No service types available</MenuItem>
                            ) : (
                                serviceTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        <Button
                            variant="contained"
                            onClick={loadSchema}
                            disabled={loadingSchema || !branchId || !serviceType}
                            startIcon={loadingSchema ? <CircularProgress size={16} /> : undefined}
                        >
                            {loadingSchema ? 'Loading...' : hasSchema ? 'Reload Form' : 'Load Form'}
                        </Button>
                    </Stack>
                )}

                {schemaError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {schemaError}
                    </Alert>
                )}

                {hasSchema && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        ✓ Form schema loaded ({schema.fields.length} fields, version: {schemaVersion || 'unknown'})
                    </Alert>
                )}
            </Paper>

            {/* Step 2: Fill Form (only shown when schema is loaded) */}
            {hasSchema && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Step 2: Fill Job Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Complete the form below. Fields marked with * are required.
                    </Typography>

                    {schema.fields.length === 0 ? (
                        <Alert severity="warning">
                            No fields defined in this form schema. Please check the ruleset configuration.
                        </Alert>
                    ) : (
                        <>
                            <FormRenderer
                                definitions={schema}
                                initialValues={formValues}
                                onSubmit={handleSubmit}
                            />

                            {submitError && (
                                <Alert severity="error" sx={{ mt: 3, whiteSpace: 'pre-line' }}>
                                    {submitError}
                                </Alert>
                            )}
                        </>
                    )}
                </Paper>
            )}

            {/* Empty state */}
            {!hasSchema && !loadingSchema && !schemaError && (
                <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        👆 Load a form schema to get started
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter a branch ID and service type above, then click "Load Form"
                    </Typography>
                </Paper>
            )}
        </Container>
    )
}

