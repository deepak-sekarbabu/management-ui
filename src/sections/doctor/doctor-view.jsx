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
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    const handleCloseError = () => {
        setErrorOpen(false);
    };

    const handleCloseSuccess = () => {
        setSuccessOpen(false);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setErrorOpen(true);
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setSuccessOpen(true);
    };

    // Fetch data from the specified URL
    const fetchData = useCallback(async (clinicId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`/api/clinic/doctorinformation/${clinicId}`, {
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
            console.error('Error fetching doctor data:', fetchError);
            throw fetchError;
        }
    }, []);

    const loadData = useCallback(async () => {
        if (!user?.clinicIds?.length) {
            console.error('No clinic IDs found for user');
            setError('No clinic assigned to this user');
            setLoading(false);
            return;
        }

        try {
            const clinicId = user.clinicIds[0];
            const data = await fetchData(clinicId);
            setDoctors(data);
            setError(null);
        } catch (loadError) {
            console.error('Error loading doctor data:', loadError);
            setError('Failed to load doctor information');
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
                <Stack
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                >
                    <Typography variant="h2" gutterBottom>
                        Doctor Information
                    </Typography>
                    {error ? (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    ) : (
                        <CircularProgress
                            size={60}
                            sx={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    )}
                </Stack>
            </Container>
        );
    }

    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: uuidv4(),
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
            gender: 'Male',
            doctorEmail: '',
        };
        setNewDoctor(newDoctorEntry);
    };

    const handleRemove = async (clinicId, doctorId) => {
        console.log('Removing doctor Data:', clinicId, doctorId);
        try {
            // Remove new doctor (UUID)
            if (typeof doctorId === 'string' && doctorId.includes('-')) {
                setNewDoctor(null);
                setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
                showSuccess('Doctor removed successfully');
                return;
            }
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
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorDetail = errorData.message;
                    }
                } catch (parseError) {
                    // If response is not valid JSON, use status text
                    errorDetail = response.statusText || errorDetail;
                }

                // Handle specific error codes
                if (response.status === 409) {
                    errorDetail = 'Cannot delete doctor: Doctor has existing appointments';
                }

                throw new Error(errorDetail);
            }

            console.log('Doctor removed successfully');
            setNewDoctor(null);
            setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
            showSuccess('Doctor removed successfully');
        } catch (removeError) {
            console.error('Error removing doctor:', removeError);
            showError(`Error removing doctor: ${removeError.message}`);
        }
    };

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

            const doctorData = {
                ...newDoctorData,
                qualifications: Array.isArray(newDoctorData.qualifications)
                    ? newDoctorData.qualifications
                    : [],
                languagesSpoken: Array.isArray(newDoctorData.languagesSpoken)
                    ? newDoctorData.languagesSpoken
                    : [],
                clinicId: user?.clinicIds?.[0],
                phoneNumbers: Array.isArray(newDoctorData.phoneNumbers)
                    ? newDoctorData.phoneNumbers.map((phone) => ({
                          phoneNumber: typeof phone === 'string' ? phone : phone.phoneNumber,
                      }))
                    : [],
            };

            let response;
            const isNewDoctor =
                typeof newDoctorData.id === 'string' && newDoctorData.id.includes('-');

            if (isNewDoctor) {
                // New doctor (UUID)
                // eslint-disable-next-line no-unused-vars
                const { id: _id, ...dataWithoutId } = doctorData;
                console.log('Adding new Doctor', dataWithoutId);

                response = await fetch('api/doctor', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(dataWithoutId),
                });
            } else {
                // Existing doctor
                console.log('Updating existing Doctor:', doctorData);
                response = await fetch(`api/doctor/${doctorData.clinicId}/${doctorData.doctorId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(doctorData),
                });
            }
            if (!response.ok) {
                let errorDetail = `HTTP error status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.message) {
                        errorDetail = errorData.message;
                    }
                } catch (parseError) {
                    // If response is not valid JSON, use status text
                    errorDetail = response.statusText || errorDetail;
                }

                // Handle specific error status codes
                if (response.status === 409) {
                    if (isNewDoctor) {
                        errorDetail = 'Doctor with this ID already exists';
                    } else {
                        errorDetail = 'Conflict updating doctor information';
                    }
                } else if (response.status === 400) {
                    errorDetail = 'Invalid doctor information. Please check all required fields.';
                } else if (response.status === 404) {
                    errorDetail = 'Doctor or clinic not found';
                }

                throw new Error(errorDetail);
            }

            console.log('Doctor saved successfully');
            await loadData();
            setNewDoctor(null);
            showSuccess(isNewDoctor ? 'Doctor added successfully' : 'Doctor updated successfully');
        } catch (saveError) {
            console.error('Error saving doctor:', saveError);
            showError(`Error: ${saveError.message}`);
        }
    };

    return (
        <Card>
            <Box p={2}>
                <Typography variant="h2">Doctor Information</Typography>
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onRemove={() => handleRemove(user?.clinicIds?.[0], doctor.doctorId)}
                        onSave={saveNewDoctor}
                        clinicId={user?.clinicIds?.[0]}
                    />
                ))}
                {newDoctor && (
                    <DoctorCard
                        key={`new-${doctors.length}`}
                        doctor={newDoctor}
                        isNewDoctor
                        onSave={saveNewDoctor}
                        onRemove={() => handleRemove(user?.clinicIds?.[0], newDoctor.doctorId)}
                        clinicId={user?.clinicIds?.[0]}
                    />
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={addNewDoctor}>
                        Add Doctor
                    </Button>
                </Box>
            </Box>
            {/* Error Snackbar */}{' '}
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
            {/* Success Snackbar */}{' '}
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

export default DoctorPage;
