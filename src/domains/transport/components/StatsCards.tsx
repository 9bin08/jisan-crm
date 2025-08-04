import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
} from '@mui/material';
import {
    Home as HomeIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface StatsCardsProps {
    rowsCount: number;
    supplyTotal: number;
    taxTotal: number;
    totalPriceTotal: number;
}

export function StatsCards({ rowsCount, supplyTotal, taxTotal, totalPriceTotal }: StatsCardsProps) {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
            },
            gap: 3
        }}>
            <Card sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="body2" color="#6b7280" gutterBottom>
                                총 운반 건수
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="#1f2937">
                                {rowsCount}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                                <Typography variant="body2" color="#10b981">
                                    +12% 이번 달
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <HomeIcon sx={{ color: '#3b82f6' }} />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="body2" color="#6b7280" gutterBottom>
                                총 공급가액
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="#1f2937">
                                ₩{supplyTotal.toLocaleString('ko-KR')}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                                <Typography variant="body2" color="#10b981">
                                    +8% 이번 달
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#f0fdf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUpIcon sx={{ color: '#10b981' }} />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="body2" color="#6b7280" gutterBottom>
                                총 세액
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="#1f2937">
                                ₩{taxTotal.toLocaleString('ko-KR')}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                                <Typography variant="body2" color="#10b981">
                                    +8% 이번 달
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#fef3c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUpIcon sx={{ color: '#f59e0b' }} />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{
                bgcolor: '#fff',
                borderRadius: 3,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="body2" color="#6b7280" gutterBottom>
                                총 합계금액
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="#1f2937">
                                ₩{totalPriceTotal.toLocaleString('ko-KR')}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16 }} />
                                <Typography variant="body2" color="#10b981">
                                    +8% 이번 달
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#fef2f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TrendingUpIcon sx={{ color: '#ef4444' }} />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}