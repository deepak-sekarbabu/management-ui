import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Card, Button, TextField, Typography, CardContent } from '@mui/material';

import DoctorPhoneNumbers from './DoctorPhoneNumbers';
import DoctorAvailability from './DoctorAvailability';

const DoctorCard = ({ doctor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDoctor, setEditedDoctor] = useState({ ...doctor });
    const [validationErrors, setValidationErrors] = useState({});
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    const handleExpandDetails = () => {
        console.log("Expand:", isDetailsExpanded);
        setIsDetailsExpanded(!isDetailsExpanded);
    };

    const handleEdit = () => {
        console.log("isEditing", isEditing);
        setIsDetailsExpanded(!isDetailsExpanded);
        setIsEditing(true);
    };

    const handleSave = () => {
        // Validate the edited doctor data
        const errors = validateDoctorData(editedDoctor);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        console.log(editedDoctor);
        setIsEditing(false);
        setValidationErrors({});
    };

    const handleCancel = () => {
        setEditedDoctor({ ...doctor });
        setIsEditing(false);
        setValidationErrors({});
        setIsDetailsExpanded(false);
    };

    const handleInputChange = (field, value) => {
        const errors = validateDoctorData({
            ...editedDoctor,
            [field]: value,
        });

        // Update the validationErrors state with the new errors
        setValidationErrors(errors);

        // Update the editedDoctor state with the new value
        setEditedDoctor((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handlePhoneNumberChange = (index, value) => {
        setEditedDoctor((prevState) => ({
            ...prevState,
            phoneNumbers: prevState.phoneNumbers.map((item, i) =>
                i === index ? { ...item, phoneNumber: value } : item
            ),
        }));
    };

    const handleAvailabilityChange = (newAvailability) => {
        // This function is called from DoctorAvailability component
        // It will receive the new availability data
        setEditedDoctor((prevState) => ({
            ...prevState,
            doctorAvailability: newAvailability,
        }));
    };
    const validateDoctorData = (doctorData) => {
        const errors = {};

        if (doctorData.doctorId.length > 50) {
            errors.doctorId = 'Doctor ID cannot be more than 50 characters';
        }

        if (!/^[a-zA-Z.\s]+$/.test(doctorData.doctorName) || doctorData.doctorName.length > 120) {
            errors.doctorName = 'Doctor name must be alphabets, spaces, and dots, and not more than 120 characters';
        }

        if (doctorData.doctorSpeciality.length > 120) {
            errors.doctorSpeciality = 'Doctor specialty must not be more than 120 characters';
        }

        if (doctorData.doctorConsultationFee < 0) {
            errors.doctorConsultationFee = 'Consultation fee must be a positive number';
        }

        if (doctorData.doctorConsultationFeeOther < 0) {
            errors.doctorConsultationFeeOther = 'Consultation fee (other) must be a positive number';
        }

        return errors;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" onClick={handleExpandDetails}>
                    {doctor.doctorName}
                </Typography>
                {isDetailsExpanded && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {isEditing ? (
                            <>
                                <TextField
                                    label="Doctor Name"
                                    value={editedDoctor.doctorName}
                                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                                    error={!!validationErrors.doctorName}
                                    helperText={validationErrors.doctorName}
                                />
                                <TextField
                                    label="Doctor ID"
                                    value={editedDoctor.doctorId}
                                    onChange={(e) => handleInputChange('doctorId', e.target.value)}
                                    error={!!validationErrors.doctorId}
                                    helperText={validationErrors.doctorId}
                                />
                                <TextField
                                    label="Doctor Specialty"
                                    value={editedDoctor.doctorSpeciality}
                                    onChange={(e) => handleInputChange('doctorSpeciality', e.target.value)}
                                    error={!!validationErrors.doctorSpeciality}
                                    helperText={validationErrors.doctorSpeciality}
                                />
                                <TextField
                                    label="Doctor Experience"
                                    value={editedDoctor.doctorExperience}
                                    onChange={(e) => handleInputChange('doctorExperience', e.target.value)}
                                />
                                <TextField
                                    label="Consultation Fee Appointment"
                                    value={editedDoctor.doctorConsultationFee}
                                    onChange={(e) =>
                                        handleInputChange('doctorConsultationFee', e.target.value)
                                    }
                                    error={!!validationErrors.doctorConsultationFee}
                                    helperText={validationErrors.doctorConsultationFee}
                                />
                                <TextField
                                    label="Consultation Fee Queue"
                                    value={editedDoctor.doctorConsultationFeeOther}
                                    onChange={(e) => handleInputChange('doctorConsultationFeeOther', e.target.value)}
                                />
                                <DoctorPhoneNumbers
                                    phoneNumbers={editedDoctor.phoneNumbers}
                                    onPhoneNumberChange={handlePhoneNumberChange}
                                    isEditing={isEditing}
                                />
                                <DoctorAvailability
                                    availability={editedDoctor.doctorAvailability}
                                    onAvailabilityChange={handleAvailabilityChange}
                                    isEditing={isEditing}
                                />
                                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button onClick={handleSave}>Save</Button>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography variant="body1" color="textSecondary">
                                    {doctor.doctorId}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {doctor.doctorSpeciality}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Experience: {doctor.doctorExperience} years
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Consultation Fee Appointment: ₹{doctor.doctorConsultationFee}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Consultation Fee Queue: ₹{doctor.doctorConsultationFeeOther}
                                </Typography>
                                <DoctorPhoneNumbers phoneNumbers={doctor.phoneNumbers} />
                                <DoctorAvailability
                                    availability={doctor.doctorAvailability}
                                    isEditing={isEditing}
                                />
                                <Box display="flex" mt={2} justifyContent="center" gap={2}>
                                    <Button onClick={handleEdit}>Edit</Button>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        doctorName: PropTypes.string.isRequired,
        doctorId: PropTypes.string.isRequired,
        doctorSpeciality: PropTypes.string.isRequired,
        doctorExperience: PropTypes.number.isRequired,
        doctorConsultationFee: PropTypes.number.isRequired,
        doctorConsultationFeeOther: PropTypes.number.isRequired,
        phoneNumbers: PropTypes.arrayOf(
            PropTypes.shape({
                phoneNumber: PropTypes.string.isRequired,
            })
        ).isRequired,
        doctorAvailability: PropTypes.arrayOf(
            PropTypes.shape({
                availableDays: PropTypes.string.isRequired,
                shiftTime: PropTypes.string.isRequired,
                shiftStartTime: PropTypes.string.isRequired,
                shiftEndTime: PropTypes.string.isRequired,
                consultationTime: PropTypes.number.isRequired,
                configType: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};

export default DoctorCard;
