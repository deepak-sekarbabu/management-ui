import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
    Paper,
    Table,
    Button,
    Select,
    MenuItem,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    TableContainer,

} from '@mui/material';

const DoctorAvailability = ({ availability, onAvailabilityChange, isEditing }) => {
    const [editedAvailability, setEditedAvailability] = useState(availability);

    const handleAvailabilityChange = (index, field, value) => {
        setEditedAvailability((prevState) =>
            prevState.map((item, i) =>
                i === index ? { ...item, [field]: value.toUpperCase() } : item
            )
        );
        onAvailabilityChange(editedAvailability);
    };

    const handleDeleteRow = (index) => {
        setEditedAvailability((prevState) => prevState.filter((_, i) => i !== index));
        onAvailabilityChange(editedAvailability);
    };

    const handleAddRow = () => {
        setEditedAvailability((prevState) => [
            ...prevState,
            {
                availableDays: '',
                shiftTime: '',
                shiftStartTime: '',
                shiftEndTime: '',
                consultationTime: '',
                configType: '',
            },
        ]);
    };

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Available Days</TableCell>
                        <TableCell align="left">Shift Time</TableCell>
                        <TableCell align="left">Shift Start Time</TableCell>
                        <TableCell align="left">Shift End Time</TableCell>
                        <TableCell align="left">Consultation Time</TableCell>
                        <TableCell align="left">Config Type</TableCell>
                        {isEditing && <TableCell align="center">Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {editedAvailability.map((item, index) => (
                        <TableRow key={index}>
                            {isEditing ? (
                                <>
                                    <TableCell align="left">
                                        <Select
                                            value={weekDays.find((day) => day.toUpperCase() === item.availableDays)}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'availableDays', e.target.value)
                                            }
                                        >
                                            {weekDays.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            value={item.shiftTime}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'shiftTime', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            value={item.shiftStartTime}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'shiftStartTime', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            value={item.shiftEndTime}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'shiftEndTime', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            value={item.consultationTime}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'consultationTime', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            value={item.configType}
                                            onChange={(e) =>
                                                handleAvailabilityChange(index, 'configType', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button onClick={() => handleDeleteRow(index)}>Delete</Button>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell align="left">{item.availableDays}</TableCell>
                                    <TableCell align="left">{item.shiftTime}</TableCell>
                                    <TableCell align="left">{item.shiftStartTime}</TableCell>
                                    <TableCell align="left">{item.shiftEndTime}</TableCell>
                                    <TableCell align="left">{item.consultationTime}</TableCell>
                                    <TableCell align="left">{item.configType}</TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {isEditing && (
                <Button onClick={handleAddRow} style={{ marginTop: '16px' }}>
                    Add Row
                </Button>
            )}
        </TableContainer>
    );
};

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
    onAvailabilityChange: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};

export default DoctorAvailability;