import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import InputBase from '@mui/material/InputBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, alpha } from '@mui/material/styles'

// Icons
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.08),
    },
    '&:focus-within': {
        backgroundColor: alpha(theme.palette.common.white, 0.1),
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.light, 0.3)}`,
    },
    marginLeft: 0,
    marginRight: theme.spacing(2),
    width: '100%',
    maxWidth: '400px',
    transition: 'all 0.2s',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: '0.875rem',
        '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.7,
        },
    },
}))

export default function TopHeader() {
    const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null)
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null)
    const [searchValue, setSearchValue] = useState('')

    const notifications = [
        { id: 1, text: 'New response on "Moving Request Form"', time: '2m ago', unread: true },
        { id: 2, text: 'Form "Customer Feedback" was updated', time: '1h ago', unread: true },
        { id: 3, text: '5 new responses today', time: '3h ago', unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                backgroundColor: '#252931',
                borderBottom: '1px solid #383c44',
                boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
            }}
        >
            <Toolbar sx={{ minHeight: 64, px: 3 }}>
                {/* Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mr: 4,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '1rem',
                        }}
                    >
                        M
                    </Box>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
                        MovePro
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search forms, responses..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>

                <Box sx={{ flexGrow: 1 }} />

                {/* Right Side Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Notifications */}
                    <IconButton
                        color="inherit"
                        onClick={e => setAnchorElNotif(e.currentTarget)}
                        sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.08),
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Help */}
                    <IconButton
                        color="inherit"
                        sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                                backgroundColor: alpha('#fff', 0.08),
                                transform: 'rotate(15deg) scale(1.1)',
                            },
                        }}
                    >
                        <HelpOutlineIcon />
                    </IconButton>

                    {/* Profile */}
                    <IconButton
                        onClick={e => setAnchorElProfile(e.currentTarget)}
                        sx={{
                            p: 0.5,
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            JD
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={anchorElNotif}
                    open={Boolean(anchorElNotif)}
                    onClose={() => setAnchorElNotif(null)}
                    PaperProps={{
                        sx: {
                            width: 320,
                            mt: 1,
                            backgroundColor: '#252931',
                            border: '1px solid #383c44',
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #383c44' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Notifications
                        </Typography>
                    </Box>
                    {notifications.map(notif => (
                        <MenuItem
                            key={notif.id}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderLeft: notif.unread ? '3px solid' : '3px solid transparent',
                                borderColor: notif.unread ? 'primary.main' : 'transparent',
                                backgroundColor: notif.unread ? alpha('#0052cc', 0.05) : 'transparent',
                            }}
                        >
                            <Box>
                                <Typography variant="body2">{notif.text}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {notif.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                    <Divider sx={{ borderColor: '#383c44' }} />
                    <MenuItem sx={{ justifyContent: 'center', py: 1 }}>
                        <Typography variant="caption" color="primary">
                            View all notifications
                        </Typography>
                    </MenuItem>
                </Menu>

                {/* Profile Menu */}
                <Menu
                    anchorEl={anchorElProfile}
                    open={Boolean(anchorElProfile)}
                    onClose={() => setAnchorElProfile(null)}
                    PaperProps={{
                        sx: {
                            width: 220,
                            mt: 1,
                            backgroundColor: '#252931',
                            border: '1px solid #383c44',
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #383c44' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            John Doe
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            john@movepro.com
                        </Typography>
                    </Box>
                    <MenuItem>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <HelpOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        Help & Feedback
                    </MenuItem>
                    <Divider sx={{ borderColor: '#383c44' }} />
                    <MenuItem sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

