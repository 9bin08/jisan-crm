import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import type { Notification } from '../hooks/useNotification';

interface NotificationStackProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

export function NotificationStack({ notifications, onClose }: NotificationStackProps) {
    return (
        <Box>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={5000}
                    onClose={() => onClose(notification.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{
                        bottom: `${(index + 1) * 80}px !important`,
                    }}
                >
                    <Alert
                        onClose={() => onClose(notification.id)}
                        severity={notification.type}
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </Box>
    );
}