import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

export default function QueueTableHead({
    order,
    orderBy,
    rowCount,
    headLabel,
    numSelected,
    onRequestSort,
    onSelectAllClick,
    shiftTimeFilter,
    setShiftTimeFilter,
    patientReachedFilter,
    setPatientReachedFilter,
}) {
    const onSort = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{ width: 48 }}>
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>

                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={onSort(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                        {headCell.id === 'shiftTime' && (
                            <Select
                                value={shiftTimeFilter}
                                onChange={(e) => setShiftTimeFilter(e.target.value)}
                                displayEmpty
                                sx={{ marginTop: 1 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="MORNING">Morning</MenuItem>
                                <MenuItem value="AFTERNOON">Afternoon</MenuItem>
                                <MenuItem value="EVENING">Evening</MenuItem>
                                <MenuItem value="NIGHT">Night</MenuItem>
                            </Select>
                        )}
                        {headCell.id === 'patientReached' && (
                            <Select
                                value={patientReachedFilter}
                                onChange={(e) => setPatientReachedFilter(e.target.value)}
                                displayEmpty
                                sx={{ marginTop: 1 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

QueueTableHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    headLabel: PropTypes.array,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func,
    shiftTimeFilter: PropTypes.string,
    setShiftTimeFilter: PropTypes.func,
    patientReachedFilter: PropTypes.string,
    setPatientReachedFilter: PropTypes.func,
};
