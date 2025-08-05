import React, { useMemo } from 'react';
import { Table, TableBody, TableContainer } from '@mui/material';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TransportRow } from '../types';
import { TransportCalculator } from '../utils/calculations';
import { TableHeader, TableSummary } from './table';
import { SortableTableRow } from './table/SortableTableRow';

interface TransportTableProps {
    rows: TransportRow[];
    onChange: (idx: number, field: keyof TransportRow, value: string) => void;
    onAddRow: () => void;
    onDeleteRow: (idx: number) => void;
    onReorderRows: (newRows: TransportRow[]) => void;
    summary: { supplyTotal: number; taxTotal: number; totalPriceTotal: number };
    currentMonth: number;
}

export default React.memo<TransportTableProps>(function TransportTable({
    rows, onChange, onDeleteRow, onReorderRows, summary, currentMonth
}) {
    // 드래그 앤 드롭 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px 이동 후 드래그 시작
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 드래그 종료 핸들러
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && over) {
            const oldIndex = parseInt(active.id.toString().replace('row-', ''));
            const newIndex = parseInt(over.id.toString().replace('row-', ''));

            if (!isNaN(oldIndex) && !isNaN(newIndex) && oldIndex !== newIndex) {
                const newRows = arrayMove(rows, oldIndex, newIndex);
                onReorderRows(newRows);
            }
        }
    };

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
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <TableContainer sx={{
                width: '100%',
                overflowX: 'auto',
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    tableLayout: 'fixed',
                    minWidth: '1400px',
                    width: '100%',
                },
                '& .MuiTableBody-root': {
                    '& tr:last-child': {
                        '& td': {
                            borderBottom: 'none',
                        }
                    }
                }
            }}>
                <Table>
                    <TableHeader />
                    <TableBody>
                        <SortableContext
                            items={rows.map((_, idx) => `row-${idx}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {rows.map((row, idx) => (
                                <SortableTableRow
                                    key={`row-${idx}`}
                                    row={row}
                                    idx={idx}
                                    currentMonth={currentMonth}
                                    options={options}
                                    onChange={onChange}
                                    onDeleteRow={onDeleteRow}
                                    onCalculate={handleCalculate}
                                />
                            ))}
                        </SortableContext>
                        <TableSummary summary={summary} />
                    </TableBody>
                </Table>
            </TableContainer>
        </DndContext>
    );
});