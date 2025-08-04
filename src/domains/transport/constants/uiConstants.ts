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