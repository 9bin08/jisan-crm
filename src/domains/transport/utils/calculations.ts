import type { TransportRow } from '../types';

/**
 * 운반 데이터 계산 유틸리티
 */
export class TransportCalculator {
    /**
     * 공급가액 계산
     */
    static calculateSupplyPrice(weight: string, unitPrice: string): number {
        const weightNum = parseFloat(weight.replace(/,/g, '')) || 0;
        const unitPriceNum = parseFloat(unitPrice.replace(/,/g, '')) || 0;
        return weightNum * unitPriceNum;
    }

    /**
     * 부가세 계산 (10%)
     */
    static calculateTax(supplyPrice: string): number {
        const supplyPriceNum = parseFloat(supplyPrice.replace(/,/g, '')) || 0;
        return supplyPriceNum * 0.1;
    }

    /**
     * 합계 계산
     */
    static calculateTotal(supplyPrice: string, tax: string): number {
        const supplyPriceNum = parseFloat(supplyPrice.replace(/,/g, '')) || 0;
        const taxNum = parseFloat(tax.replace(/,/g, '')) || 0;
        return supplyPriceNum + taxNum;
    }

    /**
     * 행 데이터에서 특정 필드의 고유값 추출
     */
    static extractUniqueValues(rows: TransportRow[], field: keyof TransportRow): string[] {
        return [...new Set(rows.map(row => row[field]).filter((value): value is string => Boolean(value)))];
    }

    /**
     * 한국 원 표기 (콤마 사용)
     */
    static formatKoreanCurrency(value: string | number): string {
        if (!value) return '';
        const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
        if (isNaN(num)) return '';
        return num.toLocaleString('ko-KR');
    }

    /**
     * 숫자만 추출
     */
    static extractNumbers(value: string): string {
        return value.replace(/[^0-9]/g, '');
    }

    /**
     * 소수점 3자리까지 허용하는 숫자 검증
     */
    static isValidDecimal(value: string): boolean {
        const regex = /^\d*\.?\d{0,3}$/;
        return value === '' || regex.test(value);
    }
}