import React from 'react';
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
                            placeholder={PLACEHOLDER_TEXTS.CAR_NUMBER}
                            size="small"
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
                            placeholder={PLACEHOLDER_TEXTS.COMPANY}
                            size="small"
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
                            placeholder={PLACEHOLDER_TEXTS.DESTINATION}
                            size="small"
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
                            placeholder={PLACEHOLDER_TEXTS.ITEM}
                            size="small"
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
                        if (value === '' || NUMBER_INPUT_LIMITS.WEIGHT_REGEX.test(value)) {
                            onChange(idx, 'weight', value);
                        }
                    }}
                    size="small"
                    sx={inputFieldStyles}
                />
            </TableCell>
            <TableCell sx={tableDataCellStyles}>
                <TextField
                    value={row.count}
                    onChange={(e) => {
                        const value = e.target.value.replace(NUMBER_INPUT_LIMITS.INTEGER_REGEX, '');
                        onChange(idx, 'count', value);
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
                        onChange(idx, 'unitPrice', value);
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
                            onChange(idx, 'supplyPrice', value);
                        }}
                        size="small"
                        placeholder={PLACEHOLDER_TEXTS.SUPPLY_PRICE}
                        sx={inputFieldStyles}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onCalculate(idx, CALCULATION_TYPES.SUPPLY as 'supply')}
                        sx={calculateButtonStyles}
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