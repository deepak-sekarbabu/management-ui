import React from 'react';

import { Stack, Container, Typography } from '@mui/material';

import ClinicDetails from './ClinicDetails';

const clinicData = {
    clinicId: 2,
    clinicName: 'Midway Hospital',
    clinicAddress: '103 Kumba street',
    mapGeoLocation: '13.1223234 15.34567',
    clinicPinCode: '600945',
    clinicPhoneNumbers: [
        {
            phoneNumber: '+913342706479',
        },
        {
            phoneNumber: '+91 9789801844',
        },
    ],
    noOfDoctors: 1,
    clinicEmail: 'drinba@kumarhospital.com',
    clinicTimings: 'MON-SUN 09:00:00AM-10:00:00PM',
    clinicWebsite: 'www.midwayhospital.com',
    clinicAmenities: 'Sacn, Xray, etc etc',
};

export default function ClinicPage() {
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Clinic Information</Typography>
            </Stack>

            <ClinicDetails clinic={clinicData} />
        </Container>
    );
}
