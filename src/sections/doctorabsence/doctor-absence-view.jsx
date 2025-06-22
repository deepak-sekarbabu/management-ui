/**
 * Doctor Absence Management Component
 *
 * This component provides an interface for managing doctor absence records.
 * It allows viewing, adding, and removing doctor absence information.
 *
 * Features:
 * - Responsive design for various screen sizes
 * - Accessible UI elements with proper ARIA attributes
 * - Animated transitions for better user experience
 * - Form validation and error handling
 * - Optimized performance with memoization
 */

import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { memo, useMemo, useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Box,
    Card,
    Alert,
    Paper,
    Stack,
    Table,
    Button,
    Select,
    Tooltip,
    MenuItem,
    Snackbar,
    TableRow,
    useTheme,
    Container,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    Typography,
    useMediaQuery,
    TableContainer,
    CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

/**
 * Custom hook for managing notification states and actions
 *
 * This hook centralizes notification logic to simplify the main component
 * and provide consistent notification behavior throughout the application.
 *
 * @returns {Object} Notification state and control functions
 */
const useNotification = () => {
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Memoized callback functions to prevent unnecessary re-renders
    const showError = useCallback((message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    }, []);

    const showSuccess = useCallback((message) => {
        setSuccessMessage(message);
        setSuccessOpen(true);
    }, []);

    return {
        errorOpen,
        successOpen,
        errorMessage,
        successMessage,
        showError,
        showSuccess,
        setErrorOpen,
        setSuccessOpen,
    };
};

/**
 * Reusable notification component with animation
 *
 * Displays success or error messages with appropriate styling and animations.
 * Uses Framer Motion for smooth transitions and Material UI for styling.
 *
 * @param {Object} props Component props
 * @param {boolean} props.open Whether the notification is visible
 * @param {string} props.message The notification message to display
 * @param {('error'|'success')} props.severity The type of notification
 * @param {Function} props.onClose Function to call when notification is closed
 * @returns {JSX.Element} Animated notification component
 */
const NotificationSnackbar = ({ open, message, severity, onClose }) => (
    <Snackbar
        open={open}
        autoHideDuration={severity === 'error' ? 6000 : 4000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100, marginTop: '64px' }}
        // Add role for screen readers
        role="alert"
        aria-live="assertive"
    >
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{
                    width: '100%',
                    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14)',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                    },
                    '& .MuiAlert-message': {
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiAlert-action': {
                        alignItems: 'center',
                    },
                    animation:
                        severity === 'error'
                            ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
                            : 'none',
                    '@keyframes shake': {
                        '10%, 90%': {
                            transform: 'translate3d(-1px, 0, 0)',
                        },
                        '20%, 80%': {
                            transform: 'translate3d(2px, 0, 0)',
                        },
                        '30%, 50%, 70%': {
                            transform: 'translate3d(-4px, 0, 0)',
                        },
                        '40%, 60%': {
                            transform: 'translate3d(4px, 0, 0)',
                        },
                    },
                }}
            >
                {message}
            </Alert>
        </motion.div>
    </Snackbar>
);

NotificationSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'success']).isRequired,
    onClose: PropTypes.func.isRequired,
};

/**
 * Reusable table header component
 *
 * Defines the column headers for the doctor absence table.
 * Enhanced with accessibility attributes for better screen reader support.
 *
 * @returns {JSX.Element} Table header component
 */
const AbsenceTableHeader = memo(() => (
    <TableHead>
        <TableRow>
            <TableCell scope="col">Doctor ID 🆔</TableCell>
            <TableCell scope="col">Doctor Name 🧑‍⚕️</TableCell>
            <TableCell scope="col">Absence Date 📅</TableCell>
            <TableCell scope="col">Absence Start Time ⏰</TableCell>
            <TableCell scope="col">Absence End Time ⏰</TableCell>
            <TableCell scope="col">Optional Message 📝</TableCell>
            <TableCell scope="col">Actions ⚡</TableCell>
        </TableRow>
    </TableHead>
));

