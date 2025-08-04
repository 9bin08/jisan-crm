import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
} from '@mui/material';

interface CompanyInfoProps {
    company: string;
    contact: string;
    regNo: string;
    onCompanyChange: (value: string) => void;
    onContactChange: (value: string) => void;
    onRegNoChange: (value: string) => void;
}

export function CompanyInfo({
    company,
    contact,
    regNo,
    onCompanyChange,
    onContactChange,
    onRegNoChange,
}: CompanyInfoProps) {
    return (
        <Card sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} color="#1f2937" gutterBottom>
                    회사 정보
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 3
                }}>
                    <TextField
                        label="회사명"
                        value={company}
                        onChange={e => onCompanyChange(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f9fafb',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="담당자"
                        value={contact}
                        onChange={e => onContactChange(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f9fafb',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                            },
                        }}
                    />
                    <TextField
                        label="등록번호"
                        value={regNo}
                        onChange={e => onRegNoChange(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f9fafb',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6',
                                },
                            },
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}