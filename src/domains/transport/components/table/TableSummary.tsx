import { TableRow, TableCell } from '@mui/material';
import { summaryRowStyles, summaryCellStyles, summaryCellRightStyles } from '../../styles/tableStyles';
import { TransportCalculator } from '../../utils/calculations';

interface TableSummaryProps {
    summary: {
        supplyTotal: number;
        taxTotal: number;
        totalPriceTotal: number;
    };
}

export function TableSummary({ summary }: TableSummaryProps) {
    return (
        <TableRow sx={summaryRowStyles}>
            <TableCell
                colSpan={10}
                sx={summaryCellStyles}
            >
                합계
            </TableCell>
            <TableCell sx={summaryCellRightStyles}>
                ₩{TransportCalculator.formatKoreanCurrency(summary.supplyTotal)}
            </TableCell>
            <TableCell sx={summaryCellRightStyles}>
                ₩{TransportCalculator.formatKoreanCurrency(summary.taxTotal)}
            </TableCell>
            <TableCell sx={summaryCellRightStyles}>
                ₩{TransportCalculator.formatKoreanCurrency(summary.totalPriceTotal)}
            </TableCell>
            <TableCell sx={summaryCellStyles}>
            </TableCell>
        </TableRow>
    );
}