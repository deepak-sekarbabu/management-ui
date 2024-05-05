import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Box, Stack, Button, Container, Typography } from '@mui/material';

import ClinicDetails from './clinic-details';

const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

const ClinicPage = () => {
    const [clinicData, setClinicData] = useState(null);
    const [isEditable, setEditMode] = useState(false);
    const [editedClinicData, setEditedClinicData] = useState({});

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const response = await axios.get(`${GET_CLINIC_INFO}1`);
                setClinicData(response.data);
                setEditedClinicData(response.data);
            } catch (error) {
                console.error('Error fetching clinic data:', error);
            }
        };

        fetchClinicData();
    }, []);

    if (!clinicData) {
        return <div>Loading...</div>;
    }

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedClinicData(clinicData); // Reset edited data to original data
    };

    const handleSave = async () => {
        try {
            await axios.put(`${UPDATE_CLINIC_INFO}1`, editedClinicData);
            setClinicData(editedClinicData); // Update original data with edited data
            setEditMode(false);
        } catch (error) {
            console.error('Error updating clinic data:', error);
        }
    };

    const handleFormValuesChange = (updatedFormValues) => {
        setEditedClinicData(updatedFormValues);
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Clinic Information</Typography>
            </Stack>

            <ClinicDetails
                clinic={editedClinicData}
                isEditable={isEditable}
                onFormValuesChange={handleFormValuesChange}
            />

            <Box mt={2}>
                {' '}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    mb={5}
                >
                    {isEditable ? (
                        <>
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button variant="outlined" onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                </Stack>
            </Box>
        </Container>
    );
};

export default ClinicPage;
