import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Paper, Table, Button, Select, MenuItem, TableRow, TableBody, TableCell, TableHead, TextField, TableContainer,
} from '@mui/material';

const DoctorAvailability = ({ availability, onAvailabilityChange, isEditing }) => {
    const [editedAvailability, setEditedAvailability] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setEditedAvailability(availability);
    }, [availability]);

    const handleAvailabilityChange = (index, field, value) => {
        if (field === 'consultationTime') {
            value = Number(value);
        }

        if (field === 'shiftStartTime') {
            const shiftEndTime = dayjs(editedAvailability[index].shiftEndTime, 'HH:mm:ss');
            const shiftStartTime = dayjs(value, 'HH:mm:ss');
            if (shiftStartTime.isAfter(shiftEndTime)) {
                console.log('Shift start time must be less than shift end time.');
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftStartTime: 'Shift start time must be less than shift end time.',
                    },
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftStartTime: null,
                    },
                }));
            }
            // Revalidate shiftEndTime
            const RevalidateShiftEndTime = dayjs(editedAvailability[index].shiftEndTime, 'HH:mm:ss');
            if (RevalidateShiftEndTime.isBefore(shiftStartTime)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftEndTime: 'Shift end time must be greater than shift start time.',
                    },
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftEndTime: null,
                    },
                }));
            }
        }

        if (field === 'shiftEndTime') {
            const shiftStartTime = dayjs(editedAvailability[index].shiftStartTime, 'HH:mm:ss');
            const shiftEndTime = dayjs(value, 'HH:mm:ss');
            console.log(shiftStartTime, shiftEndTime);
            if (shiftEndTime.isBefore(shiftStartTime)) {
                console.log('Shift end time must be greater than shift start time.');
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftEndTime: 'Shift end time must be greater than shift start time.',
                    },
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftEndTime: null,
                    },
                }));
            }
            // Revalidate shiftStartTime
            const RevalidateShiftStartTime = dayjs(editedAvailability[index].shiftStartTime, 'HH:mm:ss');
            if (RevalidateShiftStartTime.isAfter(shiftEndTime)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftStartTime: 'Shift start time must be less than shift end time.',
                    },
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [index]: {
                        ...prevErrors[index],
                        shiftStartTime: null,
                    },
                }));
            }
        }

        if (field === 'availableDays' && !value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [index]: {
                    ...prevErrors[index],
                    availableDays: 'Available days cannot be empty',
                },
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [index]: {
                    ...prevErrors[index],
                    availableDays: null,
                },
            }));
        }

        const updatedAvailability = editedAvailability.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setEditedAvailability(updatedAvailability);
        onAvailabilityChange(updatedAvailability);
    };

    const handleDeleteRow = (index) => {
        const updatedAvailability = editedAvailability.filter((_, i) => i !== index);
        setEditedAvailability(updatedAvailability);
        onAvailabilityChange(updatedAvailability);
    };

    const handleAddRow = () => {
        setEditedAvailability([
            ...editedAvailability,
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

    const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const shiftTimes = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'];
    const configTypes = ['APPOINTMENT', 'QUEUE'];

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
                                            id="availableDays"
                                            name="availableDays"
                                            value={item.availableDays || ''}
                                            displayEmpty
                                            renderValue={(value) => value === '' ? 'Select Day' : value}
                                            onChange={(e) => handleAvailabilityChange(index, 'availableDays', e.target.value)}
                                            error={!!errors[index]?.availableDays}
                                            helperText={errors[index]?.availableDays}
                                        >
                                            {weekDays.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Select
                                            id="shiftTime"
                                            name="shiftTime"
                                            value={item.shiftTime || ''}
                                            displayEmpty
                                            renderValue={(value) => value === '' ? 'Select Time' : value}
                                            onChange={(e) => handleAvailabilityChange(index, 'shiftTime', e.target.value)}
                                            error={!!errors[index]?.shiftTime}
                                            helperText={errors[index]?.shiftTime}
                                        >
                                            {shiftTimes.map((time) => (
                                                <MenuItem key={time} value={time}>
                                                    {time}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '175px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                value={item.shiftStartTime ? dayjs(item.shiftStartTime, 'HH:mm:ss') : null}
                                                onChange={(value) => handleAvailabilityChange(index, 'shiftStartTime', value ? value.format('HH:mm:ss') : '')}
                                                onError={!!errors[index]?.shiftStartTime}
                                                slotProps={{
                                                    textField: {
                                                        helperText: errors[index]?.shiftStartTime || '',
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '175px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                value={item.shiftEndTime ? dayjs(item.shiftEndTime, 'HH:mm:ss') : null}
                                                onChange={(value) => handleAvailabilityChange(index, 'shiftEndTime', value ? value.format('HH:mm:ss') : '')}
                                                onError={!!errors[index]?.shiftEndTime}
                                                slotProps={{
                                                    textField: {
                                                        helperText: errors[index]?.shiftEndTime || '',
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            id="consultationTime"
                                            name="consultationTime"
                                            value={item.consultationTime || ''}
                                            label='In Minutes'
                                            style={{ minWidth: '150px' }}
                                            onChange={(e) => handleAvailabilityChange(index, 'consultationTime', e.target.value)}
                                            inputProps={{
                                                type: 'number',
                                                min: 2,
                                                max: 60,
                                            }}
                                            error={!!errors[index]?.consultationTime}
                                            helperText={errors[index]?.consultationTime}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <Select
                                            id="configType"
                                            name="configType"
                                            value={item.configType || ''}
                                            displayEmpty
                                            renderValue={(value) => value === '' ? 'Select Config' : value}
                                            onChange={(e) => handleAvailabilityChange(index, 'configType', e.target.value)}
                                            error={!!errors[index]?.configType}
                                            helperText={errors[index]?.configType}
                                        >
                                            {configTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button onClick={() => handleDeleteRow(index)}>
                                            Delete
                                        </Button>
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
                <Button
                    variant="outlined"
                    onClick={handleAddRow}
                    style={{ marginTop: '16px', marginLeft: '12px' }}
                >
                    Add Row
                </Button>
            )}
        </TableContainer>
    );
};

DoctorAvailability.propTypes = {
    availability: PropTypes.arrayOf(
        PropTypes.shape({
            availableDays: PropTypes.string,
            shiftTime: PropTypes.string,
            shiftStartTime: PropTypes.string,
            shiftEndTime: PropTypes.string,
            consultationTime: PropTypes.number,
            configType: PropTypes.string,
        })
    ).isRequired,
    onAvailabilityChange: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};

export default DoctorAvailability;
