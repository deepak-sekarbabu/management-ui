import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';

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

// Custom hook for managing notifications
const useNotification = () => {
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

// Reusable notification component
const NotificationSnackbar = ({ open, message, severity, onClose }) => (
    <Snackbar
        open={open}
        autoHideDuration={severity === 'error' ? 6000 : 4000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100, marginTop: '64px' }}
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

// Reusable table header component
const AbsenceTableHeader = () => (
    <TableHead>
        <TableRow>
            <TableCell>Doctor ID</TableCell>
            <TableCell>Doctor Name</TableCell>
            <TableCell>Absence Date</TableCell>
            <TableCell>Absence Start Time</TableCell>
            <TableCell>Absence End Time</TableCell>
            <TableCell>Optional Message</TableCell>
            <TableCell>Actions</TableCell>
        </TableRow>
    </TableHead>
);

// Update the styled components for animations
const AnimatedTableContainer = styled(motion.create(TableContainer))(({ theme }) => ({
    overflowX: 'auto',
    '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
        minWidth: '120px',
        transition: 'all 0.3s ease',
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            minWidth: '100px',
        },
    },
}));

const AnimatedTableRow = styled(motion.create(TableRow))(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'scale(1.01)',
        transition: 'all 0.3s ease',
    },
}));

// Add styled components for form fields
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

// Reusable table row component for existing absences
const AbsenceTableRow = ({ absence, onRemove }) => (
    <AnimatedTableRow
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        <TableCell>{absence.doctorId}</TableCell>
        <TableCell>{absence.doctorName}</TableCell>
        <TableCell>{absence.absenceDate}</TableCell>
        <TableCell>{absence.absenceStartTime}</TableCell>
        <TableCell>{absence.absenceEndTime}</TableCell>
        <TableCell>{absence.optionalMessage}</TableCell>
        <TableCell>
            <Button
                variant="outlined"
                color="error"
                onClick={() => onRemove(absence.id)}
                aria-label={`Remove absence record for ${absence.doctorName}`}
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                }}
            >
                Remove
            </Button>
        </TableCell>
    </AnimatedTableRow>
);

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

// Main component
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

    // Memoized clinic ID
    const clinicId = useMemo(() => user?.clinicIds?.[0], [user?.clinicIds]);

    // API calls
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

    const fetchDoctorAbsence = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!clinicId) throw new Error('No clinic assigned to this user');

            const today = new Date();
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

    // Event handlers
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

    const handleSave = async () => {
        if (!newRow.doctorId || !newRow.doctorName) {
            showError('Please fill in all required fields.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            if (!clinicId) throw new Error('No clinic assigned to this user');

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

    // Loading state
    if (isLoading) {
        return (
            <Card
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Container>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={5}
                    >
                        <Typography variant="h2">Doctor Absence Information</Typography>
                    </Stack>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="400px"
                    >
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
                            <CircularProgress size={60} />
                        </motion.div>
                    </Box>
                </Container>
            </Card>
        );
    }

    return (
        <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box p={isMobile ? 1 : 2}>
                <Typography
                    variant="h2"
                    sx={{
                        marginBottom: '20px',
                        fontSize: isMobile ? '1.5rem' : '2rem',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Doctor Absence Information
                </Typography>

                <AnimatedTableContainer
                    component={Paper}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Table aria-label="doctor absence table">
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
                                <AnimatedTableRow
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <TableCell>
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
                                            renderValue={(value) =>
                                                value === '' ? 'Select Doctor ID' : value
                                            }
                                            aria-label="Select Doctor"
                                            fullWidth
                                        >
                                            {doctorData.map((doctor) => (
                                                <MenuItem
                                                    key={doctor.doctorId}
                                                    value={doctor.doctorId}
                                                >
                                                    {doctor.doctorId}
                                                </MenuItem>
                                            ))}
                                        </StyledSelect>
                                    </TableCell>
                                    <TableCell>
                                        <StyledTextField
                                            value={newRow.doctorName}
                                            disabled
                                            aria-label="Doctor Name"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Absence Date"
                                                value={newRow.absenceDate}
                                                onChange={(date) =>
                                                    setNewRow({ ...newRow, absenceDate: date })
                                                }
                                                format="dd/MM/yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: isMobile ? 'small' : 'medium',
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow:
                                                                        '0 4px 8px rgba(0,0,0,0.1)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
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
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow:
                                                                        '0 4px 8px rgba(0,0,0,0.1)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
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
                                                        newRow.absenceStartTime &&
                                                        newRow.absenceStartTime > timeValue
                                                    );
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: isMobile ? 'small' : 'medium',
                                                        sx: {
                                                            '& .MuiOutlinedInput-root': {
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow:
                                                                        '0 4px 8px rgba(0,0,0,0.1)',
                                                                },
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
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
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                onClick={handleSave}
                                                aria-label="Save absence record"
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => {
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
                                                aria-label="Cancel adding absence record"
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </AnimatedTableRow>
                            )}
                        </TableBody>
                    </Table>
                </AnimatedTableContainer>

                <Box
                    mt={2}
                    display="flex"
                    justifyContent="flex-end"
                    sx={{
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'background.paper',
                        padding: '16px 0',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsAdding(true)}
                        aria-label="Add new absence record"
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        Add
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
