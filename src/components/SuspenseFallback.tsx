import {
    Box,
    CircularProgress,
    Typography,
    Backdrop,
} from '@mui/material';

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
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    flexDirection: 'column',
                    gap: 2,
                }}
                open={true}
            >
                <CircularProgress color="inherit" size={40} />
                <Typography variant="h6" color="inherit" sx={{ fontWeight: 500 }}>
                    {message}
                </Typography>
            </Backdrop>
        );
    }

    return (
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
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1,
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {message}
            </Typography>
        </Box>
    );
}