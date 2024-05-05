import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Stack, Container, Typography } from '@mui/material';

import ClinicDetails from './ClinicDetails';

const GET_CLINIC_INFO = '/api/clinic/';

const ClinicPage = () => {
    const [clinicData, setClinicData] = useState(null);

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const response = await axios.get(`${GET_CLINIC_INFO}1`);
                setClinicData(response.data);
            } catch (error) {
                console.error('Error fetching clinic data:', error);
            }
        };

        fetchClinicData();
    }, []);

    if (!clinicData) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Clinic Information</Typography>
            </Stack>

            <ClinicDetails clinic={clinicData} />
        </Container>
    );
};

export default ClinicPage;
