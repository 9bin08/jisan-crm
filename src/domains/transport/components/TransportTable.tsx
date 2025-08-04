import { useMemo } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
} from '@mui/material';
import type { TransportRow } from '../types';
import { TransportCalculator } from '../utils/calculations';
import { tableContainerStyles } from '../styles/tableStyles';
import { TableHeader, TableRow, TableSummary } from './table';
import { TABLE_MIN_WIDTH, DEFAULT_ROW } from '../constants';

interface TransportTableProps {
    rows: TransportRow[];
    onChange: (idx: number, field: keyof TransportRow, value: string) => void;
    onAddRow: () => void;
    onDeleteRow: (idx: number) => void;
    summary: { supplyTotal: number; taxTotal: number; totalPriceTotal: number };
    currentMonth: number;
}

export default function TransportTable({
    rows,
    onChange,
    onAddRow,
    onDeleteRow,
    summary,
    currentMonth
}: TransportTableProps) {
    // 기존 데이터에서 옵션 추출 (빈 값 제외) - useMemo로 최적화
    const options = useMemo(() => ({
        carNumbers: TransportCalculator.extractUniqueValues(rows, 'carNumber'),
        companies: TransportCalculator.extractUniqueValues(rows, 'company'),
        destinations: TransportCalculator.extractUniqueValues(rows, 'destination'),
        items: TransportCalculator.extractUniqueValues(rows, 'item'),
        weights: TransportCalculator.extractUniqueValues(rows, 'weight'),
        counts: TransportCalculator.extractUniqueValues(rows, 'count'),
        unitPrices: TransportCalculator.extractUniqueValues(rows, 'unitPrice'),
    }), [rows]);

    const handleCalculate = (idx: number, type: 'supply' | 'tax' | 'total') => {
        const row = rows[idx];

        if (type === 'supply') {
            const supplyPrice = TransportCalculator.calculateSupplyPrice(row.weight || '', row.unitPrice || '');
            onChange(idx, 'supplyPrice', supplyPrice.toString());
        } else if (type === 'tax') {
            const tax = TransportCalculator.calculateTax(row.supplyPrice || '');
            onChange(idx, 'tax', tax.toString());
        } else if (type === 'total') {
            const total = TransportCalculator.calculateTotal(row.supplyPrice || '', row.tax || '');
            onChange(idx, 'totalPrice', total.toString());
        }
    };

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
}