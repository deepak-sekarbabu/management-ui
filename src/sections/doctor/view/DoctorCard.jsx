import React from 'react';
import PropTypes from 'prop-types';

import { Card, Typography, CardContent } from '@mui/material';

import DoctorAvailability from './DoctorAvailability';
import DoctorPhoneNumbers from './DoctorPhoneNumbers';

const DoctorCard = ({ doctor }) => (
    <Card>
        <CardContent>
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
            <DoctorAvailability availability={doctor.doctorAvailability} />
        </CardContent>
    </Card>
);

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