/**
 * JobList Page
 * Follows existing list page patterns (RulesetList, ResponseList)
 * Displays paginated job list with filtering
 */

import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { listJobs } from '../../api/jobs.api'
import { useQuery } from '../../hooks/useQuery'
import type { JobStatus } from '../../types/jobs'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import AddIcon from '@mui/icons-material/Add'
import WorkIcon from '@mui/icons-material/Work'

const statusColors: Record<JobStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
    draft: 'default',
    created: 'primary',
    assigned: 'secondary',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'error',
}

export default function JobList() {
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    const [statusFilter, setStatusFilter] = useState<JobStatus | ''>('')
    const [branchFilter, setBranchFilter] = useState('')
    const [searchFilter, setSearchFilter] = useState('')

    const { data, loading, error } = useQuery(
        () => listJobs({
            page: page + 1,
            limit,
            status: statusFilter || undefined,
            branchId: branchFilter || undefined,
            search: searchFilter || undefined,
        }),
        [page, limit, statusFilter, branchFilter, searchFilter]
    )

    const jobs = data?.data ?? []
    const total = data?.total ?? 0

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage all job submissions
                    </Typography>
                </Box>
                <Button
                    component={RouterLink}
                    to="/jobs/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                >
                    Create Job
                </Button>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <TextField
                        label="Search"
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value)
                            setPage(0)
                        }}
                        size="small"
                        placeholder="Search customer info..."
                        sx={{ minWidth: 250 }}
                    />
                    <TextField
                        label="Branch ID"
                        value={branchFilter}
                        onChange={(e) => {
                            setBranchFilter(e.target.value)
                            setPage(0)
                        }}
                        size="small"
                        placeholder="Filter by branch"
                        sx={{ minWidth: 200 }}
                    />
                    <TextField
                        select
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as JobStatus | '')
                            setPage(0)
                        }}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="created">Created</MenuItem>
                        <MenuItem value="assigned">Assigned</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
                    {(searchFilter || branchFilter || statusFilter) && (
                        <Button
                            onClick={() => {
                                setSearchFilter('')
                                setBranchFilter('')
                                setStatusFilter('')
                                setPage(0)
                            }}
                            variant="outlined"
                            size="small"
                        >
                            Clear Filters
                        </Button>
                    )}
                </Stack>
            </Paper>

            <Paper>
                {loading ? (
                    <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                    </Alert>
                ) : jobs.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No jobs found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {statusFilter || branchFilter || searchFilter
                                ? 'Try adjusting your filters'
                                : 'Create your first job to get started'}
                        </Typography>
                        <Button component={RouterLink} to="/jobs/new" variant="contained" startIcon={<AddIcon />}>
                            Create Job
                        </Button>
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Service Type</TableCell>
                                        <TableCell>Branch</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Created</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow
                                            key={job._id}
                                            hover
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {job._id.slice(0, 8)}...
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {job.serviceType}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={job.branchId} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={job.status}
                                                    size="small"
                                                    color={statusColors[job.status]}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {job.customer ? (
                                                    <Typography variant="body2">
                                                        {(job.customer as any).name || 'N/A'}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        N/A
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(job.createdAt)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={total}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={limit}
                            onRowsPerPageChange={(e) => {
                                setLimit(parseInt(e.target.value, 10))
                                setPage(0)
                            }}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                        />
                    </>
                )}
            </Paper>
        </Container>
    )
}

