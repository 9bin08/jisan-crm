import type { TransportRow } from '../types';
import * as XLSX from 'xlsx-js-style';

export const EXCEL_HEADERS = [
    '날짜', '차량번호', '업체/상차지', '하차지', '품목', '중량', '횟수', '단가', '공급가액', '세액', '합계금액'
];

interface ExcelMeta {
    company: string;
    contact: string;
    regNo: string;
    monthLabel: string;
}

export function downloadStyledExcel(rows: TransportRow[], meta: ExcelMeta) {
    // 현재 월 숫자 추출
    const currentMonth = parseInt(meta.monthLabel.match(/(\d+)월/)?.[1] || '1', 10);

    // 빈 행 필터링 (모든 필드가 비어있는 행 제거)
    const filteredRows = rows.filter(row =>
        row.date || row.carNumber || row.company || row.destination ||
        row.item || row.weight || row.count || row.unitPrice ||
        row.supplyPrice || row.tax || row.totalPrice
    );

    // 합계 계산
    const totals = filteredRows.reduce((acc, row) => {
        const unitPrice = parseFloat((row.unitPrice || '').replace(/,/g, '')) || 0;
        const supplyPrice = parseFloat((row.supplyPrice || '').replace(/,/g, '')) || 0;
        const tax = parseFloat((row.tax || '').replace(/,/g, '')) || 0;
        const totalPrice = parseFloat((row.totalPrice || '').replace(/,/g, '')) || 0;

        return {
            unitPrice: acc.unitPrice + unitPrice,
            supplyPrice: acc.supplyPrice + supplyPrice,
            tax: acc.tax + tax,
            totalPrice: acc.totalPrice + totalPrice
        };
    }, { unitPrice: 0, supplyPrice: 0, tax: 0, totalPrice: 0 });

    // 1. 상단/헤더/데이터 배열 생성
    const title = `${meta.company}  ${meta.monthLabel} 운반내역서 담당${meta.contact}`;
    const regLine = `등록번호-${meta.regNo}`;

    const dataRows = filteredRows.map(row => [
        { v: row.date ? `${currentMonth}/${row.date}` : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.carNumber ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.company ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.destination ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.item ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.weight ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.count ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.unitPrice ? Number(row.unitPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.supplyPrice ? Number(row.supplyPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.tax ? Number(row.tax).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        { v: row.totalPrice ? Number(row.totalPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
    ]);

    const data = [
        [
            {
                v: title, t: 's', s: {
                    font: { name: '맑은 고딕', sz: 22, bold: true, color: { rgb: '000000' } },
                    alignment: { horizontal: 'center', vertical: 'center' },
                }
            },
            ...Array(EXCEL_HEADERS.length - 1).fill({ v: '', t: 's', s: {} })
        ],
        [
            {
                v: regLine, t: 's', s: {
                    font: { name: '맑은 고딕', sz: 16, bold: true, color: { rgb: '000000' } },
                    alignment: { horizontal: 'left', vertical: 'center' },
                }
            },
            ...Array(EXCEL_HEADERS.length - 1).fill({ v: '', t: 's', s: {} })
        ],
        EXCEL_HEADERS.map((h, i) => ({
            v: h, t: 's', s: {
                font: { name: '맑은 고딕', sz: 16, bold: true, color: { rgb: '000000' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } },
                },
            }
        })),
        ...dataRows,
    ];

    // 데이터가 있을 때만 합계 행 추가
    if (filteredRows.length > 0) {
        data.push([
            { v: '합계', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: totals.unitPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: totals.supplyPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: totals.tax.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: totals.totalPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        ]);
    }

    // 2. 워크시트 생성
    const ws = XLSX.utils.aoa_to_sheet(data);
    // 3. 병합(상단 타이틀/등록번호)
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: EXCEL_HEADERS.length - 1 } }, // 타이틀
        { s: { r: 1, c: 0 }, e: { r: 1, c: EXCEL_HEADERS.length - 1 } }, // 등록번호
    ];
    // 4. 셀 너비
    ws['!cols'] = [
        { wch: 8 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 12 }
    ];
    // 5. 오토필터(헤더행)
    const lastCol = String.fromCharCode(65 + EXCEL_HEADERS.length - 1); // 예: 'K'
    ws['!autofilter'] = { ref: `A3:${lastCol}3` };
    // 6. 워크북 생성 및 저장
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '운반내역');
    XLSX.writeFile(wb, `지산건기_차량운행일지_${meta.monthLabel.replace(/\s/g, '')}.xlsx`);
}

/**
 * 여러 월 데이터를 sheet별로 나누어 하나의 엑셀 파일로 다운로드
 * @param months [{ month, rows, meta }]
 */
export async function downloadAllMonthsExcel(
    months: { month: string; rows: TransportRow[]; meta: { company: string; contact: string; regNo: string } }[]
) {
    const XLSX = await import('xlsx-js-style');
    const wb = XLSX.utils.book_new();
    for (const { month, rows, meta } of months) {
        // 현재 월 숫자 추출
        const currentMonth = parseInt(month.match(/(\d+)월/)?.[1] || '1', 10);

        // 빈 행 필터링 (모든 필드가 비어있는 행 제거)
        const filteredRows = rows.filter(row =>
            row.date || row.carNumber || row.company || row.destination ||
            row.item || row.weight || row.count || row.unitPrice ||
            row.supplyPrice || row.tax || row.totalPrice
        );

        // 합계 계산
        const totals = filteredRows.reduce((acc, row) => {
            const unitPrice = parseFloat((row.unitPrice || '').replace(/,/g, '')) || 0;
            const supplyPrice = parseFloat((row.supplyPrice || '').replace(/,/g, '')) || 0;
            const tax = parseFloat((row.tax || '').replace(/,/g, '')) || 0;
            const totalPrice = parseFloat((row.totalPrice || '').replace(/,/g, '')) || 0;

            return {
                unitPrice: acc.unitPrice + unitPrice,
                supplyPrice: acc.supplyPrice + supplyPrice,
                tax: acc.tax + tax,
                totalPrice: acc.totalPrice + totalPrice
            };
        }, { unitPrice: 0, supplyPrice: 0, tax: 0, totalPrice: 0 });

        const title = `${meta.company}  ${month} 운반내역서 담당${meta.contact}`;
        const regLine = `등록번호-${meta.regNo}`;

        const dataRows = filteredRows.map(row => [
            { v: row.date ? `${currentMonth}/${row.date}` : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.carNumber ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.company ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.destination ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'left', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.item ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.weight ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.count ?? '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.unitPrice ? Number(row.unitPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.supplyPrice ? Number(row.supplyPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.tax ? Number(row.tax).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            { v: row.totalPrice ? Number(row.totalPrice).toLocaleString('ko-KR') : '', t: 's', s: { font: { name: '맑은 고딕', sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
        ]);

        const data = [
            [
                { v: title, t: 's', s: { font: { name: '맑은 고딕', sz: 22, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'center', vertical: 'center' } } },
                ...Array(EXCEL_HEADERS.length - 1).fill({ v: '', t: 's', s: {} })
            ],
            [
                { v: regLine, t: 's', s: { font: { name: '맑은 고딕', sz: 16, bold: true, color: { rgb: '000000' } }, alignment: { horizontal: 'left', vertical: 'center' } } },
                ...Array(EXCEL_HEADERS.length - 1).fill({ v: '', t: 's', s: {} })
            ],
            EXCEL_HEADERS.map((h, i) => ({
                v: h, t: 's', s: {
                    font: { name: '맑은 고딕', sz: 16, bold: true, color: { rgb: '000000' } },
                    alignment: { horizontal: 'center', vertical: 'center' },
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } },
                    },
                }
            })),
            ...dataRows,
        ];

        // 데이터가 있을 때만 합계 행 추가
        if (filteredRows.length > 0) {
            data.push([
                { v: '합계', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: '', t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: totals.unitPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: totals.supplyPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: totals.tax.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
                { v: totals.totalPrice.toLocaleString('ko-KR'), t: 's', s: { font: { name: '맑은 고딕', sz: 11, bold: true }, alignment: { horizontal: 'center', vertical: 'center' }, border: { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } } },
            ]);
        }

        const ws = XLSX.utils.aoa_to_sheet(data);
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: EXCEL_HEADERS.length - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: EXCEL_HEADERS.length - 1 } },
        ];
        ws['!cols'] = [
            { wch: 8 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 12 }
        ];
        const lastCol = String.fromCharCode(65 + EXCEL_HEADERS.length - 1);
        ws['!autofilter'] = { ref: `A3:${lastCol}3` };
        XLSX.utils.book_append_sheet(wb, ws, month);
    }
    XLSX.writeFile(wb, `지산건기_차량운행일지_통합.xlsx`);
}

