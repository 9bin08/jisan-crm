import { supabase } from '../../../lib/supabase';
import type { TransportRow } from '../types';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES, SERVICE } from '../constants';

// 타입 정의
interface MonthData {
    id: string;
    month_label: string | null;
    company: string | null;
    contact: string | null;
    reg_no: string | null;
    created_at: string;
    updated_at: string;
}

interface RowData {
    id: string;
    month_id: string;
    date: string | null;
    car_number: string | null;
    company: string | null;
    destination: string | null;
    item: string | null;
    weight: string | null;
    count: string | null;
    unit_price: string | null;
    supply_price: string | null;
    tax: string | null;
    total_price: string | null;
    row_order: number;
    created_at: string;
    updated_at: string;
}

// 유틸리티 함수들
const createError = (message: string, originalError?: any): Error => {
    const error = new Error(message);
    if (originalError) {
        logger.errorWithError(message, originalError);
    }
    return error;
};

const handleSupabaseError = (error: any, context: string): never => {
    const errorMessage = `${context}: ${error.message}`;
    logger.errorWithError(errorMessage, error);
    throw createError(errorMessage, error);
};

const sortMonthsByYearAndMonth = (months: string[]): string[] => {
    return months.sort((a, b) => {
        const aMatch = a.match(SERVICE.MONTH_SORT_REGEX);
        const bMatch = b.match(SERVICE.MONTH_SORT_REGEX);

        if (!aMatch || !bMatch) return 0;

        const aYear = parseInt(aMatch[1]);
        const aMonth = parseInt(aMatch[2]);
        const bYear = parseInt(bMatch[1]);
        const bMonth = parseInt(bMatch[2]);

        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
    });
};

// 월별 데이터 관련 함수들
export async function saveTransportMonth(
    monthLabel: string | null,
    company: string | null,
    contact: string | null,
    regNo: string | null
): Promise<MonthData> {
    try {
        logger.info('월별 데이터 저장 시작', JSON.stringify({ monthLabel, company, contact, regNo }));

        const { data, error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_MONTHS)
            .insert({
                month_label: monthLabel || SERVICE.DEFAULTS.NULL_VALUE,
                company: company || SERVICE.DEFAULTS.NULL_VALUE,
                contact: contact || SERVICE.DEFAULTS.NULL_VALUE,
                reg_no: regNo || SERVICE.DEFAULTS.NULL_VALUE,
            })
            .select()
            .single();

        if (error) {
            handleSupabaseError(error, ERROR_MESSAGES.MONTH_SAVE_FAILED);
        }

        logger.info('월별 데이터 저장 완료', JSON.stringify({ monthId: data.id }));
        return data;
    } catch (error) {
        return handleSupabaseError(error, ERROR_MESSAGES.MONTH_SAVE_FAILED);
    }
}

export async function getTransportMonth(monthLabel: string | null): Promise<MonthData | null> {
    try {
        logger.info('월별 데이터 조회 시작', JSON.stringify({ monthLabel }));

        if (!monthLabel) {
            logger.info('month_label이 null이므로 조회를 건너뜁니다');
            return null;
        }

        const { data, error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_MONTHS)
            .select('*')
            .eq('month_label', monthLabel)
            .single();

        if (error && error.code !== 'PGRST116') {
            handleSupabaseError(error, ERROR_MESSAGES.MONTH_LOAD_FAILED);
        }

        logger.info('월별 데이터 조회 완료', JSON.stringify({ data }));
        return data;
    } catch (error) {
        return handleSupabaseError(error, ERROR_MESSAGES.MONTH_LOAD_FAILED);
    }
}

export async function getAllTransportMonths(): Promise<MonthData[]> {
    try {
        logger.info('모든 월별 데이터 조회 시작');

        const { data, error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_MONTHS)
            .select('*')
            .order(SERVICE.ORDER.CREATED_AT_DESC.column, {
                ascending: SERVICE.ORDER.CREATED_AT_DESC.ascending
            });

        if (error) {
            handleSupabaseError(error, ERROR_MESSAGES.MONTH_LOAD_FAILED);
        }

        logger.info('모든 월별 데이터 조회 완료', JSON.stringify({ count: data?.length }));
        return data || [];
    } catch (error) {
        return handleSupabaseError(error, ERROR_MESSAGES.MONTH_LOAD_FAILED);
    }
}

export async function deleteTransportMonth(monthId: string): Promise<void> {
    try {
        logger.info('월별 데이터 삭제 시작', JSON.stringify({ monthId }));

        // 먼저 관련된 행 데이터 삭제
        const { error: rowsError } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_ROWS)
            .delete()
            .eq('month_id', monthId);

        if (rowsError) {
            handleSupabaseError(rowsError, ERROR_MESSAGES.ROWS_DELETE_FAILED);
        }

        // 월별 데이터 삭제
        const { error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_MONTHS)
            .delete()
            .eq('id', monthId);

        if (error) {
            handleSupabaseError(error, ERROR_MESSAGES.MONTH_DELETE_FAILED_SERVICE);
        }

        logger.info('월별 데이터 삭제 완료', JSON.stringify({ monthId }));
    } catch (error) {
        handleSupabaseError(error, ERROR_MESSAGES.MONTH_DELETE_FAILED_SERVICE);
    }
}

