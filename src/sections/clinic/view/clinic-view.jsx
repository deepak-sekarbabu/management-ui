import axios from 'axios';
import { useMemo, useState, useEffect, useCallback } from 'react';

import {
    Box,
    Card,
    Alert,
    Stack,
    Button,
    Divider,
    Collapse,
    Snackbar,
    Container,
    IconButton,
    Typography,
    CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useAuth } from 'src/components/AuthProvider';

import ClinicDetails from './clinic-details';

// API endpoints
const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

/**
 * ClinicPage Component
 * Displays and manages clinic information with edit capabilities
 */
const ClinicPage = () => {
    // State management
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
    const [expandedClinic, setExpandedClinic] = useState(null);

    // Memoized handlers for better performance
    const handleCloseError = useCallback(() => setErrorOpen(false), []);
    const handleCloseSuccess = useCallback(() => setSuccessOpen(false), []);

    const showError = useCallback((message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    }, []);

    const showSuccess = useCallback((message) => {
        setSuccessMessage(message);
        setSuccessOpen(true);
    }, []);

    const handleExpandClick = useCallback(
        (clinicId) => {
            setExpandedClinic(expandedClinic === clinicId ? null : clinicId);
        },
        [expandedClinic]
    );

    // API call functions
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

    // Edit handlers
    const handleEdit = useCallback((clinic) => {
        setEditedClinicData(clinic);
        setEditMode(true);
    }, []);

    const handleCancel = useCallback(async () => {
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
                showError('Failed to refresh clinic data');
            }
        }
    }, [hasUnsavedChanges, editedClinicData.clinicId, showError]);

    const handleSave = useCallback(async () => {
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
    }, [editedClinicData, clinics, showSuccess, showError]);

    const handleFormValuesChange = useCallback((updatedFormValues) => {
        setEditedClinicData(updatedFormValues);
        setHasUnsavedChanges(true);
    }, []);

    // Memoized clinic list for better performance
    const clinicList = useMemo(
        () => (
            <Box p={3}>
                {clinics.map((clinic) => (
                    <Box
                        key={clinic.clinicId}
                        mb={4}
                        role="region"
                        aria-label={`Clinic information for ${clinic.clinicName}`}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography
                                variant="h5"
                                component="h2"
                                onClick={() => handleExpandClick(clinic.clinicId)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: 'primary.main',
                                    },
                                }}
                                tabIndex={0}
                                role="button"
                                aria-expanded={expandedClinic === clinic.clinicId}
                                aria-controls={`clinic-details-${clinic.clinicId}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleExpandClick(clinic.clinicId);
                                    }
                                }}
                            >
                                {clinic.clinicName}
                            </Typography>
                            <IconButton
                                onClick={() => handleExpandClick(clinic.clinicId)}
                                aria-label={
                                    expandedClinic === clinic.clinicId
                                        ? 'Collapse clinic details'
                                        : 'Expand clinic details'
                                }
                                sx={{
                                    transform:
                                        expandedClinic === clinic.clinicId
                                            ? 'rotate(180deg)'
                                            : 'rotate(0deg)',
                                    transition: 'transform 0.3s',
                                }}
                            >
                                <Iconify icon="eva:arrow-down-fill" />
                            </IconButton>
                        </Stack>
                        <Collapse
                            in={expandedClinic === clinic.clinicId}
                            id={`clinic-details-${clinic.clinicId}`}
                        >
                            <Stack spacing={2} sx={{ mt: 2 }}>
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
                                <Box mt={3} display="flex" justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleEdit(clinic)}
                                        aria-label={`Edit ${clinic.clinicName} information`}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Stack>
                        </Collapse>
                    </Box>
                ))}
            </Box>
        ),
        [clinics, expandedClinic, handleExpandClick, handleEdit]
    );

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Loading state
    if (isLoading) {
        return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2" component="h1">
                        Clinic Information
                    </Typography>
                </Stack>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                    role="status"
                    aria-label="Loading clinic information"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // Error state
    if (loadError) {
        return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2" component="h1">
                        Clinic Information
                    </Typography>
                </Stack>
                <Alert severity="error" sx={{ mt: 2 }} role="alert" aria-live="assertive">
                    {loadError}
                </Alert>
            </Container>
        );
    }

    return (
        <Card>
            <Typography variant="h2" component="h1" gutterBottom sx={{ px: 3, pt: 3 }}>
                Clinic Information
            </Typography>
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
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                aria-label="Save clinic information"
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                aria-label="Cancel editing"
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </>
            ) : (
                clinicList
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
                    role="alert"
                    aria-live="assertive"
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
                    role="alert"
                    aria-live="polite"
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
