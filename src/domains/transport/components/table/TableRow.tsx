import { useCallback } from 'react';
import {
    TableRow as MuiTableRow,
    TableCell,
    IconButton,
    TextField,
    Autocomplete,
    Box,
    Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Calculate as CalculateIcon } from '@mui/icons-material';
import type { TransportRow } from '../../types';
import { TransportCalculator } from '../../utils/calculations';
import {
    tableDataRowStyles,
    tableDataCellStyles,
    tableDataCellRightStyles,
    numberCellStyles,
    inputFieldStyles,
    calculateButtonStyles,
    deleteButtonStyles,
    dateInputContainerStyles,
    dateTextStyles,
    dateInputFieldStyles,
    calculateButtonContainerStyles,
} from '../../styles/tableStyles';
import {
    DATE_INPUT_LIMITS,
    NUMBER_INPUT_LIMITS,
    CALCULATION_TYPES,
    PLACEHOLDER_TEXTS,
} from '../../constants';

interface TableRowProps {
    row: TransportRow;
    idx: number;
    currentMonth: number;
    options: {
        carNumbers: string[];
        companies: string[];
        destinations: string[];
        items: string[];
        weights: string[];
        counts: string[];
        unitPrices: string[];
    };
    onChange: (idx: number, field: keyof TransportRow, value: string) => void;
    onDeleteRow: (idx: number) => void;
    onCalculate: (idx: number, type: 'supply' | 'tax' | 'total') => void;
}

