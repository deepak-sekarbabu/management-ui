import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Card,
    Alert,
    Stack,
    Button,
    Divider,
    Snackbar,
    Container,
    CardHeader,
    Typography,
    CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

import ClinicDetails from './clinic-details';

const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

const ClinicPage = () => {
    const [clinics, setClinics] = useState([]);
    const [isEditable, setEditMode] = useState(false);
    const [editedClinicData, setEditedClinicData] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { user } = useAuth();
    const [errorOpen, setErrorOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loadError, setLoadError] = useState(null);

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

    const fetchData = useCallback(async (clinicId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${GET_CLINIC_INFO}${clinicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            return await response.json();
        } catch (fetchError) {
            console.error('Error fetching clinic data:', fetchError);
            throw fetchError;
        }
    }, []);

    const loadData = useCallback(async () => {
        if (!user?.clinicIds?.length) {
            console.error('No clinic IDs found for user');
            setLoadError('No clinic assigned to this user');
            setLoading(false);
            return;
        }

        try {
            const clinicPromises = user.clinicIds.map((clinicId) => fetchData(clinicId));
            const clinicData = await Promise.all(clinicPromises);
            setClinics(clinicData);
            setLoadError(null);
        } catch (error) {
            console.error('Error loading clinic data:', error);
            setLoadError('Failed to load clinic information');
        } finally {
            setLoading(false);
        }
    }, [fetchData, user?.clinicIds]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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

    if (loadError) {
        return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2">Clinic Information</Typography>
                </Stack>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {loadError}
                </Alert>
            </Container>
        );
    }

    const handleEdit = (clinic) => {
        setEditedClinicData(clinic);
        setEditMode(true);
    };

    const handleCancel = async () => {
        if (hasUnsavedChanges) {
            window.location.reload();
        } else {
            try {
                const response = await axios.get(`${GET_CLINIC_INFO}${editedClinicData.clinicId}`);
                setEditedClinicData(response.data);
                setEditMode(false);
                setHasUnsavedChanges(false);
            } catch (fetchError) {
                console.error('Error fetching clinic data:', fetchError);
            }
        }
    };

    const handleSave = async () => {
        try {
            if (!editedClinicData.clinicId) {
                throw new Error('No clinic ID found');
            }
            await axios.put(`${UPDATE_CLINIC_INFO}${editedClinicData.clinicId}`, editedClinicData);
            setClinics(
                clinics.map((clinic) =>
                    clinic.clinicId === editedClinicData.clinicId ? editedClinicData : clinic
                )
            );
            setEditMode(false);
            setHasUnsavedChanges(false);
            showSuccess('Clinic information saved successfully!');
        } catch (saveError) {
            console.error('Error updating clinic data:', saveError);
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
                    {clinics.map((clinic) => (
                        <Box key={clinic.clinicId} mb={4}>
                            <Stack spacing={2}>
                                <Typography variant="h5">{clinic.clinicName}</Typography>
                                <Typography color="textSecondary">
                                    {clinic.clinicAddress}
                                </Typography>
                                <Typography color="textSecondary">
                                    Pin Code: {clinic.clinicPinCode}
                                </Typography>
                                <Typography color="textSecondary">
                                    Email: {clinic.clinicEmail}
                                </Typography>
                                <Typography color="textSecondary">
                                    Website: {clinic.clinicWebsite}
                                </Typography>
                                <Typography color="textSecondary">
                                    Timings: {clinic.clinicTimings}
                                </Typography>
                                <Typography color="textSecondary">
                                    Amenities: {clinic.clinicAmenities}
                                </Typography>
                                <Typography color="textSecondary">
                                    Phone Numbers:{' '}
                                    {clinic.clinicPhoneNumbers.map((p) => p.phoneNumber).join(', ')}
                                </Typography>
                            </Stack>
                            <Box mt={3} display="flex" justifyContent="center">
                                <Button variant="outlined" onClick={() => handleEdit(clinic)}>
                                    Edit
                                </Button>
                            </Box>
                        </Box>
                    ))}
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
