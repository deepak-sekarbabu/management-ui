import axios from 'axios';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    Alert,
    Stack,
    Avatar,
    Button,
    Divider,
    Snackbar,
    Container,
    IconButton,
    Typography,
    CardContent,
    CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useAuth } from 'src/components/AuthProvider';

import ClinicDetails from './clinic-details';

// API endpoints
const GET_CLINIC_INFO = '/api/clinic/';
const UPDATE_CLINIC_INFO = '/api/clinic/';

// Styled components with improved responsive design
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledCard = styled(Card)(({ theme: muiTheme }) => ({
    animation: `${fadeIn} 0.5s ease-out`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: muiTheme.shadows[8],
    },
    [muiTheme.breakpoints.down('sm')]: {
        margin: muiTheme.spacing(1),
    },
    [muiTheme.breakpoints.up('sm')]: {
        margin: muiTheme.spacing(2),
    },
}));

const ClinicContainer = styled(Box)(({ theme: muiTheme }) => ({
    padding: muiTheme.spacing(3),
    [muiTheme.breakpoints.down('sm')]: {
        padding: muiTheme.spacing(2),
    },
}));

const ClinicHeader = styled(Stack)(({ theme: muiTheme }) => ({
    marginBottom: muiTheme.spacing(4),
    [muiTheme.breakpoints.down('sm')]: {
        marginBottom: muiTheme.spacing(2),
    },
}));

const ActionButton = styled(Button)(({ theme: muiTheme }) => ({
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: muiTheme.shadows[4],
    },
    // Improved focus styles for accessibility
    '&:focus-visible': {
        outline: `2px solid ${muiTheme.palette.primary.main}`,
        outlineOffset: '2px',
    },
}));

/**
 * ClinicPage Component
 * Displays and manages clinic information with edit capabilities
 * Features:
 * - Responsive design for all screen sizes
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 * - Error handling and loading states
 * - Form validation
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

    // API call functions with improved error handling
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
            throw new Error(`Failed to fetch clinic data: ${fetchError.message}`);
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
            setLoadError(error.message || 'Failed to load clinic information');
        } finally {
            setLoading(false);
        }
    }, [fetchData, user?.clinicIds]);

    // Edit handlers with improved error handling
    const handleEdit = useCallback((clinic) => {
        setEditedClinicData(clinic);
        setEditMode(true);
    }, []);

    const handleCancel = useCallback(async () => {
        if (hasUnsavedChanges) {
            // Show confirmation dialog before reloading
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                window.location.reload();
            }
            return;
        }

        try {
            const response = await axios.get(`${GET_CLINIC_INFO}${editedClinicData.clinicId}`);
            setEditedClinicData(response.data);
            setEditMode(false);
            setHasUnsavedChanges(false);
        } catch (fetchError) {
            console.error('Error fetching clinic data:', fetchError);
            showError('Failed to refresh clinic data');
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
            showError(saveError.response?.data?.message || 'Failed to save clinic information.');
        }
    }, [editedClinicData, clinics, showSuccess, showError]);

    const handleFormValuesChange = useCallback((updatedFormValues) => {
        setEditedClinicData(updatedFormValues);
        setHasUnsavedChanges(true);
    }, []);

    // Memoized clinic list for better performance
    const clinicList = useMemo(
        () => (
            <ClinicContainer>
                {clinics.map((clinic) => (
                    <Card
                        key={clinic.clinicId}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: 'box-shadow 0.3s',
                            '&:hover': { boxShadow: 8 },
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ cursor: 'pointer', p: 2 }}
                            onClick={() => handleExpandClick(clinic.clinicId)}
                            aria-expanded={expandedClinic === clinic.clinicId}
                            aria-controls={`clinic-details-${clinic.clinicId}`}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleExpandClick(clinic.clinicId);
                                }
                            }}
                        >
                            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                                {clinic.clinicName?.[0] || 'C'}
                            </Avatar>
                            <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                                {clinic.clinicName}
                            </Typography>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpandClick(clinic.clinicId);
                                }}
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
                                    transition: 'transform 0.3s ease-in-out',
                                }}
                            >
                                <Iconify icon="eva:arrow-down-fill" />
                            </IconButton>
                        </Box>
                        {expandedClinic === clinic.clinicId && (
                            <CardContent sx={{ pt: 0 }}>
                                <Stack spacing={2} sx={{ mt: 1, mb: 2, ml: 1 }}>
                                    <Typography color="textSecondary">
                                        🏥 {clinic.clinicAddress}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        🏷️ Pin Code: {clinic.clinicPinCode}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        📧 Email: {clinic.clinicEmail}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        🌐 Website: {clinic.clinicWebsite}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        🕒 Timings: {clinic.clinicTimings}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        🛋️ Amenities: {clinic.clinicAmenities}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        ☎️ Phone Numbers:{' '}
                                        {clinic.clinicPhoneNumbers
                                            .map((p) => p.phoneNumber)
                                            .join(', ')}
                                    </Typography>
                                </Stack>
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <ActionButton
                                        variant="outlined"
                                        onClick={() => handleEdit(clinic)}
                                        aria-label={`Edit ${clinic.clinicName} information`}
                                    >
                                        Edit
                                    </ActionButton>
                                </Box>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </ClinicContainer>
        ),
        [clinics, expandedClinic, handleExpandClick, handleEdit]
    );

    // Load data on component mount
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Loading state with improved accessibility
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

    // Error state with improved accessibility
    if (loadError) {
        return (
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h2" component="h1">
                        Clinic Information
                    </Typography>
                </Stack>
                <Alert
                    severity="error"
                    sx={{ mt: 2 }}
                    role="alert"
                    aria-live="assertive"
                    action={
                        <Button color="inherit" size="small" onClick={loadData}>
                            Retry
                        </Button>
                    }
                >
                    {loadError}
                </Alert>
            </Container>
        );
    }

    return (
        <StyledCard>
            <ClinicHeader direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ pl: 3, pt: 2, color: 'primary.main', fontWeight: 'bold' }}
                >
                    Clinic Information
                </Typography>
            </ClinicHeader>
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
                            <ActionButton
                                variant="contained"
                                onClick={handleSave}
                                aria-label="Save clinic information"
                                disabled={!hasUnsavedChanges}
                            >
                                Save
                            </ActionButton>
                            <ActionButton
                                variant="outlined"
                                onClick={handleCancel}
                                aria-label="Cancel editing"
                            >
                                Cancel
                            </ActionButton>
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
                sx={{ zIndex: (muiTheme) => muiTheme.zIndex.modal + 100, marginTop: '64px' }}
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
                sx={{ zIndex: (muiTheme) => muiTheme.zIndex.modal + 100, marginTop: '64px' }}
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
        </StyledCard>
    );
};

export default ClinicPage;
