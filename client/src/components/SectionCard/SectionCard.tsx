import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export interface SectionCardProps {
    title?: string
    subtitle?: string
    children: ReactNode
    actions?: ReactNode
}

export default function SectionCard({ title, subtitle, children, actions }: SectionCardProps) {
    return (
        <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
                {title || subtitle || actions ? (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box>
                            {title ? (
                                <Typography variant="h6" gutterBottom>
                                    {title}
                                </Typography>
                            ) : null}
                            {subtitle ? (
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            ) : null}
                        </Box>
                        {actions ? <Box sx={{ ml: 2 }}>{actions}</Box> : null}
                    </Box>
                ) : null}
                {children}
            </CardContent>
        </Card>
    )
}

