import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
    Box,
    Card,
    Stack,
    Button,
    Divider,
    Container,
    Typography,
    CardHeader,
    CircularProgress,
} from '@mui/material';

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
            <CardHeader title="Clinic Information" sx={{ pb: 0 }} />
            <Divider />
            {isEditable ? (
                <>
                    <ClinicDetails
                        clinic={editedClinicData}
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
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="outlined" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </>
            ) : (
                <Box p={3}>
                    <Stack spacing={2}>
                        <Typography variant="h5">{clinicData.clinicName}</Typography>
                        <Typography color="textSecondary">{clinicData.clinicAddress}</Typography>
                        <Typography color="textSecondary">
                            Pin Code: {clinicData.clinicPinCode}
                        </Typography>
                        <Typography color="textSecondary">
                            Email: {clinicData.clinicEmail}
                        </Typography>
                        <Typography color="textSecondary">
                            Website: {clinicData.clinicWebsite}
                        </Typography>
                        <Typography color="textSecondary">
                            Timings: {clinicData.clinicTimings}
                        </Typography>
                        <Typography color="textSecondary">
                            Amenities: {clinicData.clinicAmenities}
                        </Typography>
                        <Typography color="textSecondary">
                            Phone Numbers:{' '}
                            {clinicData.clinicPhoneNumbers.map((p) => p.phoneNumber).join(', ')}
                        </Typography>
                    </Stack>
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button variant="outlined" onClick={handleEdit}>
                            Edit
                        </Button>
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default ClinicPage;
