import React, { useMemo } from 'react';
import { Table, TableBody, TableContainer } from '@mui/material';
import type { TransportRow } from '../types';
import { TransportCalculator } from '../utils/calculations';
import { tableContainerStyles } from '../styles/tableStyles';
import { TableHeader, TableRow, TableSummary } from './table';

interface TransportTableProps {
    rows: TransportRow[];
    onChange: (idx: number, field: keyof TransportRow, value: string) => void;
    onAddRow: () => void;
    onDeleteRow: (idx: number) => void;
    summary: { supplyTotal: number; taxTotal: number; totalPriceTotal: number };
    currentMonth: number;
}

export default React.memo<TransportTableProps>(function TransportTable({
    rows, onChange, onDeleteRow, summary, currentMonth
}) {
    // 메모이제이션된 옵션들
    const options = useMemo(() => {
        const uniqueCarNumbers = TransportCalculator.extractUniqueValues(rows, 'carNumber');
        const uniqueCompanies = TransportCalculator.extractUniqueValues(rows, 'company');
        const uniqueDestinations = TransportCalculator.extractUniqueValues(rows, 'destination');
        const uniqueItems = TransportCalculator.extractUniqueValues(rows, 'item');
        const uniqueWeights = TransportCalculator.extractUniqueValues(rows, 'weight');
        const uniqueCounts = TransportCalculator.extractUniqueValues(rows, 'count');
        const uniqueUnitPrices = TransportCalculator.extractUniqueValues(rows, 'unitPrice');

        return {
            carNumbers: uniqueCarNumbers,
            companies: uniqueCompanies,
            destinations: uniqueDestinations,
            items: uniqueItems,
            weights: uniqueWeights,
            counts: uniqueCounts,
            unitPrices: uniqueUnitPrices,
        };
    }, [rows]);

    // 메모이제이션된 계산 핸들러
    const handleCalculate = useMemo(() => {
        return (idx: number, type: 'supply' | 'tax' | 'total') => {
            const row = rows[idx];
            if (!row) return;

            switch (type) {
                case 'supply':
                    // 중량과 단가로 공급가액 계산
                    const supplyPrice = TransportCalculator.calculateSupplyPrice(
                        row.weight || '0',
                        row.unitPrice || '0'
                    );
                    onChange(idx, 'supplyPrice', supplyPrice.toString());
                    break;
                case 'tax':
                    // 공급가액의 10%로 세액 계산
                    const tax = TransportCalculator.calculateTax(row.supplyPrice || '0');
                    onChange(idx, 'tax', tax.toString());
                    break;
                case 'total':
                    // 공급가액 + 세액으로 합계금액 계산
                    const totalPrice = TransportCalculator.calculateTotal(
                        row.supplyPrice || '0',
                        row.tax || '0'
                    );
                    onChange(idx, 'totalPrice', totalPrice.toString());
                    break;
            }
        };
    }, [rows, onChange]);

    return (
        <TableContainer sx={tableContainerStyles}>
            <Table>
                <TableHeader />
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow
                            key={idx}
                            row={row}
                            idx={idx}
                            currentMonth={currentMonth}
                            options={options}
                            onChange={onChange}
                            onDeleteRow={onDeleteRow}
                            onCalculate={handleCalculate}
                        />
                    ))}
                    <TableSummary summary={summary} />
                </TableBody>
            </Table>
        </TableContainer>
    );
});