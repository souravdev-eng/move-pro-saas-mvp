import { useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { getResponse, updateResponse } from '../../api/responses.api'
import { getRuleset } from '../../api/rulesets.api'
import type { Response } from '../../api/responses.api'
import type { Ruleset } from '../../types/rules'
import { useQuery } from '../../hooks/useQuery'
import JsonViewer from '../../components/JsonViewer/JsonViewer'
import SectionCard from '../../components/SectionCard/SectionCard'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

export default function ResponseDetail() {
    const { id = '' } = useParams()
    const { data: response, loading, error, reload } = useQuery<Response>(() => getResponse(id), [id])
    const { data: ruleset } = useQuery<Ruleset>(
        () => response ? getRuleset(response.rulesetId) : Promise.reject(),
        [response?.rulesetId]
    )

    const [editMode, setEditMode] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)

    async function handleUpdate() {
        if (!response) return
        setSaving(true)
        try {
            await updateResponse(response._id, {
                status: status as any,
                notes: notes || undefined,
                reviewedBy: 'current-user',
            })
            await reload()
            setEditMode(false)
        } catch (e: any) {
            alert(e?.message || 'Failed to update')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>
    if (error) return <Container sx={{ py: 4 }}><Typography color="error">{error}</Typography></Container>
    if (!response) return null

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link component={RouterLink} to="/responses" underline="hover">
                    Responses
                </Link>
                <Typography color="text.primary">Response Detail</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Response #{response._id.slice(-8)}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                            label={response.status}
                            size="small"
                            color={
                                response.status === 'reviewed' ? 'success' :
                                    response.status === 'archived' ? 'default' :
                                        'warning'
                            }
                        />
                        <Chip label={new Date(response.submittedAt).toLocaleDateString()} size="small" variant="outlined" />
                    </Stack>
                    {ruleset && (
                        <Typography variant="body2" color="text.secondary">
                            Form: <Link component={RouterLink} to={`/rulesets/${ruleset._id}`}>{ruleset.name}</Link>
                        </Typography>
                    )}
                </Box>
                <Button variant="outlined" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel Edit' : 'Update Status'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Response Data">
                        <Table size="small">
                            <TableBody>
                                {Object.entries(response.data).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell sx={{ fontWeight: 600 }}>{key}</TableCell>
                                        <TableCell>{String(value)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </SectionCard>

                    {editMode && (
                        <SectionCard title="Update Response" sx={{ mt: 2 }}>
                            <Stack spacing={2}>
                                <TextField
                                    select
                                    label="Status"
                                    value={status || response.status}
                                    onChange={e => setStatus(e.target.value)}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="submitted">Submitted</MenuItem>
                                    <MenuItem value="reviewed">Reviewed</MenuItem>
                                    <MenuItem value="archived">Archived</MenuItem>
                                </TextField>
                                <TextField
                                    label="Notes"
                                    value={notes || response.notes || ''}
                                    onChange={e => setNotes(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                />
                                <Button variant="contained" onClick={handleUpdate} disabled={saving}>
                                    {saving ? 'Saving...' : 'Update Response'}
                                </Button>
                            </Stack>
                        </SectionCard>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <SectionCard title="Metadata">
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><code>{response._id}</code></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Ruleset ID</strong></TableCell>
                                    <TableCell><code>{response.rulesetId}</code></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Tenant</strong></TableCell>
                                    <TableCell>{response.tenantId}</TableCell>
                                </TableRow>
                                {response.branchId && (
                                    <TableRow>
                                        <TableCell><strong>Branch</strong></TableCell>
                                        <TableCell>{response.branchId}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell><strong>Submitted By</strong></TableCell>
                                    <TableCell>{response.submittedBy || 'Anonymous'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Submitted At</strong></TableCell>
                                    <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                                </TableRow>
                                {response.reviewedBy && (
                                    <>
                                        <TableRow>
                                            <TableCell><strong>Reviewed By</strong></TableCell>
                                            <TableCell>{response.reviewedBy}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><strong>Reviewed At</strong></TableCell>
                                            <TableCell>{response.reviewedAt ? new Date(response.reviewedAt).toLocaleString() : '-'}</TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </SectionCard>

                    <Box sx={{ mt: 2 }}>
                        <JsonViewer title="Raw JSON" data={response} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