/**
 * 엑셀 파일(ArrayBuffer/Blob 등) → TransportRow[] 변환
 * @param file 업로드된 엑셀 파일(Blob/File)
 * @returns TransportRow[]
 */
export async function parseExcelToRows(file: Blob): Promise<TransportRow[]> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const aoa: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

    // 느슨한 헤더 비교: 각 셀 trim 후, 앞 11개가 EXCEL_HEADERS와 일치하면 헤더로 간주
    const headerIdx = aoa.findIndex(row =>
        Array.isArray(row) &&
        row.length >= EXCEL_HEADERS.length &&
        EXCEL_HEADERS.every((h, i) => (row[i] ?? '').toString().trim() === h)
    );
    if (headerIdx === -1) throw new Error('엑셀 헤더를 찾을 수 없습니다.');

    const dataRows = aoa.slice(headerIdx + 1).filter(row =>
        Array.isArray(row) && row.length >= 11 && row[0] && row[1]
    );
    return dataRows.map(row => ({
        date: row[0]?.toString() ?? '',
        carNumber: row[1]?.toString() ?? '',
        company: row[2]?.toString() ?? '',
        destination: row[3]?.toString() ?? '',
        item: row[4]?.toString() ?? '',
        weight: row[5]?.toString() ?? '',
        count: row[6]?.toString() ?? '',
        unitPrice: row[7]?.toString() ?? '',
        supplyPrice: row[8]?.toString() ?? '',
        tax: row[9]?.toString() ?? '',
        totalPrice: row[10]?.toString() ?? '',
    }));
}