// 운반 행 데이터 관련 함수들
export async function saveTransportRows(monthId: string, rows: TransportRow[]): Promise<RowData[]> {
    try {
        logger.info('운반 행 데이터 저장 시작', JSON.stringify({ monthId, rowCount: rows.length }));

        // 기존 데이터 삭제
        const { error: deleteError } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_ROWS)
            .delete()
            .eq('month_id', monthId);

        if (deleteError) {
            handleSupabaseError(deleteError, ERROR_MESSAGES.ROWS_DELETE_FAILED);
        }

        // 새 데이터 삽입 (null 값 안전 처리)
        const rowsToInsert = rows.map((row, index) => ({
            month_id: monthId,
            date: row.date || SERVICE.DEFAULTS.NULL_VALUE,
            car_number: row.carNumber || SERVICE.DEFAULTS.NULL_VALUE,
            company: row.company || SERVICE.DEFAULTS.NULL_VALUE,
            destination: row.destination || SERVICE.DEFAULTS.NULL_VALUE,
            item: row.item || SERVICE.DEFAULTS.NULL_VALUE,
            weight: row.weight || SERVICE.DEFAULTS.NULL_VALUE,
            count: row.count || SERVICE.DEFAULTS.NULL_VALUE,
            unit_price: row.unitPrice || SERVICE.DEFAULTS.NULL_VALUE,
            supply_price: row.supplyPrice || SERVICE.DEFAULTS.NULL_VALUE,
            tax: row.tax || SERVICE.DEFAULTS.NULL_VALUE,
            total_price: row.totalPrice || SERVICE.DEFAULTS.NULL_VALUE,
            row_order: index,
        }));

        const { data, error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_ROWS)
            .insert(rowsToInsert)
            .select();

        if (error) {
            handleSupabaseError(error, ERROR_MESSAGES.ROWS_SAVE_FAILED);
        }

        logger.info('운반 행 데이터 저장 완료', JSON.stringify({ monthId, savedCount: data?.length }));
        return data || [];
    } catch (error) {
        return handleSupabaseError(error, ERROR_MESSAGES.ROWS_SAVE_FAILED);
    }
}

export async function getTransportRows(monthId: string): Promise<TransportRow[]> {
    try {
        logger.info('운반 행 데이터 조회 시작', JSON.stringify({ monthId }));

        const { data, error } = await supabase
            .from(SERVICE.TABLES.TRANSPORT_ROWS)
            .select('*')
            .eq('month_id', monthId)
            .order(SERVICE.ORDER.ROW_ORDER_ASC.column, {
                ascending: SERVICE.ORDER.ROW_ORDER_ASC.ascending
            });

        if (error) {
            handleSupabaseError(error, ERROR_MESSAGES.ROWS_LOAD_FAILED);
        }

        const transportRows = (data || []).map((row: RowData) => ({
            date: row.date || SERVICE.DEFAULTS.EMPTY_STRING,
            carNumber: row.car_number || SERVICE.DEFAULTS.EMPTY_STRING,
            company: row.company || SERVICE.DEFAULTS.EMPTY_STRING,
            destination: row.destination || SERVICE.DEFAULTS.EMPTY_STRING,
            item: row.item || SERVICE.DEFAULTS.EMPTY_STRING,
            weight: row.weight || SERVICE.DEFAULTS.EMPTY_STRING,
            count: row.count || SERVICE.DEFAULTS.EMPTY_STRING,
            unitPrice: row.unit_price || SERVICE.DEFAULTS.EMPTY_STRING,
            supplyPrice: row.supply_price || SERVICE.DEFAULTS.EMPTY_STRING,
            tax: row.tax || SERVICE.DEFAULTS.EMPTY_STRING,
            totalPrice: row.total_price || SERVICE.DEFAULTS.EMPTY_STRING,
        }));

        logger.info('운반 행 데이터 조회 완료', JSON.stringify({ monthId, rowCount: transportRows.length }));
        return transportRows;
    } catch (error) {
        return handleSupabaseError(error, ERROR_MESSAGES.ROWS_LOAD_FAILED);
    }
}

// 월 목록 관련 함수들
export async function getMonthList(): Promise<string[]> {
    try {
        logger.info('월 목록 조회 시작');

        const serverMonths = await getAllTransportMonths();
        const monthLabels = serverMonths
            .map(month => month.month_label)
            .filter((label): label is string => label !== null && label !== undefined);

        const sortedMonths = sortMonthsByYearAndMonth(monthLabels);

        logger.info('월 목록 조회 완료', JSON.stringify({ count: sortedMonths.length }));
        return sortedMonths;
    } catch (error: unknown) {
        logger.errorWithError(error, '월 목록 조회 실패');
        return []; // 실패 시 빈 배열 반환
    }
}

export async function syncMonthList(clientMonths: string[]): Promise<string[]> {
    try {
        logger.info('월 목록 동기화 시작', JSON.stringify({ clientMonthsCount: clientMonths.length }));

        const serverMonths = await getAllTransportMonths();
        const serverMonthLabels = serverMonths
            .map(month => month.month_label)
            .filter((label): label is string => label !== null && label !== undefined);

        // 클라이언트와 서버의 월 목록을 합치고 중복 제거
        const allMonths = [...new Set([...clientMonths, ...serverMonthLabels])];
        const sortedMonths = sortMonthsByYearAndMonth(allMonths);

        logger.info('월 목록 동기화 완료', JSON.stringify({
            clientCount: clientMonths.length,
            serverCount: serverMonthLabels.length,
            totalCount: sortedMonths.length
        }));
        return sortedMonths;
    } catch (error: unknown) {
        logger.errorWithError(error, '월 목록 동기화 실패');
        return clientMonths; // 실패 시 클라이언트 목록 반환
    }
}

// transportService 객체 export
export const transportService = {
    saveTransportMonth,
    getTransportMonth,
    saveTransportRows,
    getTransportRows,
    getAllTransportMonths,
    getMonthList,
    syncMonthList,
    deleteTransportMonth,
};