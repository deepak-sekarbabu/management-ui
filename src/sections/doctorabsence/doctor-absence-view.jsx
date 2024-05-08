import React, { useState } from 'react';

import { Box, Paper, Table, Button, TableRow, TableBody, TextField, TableCell, TableHead, Typography, TableContainer, } from '@mui/material';

import data from './data.json';

const DoctorAbsencePage = () => {
    const [doctorAbsence, setDoctorAbsence] = useState([...data]);
    const [newRow, setNewRow] = useState({ doctorId: '', doctorName: '', absenceDate: '', absenceStartTime: '', absenceEndTime: '', optionalMessage: '' });
    const [isAdding, setIsAdding] = useState(false);

    const handleRemove = (id) => {
        console.log("Removing row with ID:", id)
        setDoctorAbsence(prevDoctorAbsence => prevDoctorAbsence.filter(absence => absence.id !== id));
    };

    const handleAdd = () => {
        console.log();
        setIsAdding(true);
    };

    const handleSave = () => {
        const newAbsence = {
            id: Math.random().toString(36).substr(2, 9), // Generate a random ID for demonstration
            ...newRow
        };
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

    return (
        <Box>
            <Typography style={{ marginBottom: '20px' }} variant="h1">Doctor Absence Information</Typography>
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
                                    <TextField value={newRow.doctorId} onChange={e => setNewRow({ ...newRow, doctorId: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <TextField value={newRow.doctorName} onChange={e => setNewRow({ ...newRow, doctorName: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <TextField value={newRow.absenceDate} onChange={e => setNewRow({ ...newRow, absenceDate: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <TextField value={newRow.absenceStartTime} onChange={e => setNewRow({ ...newRow, absenceStartTime: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <TextField value={newRow.absenceEndTime} onChange={e => setNewRow({ ...newRow, absenceEndTime: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <TextField value={newRow.optionalMessage} onChange={e => setNewRow({ ...newRow, optionalMessage: e.target.value })} />
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="success" onClick={handleSave}>Save</Button>
                                    <Button style={{ marginLeft: '10px' }} variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button style={{ marginTop: '20px' }} variant="contained" color="primary" onClick={handleAdd}>Add</Button>
        </Box>
    );
};

export default DoctorAbsencePage;
