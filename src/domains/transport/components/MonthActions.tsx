import React, { useState } from 'react';
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
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

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

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };

    return (
        <>
            <Stack
                direction="row"
                spacing={SPACING.MD}
                justifyContent="flex-end"
                alignItems="center"
                role="toolbar"
                aria-label="월 관리 도구"
            >
                <Button
                    onClick={onAddMonth}
                    onKeyDown={(e) => handleKeyDown(e, onAddMonth)}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    disabled={isLoading}
                    aria-label="새 월 추가"
                    sx={{
                        borderRadius: BORDER_RADIUS.MD,
                        borderColor: COLORS.PRIMARY,
                        color: COLORS.PRIMARY,
                        '&:hover': {
                            borderColor: COLORS.PRIMARY_HOVER,
                            bgcolor: COLORS.SIDEBAR_ACTIVE_BG,
                        },
                        '&:disabled': {
                            borderColor: COLORS.GRAY[300],
                            color: COLORS.GRAY[300],
                        },
                        '&:focus-visible': {
                            outline: `2px solid ${COLORS.PRIMARY}`,
                            outlineOffset: '2px',
                        },
                    }}
                >
                    월 추가
                </Button>
                <IconButton
                    onClick={() => handleDeleteClick(currentMonth)}
                    onKeyDown={(e) => handleKeyDown(e, () => handleDeleteClick(currentMonth))}
                    disabled={isLoading || !currentMonth}
                    aria-label={`${currentMonth} 월 삭제`}
                    aria-describedby="delete-month-description"
                    sx={{
                        color: COLORS.ERROR,
                        '&:hover': {
                            bgcolor: COLORS.STATS_ERROR_BG,
                        },
                        '&:disabled': {
                            color: COLORS.GRAY[300],
                        },
                        '&:focus-visible': {
                            outline: `2px solid ${COLORS.ERROR}`,
                            outlineOffset: '2px',
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
                <Typography
                    id="delete-month-description"
                    variant="caption"
                    color={COLORS.GRAY[500]}
                    sx={{ display: 'none' }}
                >
                    월 삭제 버튼입니다. 클릭하면 삭제 확인 다이얼로그가 열립니다.
                </Typography>
            </Stack>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="sm"
                fullWidth
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
                    월 삭제 확인
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }} role="alert">
                        이 작업은 되돌릴 수 없습니다.
                    </Alert>
                    <Typography id="delete-dialog-description">
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
                        onKeyDown={(e) => handleKeyDown(e, handleDeleteCancel)}
                        variant="outlined"
                        aria-label="삭제 취소"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            borderColor: COLORS.GRAY[500],
                            color: COLORS.GRAY[500],
                            '&:hover': {
                                borderColor: COLORS.GRAY[700],
                                bgcolor: COLORS.GRAY[50],
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.GRAY[500]}`,
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        onKeyDown={(e) => handleKeyDown(e, handleDeleteConfirm)}
                        variant="contained"
                        color="error"
                        aria-label="월 삭제 확인"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            bgcolor: COLORS.ERROR,
                            '&:hover': {
                                bgcolor: COLORS.ERROR_HOVER,
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.ERROR}`,
                                outlineOffset: '2px',
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