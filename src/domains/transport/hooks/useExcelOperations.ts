import { useCallback } from 'react';
import type { TransportRow } from '../types';
import { downloadStyledExcel, parseExcelToRows, downloadAllMonthsExcel } from '../utils/excel';

export function useExcelOperations() {
    // 단일 월 엑셀 다운로드
    const downloadExcel = useCallback(async (
        rows: TransportRow[],
        meta: { company: string; contact: string; regNo: string; monthLabel: string }
    ) => {
        try {
            await downloadStyledExcel(rows, meta);
            return true;
        } catch (err) {
            console.error('엑셀 다운로드 실패:', err);
            return false;
        }
    }, []);

    // 통합 엑셀 다운로드
    const downloadAllExcel = useCallback(async (
        months: { month: string; rows: TransportRow[]; meta: { company: string; contact: string; regNo: string } }[]
    ) => {
        try {
            await downloadAllMonthsExcel(months);
            return true;
        } catch (err) {
            console.error('통합 엑셀 다운로드 실패:', err);
            return false;
        }
    }, []);

    // 엑셀 파일 업로드 및 파싱
    const uploadExcel = useCallback(async (file: File): Promise<TransportRow[]> => {
        try {
            const rows = await parseExcelToRows(file);
            return rows;
        } catch (err) {
            console.error('엑셀 업로드 실패:', err);
            throw err;
        }
    }, []);

    return {
        downloadExcel,
        downloadAllExcel,
        uploadExcel,
    };
}