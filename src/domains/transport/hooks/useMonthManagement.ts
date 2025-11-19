import { useState, useCallback, useEffect, useRef } from 'react';
import { useMonthList, useAddMonth, useDeleteMonth } from './queries/useMonthQueries';
import { transportService } from '../services/transportService';

export function useMonthManagement() {
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [checkedMonths, setCheckedMonths] = useState<number[]>([]);
    const pendingNewMonth = useRef<string | null>(null);

    // TanStack Query hooks
    const { data: months = [], isLoading, error } = useMonthList();
    const addMonthMutation = useAddMonth();
    const deleteMonthMutation = useDeleteMonth();

    // 새로 추가된 월을 자동으로 선택
    useEffect(() => {
        if (pendingNewMonth.current && months.length > 0) {
            const newMonthIndex = months.findIndex(m => m === pendingNewMonth.current);
            if (newMonthIndex !== -1) {
                setSelectedMonth(newMonthIndex);
                setCheckedMonths(months.map((_, i) => i));
                pendingNewMonth.current = null;
            }
        }
    }, [months]);

    // 새로운 월 추가
    const addMonth = useCallback(async (company: string, contact: string, regNo: string) => {
        let newMonth: string;

        // 월 목록이 비어있으면 현재 년월을 첫 번째 월로 생성
        if (months.length === 0) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작
            newMonth = `${currentYear}년 ${currentMonth}월`;
        } else {
            // 기존 월이 있으면 마지막 월의 다음 월 생성
            const last = months[months.length - 1];
            const match = last?.match(/(\d+)년 (\d+)월/);

            if (!match) {
                throw new Error('월 추가 실패: 마지막 월 형식이 올바르지 않습니다');
            }

            const [, year, month] = match;
            const nextMonth = Number(month) === 12 ? 1 : Number(month) + 1;
            const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
            newMonth = `${nextYear}년 ${nextMonth}월`;
        }

        try {
            pendingNewMonth.current = newMonth;

            await addMonthMutation.mutateAsync({
                monthLabel: newMonth,
                company: company || null,
                contact: contact || null,
                regNo: regNo || null,
            });
        } catch (err) {
            pendingNewMonth.current = null;
            throw err; // 에러를 상위로 전달하여 UI에서 처리할 수 있도록
        }
    }, [months, addMonthMutation]);

    // 월 삭제
    const deleteMonth = useCallback(async (monthLabel: string) => {
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
    }, [checkedMonths.length, months]);

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