import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transportKeys, monthKeys } from './queryKeys';
import { transportService } from '../../services/transportService';
import { logger } from '../../utils/logger';
import type { TransportRow } from '../../types';

// 월별 데이터 조회
export function useTransportMonth(monthLabel: string | null) {
    return useQuery({
        queryKey: transportKeys.month(monthLabel),
        queryFn: () => transportService.getTransportMonth(monthLabel),
        enabled: !!monthLabel,
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });
}

// 운반 행 데이터 조회
export function useTransportRows(monthId: string | null) {
    return useQuery({
        queryKey: transportKeys.rows(monthId),
        queryFn: () => transportService.getTransportRows(monthId!),
        enabled: !!monthId,
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });
}

// 여러 월의 데이터 조회 (통합 다운로드용)
export function useMultipleTransportMonths(monthLabels: string[]) {
    return useQuery({
        queryKey: transportKeys.multipleMonths(monthLabels),
        queryFn: async () => {
            console.log('useMultipleTransportMonths - 조회 시작:', monthLabels);

            const results = await Promise.all(
                monthLabels.map(async (monthLabel) => {
                    try {
                        console.log(`월 ${monthLabel} 데이터 조회 시작`);
                        const monthData = await transportService.getTransportMonth(monthLabel);
                        console.log(`월 ${monthLabel} monthData:`, monthData);

                        if (monthData) {
                            const rows = await transportService.getTransportRows(monthData.id);
                            console.log(`월 ${monthLabel} rows:`, rows?.length || 0);
                            return { monthLabel, monthData, rows };
                        } else {
                            console.log(`월 ${monthLabel} - monthData가 null`);
                            return { monthLabel, monthData: null, rows: [] };
                        }
                    } catch (error) {
                        console.error(`월 ${monthLabel} 데이터 조회 실패:`, error);
                        logger.errorWithError(error, `월 ${monthLabel} 데이터 조회`);
                        return { monthLabel, monthData: null, rows: [] };
                    }
                })
            );

            console.log('useMultipleTransportMonths - 조회 완료:', results);
            return results;
        },
        enabled: monthLabels.length > 0,
        staleTime: 1000 * 30, // 30초로 단축 (더 자주 새로고침)
        gcTime: 1000 * 60 * 5, // 5분으로 단축
        refetchOnWindowFocus: true, // 윈도우 포커스 시 재조회
        refetchOnMount: true, // 컴포넌트 마운트 시 재조회
    });
}

// 월별 데이터 저장 (새 월 생성)
export function useSaveTransportMonth() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            monthLabel,
            company,
            contact,
            regNo,
            rows
        }: {
            monthLabel: string;
            company: string;
            contact: string;
            regNo: string;
            rows: TransportRow[];
        }) => {
            // 월 데이터 저장
            const monthData = await transportService.saveTransportMonth(monthLabel, company, contact, regNo);

            // 행 데이터 저장
            if (rows.length > 0) {
                await transportService.saveTransportRows(monthData.id, rows);
            }

            return monthData;
        },
        onSuccess: (_, variables) => {
            // 관련 쿼리들 무효화
            queryClient.invalidateQueries({ queryKey: transportKeys.month(variables.monthLabel) });
            queryClient.invalidateQueries({ queryKey: monthKeys.lists() });
            // multipleMonths 쿼리들도 무효화 (새 월이 추가되었으므로)
            queryClient.invalidateQueries({ queryKey: transportKeys.months() });
            logger.info(`월 "${variables.monthLabel}" 데이터가 저장되었습니다.`);
        },
        onError: (error) => {
            logger.errorWithError(error, '운반 데이터 저장');
        },
    });
}

// 운반 행 데이터 저장 (기존 월 업데이트)
export function useSaveTransportRows() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            monthId,
            rows
        }: {
            monthId: string;
            rows: TransportRow[];
        }) => {
            return await transportService.saveTransportRows(monthId, rows);
        },
        onSuccess: (_, variables) => {
            // 관련 쿼리들 무효화
            queryClient.invalidateQueries({ queryKey: transportKeys.rows(variables.monthId) });
            // multipleMonths 쿼리들도 무효화 (데이터가 변경되었으므로)
            queryClient.invalidateQueries({ queryKey: transportKeys.months() });
            logger.info('운반 행 데이터가 저장되었습니다.');
        },
        onError: (err) => {
            logger.errorWithError(err, '운반 행 데이터 저장');
        },
    });
}