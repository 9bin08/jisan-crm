import React from 'react';
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
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface StatsCardsProps {
    rowsCount: number;
    supplyTotal: number;
    taxTotal: number;
    totalPriceTotal: number;
}

// 개별 통계 카드 컴포넌트
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    trendText: string;
    trendColor: string;
    showCurrency?: boolean; // 통화 표시 여부
}

const StatCard = React.memo<StatCardProps>(({
    title,
    value,
    icon,
    iconBgColor,
    iconColor,
    trendText,
    trendColor,
    showCurrency = false
}) => {
    // 통화 표시 로직
    const displayValue = React.useMemo(() => {
        if (typeof value === 'number' && showCurrency) {
            return `₩${value.toLocaleString('ko-KR')}`;
        }
        return value;
    }, [value, showCurrency]);

    return (
        <Card sx={{
            bgcolor: COLORS.CARD_BACKGROUND,
            borderRadius: BORDER_RADIUS.LG,
            boxShadow: SHADOWS.SM,
            border: `1px solid ${COLORS.BORDER}`
        }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2" color={COLORS.GRAY[500]} gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color={COLORS.GRAY[800]}>
                            {displayValue}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={SPACING.XS} mt={SPACING.XS}>
                            <TrendingUpIcon sx={{ color: trendColor, fontSize: 16 }} />
                            <Typography variant="body2" color={trendColor}>
                                {trendText}
                            </Typography>
                        </Stack>
                    </Box>
                    <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: BORDER_RADIUS.MD,
                        bgcolor: iconBgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {React.cloneElement(icon as React.ReactElement<any>, { sx: { color: iconColor } })}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
});

StatCard.displayName = 'StatCard';

export const StatsCards = React.memo<StatsCardsProps>(({
    rowsCount,
    supplyTotal,
    taxTotal,
    totalPriceTotal
}) => {
    // 메모이제이션된 카드 데이터
    const cardData = React.useMemo(() => [
        {
            title: '총 운반 건수',
            value: rowsCount,
            icon: <HomeIcon />,
            iconBgColor: COLORS.SIDEBAR_ACTIVE_BG,
            iconColor: COLORS.PRIMARY,
            trendText: '+12% 이번 달',
            trendColor: COLORS.SUCCESS,
            showCurrency: false,
        },
        {
            title: '총 공급가액',
            value: supplyTotal,
            icon: <TrendingUpIcon />,
            iconBgColor: COLORS.STATS_SUCCESS_BG,
            iconColor: COLORS.SUCCESS,
            trendText: '+8% 이번 달',
            trendColor: COLORS.SUCCESS,
            showCurrency: true,
        },
        {
            title: '총 세액',
            value: taxTotal,
            icon: <TrendingUpIcon />,
            iconBgColor: COLORS.STATS_WARNING_BG,
            iconColor: COLORS.WARNING,
            trendText: '+8% 이번 달',
            trendColor: COLORS.SUCCESS,
            showCurrency: true,
        },
        {
            title: '총 합계금액',
            value: totalPriceTotal,
            icon: <TrendingUpIcon />,
            iconBgColor: COLORS.STATS_ERROR_BG,
            iconColor: COLORS.ERROR,
            trendText: '+8% 이번 달',
            trendColor: COLORS.SUCCESS,
            showCurrency: true,
        },
    ], [rowsCount, supplyTotal, taxTotal, totalPriceTotal]);

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
            },
            gap: SPACING.LG
        }}>
            {cardData.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </Box>
    );
});

StatsCards.displayName = 'StatsCards';