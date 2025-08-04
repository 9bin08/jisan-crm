import { useState, useCallback } from 'react';
import { useMonthList, useAddMonth, useDeleteMonth } from './queries/useMonthQueries';
import { transportService } from '../services/transportService';

export function useMonthManagement() {
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [checkedMonths, setCheckedMonths] = useState<number[]>([]);

    // TanStack Query hooks
    const { data: months = [], isLoading, error } = useMonthList();
    const addMonthMutation = useAddMonth();
    const deleteMonthMutation = useDeleteMonth();

    // 새로운 월 추가
    const addMonth = useCallback(async (company: string, contact: string, regNo: string) => {
        const last = months[months.length - 1];
        const [year, month] = last.match(/(\d+)년 (\d+)월/)?.slice(1, 3) || [];
        if (!year || !month) return;

        const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
        const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
        const newMonth = `${nextYear}년 ${nextMonth}월`;

        try {
            await addMonthMutation.mutateAsync({
                monthLabel: newMonth,
                company: company || null,
                contact: contact || null,
                regNo: regNo || null,
            });

            // 새로 추가된 월을 선택
            const newMonthIndex = months.findIndex(m => m === newMonth);
            if (newMonthIndex !== -1) {
                setSelectedMonth(newMonthIndex);
                setCheckedMonths(months.map((_, i) => i));
            }

            console.log('새로운 월이 서버에 저장되었습니다:', newMonth);
        } catch (err) {
            console.error('새로운 월 저장 실패:', err);
            // 실패 시 로컬에만 추가 (fallback)
            const updatedMonths = [...months, newMonth];
            setSelectedMonth(updatedMonths.length - 1);
            setCheckedMonths(updatedMonths.map((_, i) => i));
        }
    }, [months, addMonthMutation]);

    // 월 삭제
    const deleteMonth = useCallback(async (monthLabel: string) => {
        try {
            // 먼저 월 데이터를 조회하여 ID를 얻습니다
            const monthData = await transportService.getTransportMonth(monthLabel);

            if (monthData) {
                await deleteMonthMutation.mutateAsync(monthData.id);

                // 삭제된 월이 현재 선택된 월인 경우 다른 월을 선택
                const deletedIndex = months.findIndex(m => m === monthLabel);
                if (deletedIndex === selectedMonth) {
                    const newSelectedMonth = Math.max(0, selectedMonth - 1);
                    setSelectedMonth(newSelectedMonth);
                }

                // 체크된 월 목록에서도 제거
                setCheckedMonths(prev => prev.filter(i => months[i] !== monthLabel));

                console.log('월이 성공적으로 삭제되었습니다:', monthLabel);
            }
        } catch (err) {
            console.error('월 삭제 실패:', err);
            throw err;
        }
    }, [months, selectedMonth, deleteMonthMutation]);

    // 월 선택 변경
    const selectMonth = useCallback((index: number) => {
        setSelectedMonth(index);
    }, []);

    // 월 체크 토글
    const toggleMonth = useCallback((idx: number) => {
        setCheckedMonths(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    }, []);

    // 전체 월 체크 토글
    const toggleAllMonths = useCallback(() => {
        if (checkedMonths.length === months.length) {
            setCheckedMonths([]);
        } else {
            setCheckedMonths(months.map((_, i) => i));
        }
    }, [checkedMonths.length, months.length]);

    return {
        months,
        selectedMonth,
        checkedMonths,
        isLoading: isLoading || addMonthMutation.isPending || deleteMonthMutation.isPending,
        error,
        addMonth,
        deleteMonth,
        selectMonth,
        toggleMonth,
        toggleAllMonths,
    };
}