import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
    Box,
    Card,
    Stack,
    Alert,
    Button,
    Divider,
    Snackbar,
    Container,
    Typography,
    CardHeader,
    CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

import ClinicDetails from './clinic-details';

const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

const ClinicPage = () => {
    const [clinicData, setClinicData] = useState(null);
    const [isEditable, setEditMode] = useState(false);
    const [editedClinicData, setEditedClinicData] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { user } = useAuth();
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCloseError = () => setErrorOpen(false);
    const handleCloseSuccess = () => setSuccessOpen(false);

    const showError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setSuccessOpen(true);
    };

    useEffect(() => {
        const fetchClinicData = async () => {
            if (!user?.clinicIds?.length) {
                console.error('No clinic IDs found for user');
                setLoading(false);
                return;
            }

            try {
                // Use the first clinic ID from the user's clinicIds array
                const clinicId = user.clinicIds[0];
                const response = await axios.get(`${GET_CLINIC_INFO}${clinicId}`);
                setClinicData(response.data);
                setEditedClinicData(response.data);
            } catch (error) {
                console.error('Error fetching clinic data:', error);
                showError('Failed to fetch clinic data.');
            } finally {
                setLoading(false);
            }
        };

        fetchClinicData();
    }, [user]);

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
            if (!user?.clinicIds?.length) {
                throw new Error('No clinic IDs found for user');
            }
            const clinicId = user.clinicIds[0];
            await axios.put(`${UPDATE_CLINIC_INFO}${clinicId}`, editedClinicData);
            setClinicData(editedClinicData);
            setEditMode(false);
            setHasUnsavedChanges(false);
            showSuccess('Clinic information saved successfully!');
        } catch (error) {
            console.error('Error updating clinic data:', error);
            showError('Failed to save clinic information.');
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
            <Snackbar
                open={errorOpen}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ zIndex: (theme) => theme.zIndex.modal + 100, marginTop: '64px' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14)',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                        },
                    }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ zIndex: (theme) => theme.zIndex.modal + 100, marginTop: '64px' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14)',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                        },
                    }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default ClinicPage;
