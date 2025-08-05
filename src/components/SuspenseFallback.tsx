import {
    Box,
    CircularProgress,
    Typography,
    Backdrop,
    Fade,
} from '@mui/material';
import { COLORS } from '../domains/transport/constants';

interface SuspenseFallbackProps {
    message?: string;
    fullScreen?: boolean;
}

export function SuspenseFallback({
    message = "데이터를 불러오는 중...",
    fullScreen = false
}: SuspenseFallbackProps) {
    if (fullScreen) {
        return (
            <Fade in={true} timeout={300}>
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 반투명 배경
                    }}
                    open={true}
                >
                    <CircularProgress color="inherit" size={40} />
                    <Typography variant="h6" color="inherit" sx={{ fontWeight: 500 }}>
                        {message}
                    </Typography>
                </Backdrop>
            </Fade>
        );
    }

    return (
        <Fade in={true} timeout={200}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 반투명 흰색 배경
                    backdropFilter: 'blur(2px)', // 블러 효과
                    zIndex: 1,
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={40} sx={{ color: COLORS.PRIMARY }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {message}
                </Typography>
            </Box>
        </Fade>
    );
}