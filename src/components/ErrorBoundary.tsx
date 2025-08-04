import React, { Component, type ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
        this.props.onError?.(error, errorInfo);

        // 로깅 시스템에 에러 전송
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        bgcolor: '#f8fafc',
                        p: 3,
                    }}
                >
                    <Paper
                        elevation={2}
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            textAlign: 'center',
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ color: '#ef4444', fontWeight: 600 }}
                        >
                            오류가 발생했습니다
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
                        </Typography>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box
                                sx={{
                                    bgcolor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: 2,
                                    p: 2,
                                    mb: 3,
                                    textAlign: 'left',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    component="pre"
                                    sx={{
                                        color: '#dc2626',
                                        fontSize: '12px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {this.state.error.stack}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={this.handleRetry}
                            sx={{
                                borderRadius: 2,
                                bgcolor: '#3b82f6',
                                '&:hover': { bgcolor: '#2563eb' },
                            }}
                        >
                            다시 시도
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}