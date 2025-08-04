// 운반내역서(차량운반표) 한 행의 타입
export interface TransportRow {
    date: string; // 날짜 (예: '7/1')
    carNumber: string; // 차량번호
    company: string; // 업체/상차지
    destination: string; // 하차지
    item: string; // 품명
    weight: string; // 중량
    count?: string; // 횟수 (엑셀에도 포함)
    unitPrice?: string; // 단가 (빈칸 가능)
    supplyPrice?: string; // 공급가액
    tax?: string; // 세액
    totalPrice?: string; // 합계금액
}

// 월별 데이터 타입
export interface TransportMonthData {
    month: string; // 예: '2025-07'
    rows: TransportRow[];
}