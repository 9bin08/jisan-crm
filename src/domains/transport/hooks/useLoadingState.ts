import { useMemo } from 'react';

interface LoadingState {
    isMonthLoading: boolean;
    isDataLoading: boolean;
    isMultipleMonthsLoading: boolean;
    isSaving: boolean;
    isUploading: boolean;
    isDownloading: boolean;
}

export function useLoadingState(loadingState: LoadingState) {
    const {
        isMonthLoading,
        isDataLoading,
        isMultipleMonthsLoading,
        isSaving,
        isUploading,
        isDownloading,
    } = loadingState;

    // 전체 로딩 상태
    const isOverallLoading = useMemo(() => {
        return isMonthLoading || isDataLoading || isMultipleMonthsLoading || isSaving;
    }, [isMonthLoading, isDataLoading, isMultipleMonthsLoading, isSaving]);

    return {
        isOverallLoading,
    };
}