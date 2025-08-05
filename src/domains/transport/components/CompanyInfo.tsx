import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
} from '@mui/material';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface CompanyInfoProps {
    company: string;
    contact: string;
    regNo: string;
    onCompanyChange: (value: string) => void;
    onContactChange: (value: string) => void;
    onRegNoChange: (value: string) => void;
}

// 개별 입력 필드 컴포넌트
interface CompanyFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const CompanyField = React.memo<CompanyFieldProps>(({ label, value, onChange, placeholder }) => (
    <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        size="small"
        aria-label={label}
        sx={{
            '& .MuiOutlinedInput-root': {
                borderRadius: BORDER_RADIUS.MD,
                bgcolor: COLORS.GRAY[50],
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.PRIMARY,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.PRIMARY,
                },
                '&:focus-visible': {
                    outline: `2px solid ${COLORS.PRIMARY}`,
                    outlineOffset: '2px',
                },
            },
        }}
    />
));

CompanyField.displayName = 'CompanyField';

export const CompanyInfo = React.memo<CompanyInfoProps>(({
    company,
    contact,
    regNo,
    onCompanyChange,
    onContactChange,
    onRegNoChange,
}) => {
    // 메모이제이션된 필드 데이터
    const fieldData = React.useMemo(() => [
        {
            label: '회사명',
            value: company,
            onChange: onCompanyChange,
            placeholder: '회사명을 입력하세요',
        },
        {
            label: '담당자',
            value: contact,
            onChange: onContactChange,
            placeholder: '담당자명을 입력하세요',
        },
        {
            label: '등록번호',
            value: regNo,
            onChange: onRegNoChange,
            placeholder: '사업자등록번호를 입력하세요',
        },
    ], [company, contact, regNo, onCompanyChange, onContactChange, onRegNoChange]);

    return (
        <Card sx={{
            bgcolor: COLORS.CARD_BACKGROUND,
            borderRadius: BORDER_RADIUS.LG,
            boxShadow: SHADOWS.SM,
            border: `1px solid ${COLORS.BORDER}`
        }}>
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight={600}
                    color={COLORS.GRAY[800]}
                    gutterBottom
                    id="company-info-title"
                >
                    회사 정보
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: SPACING.LG
                    }}
                    role="group"
                    aria-labelledby="company-info-title"
                >
                    {fieldData.map((field, index) => (
                        <CompanyField key={index} {...field} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
});

CompanyInfo.displayName = 'CompanyInfo';