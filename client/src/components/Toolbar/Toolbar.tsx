import MuiAppBar from '@mui/material/AppBar'
import MuiToolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

export default function Toolbar() {
    return (
        <MuiAppBar position="static" color="primary">
            <MuiToolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    MovePro Rules
                </Typography>
                <Button color="inherit" component={RouterLink} to="/rulesets/new">Create</Button>
                <Button color="inherit" component={RouterLink} to="/rulesets">List</Button>
            </MuiToolbar>
        </MuiAppBar>
    )
}


