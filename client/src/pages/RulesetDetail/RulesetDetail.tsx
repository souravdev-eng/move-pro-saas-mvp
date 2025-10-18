import { useMemo, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { getRuleset } from '../../api/rulesets.api'
import { createResponse, getResponseStats } from '../../api/responses.api'
import type { Definitions, Ruleset } from '../../types/rules'
import type { ResponseStats } from '../../api/responses.api'
import { useQuery } from '../../hooks/useQuery'
import JsonViewer from '../../components/JsonViewer/JsonViewer'
import FormRenderer from '../../components/FormRenderer/FormRenderer'
import SectionCard from '../../components/SectionCard/SectionCard'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Fab from '@mui/material/Fab'
import RefreshIcon from '@mui/icons-material/Refresh'
import Collapse from '@mui/material/Collapse'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

import sampleGlobal from '../../fixtures/sampleRuleset.global.json'

export default function RulesetDetail() {
    const { id = '' } = useParams()
    const [useLocal, setUseLocal] = useState(false)
    const [showJson, setShowJson] = useState(false)
    const [formKey, setFormKey] = useState(0)
    const { data, loading, error } = useQuery<Ruleset>(() => getRuleset(id), [id])
    const { data: stats } = useQuery<ResponseStats>(() => getResponseStats(id), [id])

    const ruleset = useLocal ? (sampleGlobal as any as Ruleset) : data || null
    const definitions = useMemo(() => ruleset?.definitions as Definitions | undefined, [ruleset])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    function handleReset() {
        setFormKey(k => k + 1)
        setSubmitSuccess(false)
    }

    async function handleSubmit(values: Record<string, any>) {
        if (!ruleset || useLocal) {
            // Just show dialog for fixture mode
            setDialogOpen(true)
            return
        }

        setSubmitting(true)
        try {
            await createResponse({
                rulesetId: ruleset._id,
                tenantId: ruleset.tenantId,
                branchId: ruleset.branchId,
                data: values,
                submittedBy: 'test-user',
            })
            setSubmitSuccess(true)
            setDialogOpen(true)
        } catch (e: any) {
            alert('Failed to submit: ' + (e?.message || 'Unknown error'))
        } finally {
            setSubmitting(false)
        }
    }

    if (!ruleset && loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>
    if (!ruleset && error) return <Container sx={{ py: 4 }}><Typography color="error">{error}</Typography></Container>
    if (!ruleset) return null

    return (
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {ruleset.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {ruleset.scope} {ruleset.branchId ? `· ${ruleset.branchId}` : ''} · {ruleset.status}
                    </Typography>
                    {stats && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip label={`${stats.total} responses`} size="small" color="primary" />
                            {stats.byStatus.submitted > 0 && <Chip label={`${stats.byStatus.submitted} new`} size="small" color="warning" />}
                        </Stack>
                    )}
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        component={RouterLink}
                        to={`/responses?rulesetId=${ruleset._id}`}
                        variant="outlined"
                        startIcon={<FormatListBulletedIcon />}
                    >
                        View Responses ({stats?.total || 0})
                    </Button>
                    <Button onClick={() => setUseLocal(v => !v)} variant="outlined">
                        {useLocal ? 'Using Fixture' : 'Use Sample'}
                    </Button>
                    <Button onClick={() => setShowJson(v => !v)} variant="outlined">
                        {showJson ? 'Hide' : 'Show'} JSON
                    </Button>
                </Stack>
            </Box>

            {submitSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSubmitSuccess(false)}>
                    ✅ Form submitted successfully! <Link component={RouterLink} to={`/responses?rulesetId=${ruleset._id}`}>View all responses</Link>
                </Alert>
            )}

            <Grid container spacing={3}>
                {showJson ? (
                    <Grid item xs={12} md={6}>
                        <Collapse in={showJson}>
                            <JsonViewer title="Ruleset Definition" data={ruleset} />
                        </Collapse>
                    </Grid>
                ) : null}
                <Grid item xs={12} md={showJson ? 6 : 12}>
                    <SectionCard title="Fill Out Form" subtitle="Test the form by submitting real data">
                        {submitting && <Alert severity="info" sx={{ mb: 2 }}>Submitting...</Alert>}
                        <FormRenderer
                            key={formKey}
                            definitions={definitions!}
                            onSubmit={handleSubmit}
                        />
                    </SectionCard>
                </Grid>
            </Grid>

            <Fab
                color="secondary"
                size="medium"
                onClick={handleReset}
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                title="Reset Form"
            >
                <RefreshIcon />
            </Fab>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {submitSuccess ? '✅ Form Submitted!' : 'Form Data'}
                </DialogTitle>
                <DialogContent>
                    {submitSuccess ? (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                Your response has been saved successfully!
                            </Typography>
                            <Button
                                component={RouterLink}
                                to={`/responses?rulesetId=${ruleset._id}`}
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                View All Responses
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Preview mode - responses are not saved when using fixture data.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
