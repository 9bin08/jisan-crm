import { useState, useCallback, useEffect, useMemo } from 'react';
import type { TransportRow } from '../types';
import { useTransportMonth, useTransportRows, useSaveTransportMonth, useSaveTransportRows } from './queries/useTransportQueries';
import { logger } from '../utils/logger';
import { DEFAULT_ROW, CONTEXT_MESSAGES } from '../constants';

export function useTransportData(selectedMonth: number, months: string[]) {
    const [monthRows, setMonthRows] = useState<{ [idx: number]: TransportRow[] }>({});

    const currentMonthLabel = months[selectedMonth] || null;

    // TanStack Query hooks
    const { data: monthData, isLoading: isMonthLoading } = useTransportMonth(currentMonthLabel);
    const { data: serverRows = [], isLoading: isRowsLoading } = useTransportRows(monthData?.id || null);
    const saveMonthMutation = useSaveTransportMonth();
    const saveRowsMutation = useSaveTransportRows();

    // 현재 월의 행 데이터를 메모이제이션
    const currentRows = useMemo(() => {
        return monthRows[selectedMonth] || [];
    }, [monthRows, selectedMonth]);

    // 서버 데이터를 로컬 상태와 동기화
    useEffect(() => {
        if (serverRows.length > 0) {
            setMonthRows(prev => ({
                ...prev,
                [selectedMonth]: serverRows
            }));
        }
    }, [serverRows, selectedMonth]);

    // 행 데이터 변경
    const updateRow = useCallback((idx: number, field: keyof TransportRow, value: string) => {
        setMonthRows(prev => {
            const updated = [...(prev[selectedMonth] || [])];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, [selectedMonth]: updated };
        });
    }, [selectedMonth]);

    // 새 행 추가
    const addRow = useCallback(() => {
        setMonthRows(prev => {
            const updated = [...(prev[selectedMonth] || []), DEFAULT_ROW];
            return { ...prev, [selectedMonth]: updated };
        });
    }, [selectedMonth]);

    // 행 삭제
    const deleteRow = useCallback((idx: number) => {
        setMonthRows(prev => {
            const updated = [...(prev[selectedMonth] || [])];
            updated.splice(idx, 1);
            return { ...prev, [selectedMonth]: updated };
        });
    }, [selectedMonth]);

    // 데이터 저장 - 의존성 최적화
    const saveData = useCallback(async (monthLabel: string, company: string, contact: string, regNo: string) => {
        try {
            if (monthData) {
                // 기존 월이 있는 경우 행 데이터만 저장
                await saveRowsMutation.mutateAsync({
                    monthId: monthData.id,
                    rows: currentRows
                });
            } else {
                // 새로운 월인 경우 월과 행 데이터 모두 저장
                await saveMonthMutation.mutateAsync({
                    monthLabel,
                    company,
                    contact,
                    regNo,
                    rows: currentRows
                });
            }

            return true;
        } catch (err) {
            logger.errorWithError(err, CONTEXT_MESSAGES.DATA_SAVE);
            return false;
        }
    }, [monthData, currentRows, saveMonthMutation, saveRowsMutation]);

    // 엑셀 데이터로 업데이트
    const updateFromExcel = useCallback((rows: TransportRow[]) => {
        setMonthRows(prev => ({ ...prev, [selectedMonth]: rows }));
    }, [selectedMonth]);

    // 행 순서 변경
    const updateRows = useCallback((newRows: TransportRow[]) => {
        setMonthRows(prev => ({ ...prev, [selectedMonth]: newRows }));
    }, [selectedMonth]);

    return {
        monthRows,
        currentRows,
        isLoading: isMonthLoading || isRowsLoading,
        error: null, // TanStack Query에서 에러 처리
        updateRow,
        addRow,
        deleteRow,
        saveData,
        updateFromExcel,
        updateRows,
    };
}