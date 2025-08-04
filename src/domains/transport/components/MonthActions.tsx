import { useState } from 'react';
import {
    Stack,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

interface MonthActionsProps {
    onAddMonth: () => void;
    onDeleteMonth: (monthLabel: string) => void;
    currentMonth: string;
    isLoading?: boolean;
}

export function MonthActions({ onAddMonth, onDeleteMonth, currentMonth, isLoading }: MonthActionsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [monthToDelete, setMonthToDelete] = useState<string>('');

    const handleDeleteClick = (monthLabel: string) => {
        setMonthToDelete(monthLabel);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        onDeleteMonth(monthToDelete);
        setDeleteDialogOpen(false);
        setMonthToDelete('');
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setMonthToDelete('');
    };

    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
                <Button
                    onClick={onAddMonth}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    disabled={isLoading}
                    sx={{
                        borderRadius: 2,
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                        '&:hover': {
                            borderColor: '#2563eb',
                            bgcolor: '#eff6ff',
                        },
                        '&:disabled': {
                            borderColor: '#d1d5db',
                            color: '#d1d5db',
                        },
                    }}
                >
                    월 추가
                </Button>
                <IconButton
                    onClick={() => handleDeleteClick(currentMonth)}
                    disabled={isLoading || !currentMonth}
                    sx={{
                        color: '#ef4444',
                        '&:hover': {
                            bgcolor: '#fef2f2',
                        },
                        '&:disabled': {
                            color: '#d1d5db',
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    월 삭제 확인
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        이 작업은 되돌릴 수 없습니다.
                    </Alert>
                    <Typography>
                        <strong>{monthToDelete}</strong> 월과 관련된 모든 데이터를 삭제하시겠습니까?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        • 해당 월의 모든 운반 내역이 삭제됩니다
                        • 삭제된 데이터는 복구할 수 없습니다
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: '#6b7280',
                            color: '#6b7280',
                            '&:hover': {
                                borderColor: '#374151',
                                bgcolor: '#f9fafb',
                            },
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ef4444',
                            '&:hover': {
                                bgcolor: '#dc2626',
                            },
                        }}
                    >
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}