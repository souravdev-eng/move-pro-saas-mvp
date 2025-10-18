import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const Section = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
}))

export const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontWeight: 600,
}))

export const Row = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: theme.spacing(1.5),
}))

export const Col = styled('div')<{ span?: number }>(({ span = 12 }) => ({
    gridColumn: `span ${Math.min(12, Math.max(1, span))}`,
}))


