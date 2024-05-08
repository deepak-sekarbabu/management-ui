import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Card, Button, TextField, Typography, CardContent, } from '@mui/material';

// Assuming data.json is imported in the same file or merged into the component's state
import data from './data.json';

const DoctorAbsencePage = () => {
    const [doctorAbsence, setDoctorAbsence] = useState([...data]);

    const handleRemove = (id) => {
        setDoctorAbsence(prevDoctorAbsence => prevDoctorAbsence.filter(absence => absence.id !== id));
    };

    return (
        <Card>
            <Typography variant="h1">Doctor Absence Information</Typography>
            {doctorAbsence.map((absence, index) => (
                <DoctorAbsenceCard key={index} absence={absence} onRemove={() => handleRemove(absence.id)} />
            ))}
        </Card>
    );
};

const DoctorAbsenceCard = ({ absence, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDoctor, setEditedDoctor] = useState({ ...absence });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Implement save logic
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Implement cancel logic
        setIsEditing(false);
        setEditedDoctor({ ...absence });
    };

    const handleInputChange = (field, value) => {
        setEditedDoctor(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <Card>
            <CardContent>
                {isEditing ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Doctor ID"
                            value={editedDoctor.doctorId}
                            onChange={(e) => handleInputChange('doctorId', e.target.value)}
                        />
                        <TextField
                            label="Doctor Name"
                            value={editedDoctor.doctorName}
                            onChange={(e) => handleInputChange('doctorName', e.target.value)}
                        />
                        <TextField
                            label="Absence Date"
                            value={editedDoctor.absenceDate}
                            onChange={(e) => handleInputChange('absenceDate', e.target.value)}
                        />
                        <TextField
                            label="Absence Start Time"
                            value={editedDoctor.absenceStartTime}
                            onChange={(e) => handleInputChange('absenceStartTime', e.target.value)}
                        />
                        <TextField
                            label="Absence End Time"
                            value={editedDoctor.absenceEndTime}
                            onChange={(e) => handleInputChange('absenceEndTime', e.target.value)}
                        />
                        <TextField
                            label="Optional Message"
                            value={editedDoctor.optionalMessage}
                            onChange={(e) => handleInputChange('optionalMessage', e.target.value)}
                        />
                        <Box mt={2} display="flex" justifyContent="flex-end" alignitems="center" gap={2}>
                            <Button variant="outlined" onClick={handleSave}>Save</Button>
                            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography variant="body1" color="textSecondary">
                            Doctor ID: {absence.doctorId}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Doctor Name: {absence.doctorName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Absence Date: {absence.absenceDate}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Absence Start Time: {absence.absenceStartTime}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Absence End Time: {absence.absenceEndTime}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Optional Message: {absence.optionalMessage}
                        </Typography>
                        <Box mt={2} display="flex" justifyContent="flex-end" alignitems="center" gap={2}>
                            <Button variant="outlined" onClick={handleEdit}>Edit</Button>
                            <Button variant="outlined" color="error" onClick={onRemove}>Remove</Button>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

DoctorAbsenceCard.propTypes = {
    absence: PropTypes.shape({
        id: PropTypes.any.isRequired,
        doctorId: PropTypes.string.isRequired,
        clinicId: PropTypes.number.isRequired,
        doctorName: PropTypes.string.isRequired,
        absenceDate: PropTypes.string.isRequired,
        absenceStartTime: PropTypes.string.isRequired,
        absenceEndTime: PropTypes.string.isRequired,
        optionalMessage: PropTypes.string.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default DoctorAbsencePage;
