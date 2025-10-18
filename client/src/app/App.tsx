import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Sidebar from '../components/Sidebar/Sidebar'
import TopHeader from '../components/TopHeader/TopHeader'

export default function App() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <TopHeader />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    pt: 11, // Top header height (64px) + padding
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    overflowX: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}
