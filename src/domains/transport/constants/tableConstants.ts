// 테이블 컬럼 정보
export const TABLE_COLUMNS = {
    NO: { label: 'No', width: '5%' },
    DATE: { label: '날짜', width: '8%' },
    CAR_NUMBER: { label: '차량번호', width: '12%' },
    COMPANY: { label: '업체/상차지', width: '15%' },
    DESTINATION: { label: '하차지', width: '15%' },
    ITEM: { label: '품목', width: '10%' },
    WEIGHT: { label: '중량', width: '8%' },
    COUNT: { label: '횟수', width: '6%' },
    UNIT_PRICE: { label: '단가', width: '10%' },
    SUPPLY_PRICE: { label: '공급가액', width: '12%' },
    TAX: { label: '세액', width: '10%' },
    TOTAL_PRICE: { label: '합계금액', width: '12%' },
    DELETE: { label: '삭제', width: '8%' },
} as const;

// 테이블 최소 너비
export const TABLE_MIN_WIDTH = 1200;

// 날짜 입력 제한
export const DATE_INPUT_LIMITS = {
    MIN: 1,
    MAX: 31,
} as const;

// 숫자 입력 제한
export const NUMBER_INPUT_LIMITS = {
    DECIMAL_PLACES: 3,
    WEIGHT_REGEX: /^\d*\.?\d{0,3}$/,
    INTEGER_REGEX: /[^0-9]/g,
} as const;

// 계산 타입
export const CALCULATION_TYPES = {
    SUPPLY: 'supply',
    TAX: 'tax',
    TOTAL: 'total',
} as const;

// 새 행 기본값
export const DEFAULT_ROW = {
    date: '',
    carNumber: '',
    company: '',
    destination: '',
    item: '',
    weight: '',
    count: '',
    unitPrice: '',
    supplyPrice: '',
    tax: '',
    totalPrice: '',
} as const;

// 플레이스홀더 텍스트
export const PLACEHOLDER_TEXTS = {
    CAR_NUMBER: '차량번호 입력',
    COMPANY: '업체/상차지 입력',
    DESTINATION: '하차지 입력',
    ITEM: '품목 입력',
    UNIT_PRICE: '단가',
    SUPPLY_PRICE: '공급가액',
    TAX: '세액',
    TOTAL_PRICE: '합계금액',
} as const;