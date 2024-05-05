import React from 'react';
import PropTypes from 'prop-types';

import { Card, Typography, CardContent } from '@mui/material';

const ClinicDetails = ({ clinic }) => (
    <Card>
        <CardContent>
            <Typography variant="h5" component="div">
                {clinic.clinicName}
            </Typography>
            <Typography color="text.secondary">{clinic.clinicAddress}</Typography>
            <Typography variant="body2">Pin Code: {clinic.clinicPinCode}</Typography>
            <div>
                <Typography variant="body2">
                    Phone Numbers:{' '}
                    {clinic.clinicPhoneNumbers.map((phone) => phone.phoneNumber).join(', ')}
                </Typography>
            </div>
            <div>
                <Typography variant="body2">Email: {clinic.clinicEmail}</Typography>
            </div>
            <div>
                <Typography variant="body2">Website: {clinic.clinicWebsite}</Typography>
            </div>
            <Typography variant="body2">Timings: {clinic.clinicTimings}</Typography>
            <Typography variant="body2">Amenities: {clinic.clinicAmenities}</Typography>
        </CardContent>
    </Card>
);

ClinicDetails.propTypes = {
    clinic: PropTypes.shape({
        clinicName: PropTypes.string.isRequired,
        clinicAddress: PropTypes.string.isRequired,
        clinicPinCode: PropTypes.string.isRequired,
        clinicPhoneNumbers: PropTypes.arrayOf(
            PropTypes.shape({
                phoneNumber: PropTypes.string.isRequired,
            })
        ).isRequired,
        clinicEmail: PropTypes.string.isRequired,
        clinicTimings: PropTypes.string.isRequired,
        clinicWebsite: PropTypes.string.isRequired,
        clinicAmenities: PropTypes.string.isRequired,
    }).isRequired,
};

export default ClinicDetails;
