// 성공 메시지
export const SUCCESS_MESSAGES = {
    DATA_SAVED: '데이터가 성공적으로 저장되었습니다!',
    MONTH_DELETED: '월이 성공적으로 삭제되었습니다!',
    EXCEL_UPLOADED: '엑셀 업로드 성공!',
    EXCEL_DOWNLOADED: '엑셀 다운로드가 완료되었습니다!',
    ALL_EXCEL_DOWNLOADED: '통합 엑셀 다운로드가 완료되었습니다!',
    MONTH_ADDED: '새로운 월이 추가되었습니다.',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
    DATA_SAVE_FAILED: '데이터 저장에 실패했습니다.',
    MONTH_DELETE_FAILED: '월 삭제에 실패했습니다.',
    EXCEL_UPLOAD_FAILED: '엑셀 업로드에 실패했습니다.',
    EXCEL_DOWNLOAD_FAILED: '엑셀 다운로드에 실패했습니다.',
    ALL_EXCEL_DOWNLOAD_FAILED: '통합 다운로드에 실패했습니다.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    SERVER_CONNECTION_ERROR: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
    TIMEOUT_ERROR: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
} as const;

// 정보 메시지
export const INFO_MESSAGES = {
    LOADING_DATA: '데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
    APP_LOADING: '애플리케이션을 불러오는 중...',
    DATA_LOADING: '데이터를 불러오는 중...',
} as const;

// 경고 메시지
export const WARNING_MESSAGES = {
    NO_MONTHS_SELECTED: '다운로드할 월을 선택해주세요.',
    NO_DATA_TO_SAVE: '저장할 데이터가 없습니다.',
} as const;

// 컨텍스트 메시지
export const CONTEXT_MESSAGES = {
    MONTH_LIST_LOAD: '월 목록 로드',
    DATA_LOAD: '데이터 로드',
    EXCEL_UPLOAD: '엑셀 업로드',
    MONTH_ADD: '월 추가',
    MONTH_DELETE: '월 삭제',
    DATA_SAVE: '데이터 저장',
    ROW_SAVE: '운반 행 데이터 저장',
    AUTO_SAVE: '자동 저장',
    MANUAL_SAVE: '수동 저장',
} as const;