// Add display name for debugging
AbsenceTableHeader.displayName = 'AbsenceTableHeader';

/**
 * Styled Components for UI Elements
 *
 * These styled components enhance the visual appearance and interactivity
 * of the UI elements while maintaining consistent styling across the application.
 */

// Animated table container with responsive styling
const AnimatedTableContainer = styled(motion.create(TableContainer))(({ theme }) => ({
    overflowX: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
        minWidth: '120px',
        transition: 'all 0.3s ease',
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            minWidth: '100px',
            fontSize: '0.8rem',
        },
    },
    // Improve table responsiveness on small screens
    [theme.breakpoints.down('md')]: {
        '& .MuiTable-root': {
            tableLayout: 'fixed',
        },
    },
}));

// Animated table row with hover effects
const AnimatedTableRow = styled(motion.create(TableRow))(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'scale(1.01)',
        transition: 'all 0.3s ease',
    },
    // Improve focus visibility for keyboard navigation
    '&:focus-within': {
        backgroundColor: theme.palette.action.selected,
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '-2px',
    },
}));

// Enhanced text field with animation and focus styles
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
        },
    },
    // Improve contrast for better accessibility
    '& .MuiInputLabel-root': {
        color: theme.palette.text.primary,
    },
    // Ensure consistent sizing on mobile
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-root': {
            fontSize: '0.9rem',
        },
        '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
        },
    },
}));

// Enhanced select component with animation and focus styles
const StyledSelect = styled(Select)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
    // Ensure consistent sizing on mobile
    [theme.breakpoints.down('sm')]: {
        '& .MuiInputBase-root': {
            fontSize: '0.9rem',
        },
    },
}));

// Styled button with enhanced hover and focus states
const StyledButton = styled(Button)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    '&:focus': {
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
    // Ensure consistent sizing on mobile
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '6px 12px',
    },
}));

/**
 * Reusable table row component for existing absences
 *
 * Displays a single doctor absence record with animation effects.
 * Enhanced with accessibility features and keyboard navigation support.
 *
 * @param {Object} props Component props
 * @param {Object} props.absence The absence record data
 * @param {Function} props.onRemove Function to call when removing the record
 * @returns {JSX.Element} Animated table row component
 */
const AbsenceTableRow = memo(({ absence, onRemove }) => {
    // Handle keyboard events for better accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRemove(absence.id);
        }
    };

    return (
        <AnimatedTableRow
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            role="row"
        >
            <TableCell role="cell">{absence.doctorId} 🆔</TableCell>
            <TableCell role="cell">{absence.doctorName} 🧑‍⚕️</TableCell>
            <TableCell role="cell">{absence.absenceDate} 📅</TableCell>
            <TableCell role="cell">{absence.absenceStartTime} ⏰</TableCell>
            <TableCell role="cell">{absence.absenceEndTime} ⏰</TableCell>
            <TableCell role="cell">
                {absence.optionalMessage ? `${absence.optionalMessage} 📝` : '-'}
            </TableCell>
            <TableCell role="cell">
                <Tooltip title={`Remove absence for ${absence.doctorName}`}>
                    <StyledButton
                        variant="outlined"
                        color="error"
                        onClick={() => onRemove(absence.id)}
                        onKeyDown={handleKeyDown}
                        aria-label={`Remove absence record for ${absence.doctorName}`}
                        tabIndex={0}
                    >
                        Remove ⚡
                    </StyledButton>
                </Tooltip>
            </TableCell>
        </AnimatedTableRow>
    );
});

// Add display name for debugging
AbsenceTableRow.displayName = 'AbsenceTableRow';

AbsenceTableRow.propTypes = {
    absence: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        doctorId: PropTypes.string.isRequired,
        doctorName: PropTypes.string.isRequired,
        absenceDate: PropTypes.string.isRequired,
        absenceStartTime: PropTypes.string.isRequired,
        absenceEndTime: PropTypes.string.isRequired,
        optionalMessage: PropTypes.string,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
};

