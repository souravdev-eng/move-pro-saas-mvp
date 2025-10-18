import { useState } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { listResponses } from '../../api/responses.api'
import type { Response, Paginated } from '../../api/responses.api'
import { useQuery } from '../../hooks/useQuery'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FilterListIcon from '@mui/icons-material/FilterList'

export default function ResponseList() {
    const [searchParams] = useSearchParams()
    const rulesetIdParam = searchParams.get('rulesetId') || ''

    const [rulesetId, setRulesetId] = useState(rulesetIdParam)
    const [tenantId, setTenantId] = useState('demo-tenant')
    const [status, setStatus] = useState<string>('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)

    const { data, loading, error, reload } = useQuery<Paginated<Response>>(
        () => listResponses({ rulesetId: rulesetId || undefined, tenantId: tenantId || undefined, status: status || undefined, page, limit }),
        [rulesetId, tenantId, status, page, limit]
    )

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Form Responses
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage submitted forms
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        label="Ruleset ID"
                        value={rulesetId}
                        onChange={e => setRulesetId(e.target.value)}
                        sx={{ flex: 1 }}
                        placeholder="Filter by form/ruleset"
                    />
                    <TextField
                        size="small"
                        label="Tenant ID"
                        value={tenantId}
                        onChange={e => setTenantId(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        size="small"
                        select
                        label="Status"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        sx={{ flex: 1 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="submitted">Submitted</MenuItem>
                        <MenuItem value="reviewed">Reviewed</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={reload} startIcon={<FilterListIcon />}>
                        Filter
                    </Button>
                </Stack>
            </Paper>

            {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) : null}

            {loading ? <Box>Loading...</Box> : null}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Submitted</strong></TableCell>
                            <TableCell><strong>Ruleset ID</strong></TableCell>
                            <TableCell><strong>Submitted By</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data.map(response => (
                            <TableRow key={response._id} hover>
                                <TableCell>{new Date(response.submittedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <code style={{ fontSize: 11 }}>{response.rulesetId}</code>
                                </TableCell>
                                <TableCell>{response.submittedBy || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={response.status}
                                        size="small"
                                        color={
                                            response.status === 'reviewed' ? 'success' :
                                                response.status === 'archived' ? 'default' :
                                                    'warning'
                                        }
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        component={RouterLink}
                                        to={`/responses/${response._id}`}
                                        size="small"
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!data?.data.length && !loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No responses found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center" justifyContent="center">
                <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Prev
                </Button>
                <Typography>Page {page} of {data?.totalPages || 1}</Typography>
                <Button onClick={() => setPage(p => p + 1)} disabled={page >= (data?.totalPages || 1)}>
                    Next
                </Button>
                <TextField
                    size="small"
                    type="number"
                    label="Per Page"
                    value={limit}
                    onChange={e => setLimit(Number(e.target.value))}
                    sx={{ width: 100 }}
                />
            </Stack>
        </Container>
    )
}

