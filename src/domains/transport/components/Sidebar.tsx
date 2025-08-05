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
    IconButton,
} from '@mui/material';
import {
    Home as HomeIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, BORDER_RADIUS, SIDEBAR } from '../constants';

interface SidebarProps {
    open: boolean;
    onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? SIDEBAR.DRAWER_WIDTH : SIDEBAR.COLLAPSED_DRAWER_WIDTH,
                flexShrink: 0,
                transition: SIDEBAR.TRANSITION_DURATION,
                '& .MuiDrawer-paper': {
                    width: open ? SIDEBAR.DRAWER_WIDTH : SIDEBAR.COLLAPSED_DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: COLORS.CARD_BACKGROUND,
                    borderRight: `1px solid ${COLORS.BORDER}`,
                    transition: SIDEBAR.TRANSITION_DURATION,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* 헤더 영역 */}
            <Box sx={{
                p: SPACING.LG,
                borderBottom: `1px solid ${COLORS.BORDER}`,
                minHeight: SIDEBAR.HEADER_MIN_HEIGHT,
                flexShrink: 0
            }}>
                <Stack direction="row" alignItems="center" spacing={SPACING.XS}>
                    <Box sx={{
                        width: SIDEBAR.LOGO_SIZE,
                        height: SIDEBAR.LOGO_SIZE,
                        borderRadius: '50%',
                        bgcolor: COLORS.PRIMARY,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: SIDEBAR.LOGO_FONT_SIZE,
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        지
                    </Box>
                    {open && (
                        <Typography variant="h6" fontWeight={700} color={COLORS.GRAY[800]} sx={{ whiteSpace: 'nowrap' }}>
                            지산CRM
                        </Typography>
                    )}
                </Stack>
            </Box>

            {/* 메뉴 영역 - flex-grow로 남은 공간 차지 */}
            <Box sx={{ p: SPACING.MD, flexGrow: 1, overflow: 'auto' }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: BORDER_RADIUS.MD,
                                mb: SPACING.XS,
                                bgcolor: COLORS.SIDEBAR_ACTIVE_BG,
                                color: COLORS.PRIMARY,
                                '&:hover': {
                                    bgcolor: COLORS.SIDEBAR_ACTIVE_HOVER,
                                },
                                justifyContent: open ? 'flex-start' : 'center',
                                minHeight: SIDEBAR.MENU_ITEM_MIN_HEIGHT,
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

            {/* 하단 토글 버튼 영역 */}
            <Box sx={{
                p: SPACING.MD,
                borderTop: `1px solid ${COLORS.BORDER}`,
                flexShrink: 0,
                display: 'flex',
                justifyContent: open ? 'flex-end' : 'center'
            }}>
                <IconButton
                    onClick={onToggle}
                    sx={{
                        bgcolor: COLORS.GRAY[100],
                        color: COLORS.GRAY[600],
                        '&:hover': {
                            bgcolor: COLORS.GRAY[200],
                        },
                        borderRadius: BORDER_RADIUS.MD,
                        width: SIDEBAR.TOGGLE_BUTTON_SIZE,
                        height: SIDEBAR.TOGGLE_BUTTON_SIZE,
                    }}
                    aria-label={open ? '사이드바 접기' : '사이드바 펼치기'}
                >
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </Box>
        </Drawer>
    );
}