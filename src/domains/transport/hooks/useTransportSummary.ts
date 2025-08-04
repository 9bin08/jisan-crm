import type { TransportRow } from '../types';

export function useTransportSummary(rows: TransportRow[]) {
    // 문자열을 안전하게 숫자로 변환
    const toNumber = (v?: string) => {
        if (!v) return 0;
        // 쉼표 제거 후 숫자 변환
        const n = Number(v.toString().replace(/,/g, ''));
        return isNaN(n) ? 0 : n;
    };

    const supplyTotal = rows.reduce((sum, row) => sum + toNumber(row.supplyPrice), 0);
    const taxTotal = rows.reduce((sum, row) => sum + toNumber(row.tax), 0);
    const totalPriceTotal = rows.reduce((sum, row) => sum + toNumber(row.totalPrice), 0);

    return {
        supplyTotal,
        taxTotal,
        totalPriceTotal,
    };
}