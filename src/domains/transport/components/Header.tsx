import {
    AppBar,
    Toolbar,
    Typography,
    Stack,
    IconButton,
    Avatar,
    Badge,
    Box,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

interface HeaderProps {
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: '#fff',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton
                        onClick={onToggleSidebar}
                        sx={{ color: '#6b7280' }}
                    >
                        {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="#1f2937">
                            운반내역서
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                            월별 운반표를 쉽고 빠르게 관리하세요
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton sx={{ color: '#6b7280' }}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#6b7280' }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>
                        <PersonIcon />
                    </Avatar>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}