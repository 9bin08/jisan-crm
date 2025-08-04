import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Stack,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export function Sidebar({ open }: SidebarProps) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
                flexShrink: 0,
                transition: 'width 0.3s ease',
                '& .MuiDrawer-paper': {
                    width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: '#fff',
                    borderRight: '1px solid #e5e7eb',
                    transition: 'width 0.3s ease',
                    overflow: 'hidden',
                },
            }}
        >
            <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb', minHeight: 64 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        지
                    </Box>
                    {open && (
                        <Typography variant="h6" fontWeight={700} color="#1f2937" sx={{ whiteSpace: 'nowrap' }}>
                            지산CRM
                        </Typography>
                    )}
                </Stack>
            </Box>

            <Box sx={{ p: 2 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                bgcolor: '#eff6ff',
                                color: '#3b82f6',
                                '&:hover': {
                                    bgcolor: '#dbeafe',
                                },
                                justifyContent: open ? 'flex-start' : 'center',
                                minHeight: 48,
                            }}
                        >
                            <ListItemIcon sx={{
                                color: 'inherit',
                                minWidth: open ? 40 : 'auto'
                            }}>
                                <HomeIcon />
                            </ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary="홈"
                                    primaryTypographyProps={{
                                        fontSize: '14px',
                                        fontWeight: 600
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}