// 색상 팔레트
export const COLORS = {
    PRIMARY: '#3b82f6',
    PRIMARY_HOVER: '#2563eb',
    SUCCESS: '#10b981',
    SUCCESS_HOVER: '#059669',
    WARNING: '#f59e0b',
    WARNING_HOVER: '#d97706',
    ERROR: '#ef4444',
    ERROR_HOVER: '#dc2626',
    PURPLE: '#8b5cf6',
    PURPLE_HOVER: '#7c3aed',
    GRAY: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
    },
    BORDER: '#e5e7eb',
    BACKGROUND: '#f8fafc',
    CARD_BACKGROUND: '#fff',
    // 사이드바 관련 색상
    SIDEBAR_ACTIVE_BG: '#eff6ff',
    SIDEBAR_ACTIVE_HOVER: '#dbeafe',
    // 통계 카드 관련 색상
    STATS_SUCCESS_BG: '#f0fdf4',
    STATS_WARNING_BG: '#fef3c7',
    STATS_ERROR_BG: '#fef2f2',
} as const;

// 간격 (spacing)
export const SPACING = {
    XS: 0.5,
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4,
} as const;

// 테두리 반경
export const BORDER_RADIUS = {
    SM: 1,
    MD: 2,
    LG: 3,
} as const;

// 그림자
export const SHADOWS = {
    SM: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    MD: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;

// 애니메이션 지속 시간
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
} as const;

// 사이드바 관련 상수
export const SIDEBAR = {
    DRAWER_WIDTH: 280,
    COLLAPSED_DRAWER_WIDTH: 72,
    HEADER_MIN_HEIGHT: 64,
    LOGO_SIZE: 32,
    LOGO_FONT_SIZE: '18px',
    MENU_ITEM_MIN_HEIGHT: 48,
    TOGGLE_BUTTON_SIZE: 40,
    TRANSITION_DURATION: '0.3s ease',
} as const;

// 자동 저장 지연 시간
export const AUTO_SAVE_DELAY = 5000;

// 알림 표시 시간
export const NOTIFICATION_DURATION = 5000;

// 파일 업로드 허용 형식
export const ALLOWED_FILE_TYPES = '.xlsx,.xls,.csv';

// 스크롤바 스타일
export const SCROLLBAR_STYLES = {
    width: '8px',
    track: {
        background: '#f1f5f9',
        borderRadius: '4px',
    },
    thumb: {
        background: '#cbd5e1',
        borderRadius: '4px',
        '&:hover': {
            background: '#94a3b8',
        },
    },
} as const;

// 서비스 관련 상수
export const SERVICE = {
    // 데이터베이스 테이블명
    TABLES: {
        TRANSPORT_MONTHS: 'transport_months',
        TRANSPORT_ROWS: 'transport_rows',
    },
    // 정렬 옵션
    ORDER: {
        CREATED_AT_DESC: { column: 'created_at', ascending: false },
        ROW_ORDER_ASC: { column: 'row_order', ascending: true },
    },
    // 월 정렬 정규식
    MONTH_SORT_REGEX: /(\d+)년 (\d+)월/,
    // 기본값
    DEFAULTS: {
        EMPTY_STRING: '',
        NULL_VALUE: null,
    },
} as const;