import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
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
    FormControl,
    TableContainer,
    FormHelperText,
} from '@mui/material';

const DoctorAvailability = ({
    availability,
    onAvailabilityChange = () => {},
    isEditing = false,
}) => {
    const [editedAvailability, setEditedAvailability] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setEditedAvailability(availability);
    }, [availability]);

    const handleAvailabilityChange = (index, field, value) => {
        if (field === 'consultationTime') {
            value = Number(value);
        }

        const validateTimes = (startTime, endTime) => {
            if (!startTime || !endTime) return;

            const start = dayjs(startTime, 'HH:mm:ss');
            const end = dayjs(endTime, 'HH:mm:ss');

            const newErrors = { ...errors };
            if (!newErrors[index]) newErrors[index] = {};

            if (start.isAfter(end)) {
                newErrors[index].shiftStartTime = 'Start time must be before end time';
                newErrors[index].shiftEndTime = 'End time must be after start time';
            } else {
                delete newErrors[index].shiftStartTime;
                delete newErrors[index].shiftEndTime;
            }

            setErrors(newErrors);
        };

        if (field === 'shiftStartTime' || field === 'shiftEndTime') {
            const otherTime =
                field === 'shiftStartTime'
                    ? editedAvailability[index].shiftEndTime
                    : editedAvailability[index].shiftStartTime;
            validateTimes(
                field === 'shiftStartTime' ? value : otherTime,
                field === 'shiftEndTime' ? value : otherTime
            );
        }

        const updatedAvailability = editedAvailability.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
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

    const renderSelect = (index, item, field, options, label) => (
        <FormControl error={!!errors[index]?.[field]} fullWidth>
            <Select
                value={item[field] || ''}
                displayEmpty
                renderValue={(value) => (value === '' ? `Select ${label}` : value)}
                onChange={(e) => handleAvailabilityChange(index, field, e.target.value)}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
            {errors[index]?.[field] && <FormHelperText>{errors[index][field]}</FormHelperText>}
        </FormControl>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            {isEditing && <TableCell align="center">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {editedAvailability.map((item, index) => (
                            <TableRow key={index}>
                                {isEditing ? (
                                    <>
                                        <TableCell>
                                            {renderSelect(
                                                index,
                                                item,
                                                'availableDays',
                                                weekDays,
                                                'Day'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {renderSelect(
                                                index,
                                                item,
                                                'shiftTime',
                                                shiftTimes,
                                                'Time'
                                            )}
                                        </TableCell>
                                        <TableCell style={{ minWidth: '175px' }}>
                                            <TimePicker
                                                value={
                                                    item.shiftStartTime
                                                        ? dayjs(item.shiftStartTime, 'HH:mm:ss')
                                                        : null
                                                }
                                                onChange={(value) =>
                                                    handleAvailabilityChange(
                                                        index,
                                                        'shiftStartTime',
                                                        value ? value.format('HH:mm:ss') : ''
                                                    )
                                                }
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors[index]?.shiftStartTime,
                                                        helperText:
                                                            errors[index]?.shiftStartTime || '',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ minWidth: '175px' }}>
                                            <TimePicker
                                                value={
                                                    item.shiftEndTime
                                                        ? dayjs(item.shiftEndTime, 'HH:mm:ss')
                                                        : null
                                                }
                                                onChange={(value) =>
                                                    handleAvailabilityChange(
                                                        index,
                                                        'shiftEndTime',
                                                        value ? value.format('HH:mm:ss') : ''
                                                    )
                                                }
                                                slotProps={{
                                                    textField: {
                                                        error: !!errors[index]?.shiftEndTime,
                                                        helperText:
                                                            errors[index]?.shiftEndTime || '',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={item.consultationTime || ''}
                                                label="In Minutes"
                                                style={{ minWidth: '150px' }}
                                                onChange={(e) =>
                                                    handleAvailabilityChange(
                                                        index,
                                                        'consultationTime',
                                                        e.target.value
                                                    )
                                                }
                                                inputProps={{
                                                    type: 'number',
                                                    min: 2,
                                                    max: 60,
                                                }}
                                                error={!!errors[index]?.consultationTime}
                                                helperText={errors[index]?.consultationTime || ''}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {renderSelect(
                                                index,
                                                item,
                                                'configType',
                                                configTypes,
                                                'Config'
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => handleDeleteRow(index)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{item.availableDays}</TableCell>
                                        <TableCell>{item.shiftTime}</TableCell>
                                        <TableCell>{item.shiftStartTime}</TableCell>
                                        <TableCell>{item.shiftEndTime}</TableCell>
                                        <TableCell>{item.consultationTime}</TableCell>
                                        <TableCell>{item.configType}</TableCell>
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
                        style={{ marginTop: '16px', marginLeft: '12px', marginBottom: '16px' }}
                    >
                        Add Row
                    </Button>
                )}
            </TableContainer>
        </LocalizationProvider>
    );
};

DoctorAvailability.propTypes = {
    availability: PropTypes.arrayOf(
        PropTypes.shape({
            availableDays: PropTypes.string.isRequired,
            shiftTime: PropTypes.string.isRequired,
            shiftStartTime: PropTypes.string.isRequired,
            shiftEndTime: PropTypes.string.isRequired,
            consultationTime: PropTypes.number.isRequired,
            configType: PropTypes.string.isRequired,
        })
    ).isRequired,
    onAvailabilityChange: PropTypes.func,
    isEditing: PropTypes.bool,
};

export default DoctorAvailability;
