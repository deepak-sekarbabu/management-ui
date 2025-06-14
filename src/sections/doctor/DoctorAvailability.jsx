import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
// MUI date pickers and adapter
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// MUI core components for table and form elements
import {
    Box, // Added Box for flexible layout
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
    IconButton, // For delete icon button
    FormControl,
    TableContainer,
    FormHelperText,
} from '@mui/material'; // Icon for delete button

// Component to manage doctor's availability schedule
const DoctorAvailability = ({
    availability, // Array of availability slots
    onAvailabilityChange = () => {}, // Callback function when availability changes
    isEditing = false, // Boolean to toggle edit mode
}) => {
    // State Variables:
    // `editedAvailability`: Local state to hold the availability data being edited.
    // Synchronized with the `availability` prop.
    const [editedAvailability, setEditedAvailability] = useState([]);
    // `errors`: Local state to store validation errors for each row and field.
    // Structure: { rowIndex: { fieldName: "error message" } }
    const [errors, setErrors] = useState({});

    // Effect Hook:
    // Synchronizes `editedAvailability` with the `availability` prop when the prop changes.
    // This ensures that if the parent component updates the availability, the local state reflects these changes.
    useEffect(() => {
        // Ensure that the availability prop is an array before setting it
        const validAvailability = Array.isArray(availability)
            ? availability.map((item) => ({ ...item })) // Create a shallow copy of items
            : [];
        setEditedAvailability(validAvailability);
    }, [availability]);

    // Validation and Change Handling:

    // `validateRow`: Validates a single availability row.
    const validateRow = useCallback(
        (index, rowData) => {
            const newErrors = { ...errors };
            if (!newErrors[index]) newErrors[index] = {};

            // Validate required fields
            if (!rowData.availableDays) newErrors[index].availableDays = 'Day is required.';
            else delete newErrors[index].availableDays;

            if (!rowData.shiftTime) newErrors[index].shiftTime = 'Shift is required.';
            else delete newErrors[index].shiftTime;

            if (!rowData.configType) newErrors[index].configType = 'Config type is required.';
            else delete newErrors[index].configType;

            // Validate consultationTime: must be a positive number
            if (
                rowData.consultationTime === null ||
                rowData.consultationTime === undefined ||
                String(rowData.consultationTime).trim() === ''
            ) {
                newErrors[index].consultationTime = 'Consultation time is required.';
            } else if (
                Number.isNaN(Number(rowData.consultationTime)) ||
                Number(rowData.consultationTime) <= 0
            ) {
                newErrors[index].consultationTime = 'Must be a positive number (minutes).';
            } else if (Number(rowData.consultationTime) > 120) {
                // Example: Max 2 hours
                newErrors[index].consultationTime = 'Cannot exceed 120 minutes.';
            } else {
                delete newErrors[index].consultationTime;
            }

            // Validate shiftStartTime and shiftEndTime
            if (!rowData.shiftStartTime) {
                newErrors[index].shiftStartTime = 'Start time is required.';
            } else {
                delete newErrors[index].shiftStartTime; // Clear previous error if valid now
            }
            if (!rowData.shiftEndTime) {
                newErrors[index].shiftEndTime = 'End time is required.';
            } else {
                delete newErrors[index].shiftEndTime; // Clear previous error if valid now
            }

            // Time range validation (start time before end time)
            if (rowData.shiftStartTime && rowData.shiftEndTime) {
                const start = dayjs(rowData.shiftStartTime, 'HH:mm:ss');
                const end = dayjs(rowData.shiftEndTime, 'HH:mm:ss');
                if (start.isValid() && end.isValid() && start.isAfter(end)) {
                    newErrors[index].shiftStartTime = 'Start time must be before end time.';
                    newErrors[index].shiftEndTime = 'End time must be after start time.';
                } else {
                    // If times are valid relative to each other, clear these specific errors
                    // but preserve other unrelated errors for these fields.
                    if (newErrors[index].shiftStartTime === 'Start time must be before end time.') {
                        delete newErrors[index].shiftStartTime;
                    }
                    if (newErrors[index].shiftEndTime === 'End time must be after start time.') {
                        delete newErrors[index].shiftEndTime;
                    }
                }
            }
            setErrors(newErrors);
            return Object.keys(newErrors[index] || {}).length === 0; // Return true if no errors for this row
        },
        [errors]
    ); // errors is a dependency

    // `handleAvailabilityChange`: Updates the `editedAvailability` state when a field changes.
    // Also triggers validation for the affected row.
    const handleAvailabilityChange = useCallback(
        (index, field, value) => {
            let processedValue = value;
            // Ensure consultationTime is stored as a number
            if (field === 'consultationTime') {
                processedValue = value === '' ? '' : Number(value); // Allow empty string for intermediate input state
            }

            const updatedAvailability = editedAvailability.map((item, i) =>
                i === index ? { ...item, [field]: processedValue } : item
            );
            setEditedAvailability(updatedAvailability);
            validateRow(index, updatedAvailability[index]); // Validate after state update
            onAvailabilityChange(updatedAvailability); // Propagate changes to parent
        },
        [editedAvailability, onAvailabilityChange, validateRow]
    ); // Dependencies for useCallback

    // `handleDeleteRow`: Removes an availability slot (row) from `editedAvailability`.
    const handleDeleteRow = useCallback(
        (index) => {
            const updatedAvailability = editedAvailability.filter((_, i) => i !== index);
            setEditedAvailability(updatedAvailability);
            // Clean up errors for the deleted row
            const newErrors = { ...errors };
            delete newErrors[index];
            // Re-index subsequent errors if necessary (though less critical if keys are just indices)
            setErrors(newErrors);
            onAvailabilityChange(updatedAvailability);
        },
        [editedAvailability, onAvailabilityChange, errors]
    );

    // `handleAddRow`: Adds a new, empty availability slot to `editedAvailability`.
    const handleAddRow = useCallback(() => {
        const newRow = {
            availableDays: '', // Default to empty or a sensible default like 'MONDAY'
            shiftTime: '', // Default to empty or 'MORNING'
            shiftStartTime: '', // e.g., '09:00:00'
            shiftEndTime: '', // e.g., '12:00:00'
            consultationTime: 15, // Default consultation time, e.g., 15 minutes
            configType: 'APPOINTMENT', // Default config type
        };
        setEditedAvailability([...editedAvailability, newRow]);
        // Optionally, immediately validate the new row to show required field errors
        // validateRow(editedAvailability.length, newRow);
        // No need to call onAvailabilityChange here, let user fill and then it gets called by handleAvailabilityChange
    }, [editedAvailability]);

    // Data Arrays for Select Options:
    const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const shiftTimes = ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT']; // General time slots
    const configTypes = ['APPOINTMENT', 'QUEUE']; // Configuration types for availability

    // Helper function to render Select components within table cells.
    // `index`: Row index.
    // `item`: The availability data for the current row.
    // `field`: The field name in `item` to bind the Select to.
    // `options`: Array of strings for Select options.
    // `label`: Placeholder label for the Select.
    const renderSelect = (index, item, field, options, label) => (
        <FormControl error={!!errors[index]?.[field]} fullWidth sx={{ minWidth: 120 }}>
            {' '}
            {/* Ensure FormControl takes full width of cell */}
            <Select
                value={item[field] || ''} // Controlled component: value must not be undefined
                onChange={(e) => handleAvailabilityChange(index, field, e.target.value)}
                displayEmpty // Allows showing placeholder
                // renderValue is used to show placeholder when value is empty
                renderValue={(selectedValue) => {
                    if (!selectedValue) {
                        return <em>Select {label}</em>; // Placeholder text
                    }
                    return selectedValue;
                }}
                inputProps={{ 'aria-label': `Select ${label} for row ${index + 1}` }} // Accessibility
            >
                {/* Default disabled item for placeholder functionality */}
                <MenuItem disabled value="">
                    <em>Select {label}</em>
                </MenuItem>
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
            {errors[index]?.[field] && <FormHelperText>{errors[index][field]}</FormHelperText>}
        </FormControl>
    );

    // Rendering Logic:
    // Uses MUI `TableContainer`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`.
    // Conditionally renders input fields (if `isEditing` is true) or plain text.
    // `LocalizationProvider` wraps the component for `TimePicker` usage.
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* TableContainer allows horizontal scrolling on smaller screens if content overflows */}
            <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                    {' '}
                    {/* minWidth helps with horizontal scrolling if needed */}
                    <TableHead>
                        <TableRow>
                            {/* Column Headers */}
                            <TableCell sx={{ fontWeight: 'bold' }}>Available Days</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Shift Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Shift Start Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Shift End Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                Consultation Time (min)
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Config Type</TableCell>
                            {isEditing && (
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {editedAvailability.map((item, index) => (
                            // Each row in the table represents an availability slot
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {isEditing ? (
                                    // EDIT MODE: Render form elements in table cells
                                    <>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            {' '}
                                            {/* Align top for better layout with helper texts */}
                                            {renderSelect(
                                                index,
                                                item,
                                                'availableDays',
                                                weekDays,
                                                'Day'
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            {renderSelect(
                                                index,
                                                item,
                                                'shiftTime',
                                                shiftTimes,
                                                'Shift'
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: { xs: 150, sm: 180 },
                                                verticalAlign: 'top',
                                            }}
                                        >
                                            {' '}
                                            {/* Responsive minWidth */}
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
                                                        fullWidth: true, // Make TextField take full cell width
                                                        error: !!errors[index]?.shiftStartTime,
                                                        helperText:
                                                            errors[index]?.shiftStartTime || '',
                                                        'aria-label': `Shift start time for row ${index + 1}`,
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: { xs: 150, sm: 180 },
                                                verticalAlign: 'top',
                                            }}
                                        >
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
                                                        fullWidth: true,
                                                        error: !!errors[index]?.shiftEndTime,
                                                        helperText:
                                                            errors[index]?.shiftEndTime || '',
                                                        'aria-label': `Shift end time for row ${index + 1}`,
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: { xs: 120, sm: 150 },
                                                verticalAlign: 'top',
                                            }}
                                        >
                                            <TextField
                                                value={
                                                    item.consultationTime === undefined
                                                        ? ''
                                                        : item.consultationTime
                                                } // Handle undefined for controlled input
                                                // label="Minutes" // Label can be redundant due to column header
                                                onChange={(e) =>
                                                    handleAvailabilityChange(
                                                        index,
                                                        'consultationTime',
                                                        e.target.value
                                                    )
                                                }
                                                type="number"
                                                fullWidth // Make TextField take full cell width
                                                inputProps={{
                                                    min: 1, // Min 1 minute for consultation
                                                    max: 120, // Max 120 minutes (2 hours)
                                                    'aria-label': `Consultation time in minutes for row ${index + 1}`,
                                                }}
                                                error={!!errors[index]?.consultationTime}
                                                helperText={errors[index]?.consultationTime || ''}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            {renderSelect(
                                                index,
                                                item,
                                                'configType',
                                                configTypes,
                                                'Config Type'
                                            )}
                                        </TableCell>
                                        <TableCell align="center" sx={{ verticalAlign: 'middle' }}>
                                            {' '}
                                            {/* Align button middle */}
                                            <IconButton
                                                onClick={() => handleDeleteRow(index)}
                                                aria-label={`Delete availability row ${index + 1}`}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </>
                                ) : (
                                    // VIEW MODE: Display data as plain text in table cells
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
                    // "Add Row" button, displayed only in edit mode
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                        }}
                    >
                        {' '}
                        {/* Responsive alignment */}
                        <Button
                            variant="outlined"
                            onClick={handleAddRow}
                            aria-label="Add new availability slot"
                            sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on small screens
                        >
                            Add Row
                        </Button>
                    </Box>
                )}
            </TableContainer>
        </LocalizationProvider>
    );
};

// PropTypes for type checking, ensuring component receives props of correct type.
DoctorAvailability.propTypes = {
    availability: PropTypes.arrayOf(
        PropTypes.shape({
            availableDays: PropTypes.string, // Not strictly isRequired initially for a new row
            shiftTime: PropTypes.string,
            shiftStartTime: PropTypes.string,
            shiftEndTime: PropTypes.string,
            consultationTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Can be string then converted
            configType: PropTypes.string,
        })
    ), // Not isRequired, can be empty array initially. Defaulted in component.
    onAvailabilityChange: PropTypes.func, // Callback for changes
    isEditing: PropTypes.bool, // Toggles edit mode
};

// Default value for availability if not provided
DoctorAvailability.defaultProps = {
    availability: [],
    onAvailabilityChange: () => {},
    isEditing: false,
};

export default DoctorAvailability;
