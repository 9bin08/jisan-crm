import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

interface MonthTabsProps {
    months: string[];
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function MonthTabs({ months, value, onChange }: MonthTabsProps) {
    return (
        <Box sx={{
            width: '100%',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
                height: '6px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f5f9',
                borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: '3px',
                '&:hover': {
                    background: '#94a3b8',
                },
            },
        }}>
            <Tabs
                value={value}
                onChange={onChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    minHeight: 48,
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                        bgcolor: '#3b82f6',
                    },
                    '& .MuiTabs-scrollButtons': {
                        color: '#6b7280',
                        '&.Mui-disabled': {
                            opacity: 0.3,
                        },
                    },
                }}
            >
                {months.map((month, index) => (
                    <Tab
                        key={month}
                        label={month}
                        sx={{
                            minWidth: 120,
                            px: 3,
                            py: 1.5,
                            fontSize: '14px',
                            fontWeight: value === index ? 600 : 400,
                            color: value === index ? '#3b82f6' : '#6b7280',
                            textTransform: 'none',
                            borderRadius: '8px 8px 0 0',
                            '&:hover': {
                                color: value === index ? '#3b82f6' : '#374151',
                                bgcolor: value === index ? '#eff6ff' : '#f9fafb',
                            },
                            '&.Mui-selected': {
                                color: '#3b82f6',
                                bgcolor: '#eff6ff',
                            },
                        }}
                    />
                ))}
            </Tabs>
        </Box>
    );
}