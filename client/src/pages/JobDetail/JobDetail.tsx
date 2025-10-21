/**
 * JobDetail Page
 * Follows existing detail page patterns (RulesetDetail, ResponseDetail)
 * Displays job details with structured data view
 */

import { useParams, useNavigate } from 'react-router-dom'
import { getJob } from '../../api/jobs.api'
import { useQuery } from '../../hooks/useQuery'
import type { JobStatus } from '../../types/jobs'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WorkIcon from '@mui/icons-material/Work'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'

const statusColors: Record<JobStatus, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
    draft: 'default',
    created: 'primary',
    assigned: 'secondary',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'error',
}

export default function JobDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data: job, loading, error } = useQuery(() => getJob(id!), [id])

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    function renderValue(value: unknown): string {
        if (value === null || value === undefined) return 'N/A'
        if (typeof value === 'object') return JSON.stringify(value, null, 2)
        return String(value)
    }

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        )
    }

    if (error || !job) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Job not found'}</Alert>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <WorkIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h4" component="h1">
                            Job Details
                        </Typography>
                        <Chip label={job.status} color={statusColors[job.status]} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        ID: {job._id}
                    </Typography>
                </Box>
            </Box>

            {/* Warnings */}
            {job.meta?.warnings && job.meta.warnings.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Warnings
                    </Typography>
                    {job.meta.warnings.map((warning, idx) => (
                        <Typography key={idx} variant="body2">
                            • {warning}
                        </Typography>
                    ))}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Left Column: Metadata */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Overview
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Service Type
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {job.serviceType}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Branch ID
                            </Typography>
                            <Typography variant="body1">
                                {job.branchId}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Tenant ID
                            </Typography>
                            <Typography variant="body1">
                                {job.tenantId}
                            </Typography>
                        </Box>

                        {job.createdBy && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Created By
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon fontSize="small" />
                                    <Typography variant="body1">
                                        {job.createdBy}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Created At
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarIcon fontSize="small" />
                                <Typography variant="body2">
                                    {formatDate(job.createdAt)}
                                </Typography>
                            </Box>
                        </Box>

                        {job.updatedAt !== job.createdAt && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Updated At
                                </Typography>
                                <Typography variant="body2">
                                    {formatDate(job.updatedAt)}
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* Schema Version */}
                    {job.meta?.validationSchemaVersion && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Metadata
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Schema Version
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                    {job.meta.validationSchemaVersion}
                                </Typography>
                            </Box>

                            {job.meta.computedFields && job.meta.computedFields.length > 0 && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Computed Fields
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                        {job.meta.computedFields.map((field) => (
                                            <Chip key={field} label={field} size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Grid>

                {/* Right Column: Payload Data */}
                <Grid item xs={12} md={8}>
                    {/* Customer Data */}
                    {job.customer && Object.keys(job.customer).length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Customer Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(job.customer).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell sx={{ fontWeight: 500, width: '30%' }}>
                                                    {key}
                                                </TableCell>
                                                <TableCell>{renderValue(value)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Move Data */}
                    {job.move && Object.keys(job.move).length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Move Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(job.move).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell sx={{ fontWeight: 500, width: '30%' }}>
                                                    {key}
                                                </TableCell>
                                                <TableCell>{renderValue(value)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Pricing Data */}
                    {job.pricing && Object.keys(job.pricing).length > 0 && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Pricing
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        {Object.entries(job.pricing).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell sx={{ fontWeight: 500, width: '30%' }}>
                                                    {key}
                                                </TableCell>
                                                <TableCell>{renderValue(value)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Full Payload (fallback) */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Full Payload
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {Object.entries(job.payload).map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell sx={{ fontWeight: 500, width: '30%', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                {key}
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: typeof value === 'object' ? 'monospace' : 'inherit',
                                                        whiteSpace: typeof value === 'object' ? 'pre-wrap' : 'normal',
                                                        fontSize: typeof value === 'object' ? '0.75rem' : '0.875rem',
                                                    }}
                                                >
                                                    {renderValue(value)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

