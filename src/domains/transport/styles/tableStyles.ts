import type { SxProps, Theme } from '@mui/material';
import { COLORS, SPACING, BORDER_RADIUS, TABLE_MIN_WIDTH } from '../constants';

// 테이블 컨테이너 스타일
export const tableContainerStyles: SxProps<Theme> = {
    width: '100%',
    overflowX: 'auto',
    '& .MuiTable-root': {
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed',
        minWidth: TABLE_MIN_WIDTH,
    }
};

// 테이블 헤더 행 스타일
export const tableHeaderRowStyles: SxProps<Theme> = {
    bgcolor: COLORS.GRAY[50]
};

// 테이블 헤더 셀 스타일
export const tableHeaderCellStyles: SxProps<Theme> = {
    borderBottom: `2px solid ${COLORS.BORDER}`,
    fontWeight: 600,
    color: COLORS.GRAY[700],
    fontSize: '14px',
    py: SPACING.MD,
    px: SPACING.SM,
    textAlign: 'center',
};

// 테이블 데이터 행 스타일
export const tableDataRowStyles: SxProps<Theme> = {
    '&:hover': { bgcolor: COLORS.GRAY[50] },
    '&:nth-of-type(even)': { bgcolor: COLORS.GRAY[100] }
};

// 테이블 데이터 셀 스타일
export const tableDataCellStyles: SxProps<Theme> = {
    borderBottom: `1px solid ${COLORS.BORDER}`,
    py: SPACING.SM,
    px: SPACING.SM,
    textAlign: 'center',
};

// 테이블 데이터 셀 (우측 정렬)
export const tableDataCellRightStyles: SxProps<Theme> = {
    ...tableDataCellStyles,
    textAlign: 'right',
};

// 번호 셀 스타일
export const numberCellStyles: SxProps<Theme> = {
    ...tableDataCellStyles,
    color: COLORS.GRAY[500],
    fontSize: '14px'
};

// 합계 행 스타일
export const summaryRowStyles: SxProps<Theme> = {
    bgcolor: COLORS.GRAY[50]
};

// 합계 셀 스타일
export const summaryCellStyles: SxProps<Theme> = {
    borderBottom: `2px solid ${COLORS.BORDER}`,
    py: SPACING.MD,
    px: SPACING.SM,
    textAlign: 'center',
    fontWeight: 600,
    color: COLORS.GRAY[700],
    fontSize: '14px'
};

// 합계 셀 (우측 정렬)
export const summaryCellRightStyles: SxProps<Theme> = {
    ...summaryCellStyles,
    textAlign: 'right',
};

// 입력 필드 공통 스타일
export const inputFieldStyles: SxProps<Theme> = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
        borderRadius: BORDER_RADIUS.SM,
        fontSize: '14px',
        '& fieldset': {
            borderColor: COLORS.GRAY[300],
        },
        '&:hover fieldset': {
            borderColor: COLORS.PRIMARY,
        },
        '&.Mui-focused fieldset': {
            borderColor: COLORS.PRIMARY,
        },
    },
};

// 계산 버튼 스타일
export const calculateButtonStyles: SxProps<Theme> = {
    color: COLORS.PRIMARY,
    '&:hover': { bgcolor: COLORS.GRAY[50] },
    width: 24,
    height: 24,
};

// 삭제 버튼 스타일
export const deleteButtonStyles: SxProps<Theme> = {
    color: COLORS.ERROR,
    '&:hover': { bgcolor: COLORS.GRAY[50] },
    width: 28,
    height: 28,
};

// 날짜 입력 컨테이너 스타일
export const dateInputContainerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

// 계산 버튼 컨테이너 스타일
export const calculateButtonContainerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.XS
};

// 날짜 텍스트 스타일
export const dateTextStyles: SxProps<Theme> = {
    mr: SPACING.XS
};

// 날짜 입력 필드 스타일
export const dateInputFieldStyles: SxProps<Theme> = {
    width: 40,
    ...inputFieldStyles
};