import React, { useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Stack,
    Typography,
    Button,
    Divider,
    Popover,
    Card,
    CardContent,
    List,
    ListItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { CompanyInfo } from './components/CompanyInfo';
import { ActionButtons } from './components/ActionButtons';
import { MonthActions } from './components/MonthActions';
import { NotificationStack } from './components/NotificationStack';
import MonthTabs from './components/MonthTabs';
import TransportTable from './components/TransportTable';
import { SuspenseFallback } from '../../components/SuspenseFallback';

// Hooks
import { useMonthManagement } from './hooks/useMonthManagement';
import { useCompanyInfo } from './hooks/useCompanyInfo';
import { useTransportData } from './hooks/useTransportData';
import { useExcelOperations } from './hooks/useExcelOperations';
import { useUIState } from './hooks/useUIState';
import { useTransportSummary } from './hooks/useTransportSummary';
import { useMultipleTransportMonths } from './hooks/queries/useTransportQueries';
import { useErrorHandler } from './hooks/useErrorHandler';
import { useNotification } from './hooks/useNotification';
import { useAutoSave } from './hooks/useAutoSave';

// Constants
import {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    INFO_MESSAGES,
    CONTEXT_MESSAGES,
    AUTO_SAVE_DELAY,
    COLORS,
    SPACING,
    BORDER_RADIUS,
    SHADOWS,
    SCROLLBAR_STYLES,
} from './constants';

function TransportPage() {
    const popoverAnchor = useRef<HTMLButtonElement | null>(null);

    // Hooks
    const {
        months,
        selectedMonth,
        checkedMonths,
        addMonth,
        deleteMonth,
        selectMonth,
        toggleMonth,
        toggleAllMonths,
        isLoading: isMonthLoading,
        error: monthError,
    } = useMonthManagement();

    const {
        company,
        contact,
        regNo,
        updateCompany,
        updateContact,
        updateRegNo,
    } = useCompanyInfo();

    const {
        currentRows,
        isLoading: isDataLoading,
        error: dataError,
        updateRow,
        addRow,
        deleteRow,
        saveData,
        updateFromExcel,
        updateRows,
    } = useTransportData(selectedMonth, months);

    const {
        downloadExcel,
        downloadAllExcel,
        uploadExcel,
    } = useExcelOperations();

    const {
        sidebarOpen,
        popoverOpen,
        toggleSidebar,
        openPopover,
        closePopover,
    } = useUIState();

    const summary = useTransportSummary(currentRows);
    const { handleError } = useErrorHandler();
    const { notifications, removeNotification, showSuccess, showError, showInfo } = useNotification();

    // 통합 다운로드를 위한 여러 월 데이터 조회
    const selectedMonthLabels = checkedMonths.map(i => months[i]).filter(Boolean);
    const { data: multipleMonthsData, isLoading: isMultipleDataLoading } = useMultipleTransportMonths(selectedMonthLabels);

    // 로딩 상태 관리 개선 - 깜빡임 방지
    const isInitialLoading = isMonthLoading || (isDataLoading && months.length === 0);
    const isAnyLoading = isMonthLoading || isDataLoading || isMultipleDataLoading;

    // 자동 저장
    const saveHandler = useCallback(async () => {
        try {
            const currentMonthLabel = months[selectedMonth] || '';
            const success = await saveData(currentMonthLabel, company, contact, regNo);

            if (success) {
                showSuccess(SUCCESS_MESSAGES.DATA_SAVED);
            } else {
                showError(ERROR_MESSAGES.DATA_SAVE_FAILED);
            }
        } catch (err) {
            showError(ERROR_MESSAGES.DATA_SAVE_FAILED);
        }
    }, [months, selectedMonth, company, contact, regNo, saveData, showSuccess, showError]);

    const { triggerSave } = useAutoSave(
        [currentRows, company, contact, regNo, selectedMonth],
        {
            delay: AUTO_SAVE_DELAY,
            enabled: Boolean(months[selectedMonth]) && currentRows.length > 0,
            onSave: saveHandler,
        }
    );

    // 에러 처리
    useEffect(() => {
        if (monthError) {
            const errorMessage = handleError(monthError, CONTEXT_MESSAGES.MONTH_LIST_LOAD);
            showError(errorMessage.message);
        }
    }, [monthError, handleError, showError]);

    useEffect(() => {
        if (dataError) {
            const errorMessage = handleError(dataError, CONTEXT_MESSAGES.DATA_LOAD);
            showError(errorMessage.message);
        }
    }, [dataError, handleError, showError]);

    useEffect(() => {
        document.body.style.background = COLORS.BACKGROUND;
        return () => { document.body.style.background = ''; };
    }, []);

    // Event handlers
    const handleSave = async () => {
        await triggerSave();
    };

    const handleAddMonth = async () => {
        await addMonth(company, contact, regNo);
    };

    const handleDeleteMonth = async (monthLabel: string) => {
        try {
            await deleteMonth(monthLabel);
            showSuccess(SUCCESS_MESSAGES.MONTH_DELETED);
        } catch (err) {
            showError(ERROR_MESSAGES.MONTH_DELETE_FAILED);
        }
    };

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const rows = await uploadExcel(file);
            updateFromExcel(rows);
            showSuccess(SUCCESS_MESSAGES.EXCEL_UPLOADED);
        } catch (err: unknown) {
            const errorMessage = handleError(err, CONTEXT_MESSAGES.EXCEL_UPLOAD);
            showError(errorMessage.message);
        }
    };

    const handleExcelDownload = async () => {
        await downloadExcel(currentRows, {
            company,
            contact,
            regNo,
            monthLabel: months[selectedMonth],
        });
    };

    const handleExcelDownloadAll = async () => {
        closePopover();
        if (checkedMonths.length === 0) return;

        try {
            if (!multipleMonthsData) {
                showInfo(INFO_MESSAGES.LOADING_DATA);
                return;
            }

            const monthsData = multipleMonthsData.map(({ monthLabel, monthData, rows }) => ({
                month: monthLabel,
                rows: rows || [],
                meta: {
                    company: monthData?.company || company,
                    contact: monthData?.contact || contact,
                    regNo: monthData?.reg_no || regNo
                }
            }));

            await downloadAllExcel(monthsData);
            showSuccess(SUCCESS_MESSAGES.ALL_EXCEL_DOWNLOADED);
        } catch (err) {
            console.error('통합 다운로드 실패:', err);
            showError(ERROR_MESSAGES.ALL_EXCEL_DOWNLOAD_FAILED);
        }
    };

    const handleImageDownload = () => {
        // TODO: html2canvas로 표를 이미지로 저장
    };

    const currentMonthNumber = (() => {
        const m = months[selectedMonth]?.match(/(\d+)월/);
        return m ? parseInt(m[1], 10) : 1;
    })();

    return (
        <Box sx={{ display: 'flex', bgcolor: COLORS.BACKGROUND, minHeight: '100vh', overflow: 'hidden', width: '100vw', position: 'relative' }}>
            {/* 로딩 오버레이 - 깜빡임 방지 */}
            {isInitialLoading && (
                <SuspenseFallback fullScreen message={INFO_MESSAGES.DATA_LOADING} />
            )}

            {/* 사이드바 */}
            <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

            {/* 메인 콘텐츠 */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                {/* 상단 헤더 */}
                <Header />

                {/* 메인 콘텐츠 영역 */}
                <Box sx={{ flexGrow: 1, p: SPACING.XL, overflow: 'auto', position: 'relative' }}>
                    {/* 부분 로딩 오버레이 */}
                    {isAnyLoading && !isInitialLoading && (
                        <SuspenseFallback message={INFO_MESSAGES.LOADING_DATA} />
                    )}

                    <Stack spacing={SPACING.XL} sx={{ maxWidth: '100%', minWidth: 0 }}>
                        {/* 통계 카드 */}
                        <StatsCards
                            rowsCount={currentRows.length}
                            supplyTotal={summary.supplyTotal}
                            taxTotal={summary.taxTotal}
                            totalPriceTotal={summary.totalPriceTotal}
                        />

                        {/* 회사 정보 */}
                        <CompanyInfo
                            company={company}
                            contact={contact}
                            regNo={regNo}
                            onCompanyChange={updateCompany}
                            onContactChange={updateContact}
                            onRegNoChange={updateRegNo}
                        />

                        {/* 월별 탭 */}
                        <Card sx={{
                            bgcolor: COLORS.CARD_BACKGROUND,
                            borderRadius: BORDER_RADIUS.LG,
                            boxShadow: SHADOWS.SM,
                            border: `1px solid ${COLORS.BORDER}`
                        }}>
                            <CardContent>
                                <MonthTabs
                                    months={months}
                                    value={selectedMonth}
                                    onChange={(_, v) => selectMonth(v)}
                                />
                                <MonthActions
                                    onAddMonth={handleAddMonth}
                                    onDeleteMonth={handleDeleteMonth}
                                    currentMonth={months[selectedMonth] || ''}
                                />
                            </CardContent>
                        </Card>

                        {/* 액션 버튼 */}
                        <ActionButtons
                            ref={popoverAnchor}
                            onSave={handleSave}
                            onExcelUpload={handleExcelUpload}
                            onExcelDownload={handleExcelDownload}
                            onOpenPopover={openPopover}
                            onImageDownload={handleImageDownload}
                        />

                        {/* 통합 다운로드 팝오버 */}
                        <Popover
                            open={popoverOpen}
                            anchorEl={popoverAnchor.current}
                            onClose={closePopover}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            PaperProps={{
                                sx: {
                                    p: SPACING.MD,
                                    minWidth: 280,
                                    borderRadius: BORDER_RADIUS.LG,
                                    boxShadow: SHADOWS.MD,
                                    border: `1px solid ${COLORS.BORDER}`,
                                    mt: SPACING.SM
                                }
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={SPACING.MD}>
                                <Typography variant="h6" fontWeight={600} color={COLORS.GRAY[800]}>
                                    다운로드할 월 선택
                                </Typography>
                                <Button
                                    onClick={toggleAllMonths}
                                    size="small"
                                    variant="text"
                                    sx={{
                                        color: COLORS.PRIMARY,
                                        fontWeight: 500,
                                        '&:hover': { bgcolor: COLORS.GRAY[50] }
                                    }}
                                >
                                    {checkedMonths.length === months.length ? '전체 해제' : '전체 선택'}
                                </Button>
                            </Box>
                            <List dense sx={{ mb: SPACING.MD }}>
                                {months.map((month, idx) => (
                                    <ListItem key={month} disableGutters>
                                        <Button
                                            fullWidth
                                            onClick={() => toggleMonth(idx)}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                textAlign: 'left',
                                                color: COLORS.GRAY[700],
                                                '&:hover': { bgcolor: COLORS.GRAY[50] },
                                                borderRadius: BORDER_RADIUS.MD,
                                            }}
                                        >
                                            <Box sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: BORDER_RADIUS.SM,
                                                border: '2px solid',
                                                borderColor: checkedMonths.includes(idx) ? COLORS.PRIMARY : COLORS.GRAY[300],
                                                bgcolor: checkedMonths.includes(idx) ? COLORS.PRIMARY : 'transparent',
                                                mr: SPACING.MD,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {checkedMonths.includes(idx) && (
                                                    <Box sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'white'
                                                    }} />
                                                )}
                                            </Box>
                                            {month}
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider sx={{ my: SPACING.MD }} />
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    onClick={handleExcelDownloadAll}
                                    variant="contained"
                                    disabled={checkedMonths.length === 0}
                                    sx={{
                                        borderRadius: BORDER_RADIUS.MD,
                                        bgcolor: COLORS.PRIMARY,
                                        '&:hover': { bgcolor: COLORS.PRIMARY_HOVER },
                                        '&:disabled': { bgcolor: COLORS.GRAY[300] },
                                        minWidth: 120,
                                    }}
                                >
                                    다운로드
                                </Button>
                            </Box>
                        </Popover>

                        {/* 운반내역서 테이블 */}
                        <Card sx={{
                            bgcolor: COLORS.CARD_BACKGROUND,
                            borderRadius: BORDER_RADIUS.LG,
                            boxShadow: SHADOWS.SM,
                            border: `1px solid ${COLORS.BORDER}`,
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                            <CardContent sx={{ p: 0, width: '100%' }}>
                                <Box sx={{ p: SPACING.LG, borderBottom: `1px solid ${COLORS.BORDER}` }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" fontWeight={600} color={COLORS.GRAY[800]}>
                                            운반내역서
                                        </Typography>
                                        <Button
                                            onClick={addRow}
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            sx={{
                                                borderRadius: BORDER_RADIUS.MD,
                                                bgcolor: COLORS.PRIMARY,
                                                '&:hover': { bgcolor: COLORS.PRIMARY_HOVER },
                                            }}
                                        >
                                            새 내역 추가
                                        </Button>
                                    </Stack>
                                </Box>
                                <Box sx={{
                                    overflow: 'auto',
                                    width: '100%',
                                    '&::-webkit-scrollbar': {
                                        height: SCROLLBAR_STYLES.width,
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: SCROLLBAR_STYLES.track.background,
                                        borderRadius: SCROLLBAR_STYLES.track.borderRadius,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: SCROLLBAR_STYLES.thumb.background,
                                        borderRadius: SCROLLBAR_STYLES.thumb.borderRadius,
                                        '&:hover': {
                                            background: SCROLLBAR_STYLES.thumb['&:hover'].background,
                                        },
                                    },
                                }}>
                                    <TransportTable
                                        rows={currentRows}
                                        onChange={updateRow}
                                        onAddRow={addRow}
                                        onDeleteRow={deleteRow}
                                        onReorderRows={updateRows}
                                        summary={summary}
                                        currentMonth={currentMonthNumber}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            </Box>

            {/* 알림 스택 */}
            <NotificationStack
                notifications={notifications}
                onClose={removeNotification}
            />
        </Box>
    );
}

export default TransportPage;