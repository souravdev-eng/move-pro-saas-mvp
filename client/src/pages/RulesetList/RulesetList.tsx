import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { deleteRulesetById, listRulesets } from '../../api/rulesets.api'
import type { Paginated, Ruleset } from '../../types/rules'
import { useQuery } from '../../hooks/useQuery'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
// import MenuItem from '@mui/material/MenuItem'
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

export default function RulesetList() {
    const [tenantId, setTenantId] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const { data, loading, error, reload } = useQuery<Paginated<Ruleset>>(
        () => listRulesets({ tenantId: tenantId || undefined, page, limit }),
        [tenantId, page, limit]
    )

    const handleDelete = async (id: string) => {
        await deleteRulesetById(id);
        await reload();
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="h1">
                    Rulesets
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/rulesets/new"
                >
                    Create Ruleset
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        label="Tenant ID"
                        value={tenantId}
                        onChange={e => setTenantId(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Button variant="contained" onClick={reload}>
                        Search
                    </Button>
                </Stack>
            </Paper>

            {error ? (
                <Box color="error.main" sx={{ mb: 2 }}>
                    {error}
                </Box>
            ) : null}

            {loading ? <Box>Loading...</Box> : null}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Scope</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.data.map(rs => (
                            <TableRow key={rs._id} hover>
                                <TableCell>{rs.name}</TableCell>
                                <TableCell>
                                    <Chip label={rs.scope} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{rs.branchId ?? '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={rs.status}
                                        size="small"
                                        color={rs.status === 'published' ? 'success' : rs.status === 'archived' ? 'default' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>{new Date(rs.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        component={RouterLink}
                                        to={`/rulesets/${rs._id}`}
                                        size="small"
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    {!loading && <IconButton
                                        onClick={() => handleDelete(rs._id)}
                                        size="small"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>}
                                </TableCell>
                            </TableRow>
                        ))}
                        {!data?.data.length && !loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No rulesets found
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
                <Typography>Page {page}</Typography>
                <Button onClick={() => setPage(p => p + 1)} disabled={!data?.data.length}>
                    Next
                </Button>
                <TextField
                    size="small"
                    type="number"
                    label="Limit"
                    value={limit}
                    onChange={e => setLimit(Number(e.target.value))}
                    sx={{ width: 100 }}
                />
            </Stack>
        </Container>
    )
}
