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
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { COLORS, SPACING } from '../constants';

export function Header() {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: COLORS.CARD_BACKGROUND,
                borderBottom: `1px solid ${COLORS.BORDER}`,
                flexShrink: 0
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color={COLORS.GRAY[800]}>
                        운반내역서
                    </Typography>
                    <Typography variant="body2" color={COLORS.GRAY[500]}>
                        월별 운반표를 쉽고 빠르게 관리하세요
                    </Typography>
                </Box>

                <Stack direction="row" spacing={SPACING.MD} alignItems="center">
                    <IconButton sx={{ color: COLORS.GRAY[500] }}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton sx={{ color: COLORS.GRAY[500] }}>
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Avatar sx={{ bgcolor: COLORS.PRIMARY, width: 40, height: 40 }}>
                        <PersonIcon />
                    </Avatar>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}