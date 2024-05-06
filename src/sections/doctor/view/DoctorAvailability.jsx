import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Table, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

const DoctorAvailability = ({ availability }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Available Days</TableCell>
                    <TableCell>Shift Time</TableCell>
                    <TableCell>Shift Start Time</TableCell>
                    <TableCell>Shift End Time</TableCell>
                    <TableCell>Consultation Time</TableCell>
                    <TableCell>Config Type</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {availability.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.availableDays}</TableCell>
                        <TableCell>{item.shiftTime}</TableCell>
                        <TableCell>{item.shiftStartTime}</TableCell>
                        <TableCell>{item.shiftEndTime}</TableCell>
                        <TableCell>{item.consultationTime}</TableCell>
                        <TableCell>{item.configType}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

DoctorAvailability.propTypes = {
    availability: PropTypes.arrayOf(
        PropTypes.shape({
            availableDays: PropTypes.string.isRequired,
            shiftTime: PropTypes.string.isRequired,
            shiftStartTime: PropTypes.string.isRequired,
            shiftEndTime: PropTypes.string.isRequired,
            consultationTime: PropTypes.string.isRequired,
            configType: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default DoctorAvailability;