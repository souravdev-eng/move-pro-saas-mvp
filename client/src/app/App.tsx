import { Outlet, Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

export default function App() {
    return (
        <>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none' }} component={Link} to="/">
                        MovePro Rules
                    </Typography>
                    <Button color="inherit" component={Link} to="/rulesets/new">Create Form</Button>
                    <Button color="inherit" component={Link} to="/rulesets">Forms</Button>
                    <Button color="inherit" component={Link} to="/responses">Responses</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </>
    )
}


