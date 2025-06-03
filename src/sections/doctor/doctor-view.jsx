import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, Card, Stack, Button, Container, Typography, CircularProgress } from '@mui/material';

import { useAuth } from 'src/components/AuthProvider';

import DoctorCard from './DoctorCard';

const DoctorPage = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleRemove = async (doctorId) => {
        console.log('Removing doctor Data:', doctorId);
        try {
            if (typeof doctorId === 'string' && doctorId.includes('-')) {
                setNewDoctor(null);
                setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
            }
            const token = localStorage.getItem('token');
            const response = await fetch(`api/doctor/${doctorId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            console.log('Doctor removed successfully');
            setNewDoctor(null);
            setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
        } catch (removeError) {
            console.error('Error removing doctor:', removeError);
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

            // Ensure qualifications is an array and handle null/undefined cases
            const doctorData = {
                ...newDoctorData,
                qualifications: Array.isArray(newDoctorData.qualifications)
                    ? newDoctorData.qualifications
                    : [],
                clinicId: user?.clinicIds?.[0] || 1, // Add clinicId from user's token or default to 1
                phoneNumbers: Array.isArray(newDoctorData.phoneNumbers)
                    ? newDoctorData.phoneNumbers.map((phone) => ({
                          phoneNumber: typeof phone === 'string' ? phone : phone.phoneNumber,
                      }))
                    : [],
            };

            let response;
            if (typeof newDoctorData.id === 'string' && newDoctorData.id.includes('-')) {
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
                throw new Error(`HTTP error status: ${response.status}`);
            }
            console.log('Doctor saved successfully');
            await loadData();
            setNewDoctor(null);
        } catch (saveError) {
            console.error('Error saving doctor:', saveError);
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
                        onRemove={() => handleRemove(doctor.id)}
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
                        onRemove={handleRemove}
                        clinicId={user?.clinicIds?.[0]}
                    />
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={addNewDoctor}>
                        Add Doctor
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default DoctorPage;
