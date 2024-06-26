import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Box, Card, Stack, Button, Container, Typography, CircularProgress } from '@mui/material';

import ClinicDetails from './clinic-details';

const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

const ClinicPage = () => {
    const [clinicData, setClinicData] = useState(null);
    const [isEditable, setEditMode] = useState(false);
    const [editedClinicData, setEditedClinicData] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const response = await axios.get(`${GET_CLINIC_INFO}1`);
                setClinicData(response.data);
                setEditedClinicData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching clinic data:', error);
            }
        };

        fetchClinicData();
    }, []);

    if (isLoading) {
        return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2">Clinic Information</Typography>
                </Stack>
                <CircularProgress
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            </Container>
        );
    }

    const handleEdit = () => setEditMode(true);
    const handleCancel = async () => {
        if (hasUnsavedChanges) {
            window.location.reload();
        } else {
            try {
                const response = await axios.get(`${GET_CLINIC_INFO}1`);
                setEditedClinicData(response.data);
                setEditMode(false);
                setHasUnsavedChanges(false);
            } catch (error) {
                console.error('Error fetching clinic data:', error);
            }
        }
    };

    const handleSave = async () => {
        console.log(editedClinicData);
        try {
            await axios.put(`${UPDATE_CLINIC_INFO}1`, editedClinicData);
            setClinicData(editedClinicData);
            setEditMode(false);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error updating clinic data:', error);
        }
    };

    const handleFormValuesChange = (updatedFormValues) => {
        setEditedClinicData(updatedFormValues);
        setHasUnsavedChanges(true);
    };

    return (
        <Card>
            <Typography p={2} variant="h2">
                Clinic Information
            </Typography>
            <ClinicDetails
                clinic={clinicData}
                isEditable={isEditable}
                onFormValuesChange={handleFormValuesChange}
            />
            <Box mt={2}>
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
        </Card>
    );
};

export default ClinicPage;
