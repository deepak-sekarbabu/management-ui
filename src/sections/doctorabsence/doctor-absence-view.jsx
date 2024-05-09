import React, { useState } from 'react';

import Alert from '@mui/material/Alert';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, Card, Paper, Table, Button, MenuItem, TableRow, TableBody, TextField, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import data from './data.json';

const doctorData = [
    {
        "id": 1,
        "doctorId": "AB00001",
        "doctorName": "Dr. Deepak Sekarbabu"
    },
    {
        "id": 2,
        "doctorId": "AB00002",
        "doctorName": "Dr. Dilip Sekarbabu"
    }
];

const DoctorAbsencePage = () => {
    const [doctorAbsence, setDoctorAbsence] = useState([...data]);
    const [newRow, setNewRow] = useState({ doctorId: '', doctorName: '', absenceDate: '', absenceStartTime: '', absenceEndTime: '', optionalMessage: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleRemove = (id) => {
        console.log("Removing row with ID:", id)
        setDoctorAbsence(prevDoctorAbsence => prevDoctorAbsence.filter(absence => absence.id !== id));
    };

    const handleAdd = () => {
        console.log();
        setIsAdding(true);
    };

    const handleSave = () => {
        const isFormValid = newRow.doctorId !== '' && newRow.doctorName !== '';

        if (!isFormValid) {
            setShowErrorAlert(true);
            return;
        }

        const formattedAbsenceDate = newRow.absenceDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(/\//g, '-');

        const formattedAbsenceStartTime = newRow.absenceStartTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const formattedAbsenceEndTime = newRow.absenceEndTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const newAbsence = {
            id: Math.random().toString(36).substr(2, 9),
            doctorId: newRow.doctorId,
            doctorName: newRow.doctorName,
            absenceDate: formattedAbsenceDate,
            absenceStartTime: formattedAbsenceStartTime,
            absenceEndTime: formattedAbsenceEndTime,
            optionalMessage: newRow.optionalMessage,
        };

        console.log("New Row:", newAbsence);
        console.log("Adding new row:", newAbsence);
        setDoctorAbsence([...doctorAbsence, newAbsence]);
        setNewRow({ doctorId: '', doctorName: '', absenceDate: '', absenceStartTime: '', absenceEndTime: '', optionalMessage: '' });
        setIsAdding(false);
    };

    const handleCancel = () => {
        console.log("Canceling addition of new row:", newRow);
        setNewRow({ doctorId: '', doctorName: '', absenceDate: '', absenceStartTime: '', absenceEndTime: '', optionalMessage: '' });
        setIsAdding(false);
    };

    const handleDoctorIdChange = (event) => {
        const selectedDoctorId = event.target.value;
        const selectedDoctor = doctorData.find(doctor => doctor.doctorId === selectedDoctorId);
        setNewRow({ ...newRow, doctorId: selectedDoctorId, doctorName: selectedDoctor ? selectedDoctor.doctorName : '' });
    };

    return (
        <Card>
            {showErrorAlert && <Alert severity="error">Please fix the validation errors in the page before saving</Alert>}
            <Box p={2}>
                <Typography style={{ marginBottom: '20px' }} variant="h2">Doctor Absence Information</Typography>
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
                                        <Button variant="outlined" color="error" onClick={() => handleRemove(absence.id)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {isAdding && (
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            select
                                            value={newRow.doctorId}
                                            onChange={handleDoctorIdChange}
                                            error={newRow.doctorId === ''}
                                            helperText={newRow.doctorId === '' ? 'Doctor ID is required' : ''}
                                        >
                                            <MenuItem value="">Select Doctor ID</MenuItem>
                                            {doctorData.map((doctor) => (
                                                <MenuItem key={doctor.doctorId} value={doctor.doctorId}>{doctor.doctorId}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={newRow.doctorName}
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Absence Date"
                                                value={newRow.absenceDate}
                                                onChange={(date) => setNewRow({ ...newRow, absenceDate: date })}
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
                                                onChange={(newValue) => setNewRow({ ...newRow, absenceStartTime: newValue })}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker
                                                label="Absence End Time"
                                                value={newRow.absenceEndTime}
                                                onChange={(newValue) => setNewRow({ ...newRow, absenceEndTime: newValue })}
                                                shouldDisableTime={(timeValue, clockType) => {
                                                    if (clockType === 'minutes') {
                                                        return false;
                                                    }
                                                    if (newRow.absenceStartTime && newRow.absenceStartTime > timeValue) {
                                                        return true;
                                                    }
                                                    return false;
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={newRow.optionalMessage}
                                            onChange={e => setNewRow({ ...newRow, optionalMessage: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button style={{ marginLeft: '10px', marginBottom: '10px' }} variant="outlined" color="success" onClick={handleSave}>Save</Button>
                                        <Button style={{ marginLeft: '10px', marginBottom: '10px' }} variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={handleAdd}>Add</Button>
            </Box>
        </Card>
    );
};

export default DoctorAbsencePage;