/**
 * Form component for adding new absence records
 *
 * Provides form fields for entering new doctor absence information.
 * Includes validation and accessibility features.
 *
 * @param {Object} props Component props
 * @param {Array} props.doctorData List of available doctors
 * @param {Object} props.newRow Current form values
 * @param {Function} props.setNewRow Function to update form values
 * @param {Function} props.onSave Function to save the new record
 * @param {Function} props.onCancel Function to cancel adding
 * @param {boolean} props.isMobile Whether the device is mobile
 * @returns {JSX.Element} Form component
 */
const AbsenceForm = memo(({ doctorData, newRow, setNewRow, onSave, onCancel, isMobile }) => {
    // Validate form fields
    const isFormValid = () =>
        newRow.doctorId &&
        newRow.doctorName &&
        newRow.absenceDate &&
        newRow.absenceStartTime &&
        newRow.absenceEndTime;

    // Handle keyboard events for better accessibility
    const handleKeyDown = (e, action) =>
        e.key === 'Enter' || e.key === ' ' ? (e.preventDefault(), action()) : undefined;

    if (isMobile) {
        // Render as a card for mobile
        return (
            <Paper sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 2 }}>
                <Stack spacing={2}>
                    <StyledSelect
                        value={newRow.doctorId}
                        onChange={(e) => {
                            const selectedDoctor = doctorData.find(
                                (doctor) => doctor.doctorId === e.target.value
                            );
                            setNewRow({
                                ...newRow,
                                doctorId: e.target.value,
                                doctorName: selectedDoctor?.doctorName || '',
                            });
                        }}
                        error={!newRow.doctorId}
                        displayEmpty
                        renderValue={(value) => (value === '' ? 'Select Doctor ID' : value)}
                        aria-label="Select Doctor"
                        aria-required="true"
                        inputProps={{ 'aria-label': 'Select Doctor ID' }}
                        fullWidth
                    >
                        {doctorData.map((doctor) => (
                            <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                                {doctor.doctorId}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                    <StyledTextField
                        value={newRow.doctorName}
                        disabled
                        aria-label="Doctor Name"
                        fullWidth
                        InputProps={{
                            readOnly: true,
                            'aria-readonly': true,
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Absence Date"
                            value={newRow.absenceDate}
                            onChange={(date) => setNewRow({ ...newRow, absenceDate: date })}
                            format="dd/MM/yyyy"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    error: !newRow.absenceDate,
                                    required: true,
                                    inputProps: {
                                        'aria-label': 'Absence Date',
                                        'aria-required': 'true',
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Absence Start Time"
                            value={newRow.absenceStartTime}
                            onChange={(newValue) =>
                                setNewRow({
                                    ...newRow,
                                    absenceStartTime: newValue,
                                })
                            }
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    error: !newRow.absenceStartTime,
                                    required: true,
                                    inputProps: {
                                        'aria-label': 'Absence Start Time',
                                        'aria-required': 'true',
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Absence End Time"
                            value={newRow.absenceEndTime}
                            onChange={(newValue) =>
                                setNewRow({
                                    ...newRow,
                                    absenceEndTime: newValue,
                                })
                            }
                            shouldDisableTime={(timeValue, clockType) => {
                                if (clockType === 'minutes') return false;
                                return !!(
                                    newRow.absenceStartTime && newRow.absenceStartTime > timeValue
                                );
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    error: !newRow.absenceEndTime,
                                    required: true,
                                    inputProps: {
                                        'aria-label': 'Absence End Time',
                                        'aria-required': 'true',
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
                    <StyledTextField
                        value={newRow.optionalMessage}
                        onChange={(e) =>
                            setNewRow({
                                ...newRow,
                                optionalMessage: e.target.value,
                            })
                        }
                        size="small"
                        fullWidth
                        aria-label="Optional Message"
                        placeholder="Enter optional message"
                        inputProps={{
                            'aria-label': 'Optional Message',
                        }}
                    />
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip
                            title={
                                isFormValid() ? 'Save record' : 'Please fill all required fields'
                            }
                        >
                            <span>
                                <StyledButton
                                    variant="outlined"
                                    color="success"
                                    onClick={onSave}
                                    onKeyDown={(e) => handleKeyDown(e, onSave)}
                                    disabled={!isFormValid()}
                                    aria-label="Save absence record"
                                    tabIndex={0}
                                    size="small"
                                >
                                    Save
                                </StyledButton>
                            </span>
                        </Tooltip>
                        <StyledButton
                            variant="outlined"
                            color="error"
                            onClick={onCancel}
                            onKeyDown={(e) => handleKeyDown(e, onCancel)}
                            aria-label="Cancel adding absence record"
                            tabIndex={0}
                            size="small"
                        >
                            Cancel
                        </StyledButton>
                    </Stack>
                </Stack>
            </Paper>
        );
    }

    return (
        <AnimatedTableRow
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            role="row"
        >
            <TableCell role="cell">
                <StyledSelect
                    value={newRow.doctorId}
                    onChange={(e) => {
                        const selectedDoctor = doctorData.find(
                            (doctor) => doctor.doctorId === e.target.value
                        );
                        setNewRow({
                            ...newRow,
                            doctorId: e.target.value,
                            doctorName: selectedDoctor?.doctorName || '',
                        });
                    }}
                    error={!newRow.doctorId}
                    displayEmpty
                    renderValue={(value) => (value === '' ? 'Select Doctor ID' : value)}
                    aria-label="Select Doctor"
                    aria-required="true"
                    inputProps={{ 'aria-label': 'Select Doctor ID' }}
                    fullWidth
                >
                    {doctorData.map((doctor) => (
                        <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                            {doctor.doctorId}
                        </MenuItem>
                    ))}
                </StyledSelect>
            </TableCell>
            <TableCell role="cell">
                <StyledTextField
                    value={newRow.doctorName}
                    disabled
                    aria-label="Doctor Name"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                        'aria-readonly': true,
                    }}
                />
            </TableCell>
            <TableCell role="cell">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Absence Date"
                        value={newRow.absenceDate}
                        onChange={(date) => setNewRow({ ...newRow, absenceDate: date })}
                        format="dd/MM/yyyy"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: isMobile ? 'small' : 'medium',
                                error: !newRow.absenceDate,
                                required: true,
                                inputProps: {
                                    'aria-label': 'Absence Date',
                                    'aria-required': 'true',
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </TableCell>
            <TableCell role="cell">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        label="Absence Start Time"
                        value={newRow.absenceStartTime}
                        onChange={(newValue) =>
                            setNewRow({
                                ...newRow,
                                absenceStartTime: newValue,
                            })
                        }
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: isMobile ? 'small' : 'medium',
                                error: !newRow.absenceStartTime,
                                required: true,
                                inputProps: {
                                    'aria-label': 'Absence Start Time',
                                    'aria-required': 'true',
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </TableCell>
            <TableCell role="cell">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                        label="Absence End Time"
                        value={newRow.absenceEndTime}
                        onChange={(newValue) =>
                            setNewRow({
                                ...newRow,
                                absenceEndTime: newValue,
                            })
                        }
                        shouldDisableTime={(timeValue, clockType) => {
                            if (clockType === 'minutes') return false;
                            return !!(
                                newRow.absenceStartTime && newRow.absenceStartTime > timeValue
                            );
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: isMobile ? 'small' : 'medium',
                                error: !newRow.absenceEndTime,
                                required: true,
                                inputProps: {
                                    'aria-label': 'Absence End Time',
                                    'aria-required': 'true',
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </TableCell>
            <TableCell role="cell">
                <StyledTextField
                    value={newRow.optionalMessage}
                    onChange={(e) =>
                        setNewRow({
                            ...newRow,
                            optionalMessage: e.target.value,
                        })
                    }
                    size={isMobile ? 'small' : 'medium'}
                    fullWidth
                    aria-label="Optional Message"
                    placeholder="Enter optional message"
                    inputProps={{
                        'aria-label': 'Optional Message',
                    }}
                />
            </TableCell>
            <TableCell role="cell">
                <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
                    <Tooltip
                        title={isFormValid() ? 'Save record' : 'Please fill all required fields'}
                    >
                        <span>
                            <StyledButton
                                variant="outlined"
                                color="success"
                                onClick={onSave}
                                onKeyDown={(e) => handleKeyDown(e, onSave)}
                                disabled={!isFormValid()}
                                aria-label="Save absence record"
                                tabIndex={0}
                            >
                                Save
                            </StyledButton>
                        </span>
                    </Tooltip>
                    <StyledButton
                        variant="outlined"
                        color="error"
                        onClick={onCancel}
                        onKeyDown={(e) => handleKeyDown(e, onCancel)}
                        aria-label="Cancel adding absence record"
                        tabIndex={0}
                    >
                        Cancel
                    </StyledButton>
                </Stack>
            </TableCell>
        </AnimatedTableRow>
    );
});

// Add display name for debugging
AbsenceForm.displayName = 'AbsenceForm';

AbsenceForm.propTypes = {
    doctorData: PropTypes.array.isRequired,
    newRow: PropTypes.object.isRequired,
    setNewRow: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
};

/**
 * Reusable card component for displaying doctor absence information
 *
 * This component presents doctor absence records in a card format,
 * optimized for mobile viewing. It displays essential information
 * and provides an action button to remove the absence record.
 *
 * @param {Object} props Component props
 * @param {Object} props.absence The absence record data
 * @param {Function} props.onRemove Function to call when removing the record
 * @returns {JSX.Element} Doctor absence card component
 */
const DoctorAbsenceCard = memo(({ absence, onRemove }) => (
    <Paper
        sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
        }}
        role="region"
        aria-label={`Absence for ${absence.doctorName}`}
    >
        <Typography variant="subtitle1" fontWeight="bold">
            {absence.doctorName} 🧑‍⚕️ ({absence.doctorId} 🆔)
        </Typography>
        <Typography variant="body2">
            <b>Date 📅:</b> {absence.absenceDate}
        </Typography>
        <Typography variant="body2">
            <b>Start ⏰:</b> {absence.absenceStartTime} <b>End ⏰:</b> {absence.absenceEndTime}
        </Typography>
        {absence.optionalMessage && (
            <Typography variant="body2" color="text.secondary">
                <b>Note 📝:</b> {absence.optionalMessage}
            </Typography>
        )}
        <Box mt={1} display="flex" justifyContent="flex-end">
            <StyledButton
                variant="outlined"
                color="error"
                onClick={() => onRemove(absence.id)}
                aria-label={`Remove absence record for ${absence.doctorName}`}
                tabIndex={0}
                size="small"
            >
                Remove ⚡
            </StyledButton>
        </Box>
    </Paper>
));
DoctorAbsenceCard.displayName = 'DoctorAbsenceCard';
DoctorAbsenceCard.propTypes = {
    absence: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        doctorId: PropTypes.string.isRequired,
        doctorName: PropTypes.string.isRequired,
        absenceDate: PropTypes.string.isRequired,
        absenceStartTime: PropTypes.string.isRequired,
        absenceEndTime: PropTypes.string.isRequired,
        optionalMessage: PropTypes.string,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
};

/**
 * Main component for managing doctor absence records
 *
 * This component provides a comprehensive interface for viewing, adding,
 * and removing doctor absence information. It includes responsive design,
 * accessibility features, and performance optimizations.
 *
 * @returns {JSX.Element} Doctor absence management page
 */
const DoctorAbsencePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
    const {
        errorOpen,
        successOpen,
        errorMessage,
        successMessage,
        showError,
        showSuccess,
        setErrorOpen,
        setSuccessOpen,
    } = useNotification();

    // State management
    const [doctorAbsence, setDoctorAbsence] = useState([]);
    const [newRow, setNewRow] = useState({
        doctorId: '',
        doctorName: '',
        absenceDate: null,
        absenceStartTime: null,
        absenceEndTime: null,
        optionalMessage: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [doctorData, setDoctorData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    // Memoized clinic ID to prevent unnecessary recalculations
    const clinicId = useMemo(() => user?.clinicIds?.[0], [user?.clinicIds]);

    /**
     * Fetches doctor data from the API
     * @async
     * @returns {Promise<void>}
     */
    const fetchDoctorData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!clinicId) throw new Error('No clinic assigned to this user');

            const response = await fetch(`api/doctor-clinic/${clinicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch doctor data');

            const data = await response.json();
            setDoctorData(data);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            showError('Failed to fetch doctor data.');
        } finally {
            setLoading(false);
        }
    }, [clinicId, showError]);

    /**
     * Fetches doctor absence data from the API
     * Only fetches records after the first day of the current month
     * @async
     * @returns {Promise<void>}
     */
    const fetchDoctorAbsence = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!clinicId) throw new Error('No clinic assigned to this user');

            const today = new Date();
            // If it's the first day of the month, use today's date
            // Otherwise, use the first day of the current month
            const startDate =
                today.getDate() === 1
                    ? today.toLocaleDateString('en-GB').split('/').join('-')
                    : new Date(today.getFullYear(), today.getMonth(), 1)
                          .toLocaleDateString('en-GB')
                          .split('/')
                          .join('-');

            const response = await fetch(
                `api/doctor-absence/after-date/clinic/${clinicId}?afterDate=${startDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to fetch doctor absence data');

            const data = await response.json();
            setDoctorAbsence(data);
        } catch (error) {
            console.error('Error fetching doctor absence data:', error);
            showError('Failed to fetch doctor absence data.');
        } finally {
            setLoading(false);
        }
    }, [clinicId, showError]);

    // Effect for initial data loading
    useEffect(() => {
        fetchDoctorData();
        fetchDoctorAbsence();
    }, [fetchDoctorData, fetchDoctorAbsence]);

    /**
     * Handles removal of a doctor absence record
     * @param {number|string} id - The ID of the record to remove
     * @returns {Promise<void>}
     */
    const handleRemove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`api/doctor-absence/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to delete the record');

            setDoctorAbsence((prev) => prev.filter((absence) => absence.id !== id));
            showSuccess('Absence record deleted successfully!');
        } catch (error) {
            console.error('Error deleting the record:', error);
            showError('Failed to delete absence record.');
        }
    };

    /**
     * Handles saving a new doctor absence record
     * Formats date and time fields according to API requirements
     * @returns {Promise<void>}
     */
    const handleSave = async () => {
        if (!newRow.doctorId || !newRow.doctorName) {
            showError('Please fill in all required fields.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!clinicId) throw new Error('No clinic assigned to this user');

            // Format the absence date in DD-MM-YYYY format for API submission
            // This ensures consistency with the backend date format requirements
            const formattedData = {
                doctorId: newRow.doctorId,
                doctorName: newRow.doctorName,
                absenceDate: newRow.absenceDate
                    ? newRow.absenceDate
                          .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                          })
                          .replace(/\//g, '-')
                    : '',
                // Format time in 24-hour format (HH:MM:SS)
                absenceStartTime: newRow.absenceStartTime
                    ? newRow.absenceStartTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                      })
                    : '',
                absenceEndTime: newRow.absenceEndTime
                    ? newRow.absenceEndTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                      })
                    : '',
                optionalMessage: newRow.optionalMessage || '',
                clinicId,
            };

            const response = await fetch('api/doctor-absence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) throw new Error('Failed to save the record');

            const savedAbsence = await response.json();
            setDoctorAbsence((prev) => [...prev, savedAbsence]);
            setNewRow({
                doctorId: '',
                doctorName: '',
                absenceDate: null,
                absenceStartTime: null,
                absenceEndTime: null,
                optionalMessage: '',
            });
            setIsAdding(false);
            showSuccess('Absence record saved successfully!');
        } catch (error) {
            console.error('Error saving the record:', error);
            showError('Failed to save absence record.');
        }
    };

    /**
     * Renders the loading state with animation
     * Displays a spinner while data is being fetched from the API
     * @returns {JSX.Element} Loading state component
     */
    const renderLoadingState = () => (
        <Card
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-busy="true"
            aria-live="polite"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                [theme.breakpoints.down('sm')]: {
                    minHeight: '50vh',
                },
            }}
        >
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2">Doctor Absence Information</Typography>
                </Stack>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <CircularProgress
                            size={60}
                            aria-label="Loading doctor absence data"
                            color="primary"
                            thickness={5}
                        />
                    </motion.div>
                </Box>
            </Container>
        </Card>
    );

    // Return loading state if data is still loading
    if (isLoading) {
        return renderLoadingState();
    }

    return (
        <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            role="region"
            aria-label="Doctor Absence Management"
            sx={{
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                overflow: 'hidden',
                [theme.breakpoints.down('sm')]: {
                    p: 0.5,
                },
            }}
        >
            <Box p={isMobile ? 1 : 2}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        fontSize: isMobile ? '1.3rem' : '2rem',
                        fontWeight: 'bold',
                        color: 'primary.main',
                    }}
                >
                    Doctor Absence Information
                </Typography>

                {isMobile ? (
                    <Box>
                        {doctorAbsence.map((absence) => (
                            <DoctorAbsenceCard
                                key={absence.id}
                                absence={absence}
                                onRemove={handleRemove}
                            />
                        ))}
                        {isAdding && (
                            <Box mb={2}>
                                <AbsenceForm
                                    doctorData={doctorData}
                                    newRow={newRow}
                                    setNewRow={setNewRow}
                                    onSave={handleSave}
                                    onCancel={() => {
                                        setNewRow({
                                            doctorId: '',
                                            doctorName: '',
                                            absenceDate: null,
                                            absenceStartTime: null,
                                            absenceEndTime: null,
                                            optionalMessage: '',
                                        });
                                        setIsAdding(false);
                                    }}
                                    isMobile={isMobile}
                                />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <AnimatedTableContainer
                        component={Paper}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        elevation={2}
                    >
                        <Table aria-label="Doctor absence information table">
                            <AbsenceTableHeader />
                            <TableBody>
                                <AnimatePresence>
                                    {doctorAbsence.map((absence) => (
                                        <AbsenceTableRow
                                            key={absence.id}
                                            absence={absence}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </AnimatePresence>
                                {isAdding && (
                                    <AbsenceForm
                                        doctorData={doctorData}
                                        newRow={newRow}
                                        setNewRow={setNewRow}
                                        onSave={handleSave}
                                        onCancel={() => {
                                            setNewRow({
                                                doctorId: '',
                                                doctorName: '',
                                                absenceDate: null,
                                                absenceStartTime: null,
                                                absenceEndTime: null,
                                                optionalMessage: '',
                                            });
                                            setIsAdding(false);
                                        }}
                                        isMobile={isMobile}
                                    />
                                )}
                            </TableBody>
                        </Table>
                    </AnimatedTableContainer>
                )}

                <Box mt={2} display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsAdding(true)}
                        aria-label="Add Doctor Absence"
                        disabled={isAdding}
                        sx={{ minWidth: { xs: '80%', sm: 'auto' } }}
                        tabIndex={0}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Add Doctor Absence
                    </Button>
                </Box>
            </Box>

            <NotificationSnackbar
                open={errorOpen}
                message={errorMessage}
                severity="error"
                onClose={() => setErrorOpen(false)}
            />
            <NotificationSnackbar
                open={successOpen}
                message={successMessage}
                severity="success"
                onClose={() => setSuccessOpen(false)}
            />
        </Card>
    );
};

export default DoctorAbsencePage;
