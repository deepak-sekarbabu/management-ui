import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Card,
    Stack,
    Alert,
    Button,
    Snackbar,
    Container,
    Typography,
    CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

import DoctorCard from './DoctorCard';

const DoctorPage = () => {
    const { user } = useAuth(); // Access user data from AuthProvider, including clinic IDs

    // State variables
    const [doctors, setDoctors] = useState([]); // Stores the list of doctors
    const [newDoctor, setNewDoctor] = useState(null); // Holds the data for a new doctor being added
    const [isLoading, setLoading] = useState(true); // Tracks the loading state of data
    const [error, setError] = useState(null); // Stores general error messages for the page (e.g., "Failed to load")
    const [errorMessage, setErrorMessage] = useState(''); // Specific error message for the Snackbar
    const [errorOpen, setErrorOpen] = useState(false); // Controls the visibility of the error Snackbar
    const [successMessage, setSuccessMessage] = useState(''); // Specific success message for the Snackbar
    const [successOpen, setSuccessOpen] = useState(false); // Controls the visibility of the success Snackbar

    // Closes the error Snackbar
    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    // Closes the success Snackbar
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    // Displays an error message in the Snackbar
    const showError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    // Displays a success message in the Snackbar
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setSuccessOpen(true);
    };

    // Fetches doctor data from the API for a given clinic ID
    const fetchData = useCallback(async (clinicId) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve auth token
            if (!token) {
                throw new Error('No authentication token found');
            }

            // API call to fetch doctor information
            const response = await fetch(`/api/clinic/doctorinformation/${clinicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include auth token in headers
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP error status: ${response.status}`);
            }
            return await response.json(); // Parse and return JSON data
        } catch (fetchError) {
            console.error('Error fetching doctor data:', fetchError);
            throw fetchError; // Re-throw error to be caught by calling function
        }
    }, []);

    // Loads doctor data when the component mounts or user/clinic info changes
    const loadData = useCallback(async () => {
        // Ensure user and clinic IDs are available
        if (!user?.clinicIds?.length) {
            console.error('No clinic IDs found for user');
            setError('No clinic assigned to this user'); // Set page-level error
            setLoading(false);
            return;
        }

        try {
            setLoading(true); // Set loading state
            const clinicId = user.clinicIds[0]; // Use the first clinic ID
            const data = await fetchData(clinicId); // Fetch data
            setDoctors(data); // Update doctors state
            setError(null); // Clear any previous page-level errors
        } catch (loadError) {
            console.error('Error loading doctor data:', loadError);
            setError('Failed to load doctor information'); // Set page-level error
        } finally {
            setLoading(false); // Reset loading state
        }
    }, [fetchData, user?.clinicIds]); // Dependencies for useCallback

    // useEffect hook to load data on component mount and when loadData changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Conditional rendering for loading state
    if (isLoading) {
        return (
            // Container to center content and provide max width
            <Container maxWidth="md">
                {/* Stack for centering loading indicator and error message */}
                <Stack
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="80vh" // Use minHeight for better responsiveness than fixed height
                >
                    {/* Page Title */}
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{ textAlign: 'center' }}
                    >
                        Doctor Information
                    </Typography>
                    {/* Conditional rendering for error message during loading */}
                    {error ? (
                        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    ) : (
                        // Loading spinner
                        <CircularProgress
                            size={60}
                            // Ensure CircularProgress is centered within the Stack, not fixed to viewport initially
                            // Fixed positioning can be problematic if the Stack itself is not full height.
                            // The Stack's alignment properties should handle centering.
                            sx={{ mt: 3 }}
                        />
                    )}
                </Stack>
            </Container>
        );
    }

    // Adds a new, empty doctor object to the state to be filled out in a form
    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: uuidv4(), // Generate a unique ID for the new doctor (client-side)
            doctorName: '',
            doctorId: '',
            clinicId: user?.clinicIds?.[0],
            doctorSpeciality: '',
            doctorExperience: 0,
            doctorConsultationFee: 0,
            doctorConsultationFeeOther: 0,
            phoneNumbers: [{ phoneNumber: '' }],
            doctorAvailability: [
                {
                    availableDays: '',
                    shiftTime: '',
                    shiftStartTime: '',
                    shiftEndTime: '',
                    consultationTime: 0,
                    configType: 'APPOINTMENT',
                },
            ],
            languagesSpoken: [],
            qualifications: [],
            gender: 'Male', // Default gender
            doctorEmail: '',
        };
        setNewDoctor(newDoctorEntry); // Update state to show the new doctor form/card
    };

    // Handles the removal of a doctor
    const handleRemove = async (clinicId, doctorId) => {
        console.log('Attempting to remove doctor. Clinic ID:', clinicId, 'Doctor ID:', doctorId);
        try {
            // If doctorId is a UUID (string with hyphens), it's a new, unsaved doctor
            if (typeof doctorId === 'string' && doctorId.includes('-')) {
                setNewDoctor(null); // Clear the new doctor form
                // Filter out the doctor from the local state (if it was somehow added)
                setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
                showSuccess('New doctor form discarded.'); // Show success message
                return;
            }

            // Proceed with API call for existing doctor
            const token = localStorage.getItem('token');
            const response = await fetch(`api/doctor/${clinicId}/${doctorId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                let errorDetail = `HTTP error status: ${response.status}`;
                try {
                    // Attempt to parse error message from response body
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorDetail = errorData.message;
                    }
                } catch (parseError) {
                    // If response is not valid JSON, use status text or default error
                    errorDetail = response.statusText || errorDetail;
                }

                // Handle specific error codes, like conflict (409)
                if (response.status === 409) {
                    errorDetail = 'Cannot delete doctor: Doctor has existing appointments.';
                }
                throw new Error(errorDetail); // Throw error to be caught by catch block
            }

            console.log('Doctor removed successfully via API');
            setNewDoctor(null); // Ensure no new doctor form is active
            // Update local state to reflect removal
            setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
            showSuccess('Doctor removed successfully.'); // Show success message
        } catch (removeError) {
            console.error('Error removing doctor:', removeError);
            showError(`Error removing doctor: ${removeError.message}`); // Show error in Snackbar
        }
    };

    // Saves a new or existing doctor's information
    const saveNewDoctor = async (newDoctorData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            // Prepare doctor data, ensuring arrays are correctly formatted
            const doctorData = {
                ...newDoctorData,
                qualifications: Array.isArray(newDoctorData.qualifications)
                    ? newDoctorData.qualifications
                    : [],
                languagesSpoken: Array.isArray(newDoctorData.languagesSpoken)
                    ? newDoctorData.languagesSpoken
                    : [],
                clinicId: user?.clinicIds?.[0], // Assign clinic ID from user context
                phoneNumbers: Array.isArray(newDoctorData.phoneNumbers)
                    ? newDoctorData.phoneNumbers.map((phone) => ({
                          // Ensure phone numbers are in the correct object format
                          phoneNumber: typeof phone === 'string' ? phone : phone.phoneNumber,
                      }))
                    : [],
            };

            let response;
            // Check if it's a new doctor by looking for a UUID in the 'id' field
            // Note: 'doctorId' is the persistent ID from the backend, 'id' might be a temporary client-side ID.
            // This logic assumes 'id' contains the UUID for new doctors.
            const isNewDoctorOperation =
                typeof newDoctorData.id === 'string' && newDoctorData.id.includes('-');

            if (isNewDoctorOperation) {
                // For a new doctor, remove the temporary 'id' field before sending to backend
                // eslint-disable-next-line no-unused-vars
                const { id: _tempId, ...dataWithoutTempId } = doctorData;
                console.log('Adding new Doctor. Data:', dataWithoutTempId);

                // POST request to create a new doctor
                response = await fetch('api/doctor', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(dataWithoutTempId),
                });
            } else {
                // For an existing doctor, use PUT request to update
                console.log('Updating existing Doctor. Data:', doctorData);
                response = await fetch(`api/doctor/${doctorData.clinicId}/${doctorData.doctorId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(doctorData),
                });
            }

            if (!response.ok) {
                let errorDetail = `HTTP error status: ${response.status}`;
                try {
                    const errorData = await response.json(); // Try to parse error from response
                    if (errorData.message) {
                        errorDetail = errorData.message;
                    }
                } catch (parseError) {
                    errorDetail = response.statusText || errorDetail;
                }

                // Handle specific error status codes with more user-friendly messages
                if (response.status === 409) {
                    // Conflict
                    errorDetail = isNewDoctorOperation
                        ? 'Doctor with this ID or conflicting information already exists.'
                        : 'Conflict updating doctor information. Please check details.';
                } else if (response.status === 400) {
                    // Bad Request
                    errorDetail = 'Invalid doctor information. Please check all required fields.';
                } else if (response.status === 404) {
                    // Not Found
                    errorDetail = 'Doctor or clinic not found. Please refresh and try again.';
                }
                throw new Error(errorDetail); // Throw error
            }

            console.log('Doctor saved successfully');
            await loadData(); // Reload all doctor data to reflect changes
            setNewDoctor(null); // Clear the new doctor form
            showSuccess(
                isNewDoctorOperation ? 'Doctor added successfully' : 'Doctor updated successfully'
            );
        } catch (saveError) {
            console.error('Error saving doctor:', saveError);
            showError(`Error: ${saveError.message}`); // Show error in Snackbar
        }
    };

    // Main render logic for the page
    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            {' '}
            {/* Added some subtle styling to the main card */}
            <Box p={{ xs: 1, sm: 2 }}>
                {' '}
                {/* Responsive padding */}
                {/* Page Title */}
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                    Doctor Information
                </Typography>
                {/* Render existing doctors */}
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id} // Unique key for React list rendering
                        doctor={doctor}
                        onRemove={() => handleRemove(user?.clinicIds?.[0], doctor.doctorId)}
                        onSave={saveNewDoctor}
                        clinicId={user?.clinicIds?.[0]}
                    />
                ))}
                {/* Render the form for a new doctor if newDoctor state is not null */}
                {newDoctor && (
                    <DoctorCard
                        key={`new-${doctors.length}`} // Unique key for new doctor card
                        doctor={newDoctor}
                        isNewDoctor // Prop to indicate this is a new doctor card
                        onSave={saveNewDoctor}
                        onRemove={() => handleRemove(user?.clinicIds?.[0], newDoctor.id)} // Use newDoctor.id for removal of unsaved new doctor
                        clinicId={user?.clinicIds?.[0]}
                    />
                )}
                {/* Container for the "Add Doctor" button with responsive alignment */}
                <Box
                    mt={2}
                    display="flex"
                    justifyContent={{ xs: 'center', sm: 'flex-end' }} // Center on extra-small, flex-end on small and up
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addNewDoctor}
                        // MUI Buttons are focusable and support keyboard activation (Enter/Space) by default
                        aria-label="Add New Doctor" // Good for accessibility
                        sx={{ minWidth: { xs: '80%', sm: 'auto' } }} // Full width on xs, auto on sm+
                    >
                        Add Doctor
                    </Button>
                </Box>
            </Box>
            {/* Error Snackbar for displaying error messages */}
            {/* MUI Snackbars are generally accessible:
                - They don't trap focus.
                - onClose is triggered by Escape key by default.
                - Auto-hide is managed by autoHideDuration.
            */}
            <Snackbar
                open={errorOpen}
                autoHideDuration={6000} // Auto hides after 6 seconds
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                // The marginTop: '64px' might be to avoid a fixed header/appbar.
                // If there's no fixed header, this might not be necessary or could be reduced.
                // Keeping it for now as its purpose is unclear without full app context.
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 100,
                    marginTop: { xs: '0px', sm: '64px' }, // Adjust margin for smaller screens if needed
                    bottom: { xs: 20, sm: 'auto' }, // Ensure it's not too high on mobile
                }}
            >
                <Alert
                    onClose={handleCloseError} // Allows manual closing
                    severity="error"
                    variant="filled"
                    sx={{
                        width: '100%', // Full width of the Snackbar
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
            {/* Success Snackbar for displaying success messages */}
            <Snackbar
                open={successOpen}
                autoHideDuration={4000} // Auto hides after 4 seconds
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                // Same comment about marginTop as for the error Snackbar.
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 100,
                    marginTop: { xs: '0px', sm: '64px' }, // Adjust margin for smaller screens if needed
                    bottom: { xs: 20, sm: 'auto' }, // Ensure it's not too high on mobile
                }}
            >
                <Alert
                    onClose={handleCloseSuccess} // Allows manual closing
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%', // Full width of the Snackbar
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

export default DoctorPage;
