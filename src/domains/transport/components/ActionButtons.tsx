import React, { forwardRef } from 'react';
import {
    Card,
    CardContent,
    Stack,
    Button,
} from '@mui/material';
import {
    Save as SaveIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';

interface ActionButtonsProps {
    onSave: () => void;
    onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExcelDownload: () => void;
    onOpenPopover: () => void;
    onImageDownload: () => void;
}

export const ActionButtons = forwardRef<HTMLButtonElement, ActionButtonsProps>(({
    onSave,
    onExcelUpload,
    onExcelDownload,
    onOpenPopover,
    onImageDownload,
}, ref) => {
    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };

    return (
        <Card sx={{
            bgcolor: COLORS.CARD_BACKGROUND,
            borderRadius: BORDER_RADIUS.LG,
            boxShadow: SHADOWS.SM,
            border: `1px solid ${COLORS.BORDER}`
        }}>
            <CardContent>
                <Stack
                    direction="row"
                    spacing={SPACING.MD}
                    justifyContent="flex-end"
                    alignItems="center"
                    flexWrap="wrap"
                    role="toolbar"
                    aria-label="데이터 관리 도구"
                >
                    <Button
                        onClick={onSave}
                        onKeyDown={(e) => handleKeyDown(e, onSave)}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        aria-label="데이터 저장"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            bgcolor: COLORS.SUCCESS,
                            '&:hover': { bgcolor: COLORS.SUCCESS_HOVER },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.SUCCESS}`,
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        저장
                    </Button>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onKeyDown={(e) => handleKeyDown(e, () => e.currentTarget.click())}
                        aria-label="엑셀 파일 업로드"
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
                        엑셀 업로드
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            hidden
                            onChange={onExcelUpload}
                            aria-label="엑셀 파일 선택"
                        />
                    </Button>
                    <Button
                        onClick={onExcelDownload}
                        onKeyDown={(e) => handleKeyDown(e, onExcelDownload)}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        aria-label="현재 월 엑셀 다운로드"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            borderColor: COLORS.PRIMARY,
                            color: COLORS.PRIMARY,
                            '&:hover': {
                                borderColor: COLORS.PRIMARY_HOVER,
                                bgcolor: COLORS.SIDEBAR_ACTIVE_BG,
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.PRIMARY}`,
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        엑셀 다운로드
                    </Button>
                    <Button
                        ref={ref}
                        onClick={onOpenPopover}
                        onKeyDown={(e) => handleKeyDown(e, onOpenPopover)}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        aria-label="여러 월 통합 엑셀 다운로드"
                        aria-haspopup="true"
                        aria-expanded="false"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            borderColor: COLORS.PURPLE,
                            color: COLORS.PURPLE,
                            '&:hover': {
                                borderColor: COLORS.PURPLE_HOVER,
                                bgcolor: '#faf5ff',
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.PURPLE}`,
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        통합 다운로드
                    </Button>
                    <Button
                        onClick={onImageDownload}
                        onKeyDown={(e) => handleKeyDown(e, onImageDownload)}
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        aria-label="테이블 이미지 다운로드"
                        sx={{
                            borderRadius: BORDER_RADIUS.MD,
                            borderColor: COLORS.WARNING,
                            color: COLORS.WARNING,
                            '&:hover': {
                                borderColor: COLORS.WARNING_HOVER,
                                bgcolor: '#fffbeb',
                            },
                            '&:focus-visible': {
                                outline: `2px solid ${COLORS.WARNING}`,
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        이미지 다운로드
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
});

ActionButtons.displayName = 'ActionButtons';