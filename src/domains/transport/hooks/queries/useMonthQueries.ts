import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monthKeys } from './queryKeys';
import { transportService } from '../../services/transportService';
import { logger } from '../../utils/logger';

// 월 목록 조회 - 로딩 상태를 제대로 처리
export function useMonthList() {
    return useQuery({
        queryKey: monthKeys.lists(),
        queryFn: transportService.getMonthList,
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });
}

// 월 추가
export function useAddMonth() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            monthLabel,
            company,
            contact,
            regNo
        }: {
            monthLabel: string;
            company: string | null;
            contact: string | null;
            regNo: string | null;
        }) => {
            return await transportService.saveTransportMonth(monthLabel, company, contact, regNo);
        },
        onSuccess: () => {
            // 월 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: monthKeys.lists() });
            logger.info('새로운 월이 추가되었습니다.');
        },
        onError: (error) => {
            logger.errorWithError(error, '월 추가');
        },
    });
}

// 월 삭제
export function useDeleteMonth() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (monthId: string) => {
            return await transportService.deleteTransportMonth(monthId);
        },
        onSuccess: (_, monthId) => {
            // 월 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: monthKeys.lists() });
            logger.info(`월 ID "${monthId}"이 삭제되었습니다.`);
        },
        onError: (error) => {
            logger.errorWithError(error, '월 삭제');
        },
    });
}