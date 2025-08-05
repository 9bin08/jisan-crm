import { TableHead, TableRow, TableCell } from '@mui/material';
import { tableHeaderRowStyles, tableHeaderCellStyles } from '../../styles/tableStyles';
import { TABLE_COLUMNS, COLORS } from '../../constants';

export function TableHeader() {
    return (
        <TableHead>
            <TableRow sx={tableHeaderRowStyles}>
                {/* 드래그 핸들러 헤더 */}
                <TableCell sx={{
                    ...tableHeaderCellStyles,
                    width: '30px',
                    padding: '4px',
                    textAlign: 'center',
                    borderRight: `1px solid ${COLORS.BORDER}`,
                }}>
                    이동
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.NO.width }}>
                    {TABLE_COLUMNS.NO.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.DATE.width }}>
                    {TABLE_COLUMNS.DATE.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.CAR_NUMBER.width }}>
                    {TABLE_COLUMNS.CAR_NUMBER.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.COMPANY.width }}>
                    {TABLE_COLUMNS.COMPANY.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.DESTINATION.width }}>
                    {TABLE_COLUMNS.DESTINATION.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.ITEM.width }}>
                    {TABLE_COLUMNS.ITEM.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.WEIGHT.width }}>
                    {TABLE_COLUMNS.WEIGHT.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.COUNT.width }}>
                    {TABLE_COLUMNS.COUNT.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.UNIT_PRICE.width }}>
                    {TABLE_COLUMNS.UNIT_PRICE.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.SUPPLY_PRICE.width }}>
                    {TABLE_COLUMNS.SUPPLY_PRICE.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.TAX.width }}>
                    {TABLE_COLUMNS.TAX.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.TOTAL_PRICE.width }}>
                    {TABLE_COLUMNS.TOTAL_PRICE.label}
                </TableCell>
                <TableCell sx={{ ...tableHeaderCellStyles, width: TABLE_COLUMNS.DELETE.width }}>
                    {TABLE_COLUMNS.DELETE.label}
                </TableCell>
            </TableRow>
        </TableHead>
    );
}