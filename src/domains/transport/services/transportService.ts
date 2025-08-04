import { supabase } from '../../../lib/supabase';
import type { TransportRow } from '../types';

// 월별 데이터 저장
export async function saveTransportMonth(
    monthLabel: string | null,
    company: string | null,
    contact: string | null,
    regNo: string | null
) {
    const { data, error } = await supabase
        .from('transport_months')
        .insert({
            month_label: monthLabel || null,
            company: company || null,
            contact: contact || null,
            reg_no: regNo || null,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`월별 데이터 저장 실패: ${error.message}`);
    }

    return data;
}

// 월별 데이터 조회
export async function getTransportMonth(monthLabel: string | null) {
    try {
        console.log('Querying for month_label:', monthLabel);

        if (!monthLabel) {
            console.log('month_label is null or empty');
            return null;
        }

        const { data, error } = await supabase
            .from('transport_months')
            .select('*')
            .eq('month_label', monthLabel)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            throw new Error(`월별 데이터 조회 실패: ${error.message}`);
        }

        console.log('Query result:', data);
        return data;
    } catch (err) {
        console.error('getTransportMonth error:', err);
        throw err;
    }
}

// 운반 행 데이터 저장
export async function saveTransportRows(monthId: string, rows: TransportRow[]) {
    // 기존 데이터 삭제
    const { error: deleteError } = await supabase
        .from('transport_rows')
        .delete()
        .eq('month_id', monthId);

    if (deleteError) {
        throw new Error(`기존 데이터 삭제 실패: ${deleteError.message}`);
    }

    // 새 데이터 삽입 (null 값 안전 처리)
    const rowsToInsert = rows.map((row, index) => ({
        month_id: monthId,
        date: row.date || null,
        car_number: row.carNumber || null,
        company: row.company || null,
        destination: row.destination || null,
        item: row.item || null,
        weight: row.weight || null,
        count: row.count || null,
        unit_price: row.unitPrice || null,
        supply_price: row.supplyPrice || null,
        tax: row.tax || null,
        total_price: row.totalPrice || null,
        row_order: index,
    }));

    const { data, error } = await supabase
        .from('transport_rows')
        .insert(rowsToInsert)
        .select();

    if (error) {
        throw new Error(`운반 행 데이터 저장 실패: ${error.message}`);
    }

    return data;
}

// 운반 행 데이터 조회
export async function getTransportRows(monthId: string): Promise<TransportRow[]> {
    const { data, error } = await supabase
        .from('transport_rows')
        .select('*')
        .eq('month_id', monthId)
        .order('row_order');

    if (error) {
        throw new Error(`운반 행 데이터 조회 실패: ${error.message}`);
    }

    return data.map(row => ({
        date: row.date || '',
        carNumber: row.car_number || '',
        company: row.company || '',
        destination: row.destination || '',
        item: row.item || '',
        weight: row.weight || '',
        count: row.count || '',
        unitPrice: row.unit_price || '',
        supplyPrice: row.supply_price || '',
        tax: row.tax || '',
        totalPrice: row.total_price || '',
    }));
}

// 모든 월별 데이터 조회
export async function getAllTransportMonths() {
    const { data, error } = await supabase
        .from('transport_months')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`모든 월별 데이터 조회 실패: ${error.message}`);
    }

    return data;
}

// 서버에서 월 목록 가져오기 (단순화된 버전)
export async function getMonthList(): Promise<string[]> {
    try {
        const serverMonths = await getAllTransportMonths();
        const monthLabels = serverMonths
            .map(month => month.month_label)
            .filter((label): label is string => label !== null && label !== undefined);

        // 월 순서대로 정렬 (2025년 1월, 2025년 2월, ...)
        const sortedMonths = monthLabels.sort((a, b) => {
            const aMatch = a.match(/(\d+)년 (\d+)월/);
            const bMatch = b.match(/(\d+)년 (\d+)월/);

            if (!aMatch || !bMatch) return 0;

            const aYear = parseInt(aMatch[1]);
            const aMonth = parseInt(aMatch[2]);
            const bYear = parseInt(bMatch[1]);
            const bMonth = parseInt(bMatch[2]);

            if (aYear !== bYear) return aYear - bYear;
            return aMonth - bMonth;
        });

        return sortedMonths;
    } catch (error) {
        console.error('월 목록 조회 실패:', error);
        return []; // 실패 시 빈 배열 반환
    }
}

// 서버의 월 목록과 클라이언트 월 목록 동기화 (기존 함수 유지 - 호환성)
export async function syncMonthList(clientMonths: string[]): Promise<string[]> {
    try {
        // 서버에서 저장된 월 데이터 가져오기
        const serverMonths = await getAllTransportMonths();
        const serverMonthLabels = serverMonths
            .map(month => month.month_label)
            .filter((label): label is string => label !== null && label !== undefined);

        // 클라이언트와 서버의 월 목록을 합치고 중복 제거
        const allMonths = [...new Set([...clientMonths, ...serverMonthLabels])];

        // 월 순서대로 정렬 (2025년 1월, 2025년 2월, ...)
        const sortedMonths = allMonths.sort((a, b) => {
            const aMatch = a.match(/(\d+)년 (\d+)월/);
            const bMatch = b.match(/(\d+)년 (\d+)월/);

            if (!aMatch || !bMatch) return 0;

            const aYear = parseInt(aMatch[1]);
            const aMonth = parseInt(aMatch[2]);
            const bYear = parseInt(bMatch[1]);
            const bMonth = parseInt(bMatch[2]);

            if (aYear !== bYear) return aYear - bYear;
            return aMonth - bMonth;
        });

        return sortedMonths;
    } catch (error) {
        console.error('월 목록 동기화 실패:', error);
        return clientMonths; // 실패 시 클라이언트 목록 반환
    }
}

// 월별 데이터 삭제
export async function deleteTransportMonth(monthId: string) {
    // 먼저 관련된 행 데이터 삭제
    const { error: rowsError } = await supabase
        .from('transport_rows')
        .delete()
        .eq('month_id', monthId);

    if (rowsError) {
        throw new Error(`운반 행 데이터 삭제 실패: ${rowsError.message}`);
    }

    // 월별 데이터 삭제
    const { error } = await supabase
        .from('transport_months')
        .delete()
        .eq('id', monthId);

    if (error) {
        throw new Error(`월별 데이터 삭제 실패: ${error.message}`);
    }
}

// transportService 객체 export
export const transportService = {
    saveTransportMonth,
    getTransportMonth,
    saveTransportRows,
    getTransportRows,
    getAllTransportMonths,
    getMonthList, // 새로 추가된 함수
    syncMonthList,
    deleteTransportMonth,
};