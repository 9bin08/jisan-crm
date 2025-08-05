// 성공 메시지
export const SUCCESS_MESSAGES = {
    DATA_SAVED: '데이터가 성공적으로 저장되었습니다.',
    MONTH_ADDED: '새 월이 추가되었습니다.',
    MONTH_DELETED: '월이 삭제되었습니다.',
    EXCEL_UPLOADED: '엑셀 파일이 성공적으로 업로드되었습니다.',
    EXCEL_DOWNLOADED: '엑셀 파일이 다운로드되었습니다.',
    ALL_EXCEL_DOWNLOADED: '선택한 모든 월의 엑셀 파일이 다운로드되었습니다.',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
    DATA_SAVE_FAILED: '데이터 저장에 실패했습니다.',
    DATA_LOAD_FAILED: '데이터 로드에 실패했습니다.',
    MONTH_ADD_FAILED: '월 추가에 실패했습니다.',
    MONTH_DELETE_FAILED: '월 삭제에 실패했습니다.',
    EXCEL_UPLOAD_FAILED: '엑셀 파일 업로드에 실패했습니다.',
    EXCEL_DOWNLOAD_FAILED: '엑셀 파일 다운로드에 실패했습니다.',
    ALL_EXCEL_DOWNLOAD_FAILED: '통합 엑셀 다운로드에 실패했습니다.',
    // 서비스 관련 에러 메시지
    MONTH_SAVE_FAILED: '월별 데이터 저장에 실패했습니다.',
    MONTH_LOAD_FAILED: '월별 데이터 조회에 실패했습니다.',
    ROWS_SAVE_FAILED: '운반 행 데이터 저장에 실패했습니다.',
    ROWS_LOAD_FAILED: '운반 행 데이터 조회에 실패했습니다.',
    ROWS_DELETE_FAILED: '운반 행 데이터 삭제에 실패했습니다.',
    MONTH_DELETE_FAILED_SERVICE: '월별 데이터 삭제에 실패했습니다.',
    MONTH_LIST_LOAD_FAILED: '월 목록 조회에 실패했습니다.',
    MONTH_SYNC_FAILED: '월 목록 동기화에 실패했습니다.',
} as const;

// 정보 메시지
export const INFO_MESSAGES = {
    DATA_LOADING: '데이터를 불러오는 중...',
    LOADING_DATA: '데이터를 불러오는 중입니다.',
    SAVING_DATA: '데이터를 저장하는 중입니다.',
} as const;

// 경고 메시지
export const WARNING_MESSAGES = {
    NO_DATA_TO_SAVE: '저장할 데이터가 없습니다.',
    INVALID_MONTH_FORMAT: '잘못된 월 형식입니다.',
} as const;

// 컨텍스트 메시지
export const CONTEXT_MESSAGES = {
    MONTH_LIST_LOAD: '월 목록을 불러오는 중',
    DATA_LOAD: '데이터를 불러오는 중',
    DATA_SAVE: '데이터를 저장하는 중',
    EXCEL_UPLOAD: '엑셀 파일을 업로드하는 중',
    EXCEL_DOWNLOAD: '엑셀 파일을 다운로드하는 중',
} as const;