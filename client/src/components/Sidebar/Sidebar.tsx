import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import InboxIcon from '@mui/icons-material/Inbox'
import WorkIcon from '@mui/icons-material/Work'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import AdminIcon from '@mui/icons-material/AdminPanelSettings'

const DRAWER_WIDTH_OPEN = 240
const DRAWER_WIDTH_CLOSED = 60

interface MenuItem {
    id: string
    label: string
    icon: React.ReactNode
    path?: string
    children?: MenuItem[]
}

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/',
    },
    {
        id: 'jobs',
        label: 'Jobs',
        icon: <WorkIcon />,
        children: [
            {
                id: 'jobs-create',
                label: 'Create Job',
                icon: <AddCircleOutlineIcon />,
                path: '/jobs/new',
            },
            {
                id: 'jobs-list',
                label: 'All Jobs',
                icon: <WorkIcon />,
                path: '/jobs',
            },
        ],
    },
    {
        id: 'admin',
        label: 'Admin',
        icon: <AdminIcon />,
        children: [
            {
                id: 'forms-create',
                label: 'Create New',
                icon: <AddCircleOutlineIcon />,
                path: '/rulesets/new',
            },
            {
                id: 'forms-list',
                label: 'All Forms',
                icon: <DescriptionOutlinedIcon />,
                path: '/rulesets',
            },
            {
                id: 'responses-list',
                label: 'All Responses',
                icon: <InboxIcon />,
                path: '/responses',
            },
        ],
    },
]

const BOTTOM_MENU: MenuItem[] = [
    {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
    },
    {
        id: 'help',
        label: 'Help',
        icon: <HelpOutlineIcon />,
        path: '/help',
    },
]

export default function Sidebar() {
    const [open, setOpen] = useState(true)
    const [expandedItems, setExpandedItems] = useState<string[]>(['jobs', 'admin'])
    const location = useLocation()

    function toggleDrawer() {
        setOpen(!open)
    }

    function toggleExpand(itemId: string) {
        setExpandedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    function isActive(path?: string) {
        if (!path) return false
        if (path === '/' && location.pathname === '/') return true
        if (path !== '/' && location.pathname.startsWith(path)) return true
        return false
    }

    function renderMenuItem(item: MenuItem, isNested = false) {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.includes(item.id)
        const active = isActive(item.path)

        return (
            <Box key={item.id}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <Tooltip title={!open ? item.label : ''} placement="right">
                        <ListItemButton
                            component={item.path ? Link : 'div'}
                            to={item.path}
                            onClick={() => hasChildren && toggleExpand(item.id)}
                            sx={{
                                minHeight: 40,
                                justifyContent: open ? 'initial' : 'center',
                                px: isNested ? 3 : 2,
                                py: 1,
                                mx: 1,
                                borderRadius: 1,
                                backgroundColor: active ? 'rgba(0, 82, 204, 0.12)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: active ? 'rgba(0, 82, 204, 0.16)' : 'rgba(255, 255, 255, 0.05)',
                                },
                                '&:active': {
                                    backgroundColor: active ? 'rgba(0, 82, 204, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 2 : 'auto',
                                    justifyContent: 'center',
                                    color: active ? '#4c9aff' : 'text.secondary',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    color: active ? '#4c9aff' : 'text.primary',
                                }}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: active ? 500 : 400,
                                }}
                            />
                            {hasChildren && open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                    </Tooltip>
                </ListItem>

                {hasChildren && (
                    <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children!.map(child => renderMenuItem(child, true))}
                        </List>
                    </Collapse>
                )}
            </Box>
        )
    }

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                    boxSizing: 'border-box',
                    backgroundColor: '#252931',
                    borderRight: '1px solid #383c44',
                    overflowX: 'hidden',
                    transition: theme =>
                        theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    px: open ? 2 : 1,
                    py: 2,
                    minHeight: 64,
                }}
            >
                {open && (
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: 'primary.light' }}>
                        MovePro
                    </Typography>
                )}
                <IconButton onClick={toggleDrawer} size="small" sx={{ color: 'text.secondary' }}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

            <Divider sx={{ borderColor: '#383c44' }} />

            {/* Main Menu */}
            <List sx={{ flexGrow: 1, pt: 1 }}>
                {MENU_ITEMS.map(item => renderMenuItem(item))}
            </List>

            <Divider sx={{ borderColor: '#383c44' }} />

            {/* Bottom Menu */}
            <List sx={{ pb: 2 }}>
                {BOTTOM_MENU.map(item => renderMenuItem(item))}
            </List>
        </Drawer>
    )
}

