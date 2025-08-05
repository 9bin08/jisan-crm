import type { TransportRow } from '../types';

/**
 * 운반 데이터 계산 유틸리티
 */
export class TransportCalculator {
    // 세율 상수
    private static readonly TAX_RATE = 0.1; // 10% 부가세

    /**
     * 공급가액 계산 (중량 × 단가)
     */
    static calculateSupplyPrice(weight: string, unitPrice: string): number {
        const weightNum = parseFloat(weight.replace(/,/g, '')) || 0;
        const unitPriceNum = parseFloat(unitPrice.replace(/,/g, '')) || 0;
        return weightNum * unitPriceNum;
    }

    /**
     * 세액 계산 (공급가액의 10%)
     */
    static calculateTax(supplyPrice: string): number {
        const supplyPriceNum = parseFloat(supplyPrice.replace(/,/g, '')) || 0;
        return supplyPriceNum * this.TAX_RATE;
    }

    /**
     * 합계금액 계산 (공급가액 + 세액)
     */
    static calculateTotal(supplyPrice: string, tax: string): number {
        const supplyPriceNum = parseFloat(supplyPrice.replace(/,/g, '')) || 0;
        const taxNum = parseFloat(tax.replace(/,/g, '')) || 0;
        return supplyPriceNum + taxNum;
    }

    /**
     * 공급가액으로부터 세액과 합계금액을 모두 계산
     */
    static calculateAllFromSupplyPrice(supplyPrice: string): {
        supplyPrice: number;
        tax: number;
        totalPrice: number;
    } {
        const supplyPriceNum = parseFloat(supplyPrice.replace(/,/g, '')) || 0;
        const tax = supplyPriceNum * this.TAX_RATE;
        const totalPrice = supplyPriceNum + tax;

        return {
            supplyPrice: supplyPriceNum,
            tax,
            totalPrice,
        };
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

    /**
     * 중량 검증 (소수점 3자리까지 허용)
     */
    static isValidWeight(value: string): boolean {
        return this.isValidDecimal(value);
    }

    /**
     * 중량 포맷팅 (소수점 3자리까지 표시)
     */
    static formatWeight(value: string | number): string {
        if (!value) return '';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '';
        return num.toFixed(3).replace(/\.?0+$/, ''); // 끝의 불필요한 0 제거
    }
}