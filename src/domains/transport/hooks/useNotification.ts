import { useState, useCallback } from 'react';
import type { ErrorType } from './useErrorHandler';

export interface Notification {
    id: string;
    message: string;
    type: ErrorType;
    timestamp: number;
}

export function useNotification() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: ErrorType = 'info') => {
        const notification: Notification = {
            id: Date.now().toString(),
            message,
            type,
            timestamp: Date.now(),
        };

        setNotifications(prev => [...prev, notification]);

        // 자동 제거 (5초 후)
        setTimeout(() => {
            removeNotification(notification.id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const showSuccess = useCallback((message: string) => {
        addNotification(message, 'success');
    }, [addNotification]);

    const showError = useCallback((message: string) => {
        addNotification(message, 'error');
    }, [addNotification]);

    const showInfo = useCallback((message: string) => {
        addNotification(message, 'info');
    }, [addNotification]);

    return {
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
    };
}