export function TableRow({
    row,
    idx,
    currentMonth,
    options,
    onChange,
    onDeleteRow,
    onCalculate,
}: TableRowProps) {
    // 수량이나 단가가 변경될 때 공급가액 자동 계산
    const handleCountOrUnitPriceChange = useCallback((field: 'count' | 'unitPrice', value: string) => {
        onChange(idx, field, value);

        // 수량과 단가가 모두 있으면 공급가액 자동 계산
        const newCount = field === 'count' ? value : row.count;
        const newUnitPrice = field === 'unitPrice' ? value : row.unitPrice;

        if (newCount && newUnitPrice) {
            const supplyPrice = TransportCalculator.calculateSupplyPrice(newCount, newUnitPrice);
            onChange(idx, 'supplyPrice', supplyPrice.toString());

            // 공급가액이 변경되었으므로 세액과 합계금액도 자동 계산
            const tax = TransportCalculator.calculateTax(supplyPrice.toString());
            const totalPrice = TransportCalculator.calculateTotal(supplyPrice.toString(), tax.toString());

            onChange(idx, 'tax', tax.toString());
            onChange(idx, 'totalPrice', totalPrice.toString());
        }
    }, [idx, onChange, row.count, row.unitPrice]);

    // 공급가액이 변경될 때 세액과 합계금액 자동 계산
    const handleSupplyPriceChange = useCallback((value: string) => {
        onChange(idx, 'supplyPrice', value);

        if (value) {
            // 세액 자동 계산 (공급가액의 10%)
            const tax = TransportCalculator.calculateTax(value);
            onChange(idx, 'tax', tax.toString());

            // 합계금액 자동 계산 (공급가액 + 세액)
            const totalPrice = TransportCalculator.calculateTotal(value, tax.toString());
            onChange(idx, 'totalPrice', totalPrice.toString());
        }
    }, [idx, onChange]);

    return (
        <MuiTableRow sx={tableDataRowStyles}>
            <TableCell sx={numberCellStyles}>
                {idx + 1}
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <Box sx={dateInputContainerStyles}>
                    <Typography variant="body2" color="#6b7280" sx={dateTextStyles}>
                        {currentMonth}/
                    </Typography>
                    <TextField
                        value={row.date}
                        onChange={(e) => {
                            const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                            if (value === '' || (parseInt(value) >= DATE_INPUT_LIMITS.MIN && parseInt(value) <= DATE_INPUT_LIMITS.MAX)) {
                                onChange(idx, 'date', value);
                            }
                        }}
                        size="small"
                        sx={dateInputFieldStyles}
                    />
                </Box>
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <Autocomplete
                    options={options.carNumbers}
                    value={row.carNumber}
                    onChange={(_, newValue) => {
                        onChange(idx, 'carNumber', newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                        onChange(idx, 'carNumber', newInputValue);
                    }}
                    freeSolo
                    filterOptions={(options, { inputValue }) => {
                        return options.filter(option =>
                            option && option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder={PLACEHOLDER_TEXTS.CAR_NUMBER}
                            sx={inputFieldStyles}
                        />
                    )}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <Autocomplete
                    options={options.companies}
                    value={row.company}
                    onChange={(_, newValue) => {
                        onChange(idx, 'company', newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                        onChange(idx, 'company', newInputValue);
                    }}
                    freeSolo
                    filterOptions={(options, { inputValue }) => {
                        return options.filter(option =>
                            option && option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder={PLACEHOLDER_TEXTS.COMPANY}
                            sx={inputFieldStyles}
                        />
                    )}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <Autocomplete
                    options={options.destinations}
                    value={row.destination}
                    onChange={(_, newValue) => {
                        onChange(idx, 'destination', newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                        onChange(idx, 'destination', newInputValue);
                    }}
                    freeSolo
                    filterOptions={(options, { inputValue }) => {
                        return options.filter(option =>
                            option && option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder={PLACEHOLDER_TEXTS.DESTINATION}
                            sx={inputFieldStyles}
                        />
                    )}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <Autocomplete
                    options={options.items}
                    value={row.item}
                    onChange={(_, newValue) => {
                        onChange(idx, 'item', newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                        onChange(idx, 'item', newInputValue);
                    }}
                    freeSolo
                    filterOptions={(options, { inputValue }) => {
                        return options.filter(option =>
                            option && option.toLowerCase().includes(inputValue.toLowerCase())
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder={PLACEHOLDER_TEXTS.ITEM}
                            sx={inputFieldStyles}
                        />
                    )}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <TextField
                    value={row.weight}
                    onChange={(e) => {
                        const value = e.target.value;
                        // 소수점과 숫자만 허용 (소수점 3자리까지)
                        if (value === '' || NUMBER_INPUT_LIMITS.WEIGHT_REGEX.test(value)) {
                            onChange(idx, 'weight', value);
                        }
                    }}
                    size="small"
                    placeholder="중량"
                    sx={inputFieldStyles}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <TextField
                    value={row.count}
                    onChange={(e) => {
                        const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                        handleCountOrUnitPriceChange('count', value);
                    }}
                    size="small"
                    sx={inputFieldStyles}
                />
            </TableCell>
            <TableCell sx={tableDataCellRightStyles}>
                <TextField
                    value={row.unitPrice ? TransportCalculator.formatKoreanCurrency(row.unitPrice) : ''}
                    onChange={(e) => {
                        const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                        handleCountOrUnitPriceChange('unitPrice', value);
                    }}
                    size="small"
                    placeholder={PLACEHOLDER_TEXTS.UNIT_PRICE}
                    sx={inputFieldStyles}
                />
            </TableCell>
            <TableCell sx={tableDataCellRightStyles}>
                <Box sx={calculateButtonContainerStyles}>
                    <TextField
                        value={row.supplyPrice ? TransportCalculator.formatKoreanCurrency(row.supplyPrice) : ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                            handleSupplyPriceChange(value);
                        }}
                        size="small"
                        placeholder={PLACEHOLDER_TEXTS.SUPPLY_PRICE}
                        sx={inputFieldStyles}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onCalculate(idx, CALCULATION_TYPES.SUPPLY as 'supply')}
                        sx={calculateButtonStyles}
                        title="수량 × 단가로 공급가액 계산"
                    >
                        <CalculateIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </TableCell>
            <TableCell sx={tableDataCellRightStyles}>
                <Box sx={calculateButtonContainerStyles}>
                    <TextField
                        value={row.tax ? TransportCalculator.formatKoreanCurrency(row.tax) : ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                            onChange(idx, 'tax', value);
                        }}
                        size="small"
                        placeholder={PLACEHOLDER_TEXTS.TAX}
                        sx={inputFieldStyles}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onCalculate(idx, CALCULATION_TYPES.TAX as 'tax')}
                        sx={calculateButtonStyles}
                        title="공급가액의 10%로 세액 계산"
                    >
                        <CalculateIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </TableCell>
            <TableCell sx={tableDataCellRightStyles}>
                <Box sx={calculateButtonContainerStyles}>
                    <TextField
                        value={row.totalPrice ? TransportCalculator.formatKoreanCurrency(row.totalPrice) : ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                            onChange(idx, 'totalPrice', value);
                        }}
                        size="small"
                        placeholder={PLACEHOLDER_TEXTS.TOTAL_PRICE}
                        sx={inputFieldStyles}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onCalculate(idx, CALCULATION_TYPES.TOTAL as 'total')}
                        sx={calculateButtonStyles}
                        title="공급가액 + 세액으로 합계금액 계산"
                    >
                        <CalculateIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <IconButton
                    size="small"
                    onClick={() => onDeleteRow(idx)}
                    sx={deleteButtonStyles}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </MuiTableRow>
    );
}