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
    return (
        <Card sx={{
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
        }}>
            <CardContent>
                <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" flexWrap="wrap">
                    <Button
                        onClick={onSave}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                        }}
                    >
                        저장
                    </Button>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
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
                        엑셀 업로드
                        <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={onExcelUpload} />
                    </Button>
                    <Button
                        onClick={onExcelDownload}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{
                            borderRadius: 2,
                            borderColor: '#3b82f6',
                            color: '#3b82f6',
                            '&:hover': {
                                borderColor: '#2563eb',
                                bgcolor: '#eff6ff',
                            },
                        }}
                    >
                        엑셀 다운로드
                    </Button>
                    <Button
                        ref={ref}
                        onClick={onOpenPopover}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{
                            borderRadius: 2,
                            borderColor: '#8b5cf6',
                            color: '#8b5cf6',
                            '&:hover': {
                                borderColor: '#7c3aed',
                                bgcolor: '#faf5ff',
                            },
                        }}
                    >
                        통합 다운로드
                    </Button>
                    <Button
                        onClick={onImageDownload}
                        variant="outlined"
                        startIcon={<ImageIcon />}
                        sx={{
                            borderRadius: 2,
                            borderColor: '#f59e0b',
                            color: '#f59e0b',
                            '&:hover': {
                                borderColor: '#d97706',
                                bgcolor: '#fffbeb',
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