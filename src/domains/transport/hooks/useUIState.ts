import { useState, useCallback } from 'react';

export function useUIState() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const openPopover = useCallback(() => {
        setPopoverOpen(true);
    }, []);

    const closePopover = useCallback(() => {
        setPopoverOpen(false);
    }, []);

    return {
        sidebarOpen,
        popoverOpen,
        toggleSidebar,
        openPopover,
        closePopover,

    };
}