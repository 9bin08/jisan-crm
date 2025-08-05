import { useCallback } from 'react';
import { logger } from '../utils/logger';

export type ErrorType = 'success' | 'error' | 'warning' | 'info';

export interface ErrorMessage {
    message: string;
    type: ErrorType;
    context?: string;
}

// 에러 객체 타입 정의
interface ErrorWithMessage {
    message: string;
    [key: string]: unknown;
}

// 에러 타입 가드 함수들
const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
    return (
        error !== null &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
};

const isNetworkError = (error: unknown): error is Error => {
    return error instanceof Error && (
        error.message.includes('fetch') ||
        error.message.includes('timeout') ||
        error.message.includes('network') ||
        error.message.includes('connection')
    );
};

export function useErrorHandler() {
    const handleError = useCallback((error: unknown, context: string): ErrorMessage => {
        logger.errorWithError(error, context);

        let message = '알 수 없는 오류가 발생했습니다.';

        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        } else if (isErrorWithMessage(error)) {
            message = error.message;
        }

        return {
            message: `${context}: ${message}`,
            type: 'error',
            context,
        };
    }, []);

    const handleNetworkError = useCallback((error: unknown, context: string): ErrorMessage => {
        logger.errorWithError(error, `${context} 네트워크 에러`);

        let message = '네트워크 연결을 확인해주세요.';

        if (isNetworkError(error)) {
            if (error.message.includes('fetch')) {
                message = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
            } else if (error.message.includes('timeout')) {
                message = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
            } else {
                message = error.message;
            }
        }

        return {
            message: `${context}: ${message}`,
            type: 'error',
            context,
        };
    }, []);

    return {
        handleError,
        handleNetworkError,
    };
}