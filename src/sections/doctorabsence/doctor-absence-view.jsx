import React, { useState, useEffect, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Box,
    Card,
    Stack,
    Table,
    Paper,
    Select,
    Button,
    MenuItem,
    TableRow,
    TableBody,
    TextField,
    TableCell,
    TableHead,
    Container,
    Typography,
    TableContainer,
    CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

const DoctorAbsencePage = () => {
    const { user } = useAuth();
    const [doctorAbsence, setDoctorAbsence] = useState([]);
    const [newRow, setNewRow] = useState({
        doctorId: '',
        doctorName: '',
        absenceDate: '',
        absenceStartTime: '',
        absenceEndTime: '',
        optionalMessage: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showErrorAlertSaving, setShowErrorAlertSaving] = useState(false);
    const [doctorData, setDoctorData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const fetchDoctorData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const clinicId = user?.clinicIds?.[0];
            if (!clinicId) {
                throw new Error('No clinic assigned to this user');
            }

            const response = await fetch(`api/doctor-clinic/${clinicId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch doctor data');
            }
            const data = await response.json();
            setDoctorData(data);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    }, [user?.clinicIds]);

    const fetchDoctorAbsence = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const clinicId = user?.clinicIds?.[0];
            if (!clinicId) {
                throw new Error('No clinic assigned to this user');
            }

            const response = await fetch(
                `api/doctor-absence/after-date/clinic/${clinicId}?afterDate=01-01-2024`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch doctor absence data');
            }
            const data = await response.json();
            setDoctorAbsence(data);
        } catch (error) {
            console.error('Error fetching doctor absence data:', error);
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    }, [user?.clinicIds]);

    useEffect(() => {
        fetchDoctorData();
        fetchDoctorAbsence();
    }, [fetchDoctorData, fetchDoctorAbsence]);

    const handleRemove = async (id) => {
        console.log('Removing row with ID:', id);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`api/doctor-absence/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete the record');
            }

            // If the deletion is successful, update the state to reflect the change
            setDoctorAbsence((prevDoctorAbsence) =>
                prevDoctorAbsence.filter((absence) => absence.id !== id)
            );
        } catch (error) {
            console.error('Error deleting the record:', error);
            setShowErrorAlertSaving(true);
        }
    };

    const handleAdd = () => {
        console.log();
        setIsAdding(true);
    };

    const handleSave = async () => {
        const isFormValid = newRow.doctorId !== '' && newRow.doctorName !== '';

        if (!isFormValid) {
            setShowErrorAlert(true);
            return;
        }
        setShowErrorAlert(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const clinicId = user?.clinicIds?.[0];
            if (!clinicId) {
                throw new Error('No clinic assigned to this user');
            }

            // Format dates for the API
            const formattedAbsenceDate = newRow.absenceDate
                ? newRow.absenceDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                  }).replace(/\//g, '-')
                : '';

            const formattedAbsenceStartTime = newRow.absenceStartTime
                ? newRow.absenceStartTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                  })
                : '';

            const formattedAbsenceEndTime = newRow.absenceEndTime
                ? newRow.absenceEndTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                  })
                : '';

            const response = await fetch('api/doctor-absence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: parseInt(newRow.doctorId, 10),
                    doctorName: newRow.doctorName,
                    absenceDate: formattedAbsenceDate,
                    absenceStartTime: formattedAbsenceStartTime,
                    absenceEndTime: formattedAbsenceEndTime,
                    optionalMessage: newRow.optionalMessage || '',
clinicId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save the record');
            }

            // Assuming the server returns the saved record with an ID
            const savedAbsence = await response.json();
            setDoctorAbsence([...doctorAbsence, savedAbsence]);
            setNewRow({
                doctorId: '',
                doctorName: '',
                absenceDate: '',
                absenceStartTime: '',
                absenceEndTime: '',
                optionalMessage: '',
            });
            setIsAdding(false);
        } catch (error) {
            console.error('Error saving the record:', error);
            setShowErrorAlertSaving(true);
        }
    };

    const handleCancel = () => {
        console.log('Canceling addition of new row:', newRow);
        setNewRow({
            doctorId: '',
            doctorName: '',
            absenceDate: '',
            absenceStartTime: '',
            absenceEndTime: '',
            optionalMessage: '',
        });
        setIsAdding(false);
        setShowErrorAlert(false);
    };

    const handleDoctorIdChange = (event) => {
        const selectedDoctorId = event.target.value;
        const selectedDoctor = doctorData.find((doctor) => doctor.doctorId === selectedDoctorId);
        setNewRow({
            ...newRow,
            doctorId: selectedDoctorId,
            doctorName: selectedDoctor ? selectedDoctor.doctorName : '',
        });
    };

    return (
        <Card>
            {showErrorAlert && (
                <Alert severity="error">
                    Please fix the validation errors in the page before saving
                </Alert>
            )}
            {showErrorAlertSaving && (
                <Alert severity="error">Error when saving Doctor Absence Information</Alert>
            )}
            {isLoading ? (
                <Container>
                    {' '}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={5}
                    >
                        <Typography variant="h2">Doctor Absence Information</Typography>
                    </Stack>
                    <CircularProgress
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </Container>
            ) : (
                <Box p={2}>
                    <Typography style={{ marginBottom: '20px' }} variant="h2">
                        Doctor Absence Information
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
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
                            <TableBody>
                                {doctorAbsence.map((absence, index) => (
                                    <TableRow key={index}>
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
                                                onClick={() => handleRemove(absence.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {isAdding && (
                                    <TableRow>
                                        <TableCell>
                                            <Select
                                                value={newRow.doctorId}
                                                onChange={(e) => handleDoctorIdChange(e)}
                                                error={newRow.doctorId === ''}
                                                displayEmpty
                                                renderValue={(value) =>
                                                    value === '' ? 'Select Doctor ID' : value
                                                }
                                            >
                                                {doctorData.map((doctor) => (
                                                    <MenuItem
                                                        key={doctor.doctorId}
                                                        value={doctor.doctorId}
                                                    >
                                                        {doctor.doctorId}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField value={newRow.doctorName} disabled />
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
                                                    inputFormat="dd/MM/yyyy"
                                                    mask="__/__/____"
                                                    minDate={new Date()}
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
                                                        if (clockType === 'minutes') {
                                                            return false;
                                                        }
                                                        return !!(
                                                            newRow.absenceStartTime &&
                                                            newRow.absenceStartTime > timeValue
                                                        );
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={newRow.optionalMessage}
                                                onChange={(e) =>
                                                    setNewRow({
                                                        ...newRow,
                                                        optionalMessage: e.target.value,
                                                    })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                style={{ marginLeft: '10px', marginBottom: '10px' }}
                                                variant="outlined"
                                                color="success"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px', marginBottom: '10px' }}
                                                variant="outlined"
                                                color="error"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            style={{ marginTop: '20px' }}
                            variant="contained"
                            color="primary"
                            onClick={handleAdd}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default DoctorAbsencePage;
