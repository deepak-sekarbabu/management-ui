import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Card, Button, TextField, Typography, CardContent } from '@mui/material';

import DoctorAvailability from './DoctorAvailability';
import DoctorPhoneNumbers from './DoctorPhoneNumbers';

const DoctorCard = ({ doctor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDoctor, setEditedDoctor] = useState({ ...doctor });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Save the edited doctor data
        // You can add your logic here to update the doctor data
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedDoctor({ ...doctor });
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
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

    return (
        <Card>
            <CardContent>
                {isEditing ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Doctor Name"
                            value={editedDoctor.doctorName}
                            onChange={(e) => handleInputChange('doctorName', e.target.value)}
                        />
                        <TextField
                            label="Doctor ID"
                            value={editedDoctor.doctorId}
                            onChange={(e) => handleInputChange('doctorId', e.target.value)}
                        />
                        <TextField
                            label="Doctor Speciality"
                            value={editedDoctor.doctorSpeciality}
                            onChange={(e) => handleInputChange('doctorSpeciality', e.target.value)}
                        />
                        <TextField
                            label="Doctor Experience"
                            value={editedDoctor.doctorExperience}
                            onChange={(e) => handleInputChange('doctorExperience', e.target.value)}
                        />
                        <TextField
                            label="Consultation Fee Appointment"
                            value={editedDoctor.doctorConsultationFee}
                            onChange={(e) => handleInputChange('doctorConsultationFee', e.target.value)}
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
                            onAvailabilityChange={(newAvailability) =>
                                handleInputChange('doctorAvailability', newAvailability)
                            }
                            isEditing={isEditing}
                        />
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button onClick={handleSave}>Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Typography variant="h5" component="h2">
                            {doctor.doctorName}
                        </Typography>
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
                        <DoctorAvailability availability={doctor.doctorAvailability} isEditing={isEditing} />
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Button onClick={handleEdit}>Edit</Button>
                        </Box>
                    </>
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
            }),
        ).isRequired,
        doctorAvailability: PropTypes.arrayOf(
            PropTypes.shape({
                availableDays: PropTypes.string.isRequired,
                shiftTime: PropTypes.string.isRequired,
                shiftStartTime: PropTypes.string.isRequired,
                shiftEndTime: PropTypes.string.isRequired,
                consultationTime: PropTypes.number.isRequired,
                configType: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
};

export default DoctorCard;