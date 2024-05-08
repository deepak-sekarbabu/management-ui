import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import { Box, Card, Button, TextField, Typography, CardContent } from '@mui/material';

import DoctorPhoneNumbers from './DoctorPhoneNumbers';
import DoctorAvailability from './DoctorAvailability';

const DoctorCard = ({ doctor, isNewDoctor = false, onSave, onRemove }) => {
    const [isEditing, setIsEditing] = useState(isNewDoctor);
    const [editedDoctor, setEditedDoctor] = useState({ ...doctor });
    const [validationErrors, setValidationErrors] = useState({});
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(isNewDoctor);

    const handleExpandDetails = () => {
        console.log("Expand:", isDetailsExpanded);
        setIsDetailsExpanded(!isDetailsExpanded);
    };

    const handleEdit = () => {
        console.log("isEditing", isEditing);
        // Removed the line that toggles isDetailsExpanded
        setIsEditing(true);
    };

    const handleRemove = () => {
        console.log("Removing doctor with ID:", doctor.id);
        // Call the onRemove function passed from the parent component
        if (onRemove) {
            onRemove(doctor.id);
        }
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

        // Call the onSave function passed from the parent component
        if (onSave && isNewDoctor) {
            onSave(editedDoctor);
        }
    };

    const handleCancel = () => {
        // If isNewDoctor is true, it means it's a new doctor being edited
        if (isNewDoctor) {
            // Call the onRemove function passed from the parent component to remove the new doctor
            if (onRemove) {
                onRemove();
            }
        } else {
            // If it's an existing doctor being edited, reset the state and close the edit mode
            setEditedDoctor({ ...doctor });
            setIsEditing(false);
            setValidationErrors({});
            setIsDetailsExpanded(false);
        }
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
        <Card style={{ marginTop: '20px' }}>
            <CardContent style={{ marginTop: '20px' }}>
                <Card
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={handleExpandDetails}
                >
                    <Avatar
                        alt={doctor.doctorName}
                        src={`/assets/images/avatars/avatar_${doctor.id}.jpg`}
                    />
                    <Typography variant="h5" component="h2" onClick={handleExpandDetails} style={{ marginLeft: '10px' }}>
                        {doctor.doctorName}
                    </Typography>
                </Card>
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
                                    style={{ marginTop: '20px' }}
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
                                    label="Doctor Experience in years"
                                    value={editedDoctor.doctorExperience}
                                    onChange={(e) => handleInputChange('doctorExperience', e.target.value)}
                                />
                                <TextField
                                    label="Consultation Fee Appointment in Rupees"
                                    value={editedDoctor.doctorConsultationFee}
                                    onChange={(e) =>
                                        handleInputChange('doctorConsultationFee', e.target.value)
                                    }
                                    error={!!validationErrors.doctorConsultationFee}
                                    helperText={validationErrors.doctorConsultationFee}
                                />
                                <TextField
                                    label="Consultation Fee Queue in Rupees"
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
                                    <Button variant="outlined" onClick={handleSave}>Save</Button>
                                    <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography style={{ marginTop: '20px' }} variant="body1" color="textSecondary">
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

                                <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
                                    <Button variant="outlined" onClick={handleEdit}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={handleRemove}>Remove</Button>
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
        id: PropTypes.any.isRequired,
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
    isNewDoctor: PropTypes.bool,
    onSave: PropTypes.func,
    onRemove: PropTypes.func
};

export default DoctorCard;
