import { Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Stack from '@mui/material/Stack'
import DescriptionIcon from '@mui/icons-material/Description'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import InboxIcon from '@mui/icons-material/Inbox'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

export default function Dashboard() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome to MovePro Rules Engine
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Create dynamic forms, collect responses, and manage your business processes
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                        >
                            <CardActionArea component={RouterLink} to="/rulesets/new" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                                        <AddCircleOutlineIcon sx={{ fontSize: 48, color: 'white' }} />
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            Create Form
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            Build a new form with our visual builder
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                        >
                            <CardActionArea component={RouterLink} to="/rulesets" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                                        <DescriptionIcon sx={{ fontSize: 48, color: 'white' }} />
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            All Forms
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            Browse and manage your forms
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                        >
                            <CardActionArea component={RouterLink} to="/responses" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                                        <InboxIcon sx={{ fontSize: 48, color: 'white' }} />
                                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                            Responses
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                            View submitted form data
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)' },
                            }}
                        >
                            <CardContent>
                                <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                                    <TrendingUpIcon sx={{ fontSize: 48, color: 'white' }} />
                                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                        Analytics
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                                        Coming soon
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Quick Start
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        📝 Create Your First Form
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        1. Click "Create Form" above or in the sidebar
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        2. Choose a template or start from scratch
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        3. Add questions with our visual builder
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        4. Preview and save - you're done!
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        🚀 Key Features
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        • Visual form builder (no coding!)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        • 5 pre-built templates
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        • 20+ question library
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        • Mobile preview & validation
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

